import { createHash, randomBytes } from "node:crypto";
import { getLeadConfig } from "../model/config";
import {
  cleanValue,
  CONSENT_VERSION,
  FORM_SOURCES,
  getClientIp,
  getMoscowDate,
  isRecord,
  maskPhone,
  MAX_BODY_BYTES,
  MAX_FILL_SECONDS,
  MIN_FILL_SECONDS,
} from "./sanitize";
import {
  checkRateLimit,
  claimFingerprint,
  getStorageDirectory,
  markFingerprintSent,
  releaseFingerprint,
  writeLeadLog,
} from "./storage";
import { sendLeadEmail } from "./smtp";

const RATE_LIMITS_BY_IP = [
  [3, 300],
  [10, 3600],
] as const;
const RATE_LIMITS_GLOBAL = [[60, 3600]] as const;

export interface LeadResponse {
  status: number;
  payload: Record<string, unknown>;
  headers?: Record<string, string>;
}

function response(
  status: number,
  payload: Record<string, unknown>,
  headers: Record<string, string> = {},
): LeadResponse {
  return {
    status,
    payload,
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate",
      "X-Content-Type-Options": "nosniff",
      "Referrer-Policy": "no-referrer",
      ...headers,
    },
  };
}

function fail(
  status: number,
  code: string,
  message: string,
  extra: Record<string, unknown> = {},
  headers: Record<string, string> = {},
): LeadResponse {
  return response(
    status,
    { ok: false, error: code, message, ...extra },
    headers,
  );
}

async function readBody(request: Request) {
  const reader = request.body?.getReader();
  if (!reader) return { body: "", tooLarge: false };

  const chunks: Buffer[] = [];
  let totalBytes = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      totalBytes += value.byteLength;
      if (totalBytes > MAX_BODY_BYTES) {
        await reader.cancel();
        return { body: "", tooLarge: true };
      }

      chunks.push(Buffer.from(value));
    }
  } finally {
    reader.releaseLock();
  }

  return {
    body: Buffer.concat(chunks).toString("utf8"),
    tooLarge: false,
  };
}

function hasConsent(value: unknown) {
  return value === true || value === "true" || value === 1 || value === "1";
}

function makeLeadId(now: number) {
  const { leadDate } = getMoscowDate(now);
  return `GK-${leadDate}-${randomBytes(3).toString("hex").toUpperCase()}`;
}

function buildEmailBody(input: {
  leadId: string;
  now: number;
  sourceLabel: string;
  name: string;
  phone: string;
  channel: string;
  service: string;
  address: string;
  comment: string;
  details: string;
  pageUrl: string;
  utm: Record<string, string>;
  ip: string;
  logIp: boolean;
}) {
  const { formatted: moscowTime } = getMoscowDate(input.now);
  const lines = [
    "НОВАЯ ЗАЯВКА С САЙТА",
    "=".repeat(46),
    "",
    `Номер заявки:  ${input.leadId}`,
    `Время (МСК):   ${moscowTime}`,
    `Форма:         ${input.sourceLabel}`,
    "",
    "-".repeat(46),
    "КОНТАКТ",
    "-".repeat(46),
    `Имя:           ${input.name || "— не указано —"}`,
    `Телефон:       ${input.phone}`,
  ];

  if (input.channel) lines.push(`Удобный канал: ${input.channel}`);

  if (input.service || input.address) {
    lines.push("", "-".repeat(46), "ДЕТАЛИ ЗАЯВКИ", "-".repeat(46));
    if (input.service) lines.push(`Услуга:        ${input.service}`);
    if (input.address) lines.push(`Адрес:         ${input.address}`);
  }

  if (input.comment) {
    lines.push(
      "",
      "-".repeat(46),
      "КОММЕНТАРИЙ",
      "-".repeat(46),
      input.comment,
    );
  }

  if (input.details) {
    lines.push(
      "",
      "-".repeat(46),
      "ПАРАМЕТРЫ РАСЧЁТА",
      "-".repeat(46),
      input.details,
    );
  }

  lines.push("", "-".repeat(46), "ИСТОЧНИК", "-".repeat(46));
  lines.push(`Страница:      ${input.pageUrl || "— не передана —"}`);

  if (Object.keys(input.utm).length > 0) {
    Object.entries(input.utm).forEach(([key, value]) => {
      lines.push(`${`${key}:`.padEnd(15)}${value}`);
    });
  } else {
    lines.push("UTM-метки:     нет");
  }

  lines.push(
    "",
    "-".repeat(46),
    "СОГЛАСИЕ НА ОБРАБОТКУ ПЕРСОНАЛЬНЫХ ДАННЫХ",
    "-".repeat(46),
    "Отметка:       проставлена посетителем",
    `Версия текста: ${CONSENT_VERSION}`,
    `Дата и время:  ${moscowTime} (МСК)`,
  );

  if (input.logIp) lines.push(`IP:            ${input.ip}`);
  lines.push(
    "",
    "Письмо сформировано автоматически. Отвечать на него не нужно.",
  );

  return lines.join("\n");
}

export async function handleLeadRequest(
  request: Request,
): Promise<LeadResponse> {
  const config = getLeadConfig();
  const now = Math.floor(Date.now() / 1000);

  // The disabled receiver has no side effects and does not read the request body.
  if (!config.enabled) {
    return fail(
      503,
      "disabled",
      "Приём заявок с сайта временно не работает. Позвоните нам — ответим сразу.",
      { disabled: true },
      { "Retry-After": "3600" },
    );
  }

  if (request.method === "OPTIONS") {
    return response(204, {}, { Allow: "POST" });
  }

  if (request.method !== "POST") {
    return fail(
      405,
      "method_not_allowed",
      "Метод не поддерживается.",
      {},
      { Allow: "POST" },
    );
  }

  const origin = request.headers.get("origin") ?? "";
  const referer = request.headers.get("referer") ?? "";
  const sourceHeader = origin || referer;

  if (!sourceHeader) return fail(403, "origin_missing", "Запрос отклонён.");

  let sourceHost = "";
  try {
    sourceHost = new URL(sourceHeader).hostname.toLowerCase();
  } catch {
    return fail(403, "origin_rejected", "Запрос отклонён.");
  }

  if (!config.allowedHosts.includes(sourceHost)) {
    return fail(403, "origin_rejected", "Запрос отклонён.");
  }

  const contentType = request.headers.get("content-type") ?? "";
  if (!/^application\/json(?:\s*;|$)/i.test(contentType)) {
    return fail(415, "unsupported_media_type", "Ожидается JSON-запрос.");
  }

  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > MAX_BODY_BYTES) {
    return fail(413, "payload_too_large", "Слишком большой запрос.");
  }

  let body: { body: string; tooLarge: boolean };
  try {
    body = await readBody(request);
  } catch {
    return fail(400, "empty_body", "Пустой запрос.");
  }

  if (body.tooLarge) {
    return fail(413, "payload_too_large", "Слишком большой запрос.");
  }
  if (!body.body) return fail(400, "empty_body", "Пустой запрос.");

  let parsed: unknown;
  try {
    parsed = JSON.parse(body.body);
  } catch {
    return fail(400, "bad_json", "Не удалось разобрать запрос.");
  }

  if (!isRecord(parsed)) {
    return fail(400, "bad_json", "Не удалось разобрать запрос.");
  }

  const input = parsed;
  const sourceKey = cleanValue(input.source, 40);
  const phoneRaw = cleanValue(input.phone, 32);
  const name = cleanValue(input.name, 80);
  const comment = cleanValue(input.comment, 2000, true);
  const details = cleanValue(input.details, 4000, true);
  const address = cleanValue(input.address, 200);
  const service = cleanValue(input.service, 120);
  const channel = cleanValue(input.channel, 40);
  const pageUrl = cleanValue(input.page, 300);
  const ip = getClientIp(request.headers, config.trustProxy);

  // The honeypot returns a fake success and never reaches storage or email.
  if (cleanValue(input.website, 200)) {
    const directory = await getStorageDirectory(config.storagePath);
    await writeLeadLog(directory, {
      ts: new Date(now * 1000).toISOString(),
      event: "honeypot",
      ip: config.logIp && ip !== "unknown" ? ip : null,
      source: sourceKey,
    });

    return response(200, {
      ok: true,
      id: `GK-${randomBytes(3).toString("hex").toUpperCase()}`,
    });
  }

  if (typeof input.ts !== "number" && typeof input.ts !== "string") {
    return fail(
      422,
      "bad_timestamp",
      "Форма отправлена некорректно. Обновите страницу и попробуйте ещё раз.",
    );
  }

  const timestamp = Number(input.ts);
  if (!Number.isFinite(timestamp) || timestamp <= 0) {
    return fail(
      422,
      "bad_timestamp",
      "Форма отправлена некорректно. Обновите страницу и попробуйте ещё раз.",
    );
  }

  let fillSeconds: number | null = null;
  let fillSource: "monotonic" | "clock" | null = null;

  if (input.fill_ms !== undefined && input.fill_ms !== null) {
    const fillMs = Number(input.fill_ms);
    if (Number.isFinite(fillMs) && fillMs >= 0) {
      fillSeconds = Math.round(fillMs / 1000);
      fillSource = "monotonic";
    }
  }

  if (fillSeconds === null) {
    const candidate = now - Math.round(timestamp / 1000);
    if (candidate >= 0 && candidate <= MAX_FILL_SECONDS) {
      fillSeconds = candidate;
      fillSource = "clock";
    }
  }

  if (fillSeconds !== null && fillSeconds < MIN_FILL_SECONDS) {
    return fail(
      422,
      "too_fast",
      "Форма заполнена слишком быстро. Попробуйте ещё раз.",
    );
  }

  if (
    fillSource === "monotonic" &&
    fillSeconds !== null &&
    fillSeconds > MAX_FILL_SECONDS
  ) {
    return fail(
      422,
      "form_expired",
      "Страница была открыта слишком давно. Обновите её и заполните форму заново.",
    );
  }

  const errors: Record<string, string> = {};
  if (!FORM_SOURCES[sourceKey]) errors.source = "Неизвестная форма.";
  if (name && Array.from(name).length < 2)
    errors.name = "Слишком короткое имя.";

  const phoneDigits = phoneRaw.replace(/\D+/g, "");
  if (!phoneRaw) errors.phone = "Укажите телефон.";
  else if (phoneDigits.length < 10)
    errors.phone = "В номере должно быть не меньше 10 цифр.";
  else if (phoneDigits.length > 15) errors.phone = "Проверьте номер телефона.";

  if (!hasConsent(input.consent)) {
    errors.consent =
      "Без согласия на обработку персональных данных мы не можем принять заявку.";
  }

  if (Object.keys(errors).length > 0) {
    return fail(422, "validation_failed", "Проверьте заполнение формы.", {
      fields: errors,
    });
  }

  const utm: Record<string, string> = {};
  const utmInput = input.utm;
  if (isRecord(utmInput)) {
    [
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "utm_content",
      "utm_term",
    ].forEach((key) => {
      const value = cleanValue(utmInput[key], 120);
      if (value) utm[key] = value;
    });
  }

  const directory = await getStorageDirectory(config.storagePath);

  if (ip !== "unknown") {
    const ipLimit = await checkRateLimit(
      directory,
      `ip:${ip}`,
      RATE_LIMITS_BY_IP,
      now,
    );

    if (!ipLimit.allowed) {
      return fail(
        429,
        "rate_limited",
        "Вы отправили несколько заявок подряд. Позвоните нам — ответим сразу.",
        { retry_after: ipLimit.retryAfter },
        { "Retry-After": String(ipLimit.retryAfter) },
      );
    }
  }

  const globalLimit = await checkRateLimit(
    directory,
    "global",
    RATE_LIMITS_GLOBAL,
    now,
  );

  if (!globalLimit.allowed) {
    return fail(
      429,
      "rate_limited_global",
      "Сервис временно перегружен. Позвоните нам — ответим сразу.",
      { retry_after: globalLimit.retryAfter },
      { "Retry-After": String(globalLimit.retryAfter) },
    );
  }

  const leadId = makeLeadId(now);
  const fingerprint = createHash("sha256")
    .update([ip, phoneDigits, sourceKey, comment, details].join("|"))
    .digest("hex");
  const claim = await claimFingerprint(
    directory,
    fingerprint,
    config.dedupeWindowSeconds,
    now,
  );

  if (claim === "sent") {
    await writeLeadLog(directory, {
      ts: new Date(now * 1000).toISOString(),
      event: "duplicate",
      source: sourceKey,
      phone: maskPhone(phoneRaw),
    });

    return response(200, { ok: true, id: leadId, duplicate: true });
  }

  if (claim === "pending") {
    await writeLeadLog(directory, {
      ts: new Date(now * 1000).toISOString(),
      event: "in_progress",
      source: sourceKey,
      phone: maskPhone(phoneRaw),
    });

    return fail(
      409,
      "in_progress",
      "Эта заявка уже отправляется. Подождите несколько секунд — если подтверждение не появится, отправьте ещё раз.",
      {},
      { "Retry-After": "5" },
    );
  }

  const sourceLabel = FORM_SOURCES[sourceKey];
  const subject = `[Зелёный ключ] Новая заявка — ${sourceLabel}`;
  const emailBody = buildEmailBody({
    leadId,
    now,
    sourceLabel,
    name,
    phone: phoneRaw,
    channel,
    service,
    address,
    comment,
    details,
    pageUrl,
    utm,
    ip,
    logIp: config.logIp && ip !== "unknown",
  });

  const mailResult = await sendLeadEmail(config, subject, emailBody);

  await writeLeadLog(directory, {
    ts: new Date(now * 1000).toISOString(),
    event: mailResult.ok ? "sent" : "send_failed",
    id: leadId,
    source: sourceKey,
    phone: maskPhone(phoneRaw),
    transport: "smtp",
    detail: mailResult.detail,
  });

  if (!mailResult.ok) {
    await releaseFingerprint(directory, fingerprint);
    return fail(
      502,
      "send_failed",
      "Не получилось отправить заявку. Позвоните нам — ответим сразу.",
    );
  }

  await markFingerprintSent(directory, fingerprint, now);
  return response(200, { ok: true, id: leadId });
}

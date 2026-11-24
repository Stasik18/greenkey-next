export const MAX_BODY_BYTES = 32 * 1024;
export const MIN_FILL_SECONDS = 3;
export const MAX_FILL_SECONDS = 12 * 60 * 60;
export const CONSENT_VERSION = "2026-08-07";
export const LEAD_VERSION = "1.0.0";

export const FORM_SOURCES: Record<string, string> = {
  "index-call": "Обратный звонок (главная)",
  "index-hero": "Быстрая заявка (первый экран)",
  "index-measure": "Бесплатный замер (главная)",
  "index-contact": "Контактная форма (главная)",
  "index-vacancy": "Отклик на вакансию (главная)",
  "gallery-call": "Обратный звонок (галерея)",
  calculator: "Смета из калькулятора",
};

export function cleanValue(
  value: unknown,
  maxCharacters: number,
  allowNewlines = false,
): string {
  if (
    typeof value !== "string" &&
    typeof value !== "number" &&
    typeof value !== "boolean"
  ) {
    return "";
  }

  let result = String(value);

  if (allowNewlines) {
    result = result
      .replace(/\r\n?/g, "\n")
      .replace(/\p{C}/gu, (character) => (character === "\n" ? "\n" : ""))
      .replace(/\n{3,}/g, "\n\n");
  } else {
    result = result.replace(/\p{C}+/gu, " ").replace(/\s{2,}/g, " ");
  }

  result = result.trim();
  const characters = Array.from(result);

  if (characters.length > maxCharacters) {
    result = `${characters.slice(0, maxCharacters).join("")}…`;
  }

  return result;
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function getClientIp(headers: Headers, trustProxy: boolean) {
  if (!trustProxy) return "unknown";

  const candidates = [
    headers.get("x-real-ip"),
    headers.get("x-forwarded-for")?.split(",")[0]?.trim(),
  ];

  for (const candidate of candidates) {
    if (candidate && isValidIp(candidate)) return candidate;
  }

  return "unknown";
}

function isValidIp(value: string) {
  // IPv4
  const ipv4 = value.match(/^(\d{1,3}\.){3}\d{1,3}$/);
  if (ipv4) {
    return value.split(".").every((part) => {
      const octet = Number(part);
      return octet >= 0 && octet <= 255;
    });
  }

  // IPv6: a conservative syntax check; the proxy is expected to normalize it.
  return value.includes(":") && /^[0-9a-f:]+$/i.test(value);
}

export function getMoscowDate(timestamp: number) {
  const date = new Date(timestamp * 1000);
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Moscow",
    year: "2-digit",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const values = Object.fromEntries(
    parts.map((part) => [part.type, part.value]),
  );

  return {
    leadDate: `${values.year}${values.month}${values.day}`,
    formatted: new Intl.DateTimeFormat("ru-RU", {
      timeZone: "Europe/Moscow",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hourCycle: "h23",
    }).format(date),
  };
}

export function maskPhone(phone: string) {
  const digits = phone.replace(/\D+/g, "");
  if (digits.length < 4) return "***";

  return `${digits.slice(0, 2)}${"*".repeat(Math.max(0, digits.length - 4))}${digits.slice(-2)}`;
}

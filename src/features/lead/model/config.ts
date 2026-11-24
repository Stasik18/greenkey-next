export interface LeadConfig {
  enabled: boolean;
  recipient: string;
  sender: string;
  senderName: string;
  allowedHosts: string[];
  storagePath: string | null;
  trustProxy: boolean;
  logIp: boolean;
  dedupeWindowSeconds: number;
  smtp: {
    host: string;
    port: number;
    secure: "ssl" | "tls";
    username: string;
    password: string;
    timeoutMs: number;
  };
}

function readPositiveInteger(value: string | undefined, fallback: number) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

function readBoolean(value: string | undefined) {
  return value?.trim().toLowerCase() === "true";
}

export function getLeadConfig(): LeadConfig {
  const allowedHosts = (
    process.env.GREENKEY_LEAD_ALLOWED_HOSTS ??
    "sk-greenkey.ru,www.sk-greenkey.ru"
  )
    .split(",")
    .map((host) => host.trim().toLowerCase())
    .filter(Boolean);

  return {
    enabled: readBoolean(process.env.GREENKEY_LEAD_ENABLED),
    recipient: process.env.GREENKEY_LEAD_TO ?? "dafo40@yandex.ru",
    sender: process.env.GREENKEY_LEAD_FROM ?? "noreply@sk-greenkey.ru",
    senderName: process.env.GREENKEY_LEAD_FROM_NAME ?? "Сайт Зелёный ключ",
    allowedHosts,
    storagePath: process.env.GREENKEY_LEAD_STORAGE?.trim() || null,
    trustProxy: readBoolean(process.env.GREENKEY_TRUST_PROXY),
    logIp: process.env.GREENKEY_LEAD_LOG_IP !== "false",
    dedupeWindowSeconds: readPositiveInteger(
      process.env.GREENKEY_LEAD_DEDUPE_SECONDS,
      600,
    ),
    smtp: {
      host: process.env.GREENKEY_LEAD_SMTP_HOST?.trim() ?? "",
      port: readPositiveInteger(process.env.GREENKEY_LEAD_SMTP_PORT, 465),
      secure: process.env.GREENKEY_LEAD_SMTP_SECURE === "tls" ? "tls" : "ssl",
      username: process.env.GREENKEY_LEAD_SMTP_USER?.trim() ?? "",
      password: process.env.GREENKEY_LEAD_SMTP_PASS ?? "",
      timeoutMs:
        readPositiveInteger(process.env.GREENKEY_LEAD_SMTP_TIMEOUT, 15) * 1000,
    },
  };
}

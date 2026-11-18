"use client";

import type { FormEvent, ReactNode } from "react";
import { useEffect, useRef, useState } from "react";

interface LeadFormProps {
  source: string;
  className?: string;
  closeModalId?: string;
  extraData?: Record<string, unknown>;
  onSuccess?: () => void;
  children: ReactNode;
}

interface LeadPayload {
  ok?: boolean;
  id?: string | number;
  error?: string;
  message?: string;
  fields?: Record<string, string>;
}

const FALLBACK_LINKS = [
  { label: "+7 (903) 512-03-26", href: "tel:+79035120326" },
  { label: "Telegram", href: "https://t.me/+79035120326" },
  { label: "MAX", href: "https://max.ru/79035120326" },
];

const ERROR_MESSAGES: Record<string, string> = {
  validation_failed: "Проверьте заполнение формы.",
  too_fast: "Слишком быстро. Проверьте поля и отправьте ещё раз.",
  form_expired: "Страница открыта давно. Обновите её и заполните форму заново.",
  rate_limited: "Вы уже отправили несколько заявок подряд.",
  rate_limited_global: "Сервис перегружен.",
  origin_rejected: "Запрос отклонён сервером.",
  send_failed: "Не получилось отправить заявку.",
  network: "Не удалось связаться с сервером.",
  disabled:
    "Приём заявок с сайта временно не работает. Позвоните нам - ответим сразу.",
};

function getUtm() {
  const keys = [
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_content",
    "utm_term",
  ];

  let saved: Record<string, string> = {};

  try {
    saved = JSON.parse(sessionStorage.getItem("gk_utm") ?? "{}") as Record<
      string,
      string
    >;
  } catch {
    saved = {};
  }

  const params = new URLSearchParams(window.location.search);
  const current = Object.fromEntries(
    keys
      .map((key) => [key, params.get(key)?.slice(0, 120) ?? ""])
      .filter(([, value]) => value),
  ) as Record<string, string>;

  if (Object.keys(current).length > 0) {
    saved = current;

    try {
      sessionStorage.setItem("gk_utm", JSON.stringify(saved));
    } catch {
      // Storage may be unavailable in private browsing mode.
    }
  }

  return saved;
}

export function LeadForm({
  source,
  className,
  closeModalId,
  extraData,
  onSuccess,
  children,
}: LeadFormProps) {
  const startedAt = useRef(0);
  useEffect(() => {
    startedAt.current = window.performance.now();
  }, []);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<{
    type: "error" | "success";
    message: string;
  } | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmitting) return;

    const form = event.currentTarget;
    const formData = new FormData(form);
    const name = String(formData.get("name") ?? "").trim();
    const phone = String(formData.get("phone") ?? "").trim();
    const consent = formData.get("consent") === "1";

    if (!phone || phone.replace(/\D/g, "").length < 10) {
      setStatus({
        type: "error",
        message: "Укажите корректный номер телефона, не менее 10 цифр.",
      });
      form.querySelector<HTMLInputElement>('[name="phone"]')?.focus();
      return;
    }

    if (name && name.length < 2) {
      setStatus({ type: "error", message: "Слишком короткое имя." });
      form.querySelector<HTMLInputElement>('[name="name"]')?.focus();
      return;
    }

    if (!consent) {
      setStatus({
        type: "error",
        message: "Отметьте согласие на обработку персональных данных.",
      });
      form.querySelector<HTMLInputElement>('[name="consent"]')?.focus();
      return;
    }

    const payload: Record<string, unknown> = {
      source,
      page: `${window.location.pathname}${window.location.search}`,
      utm: getUtm(),
      ts: Date.now(),
      fill_ms: Math.max(
        0,
        Math.round(window.performance.now() - startedAt.current),
      ),
      consent,
    };

    ["name", "phone", "comment", "address", "service", "website"].forEach(
      (field) => {
        const value = formData.get(field);
        if (typeof value === "string") payload[field] = value.trim();
      },
    );

    Object.assign(payload, extraData);

    setIsSubmitting(true);
    setStatus(null);

    try {
      const response = await fetch("/api/send-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "same-origin",
        cache: "no-store",
      });
      const result = (await response.json().catch(() => ({}))) as LeadPayload;

      if (!response.ok || !result.ok) {
        setStatus({
          type: "error",
          message:
            result.message ??
            ERROR_MESSAGES[result.error ?? ""] ??
            "Что-то пошло не так.",
        });
        return;
      }

      setStatus({
        type: "success",
        message: `Заявка отправлена. Номер заявки: ${result.id ?? "-"}. Перезвоним в рабочее время.`,
      });
      form.reset();
      onSuccess?.();
      startedAt.current = window.performance.now();

      form.dispatchEvent(
        new CustomEvent("lead:sent", { detail: result, bubbles: true }),
      );

      if (closeModalId) {
        window.setTimeout(() => {
          window.dispatchEvent(
            new CustomEvent("home:close-modal", { detail: closeModalId }),
          );
        }, 1500);
      }
    } catch {
      setStatus({ type: "error", message: ERROR_MESSAGES.network });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      className={className}
      data-lead-form={source}
      noValidate
      onSubmit={handleSubmit}
      onChange={() => setStatus(null)}
      aria-busy={isSubmitting}
    >
      <fieldset disabled={isSubmitting} className="contents">
        {children}
      </fieldset>

      {status && (
        <div
          className={`mt-4 rounded-lg px-4 py-3 text-sm leading-relaxed ${
            status.type === "success"
              ? "bg-green-50 text-green-800"
              : "bg-red-50 text-red-800"
          }`}
          role="status"
          aria-live="polite"
        >
          <div>{status.message}</div>
          {status.type === "error" && (
            <>
              <div className="mt-2 font-medium">
                Позвоните или напишите - заявку примем вручную:
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {FALLBACK_LINKS.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    target={
                      link.href.startsWith("https:") ? "_blank" : undefined
                    }
                    rel={
                      link.href.startsWith("https:")
                        ? "noopener noreferrer"
                        : undefined
                    }
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </form>
  );
}

"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import Link from "next/link";
import { LeadForm } from "@/shared/ui/lead-form";

const serviceOptions = [
  "Строительство каркасного дома",
  "Ремонт и отделка",
  "Дизайн-проект",
  "Кадастровые работы",
  "Инженерные работы",
  "Хоумстейджинг",
  "Другое",
];

const inputClass =
  "mt-2 min-h-11 w-full rounded-lg border border-border bg-white px-4 py-3 text-sm text-ink outline-none transition focus:border-brand-green focus:ring-2 focus:ring-brand-green/20";

export function ContactsLeadForm() {
  const [formType, setFormType] = useState<"callback" | "measure">("callback");
  const isMeasure = formType === "measure";

  return (
    <LeadForm
      source="index-contact"
      className="contact-form rounded-2xl bg-white p-6 shadow-sm md:p-8"
    >
      <div className="form-tabs mb-7 grid grid-cols-2 gap-2 rounded-lg bg-surface-muted p-1">
        <button
          type="button"
          className={`form-tab rounded-md px-3 py-3 text-sm font-bold ${!isMeasure ? "active" : ""}`}
          aria-pressed={!isMeasure}
          onClick={() => setFormType("callback")}
        >
          Обратный звонок
        </button>
        <button
          type="button"
          className={`form-tab rounded-md px-3 py-3 text-sm font-bold ${isMeasure ? "active" : ""}`}
          aria-pressed={isMeasure}
          onClick={() => setFormType("measure")}
        >
          Бесплатный замер
        </button>
      </div>

      <div className="form-row grid gap-4 sm:grid-cols-2">
        <FormField id="cf-name" label="Имя">
          <input
            id="cf-name"
            name="name"
            autoComplete="name"
            maxLength={80}
            placeholder="Иван Иванов"
            required
            className={inputClass}
          />
        </FormField>
        <FormField id="cf-phone" label="Телефон">
          <input
            id="cf-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            maxLength={24}
            placeholder="+7 (903) 000-00-00"
            required
            className={inputClass}
          />
        </FormField>
      </div>

      <div className="form-group mt-4">
        <label htmlFor="cf-service" className="block text-sm font-semibold">
          Тип услуги
        </label>
        <select id="cf-service" name="service" className={inputClass}>
          <option value="">Выберите услугу...</option>
          {serviceOptions.map((service) => (
            <option key={service}>{service}</option>
          ))}
        </select>
      </div>

      {isMeasure && (
        <div className="form-group mt-4">
          <label htmlFor="cf-addr" className="block text-sm font-semibold">
            Адрес объекта
          </label>
          <input
            id="cf-addr"
            name="address"
            autoComplete="street-address"
            maxLength={200}
            placeholder="Москва, ул. Примерная, 1"
            className={inputClass}
          />
        </div>
      )}

      <Honeypot id="cf-website" />
      <Consent id="cf-consent" />

      <button
        type="submit"
        className="form-submit mt-6 w-full rounded-lg bg-brand-green px-6 py-4 font-heading text-sm font-extrabold uppercase tracking-wide text-ink transition hover:bg-brand-green/90"
      >
        {isMeasure ? "Записаться на замер" : "Жду звонка"}
      </button>
    </LeadForm>
  );
}

function FormField({
  id,
  label,
  children,
}: {
  id: string;
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="form-group">
      <label htmlFor={id} className="block text-sm font-semibold">
        {label}
      </label>
      {children}
    </div>
  );
}

function Honeypot({ id }: { id: string }) {
  return (
    <div className="hp-field" aria-hidden="true">
      <label htmlFor={id}>Не заполняйте это поле</label>
      <input
        id={id}
        name="website"
        type="text"
        tabIndex={-1}
        autoComplete="off"
      />
    </div>
  );
}

function Consent({ id }: { id: string }) {
  return (
    <div className="form-consent-check mt-5 flex items-start gap-2 text-xs leading-relaxed text-muted">
      <input
        id={id}
        name="consent"
        type="checkbox"
        value="1"
        required
        className="mt-0.5 accent-brand-green"
      />
      <label htmlFor={id}>
        Согласен на обработку персональных данных и принимаю{" "}
        <Link href="/privacy" target="_blank" className="underline">
          политику конфиденциальности
        </Link>
        .
      </label>
    </div>
  );
}

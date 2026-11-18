"use client";

import { useState } from "react";
import Link from "next/link";

import { LeadForm } from "@/shared/ui/lead-form";
import type {
  BuildTerm,
  CalculatorRow,
  ContactChannel,
  LandOption,
} from "../../lib/calculator";
import {
  BUILD_TERMS,
  LAND_OPTIONS,
  buildLeadDetails,
} from "../../lib/calculator";
import { AnimatedMoney } from "./AnimatedMoney";

interface CalculatorLeadSectionProps {
  total: number;
  rows: CalculatorRow[];
  term: BuildTerm;
  land: LandOption;
  channel: ContactChannel;
  onTermChange: (value: BuildTerm) => void;
  onLandChange: (value: LandOption) => void;
  onChannelChange: (value: ContactChannel) => void;
}

function ChoiceChips<T extends string>({
  label,
  values,
  selected,
  onChange,
  getLabel,
}: {
  label: string;
  values: readonly T[];
  selected: T;
  onChange: (value: T) => void;
  getLabel?: (value: T) => string;
}) {
  return (
    <>
      <span className="field-label">{label}</span>
      <div className="chip-row">
        {values.map((value) => (
          <button
            type="button"
            className={`chip${selected === value ? " selected" : ""}`}
            aria-pressed={selected === value}
            onClick={() => onChange(value)}
            key={value}
          >
            {getLabel ? getLabel(value) : value}
          </button>
        ))}
      </div>
    </>
  );
}

export function CalculatorLeadSection({
  total,
  rows,
  term,
  land,
  channel,
  onTermChange,
  onLandChange,
  onChannelChange,
}: CalculatorLeadSectionProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(false);

  return (
    <section className="lead" id="lead">
      <h2>Получить точную смету</h2>
      <p className="lead-sub">
        Отправьте собранную комплектацию - менеджер уточнит детали, посчитает
        доставку и предложит точную стоимость. Ответим в рабочее время (пн-вс,
        9:00-18:00).
      </p>
      <div className="lead-total">
        <span>Ваша сборка:</span>
        <b>
          <AnimatedMoney value={total} />
        </b>
      </div>

      <ChoiceChips
        label="Когда планируете строить?"
        values={BUILD_TERMS}
        selected={term}
        onChange={onTermChange}
      />
      <ChoiceChips
        label="Есть участок?"
        values={LAND_OPTIONS}
        selected={land}
        onChange={onLandChange}
        getLabel={(value) =>
          value === "Да, участок есть" ? "Да, есть" : "Нет, в поиске"
        }
      />
      <span className="field-label">Куда отправить смету?</span>
      <div className="chip-row" aria-label="Канал отправки сметы">
        <button
          type="button"
          className={`chip${channel === "max" ? " selected" : ""}`}
          aria-pressed={channel === "max"}
          onClick={() => onChannelChange("max")}
        >
          <svg viewBox="0 0 24 24" fill="#7B61FF" aria-hidden="true">
            <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm-4 6h1.8l2.2 3.5L14.2 8H16v8h-1.7v-5.2L12 14.3l-2.3-3.5V16H8V8z" />
          </svg>
          MAX
        </button>
        <button
          type="button"
          className={`chip${channel === "telegram" ? " selected" : ""}`}
          aria-pressed={channel === "telegram"}
          onClick={() => onChannelChange("telegram")}
        >
          <svg viewBox="0 0 24 24" fill="#229ED9" aria-hidden="true">
            <path d="M21.9 4.3l-3.3 15.6c-.2 1.1-.9 1.3-1.8.8l-5-3.7-2.4 2.3c-.3.3-.5.5-1 .5l.4-5 9.3-8.4c.4-.4-.1-.6-.6-.2L5.2 13.5l-4.9-1.5c-1.1-.3-1.1-1 .2-1.5l19.2-7.4c.9-.3 1.7.2 1.4 1.7z" />
          </svg>
          Telegram
        </button>
      </div>

      <LeadForm
        source="calculator"
        className="calculator-lead-form"
        onSuccess={() => {
          setName("");
          setPhone("");
          setConsent(false);
        }}
        extraData={{
          details: buildLeadDetails(rows, total, term, land),
          channel: channel === "telegram" ? "Telegram" : "MAX",
        }}
      >
        <div className="lead-form-row">
          <div className="lead-input">
            <label htmlFor="lead-name">Ваше имя</label>
            <input
              id="lead-name"
              name="name"
              autoComplete="name"
              maxLength={80}
              placeholder="Иван"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </div>
          <div className="lead-input">
            <label htmlFor="lead-phone">Телефон</label>
            <input
              id="lead-phone"
              name="phone"
              autoComplete="tel"
              inputMode="tel"
              maxLength={24}
              placeholder="+7 (___) ___-__-__"
              required
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
            />
          </div>
        </div>
        <div className="hp-field" aria-hidden="true">
          <label htmlFor="lead-website">Не заполняйте это поле</label>
          <input
            id="lead-website"
            name="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
          />
        </div>
        <div className="form-consent-check">
          <input
            id="lead-consent"
            name="consent"
            value="1"
            type="checkbox"
            required
            checked={consent}
            onChange={(event) => setConsent(event.target.checked)}
          />
          <label htmlFor="lead-consent">
            Согласен на обработку персональных данных и принимаю{" "}
            <Link href="/privacy" target="_blank" rel="noopener noreferrer">
              политику конфиденциальности
            </Link>
            .
          </label>
        </div>
        <button className="lead-submit" type="submit">
          Отправить смету
        </button>
      </LeadForm>
    </section>
  );
}

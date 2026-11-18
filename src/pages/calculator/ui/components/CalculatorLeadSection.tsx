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
  formatMoney,
} from "../../lib/calculator";

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
        <b>{formatMoney(total)}</b>
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
      <ChoiceChips
        label="Куда отправить смету?"
        values={["max", "telegram"] as const}
        selected={channel}
        onChange={onChannelChange}
        getLabel={(value) => (value === "max" ? "MAX" : "Telegram")}
      />

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
            <Link href="/privacy" target="_blank">
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

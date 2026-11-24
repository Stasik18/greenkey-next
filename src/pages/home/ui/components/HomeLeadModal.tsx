"use client";

import type { RefObject } from "react";

import { Button, Checkbox, Input, Select } from "@/shared/ui";
import { LeadForm } from "@/shared/ui/lead-form";
import { FormField } from "./FormField";

const inputClass =
  "mt-2 min-h-11 w-full rounded-lg border border-border bg-white px-4 py-3 text-sm text-ink outline-none transition focus:border-brand-green focus:ring-2 focus:ring-brand-green/20";

type ModalId = "modal-call" | "modal-measure";

interface HomeLeadModalProps {
  activeModal: ModalId;
  panelRef: RefObject<HTMLDivElement | null>;
  onClose: () => void;
}

export function HomeLeadModal({
  activeModal,
  panelRef,
  onClose,
}: HomeLeadModalProps) {
  const isMeasure = activeModal === "modal-measure";
  const formName = isMeasure ? "index-measure" : "index-call";

  return (
    <div
      className="home-modal fixed inset-0 z-[300] flex items-start justify-center overflow-y-auto overscroll-contain bg-ink/75 px-4 py-6 backdrop-blur-sm sm:items-center sm:py-8"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="home-modal-title"
        className="home-modal-panel relative my-auto w-full max-w-xl shrink-0 rounded-2xl bg-white p-6 text-ink shadow-2xl sm:p-8 md:p-9"
      >
        <Button
          unstyled
          type="button"
          onClick={onClose}
          aria-label="Закрыть окно"
          data-autofocus
          className="absolute right-4 top-4 grid size-10 place-items-center rounded-full border border-border text-2xl text-muted transition hover:bg-surface-muted hover:text-ink"
        >
          ×
        </Button>

        <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-orange">
          {isMeasure ? "Бесплатная услуга" : "Обратный звонок"}
        </p>
        <h2
          id="home-modal-title"
          className="mt-3 max-w-sm font-heading text-3xl font-black tracking-tight"
        >
          {isMeasure ? "Бесплатный замер" : "Обратный звонок"}
        </h2>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-muted">
          {isMeasure
            ? "Выедем на объект, оценим объём работ и составим подробную смету - бесплатно."
            : "Перезвоним в течение 15 минут в рабочее время."}
        </p>

        <LeadForm
          source={formName}
          closeModalId={activeModal}
          className="contact-form mt-7 space-y-4"
        >
          <FormField id={`${activeModal}-name`} label="Ваше имя">
            <Input
              unstyled
              id={`${activeModal}-name`}
              name="name"
              autoComplete="name"
              maxLength={80}
              placeholder="Иван Иванов"
              className={inputClass}
            />
          </FormField>
          <FormField id={`${activeModal}-phone`} label="Телефон">
            <Input
              unstyled
              id={`${activeModal}-phone`}
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

          {isMeasure && (
            <>
              <FormField id="measure-address" label="Адрес объекта">
                <Input
                  unstyled
                  id="measure-address"
                  name="address"
                  autoComplete="street-address"
                  maxLength={200}
                  placeholder="Москва, ул. Примерная, 1"
                  className={inputClass}
                />
              </FormField>
              <FormField id="measure-service" label="Тип услуги">
                <Select
                  unstyled
                  id="measure-service"
                  name="service"
                  className={inputClass}
                  defaultValue=""
                >
                  <option value="">Выберите услугу...</option>
                  <option>Строительство каркасного дома</option>
                  <option>Ремонт и отделка</option>
                  <option>Дизайн-проект</option>
                  <option>Кадастровые работы</option>
                  <option>Инженерные работы</option>
                  <option>Хоумстейджинг</option>
                  <option>Другое</option>
                </Select>
              </FormField>
            </>
          )}

          <div className="hp-field" aria-hidden="true">
            <label htmlFor={`${activeModal}-website`}>
              Не заполняйте это поле
            </label>
            <input
              id={`${activeModal}-website`}
              name="website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
            />
          </div>

          <Checkbox
            id={`${activeModal}-consent`}
            name="consent"
            value="1"
            required
            className="form-consent-check flex items-start gap-2 text-xs leading-relaxed text-muted"
          >
            Согласен на обработку персональных данных и принимаю{" "}
            <a
              href="/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              политику конфиденциальности
            </a>
            .
          </Checkbox>

          <Button
            unstyled
            type="submit"
            className="form-submit w-full rounded-lg bg-brand-green px-6 py-4 font-heading text-sm font-extrabold uppercase tracking-wide text-ink transition hover:bg-brand-green/90"
          >
            {isMeasure ? "Записаться на замер" : "Жду звонка"}
          </Button>
        </LeadForm>
      </div>
    </div>
  );
}

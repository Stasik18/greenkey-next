import type { ReactNode } from "react";
import {
  Button,
  Checkbox,
  Container,
  Icon,
  Input,
  Select,
  Textarea,
  Typography,
} from "@/shared/ui";
import { LeadForm } from "@/shared/ui/lead-form";

const vacancies = [
  [
    "Бригады каркасного домостроения",
    "Фундамент, каркас, кровля, тёплый контур. Объекты идут круглый год.",
  ],
  [
    "Кровельщики",
    "Стропильная система, металлочерепица, мягкая и композитная кровля, водостоки.",
  ],
  [
    "Отделочники",
    "Черновая и чистовая отделка квартир и домов, работа по дизайн-проекту.",
  ],
  [
    "Инженерные системы",
    "Электрика, водоснабжение, канализация, отопление, вентиляция.",
  ],
  [
    "Прорабы и мастера участка",
    "Ведение объекта, контроль этапов, работа с заказчиком и сметой.",
  ],
];

export function VacanciesSection() {
  return (
    <section id="vacancies" className="bg-ink py-20 text-white md:py-28">
      <Container>
        <Typography variant="eyebrow" className="text-brand-orange">
          06 - Работа в команде
        </Typography>
        <Typography as="h2" variant="h2" className="mt-4 text-white">
          Ищем тех,
          <br />
          кто строит
        </Typography>
        <Typography className="mt-5 max-w-2xl text-white/55">
          Набираем бригады и специалистов на объекты в Москве и Московской
          области. Оставьте отклик - перезвоним, обсудим объём работ и условия.
        </Typography>

        <div className="vac-grid mt-12 grid gap-8 lg:grid-cols-[1fr_0.9fr]">
          <div className="vac-list space-y-4">
            {vacancies.map(([title, description]) => (
              <div
                key={title}
                className="vac-item reveal flex gap-4 rounded-xl border border-white/10 bg-white/[0.035] p-5"
              >
                <Icon
                  name="Check"
                  size={21}
                  className="mt-0.5 shrink-0 text-brand-green"
                />
                <div>
                  <Typography as="h3" variant="h4" className="text-white">
                    {title}
                  </Typography>
                  <Typography variant="body-sm" className="mt-2 text-white/55">
                    {description}
                  </Typography>
                </div>
              </div>
            ))}
          </div>

          <div className="vac-card rounded-2xl bg-white p-8 text-ink md:p-8">
            <Typography as="h3" variant="h3">
              Отклик на вакансию
            </Typography>
            <Typography className="mt-3 text-sm text-muted">
              Коротко напишите, что умеете и где работали. Перезвоним в рабочее
              время.
            </Typography>
            <LeadForm
              source="index-vacancy"
              className="contact-form mt-7 space-y-5"
            >
              <div className="form-row grid gap-4 sm:grid-cols-2">
                <FormField id="vac-name" label="Имя">
                  <Input
                    unstyled
                    id="vac-name"
                    name="name"
                    autoComplete="name"
                    maxLength={80}
                    placeholder="Иван Иванов"
                    required
                    className={inputClass}
                  />
                </FormField>
                <FormField id="vac-phone" label="Телефон">
                  <Input
                    unstyled
                    id="vac-phone"
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
              <FormField id="vac-service" label="Специальность">
                <Select
                  unstyled
                  id="vac-service"
                  name="service"
                  className={inputClass}
                >
                  <option value="">Выберите...</option>
                  <option>Бригада каркасного домостроения</option>
                  <option>Кровельщик</option>
                  <option>Отделочник</option>
                  <option>Инженерные системы</option>
                  <option>Прораб / мастер участка</option>
                  <option>Другое</option>
                </Select>
              </FormField>
              <FormField id="vac-comment" label="Опыт работы">
                <Textarea
                  unstyled
                  id="vac-comment"
                  name="comment"
                  maxLength={2000}
                  rows={3}
                  placeholder="Сколько лет в профессии, какие объекты вели, размер бригады"
                  className={inputClass}
                />
              </FormField>
              <Honeypot id="vac-website" />
              <Consent id="vac-consent" />
              <Button
                unstyled
                type="submit"
                className="form-submit w-full rounded-lg bg-brand-green px-6 py-4 font-heading text-sm font-extrabold uppercase tracking-wide text-ink transition hover:bg-brand-green/90"
              >
                Отправить отклик
              </Button>
            </LeadForm>
          </div>
        </div>
      </Container>
    </section>
  );
}

const inputClass =
  "mt-2 min-h-11 w-full rounded-lg border border-border bg-white px-4 py-3 text-sm text-ink outline-none transition focus:border-brand-green focus:ring-2 focus:ring-brand-green/20";

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
    <Checkbox
      id={id}
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
  );
}

import Link from "next/link";
import { SectionHeading } from "./SectionHeading";

const VACANCIES = [
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
    <section
      id="vacancies"
      className="bg-ink px-6 py-32 text-white max-sm:py-20"
    >
      <div className="mx-auto max-w-[1200px]">
        <SectionHeading
          eyebrow="06 — Работа в команде"
          title={
            <>
              Ищем тех,
              <br />
              кто строит
            </>
          }
          description="Набираем бригады и специалистов на объекты в Москве и Московской области. Оставьте отклик — перезвоним, обсудим объём работ и условия."
          dark
        />
        <div className="mt-12 grid grid-cols-2 gap-12 max-[800px]:grid-cols-1">
          <ul className="space-y-6">
            {VACANCIES.map(([title, text]) => (
              <li key={title} className="flex gap-4">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-brand-green text-sm font-black text-ink">
                  ✓
                </span>
                <div>
                  <h3 className="font-heading font-extrabold">{title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-white/45">
                    {text}
                  </p>
                </div>
              </li>
            ))}
          </ul>
          <div className="rounded-xl bg-white p-8 text-ink max-sm:p-5">
            <h3 className="font-heading text-2xl font-black">
              Отклик на вакансию
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Коротко напишите, что умеете и где работали. Перезвоним в рабочее
              время.
            </p>
            <form className="mt-6 space-y-4">
              <label className="block text-sm font-semibold">
                Имя
                <input
                  name="name"
                  autoComplete="name"
                  required
                  className="mt-2 w-full rounded border border-border px-4 py-3 font-normal outline-none focus:border-brand-green"
                  placeholder="Иван Иванов"
                />
              </label>
              <label className="block text-sm font-semibold">
                Телефон
                <input
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  required
                  className="mt-2 w-full rounded border border-border px-4 py-3 font-normal outline-none focus:border-brand-green"
                  placeholder="+7 (903) 000-00-00"
                />
              </label>
              <label className="block text-sm font-semibold">
                Специальность
                <select
                  name="service"
                  className="mt-2 w-full rounded border border-border px-4 py-3 font-normal"
                >
                  <option value="">Выберите...</option>
                  {VACANCIES.map(([title]) => (
                    <option key={title}>{title}</option>
                  ))}
                  <option>Другое</option>
                </select>
              </label>
              <label className="block text-sm font-semibold">
                Опыт работы
                <textarea
                  name="comment"
                  rows={3}
                  className="mt-2 w-full rounded border border-border px-4 py-3 font-normal outline-none focus:border-brand-green"
                  placeholder="Сколько лет в профессии, какие объекты вели..."
                />
              </label>
              <label className="flex items-start gap-2 text-xs leading-relaxed text-muted">
                <input
                  type="checkbox"
                  required
                  className="mt-0.5 accent-brand-green"
                />
                Согласен на обработку персональных данных и принимаю{" "}
                <Link href="/privacy" className="underline">
                  политику конфиденциальности
                </Link>
                .
              </label>
              <button
                type="button"
                className="w-full rounded bg-brand-green px-6 py-4 font-heading text-sm font-extrabold uppercase text-ink"
              >
                Отправить отклик
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

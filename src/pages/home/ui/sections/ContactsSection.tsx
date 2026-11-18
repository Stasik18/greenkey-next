import Link from "next/link";
import { SectionHeading } from "./SectionHeading";

export function ContactsSection() {
  return (
    <section id="contacts" className="bg-surface-muted px-6 py-32 max-sm:py-20">
      <div className="mx-auto max-w-[1200px]">
        <SectionHeading
          eyebrow="07 — Свяжитесь с нами"
          title={
            <>
              Начните
              <br />
              сегодня
            </>
          }
        />
        <div className="mt-12 grid grid-cols-2 gap-14 max-[800px]:grid-cols-1">
          <div className="space-y-8">
            <div>
              <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-muted">
                Телефон / MAX / Telegram
              </h3>
              <a
                href="tel:+79035120326"
                className="font-heading text-2xl font-black"
              >
                +7 (903) 512-03-26
              </a>
              <div className="mt-4 flex flex-wrap gap-2">
                <a
                  href="https://max.ru/79035120326"
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-border bg-white px-4 py-2 text-sm"
                >
                  MAX
                </a>
                <a
                  href="https://t.me/+79035120326"
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-border bg-white px-4 py-2 text-sm"
                >
                  Telegram
                </a>
              </div>
              <p className="mt-2 text-xs text-muted">
                Макс — руководитель проектов
              </p>
            </div>
            <div>
              <h3 className="mb-2 text-xs font-bold uppercase tracking-widest text-muted">
                Email
              </h3>
              <a href="mailto:dafo40@yandex.ru" className="font-semibold">
                dafo40@yandex.ru
              </a>
            </div>
            <div>
              <h3 className="mb-2 text-xs font-bold uppercase tracking-widest text-muted">
                Режим работы
              </h3>
              <p>Ежедневно: 9:00–18:00</p>
            </div>
            <div>
              <h3 className="mb-2 text-xs font-bold uppercase tracking-widest text-muted">
                Регион работы
              </h3>
              <p>
                Москва и Московская область
                <br />
                Бесплатный выезд на замер
              </p>
            </div>
          </div>
          <form className="rounded-xl bg-white p-8 shadow-sm max-sm:p-5">
            <h3 className="mb-6 font-heading text-2xl font-black">
              Оставить заявку
            </h3>
            <div className="space-y-4">
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
                Тип услуги
                <select
                  name="service"
                  className="mt-2 w-full rounded border border-border px-4 py-3 font-normal"
                >
                  <option value="">Выберите услугу...</option>
                  <option>Строительство каркасного дома</option>
                  <option>Ремонт и отделка</option>
                  <option>Дизайн-проект</option>
                  <option>Кадастровые работы</option>
                  <option>Инженерные работы</option>
                  <option>Хоумстейджинг</option>
                  <option>Другое</option>
                </select>
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
                Жду звонка
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

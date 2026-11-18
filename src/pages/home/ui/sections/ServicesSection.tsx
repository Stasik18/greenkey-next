import { SectionHeading } from "./SectionHeading";

const SERVICES = [
  [
    "Дизайн-проекты",
    "Планировочные решения и дизайн интерьера под задачи и бюджет.",
  ],
  [
    "Инженерные работы",
    "Электрика, водоснабжение, канализация, отопление и вентиляция.",
  ],
  [
    "Кадастровые работы",
    "Помощь с документацией и вопросами по земельному участку.",
  ],
  ["Хоумстейджинг", "Подготовка недвижимости к продаже или сдаче в аренду."],
];

export function ServicesSection() {
  return (
    <section id="services" className="bg-surface-muted px-6 py-32 max-sm:py-20">
      <div className="mx-auto max-w-[1200px]">
        <SectionHeading
          eyebrow="04 — Дополнительные направления"
          title="Больше, чем строительство"
          description="Закрываем смежные задачи, чтобы вам не приходилось собирать подрядчиков по отдельности."
        />
        <div className="mt-12 grid grid-cols-4 gap-4 max-[900px]:grid-cols-2 max-sm:grid-cols-1">
          {SERVICES.map(([title, text], index) => (
            <article
              key={title}
              className={`rounded-xl p-7 ${index === 0 ? "bg-brand-green text-ink" : "bg-white"}`}
            >
              <span
                className={`font-heading text-sm font-black ${index === 0 ? "text-ink/45" : "text-brand-orange"}`}
              >
                0{index + 1}
              </span>
              <h3 className="mt-8 font-heading text-xl font-extrabold">
                {title}
              </h3>
              <p
                className={`mt-3 text-sm leading-relaxed ${index === 0 ? "text-ink/70" : "text-muted"}`}
              >
                {text}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

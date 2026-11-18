import { SectionHeading } from "./SectionHeading";

const PACKAGES = [
  {
    name: "Пакет А",
    title: "Черновые работы",
    text: "Демонтаж, выравнивание стен и полов, устройство стяжки, разводка электрики и сантехники, штукатурка.",
    price: "от 16 000 ₽/м²",
  },
  {
    name: "Пакет Б",
    title: "Чистовые работы",
    text: "Укладка плитки и ламината, покраска стен и потолков, установка дверей, монтаж сантехники и светильников без стоимости материалов.",
    price: "от 24 000 ₽/м²",
  },
  {
    name: "Пакет В — Хит",
    title: "Чистовые с материалом",
    text: "Полный комплект: работы плюс все необходимые материалы. Один договор, фиксированная цена, без дополнительных расходов.",
    price: "от 35 000 ₽/м²",
  },
];

export function RepairSection() {
  return (
    <section id="repair" className="bg-surface-muted px-6 py-32 max-sm:py-20">
      <div className="mx-auto max-w-[1200px]">
        <SectionHeading
          eyebrow="02 — Жилые и коммерческие помещения"
          title={
            <>
              Ремонт и внутренняя
              <br />
              отделка
            </>
          }
          description="Выполняем все виды ремонтных и отделочных работ. От чернового выравнивания до чистовой отделки «под ключ» с материалами."
        />
        <div className="mt-12 grid grid-cols-3 gap-5 max-[850px]:grid-cols-1">
          {PACKAGES.map((item, index) => (
            <article
              key={item.name}
              className={`rounded-xl border bg-white p-8 ${index === 2 ? "border-brand-green bg-[linear-gradient(135deg,rgba(34,197,94,.06),white)]" : "border-border"}`}
            >
              <p className="mb-5 text-xs font-bold uppercase tracking-wider text-brand-orange">
                {item.name}
              </p>
              <h3 className="mb-4 font-heading text-2xl font-extrabold">
                {item.title}
              </h3>
              <p className="min-h-28 text-sm leading-relaxed text-muted">
                {item.text}
              </p>
              <p className="mt-7 font-heading text-xl font-black">
                {item.price}
              </p>
            </article>
          ))}
        </div>
        <div className="mt-16 rounded-2xl bg-white p-8 shadow-sm max-sm:p-5">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-orange">
            Рассчитайте стоимость
          </p>
          <h3 className="mt-3 font-heading text-3xl font-black">
            Калькулятор ремонта и отделки
          </h3>
          <div className="mt-8 grid grid-cols-2 gap-8 max-[700px]:grid-cols-1">
            <div>
              <label
                htmlFor="repair-area-preview"
                className="mb-3 block font-heading text-sm font-bold"
              >
                Площадь помещения: 80 м²
              </label>
              <input
                id="repair-area-preview"
                type="range"
                min="10"
                max="1000"
                defaultValue="80"
                className="w-full accent-brand-green"
              />
              <div className="mt-2 flex justify-between text-xs text-muted">
                <span>10 м²</span>
                <span>1000 м²</span>
              </div>
            </div>
            <div className="text-center">
              <p className="text-xs font-bold uppercase tracking-widest text-muted">
                Примерная стоимость
              </p>
              <p className="mt-2 font-heading text-4xl font-black">
                1 280 000 ₽
              </p>
              <a
                href="#contacts"
                className="mt-6 inline-flex rounded-md bg-brand-green px-8 py-4 font-heading text-sm font-extrabold uppercase text-ink"
              >
                Получить смету
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

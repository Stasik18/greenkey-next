import { ConstructionCalculatorSection } from "./ConstructionCalculatorSection";
import { SectionHeading } from "./SectionHeading";

const PACKAGES = [
  {
    name: "Тёплый контур — пакет А",
    title: "Что входит в тёплый контур",
    text: "Железобетонные сваи, силовой каркас дома 200 мм, кровля из металлочерепицы, окна профиля 70 мм, входная дверь, фасад «имитация бруса», закладные для инженерных коммуникаций и ОСБ на полу.",
  },
  {
    name: "Под ключ — пакет Б",
    title: "Всё из пакета А плюс инженерные коммуникации",
    text: "Водоснабжение, канализация, электричество, бойлер, котёл, радиаторы, септик и скважина на песок под ключ.",
  },
  {
    name: "Благоустройство — пакет В",
    title: "Что входит в благоустройство",
    text: "Забор, ворота, калитка, въездная группа, стоянка автомобиля, дорожки, озеленение территории и дренаж участка. Стоимость рассчитывается индивидуально.",
  },
];

const BENEFITS = [
  "Строительство за 3–6 месяцев",
  "Высокая энергоэффективность",
  "Любая планировка и дизайн",
  "Фиксированная цена по договору",
  "Гарантия 3 года на все виды работ",
  "Бесплатный выезд на замер",
];

export function KarkasSection() {
  return (
    <section id="karkas" className="px-6 py-32 max-sm:py-20">
      <div className="mx-auto max-w-[1200px]">
        <SectionHeading
          eyebrow="01 — Наше основное направление"
          title={
            <>
              Строительство
              <br />
              каркасных домов
            </>
          }
          description="Быстро, тепло, надёжно. Строим каркасные дома под ключ в Москве и Московской области. Полный цикл — от проекта до сдачи объекта."
        />
        <div className="mt-12 grid grid-cols-[1.1fr_.9fr] gap-12 max-[800px]:grid-cols-1">
          <div className="space-y-8">
            {PACKAGES.map((item) => (
              <article key={item.name}>
                <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-brand-green/10 px-4 py-2 text-xs font-bold text-ink">
                  <span className="h-2 w-2 rounded-full bg-brand-green" />
                  {item.name}
                </span>
                <h3 className="mb-2 font-heading text-xl font-extrabold">
                  {item.title}
                </h3>
                <p className="leading-relaxed text-muted">{item.text}</p>
              </article>
            ))}
          </div>
          <aside className="rounded-2xl bg-surface-muted p-9 max-sm:p-6">
            <p className="mb-5 text-xs font-bold uppercase tracking-[0.18em] text-brand-orange">
              Преимущества
            </p>
            <ul className="space-y-4">
              {BENEFITS.map((benefit) => (
                <li
                  key={benefit}
                  className="flex items-start gap-3 text-sm leading-relaxed"
                >
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-green text-xs font-black">
                    ✓
                  </span>
                  {benefit}
                </li>
              ))}
            </ul>
          </aside>
        </div>
        <ConstructionCalculatorSection />
      </div>
    </section>
  );
}

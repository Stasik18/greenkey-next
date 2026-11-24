import type { ReactNode } from "react";
import Link from "next/link";
import { Container, Icon, Typography } from "@/shared/ui";
import { PriceCalculator } from "../components/PriceCalculator";

const packages = [
  {
    label: "Тёплый контур - пакет А",
    title: "Что входит в тёплый контур",
    description:
      "Сваи железобетонные · Силовой каркас дома 200 мм · Кровля металлочерепица · Окна профиль 70 мм · Входная дверь · Фасад имитация бруса · Закладные для инженерных коммуникаций · ОСБ на пол внутри",
  },
  {
    label: "Под ключ - пакет Б",
    title: "Всё из пакета А плюс инженерные коммуникации",
    description:
      "Водоснабжение, канализация, электричество, бойлер, котёл, радиаторы, септик, скважина на песок под ключ",
  },
  {
    label: "Благоустройство - пакет В",
    title: "Что входит в благоустройство",
    description:
      "Забор, ворота, калитка, въездная группа, стоянка авто, дорожки, озеленение территории, дренаж участка - рассчитывается индивидуально",
  },
];

const benefits = [
  "Строительство за 3–6 месяцев",
  "Высокая энергоэффективность",
  "Любая планировка и дизайн",
  "Фиксированная цена по договору",
  "Гарантия 3 года на все виды работ",
  "Бесплатный выезд на замер",
];

export function KarkasSection() {
  return (
    <section id="karkas" className="py-20 md:py-28">
      <Container>
        <SectionHeading
          eyebrow="01 - Наше основное направление"
          title={
            <>
              Строительство
              <br />
              каркасных домов
            </>
          }
          description="Быстро, тепло, надёжно. Строим каркасные дома под ключ в Москве и Московской области. Полный цикл - от проекта до сдачи объекта."
        />

        <div className="mt-12 grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-8">
            {packages.map((item) => (
              <article key={item.label} className="reveal">
                <span className="inline-flex items-center gap-2 rounded-full bg-brand-green px-4 py-2 text-sm font-bold text-ink">
                  <Icon name="Check" size={16} />
                  {item.label}
                </span>
                <Typography variant="h3" className="mt-4">
                  {item.title}
                </Typography>
                <Typography className="mt-3 max-w-2xl text-muted">
                  {item.description}
                </Typography>
              </article>
            ))}
          </div>

          <aside className="reveal rounded-2xl bg-surface-muted p-7 md:p-9">
            <Typography variant="eyebrow" className="text-brand-orange">
              Преимущества
            </Typography>
            <ul className="mt-6 space-y-4">
              {benefits.map((benefit) => (
                <li key={benefit} className="flex items-start gap-3">
                  <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-brand-green">
                    <Icon name="Check" size={15} />
                  </span>
                  <Typography>{benefit}</Typography>
                </li>
              ))}
            </ul>
          </aside>
        </div>

        <div className="mt-16">
          <Typography variant="eyebrow" className="text-brand-orange">
            Рассчитайте стоимость
          </Typography>
          <Typography as="h3" variant="h3" className="mt-3">
            Калькулятор каркасного дома
          </Typography>

          <PriceCalculator kind="house" />

          <Link
            href="/calculator"
            className="group mt-5 flex items-center justify-between gap-5 rounded-xl bg-ink p-6 text-white transition duration-200 hover:-translate-y-1 hover:bg-ink/95 hover:shadow-xl"
          >
            <span>
              <strong className="block font-heading">
                Подробный калькулятор комплектаций
              </strong>
              <span className="mt-1 block text-sm text-white/55">
                Соберите дом по опциям - фундамент, отделка, терраса, забор,
                участок - и узнайте точную стоимость
              </span>
            </span>
            <span
              aria-hidden="true"
              className="text-3xl text-brand-green transition-colors duration-200 group-hover:text-brand-orange"
            >
              →
            </span>
          </Link>
        </div>
      </Container>
    </section>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: ReactNode;
  description: string;
}) {
  return (
    <header>
      <Typography variant="eyebrow" className="mb-4 text-brand-orange">
        {eyebrow}
      </Typography>
      <Typography as="h2" variant="h2">
        {title}
      </Typography>
      <Typography className="mt-5 max-w-2xl text-muted">
        {description}
      </Typography>
    </header>
  );
}

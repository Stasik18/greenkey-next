import Image from "next/image";
import { Container, Typography } from "@/shared/ui";

const partners = [
  {
    name: "Каркас+",
    kind: "Домокомплекты и фермы",
    description:
      "Производственный комплекс в Москве: домокомплекты каркасных домов, деревянные стропильные фермы на МЗП, модульные дома и мобильные бани. Индивидуальное проектирование и каталог готовых проектов.",
    href: "https://karkas.plus/",
    domain: "karkas.plus",
    logo: "/assets/partners/karkas-plus.webp",
    width: 378,
    height: 160,
  },
  {
    name: "СпецСтройСнаб",
    kind: "Кровля, фасад, заборы",
    description:
      "Материалы для кровли, фасада и забора: металлочерепица, мягкая и композитная кровля, профнастил, сайдинг, софиты, евроштакетник, водостоки и крепёж. Склады в Москве и области.",
    href: "https://specstroy-snab.ru/",
    domain: "specstroy-snab.ru",
    logo: "/assets/partners/specstroy-snab.svg",
    width: 803,
    height: 151,
  },
];

export function PartnersSection() {
  return (
    <section id="partners" className="bg-surface-muted py-20 md:py-28">
      <Container>
        <Typography variant="eyebrow" className="text-brand-orange">
          04 - Партнёры
        </Typography>
        <Typography as="h2" variant="h2" className="mt-4">
          С кем мы
          <br />
          работаем
        </Typography>
        <Typography className="mt-5 max-w-2xl text-muted">
          Производство домокомплектов и поставка материалов для наших объектов.
          Карточка открывает сайт партнёра в новой вкладке.
        </Typography>
        <div className="partners-grid mt-12 grid gap-6 lg:grid-cols-2">
          {partners.map((partner, index) => (
            <a
              key={partner.name}
              href={partner.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`partner-card reveal reveal-delay-${index + 1} group overflow-hidden rounded-2xl border border-border bg-white transition hover:-translate-y-1 hover:shadow-xl`}
            >
              <div className="partner-logo flex h-36 items-center justify-center border-b border-border bg-white p-8">
                <Image
                  src={partner.logo}
                  alt={`Логотип ${partner.name}`}
                  width={partner.width}
                  height={partner.height}
                  className="max-h-20 w-auto max-w-full object-contain"
                />
              </div>
              <div className="partner-body p-7 md:p-8">
                <Typography variant="eyebrow" className="text-brand-orange">
                  {partner.kind}
                </Typography>
                <Typography variant="h3" className="mt-2">
                  {partner.name}
                </Typography>
                <Typography className="mt-3 text-muted">
                  {partner.description}
                </Typography>
                <span className="partner-link mt-6 inline-flex items-center gap-2 font-bold text-ink transition group-hover:text-brand-green">
                  {partner.domain} <span aria-hidden="true">↗</span>
                </span>
              </div>
            </a>
          ))}
        </div>
      </Container>
    </section>
  );
}

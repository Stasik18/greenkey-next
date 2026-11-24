const items = [
  "Каркасные дома",
  "Ремонт и отделка",
  "Дизайн-проекты",
  "Строим под ключ",
];

export function MarqueeSection() {
  return (
    <div
      className="marquee overflow-hidden border-y border-border bg-surface py-5"
      aria-label="Направления работы"
    >
      <div className="marquee-track flex w-max items-center gap-7 whitespace-nowrap font-heading text-sm font-extrabold uppercase tracking-[0.16em] text-ink/75 md:gap-10 md:text-base">
        {[...items, ...items, ...items].map((item, index) => (
          <span
            key={`${item}-${index}`}
            className="flex items-center gap-7 md:gap-10"
          >
            {item}
            <span aria-hidden="true" className="text-brand-orange">
              •
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}

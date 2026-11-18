const STATS = [
  { value: "100+", label: "Домов построено" },
  { value: "15", label: "Лет на рынке" },
  { value: "3–6 мес", label: "Срок строительства" },
  { value: "3 года", label: "Гарантии" },
];

export function StatsSection() {
  return (
    <section id="numbers-grid" className="bg-ink px-6 pb-20 pt-8">
      <div className="mx-auto grid max-w-[1200px] grid-cols-4 gap-px overflow-hidden rounded-xl bg-white/10 max-[700px]:grid-cols-2">
        {STATS.map((item) => (
          <div
            key={item.label}
            className="bg-ink px-6 py-12 text-center max-sm:px-3 max-sm:py-8"
          >
            <div className="font-heading text-[clamp(2rem,4vw,4rem)] font-black leading-none text-brand-green">
              {item.value}
            </div>
            <p className="mt-3 text-xs font-medium uppercase tracking-wider text-white/45">
              {item.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

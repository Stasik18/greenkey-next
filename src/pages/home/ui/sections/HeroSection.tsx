import Link from "next/link";

export function HeroSection() {
  return (
    <section
      id="about"
      className="relative flex min-h-[min(900px,100svh)] items-center justify-center overflow-hidden bg-ink px-6 py-24 text-center"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(180deg,rgba(26,26,26,.45),rgba(26,26,26,.78)_78%,#1a1a1a_100%),url('/assets/house-06.webp')] bg-cover bg-center"
      />
      <div className="relative z-10 mx-auto w-full max-w-[1000px]">
        <p className="mb-5 inline-flex rounded-full border border-brand-green px-[18px] py-[7px] text-xs font-bold uppercase tracking-[0.15em] text-brand-green">
          Москва и Московская область
        </p>
        <h1 className="mb-6 font-heading text-[clamp(2.6rem,6vw,5.8rem)] font-black leading-[0.96] tracking-[-0.04em] text-white">
          Строим
          <br />
          <span className="text-brand-green">дома,</span> в которых
          <br />
          хочется жить
        </h1>
        <p className="mx-auto mb-9 max-w-2xl text-[clamp(.95rem,2vw,1.1rem)] text-white/60">
          Каркасные дома под ключ, ремонт и отделка. Полный цикл работ от
          проекта до сдачи объекта.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3.5">
          <a
            href="#contacts"
            className="rounded bg-brand-green px-10 py-[17px] font-heading text-sm font-extrabold uppercase tracking-[0.05em] text-ink transition-transform hover:-translate-y-0.5"
          >
            Бесплатный замер
          </a>
          <Link
            href="/calculator"
            className="rounded border-2 border-white/30 px-10 py-[15px] font-heading text-sm font-bold uppercase tracking-[0.05em] text-white transition-colors hover:border-brand-green hover:bg-brand-green/10"
          >
            Рассчитать стоимость
          </Link>
        </div>
      </div>
      <div className="absolute bottom-14 right-8 z-10 rounded-2xl bg-brand-green px-6 py-4 text-3xl font-black text-ink max-sm:bottom-5 max-sm:right-4">
        100+
        <span className="mt-1 block text-[10px] font-semibold uppercase tracking-wider">
          построенных домов
        </span>
      </div>
      <a
        href="#numbers-grid"
        className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 text-[11px] uppercase tracking-widest text-white/40"
      >
        Прокрутите вниз
      </a>
    </section>
  );
}

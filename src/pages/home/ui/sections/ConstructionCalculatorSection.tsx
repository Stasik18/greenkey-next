import Link from "next/link";

export function ConstructionCalculatorSection() {
  return (
    <div className="mt-16">
      <p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-brand-orange">
        Рассчитайте стоимость
      </p>
      <div className="rounded-2xl bg-white p-8 shadow-[0_4px_40px_rgba(26,26,26,.08)] max-sm:p-5">
        <div className="grid grid-cols-3 gap-1 rounded-lg bg-surface-muted p-1 max-[650px]:grid-cols-1">
          <div className="rounded-md bg-white p-4 text-center shadow-sm">
            <strong className="block font-heading text-sm">
              А — Тёплый контур
            </strong>
            <span className="text-xs text-muted">от 60 000 ₽/м²</span>
          </div>
          <div className="p-4 text-center">
            <strong className="block font-heading text-sm">Б — Под ключ</strong>
            <span className="text-xs text-muted">от 100 000 ₽/м²</span>
          </div>
          <div className="p-4 text-center">
            <strong className="block font-heading text-sm">
              В — Благоустройство
            </strong>
            <span className="text-xs text-muted">индивидуально</span>
          </div>
        </div>
        <div className="mt-8 grid grid-cols-2 items-center gap-10 max-[700px]:grid-cols-1">
          <div>
            <div className="mb-4 flex justify-between gap-4 font-heading text-sm font-bold">
              <label htmlFor="home-area-preview">Площадь дома</label>
              <span className="text-brand-orange">150 м²</span>
            </div>
            <input
              id="home-area-preview"
              type="range"
              min="20"
              max="1000"
              defaultValue="150"
              className="w-full accent-brand-green"
            />
            <div className="mt-2 flex justify-between text-xs text-muted">
              <span>20 м²</span>
              <span>1000 м²</span>
            </div>
            <p className="mt-6 rounded-lg bg-surface-muted p-4 text-sm leading-relaxed text-muted">
              В стоимость входят фундамент, каркас, кровля, окна, дверь и фасад.
              Точный состав зависит от комплектации.
            </p>
          </div>
          <div className="text-center">
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-muted">
              Примерная стоимость
            </p>
            <p className="font-heading text-4xl font-black">9 000 000 ₽</p>
            <p className="mt-2 text-sm text-muted">
              Точная смета — после бесплатного замера
            </p>
            <a
              href="#contacts"
              className="mt-7 inline-flex rounded-md bg-brand-green px-8 py-4 font-heading text-sm font-extrabold uppercase text-ink"
            >
              Получить смету
            </a>
          </div>
        </div>
      </div>
      <Link
        href="/calculator"
        className="mt-5 flex items-center justify-between gap-5 rounded-xl bg-ink p-6 text-white transition-colors hover:bg-ink/90"
      >
        <span>
          <strong className="block font-heading">
            Подробный калькулятор комплектаций
          </strong>
          <span className="mt-1 block text-sm text-white/50">
            Соберите дом по опциям и узнайте стоимость
          </span>
        </span>
        <span aria-hidden="true" className="text-3xl text-brand-green">
          →
        </span>
      </Link>
    </div>
  );
}

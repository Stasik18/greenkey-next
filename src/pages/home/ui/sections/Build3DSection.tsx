export function Build3DSection() {
  return (
    <section
      id="build"
      className="relative overflow-hidden bg-ink px-6 py-28 text-white"
    >
      <div className="mx-auto grid max-w-[1200px] grid-cols-2 items-center gap-12 max-[800px]:grid-cols-1">
        <div>
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-brand-orange">
            Как рождается ваш дом
          </p>
          <h2 className="font-heading text-4xl font-black leading-tight">
            От фундамента
            <br />
            до ключей
          </h2>
          <p className="mt-5 max-w-lg leading-relaxed text-white/55">
            Показываем основные этапы строительства каркасного дома: фундамент,
            силовой каркас, стены и фасад, кровля, окна и двери, готовый дом.
          </p>
          <p className="mt-6 text-sm text-white/35">
            Интерактивная 3D-сцена будет подключена отдельно из исходного модуля
            build3d.
          </p>
        </div>
        <div className="flex aspect-[4/3] items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] p-8">
          <div className="text-center">
            <div className="mx-auto mb-5 grid h-24 w-24 place-items-center rounded-2xl bg-brand-green/10 text-5xl text-brand-green">
              ⌂
            </div>
            <p className="font-heading text-xl font-extrabold">
              Этапы строительства
            </p>
            <p className="mt-2 text-sm text-white/40">
              3D-визуализация подключается следующим этапом
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

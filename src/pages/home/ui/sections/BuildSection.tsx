import { Container, Typography } from "@/shared/ui";
import { STAGES } from "../../lib/build-scene";

export function BuildSection() {
  return (
    <section id="build" className="build-section bg-ink text-white">
      <Container className="grid items-center gap-10 py-24 lg:grid-cols-[0.8fr_1.2fr] lg:py-32">
        <div className="build-left">
          <Typography as="h2" variant="eyebrow" className="text-brand-orange">
            Как рождается ваш дом
          </Typography>

          <ol className="mt-8 space-y-5">
            {STAGES.map((stage, index) => (
              <li key={stage.title} className="flex gap-4">
                <span className="font-heading text-2xl font-black text-brand-green">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <Typography as="h3" variant="h3" className="text-white">
                    {stage.title}
                  </Typography>
                  <p className="mt-2 max-w-lg text-sm leading-relaxed text-white/60">
                    {stage.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>

          <button
            type="button"
            data-modal-open="modal-call"
            className="mt-9 rounded bg-brand-green px-7 py-4 font-heading text-sm font-extrabold uppercase tracking-wide text-ink transition hover:-translate-y-0.5 hover:bg-brand-orange"
          >
            Рассчитать мой дом
          </button>
        </div>

        <div
          className="build-placeholder relative flex min-h-[320px] items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white/[0.035] lg:min-h-[520px]"
          aria-label="Место для будущего слайдера этапов строительства"
        >
          <div className="build-placeholder-mark" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <p className="absolute bottom-7 left-7 right-7 text-center text-xs font-semibold uppercase tracking-[0.18em] text-white/35">
            Визуализация этапов строительства
          </p>
        </div>
      </Container>
    </section>
  );
}

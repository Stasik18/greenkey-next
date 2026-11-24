import { Button, Container, Typography } from "@/shared/ui";
import { LeadForm } from "@/shared/ui/lead-form";

export function HeroSection() {
  return (
    <section
      id="about"
      className="hero-stage relative isolate flex min-h-[min(900px,calc(100svh-5rem))] items-center overflow-hidden bg-ink text-white"
    >
      <div className="hero-bg absolute inset-0 -z-20 overflow-hidden">
        <video
          className="hero-bg-video absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          poster="/assets/house-01.webp"
          data-poster="/assets/house-01.webp"
          data-speed="0.6"
          data-src="/assets/hero-bg.mp4"
          data-src-mobile="/assets/hero-bg-mobile.mp4"
          aria-hidden="true"
        />
        <div className="hero-overlay absolute inset-0 bg-gradient-to-b from-ink/45 via-ink/65 to-ink" />
      </div>

      <canvas
        id="particles-canvas"
        className="pointer-events-none absolute inset-0 -z-10 h-full w-full opacity-60"
        aria-hidden="true"
      />

      <Container className="hero-inner relative z-10 w-full py-28 md:py-36">
        <div className="mx-auto max-w-5xl text-center">
          <span className="inline-flex rounded-full border border-brand-green/70 px-5 py-2 text-xs font-bold uppercase tracking-[0.18em] text-brand-green">
            Москва и Московская область
          </span>

          <Typography
            as="h1"
            variant="display"
            className="hero-title mt-8 text-white"
          >
            <span className="block">
              <span className="word" style={{ animationDelay: "0.5s" }}>
                Строим
              </span>
            </span>
            <span className="block">
              <span
                className="word accent text-brand-green"
                style={{ animationDelay: "0.7s" }}
              >
                дома,
              </span>{" "}
              <span className="word" style={{ animationDelay: "0.85s" }}>
                в которых
              </span>
            </span>
            <span className="block">
              <span className="word" style={{ animationDelay: "1s" }}>
                хочется жить
              </span>
            </span>
          </Typography>

          <Typography
            id="typewriter"
            className="hero-sub mx-auto mt-7 min-h-[1.7em] max-w-2xl text-base text-white/70 md:text-lg"
          >
            Каркасные дома под ключ, ремонт и отделка
          </Typography>

          <div className="hero-cta-row mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              size="lg"
              className="hero-primary magnetic ripple min-h-[98px] min-w-[260px] rounded-[4px] px-10 font-heading text-sm font-extrabold uppercase tracking-wide text-ink"
              data-modal-open="modal-measure"
            >
              Бесплатный замер
            </Button>

            <LeadForm
              source="index-hero"
              className="hero-form w-full max-w-[430px] text-left"
            >
              <div className="hero-form-row flex flex-col gap-2 sm:flex-row">
                <label className="sr-only" htmlFor="hero-phone">
                  Ваш телефон для обратного звонка
                </label>
                <input
                  id="hero-phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  inputMode="tel"
                  maxLength={24}
                  placeholder="+7 (903) 000-00-00"
                  required
                  className="min-h-12 min-w-0 flex-1 rounded border-2 border-white/30 bg-ink/40 px-[18px] text-white outline-none placeholder:text-white/45 transition focus:border-brand-green focus:bg-ink/60"
                />
                <Button
                  unstyled
                  type="submit"
                  className="hero-form-btn ripple min-h-12 rounded bg-white px-[26px] font-heading text-[13px] font-extrabold uppercase tracking-wide text-ink transition hover:-translate-y-0.5 hover:bg-brand-green"
                >
                  Перезвоните мне
                </Button>
              </div>
              <div className="hp-field" aria-hidden="true">
                <label htmlFor="hero-website">Не заполняйте это поле</label>
                <input
                  id="hero-website"
                  name="website"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>
              <Consent id="hero-consent" />
            </LeadForm>
          </div>
        </div>

        <div className="hero-badge absolute bottom-8 right-6 hidden rounded-2xl bg-brand-green px-6 py-4 font-heading text-3xl font-black text-ink md:block lg:bottom-12 lg:right-12">
          100+
          <span className="mt-1 block text-[10px] font-bold uppercase tracking-wider">
            построенных домов
          </span>
        </div>
        <div
          aria-hidden="true"
          className="scroll-hint pointer-events-none absolute bottom-7 left-0 right-0 hidden flex-col items-center gap-2 text-[11px] font-medium uppercase tracking-[0.14em] text-white/35 md:flex"
        >
          <span aria-hidden="true" className="scroll-hint-line" />
          <span>Прокрутите вниз</span>
        </div>
      </Container>
    </section>
  );
}

function Consent({ id }: { id: string }) {
  return (
    <div className="form-consent-check mt-3 flex items-start gap-2 text-left text-[11px] leading-relaxed text-white/60">
      <input
        id={id}
        name="consent"
        type="checkbox"
        value="1"
        required
        className="mt-0.5 accent-brand-green"
      />
      <label htmlFor={id}>
        Согласен на обработку персональных данных и принимаю{" "}
        <a
          href="/privacy"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 hover:text-white"
        >
          политику конфиденциальности
        </a>
        .
      </label>
    </div>
  );
}

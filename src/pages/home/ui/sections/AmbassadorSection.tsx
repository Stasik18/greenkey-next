import Image from "next/image";
import { Container, Typography } from "@/shared/ui";

export function AmbassadorSection() {
  return (
    <section className="relative overflow-hidden bg-brand-green py-16 text-ink md:py-24">
      <div className="pointer-events-none absolute -right-8 top-1/2 -translate-y-1/2 select-none font-heading text-[clamp(5rem,17vw,17rem)] font-black leading-none text-ink/[0.06]">
        СПАРТАК
      </div>
      <Container className="relative grid items-center gap-12 md:grid-cols-[1.2fr_0.8fr]">
        <div className="reveal">
          <Typography as="p" variant="h2" className="max-w-3xl text-ink">
            Дом должен быть таким, чтобы в него хотелось возвращаться снова и
            снова - как на родной стадион.
          </Typography>
        </div>
        <div className="amb-meta reveal reveal-delay-2 flex items-center gap-6">
          <div className="amb-photo relative aspect-[4/5] w-36 shrink-0 overflow-hidden rounded-xl shadow-2xl sm:w-44">
            <Image
              src="/assets/amb-titov.webp"
              alt="Егор Титов, амбассадор бренда «Зелёный ключ»"
              fill
              sizes="(max-width: 640px) 144px, 176px"
              className="object-cover"
            />
          </div>
          <div>
            <Typography variant="h3" className="text-ink">
              Егор Титов
            </Typography>
            <Typography className="mt-2 max-w-xs text-sm leading-relaxed text-ink/70">
              Футболист ФК «Спартак» Москва, амбассадор бренда
            </Typography>
            <div className="amb-stripe mt-5 h-1 w-14 rounded-full bg-brand-orange" />
          </div>
        </div>
      </Container>
    </section>
  );
}

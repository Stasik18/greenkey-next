import { Container, Typography } from "@/shared/ui";

const metrics = [
  { target: "100", suffix: "+", label: "Домов построено" },
  { target: "15", suffix: "", label: "Лет на рынке" },
  { target: "6", prefix: "3–", suffix: " мес", label: "Срок строительства" },
  { target: "3", suffix: "", label: "Года гарантии" },
];

export function NumbersSection() {
  return (
    <section id="numbers" className="bg-ink py-16 text-white md:py-20">
      <Container>
        <div className="reveal">
          <Typography variant="eyebrow" className="text-brand-orange">
            15 лет на рынке
          </Typography>
          <Typography as="h2" variant="h2" className="mt-4 text-white">
            Доверие клиентов в цифрах
          </Typography>
        </div>
        <div
          id="numbers-grid"
          className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 md:grid-cols-4"
        >
          {metrics.map((metric, index) => (
            <div
              key={metric.label}
              className={`num-item reveal reveal-delay-${index + 1} bg-ink px-5 py-8 text-center md:px-8 md:py-10`}
            >
              <div className="num-val font-heading text-4xl font-black tracking-tight text-brand-green md:text-5xl">
                {metric.prefix}
                <span
                  className="counter"
                  data-target={metric.target}
                  data-suffix={metric.suffix}
                >
                  0
                </span>
              </div>
              <div className="num-label mt-3 text-xs font-bold uppercase tracking-wider text-white/55">
                {metric.label}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

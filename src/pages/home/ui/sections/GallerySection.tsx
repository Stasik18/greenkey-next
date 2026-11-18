import Image from "next/image";
import Link from "next/link";
import { Container, Typography } from "@/shared/ui";

const projects = [
  {
    title: "Дом в КП «Леоново-2»",
    details: "Московская обл. · 180 м² · 1 этаж",
    image: "/assets/gallery/leonovo-2/done-04.webp",
    href: "/gallery#leonovo-2",
    alt: "Готовый каркасный дом 180 м² в КП «Леоново-2»",
  },
  {
    title: "Дом в КП «Большое Брехово»",
    details: "Московская обл. · 112 м² · 1 этаж",
    image: "/assets/gallery/bolshoe-brehovo/done-01.webp",
    href: "/gallery#bolshoe-brehovo",
    alt: "Готовый каркасный дом 112 м² в КП «Большое Брехово»",
  },
];

export function GallerySection() {
  return (
    <section id="gallery" className="py-20 md:py-28">
      <Container>
        <Typography variant="eyebrow" className="text-brand-orange">
          05 - Наши работы
        </Typography>
        <Typography as="h2" variant="h2" className="mt-4">
          Галерея объектов
        </Typography>
        <Typography className="mt-5 max-w-2xl text-muted">
          Реальные дома, которые мы построили - с адресами и фотоотчётом
          строительства от первой сваи до готового дома. Нажмите на объект,
          чтобы посмотреть, как он рождался.
        </Typography>
        <div className="gallery-grid mt-12 grid gap-6 md:grid-cols-2">
          {projects.map((project) => (
            <Link
              key={project.href}
              href={project.href}
              className="gallery-card group relative overflow-hidden rounded-2xl bg-ink text-white"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={project.image}
                  alt={project.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <span className="gc-badge absolute left-5 top-5 rounded-full bg-brand-green px-3 py-1 text-xs font-bold text-ink">
                  <i className="mr-2 inline-block size-1.5 rounded-full bg-ink" />
                  Построен
                </span>
                <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-transparent to-transparent" />
              </div>
              <div className="gc-cap p-6 md:p-7">
                <Typography variant="h3" className="text-white">
                  {project.title}
                </Typography>
                <p className="gc-addr mt-2 text-sm text-white/55">
                  {project.details}
                </p>
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link
            href="/gallery"
            className="inline-flex rounded-lg bg-brand-green px-8 py-4 font-heading text-sm font-extrabold uppercase tracking-wide text-ink transition hover:bg-brand-green/90"
          >
            Все объекты и галерея строек →
          </Link>
        </div>
      </Container>
    </section>
  );
}

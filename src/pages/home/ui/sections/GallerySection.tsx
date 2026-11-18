import Image from "next/image";
import Link from "next/link";
import { SectionHeading } from "./SectionHeading";

const PROJECTS = [
  {
    title: "Дом в КП «Леоново-2»",
    details: "Московская обл. · 180 м² · 1 этаж",
    image: "/assets/gallery/leonovo-2/done-04.webp",
    href: "/gallery#leonovo-2",
    alt: "Готовый каркасный дом 180 м² в КП Леоново-2",
  },
  {
    title: "Дом в КП «Большое Брехово»",
    details: "Московская обл. · 112 м² · 1 этаж",
    image: "/assets/gallery/bolshoe-brehovo/done-01.webp",
    href: "/gallery#bolshoe-brehovo",
    alt: "Готовый каркасный дом 112 м² в КП Большое Брехово",
  },
];

export function GallerySection() {
  return (
    <section id="gallery" className="px-6 py-32 max-sm:py-20">
      <div className="mx-auto max-w-[1200px]">
        <SectionHeading
          eyebrow="05 — Наши работы"
          title="Галерея объектов"
          description="Реальные дома, которые мы построили — с адресами и фотоотчётом строительства от первой сваи до готового дома."
        />
        <div className="mt-12 grid grid-cols-2 gap-6 max-[700px]:grid-cols-1">
          {PROJECTS.map((project) => (
            <Link
              key={project.href}
              href={project.href}
              className="group overflow-hidden rounded-xl bg-ink text-white"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={project.image}
                  alt={project.alt}
                  fill
                  sizes="(max-width: 700px) 100vw, 50vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute left-5 top-5 rounded-full bg-brand-green px-3 py-1 text-xs font-bold text-ink">
                  Построен
                </span>
              </div>
              <div className="p-6">
                <h3 className="font-heading text-xl font-extrabold">
                  {project.title}
                </h3>
                <p className="mt-2 text-sm text-white/50">{project.details}</p>
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link
            href="/gallery"
            className="inline-flex rounded bg-brand-green px-8 py-4 font-heading text-sm font-extrabold uppercase text-ink"
          >
            Все объекты и галерея строек →
          </Link>
        </div>
      </div>
    </section>
  );
}

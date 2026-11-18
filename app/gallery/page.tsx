import "@/pages/gallery/ui/gallery.css";
import type { Metadata } from "next";
import { GalleryPage } from "@/pages/gallery";

export const metadata: Metadata = {
  title: "Галерея построенных каркасных домов",
  description:
    "Построенные каркасные дома под ключ в Москве и Московской области - реальные объекты с адресами и полной галереей строительства от фундамента до вручения ключей. Портфолио компании «Зелёный ключ».",
  alternates: { canonical: "/gallery" },
  openGraph: {
    title: "Галерея построенных каркасных домов",
    description:
      "Реальные построенные дома с адресами и полной галереей строительства - от фундамента до вручения ключей.",
    url: "https://sk-greenkey.ru/gallery",
    images: ["/assets/gallery/leonovo-2/done-04.webp"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Галерея построенных каркасных домов",
    description:
      "Реальные построенные дома с адресами и полной галереей строительства - от фундамента до вручения ключей.",
    images: ["/assets/gallery/leonovo-2/done-04.webp"],
  },
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Главная",
      item: "https://sk-greenkey.ru/",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Галерея объектов",
      item: "https://sk-greenkey.ru/gallery",
    },
  ],
};

export default function GalleryRoute() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <GalleryPage />
    </>
  );
}

import type { Metadata } from "next";
import { HomePage } from "@/pages/home/ui/HomePage";

export const metadata: Metadata = {
  title: "Каркасные дома под ключ и ремонт в Москве и МО",
  description:
    "Строительная компания «Зелёный ключ»: каркасные дома под ключ в Москве и Московской области за 3–6 месяцев, ремонт и отделка, дизайн-проекты. 100+ построенных домов, 15 лет опыта, гарантия 3 года, фиксированная цена по договору.",
  alternates: {
    canonical: "/",
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "GeneralContractor",
  "@id": "https://sk-greenkey.ru/#organization",
  name: "Зелёный ключ",
  alternateName: "СК «Зелёный ключ»",
  description:
    "Строительство каркасных домов под ключ, ремонт и отделка, дизайн-проекты в Москве и Московской области.",
  url: "https://sk-greenkey.ru/",
  image: "https://sk-greenkey.ru/assets/house-02.webp",
  telephone: "+7-903-512-03-26",
  email: "dafo40@yandex.ru",
  priceRange: "от 4 500 000 ₽",
  foundingDate: "2011",
  slogan: "Строим дома, в которых хочется жить",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Москва",
    addressRegion: "Московская область",
    addressCountry: "RU",
  },
  areaServed: [
    { "@type": "City", name: "Москва" },
    { "@type": "AdministrativeArea", name: "Московская область" },
  ],
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "09:00",
      closes: "18:00",
    },
  ],
  makesOffer: [
    {
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: "Строительство каркасных домов под ключ",
      },
    },
    {
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: "Ремонт и внутренняя отделка",
      },
    },
    {
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: "Дизайн-проекты интерьера",
      },
    },
  ],
  sameAs: ["https://max.ru/79035120326", "https://t.me/+79035120326"],
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <HomePage />
    </>
  );
}

import "@/pages/calculator/ui/calculator.css";
import type { Metadata } from "next";
import { CalculatorPage } from "@/pages/calculator";

export const metadata: Metadata = {
  title: "Калькулятор стоимости каркасного дома под ключ",
  description:
    "Онлайн-калькулятор строительства каркасного дома под ключ в Москве и МО. Соберите комплектацию - фундамент, отделка, кровля, фасад, участок - и узнайте стоимость. Базовый дом 100 м² от 4 500 000 ₽.",
  alternates: { canonical: "/calculator" },
  openGraph: {
    title: "Калькулятор стоимости каркасного дома под ключ",
    description:
      "Соберите комплектацию каркасного дома и узнайте стоимость онлайн. Базовый дом 100 м² от 4 500 000 ₽.",
    url: "https://sk-greenkey.ru/calculator",
    images: ["/assets/house-03.webp"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Калькулятор стоимости каркасного дома под ключ",
    description:
      "Соберите комплектацию каркасного дома и узнайте стоимость онлайн. Базовый дом 100 м² от 4 500 000 ₽.",
    images: ["/assets/house-03.webp"],
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
      name: "Калькулятор стоимости дома",
      item: "https://sk-greenkey.ru/calculator",
    },
  ],
};

export default function CalculatorRoute() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <CalculatorPage />
    </>
  );
}

import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

import { Inter, Montserrat } from "next/font/google";

import { MainLayout } from "@/app/layouts/MainLayout";
import "@/app/globals.css";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin", "cyrillic"],
  variable: "--font-montserrat",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#22C55E",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://sk-greenkey.ru"),
  authors: [{ name: "СК «Зелёный ключ»" }],
  keywords: [
    "каркасные дома под ключ",
    "строительство каркасного дома",
    "каркасные дома Москва",
    "каркасные дома Московская область",
    "ремонт и отделка под ключ",
    "дизайн-проект интерьера",
    "строительная компания Москва",
    "дом под ключ цена",
  ],
  robots: { index: true, follow: true },
  other: {
    "geo.region": "RU-MOS",
    "geo.placename": "Москва",
  },

  title: {
    default: "Каркасные дома под ключ и ремонт в Москве и МО - Зелёный ключ",
    template: "%s | Зелёный ключ",
  },

  description:
    "Строительная компания «Зелёный ключ»: каркасные дома под ключ, ремонт и отделка в Москве и Московской области.",

  openGraph: {
    type: "website",
    locale: "ru_RU",
    siteName: "Зелёный ключ",
    title: "Каркасные дома под ключ и ремонт - Зелёный ключ",
    description:
      "Строительство каркасных домов под ключ, ремонт и отделка в Москве и Московской области.",
    url: "https://sk-greenkey.ru",
    images: [
      {
        url: "/assets/house-02.webp",
        alt: "Каркасный дом под ключ от строительной компании «Зелёный ключ»",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Каркасные дома под ключ и ремонт в Москве и МО - Зелёный ключ",
    description:
      "Каркасные дома под ключ за 3-6 месяцев, ремонт и отделка, дизайн-проекты. 100+ домов, 15 лет опыта, гарантия 3 года.",
    images: ["/assets/house-02.webp"],
  },
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="ru">
      <body className={`${inter.variable} ${montserrat.variable}`}>
        <MainLayout>{children}</MainLayout>
      </body>
    </html>
  );
}

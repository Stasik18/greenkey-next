import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";

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

export const metadata: Metadata = {
  metadataBase: new URL("https://sk-greenkey.ru"),

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
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="ru">
      <body className={`${inter.variable} ${montserrat.variable}`}>
        {children}
      </body>
    </html>
  );
}

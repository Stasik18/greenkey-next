import "@/pages/privacy/ui/privacy.css";
import type { Metadata } from "next";
import { PrivacyPage } from "@/pages/privacy";

export const metadata: Metadata = {
  title: "Политика конфиденциальности",
  description:
    "Политика обработки персональных данных строительной компании «Зелёный ключ»: какие данные собирают формы сайта, зачем, куда передаются и как их удалить.",
  alternates: { canonical: "/privacy" },
  robots: { index: false, follow: true },
};

export default function PrivacyRoute() {
  return <PrivacyPage />;
}

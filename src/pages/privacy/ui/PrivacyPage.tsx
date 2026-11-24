import Link from "next/link";

import { PrivacyIdentitySections } from "./components/PrivacyIdentitySections";
import { PrivacyDataSections } from "./components/PrivacyDataSections";
import { PrivacyStorageSections } from "./components/PrivacyStorageSections";
import { PrivacyRightsSections } from "./components/PrivacyRightsSections";

export function PrivacyPage() {
  return (
    <main className="pp">
      <Link href="/" className="pp-back">
        ← На главную
      </Link>

      <header className="pp-header">
        <h1>Политика обработки персональных данных</h1>
        <p className="pp-lead">
          Что происходит с именем, телефоном и остальными сведениями, которые вы
          оставляете в формах на этом сайте.
        </p>
      </header>

      <PrivacyIdentitySections />
      <PrivacyDataSections />
      <PrivacyStorageSections />
      <PrivacyRightsSections />

      <p className="pp-updated">
        Редакция № 1 от 11 августа 2026 года. По этой дате можно установить,
        какую именно редакцию человек видел в момент отправки заявки.
      </p>
    </main>
  );
}

import Link from "next/link";

export function GalleryNote() {
  return (
    <aside className="gal-note" aria-label="Информация о галерее">
      <div className="gal-note-inner">
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="9.5" />
          <path d="M12 11v5" />
          <path d="M12 8h.01" />
        </svg>

        <p>
          <strong>Пополняем галерею.</strong> Фотоотчёты со строек новых
          объектов добавляются постепенно. Хотите посмотреть готовый дом вживую
          или пообщаться с нашими клиентами -{" "}
          <Link href="/#contacts">свяжитесь с нами</Link>, организуем показ.
        </p>
      </div>
    </aside>
  );
}

import Link from "next/link";

export function GalleryNote() {
  return (
    <div className="gal-note">
      Пополняем галерею. Фотоотчёты со строек новых объектов добавляются
      постепенно. Хотите посмотреть готовый дом вживую или пообщаться с нашими
      клиентами - <Link href="/#contacts">свяжитесь с нами</Link>, организуем
      показ.
    </div>
  );
}

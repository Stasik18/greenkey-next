import Link from "next/link";

export function GalleryHeader() {
  return (
    <header className="gal-head">
      <div className="gal-head-inner">
        <div className="gal-crumbs">
          <Link href="/">Главная</Link> / Галерея объектов
        </div>
        <span className="tag">Наши объекты</span>
        <h1>
          Дома, которые мы <span className="accent">построили</span>
        </h1>
        <p>
          Каждый объект - реальный дом с адресом и фотоотчётом стройки: от
          первой сваи до вручения ключей. Стройки, которые идут прямо сейчас,
          отмечены оранжевым - их галерея пополняется по ходу работ.
        </p>
        <div className="gal-stats">
          <div className="gal-stat">
            <b>100+</b>
            <span>домов построено</span>
          </div>
          <div className="gal-stat">
            <b>15</b>
            <span>лет на рынке</span>
          </div>
          <div className="gal-stat">
            <b>3</b>
            <span>года гарантии</span>
          </div>
        </div>
      </div>
    </header>
  );
}

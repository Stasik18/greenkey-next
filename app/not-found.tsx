import Link from "next/link";

export default function NotFound() {
  return (
    <main className="not-found-page">
      <div className="not-found-wrap">
        <div className="not-found-logo">
          Зелёный <span>ключ</span>
        </div>
        <div className="not-found-code">404</div>
        <h1>Такой страницы нет</h1>
        <p>
          Возможно, она переехала или адрес введён с ошибкой. Вернитесь на
          главную или посмотрите наши объекты.
        </p>
        <div className="not-found-actions">
          <Link href="/" className="not-found-primary">
            На главную
          </Link>
          <Link href="/gallery" className="not-found-secondary">
            Галерея объектов
          </Link>
        </div>
      </div>
    </main>
  );
}

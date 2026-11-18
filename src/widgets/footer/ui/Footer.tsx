import Link from "next/link";

const FOOTER_ANCHORS = [
  { label: "О нас", href: "#about" },
  { label: "Каркасные дома", href: "#karkas" },
  { label: "Ремонт", href: "#repair" },
  { label: "Услуги", href: "#services" },
  { label: "Партнёры", href: "#partners" },
  { label: "Вакансии", href: "#vacancies" },
  { label: "Контакты", href: "#contacts" },
];

const FOOTER_PAGES = [
  { label: "Калькулятор", href: "/calculator" },
  { label: "Галерея", href: "/gallery" },
  { label: "Политика конфиденциальности", href: "/privacy" },
];

const PHONE = "+79035120326";
const PHONE_LABEL = "+7 (903) 512-03-26";
const EMAIL = "dafo40@yandex.ru";

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-ink px-6 py-12 md:px-12 md:py-13">
      <div className="mx-auto grid max-w-300 grid-cols-1 items-center gap-8 md:grid-cols-[1fr_auto_1fr]">
        <div className="text-center md:text-left">
          <Link
            href="/"
            className="font-heading text-[1.1rem] font-black text-white"
          >
            Зелёный <span className="text-brand-green">ключ</span>
          </Link>

          <p className="mt-1.5 text-[0.82rem] text-white/30">
            Строим дома, в которых хочется жить
          </p>
        </div>

        <nav aria-label="Навигация в подвале">
          <ul className="flex flex-wrap justify-center gap-x-5 gap-y-3">
            {FOOTER_ANCHORS.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="text-[0.78rem] text-white/40 transition-colors hover:text-brand-green"
                >
                  {item.label}
                </a>
              </li>
            ))}

            {FOOTER_PAGES.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-[0.78rem] text-white/40 transition-colors hover:text-brand-green"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex flex-col items-center gap-1 text-center md:items-end md:text-right">
          <p className="text-[0.78rem] text-white/30">
            © 2011 СК «Зелёный ключ»
          </p>

          <a
            href={`tel:${PHONE}`}
            className="text-[0.78rem] text-white/30 transition-colors hover:text-brand-green"
          >
            {PHONE_LABEL}
          </a>

          <a
            href={`mailto:${EMAIL}`}
            className="text-[0.78rem] text-white/30 transition-colors hover:text-brand-green"
          >
            {EMAIL}
          </a>
        </div>
      </div>
    </footer>
  );
}

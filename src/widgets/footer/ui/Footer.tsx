import Link from "next/link";
import clsx from "clsx";

interface FooterProps {
  className?: string;
}

const NAV_ITEMS = [
  { label: "О нас", href: "/#about" },
  { label: "Каркасные дома", href: "/#karkas" },
  { label: "Ремонт", href: "/#repair" },
  { label: "Услуги", href: "/#services" },
  { label: "Калькулятор", href: "/calculator" },
  { label: "Галерея", href: "/gallery" },
  { label: "Партнёры", href: "/#partners" },
  { label: "Вакансии", href: "/#vacancies" },
  { label: "Контакты", href: "/#contacts" },
  { label: "Политика конфиденциальности", href: "/privacy" },
];

export function Footer({ className }: FooterProps) {
  return (
    <footer
      className={clsx(
        "border-t border-white/[0.06] bg-ink",
        "px-12 pt-[52px] pb-9",
        "max-[1100px]:px-6 max-[1100px]:pt-10 max-[1100px]:pb-7",
        className,
      )}
    >
      <div
        className={clsx(
          "mx-auto grid w-full max-w-[1200px]",
          "grid-cols-[minmax(0,1fr)_max-content_minmax(0,1fr)]",
          "items-center gap-8",
          "max-[900px]:grid-cols-1 max-[900px]:gap-5",
          "max-[900px]:text-center",
        )}
      >
        <div className="min-w-0">
          <div className="font-heading text-[1.1rem] font-black text-white">
            Зелёный <span className="text-brand-green">ключ</span>
          </div>

          <p className="mt-1.5 text-[0.82rem] leading-normal text-white/30">
            Строим дома, в которых хочется жить
          </p>
        </div>

        <nav aria-label="Навигация в подвале" className="min-w-0">
          <ul
            className={clsx(
              "m-0 flex list-none flex-wrap justify-center gap-x-5 gap-y-1 p-0",
              "max-[1100px]:gap-x-3",
              "max-[900px]:gap-x-5",
            )}
          >
            {NAV_ITEMS.map(({ label, href }) => (
              <li key={href} className="shrink-0">
                <Link
                  href={href}
                  className={clsx(
                    "inline-block py-[15px] text-[0.78rem]",
                    "whitespace-nowrap text-white/35 no-underline",
                    "transition-colors hover:text-brand-green",
                    "focus-visible:rounded-sm focus-visible:outline-2",
                    "focus-visible:outline-offset-[3px] focus-visible:outline-brand-green",
                  )}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="min-w-0 text-right max-[900px]:text-center">
          <p className="text-[0.78rem] text-white/25">
            © 2011 СК «Зелёный ключ»
          </p>

          <a
            href="tel:+79035120326"
            className="mt-1 block text-[0.78rem] text-white/25 transition-colors hover:text-brand-green"
          >
            +7 (903) 512-03-26
          </a>

          <a
            href="mailto:dafo40@yandex.ru"
            className="mt-1 block text-[0.78rem] text-white/25 transition-colors hover:text-brand-green"
          >
            dafo40@yandex.ru
          </a>
        </div>
      </div>
    </footer>
  );
}

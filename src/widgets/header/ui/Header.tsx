"use client";

import Link from "next/link";
import clsx from "clsx";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";

import {
  useClickOutside,
  useDisclosure,
  useKeyDown,
  useLockBodyScroll,
  useMediaQuery,
} from "@/shared/lib/hooks";

interface HeaderProps {
  className?: string;
}

const PHONE = "+79035120326";
const PHONE_LABEL = "+7 (903) 512-03-26";

const NAV_ITEMS = [
  { label: "О нас", href: "#about" },
  { label: "Каркасные дома", href: "#karkas" },
  { label: "Ремонт и отделка", href: "#repair" },
  { label: "Услуги", href: "#services" },
  { label: "Калькулятор", href: "/calculator" },
  { label: "Галерея", href: "/gallery" },
  { label: "Партнёры", href: "#partners" },
  { label: "Вакансии", href: "#vacancies" },
  { label: "Контакты", href: "#contacts" },
];

const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

function isInternalAnchor(href: string) {
  return href.startsWith("#");
}

export function Header({ className }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);

  const menu = useDisclosure();
  const isDesktop = useMediaQuery("(min-width: 1111px)");

  const burgerRef = useRef<HTMLButtonElement>(null);

  const menuRef = useClickOutside<HTMLDivElement>(menu.close, {
    isActive: menu.isOpen && !isDesktop,
  });

  const isClient = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  useLockBodyScroll(menu.isOpen);
  useKeyDown("Escape", menu.close, menu.isOpen);

  // Отслеживаем прокрутку страницы.
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 60);
    };

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Закрываем мобильное меню при переходе на десктоп.
  useEffect(() => {
    if (isDesktop && menu.isOpen) {
      menu.close();
    }
  }, [isDesktop, menu.isOpen, menu.close]);

  // Управляем фокусом мобильного меню.
  useEffect(() => {
    if (!menu.isOpen || isDesktop) return;

    const firstLink = menuRef.current?.querySelector<HTMLElement>("a");

    firstLink?.focus();

    return () => {
      burgerRef.current?.focus();
    };
  }, [menu.isOpen, isDesktop, menuRef]);

  const closeMenu = () => {
    menu.close();
  };

  const mobileMenu = isClient
    ? createPortal(
        <div
          className={clsx(
            "fixed inset-0 z-[200] bg-black/40",
            "transition-opacity duration-300",
            menu.isOpen
              ? "visible opacity-100"
              : "invisible pointer-events-none opacity-0",
          )}
          aria-hidden={!menu.isOpen}
        >
          <div
            ref={menuRef}
            id="mobile-navigation"
            role="dialog"
            aria-modal="true"
            aria-label="Мобильная навигация"
            inert={!menu.isOpen}
            className={clsx(
              "absolute inset-y-0 right-0 flex w-full max-w-md flex-col",
              "overflow-y-auto bg-white px-6 py-8 shadow-2xl",
              "transition-transform duration-300",
              menu.isOpen ? "translate-x-0" : "translate-x-full",
            )}
          >
            <div className="mb-12 flex items-center justify-between">
              <Link
                href="/"
                onClick={closeMenu}
                className="font-heading text-xl font-black tracking-tight"
              >
                Зелёный <span className="text-brand-green">ключ</span>
              </Link>

              <button
                type="button"
                onClick={closeMenu}
                aria-label="Закрыть меню"
                className={clsx(
                  "flex size-11 items-center justify-center",
                  "rounded-full border border-border text-2xl",
                  "transition-colors hover:bg-surface-muted",
                )}
              >
                &times;
              </button>
            </div>

            <nav aria-label="Мобильная навигация">
              <ul className="flex flex-col">
                {NAV_ITEMS.map((item) => (
                  <li key={item.href} className="border-b border-border">
                    {isInternalAnchor(item.href) ? (
                      <a
                        href={item.href}
                        onClick={closeMenu}
                        className={clsx(
                          "block py-4 font-heading text-lg font-bold",
                          "transition-colors hover:text-brand-green",
                        )}
                      >
                        {item.label}
                      </a>
                    ) : (
                      <Link
                        href={item.href}
                        onClick={closeMenu}
                        className={clsx(
                          "block py-4 font-heading text-lg font-bold",
                          "transition-colors hover:text-brand-green",
                        )}
                      >
                        {item.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </nav>

            <a
              href={`tel:${PHONE}`}
              className="mt-auto pt-10 font-heading text-xl font-extrabold"
            >
              {PHONE_LABEL}
            </a>
          </div>
        </div>,
        document.body,
      )
    : null;

  return (
    <>
      <header
        id="nav"
        className={clsx(
          "sticky top-0 z-[100]",
          "flex items-center justify-between",
          "border-b border-black/5 bg-white/95",
          "backdrop-blur-[14px]",
          "transition-[padding] duration-300",
          isScrolled ? "px-6 py-3 md:px-12" : "px-6 py-[18px] md:px-12",
          className,
        )}
      >
        <Link
          href="/"
          className="shrink-0 font-heading text-[1.15rem] font-black tracking-tight"
        >
          Зелёный <span className="text-brand-green">ключ</span>
        </Link>

        <nav className="mx-6 hidden min-[1111px]:block">
          <ul className="flex items-center gap-5 min-[1420px]:gap-7">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                {isInternalAnchor(item.href) ? (
                  <a
                    href={item.href}
                    className={clsx(
                      "group relative whitespace-nowrap",
                      "text-[0.78rem] font-bold uppercase tracking-wider",
                      "transition-colors hover:text-brand-green",
                    )}
                  >
                    {item.label}

                    <span
                      className={clsx(
                        "absolute -bottom-1 left-0 h-0.5 w-0",
                        "bg-brand-green transition-all duration-300",
                        "group-hover:w-full",
                      )}
                    />
                  </a>
                ) : (
                  <Link
                    href={item.href}
                    className={clsx(
                      "group relative whitespace-nowrap",
                      "text-[0.78rem] font-bold uppercase tracking-wider",
                      "transition-colors hover:text-brand-green",
                    )}
                  >
                    {item.label}

                    <span
                      className={clsx(
                        "absolute -bottom-1 left-0 h-0.5 w-0",
                        "bg-brand-green transition-all duration-300",
                        "group-hover:w-full",
                      )}
                    />
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex shrink-0 items-center gap-3">
          <a
            href={`tel:${PHONE}`}
            className={clsx(
              "hidden whitespace-nowrap rounded",
              "bg-brand-green px-6 py-3",
              "font-heading text-xs font-extrabold uppercase tracking-wider",
              "transition-colors hover:bg-brand-orange hover:text-white",
              "min-[1290px]:block",
            )}
          >
            {PHONE_LABEL}
          </a>

          <button
            ref={burgerRef}
            type="button"
            onClick={menu.toggle}
            aria-label={menu.isOpen ? "Закрыть меню" : "Открыть меню"}
            aria-expanded={menu.isOpen}
            aria-controls="mobile-navigation"
            className={clsx(
              "flex size-11 flex-col items-center justify-center gap-[6px]",
              "rounded border border-border",
              "transition-colors hover:bg-surface-muted",
              "min-[1111px]:hidden",
            )}
          >
            <span
              className={clsx(
                "h-0.5 w-6 bg-ink transition-transform duration-300",
                menu.isOpen && "translate-y-2 rotate-45",
              )}
            />

            <span
              className={clsx(
                "h-0.5 w-6 bg-ink transition-opacity duration-300",
                menu.isOpen && "opacity-0",
              )}
            />

            <span
              className={clsx(
                "h-0.5 w-6 bg-ink transition-transform duration-300",
                menu.isOpen && "-translate-y-2 -rotate-45",
              )}
            />
          </button>
        </div>
      </header>

      <a
        href={`tel:${PHONE}`}
        aria-label={`Позвонить ${PHONE_LABEL}`}
        className={clsx(
          "fixed bottom-6 right-6 z-[90]",
          "flex size-14 items-center justify-center",
          "rounded-full bg-brand-green text-xl shadow-lg",
          "transition-colors hover:bg-brand-orange",
          "min-[1290px]:hidden",
        )}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="size-6"
          aria-hidden="true"
        >
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.96.36 1.9.7 2.8a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.84.58 2.8.7A2 2 0 0 1 22 16.92z" />
        </svg>
      </a>

      {mobileMenu}
    </>
  );
}

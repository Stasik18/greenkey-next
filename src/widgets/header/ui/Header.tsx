"use client";

import { Button } from "@/shared/ui";

import Link from "next/link";
import clsx from "clsx";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";

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

function resolveNavigationHref(href: string, pathname: string) {
  if (!href.startsWith("#")) return href;

  return pathname === "/" ? href : `/${href}`;
}

export function Header({ className }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname() ?? "/";

  const menu = useDisclosure();
  const isMenuOpen = menu.isOpen;
  const closeMenu = menu.close;
  const isDesktop = useMediaQuery("(min-width: 1111px)");

  const burgerRef = useRef<HTMLButtonElement>(null);
  const mobileMenuRootRef = useRef<HTMLDivElement>(null);

  const menuRef = useClickOutside<HTMLDivElement>(menu.close, {
    isActive: isMenuOpen && !isDesktop,
  });

  const isClient = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  useLockBodyScroll(isMenuOpen);
  useKeyDown("Escape", menu.close, isMenuOpen);

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
    if (isDesktop && isMenuOpen) {
      closeMenu();
    }
  }, [isDesktop, isMenuOpen, closeMenu]);

  // Мобильное меню работает как модальный слой: фон становится inert,
  // фокус остаётся внутри панели и возвращается на кнопку меню после закрытия.
  useEffect(() => {
    if (!isMenuOpen || isDesktop) return;

    const root = mobileMenuRootRef.current;
    const panel = menuRef.current;
    if (!root || !panel) return;

    const previousFocus =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    const burgerButton = burgerRef.current;
    const inerted = Array.from(document.body.children)
      .filter((element) => {
        if (element === root) return false;
        if (["SCRIPT", "STYLE", "LINK"].includes(element.tagName)) return false;
        return !element.hasAttribute("inert");
      })
      .map((element) => element as HTMLElement);

    inerted.forEach((element) => {
      element.inert = true;
    });

    const focusableSelector =
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
    const focusables = () =>
      Array.from(panel.querySelectorAll<HTMLElement>(focusableSelector)).filter(
        (element) => element.offsetWidth || element.offsetHeight,
      );

    const frame = window.requestAnimationFrame(() => {
      panel.querySelector<HTMLElement>("[data-autofocus]")?.focus();
    });

    const trapFocus = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;

      const elements = focusables();
      if (elements.length === 0) {
        event.preventDefault();
        panel.focus();
        return;
      }

      const first = elements[0];
      const last = elements[elements.length - 1];
      if (!panel.contains(document.activeElement)) {
        event.preventDefault();
        (event.shiftKey ? last : first).focus();
      } else if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", trapFocus, true);

    return () => {
      window.cancelAnimationFrame(frame);
      document.removeEventListener("keydown", trapFocus, true);
      inerted.forEach((element) => {
        element.inert = false;
      });
      if (previousFocus?.isConnected) previousFocus.focus();
      else burgerButton?.focus();
    };
  }, [isMenuOpen, isDesktop, menuRef]);

  const mobileMenu = isClient
    ? createPortal(
        <div
          ref={mobileMenuRootRef}
          className={clsx(
            "fixed inset-0 z-[200] bg-black/40",
            "transition-opacity duration-300",
            isMenuOpen
              ? "visible opacity-100"
              : "invisible pointer-events-none opacity-0",
          )}
          aria-hidden={!isMenuOpen}
        >
          <div
            ref={menuRef}
            id="mobile-navigation"
            role="dialog"
            aria-modal="true"
            aria-label="Мобильная навигация"
            inert={!isMenuOpen}
            className={clsx(
              "absolute inset-y-0 right-0 flex w-full max-w-md flex-col",
              "overflow-y-auto bg-white px-6 py-8 shadow-2xl",
              "transition-transform duration-300",
              isMenuOpen ? "translate-x-0" : "translate-x-full",
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

              <Button
                unstyled
                type="button"
                onClick={closeMenu}
                aria-label="Закрыть меню"
                data-autofocus
                className={clsx(
                  "flex size-11 items-center justify-center",
                  "rounded-full border border-border text-2xl",
                  "transition-colors hover:bg-surface-muted",
                )}
              >
                &times;
              </Button>
            </div>

            <nav aria-label="Мобильная навигация">
              <ul className="flex flex-col">
                {NAV_ITEMS.map((item) => (
                  <li key={item.href} className="border-b border-border">
                    <Link
                      href={resolveNavigationHref(item.href, pathname)}
                      onClick={closeMenu}
                      className={clsx(
                        "block py-4 font-heading text-lg font-bold",
                        "transition-colors hover:text-brand-green",
                      )}
                    >
                      {item.label}
                    </Link>
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
                <Link
                  href={resolveNavigationHref(item.href, pathname)}
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

          <Button
            unstyled
            ref={burgerRef}
            type="button"
            onClick={menu.toggle}
            aria-label={isMenuOpen ? "Закрыть меню" : "Открыть меню"}
            aria-expanded={isMenuOpen}
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
                isMenuOpen && "translate-y-2 rotate-45",
              )}
            />

            <span
              className={clsx(
                "h-0.5 w-6 bg-ink transition-opacity duration-300",
                isMenuOpen && "opacity-0",
              )}
            />

            <span
              className={clsx(
                "h-0.5 w-6 bg-ink transition-transform duration-300",
                isMenuOpen && "-translate-y-2 -rotate-45",
              )}
            />
          </Button>
        </div>
      </header>

      {mobileMenu}
    </>
  );
}

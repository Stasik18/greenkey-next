"use client";

import clsx from "clsx";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function CallButton() {
  const pathname = usePathname() ?? "/";
  const [isFooterVisible, setIsFooterVisible] = useState(false);
  const isCalculatorPage = pathname === "/calculator";

  useEffect(() => {
    const footer = document.querySelector("footer");
    if (!footer || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsFooterVisible(entry.isIntersecting),
      { threshold: 0 },
    );

    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  return (
    <a
      href="tel:+79035120326"
      data-call-button
      aria-label="Позвонить: +7 903 512-03-26"
      aria-hidden={isFooterVisible}
      tabIndex={isFooterVisible ? -1 : 0}
      className={clsx(
        "fixed right-6 z-[90] grid size-14 place-items-center rounded-full",
        "bg-brand-green text-ink shadow-xl transition-all duration-300",
        "motion-safe:hover:-translate-y-1 hover:shadow-2xl focus-visible:outline-2",
        "focus-visible:outline-offset-4 focus-visible:outline-brand-green motion-reduce:transition-none",
        "min-[1290px]:hidden",
        isCalculatorPage
          ? "bottom-[calc(6rem+env(safe-area-inset-bottom))] min-[900px]:bottom-[calc(1.5rem+env(safe-area-inset-bottom))]"
          : "bottom-[calc(1.5rem+env(safe-area-inset-bottom))]",
        isFooterVisible
          ? "pointer-events-none invisible translate-y-4 opacity-0"
          : "visible translate-y-0 opacity-100",
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
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
    </a>
  );
}

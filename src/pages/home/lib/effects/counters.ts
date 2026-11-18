import { prefersReducedMotion } from "./browser-utils";

export function initCounters() {
  const container = document.getElementById("numbers-grid");
  if (!container) return () => {};

  if (prefersReducedMotion()) {
    container.querySelectorAll<HTMLElement>(".counter").forEach((element) => {
      const target = Number(element.dataset.target);
      const suffix = element.dataset.suffix ?? "";
      element.textContent = `${target.toLocaleString("ru-RU")}${suffix}`;
    });
    return () => {};
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target
          .querySelectorAll<HTMLElement>(".counter")
          .forEach((element) => {
            const target = Number(element.dataset.target);
            const suffix = element.dataset.suffix ?? "";
            const step = Math.max(1, Math.ceil(target / 60));
            let current = 0;

            const timer = window.setInterval(() => {
              current = Math.min(current + step, target);
              element.textContent = `${current.toLocaleString("ru-RU")}${suffix}`;

              if (current >= target) window.clearInterval(timer);
            }, 24);
          });

        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.3 },
  );

  observer.observe(container);
  return () => observer.disconnect();
}

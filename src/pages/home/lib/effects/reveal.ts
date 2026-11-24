import { prefersReducedMotion } from "./browser-utils";

export function initRevealAnimations() {
  const elements = document.querySelectorAll<HTMLElement>(".reveal");

  if (prefersReducedMotion()) {
    elements.forEach((element) => element.classList.add("visible"));
    return () => {};
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.1 },
  );

  elements.forEach((element) => observer.observe(element));
  return () => observer.disconnect();
}

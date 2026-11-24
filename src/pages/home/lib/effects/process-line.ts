import { prefersReducedMotion } from "./browser-utils";

export function initProcessLine() {
  const element = document.getElementById("process-steps");
  if (!element) return () => {};

  if (prefersReducedMotion()) {
    element.classList.add("animated");
    return () => {};
  }

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (!entry.isIntersecting) return;
      element.classList.add("animated");
      observer.disconnect();
    },
    { threshold: 0.3 },
  );

  observer.observe(element);
  return () => observer.disconnect();
}

import { prefersReducedMotion } from "./browser-utils";

export function initPreloader() {
  const preloader = document.getElementById("preloader");
  if (!preloader) return () => {};

  if (prefersReducedMotion()) {
    preloader.classList.add("done");
    return () => {};
  }

  const firstTimer = window.setTimeout(
    () => preloader.classList.add("done"),
    700,
  );
  const fallbackTimer = window.setTimeout(
    () => preloader.classList.add("done"),
    2500,
  );

  return () => {
    window.clearTimeout(firstTimer);
    window.clearTimeout(fallbackTimer);
  };
}

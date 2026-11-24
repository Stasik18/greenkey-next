import { prefersReducedMotion } from "./browser-utils";

const VISITED_KEY = "greenkey-home-intro-seen";

export function initPreloader() {
  const preloader = document.getElementById("preloader");
  if (!preloader) return () => {};

  // The intro is a one-time experience, not a loading screen on every visit.
  try {
    if (window.localStorage.getItem(VISITED_KEY) === "1") {
      preloader.classList.add("done");
      return () => {};
    }
    window.localStorage.setItem(VISITED_KEY, "1");
  } catch {
    // If storage is unavailable, do not block access to the page.
    preloader.classList.add("done");
    return () => {};
  }

  if (prefersReducedMotion()) {
    preloader.classList.add("done");
    return () => {};
  }

  preloader.classList.add("is-visible");
  const timer = window.setTimeout(() => preloader.classList.add("done"), 1100);

  return () => window.clearTimeout(timer);
}

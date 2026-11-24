import { prefersReducedMotion } from "./browser-utils";

export function initPointerEffects() {
  if (
    prefersReducedMotion() ||
    !window.matchMedia("(hover: hover) and (pointer: fine)").matches
  ) {
    return () => {};
  }

  const cleanups: Array<() => void> = [];

  document.querySelectorAll<HTMLElement>("[data-tilt]").forEach((element) => {
    const handleMove = (event: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      element.style.transform = `perspective(1000px) rotateY(${x * 5}deg) rotateX(${-y * 5}deg) translateZ(4px)`;
    };
    const reset = () => {
      element.style.transform = "";
    };

    element.addEventListener("mousemove", handleMove);
    element.addEventListener("mouseleave", reset);
    cleanups.push(() => {
      element.removeEventListener("mousemove", handleMove);
      element.removeEventListener("mouseleave", reset);
      reset();
    });
  });

  document.querySelectorAll<HTMLElement>(".magnetic").forEach((element) => {
    const handleMove = (event: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      const x = (event.clientX - rect.left - rect.width / 2) * 0.22;
      const y = (event.clientY - rect.top - rect.height / 2) * 0.22;
      element.style.transform = `translate(${x}px, ${y}px)`;
    };
    const reset = () => {
      element.style.transform = "";
    };

    element.addEventListener("mousemove", handleMove);
    element.addEventListener("mouseleave", reset);
    cleanups.push(() => {
      element.removeEventListener("mousemove", handleMove);
      element.removeEventListener("mouseleave", reset);
      reset();
    });
  });

  return () => cleanups.forEach((cleanup) => cleanup());
}

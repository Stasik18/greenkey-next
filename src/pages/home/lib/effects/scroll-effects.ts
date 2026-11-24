export function initScrollEffects() {
  const progress = document.getElementById("progress");
  const root = document.documentElement;
  let scrollRange = Math.max(root.scrollHeight - root.clientHeight, 1);
  let animationFrame = 0;

  const update = () => {
    animationFrame = 0;
    scrollRange = Math.max(root.scrollHeight - root.clientHeight, 1);

    if (progress) {
      progress.style.width = `${(window.scrollY / scrollRange) * 100}%`;
    }

    const canvas = document.getElementById("particles-canvas");
    if (canvas instanceof HTMLElement) {
      canvas.style.transform =
        window.scrollY > window.innerHeight
          ? ""
          : `translateY(${window.scrollY * 0.28}px)`;
    }
  };

  const handleScroll = () => {
    if (animationFrame) return;
    animationFrame = window.requestAnimationFrame(update);
  };

  window.addEventListener("scroll", handleScroll, { passive: true });
  window.addEventListener("resize", handleScroll, { passive: true });
  update();

  return () => {
    window.removeEventListener("scroll", handleScroll);
    window.removeEventListener("resize", handleScroll);
    window.cancelAnimationFrame(animationFrame);
  };
}

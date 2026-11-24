import { prefersReducedMotion } from "./browser-utils";

type Particle = {
  x: number;
  y: number;
  velocityX: number;
  velocityY: number;
  radius: number;
  opacity: number;
  color: string;
};

export function initParticles() {
  const canvas = document.getElementById(
    "particles-canvas",
  ) as HTMLCanvasElement | null;
  const context = canvas?.getContext("2d");

  if (!canvas || !context || prefersReducedMotion()) return () => {};

  let width = 0;
  let height = 0;
  let animationFrame = 0;
  let isVisible = false;
  let isRunning = false;

  const count =
    window.innerWidth <= 480 ? 36 : window.innerWidth <= 900 ? 60 : 100;
  const particles: Particle[] = [];

  const resize = () => {
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * pixelRatio);
    canvas.height = Math.round(height * pixelRatio);
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  };

  resize();

  for (let index = 0; index < count; index += 1) {
    particles.push({
      x: Math.random() * (width || 1920),
      y: Math.random() * (height || 1080),
      velocityX: (Math.random() - 0.5) * 0.4,
      velocityY: (Math.random() - 0.5) * 0.4,
      radius: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.5 + 0.1,
      color:
        Math.random() > 0.7
          ? "#22C55E"
          : Math.random() > 0.5
            ? "#FF6B2B"
            : "#ffffff",
    });
  }

  const draw = () => {
    if (!isVisible) {
      isRunning = false;
      return;
    }

    context.clearRect(0, 0, width, height);

    particles.forEach((particle) => {
      particle.x += particle.velocityX;
      particle.y += particle.velocityY;

      if (particle.x < 0) particle.x = width;
      if (particle.x > width) particle.x = 0;
      if (particle.y < 0) particle.y = height;
      if (particle.y > height) particle.y = 0;

      context.beginPath();
      context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      context.fillStyle = particle.color;
      context.globalAlpha = particle.opacity;
      context.fill();
    });

    context.globalAlpha = 1;

    for (let first = 0; first < particles.length; first += 1) {
      for (let second = first + 1; second < particles.length; second += 1) {
        const deltaX = particles[first].x - particles[second].x;
        const deltaY = particles[first].y - particles[second].y;
        const distance = Math.hypot(deltaX, deltaY);

        if (distance >= 110) continue;

        context.beginPath();
        context.moveTo(particles[first].x, particles[first].y);
        context.lineTo(particles[second].x, particles[second].y);
        context.strokeStyle = "#22C55E";
        context.globalAlpha = (1 - distance / 110) * 0.1;
        context.lineWidth = 0.5;
        context.stroke();
      }
    }

    context.globalAlpha = 1;
    animationFrame = window.requestAnimationFrame(draw);
  };

  const observer = new IntersectionObserver(([entry]) => {
    isVisible = entry.isIntersecting;

    if (isVisible && !isRunning) {
      isRunning = true;
      animationFrame = window.requestAnimationFrame(draw);
    }
  });

  observer.observe(canvas);
  window.addEventListener("resize", resize, { passive: true });

  return () => {
    observer.disconnect();
    window.removeEventListener("resize", resize);
    window.cancelAnimationFrame(animationFrame);
  };
}

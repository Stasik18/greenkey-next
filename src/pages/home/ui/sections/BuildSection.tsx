"use client";

import { useEffect, useRef, useState } from "react";
import { Container, Typography } from "@/shared/ui";

import {
  createHouseLayers,
  easeOutBack,
  STAGES,
  SVG_NS,
} from "../../lib/build-scene";

export function BuildSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [activeStage, setActiveStage] = useState(0);
  const [is3dReady, setIs3dReady] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    const svg = svgRef.current;
    if (!section || !svg) return;

    const layers = createHouseLayers(svg);
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const compactQuery = window.matchMedia("(max-width: 900px)");
    let animationFrame = 0;
    let currentStage = 0;
    let ownsFallback = true;

    const handle3dReady = () => {
      ownsFallback = false;
      setIs3dReady(true);
    };

    document.addEventListener("build:3d-ready", handle3dReady, { once: true });

    if (motionQuery.matches || compactQuery.matches) {
      layers.forEach((group) => {
        group.setAttribute("transform", "translate(0 0)");
        group.style.opacity = "1";
      });
      section.classList.add("is-static");

      return () => {
        document.removeEventListener("build:3d-ready", handle3dReady);
        section.classList.remove("is-static");
      };
    }

    const update = () => {
      animationFrame = 0;
      if (!ownsFallback) return;

      const total = Math.max(section.offsetHeight - window.innerHeight, 1);
      const progress = Math.min(
        Math.max(-section.getBoundingClientRect().top / total, 0),
        1,
      );
      const step = 1 / layers.length;

      layers.forEach((group, index) => {
        const localProgress = Math.min(
          Math.max((progress - index * step) / step, 0),
          1,
        );
        const eased =
          localProgress <= 0
            ? 0
            : localProgress >= 1
              ? 1
              : easeOutBack(localProgress);

        group.setAttribute(
          "transform",
          `translate(0 ${(-72 * (1 - eased)).toFixed(1)})`,
        );
        group.style.opacity =
          localProgress <= 0 ? "0" : String(Math.min(localProgress * 2.5, 1));
      });

      const nextStage = Math.min(
        Math.floor(progress * layers.length),
        layers.length - 1,
      );

      if (nextStage !== currentStage) {
        currentStage = nextStage;
        setActiveStage(nextStage);
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
      ownsFallback = false;
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      document.removeEventListener("build:3d-ready", handle3dReady);
      window.cancelAnimationFrame(animationFrame);
    };
  }, []);

  const stage = STAGES[activeStage];

  return (
    <section
      ref={sectionRef}
      id="build"
      className={`build-section relative min-h-[360vh] bg-ink text-white ${is3dReady ? "has-3d" : ""}`}
    >
      <div className="build-sticky sticky top-0 flex min-h-screen items-center overflow-hidden py-12">
        <Container className="build-inner grid items-center gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="build-left relative z-10">
            <Typography
              as="h2"
              variant="eyebrow"
              className="build-eyebrow text-brand-orange"
            >
              Как рождается ваш дом
            </Typography>

            <div className="build-anim mt-8 min-h-44" aria-live="polite">
              <div
                id="b-num"
                className="font-heading text-5xl font-black text-brand-green"
              >
                {String(activeStage + 1).padStart(2, "0")}
              </div>
              <Typography as="h3" variant="h2" className="mt-3 text-white">
                <span id="b-title">{stage.title}</span>
              </Typography>
              <p
                id="b-desc"
                className="mt-4 max-w-lg text-sm leading-relaxed text-white/65"
              >
                {stage.description}
              </p>
            </div>

            <div
              id="b-dots"
              className="build-dots mt-8 flex gap-2"
              aria-hidden="true"
            >
              {STAGES.map((item, index) => (
                <i
                  key={item.title}
                  className={`h-1.5 flex-1 rounded-full ${index <= activeStage ? "act" : ""}`}
                />
              ))}
            </div>

            <ol className="build-list sr-only">
              {STAGES.map((item) => (
                <li key={item.title}>
                  <b>{item.title}.</b> {item.description}
                </li>
              ))}
            </ol>

            <div className="build-cta mt-8 flex flex-wrap items-center gap-4">
              <button
                type="button"
                data-modal-open="modal-call"
                className="rounded-lg bg-brand-green px-6 py-3 font-semibold text-ink transition hover:bg-brand-green/90"
              >
                Рассчитать мой дом
              </button>
              <span className="text-xs text-white/45">
                Выезд на замер бесплатно · фиксированная цена по договору
              </span>
              <button
                type="button"
                className="build-skip hidden items-center gap-2 text-xs font-bold uppercase tracking-wider text-white/60 hover:text-white"
              >
                Пропустить анимацию
                <span aria-hidden="true" className="build-skip-arrow">
                  ↓
                </span>
              </button>
            </div>
          </div>

          <div className="build-right relative min-h-[300px] lg:min-h-[560px]">
            <div className="build-scene absolute inset-0">
              <svg
                ref={svgRef}
                viewBox="0 0 1000 780"
                xmlns={SVG_NS}
                className={`h-full w-full ${is3dReady ? "hidden" : ""}`}
                aria-hidden="true"
              />
            </div>
          </div>
        </Container>
        <p className="build-hint pointer-events-none absolute bottom-5 left-1/2 -translate-x-1/2 text-[10px] font-bold uppercase tracking-[0.2em] text-white/35">
          Прокручивайте - дом строится
        </p>
      </div>
    </section>
  );
}

"use client";

import { useEffect } from "react";

import { initHeroVideo } from "../lib/effects/hero-video";
import { initParticles } from "../lib/effects/particles";
import { initTypewriter } from "../lib/effects/typewriter";
import { initScrollEffects } from "../lib/effects/scroll-effects";
import { initRevealAnimations } from "../lib/effects/reveal";
import { initCounters } from "../lib/effects/counters";
import { initProcessLine } from "../lib/effects/process-line";
import { initPointerEffects } from "../lib/effects/pointer-effects";
import { initPreloader } from "../lib/effects/preloader";

export function HomePageEffects() {
  useEffect(() => {
    const cleanups = [
      initHeroVideo(),
      initParticles(),
      initTypewriter(),
      initScrollEffects(),
      initRevealAnimations(),
      initCounters(),
      initProcessLine(),
      initPointerEffects(),
      initPreloader(),
    ];

    return () => cleanups.forEach((cleanup) => cleanup());
  }, []);

  return null;
}

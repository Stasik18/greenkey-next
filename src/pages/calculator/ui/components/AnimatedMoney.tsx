"use client";

import { useEffect, useRef, useState } from "react";
import { formatMoney } from "../../lib/calculator";

interface AnimatedMoneyProps {
  value: number;
  className?: string;
}

export function AnimatedMoney({ value, className }: AnimatedMoneyProps) {
  const [displayValue, setDisplayValue] = useState(value);
  const displayRef = useRef(value);
  const previousTargetRef = useRef(value);

  useEffect(() => {
    if (value === previousTargetRef.current) return;

    previousTargetRef.current = value;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const startValue = displayRef.current;
    const startedAt = performance.now();
    const duration = reduceMotion ? 0 : 650;
    let frame = 0;

    const animate = (now: number) => {
      const progress =
        duration === 0 ? 1 : Math.min((now - startedAt) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const nextValue = Math.round(startValue + (value - startValue) * eased);

      displayRef.current = nextValue;
      setDisplayValue(nextValue);

      if (progress < 1) {
        frame = window.requestAnimationFrame(animate);
      } else {
        displayRef.current = value;
      }
    };

    frame = window.requestAnimationFrame(animate);

    return () => window.cancelAnimationFrame(frame);
  }, [value]);

  return <span className={className}>{formatMoney(displayValue)}</span>;
}

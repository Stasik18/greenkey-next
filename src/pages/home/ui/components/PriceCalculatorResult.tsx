import { useEffect, useState } from "react";
import { Button } from "@/shared/ui";

import type { CalculatorKind } from "../../model/price-calculator";

interface PriceCalculatorResultProps {
  kind: CalculatorKind;
  price: number;
}

const formatter = new Intl.NumberFormat("ru-RU");

export function PriceCalculatorResult({
  kind,
  price,
}: PriceCalculatorResultProps) {
  const [displayPrice, setDisplayPrice] = useState(0);

  useEffect(() => {
    const duration = 650;
    const startedAt = performance.now();
    let frame = 0;

    const animate = (now: number) => {
      const progress = Math.min((now - startedAt) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayPrice(Math.round(price * eased));

      if (progress < 1) frame = requestAnimationFrame(animate);
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [price]);

  return (
    <div className="text-center md:border-l md:border-border md:pl-8">
      <p
        className={`text-xs font-bold uppercase tracking-widest ${kind === "design" ? "text-white/50" : "text-muted"}`}
      >
        {kind === "design" ? "Стоимость проекта" : "Примерная стоимость"}
      </p>
      <p
        aria-live="polite"
        className={`mt-2 font-heading text-3xl font-black md:text-4xl ${kind === "design" ? "text-brand-green" : ""}`}
      >
        {formatter.format(displayPrice)}&nbsp;₽
      </p>
      <p
        className={`mt-2 text-sm ${kind === "design" ? "text-white/45" : "text-muted"}`}
      >
        {kind === "design"
          ? "от 3 500 ₽ за 1 м²"
          : "Точная смета - после бесплатного замера"}
      </p>
      <Button
        className="mt-6"
        data-modal-open={kind === "design" ? "modal-call" : "modal-measure"}
      >
        {kind === "design" ? "Обсудить проект" : "Получить смету"}
      </Button>
    </div>
  );
}

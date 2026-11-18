"use client";

import { useState } from "react";

import type { CalculatorKind } from "../../model/price-calculator";
import {
  calculatorOptions,
  initialAreas,
  areaRanges,
} from "../../model/price-calculator";
import { PriceCalculatorTabs } from "./PriceCalculatorTabs";
import { PriceCalculatorArea } from "./PriceCalculatorArea";
import { PriceCalculatorResult } from "./PriceCalculatorResult";
import { PriceCalculatorIndividual } from "./PriceCalculatorIndividual";

interface PriceCalculatorProps {
  kind: CalculatorKind;
}

export function PriceCalculator({ kind }: PriceCalculatorProps) {
  const options = calculatorOptions[kind];
  const [activeOption, setActiveOption] = useState(options[0].id);
  const [area, setArea] = useState(initialAreas[kind]);
  const option = options.find((item) => item.id === activeOption) ?? options[0];
  const range = areaRanges[kind];
  const price = option.rate === null ? null : area * option.rate;

  return (
    <div
      className={`mt-6 overflow-hidden rounded-2xl border shadow-sm ${
        kind === "design"
          ? "border-white/10 bg-white/[0.06] text-white shadow-none"
          : "border-border bg-white"
      }`}
    >
      <PriceCalculatorTabs
        options={options}
        activeId={activeOption}
        onChange={setActiveOption}
      />
      {price === null ? (
        <PriceCalculatorIndividual />
      ) : (
        <div className="grid gap-8 p-6 md:grid-cols-2 md:p-8">
          <PriceCalculatorArea
            kind={kind}
            area={area}
            min={range.min}
            max={range.max}
            step={range.step}
            option={option}
            onChange={setArea}
          />
          <PriceCalculatorResult kind={kind} price={price} />
        </div>
      )}
    </div>
  );
}

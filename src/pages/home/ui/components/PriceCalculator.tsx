"use client";

import { useState } from "react";
import { Button } from "@/shared/ui";

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
  activeOptionId?: string;
  onOptionChange?: (id: string) => void;
}

const formatter = new Intl.NumberFormat("ru-RU");

function DesignProjectCalculator() {
  const [area, setArea] = useState(initialAreas.design);
  const range = areaRanges.design;
  const price = area * 3500;

  return (
    <div className="design-calc-card">
      <label className="design-calc-area" htmlFor="design-area">
        <span>Площадь помещения</span>
        <strong>{area} м²</strong>
      </label>
      <input
        id="design-area"
        className="design-calc-range"
        type="range"
        min={range.min}
        max={range.max}
        step={range.step}
        value={area}
        onChange={(event) => setArea(Number(event.target.value))}
        aria-valuetext={`${area} квадратных метров`}
      />
      <div className="design-calc-range-labels">
        <span>{range.min} м²</span>
        <span>500 м²</span>
        <span>{range.max} м²</span>
      </div>
      <div className="design-calc-price-label">Стоимость проекта</div>
      <output className="design-calc-price" aria-live="polite">
        {formatter.format(price)} ₽
      </output>
      <p className="design-calc-note">от 3 500 ₽ за 1 м²</p>
      <Button
        className="design-calc-button mt-6 min-h-12 w-full rounded-md font-heading text-sm font-extrabold uppercase tracking-wide text-ink"
        data-modal-open="modal-call"
      >
        Обсудить проект
      </Button>
    </div>
  );
}

export function PriceCalculator({
  kind,
  activeOptionId,
  onOptionChange,
}: PriceCalculatorProps) {
  if (kind === "design") return <DesignProjectCalculator />;
  return (
    <PackagePriceCalculator
      kind={kind}
      activeOptionId={activeOptionId}
      onOptionChange={onOptionChange}
    />
  );
}

function PackagePriceCalculator({
  kind,
  activeOptionId,
  onOptionChange,
}: {
  kind: Exclude<CalculatorKind, "design">;
  activeOptionId?: string;
  onOptionChange?: (id: string) => void;
}) {
  const options = calculatorOptions[kind];
  const [internalOption, setInternalOption] = useState(options[0].id);
  const activeOption = activeOptionId ?? internalOption;
  const setActiveOption = (id: string) => {
    setInternalOption(id);
    onOptionChange?.(id);
  };
  const [area, setArea] = useState(initialAreas[kind]);
  const option = options.find((item) => item.id === activeOption) ?? options[0];
  const range = areaRanges[kind];
  const price = option.rate === null ? null : area * option.rate;

  return (
    <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
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

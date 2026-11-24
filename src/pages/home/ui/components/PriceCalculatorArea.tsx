import type {
  CalculatorKind,
  PackageOption,
} from "../../model/price-calculator";

interface PriceCalculatorAreaProps {
  kind: CalculatorKind;
  area: number;
  min: number;
  max: number;
  step: number;
  option: PackageOption;
  onChange: (value: number) => void;
}

export function PriceCalculatorArea({
  kind,
  area,
  min,
  max,
  step,
  option,
  onChange,
}: PriceCalculatorAreaProps) {
  return (
    <div>
      <label
        htmlFor={`${kind}-area`}
        className="flex justify-between gap-4 text-sm font-bold"
      >
        {kind === "house" ? "Площадь дома" : "Площадь помещения"}
        <span
          className={
            kind === "design" ? "text-brand-green" : "text-brand-orange"
          }
        >
          {area} м²
        </span>
      </label>
      <input
        id={`${kind}-area`}
        type="range"
        min={min}
        max={max}
        step={step}
        value={area}
        aria-valuetext={`${area} м²`}
        onChange={(event) => onChange(Number(event.target.value))}
        className="mt-5 w-full accent-brand-green"
      />
      <div
        className={`mt-2 flex justify-between text-xs ${kind === "design" ? "text-white/35" : "text-muted"}`}
      >
        <span>{min} м²</span>
        <span>500 м²</span>
        <span>{max} м²</span>
      </div>
      {option.includes && (
        <p
          className={`mt-5 text-sm leading-relaxed ${kind === "design" ? "text-white/55" : "text-muted"}`}
        >
          <strong className="mb-1 block text-ink">В стоимость входит:</strong>
          {option.includes}
        </p>
      )}
    </div>
  );
}

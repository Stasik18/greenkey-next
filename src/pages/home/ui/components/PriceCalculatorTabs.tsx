import { Button } from "@/shared/ui";
import type { PackageOption } from "../../model/price-calculator";

interface PriceCalculatorTabsProps {
  options: PackageOption[];
  activeId: string;
  onChange: (id: string) => void;
}

export function PriceCalculatorTabs({
  options,
  activeId,
  onChange,
}: PriceCalculatorTabsProps) {
  if (options.length <= 1) return null;

  return (
    <div className="calc-tabs grid grid-cols-1 border-b border-border sm:grid-cols-3">
      {options.map((option) => (
        <Button
          unstyled
          key={option.id}
          type="button"
          className={`calc-tab ${activeId === option.id ? "active" : ""}`}
          aria-pressed={activeId === option.id}
          onClick={() => onChange(option.id)}
        >
          <span>{option.label}</span>
          <small>{option.priceLabel}</small>
        </Button>
      ))}
    </div>
  );
}

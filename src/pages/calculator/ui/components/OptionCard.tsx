import { Button } from "@/shared/ui";
import type { CalculatorOption } from "../../model/types";
import { formatMoney } from "../../lib/calculator";

interface OptionCardProps {
  option: CalculatorOption;
  selected: boolean;
  onSelect: () => void;
}

export function OptionCard({ option, selected, onSelect }: OptionCardProps) {
  return (
    <Button
      unstyled
      type="button"
      className={`opt-card${selected ? " selected" : ""}`}
      aria-pressed={selected}
      onClick={onSelect}
    >
      <span className="oc-check" aria-hidden="true">
        ✓
      </span>
      <span className="oc-name">{option.n}</span>
      {option.d && <span className="oc-desc">{option.d}</span>}
      <span className={`oc-price${option.p === 0 ? " zero" : ""}`}>
        {option.p === 0 ? "Включено" : `+ ${formatMoney(option.p)}`}
      </span>
    </Button>
  );
}

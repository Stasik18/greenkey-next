import { formatMoney } from "../../lib/calculator";

interface CalculatorMobileBarProps {
  total: number;
}

export function CalculatorMobileBar({ total }: CalculatorMobileBarProps) {
  return (
    <div className="mbar">
      <span>Итого</span>
      <b>{formatMoney(total)}</b>
      <button
        type="button"
        onClick={() =>
          document
            .getElementById("lead")
            ?.scrollIntoView({ behavior: "smooth" })
        }
      >
        Оставить заявку
      </button>
    </div>
  );
}

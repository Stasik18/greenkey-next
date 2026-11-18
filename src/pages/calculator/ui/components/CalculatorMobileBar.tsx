import { AnimatedMoney } from "./AnimatedMoney";

interface CalculatorMobileBarProps {
  total: number;
}

export function CalculatorMobileBar({ total }: CalculatorMobileBarProps) {
  return (
    <div className="mbar">
      <span>Итого</span>
      <b>
        <AnimatedMoney value={total} />
      </b>
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

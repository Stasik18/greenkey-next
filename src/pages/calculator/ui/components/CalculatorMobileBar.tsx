import { Button } from "@/shared/ui";
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
      <Button
        unstyled
        type="button"
        onClick={() =>
          document
            .getElementById("lead")
            ?.scrollIntoView({ behavior: "smooth" })
        }
      >
        Оставить заявку
      </Button>
    </div>
  );
}

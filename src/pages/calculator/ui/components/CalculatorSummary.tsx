import { BASE_PRICE } from "../../model/options";
import type { CalculatorRow } from "../../lib/calculator";
import { formatMoney } from "../../lib/calculator";
import { AnimatedMoney } from "./AnimatedMoney";

interface CalculatorSummaryProps {
  total: number;
  rows: CalculatorRow[];
  onReset: () => void;
}

export function CalculatorSummary({
  total,
  rows,
  onReset,
}: CalculatorSummaryProps) {
  return (
    <aside>
      <div className="summary">
        <div className="summary-head">
          <div className="sh-label">Итоговая стоимость</div>
          <div className="summary-total">
            <AnimatedMoney value={total} />
          </div>
        </div>
        <div className="summary-body">
          <div className="sum-row sum-base">
            <span className="sr-name">
              <b>База</b>Дом 100 м², тёплый контур
            </span>
            <span className="sr-val">{formatMoney(BASE_PRICE)}</span>
          </div>
          {rows.map((row) => (
            <div className="sum-row" key={row.title}>
              <span className="sr-name">
                <b>{row.title}</b>
                {row.option}
              </span>
              <span className="sr-val">+ {formatMoney(row.price)}</span>
            </div>
          ))}
        </div>
        <div className="summary-foot">
          <div className="summary-note">
            Расчёт предварительный. Точная смета - на бесплатной консультации;
            стоимость зависит от удалённости участка (доставка до 60 км от МКАД
            - от 200 000 ₽) и формы оплаты.
          </div>
          <a
            className="summary-cta"
            href="#lead"
            onClick={(event) => {
              event.preventDefault();
              document
                .getElementById("lead")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            Оставить заявку
          </a>
          <button type="button" className="summary-reset" onClick={onReset}>
            Сбросить всё
          </button>
        </div>
      </div>
    </aside>
  );
}

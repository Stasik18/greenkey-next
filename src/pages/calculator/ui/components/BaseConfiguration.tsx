import { BASE_PRICE } from "../../model/options";
import { formatMoney } from "../../lib/calculator";

export function BaseConfiguration() {
  return (
    <section className="base-card reveal visible">
      <div className="base-top">
        <div>
          <h2>Базовая комплектация</h2>
          <div className="base-meta">
            Каркасный дом 100 м², 1 этаж. Тёплый контур: фундамент, каркас,
            кровля, окна, фасад, дверь, черновые полы и потолки. Участок 6
            соток.
          </div>
        </div>
        <div className="base-price">
          {formatMoney(BASE_PRICE)}
          <small>Стартовая цена</small>
        </div>
      </div>
    </section>
  );
}

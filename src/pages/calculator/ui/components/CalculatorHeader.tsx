import Link from "next/link";

export function CalculatorHeader() {
  return (
    <header className="calc-head">
      <div className="calc-head-inner">
        <div className="calc-crumbs">
          <Link href="/">Главная</Link> / Калькулятор
        </div>
        <span className="tag">Онлайн-расчёт</span>
        <h1>
          Калькулятор стоимости <span className="accent">дома под ключ</span>
        </h1>
        <p>
          Соберите комплектацию будущего дома - от фундамента до благоустройства
          участка - и мгновенно узнайте предварительную стоимость. Базовый
          расчёт для дома 100 м², 1 этаж, участок 6 соток.
        </p>
      </div>
    </header>
  );
}

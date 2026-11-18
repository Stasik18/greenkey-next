import { BASE_PRICE, CALCULATOR_GROUPS } from "../model/options";

export type CalculatorSelection = number[];
export type ContactChannel = "max" | "telegram";

export interface CalculatorRow {
  title: string;
  option: string;
  price: number;
}

export const BUILD_TERMS = [
  "Сейчас",
  "Через 3 месяца",
  "Через 6 месяцев",
  "Через год",
] as const;

export type BuildTerm = (typeof BUILD_TERMS)[number];

export const LAND_OPTIONS = ["Да, участок есть", "Нет, в поиске"] as const;
export type LandOption = (typeof LAND_OPTIONS)[number];

export function formatMoney(value: number) {
  return `${value.toLocaleString("ru-RU")} ₽`;
}

export function calculateTotal(selection: CalculatorSelection) {
  return CALCULATOR_GROUPS.reduce(
    (sum, group, index) => sum + group.opts[selection[index]].p,
    BASE_PRICE,
  );
}

export function getCalculatorRows(
  selection: CalculatorSelection,
): CalculatorRow[] {
  return CALCULATOR_GROUPS.flatMap((group, index) => {
    const option = group.opts[selection[index]];
    return option.p > 0
      ? [{ title: group.t, option: option.n, price: option.p }]
      : [];
  });
}

export function createInitialSelection(): CalculatorSelection {
  return CALCULATOR_GROUPS.map(() => 0);
}

export function buildLeadDetails(
  rows: CalculatorRow[],
  total: number,
  term: BuildTerm,
  land: LandOption,
) {
  return [
    `База (дом 100 м², 1 этаж, тёплый контур, 6 соток): ${formatMoney(BASE_PRICE)}`,
    ...rows.map(
      (row) => `${row.title}: ${row.option} - +${formatMoney(row.price)}`,
    ),
    `ИТОГО: ${formatMoney(total)}`,
    `Сроки: ${term}`,
    `Участок: ${land}`,
  ].join("\\n");
}

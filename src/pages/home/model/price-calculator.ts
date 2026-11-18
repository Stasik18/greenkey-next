export type CalculatorKind = "house" | "repair" | "design";
export type PackageOption = {
  id: string;
  label: string;
  rate: number | null;
  priceLabel: string;
  includes?: string;
};

export const calculatorOptions: Record<CalculatorKind, PackageOption[]> = {
  house: [
    {
      id: "a",
      label: "А - Тёплый контур",
      rate: 60_000,
      priceLabel: "от 60 000 ₽/м²",
      includes:
        "Сваи ЖБ · Каркас 200 мм · Кровля · Окна 70 мм · Дверь · Фасад имитация бруса · Закладные · ОСБ",
    },
    {
      id: "b",
      label: "Б - Под ключ",
      rate: 100_000,
      priceLabel: "от 100 000 ₽/м²",
      includes:
        "Всё из пакета А + вода, канализация, электричество, бойлер, котёл, радиаторы, септик, скважина",
    },
    {
      id: "c",
      label: "В - Благоустройство",
      rate: null,
      priceLabel: "индивидуально",
    },
  ],
  repair: [
    {
      id: "a",
      label: "А - Черновые работы",
      rate: 16_000,
      priceLabel: "16 000 ₽/м²",
    },
    {
      id: "b",
      label: "Б - Чистовые работы",
      rate: 24_000,
      priceLabel: "24 000 ₽/м²",
    },
    {
      id: "c",
      label: "В - Чистовые с материалом",
      rate: 35_000,
      priceLabel: "35 000 ₽/м²",
    },
  ],
  design: [
    {
      id: "design",
      label: "Дизайн-проект",
      rate: 3_500,
      priceLabel: "от 3 500 ₽/м²",
    },
  ],
};

export const initialAreas: Record<CalculatorKind, number> = {
  house: 150,
  repair: 80,
  design: 80,
};

export const areaRanges: Record<
  CalculatorKind,
  { min: number; max: number; step: number }
> = {
  house: { min: 20, max: 1000, step: 5 },
  repair: { min: 10, max: 1000, step: 5 },
  design: { min: 20, max: 1000, step: 5 },
};

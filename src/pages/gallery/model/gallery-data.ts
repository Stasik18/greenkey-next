export type Stage = {
  key: string;
  label: string;
  description: string;
};

export type House = {
  id: string;
  model: string;
  type: string;
  address: string;
  area: number;
  floors: number;
  term: string;
  year?: number;
  dir: string;
  cover: string;
  photos: Record<string, number>;
  project?: number;
  plan?: number;
  status?: "progress";
};

export type Photo = {
  src: string;
  alt: string;
};

export const STAGES: Stage[] = [
  {
    key: "foundation",
    label: "Фундамент",
    description:
      "Забиваем железобетонные сваи и делаем обвязку - надёжное основание будущего дома.",
  },
  {
    key: "frame",
    label: "Силовой каркас",
    description:
      "Собираем каркас 200 мм - прочный «скелет» дома с перекрытиями.",
  },
  {
    key: "roof",
    label: "Кровля",
    description:
      "Ставим стропильную систему и укладываем кровлю - дом закрыт от осадков.",
  },
  {
    key: "walls",
    label: "Стены и фасад",
    description:
      "Утепляем контур, зашиваем ОСБ и монтируем фасад «имитация бруса».",
  },
  {
    key: "windows",
    label: "Окна и двери",
    description:
      "Устанавливаем окна 70 мм и входную группу - тёплый контур готов.",
  },
  {
    key: "interior",
    label: "Инженерия и отделка",
    description:
      "Прокладываем коммуникации и выполняем чистовую отделку помещений.",
  },
  {
    key: "done",
    label: "Готовый дом",
    description:
      "Благоустройство, финальная уборка - и вручаем ключи хозяевам.",
  },
];

export const HOUSES: House[] = [
  {
    id: "leonovo-2",
    model: "Дом в КП «Леоново-2»",
    type: "Каркасный дом под ключ",
    address: "КП «Леоново-2», Московская область",
    area: 180,
    floors: 1,
    term: "4 мес",
    year: 2025,
    dir: "/assets/gallery/leonovo-2/",
    cover: "/assets/gallery/leonovo-2/done-04.webp",
    photos: {
      foundation: 7,
      frame: 10,
      roof: 9,
      walls: 9,
      windows: 5,
      interior: 15,
      done: 8,
    },
    project: 10,
    plan: 1,
  },
  {
    id: "bolshoe-brehovo",
    model: "Дом в КП «Большое Брехово»",
    type: "Каркасный дом, тёплый контур",
    address: "КП «Большое Брехово», Московская область",
    area: 112,
    floors: 1,
    term: "4 мес",
    dir: "/assets/gallery/bolshoe-brehovo/",
    cover: "/assets/gallery/bolshoe-brehovo/done-01.webp",
    photos: {
      foundation: 4,
      frame: 9,
      roof: 2,
      walls: 7,
      windows: 3,
      interior: 10,
      done: 7,
    },
  },
];

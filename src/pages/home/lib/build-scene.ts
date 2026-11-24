export type Point3D = [number, number, number];
export type Stage = { title: string; description: string };

export const STAGES: Stage[] = [
  {
    title: "Фундамент на сваях",
    description:
      "Забиваем железобетонные сваи - надёжное основание вашего дома.",
  },
  {
    title: "Силовой каркас",
    description: "Возводим каркас 200 мм - прочный скелет будущего дома.",
  },
  {
    title: "Стены и фасад",
    description: "Обшиваем стены и монтируем фасад «имитация бруса».",
  },
  {
    title: "Кровля",
    description: "Ставим стропильную систему и кладём металлочерепицу.",
  },
  {
    title: "Окна и двери",
    description:
      "Устанавливаем окна 70 мм и входную дверь - тёплый контур готов.",
  },
  {
    title: "Ключи ваши",
    description:
      "Финальная отделка, подключение коммуникаций - и вы въезжаете.",
  },
];

export const SVG_NS = "http://www.w3.org/2000/svg";
const ORIGIN_X = 500;
const ORIGIN_Y = 300;
const SCALE_XY = 4.6;
const SCALE_DEPTH = 2.3;
const SCALE_HEIGHT = 3.1;

function projectPoint([x, y, z]: Point3D): [number, number] {
  return [
    ORIGIN_X + (x - y) * SCALE_XY,
    ORIGIN_Y + (x + y) * SCALE_DEPTH - z * SCALE_HEIGHT,
  ];
}

function createSvgElement<K extends keyof SVGElementTagNameMap>(
  tag: K,
  attributes: Record<string, string | number>,
): SVGElementTagNameMap[K] {
  const element = document.createElementNS(SVG_NS, tag);

  Object.entries(attributes).forEach(([name, value]) => {
    element.setAttribute(name, String(value));
  });

  return element;
}

function createPolygon(
  points: Point3D[],
  fill: string,
  stroke: string,
  strokeWidth: number,
  opacity = 1,
) {
  return createSvgElement("polygon", {
    points: points
      .map((point) =>
        projectPoint(point)
          .map((value) => value.toFixed(1))
          .join(","),
      )
      .join(" "),
    fill,
    stroke,
    "stroke-width": strokeWidth,
    "stroke-linejoin": "round",
    "fill-opacity": opacity,
  });
}

function createLine(
  start: Point3D,
  end: Point3D,
  stroke: string,
  strokeWidth: number,
  opacity = 1,
) {
  const [x1, y1] = projectPoint(start);
  const [x2, y2] = projectPoint(end);

  return createSvgElement("line", {
    x1: x1.toFixed(1),
    y1: y1.toFixed(1),
    x2: x2.toFixed(1),
    y2: y2.toFixed(1),
    stroke,
    "stroke-width": strokeWidth,
    "stroke-linecap": "round",
    "stroke-opacity": opacity,
  });
}

export function createHouseLayers(svg: SVGSVGElement) {
  const layer = () => {
    const group = createSvgElement("g", { class: "blayer" });
    svg.appendChild(group);
    return group;
  };
  const addLine = (
    group: SVGGElement,
    start: Point3D,
    end: Point3D,
    color: string,
    width: number,
    opacity = 1,
  ) => group.appendChild(createLine(start, end, color, width, opacity));
  const addPolygon = (
    group: SVGGElement,
    points: Point3D[],
    fill: string,
    stroke = "none",
    width = 0,
    opacity = 1,
  ) => group.appendChild(createPolygon(points, fill, stroke, width, opacity));

  const stoneTop = "#4a4a4a";
  const stoneLeft = "#343434";
  const stoneRight = "#3e3e3e";
  const stoneLines = "#5a5a5a";
  const woodLeft = "#b07d40";
  const woodRight = "#996833";
  const woodTop = "#c9a063";
  const battens = "rgba(0,0,0,.22)";
  const dark = "#2b2b2b";
  const frame = "#e0a95f";
  const frameDark = "#b98443";
  const roofTop = "#d6d6d6";
  const roofSide = "#8f8f8f";
  const roofLines = "#a6a6a6";
  const edge = "rgba(255,255,255,.85)";
  const glass = "#1d2028";
  const mullion = "rgba(255,255,255,.5)";
  const glow = "#ffcf4d";

  const x0 = 0;
  const x1 = 64;
  const y0 = 0;
  const y1 = 46;
  const base = 7;
  const top = 70;
  const glassX = 38;
  const glassY = 18;
  const glassTop = 64;

  const foundation = layer();
  addPolygon(
    foundation,
    [
      [x0, y0, base],
      [x1, y0, base],
      [x1, y1, base],
      [x0, y1, base],
    ],
    stoneTop,
    edge,
    1,
  );
  addPolygon(
    foundation,
    [
      [x0, y1, base],
      [x1, y1, base],
      [x1, y1, 0],
      [x0, y1, 0],
    ],
    stoneLeft,
    edge,
    1,
  );
  addPolygon(
    foundation,
    [
      [x1, y0, base],
      [x1, y1, base],
      [x1, y1, 0],
      [x1, y0, 0],
    ],
    stoneRight,
    edge,
    1,
  );

  for (let z = 2; z < base; z += 2.5) {
    addLine(foundation, [x0, y1, z], [x1, y1, z], stoneLines, 1, 0.6);
    addLine(foundation, [x1, y0, z], [x1, y1, z], stoneLines, 1, 0.6);
  }

  const deckX0 = 6;
  const deckX1 = 34;
  const deckY = 66;
  const deckZ = 6;
  addPolygon(
    foundation,
    [
      [deckX0, y1, deckZ],
      [deckX1, y1, deckZ],
      [deckX1, deckY, deckZ],
      [deckX0, deckY, deckZ],
    ],
    woodTop,
    edge,
    1,
  );
  addPolygon(
    foundation,
    [
      [deckX0, deckY, deckZ],
      [deckX1, deckY, deckZ],
      [deckX1, deckY, 0],
      [deckX0, deckY, 0],
    ],
    woodLeft,
    edge,
    1,
  );
  addPolygon(
    foundation,
    [
      [deckX0, y1, deckZ],
      [deckX0, deckY, deckZ],
      [deckX0, deckY, 0],
      [deckX0, y1, 0],
    ],
    woodRight,
    edge,
    1,
  );

  for (let x = deckX0 + 3; x < deckX1; x += 3) {
    addLine(foundation, [x, y1, deckZ], [x, deckY, deckZ], battens, 1.4, 0.8);
  }

  for (let index = 0; index < 2; index += 1) {
    const y = deckY + index * 4;
    const z = deckZ - 2 - index * 2;
    addPolygon(
      foundation,
      [
        [10, y, z],
        [24, y, z],
        [24, y + 4, z],
        [10, y + 4, z],
      ],
      woodTop,
      edge,
      0.8,
    );
    addPolygon(
      foundation,
      [
        [10, y + 4, z],
        [24, y + 4, z],
        [24, y + 4, z - 2],
        [10, y + 4, z - 2],
      ],
      woodLeft,
      edge,
      0.8,
    );
  }

  const frameLayer = layer();
  [
    [x0, y0],
    [x1, y0],
    [x1, y1],
    [x0, y1],
    [glassX, y1],
    [x1, glassY],
    [32, y0],
    [x0, 24],
  ].forEach(([x, y]) => {
    addLine(frameLayer, [x, y, base], [x, y, top], frame, 3.4);
  });

  [38, top].forEach((z) => {
    addLine(frameLayer, [x0, y1, z], [x1, y1, z], frameDark, 3);
    addLine(frameLayer, [x1, y0, z], [x1, y1, z], frameDark, 3);
    addLine(frameLayer, [x0, y0, z], [x0, y1, z], frameDark, 2.4, 0.6);
    addLine(frameLayer, [x0, y0, z], [x1, y0, z], frameDark, 2.4, 0.6);
  });

  for (let x = x0; x <= x1; x += 8) {
    addLine(frameLayer, [x, y0, top + 8], [x, y1, top - 4], frame, 2.6, 0.9);
  }

  const walls = layer();
  addPolygon(
    walls,
    [
      [x0, y1, base],
      [glassX, y1, base],
      [glassX, y1, top],
      [x0, y1, top],
    ],
    woodLeft,
    edge,
    1,
  );
  addPolygon(
    walls,
    [
      [x0, y1, base],
      [12, y1, base],
      [12, y1, top],
      [x0, y1, top],
    ],
    dark,
    edge,
    1,
  );
  addPolygon(
    walls,
    [
      [x1, y0, base],
      [x1, glassY, base],
      [x1, glassY, top],
      [x1, y0, top],
    ],
    woodRight,
    edge,
    1,
  );

  for (let x = 15; x < glassX; x += 3) {
    addLine(walls, [x, y1, base], [x, y1, top], battens, 1.4, 0.85);
  }
  for (let y = 3; y < glassY; y += 3) {
    addLine(walls, [x1, y, base], [x1, y, top], battens, 1.4, 0.85);
  }
  addLine(walls, [x0, y1, 38], [glassX, y1, 38], "rgba(0,0,0,.25)", 1.4);
  addLine(walls, [x1, y0, 38], [x1, glassY, 38], "rgba(0,0,0,.25)", 1.4);

  const roof = layer();
  const roofBack = top + 9;
  const roofFront = top - 5;
  const roofX0 = -3;
  const roofX1 = 67;
  const roofY0 = -3;
  const roofY1 = 50;
  addPolygon(
    roof,
    [
      [roofX0, roofY0, roofBack],
      [roofX1, roofY0, roofBack],
      [roofX1, roofY1, roofFront],
      [roofX0, roofY1, roofFront],
    ],
    roofTop,
    edge,
    1.4,
  );
  for (let x = roofX0 + 4; x < roofX1; x += 5) {
    addLine(
      roof,
      [x, roofY0, roofBack],
      [x, roofY1, roofFront],
      roofLines,
      1.4,
      0.8,
    );
  }
  addPolygon(
    roof,
    [
      [roofX0, roofY1, roofFront],
      [roofX1, roofY1, roofFront],
      [roofX1, roofY1, roofFront - 3],
      [roofX0, roofY1, roofFront - 3],
    ],
    roofSide,
    edge,
    1,
  );
  addPolygon(
    roof,
    [
      [roofX1, roofY0, roofBack],
      [roofX1, roofY1, roofFront],
      [roofX1, roofY1, roofFront - 3],
      [roofX1, roofY0, roofBack - 3],
    ],
    roofSide,
    edge,
    1,
  );

  const windows = layer();
  addPolygon(
    windows,
    [
      [glassX, y1, base],
      [x1, y1, base],
      [x1, y1, glassTop],
      [glassX, y1, glassTop],
    ],
    glass,
    mullion,
    1,
  );
  addPolygon(
    windows,
    [
      [x1, glassY, base],
      [x1, y1, base],
      [x1, y1, glassTop],
      [x1, glassY, glassTop],
    ],
    glass,
    mullion,
    1,
  );
  for (let x = glassX + 6; x < x1; x += 6)
    addLine(windows, [x, y1, base], [x, y1, glassTop], mullion, 1);
  for (let y = glassY + 6; y < y1; y += 6)
    addLine(windows, [x1, y, base], [x1, y, glassTop], mullion, 1);
  for (let z = base + 12; z < glassTop; z += 12) {
    addLine(windows, [glassX, y1, z], [x1, y1, z], mullion, 1);
    addLine(windows, [x1, glassY, z], [x1, y1, z], mullion, 1);
  }
  addPolygon(
    windows,
    [
      [16, y1, 44],
      [26, y1, 44],
      [26, y1, 60],
      [16, y1, 60],
    ],
    glass,
    mullion,
    1,
  );
  addPolygon(
    windows,
    [
      [4, y1, base],
      [10, y1, base],
      [10, y1, 30],
      [4, y1, 30],
    ],
    "#111111",
    mullion,
    1,
  );

  const lights = layer();
  addPolygon(
    lights,
    [
      [glassX, y1, base],
      [x1, y1, base],
      [x1, y1, glassTop],
      [glassX, y1, glassTop],
    ],
    glow,
    "none",
    0,
    0.9,
  );
  addPolygon(
    lights,
    [
      [x1, glassY, base],
      [x1, y1, base],
      [x1, y1, glassTop],
      [x1, glassY, glassTop],
    ],
    glow,
    "none",
    0,
    0.82,
  );
  addPolygon(
    lights,
    [
      [16, y1, 44],
      [26, y1, 44],
      [26, y1, 60],
      [16, y1, 60],
    ],
    glow,
    "none",
    0,
    0.95,
  );
  for (let x = glassX + 6; x < x1; x += 6) {
    addLine(lights, [x, y1, base], [x, y1, glassTop], "rgba(110,70,15,.5)", 1);
  }
  for (let z = base + 12; z < glassTop; z += 12) {
    addLine(lights, [glassX, y1, z], [x1, y1, z], "rgba(110,70,15,.5)", 1);
    addLine(lights, [x1, glassY, z], [x1, y1, z], "rgba(110,70,15,.5)", 1);
  }

  return [foundation, frameLayer, walls, roof, windows, lights];
}

export function easeOutBack(value: number) {
  const first = 1.70158;
  const second = first + 1;
  return 1 + second * Math.pow(value - 1, 3) + first * Math.pow(value - 1, 2);
}

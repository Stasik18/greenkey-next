import type { House } from "../../../model/gallery-data";

export function HouseFacts({ house }: { house: House }) {
  const facts = [
    ["Площадь", `${house.area} м²`],
    ["Этажность", `${house.floors} эт.`],
    ["Срок стройки", house.term],
    ["Комплектация", house.type],
  ];

  return (
    <div className="vw-facts">
      {facts.map(([label, value]) => (
        <div className="vw-fact" key={label}>
          <span>{label}</span>
          <b>{value}</b>
        </div>
      ))}
    </div>
  );
}

import { SectionHeading } from "./SectionHeading";

const STEPS = [
  [
    "01",
    "Заявка",
    "Оставляете заявку или связываетесь с нами удобным способом.",
  ],
  [
    "02",
    "Замер и проект",
    "Обсуждаем задачи, выезжаем на объект и готовим расчёт.",
  ],
  ["03", "Договор", "Согласовываем комплектацию, сроки и фиксируем стоимость."],
  ["04", "Строительство", "Выполняем работы и контролируем каждый этап."],
  ["05", "Сдача объекта", "Принимаете готовый дом и получаете гарантию."],
];

export function ProcessSection() {
  return (
    <section id="process" className="px-6 py-32 max-sm:py-20">
      <div className="mx-auto max-w-[1200px]">
        <SectionHeading
          eyebrow="03 — Понятный процесс"
          title={
            <>
              От заявки до
              <br />
              готового дома
            </>
          }
        />
        <div className="mt-14 grid grid-cols-5 gap-5 max-[900px]:grid-cols-2 max-sm:grid-cols-1">
          {STEPS.map(([number, title, text]) => (
            <article
              key={number}
              className="border-t-2 border-brand-green pt-5"
            >
              <p className="font-heading text-4xl font-black text-brand-green">
                {number}
              </p>
              <h3 className="mt-5 font-heading text-lg font-extrabold">
                {title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

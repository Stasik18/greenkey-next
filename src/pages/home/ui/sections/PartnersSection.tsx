import { SectionHeading } from "./SectionHeading";

const PARTNERS = [
  "Строительные материалы",
  "Инженерные системы",
  "Проектирование",
  "Поставщики",
];

export function PartnersSection() {
  return (
    <section id="partners" className="px-6 py-28">
      <div className="mx-auto max-w-[1200px]">
        <SectionHeading
          eyebrow="Партнёры"
          title="Работаем с проверенными компаниями"
          description="Надёжные поставщики и специалисты помогают соблюдать сроки и качество на каждом объекте."
        />
        <div className="mt-10 grid grid-cols-4 gap-4 max-[800px]:grid-cols-2 max-sm:grid-cols-1">
          {PARTNERS.map((partner) => (
            <div
              key={partner}
              className="grid min-h-28 place-items-center rounded-xl border border-border px-5 text-center font-heading text-sm font-bold text-muted"
            >
              {partner}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

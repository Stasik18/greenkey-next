import { Container, Typography } from "@/shared/ui";

const steps = [
  ["Бесплатный замер", "Выезжаем на объект, оцениваем все нюансы."],
  ["Составление сметы", "Детальная смета с материалами и работами."],
  ["Подписание договора", "Фиксированная цена, сроки и гарантии."],
  ["Строительство", "Работаем в срок, контроль качества."],
  ["Сдача объекта", "Акт приёмки и ключи в ваших руках."],
];

export function ProcessSection() {
  return (
    <section id="process" className="py-20 md:py-28">
      <Container>
        <Typography variant="eyebrow" className="text-brand-orange">
          Как мы работаем
        </Typography>
        <Typography as="h2" variant="h2" className="mt-4">
          Прозрачный
          <br />
          процесс
        </Typography>
        <Typography className="mt-5 max-w-2xl text-muted">
          Каждый шаг задокументирован. Вы всегда знаете, что происходит на вашем
          объекте.
        </Typography>
        <ol
          id="process-steps"
          className="process-steps relative mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-5"
        >
          <div className="process-line absolute left-0 right-0 top-7 hidden h-px bg-border lg:block">
            <div className="process-line-fill h-full w-0 bg-brand-green" />
          </div>
          {steps.map(([title, description], index) => (
            <li key={title} className="process-step relative z-10">
              <div className="step-dot mb-5 grid size-14 place-items-center rounded-full border-2 border-brand-green bg-white font-heading text-xl font-bold text-ink">
                {index + 1}
              </div>
              <Typography variant="h4">{title}</Typography>
              <Typography variant="body-sm" className="mt-2 text-muted">
                {description}
              </Typography>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}

import { Container, Icon, Typography } from "@/shared/ui";

const paymentMethods = [
  ["Banknote", "Наличные"],
  ["CreditCard", "Банковская карта"],
  ["Package", "Безналичный расчёт"],
  ["DollarSign", "Рассрочка"],
] as const;

export function PaymentSection() {
  return (
    <section className="bg-ink py-20 text-white md:py-28">
      <Container>
        <Typography variant="eyebrow" className="text-brand-orange">
          Удобно для вас
        </Typography>
        <Typography as="h2" variant="h2" className="mt-4 text-white">
          Оплата
          <br />и гарантии
        </Typography>
        <Typography className="mt-5 max-w-2xl text-white/55">
          Принимаем любые удобные формы оплаты. Работаем только по официальному
          договору с фиксированной ценой.
        </Typography>
        <div className="payment-grid mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {paymentMethods.map(([icon, title], index) => (
            <article
              key={title}
              className={`pay-card reveal reveal-delay-${index + 1} rounded-2xl border border-white/10 bg-white/[0.04] p-7`}
            >
              <div className="pay-icon mb-6 grid size-12 place-items-center rounded-xl bg-brand-green/15 text-brand-green">
                <Icon name={icon} size={24} />
              </div>
              <Typography variant="h4" className="text-white">
                {title}
              </Typography>
            </article>
          ))}
        </div>
        <div className="contract-badge mt-9 inline-flex flex-wrap items-center gap-3 rounded-xl border border-brand-green/25 bg-brand-green/10 px-6 py-4 font-semibold text-white">
          <Icon name="FileText" size={22} className="text-brand-green" />
          Работаем только по договору - ваша защита гарантирована
        </div>
      </Container>
    </section>
  );
}

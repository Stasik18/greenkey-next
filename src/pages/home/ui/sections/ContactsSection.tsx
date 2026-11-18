import { Container, Icon, Typography } from "@/shared/ui";
import { ContactsLeadForm } from "../components/ContactsLeadForm";

export function ContactsSection() {
  return (
    <section id="contacts" className="bg-surface-muted py-20 md:py-28">
      <Container>
        <Typography variant="eyebrow" className="text-brand-orange">
          07 - Свяжитесь с нами
        </Typography>
        <Typography as="h2" variant="h2" className="mt-4">
          Начните
          <br />
          сегодня
        </Typography>

        <div className="mt-8">
          <button
            type="button"
            data-modal-open="modal-measure"
            className="rounded-lg border border-ink/20 px-5 py-3 text-sm font-bold text-ink transition hover:border-brand-green hover:bg-brand-green/10"
          >
            Бесплатный замер
          </button>
        </div>

        <div className="contacts-grid mt-10 grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="contact-info space-y-7">
            <div className="contact-item">
              <Typography variant="eyebrow" className="text-muted">
                Телефон / MAX / Telegram
              </Typography>
              <a
                href="tel:+79035120326"
                className="contact-phone mt-2 block font-heading text-2xl font-black transition hover:text-brand-orange"
              >
                +7 (903) 512-03-26
              </a>
              <div className="contact-messengers mt-4 flex flex-wrap gap-2">
                <a
                  href="https://max.ru/79035120326"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="messenger-btn rounded-full border border-border bg-white px-4 py-2 text-sm font-semibold hover:border-brand-green"
                >
                  MAX
                </a>
                <a
                  href="https://t.me/+79035120326"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="messenger-btn rounded-full border border-border bg-white px-4 py-2 text-sm font-semibold hover:border-brand-green"
                >
                  Telegram
                </a>
              </div>
              <p className="mt-2 text-xs text-muted">
                Макс - руководитель проектов
              </p>
            </div>

            <div className="contact-item">
              <Typography variant="eyebrow" className="text-muted">
                Email
              </Typography>
              <a
                href="mailto:dafo40@yandex.ru"
                className="mt-2 block font-semibold"
              >
                dafo40@yandex.ru
              </a>
              <a
                href="mailto:dafo40@yandex.ru"
                className="mt-3 inline-flex items-center gap-2 text-sm font-semibold underline decoration-brand-green decoration-2 underline-offset-4"
              >
                <Icon name="Mail" size={17} /> Написать письмо руководителю
              </a>
            </div>

            <div className="contact-item">
              <Typography variant="eyebrow" className="text-muted">
                Режим работы
              </Typography>
              <p className="mt-2">Ежедневно: 9:00–18:00</p>
            </div>

            <div className="contact-item">
              <Typography variant="eyebrow" className="text-muted">
                Регион работы
              </Typography>
              <p className="mt-2 leading-relaxed">
                Москва и Московская область
                <br />
                Бесплатный выезд на замер
              </p>
            </div>
          </div>

          <ContactsLeadForm />
        </div>
      </Container>
    </section>
  );
}

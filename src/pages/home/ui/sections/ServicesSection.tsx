import { Container, Icon, Typography } from "@/shared/ui";
import { PriceCalculator } from "../components/PriceCalculator";

const services = [
  [
    "Home",
    "Кадастровые работы",
    "Межевание, постановка на кадастровый учёт, технические планы, геодезические съёмки. Работаем с физическими и юридическими лицами.",
  ],
  [
    "Activity",
    "Инженерные работы",
    "Проектирование и монтаж инженерных систем: электроснабжение, водоснабжение, канализация, отопление, вентиляция.",
  ],
  [
    "Layout",
    "Проектирование",
    "Разработка архитектурных и конструктивных проектов домов и помещений. Согласование проектной документации.",
  ],
  [
    "Star",
    "Дизайн-проекты",
    "Создаём интерьеры, которые отражают ваш стиль. 3D-визуализация, рабочие чертежи, авторский надзор за реализацией.",
  ],
  [
    "Heart",
    "Хоумстейджинг",
    "Для инвесторов, покупающих квадратные метры в коммерческих целях - полный пакет услуг: отделка, ремонт, меблировка и дальнейшее управление объектом.",
  ],
  [
    "Users",
    "Управляющая компания",
    "Берём на себя управление жилой и коммерческой недвижимостью: техобслуживание, коммунальные платежи, охрана, контроль - вы получаете пассивный доход и прозрачную отчётность без личного участия.",
  ],
] as const;

export function ServicesSection() {
  return (
    <section id="services" className="bg-surface-muted py-20 md:py-28">
      <Container>
        <Typography variant="eyebrow" className="text-brand-orange">
          03 - Полный спектр
        </Typography>
        <Typography as="h2" variant="h2" className="mt-4">
          Дополнительные
          <br />
          услуги
        </Typography>
        <Typography className="mt-5 max-w-2xl text-muted">
          Всё необходимое для вашего объекта - в одном месте, с одной командой.
        </Typography>

        <div className="services-grid mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {services.map(([icon, title, description], index) => (
            <article
              key={title}
              data-tilt
              className={`svc-card reveal rounded-2xl border border-border bg-white p-7 transition duration-300 hover:-translate-y-1 hover:border-brand-green hover:shadow-xl ${index === 0 || index === 5 ? "xl:col-span-2" : ""}`}
            >
              <div
                className={`svc-icon mb-6 grid size-12 place-items-center rounded-xl ${index >= 3 ? "bg-brand-orange text-white" : "bg-brand-green/15 text-ink"}`}
              >
                <Icon name={icon} size={25} />
              </div>
              <Typography variant="h3">{title}</Typography>
              <Typography className="mt-3 text-muted">{description}</Typography>
              <button
                type="button"
                data-modal-open="modal-call"
                className="svc-link mt-6 inline-flex items-center gap-2 text-sm font-bold text-ink underline decoration-brand-green decoration-2 underline-offset-4"
              >
                Узнать подробнее <span aria-hidden="true">→</span>
              </button>
            </article>
          ))}
        </div>

        <div className="design-calc mt-14 grid gap-8 rounded-2xl bg-ink p-7 text-white md:grid-cols-2 md:p-10">
          <div>
            <Typography variant="eyebrow" className="text-brand-orange">
              Дизайн-проект
            </Typography>
            <Typography as="h3" variant="h2" className="mt-4 text-white">
              Рассчитайте стоимость дизайн-проекта
            </Typography>
            <Typography className="mt-4 text-white/55">
              В стоимость входят: концепция интерьера, планировочные решения,
              3D-визуализация, рабочие чертежи, спецификация материалов и
              авторский надзор.
            </Typography>
          </div>
          <div>
            <PriceCalculator kind="design" />
          </div>
        </div>
      </Container>
    </section>
  );
}

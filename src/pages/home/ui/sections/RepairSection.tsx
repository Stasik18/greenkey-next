"use client";

import { useState } from "react";
import Link from "next/link";
import { Button, Container, Typography } from "@/shared/ui";
import { PriceCalculator } from "../components/PriceCalculator";

const packages = [
  {
    id: "a",
    label: "Пакет А",
    title: "Черновые работы",
    description:
      "Демонтаж, выравнивание стен и полов, устройство стяжки, разводка электрики и сантехники, штукатурка",
    price: "от 16 000 ₽/м²",
  },
  {
    id: "b",
    label: "Пакет Б",
    title: "Чистовые работы",
    description:
      "Укладка плитки, ламината, покраска стен и потолков, установка дверей, монтаж сантехники и светильников - без стоимости материалов",
    price: "от 24 000 ₽/м²",
  },
  {
    id: "c",
    label: "Пакет В - хит",
    title: "Чистовые с материалом",
    description:
      "Полный комплект: работы плюс все необходимые материалы. Один договор, фиксированная цена, без дополнительных расходов",
    price: "от 35 000 ₽/м²",
    featured: true,
  },
];

export function RepairSection() {
  const [selectedPackage, setSelectedPackage] = useState("b");

  return (
    <section id="repair" className="bg-surface-muted py-20 md:py-28">
      <Container>
        <Typography variant="eyebrow" className="mb-4 text-brand-orange">
          02 - Жилые и коммерческие помещения
        </Typography>
        <Typography as="h2" variant="h2">
          Ремонт и внутренняя
          <br />
          отделка
        </Typography>
        <Typography className="mt-5 max-w-2xl text-muted">
          Выполняем все виды ремонтных и отделочных работ. От чернового
          выравнивания до чистовой отделки «под ключ» с материалами.
        </Typography>

        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {packages.map((item) => (
            <Button
              unstyled
              key={item.id}
              type="button"
              aria-pressed={selectedPackage === item.id}
              onClick={() => setSelectedPackage(item.id)}
              className={`repair-card w-full cursor-pointer rounded-2xl border bg-white p-7 text-left transition duration-200 hover:-translate-y-1 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-green ${
                selectedPackage === item.id
                  ? "border-brand-green shadow-lg shadow-brand-green/10"
                  : "border-border"
              }`}
            >
              <Typography variant="eyebrow" className="text-brand-orange">
                {item.label}
              </Typography>
              <Typography variant="h3" className="mt-3">
                {item.title}
              </Typography>
              <Typography className="mt-4 min-h-28 text-muted">
                {item.description}
              </Typography>
              <Typography variant="h3" className="mt-6">
                {item.price}
              </Typography>
            </Button>
          ))}
        </div>

        <div className="mt-16">
          <Typography variant="eyebrow" className="text-brand-orange">
            Рассчитайте стоимость
          </Typography>
          <Typography as="h3" variant="h3" className="mt-3">
            Калькулятор ремонта и отделки
          </Typography>
          <PriceCalculator
            kind="repair"
            activeOptionId={selectedPackage}
            onOptionChange={setSelectedPackage}
          />
          <Link
            href="/calculator"
            className="mt-5 inline-flex font-semibold underline decoration-brand-green decoration-2 underline-offset-4"
          >
            Подробный калькулятор комплектаций →
          </Link>
        </div>
      </Container>
    </section>
  );
}

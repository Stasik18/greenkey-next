import { Button } from "@/shared/ui";

export function PriceCalculatorIndividual() {
  return (
    <div className="p-6 md:p-8">
      <h4 className="font-heading text-xl font-bold">
        Благоустройство территории
      </h4>
      <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted">
        Забор, ворота, калитка, въездная группа, стоянка авто, дорожки,
        озеленение, дренаж участка. Стоимость рассчитывается индивидуально после
        выезда на объект и согласования пожеланий.
      </p>
      <Button className="mt-6" data-modal-open="modal-measure">
        Получить расчёт
      </Button>
    </div>
  );
}

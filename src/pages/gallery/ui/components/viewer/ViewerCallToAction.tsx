import { Button } from "@/shared/ui";
import Link from "next/link";

interface ViewerCallToActionProps {
  onOpenCall: () => void;
  onClose: () => void;
}

export function ViewerCallToAction({
  onOpenCall,
  onClose,
}: ViewerCallToActionProps) {
  return (
    <section className="vw-cta">
      <div className="cta-text">
        <h3>Хотите такой же дом?</h3>
        <p>
          Построим дом вашей мечты под ключ за 3-6 месяцев с фиксированной ценой
          по договору и гарантией 3 года.
        </p>
      </div>
      <div className="cta-btns">
        <Button
          unstyled
          type="button"
          className="btn-primary"
          onClick={onOpenCall}
        >
          Обсудить проект
        </Button>
        <Link className="btn-outline" href="/calculator" onClick={onClose}>
          Рассчитать стоимость
        </Link>
      </div>
    </section>
  );
}

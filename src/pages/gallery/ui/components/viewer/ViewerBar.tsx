import { Button } from "@/shared/ui";
import type { House } from "../../../model/gallery-data";

interface ViewerBarProps {
  house: House;
  onClose: () => void;
}

export function ViewerBar({ house, onClose }: ViewerBarProps) {
  return (
    <div className="viewer-bar">
      <Button
        unstyled
        type="button"
        className="viewer-back"
        onClick={onClose}
        data-autofocus
      >
        ← <span>Все объекты</span>
      </Button>
      <div className="vb-title" id="vb-title">
        {house.model} · {house.address}
      </div>
      <Button
        unstyled
        type="button"
        className="viewer-close"
        aria-label="Закрыть"
        onClick={onClose}
      >
        ×
      </Button>
    </div>
  );
}

import type { House } from "../../../model/gallery-data";

interface ViewerBarProps {
  house: House;
  onClose: () => void;
}

export function ViewerBar({ house, onClose }: ViewerBarProps) {
  return (
    <div className="viewer-bar">
      <button
        type="button"
        className="viewer-back"
        onClick={onClose}
        data-autofocus
      >
        ← <span>Все объекты</span>
      </button>
      <div className="vb-title" id="vb-title">
        {house.model} · {house.address}
      </div>
      <button
        type="button"
        className="viewer-close"
        aria-label="Закрыть"
        onClick={onClose}
      >
        ×
      </button>
    </div>
  );
}

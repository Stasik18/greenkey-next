import type { House, Photo } from "../../../model/gallery-data";
import { STAGES } from "../../../model/gallery-data";
import { getGroupPhotos } from "../../../lib/gallery-utils";
import { ConstructionStage } from "./ConstructionStage";

interface ConstructionTimelineProps {
  house: House;
  onOpenPhoto: (photos: Photo[], index: number) => void;
}

export function ConstructionTimeline({
  house,
  onOpenPhoto,
}: ConstructionTimelineProps) {
  return (
    <section className="vw-timeline-section">
      <div className="vw-sec-label">Ход строительства</div>
      <h2 className="vw-sec-title">Как строился этот дом</h2>
      <p className="vw-sec-sub">
        От первой сваи до готового дома под ключ. Каждый этап мы документируем -
        вы всегда видите, что происходит на вашем объекте.
      </p>
      <div className="timeline">
        {STAGES.map((stage, index) => (
          <ConstructionStage
            key={stage.key}
            stage={stage}
            index={index}
            photos={getGroupPhotos(house, stage.key, stage.label)}
            onOpenPhoto={onOpenPhoto}
          />
        ))}
      </div>
    </section>
  );
}

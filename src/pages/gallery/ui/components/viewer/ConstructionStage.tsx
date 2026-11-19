import { Button } from "@/shared/ui";
import Image from "next/image";

import type { Photo, Stage } from "../../../model/gallery-data";

interface ConstructionStageProps {
  stage: Stage;
  index: number;
  photos: Photo[];
  onOpenPhoto: (photos: Photo[], index: number) => void;
}

export function ConstructionStage({
  stage,
  index,
  photos,
  onOpenPhoto,
}: ConstructionStageProps) {
  const amount = photos.length;

  return (
    <article className={`tl-step${amount ? " done" : ""}`} key={stage.key}>
      <div className="tl-rail">
        <div className="tl-dot">{index + 1}</div>
        <div className="tl-line" />
      </div>
      <div className="tl-card">
        <div className="tl-photo">
          <span className="tl-stagetag">{stage.label}</span>
          {amount ? (
            <Button
              unstyled
              type="button"
              className="tl-main-photo"
              onClick={() => onOpenPhoto(photos, 0)}
            >
              <Image
                unoptimized
                src={photos[0].src}
                alt={photos[0].alt}
                fill
                sizes="(max-width: 700px) 100vw, 60vw"
              />
            </Button>
          ) : (
            <div className="tl-ph">
              <span>
                Фотоотчёт этого этапа
                <br />
                скоро появится
              </span>
            </div>
          )}
        </div>
        <div className="tl-text">
          <h3>{stage.label}</h3>
          <p>{stage.description}</p>
          {amount > 1 && <div className="tl-count">{amount} фото этапа</div>}
        </div>
        {amount > 1 && (
          <div className="tl-strip">
            {photos.slice(1).map((photo, photoNumber) => (
              <Button
                unstyled
                type="button"
                className="tl-thumb"
                key={photo.src}
                aria-label={`${stage.label} - открыть фото ${photoNumber + 2} из ${amount}`}
                onClick={() => onOpenPhoto(photos, photoNumber + 1)}
              >
                <Image
                  unoptimized
                  src={photo.src.replace(".webp", "-t.webp")}
                  alt=""
                  width={120}
                  height={90}
                />
              </Button>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}

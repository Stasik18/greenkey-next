import { Button } from "@/shared/ui";
import Image from "next/image";

import { HOUSES, type House } from "../../model/gallery-data";
import { getPhotoSummary } from "../../lib/gallery-utils";

interface GalleryHouseGridProps {
  openViewer: (house: House, opener?: HTMLElement | null) => void;
}

export function GalleryHouseGrid({ openViewer }: GalleryHouseGridProps) {
  return (
    <div className="gal-shell">
      <div
        className={`obj-grid${HOUSES.length === 1 ? " is-single" : ""}`}
        id="obj-grid"
      >
        {HOUSES.map((house) => {
          const built = house.status !== "progress";

          return (
            <Button
              unstyled
              type="button"
              className="obj-card"
              key={house.id}
              data-house-id={house.id}
              onClick={(event) => openViewer(house, event.currentTarget)}
            >
              <div className="obj-media">
                <span className={`obj-status${built ? "" : " is-progress"}`}>
                  <i />
                  {built ? "Построен" : "Строится"}
                </span>
                {house.year && <span className="obj-year">{house.year}</span>}
                <Image
                  unoptimized
                  src={house.cover}
                  alt={`${house.model} - ${house.address}`}
                  fill
                  sizes="(max-width: 700px) 100vw, 50vw"
                />
                <div className="obj-onmedia">
                  <div className="om-model">{house.model}</div>
                  <div className="om-addr">⌖ {house.address}</div>
                </div>
              </div>
              <div className="obj-body">
                <div className="obj-chips">
                  <span className="obj-chip">▦ {house.area} м²</span>
                  <span className="obj-chip">⌂ {house.floors} эт.</span>
                  <span className="obj-chip">◷ {house.term}</span>
                </div>
                <p className="obj-sum">
                  {house.type}. {getPhotoSummary(house)}
                </p>
                <div className="obj-open">
                  Смотреть галерею стройки <span className="oo-arrow">→</span>
                </div>
              </div>
            </Button>
          );
        })}
      </div>
    </div>
  );
}

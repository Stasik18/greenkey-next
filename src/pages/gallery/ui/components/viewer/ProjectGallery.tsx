import Image from "next/image";

import type { House, Photo } from "../../../model/gallery-data";
import { count, getGroupPhotos } from "../../../lib/gallery-utils";

interface ProjectGalleryProps {
  house: House;
  onOpenPhoto: (photos: Photo[], index: number) => void;
}

export function ProjectGallery({ house, onOpenPhoto }: ProjectGalleryProps) {
  const amount = count(house, "project") + count(house, "plan");
  if (!amount) return null;

  const photos = getGroupPhotos(house, "project", "Проект");

  return (
    <section className="vw-project-section">
      <div className="vw-sec-label">Проект</div>
      <h2 className="vw-sec-title">Каким дом задумывался</h2>
      <p className="vw-sec-sub">
        Визуализации и планировка, по которым велось строительство. Ниже -
        фотоотчёт: сравните замысел с результатом.
      </p>
      <div className="vw-project">
        {photos.map((photo, index) => (
          <button
            type="button"
            key={photo.src}
            className={photo.src.includes("plan-") ? "is-plan" : ""}
            onClick={() => onOpenPhoto(photos, index)}
          >
            <Image
              unoptimized
              src={photo.src.replace(".webp", "-t.webp")}
              alt={photo.alt}
              width={560}
              height={380}
            />
          </button>
        ))}
      </div>
    </section>
  );
}

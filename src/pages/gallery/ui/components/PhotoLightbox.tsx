import type { Dispatch, RefObject, SetStateAction, TouchEvent } from "react";
import Image from "next/image";

import type { Photo } from "../../model/gallery-data";

interface PhotoLightboxProps {
  lightboxRef: RefObject<HTMLDivElement | null>;
  lightboxPhotos: Photo[];
  photoIndex: number;
  setPhotoIndex: Dispatch<SetStateAction<number>>;
  closeLightbox: () => void;
  handleTouchStart: (event: TouchEvent<HTMLDivElement>) => void;
  handleTouchEnd: (event: TouchEvent<HTMLDivElement>) => void;
}

export function PhotoLightbox({
  lightboxRef,
  lightboxPhotos,
  photoIndex,
  setPhotoIndex,
  closeLightbox,
  handleTouchStart,
  handleTouchEnd,
}: PhotoLightboxProps) {
  if (!lightboxPhotos.length) return null;

  return (
    <div
      ref={lightboxRef}
      className="lightbox open"
      role="dialog"
      aria-modal="true"
      aria-label="Просмотр фотографии"
      tabIndex={-1}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) closeLightbox();
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <button
        type="button"
        className="lb-close"
        aria-label="Закрыть фотографию"
        data-autofocus
        onClick={closeLightbox}
      >
        ×
      </button>
      {lightboxPhotos.length > 1 && (
        <>
          <button
            type="button"
            className="lb-nav lb-prev"
            aria-label="Предыдущее фото"
            onClick={() =>
              setPhotoIndex(
                (photoIndex - 1 + lightboxPhotos.length) %
                  lightboxPhotos.length,
              )
            }
          >
            ‹
          </button>
          <button
            type="button"
            className="lb-nav lb-next"
            aria-label="Следующее фото"
            onClick={() =>
              setPhotoIndex((photoIndex + 1) % lightboxPhotos.length)
            }
          >
            ›
          </button>
          <span className="lb-counter" aria-live="polite">
            {photoIndex + 1} / {lightboxPhotos.length}
          </span>
        </>
      )}
      <Image
        unoptimized
        src={lightboxPhotos[photoIndex].src}
        alt={lightboxPhotos[photoIndex].alt}
        width={1800}
        height={1200}
        sizes="100vw"
        priority
      />
    </div>
  );
}

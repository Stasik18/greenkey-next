"use client";

import { useMemo, useRef, type ReactNode } from "react";

import { GalleryHouseGrid } from "./components/GalleryHouseGrid";
import { HouseViewer } from "./components/HouseViewer";
import { PhotoLightbox } from "./components/PhotoLightbox";
import { GalleryCallModal } from "./components/GalleryCallModal";
import { useGalleryController } from "./hooks/useGalleryController";

interface GalleryInteractiveProps {
  header: ReactNode;
  footer: ReactNode;
}

export function GalleryInteractive({
  header,
  footer,
}: GalleryInteractiveProps) {
  const galleryContentRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<HTMLDivElement>(null);
  const lightboxRef = useRef<HTMLDivElement>(null);
  const callModalRef = useRef<HTMLDivElement>(null);

  const refs = useMemo(
    () => ({ galleryContentRef, viewerRef, lightboxRef, callModalRef }),
    [],
  );
  const gallery = useGalleryController(refs);

  return (
    <main className="gallery-page">
      <div
        ref={galleryContentRef}
        aria-hidden={Boolean(gallery.activeHouse)}
        className="gallery-content"
      >
        {header}
        <GalleryHouseGrid openViewer={gallery.openViewer} />
        {footer}
      </div>

      {gallery.activeHouse && (
        <HouseViewer
          activeHouse={gallery.activeHouse}
          viewerRef={viewerRef}
          lightboxPhotosLength={gallery.lightboxPhotos.length}
          isCallModalOpen={gallery.isCallModalOpen}
          closeViewer={gallery.closeViewer}
          openPhoto={gallery.openPhoto}
          openCall={gallery.openCall}
        />
      )}

      <PhotoLightbox
        lightboxRef={lightboxRef}
        lightboxPhotos={gallery.lightboxPhotos}
        photoIndex={gallery.photoIndex}
        setPhotoIndex={gallery.setPhotoIndex}
        closeLightbox={gallery.closeLightbox}
        handleTouchStart={gallery.handleTouchStart}
        handleTouchEnd={gallery.handleTouchEnd}
      />

      {gallery.isCallModalOpen && (
        <GalleryCallModal
          callTitle={gallery.callTitle}
          callContext={gallery.callContext}
          closeCall={gallery.closeCall}
          callModalRef={callModalRef}
        />
      )}
    </main>
  );
}

import type { RefObject } from "react";

import type { House, Photo } from "../../model/gallery-data";
import { ViewerBar } from "./viewer/ViewerBar";
import { ViewerHero } from "./viewer/ViewerHero";
import { HouseFacts } from "./viewer/HouseFacts";
import { ProjectGallery } from "./viewer/ProjectGallery";
import { ConstructionTimeline } from "./viewer/ConstructionTimeline";
import { ViewerCallToAction } from "./viewer/ViewerCallToAction";

interface HouseViewerProps {
  activeHouse: House;
  viewerRef: RefObject<HTMLDivElement | null>;
  lightboxPhotosLength: number;
  isCallModalOpen: boolean;
  closeViewer: () => void;
  openPhoto: (photos: Photo[], index: number) => void;
  openCall: () => void;
}

export function HouseViewer({
  activeHouse,
  viewerRef,
  lightboxPhotosLength,
  isCallModalOpen,
  closeViewer,
  openPhoto,
  openCall,
}: HouseViewerProps) {
  return (
    <div
      ref={viewerRef}
      className="viewer open"
      role="dialog"
      aria-modal="true"
      aria-hidden={Boolean(lightboxPhotosLength > 0 || isCallModalOpen)}
      aria-labelledby="vb-title"
      tabIndex={-1}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) closeViewer();
      }}
    >
      <ViewerBar house={activeHouse} onClose={closeViewer} />
      <div className="viewer-content">
        <ViewerHero house={activeHouse} />
        <div className="vw-body">
          <HouseFacts house={activeHouse} />
          <ProjectGallery house={activeHouse} onOpenPhoto={openPhoto} />
          <ConstructionTimeline house={activeHouse} onOpenPhoto={openPhoto} />
          <ViewerCallToAction onOpenCall={openCall} onClose={closeViewer} />
        </div>
      </div>
    </div>
  );
}

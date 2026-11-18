"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type RefObject,
} from "react";

import { useLockBodyScroll } from "@/shared/lib/hooks";

import { HOUSES } from "../../model/gallery-data";
import type { House, Photo } from "../../model/gallery-data";
import { useGalleryKeyboard } from "./useGalleryKeyboard";
import { useGalleryLayerAccessibility } from "./useGalleryLayerAccessibility";
import { useLightboxSwipe } from "./useLightboxSwipe";

interface GalleryRefs {
  galleryContentRef: RefObject<HTMLDivElement | null>;
  viewerRef: RefObject<HTMLDivElement | null>;
  lightboxRef: RefObject<HTMLDivElement | null>;
  callModalRef: RefObject<HTMLDivElement | null>;
}

export function useGalleryController(refs: GalleryRefs) {
  const [activeHouse, setActiveHouse] = useState<House | null>(null);
  const [lightboxPhotos, setLightboxPhotos] = useState<Photo[]>([]);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [isCallModalOpen, setIsCallModalOpen] = useState(false);
  const [callTitle, setCallTitle] = useState("Хочу такой же дом");
  const [callContext, setCallContext] = useState("");

  const viewerOpenerRef = useRef<HTMLElement | null>(null);
  const lightboxOpenerRef = useRef<HTMLElement | null>(null);
  const callOpenerRef = useRef<HTMLElement | null>(null);

  const hasOverlay = Boolean(
    activeHouse || lightboxPhotos.length || isCallModalOpen,
  );
  useLockBodyScroll(hasOverlay);

  const openViewer = useCallback(
    (house: House, opener?: HTMLElement | null) => {
      viewerOpenerRef.current =
        opener ??
        document.querySelector<HTMLElement>(`[data-house-id="${house.id}"]`);
      setActiveHouse(house);
      window.history.replaceState(window.history.state, "", `#${house.id}`);
    },
    [],
  );

  const closeViewer = useCallback(() => {
    const houseId = activeHouse?.id;
    const opener = viewerOpenerRef.current;
    setActiveHouse(null);

    if (houseId && window.location.hash === `#${houseId}`) {
      window.history.replaceState(
        window.history.state,
        "",
        `${window.location.pathname}${window.location.search}`,
      );
    }

    window.setTimeout(() => {
      if (opener?.isConnected) opener.focus();
    }, 0);
  }, [activeHouse]);

  const openPhoto = useCallback((photos: Photo[], index: number) => {
    lightboxOpenerRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    setLightboxPhotos(photos);
    setPhotoIndex(Math.min(Math.max(index, 0), photos.length - 1));
  }, []);

  const closeLightbox = useCallback(() => {
    const opener = lightboxOpenerRef.current;
    setLightboxPhotos([]);
    lightboxOpenerRef.current = null;
    window.setTimeout(() => {
      if (opener?.isConnected) opener.focus();
    }, 0);
  }, []);

  const openCall = useCallback(() => {
    const model = activeHouse?.model.replace(/[«»]/g, "") ?? "";
    callOpenerRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    setCallTitle(model ? `Хочу дом «${model}»` : "Хочу такой же дом");
    setCallContext(model ? `Заявка из карточки объекта: ${model}` : "");
    setIsCallModalOpen(true);
  }, [activeHouse]);

  const closeCall = useCallback(() => {
    const opener = callOpenerRef.current;
    setIsCallModalOpen(false);
    callOpenerRef.current = null;
    window.setTimeout(() => {
      if (opener?.isConnected) opener.focus();
    }, 0);
  }, []);

  const changePhoto = useCallback(
    (direction: 1 | -1) => {
      setPhotoIndex(
        (current) =>
          (current + direction + lightboxPhotos.length) % lightboxPhotos.length,
      );
    },
    [lightboxPhotos.length],
  );

  useEffect(() => {
    const houseId = window.location.hash.slice(1);
    const house = HOUSES.find((item) => item.id === houseId);
    if (!house) return;

    const frame = window.requestAnimationFrame(() => openViewer(house));
    return () => window.cancelAnimationFrame(frame);
  }, [openViewer]);

  useGalleryKeyboard({
    isOpen: hasOverlay,
    isCallModalOpen,
    lightboxLength: lightboxPhotos.length,
    onCloseCall: closeCall,
    onCloseLightbox: closeLightbox,
    onCloseViewer: closeViewer,
    onChangePhoto: changePhoto,
  });

  const layerRefs = useMemo(
    () => ({
      content: refs.galleryContentRef,
      viewer: refs.viewerRef,
      lightbox: refs.lightboxRef,
      call: refs.callModalRef,
    }),
    [refs],
  );
  useGalleryLayerAccessibility(
    layerRefs,
    activeHouse,
    lightboxPhotos.length,
    isCallModalOpen,
  );

  const { handleTouchStart, handleTouchEnd } = useLightboxSwipe(
    lightboxPhotos.length,
    changePhoto,
  );

  return {
    activeHouse,
    lightboxPhotos,
    photoIndex,
    setPhotoIndex,
    isCallModalOpen,
    callTitle,
    callContext,
    openViewer,
    closeViewer,
    openPhoto,
    closeLightbox,
    openCall,
    closeCall,
    handleTouchStart,
    handleTouchEnd,
  };
}

"use client";

import { useEffect } from "react";

interface GalleryKeyboardOptions {
  isOpen: boolean;
  isCallModalOpen: boolean;
  lightboxLength: number;
  onCloseCall: () => void;
  onCloseLightbox: () => void;
  onCloseViewer: () => void;
  onChangePhoto: (direction: 1 | -1) => void;
}

export function useGalleryKeyboard({
  isOpen,
  isCallModalOpen,
  lightboxLength,
  onCloseCall,
  onCloseLightbox,
  onCloseViewer,
  onChangePhoto,
}: GalleryKeyboardOptions) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        if (isCallModalOpen) onCloseCall();
        else if (lightboxLength) onCloseLightbox();
        else onCloseViewer();
        return;
      }

      if (!lightboxLength) return;
      if (event.key === "ArrowRight") {
        event.preventDefault();
        onChangePhoto(1);
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        onChangePhoto(-1);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [
    isOpen,
    isCallModalOpen,
    lightboxLength,
    onCloseCall,
    onCloseLightbox,
    onCloseViewer,
    onChangePhoto,
  ]);
}

"use client";

import { useCallback, useRef, type TouchEvent } from "react";

export function useLightboxSwipe(
  photoCount: number,
  onChangePhoto: (direction: 1 | -1) => void,
) {
  const touchStartXRef = useRef<number | null>(null);

  const handleTouchStart = useCallback((event: TouchEvent<HTMLDivElement>) => {
    touchStartXRef.current = event.changedTouches[0]?.clientX ?? null;
  }, []);

  const handleTouchEnd = useCallback(
    (event: TouchEvent<HTMLDivElement>) => {
      const startX = touchStartXRef.current;
      const endX = event.changedTouches[0]?.clientX;
      touchStartXRef.current = null;

      if (startX === null || endX === undefined || photoCount < 2) return;
      const delta = endX - startX;
      if (Math.abs(delta) <= 40) return;
      onChangePhoto(delta < 0 ? 1 : -1);
    },
    [photoCount, onChangePhoto],
  );

  return { handleTouchStart, handleTouchEnd };
}

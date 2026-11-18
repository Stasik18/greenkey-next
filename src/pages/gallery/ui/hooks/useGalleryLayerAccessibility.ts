"use client";

import { useEffect, useRef, type RefObject } from "react";

import type { House } from "../../model/gallery-data";

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

type LayerType = "viewer" | "lightbox" | "call" | null;

interface GalleryLayerRefs {
  content: RefObject<HTMLDivElement | null>;
  viewer: RefObject<HTMLDivElement | null>;
  lightbox: RefObject<HTMLDivElement | null>;
  call: RefObject<HTMLDivElement | null>;
}

export function useGalleryLayerAccessibility(
  refs: GalleryLayerRefs,
  activeHouse: House | null,
  lightboxLength: number,
  isCallModalOpen: boolean,
) {
  const previousLayerRef = useRef<LayerType>(null);

  useEffect(() => {
    const layerType: LayerType = isCallModalOpen
      ? "call"
      : lightboxLength
        ? "lightbox"
        : activeHouse
          ? "viewer"
          : null;

    const previousLayer = previousLayerRef.current;
    previousLayerRef.current = layerType;

    const topLayer =
      layerType === "call"
        ? refs.call.current
        : layerType === "lightbox"
          ? refs.lightbox.current
          : layerType === "viewer"
            ? refs.viewer.current
            : null;

    if (!topLayer) return;

    const shouldAutofocus = !(
      layerType === "viewer" &&
      (previousLayer === "lightbox" || previousLayer === "call")
    );

    const backgroundTargets = [
      document.getElementById("nav"),
      document.querySelector<HTMLElement>("footer"),
      document.querySelector<HTMLElement>("[data-call-button]"),
      refs.content.current,
    ];

    if (lightboxLength || isCallModalOpen) {
      backgroundTargets.push(refs.viewer.current);
    }

    const inerted = Array.from(new Set(backgroundTargets)).filter(
      (element): element is HTMLElement =>
        Boolean(element && element !== topLayer),
    );
    const previousInert = inerted.map((element) => element.inert);
    inerted.forEach((element) => {
      element.inert = true;
    });

    const focusables = () =>
      Array.from(
        topLayer.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
      ).filter((element) => element.offsetWidth || element.offsetHeight);

    const frame = shouldAutofocus
      ? window.requestAnimationFrame(() => {
          const initialFocus =
            topLayer.querySelector<HTMLElement>("[data-autofocus]");
          (initialFocus ?? focusables()[0] ?? topLayer).focus();
        })
      : 0;

    const trapFocus = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;
      const elements = focusables();

      if (!elements.length) {
        event.preventDefault();
        topLayer.focus();
        return;
      }

      const first = elements[0];
      const last = elements[elements.length - 1];

      if (!topLayer.contains(document.activeElement)) {
        event.preventDefault();
        (event.shiftKey ? last : first).focus();
      } else if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", trapFocus, true);

    return () => {
      window.cancelAnimationFrame(frame);
      document.removeEventListener("keydown", trapFocus, true);
      inerted.forEach((element, index) => {
        element.inert = previousInert[index];
      });
    };
  }, [activeHouse, lightboxLength, isCallModalOpen, refs]);
}

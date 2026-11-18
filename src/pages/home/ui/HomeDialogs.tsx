"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import {
  useClickOutside,
  useKeyDown,
  useLockBodyScroll,
} from "@/shared/lib/hooks";
import { HomeLeadModal } from "./components/HomeLeadModal";

type ModalId = "modal-call" | "modal-measure";

export function HomeDialogs() {
  const [activeModal, setActiveModal] = useState<ModalId | null>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);
  const modalRootRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => setActiveModal(null), []);
  const panelRef = useClickOutside<HTMLDivElement>(close, {
    isActive: activeModal !== null,
  });

  useLockBodyScroll(activeModal !== null);
  useKeyDown("Escape", close, activeModal !== null);

  useEffect(() => {
    if (!activeModal) return;

    previouslyFocused.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    const modalRoot = modalRootRef.current;
    const inerted = Array.from(document.body.children)
      .filter((element) => {
        if (element === modalRoot) return false;
        if (["SCRIPT", "STYLE", "LINK"].includes(element.tagName)) return false;
        return !element.hasAttribute("inert");
      })
      .map((element) => element as HTMLElement);

    inerted.forEach((element) => {
      element.inert = true;
    });

    const frame = window.requestAnimationFrame(() => {
      panelRef.current
        ?.querySelector<HTMLElement>(
          '[data-autofocus], input:not([type="hidden"]), button, select, textarea',
        )
        ?.focus();
    });

    const trapFocus = (event: KeyboardEvent) => {
      if (event.key !== "Tab" || !panelRef.current) return;
      const focusable = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((element) => element.offsetWidth || element.offsetHeight);

      if (focusable.length === 0) {
        event.preventDefault();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", trapFocus);
    return () => {
      window.cancelAnimationFrame(frame);
      document.removeEventListener("keydown", trapFocus);
      inerted.forEach((element) => {
        element.inert = false;
      });
      previouslyFocused.current?.focus();
      previouslyFocused.current = null;
    };
  }, [activeModal, panelRef]);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const trigger = target.closest<HTMLElement>("[data-modal-open]");
      const modalId = trigger?.dataset.modalOpen;

      if (modalId === "modal-call" || modalId === "modal-measure") {
        setActiveModal(modalId);
      }
    };

    const handleCloseEvent = () => close();

    document.addEventListener("click", handleClick);
    window.addEventListener("home:close-modal", handleCloseEvent);
    return () => {
      document.removeEventListener("click", handleClick);
      window.removeEventListener("home:close-modal", handleCloseEvent);
    };
  }, [close]);

  if (!activeModal) return null;

  return (
    <div ref={modalRootRef}>
      <HomeLeadModal
        activeModal={activeModal}
        panelRef={panelRef}
        onClose={close}
      />
    </div>
  );
}

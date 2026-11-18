import { useEffect, useRef } from "react";

type UseClickOutsideOptions = {
  isActive?: boolean;
  eventType?: "pointerdown" | "mousedown" | "click";
};

export function useClickOutside<T extends HTMLElement>(
  onClickOutside: (event: MouseEvent | PointerEvent) => void,
  { isActive = true, eventType = "pointerdown" }: UseClickOutsideOptions = {},
) {
  const elementRef = useRef<T>(null);
  const callbackRef = useRef(onClickOutside);

  useEffect(() => {
    callbackRef.current = onClickOutside;
  }, [onClickOutside]);

  useEffect(() => {
    if (!isActive) return;

    const handleEvent = (event: Event) => {
      const element = elementRef.current;

      if (!element || element.contains(event.target as Node)) return;

      callbackRef.current(event as MouseEvent | PointerEvent);
    };

    document.addEventListener(eventType, handleEvent);

    return () => {
      document.removeEventListener(eventType, handleEvent);
    };
  }, [eventType, isActive]);

  return elementRef;
}

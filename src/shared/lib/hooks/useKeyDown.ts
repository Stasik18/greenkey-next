import { useEffect, useRef } from "react";

type UseKeyDownCallback = (event: KeyboardEvent) => void;

export function useKeyDown(
  key: string,
  onKeyDown: UseKeyDownCallback,
  isActive = true,
): void {
  const callbackRef = useRef(onKeyDown);

  useEffect(() => {
    callbackRef.current = onKeyDown;
  }, [onKeyDown]);

  useEffect(() => {
    if (!isActive) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === key) callbackRef.current(event);
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [key, isActive]);
}

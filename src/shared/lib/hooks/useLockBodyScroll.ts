import { useEffect } from "react";

let lockCount = 0;
let originalStyles: {
  htmlOverflow: string;
  bodyOverflow: string;
  bodyPaddingRight: string;
} | null = null;

function acquireScrollLock() {
  if (lockCount === 0) {
    const html = document.documentElement;
    const body = document.body;
    const scrollbarWidth = window.innerWidth - html.clientWidth;

    originalStyles = {
      htmlOverflow: html.style.overflow,
      bodyOverflow: body.style.overflow,
      bodyPaddingRight: body.style.paddingRight,
    };

    if (scrollbarWidth > 0) {
      const currentPadding =
        Number.parseFloat(window.getComputedStyle(body).paddingRight) || 0;

      body.style.paddingRight = `${currentPadding + scrollbarWidth}px`;
    }

    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
  }

  lockCount += 1;

  return () => {
    lockCount = Math.max(0, lockCount - 1);

    if (lockCount !== 0 || !originalStyles) return;

    document.documentElement.style.overflow = originalStyles.htmlOverflow;
    document.body.style.overflow = originalStyles.bodyOverflow;
    document.body.style.paddingRight = originalStyles.bodyPaddingRight;

    originalStyles = null;
  };
}

export function useLockBodyScroll(isLocked = true): void {
  useEffect(() => {
    if (!isLocked) return;

    return acquireScrollLock();
  }, [isLocked]);
}

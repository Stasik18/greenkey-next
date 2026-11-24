import { useEffect, useRef, useState } from "react";

type UseIntersectionObserverOptions = {
  threshold?: number | number[];
  root?: Element | null;
  rootMargin?: string;
  isActive?: boolean;
  freezeOnceVisible?: boolean;
};

export function useIntersectionObserver<T extends HTMLElement>({
  threshold = 0,
  root = null,
  rootMargin = "0px",
  isActive = true,
  freezeOnceVisible = false,
}: UseIntersectionObserverOptions = {}) {
  const elementRef = useRef<T>(null);
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);

  const isVisible = Boolean(entry?.isIntersecting);

  useEffect(() => {
    const element = elementRef.current;

    if (!isActive || !element) return;
    if (freezeOnceVisible && entry?.isIntersecting) return;

    const observer = new IntersectionObserver(
      ([observerEntry]) => {
        setEntry(observerEntry);
      },
      { threshold, root, rootMargin },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [
    isActive,
    threshold,
    root,
    rootMargin,
    freezeOnceVisible,
    entry?.isIntersecting,
  ]);

  return { ref: elementRef, entry, isVisible };
}

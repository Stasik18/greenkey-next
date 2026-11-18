export function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function isConnectionLimited() {
  const connection = (
    navigator as Navigator & {
      connection?: { saveData?: boolean; effectiveType?: string };
    }
  ).connection;

  return Boolean(
    connection?.saveData || /(^|-)2g$/.test(connection?.effectiveType ?? ""),
  );
}

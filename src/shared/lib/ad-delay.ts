// Measured from this document's navigation start, not hydration or an SPA
// route change. A full page navigation gets its own 30-second delay.
export const AD_LOAD_DELAY_MS = 30_000;

export function afterDocumentAdDelay(load: () => void): () => void {
  let timer: number | undefined;
  let cancelled = false;

  const check = () => {
    if (cancelled) return;
    const remaining = AD_LOAD_DELAY_MS - performance.now();
    if (remaining > 0) {
      timer = window.setTimeout(check, remaining);
    } else {
      load();
    }
  };

  check();
  return () => {
    cancelled = true;
    window.clearTimeout(timer);
  };
}

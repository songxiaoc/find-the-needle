/**
 * Ad placeholder. Reserves a fixed box so that wiring a real ad unit later does
 * NOT cause layout shift (CLS). Until an ad provider is wired, it renders a
 * labelled dev-only placeholder and renders NOTHING in production — so the live
 * site never shows the glaring empty white box you see on some wiki sites.
 *
 * To go live: replace the dev placeholder body with your ad provider's slot
 * markup (AdSense <ins>, etc.), keep the fixed `height` to preserve the CLS
 * guarantee, and drop the production early-return.
 */
export function AdSlot({
  height = 250,
  className = '',
}: {
  /** Reserved height in px — keep stable to avoid layout shift when ads load. */
  height?: number;
  className?: string;
}) {
  // No ad provider wired yet → show nothing in prod (no empty white box).
  if (process.env.NODE_ENV === 'production') return null;

  return (
    <div
      aria-label="Advertisement"
      className={`border-site-outline-variant bg-site-surface-container text-site-outline grid place-items-center border border-dashed ${className}`}
      style={{ height }}
    >
      <span
        style={{
          fontFamily: 'var(--font-site-mono)',
          fontSize: 10,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
        }}
      >
        Ad slot · {height}px
      </span>
    </div>
  );
}

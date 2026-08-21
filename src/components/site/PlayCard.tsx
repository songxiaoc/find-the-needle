import { gameConfig } from '@/config/game';

/**
 * "Play the game" promo card for the sidebar. Pulls the external play URL from
 * gameConfig.playUrl. Renders NOTHING when no playUrl is set, so the template
 * degrades gracefully (no dead button) until a site wires its game link.
 *
 * The cover image is gameConfig.coverImage (the game's key-art) — NOT the OG
 * social card, which is a screenshot of this very homepage. When no coverImage
 * is set the card simply omits the image.
 */
export function PlayCard() {
  const { playUrl, playLabel, gameFullName, tagline, siteName, coverImage } =
    gameConfig;
  if (!playUrl) return null;

  return (
    <section
      aria-label={`Play ${gameFullName}`}
      className="ui-shaped border-site-outline-strong bg-site-surface-container overflow-hidden border"
    >
      {coverImage && (
        <img
          src={coverImage}
          alt={`${gameFullName} cover art`}
          className="aspect-[16/9] w-full object-cover"
          width={320}
          height={180}
        />
      )}
      <div className="p-4">
        <p
          className="text-site-on-surface"
          style={{
            fontFamily: 'var(--font-site-display)',
            fontSize: 16,
            fontWeight: 600,
          }}
        >
          {gameFullName}
        </p>
        <p
          className="text-site-on-surface-variant mt-1 line-clamp-2"
          style={{
            fontFamily: 'var(--font-site-body)',
            fontSize: 12,
            lineHeight: 1.5,
          }}
        >
          {tagline}
        </p>
        <a
          href={playUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-site-primary text-site-on-primary mt-3 inline-flex items-center gap-2 px-4 py-2.5 transition-[filter] hover:brightness-110"
          style={{
            fontFamily: 'var(--font-site-display)',
            fontSize: 13,
            fontWeight: 600,
          }}
          title={`Play ${gameFullName} (opens ${new URL(playUrl).hostname})`}
        >
          {playLabel || 'Play now'}
          <span aria-hidden style={{ fontFamily: 'var(--font-site-mono)' }}>
            ↗
          </span>
        </a>
      </div>
      <span className="sr-only">
        External link to {siteName}&apos;s game page.
      </span>
    </section>
  );
}

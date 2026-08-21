import { gameConfig } from '@/config/game';
import { getGuideCategories } from '@/config/guides-content';

/**
 * /llms.txt — generated at build time from the same config that drives the
 * site (gameConfig + content/guides/**), so the version stamp and guide list
 * never drift from the rest of the site. Prose blocks that have no structured source
 * (sourcing policy, the about paragraph, affiliation) live here as the source
 * of truth — edit them for your game.
 *
 * Served at the canonical /llms.txt. The intl middleware skips any path with a
 * dot, so this stays un-localized like robots.ts / sitemap.ts.
 */
export const dynamic = 'force-static';

// Canonical production origin, matching robots.ts / sitemap.ts behaviour:
// llms.txt URLs should always point at the real domain regardless of the
// preview env's NEXT_PUBLIC_APP_URL.
const SITE = gameConfig.origin;

/** Reference / utility pages, in display order. */
const REFERENCE: { label: string; path: string }[] = [
  { label: 'FAQ', path: '/faq' },
  { label: 'System requirements', path: '/system-requirements' },
  { label: 'Troubleshooting', path: '/troubleshooting' },
  { label: 'About + sourcing policy', path: '/about' },
  { label: 'Contact', path: '/contact' },
  { label: 'Sitemap', path: '/sitemap.xml' },
];

function buildLlmsTxt(): string {
  // Grouped by category so the structure mirrors the site's information
  // architecture (one section per content type), discovered from the filesystem.
  const guideLines = getGuideCategories()
    .map((cat) => {
      const articles = cat.items
        .map((g) => `- ${g.title}: ${SITE}${g.href}\n  — ${g.description}`)
        .join('\n');
      return `### ${cat.title} (${SITE}/guides/${cat.slug})\n${articles}`;
    })
    .join('\n\n');

  const referenceLines = REFERENCE.map(
    (r) => `- ${r.label}: ${SITE}${r.path}`
  ).join('\n');

  return `# ${gameConfig.siteName} — ${gameConfig.domain}

> Independent fan site for ${gameConfig.gameFullName} (${gameConfig.disclaimer.publisher}).
> All content version-stamped against the patch it was last verified on.
> Currently tracking v${gameConfig.gameVersion}.

## Sourcing policy

No fabricated facts. Every value is verified against an in-game screen or
an official source before it ships. Patch summaries quote official
announcements and pages retain their validation version.

## Guides

- Home: ${SITE}/
${guideLines}
- All guides: ${SITE}/guides

## Reference

${referenceLines}

## About the game

${gameConfig.tagline}
Platforms tracked by this guide: ${gameConfig.game?.platforms?.join(', ') || 'see the official game listing'}.
Genres: ${gameConfig.game?.genre?.join(', ') || 'see the official game listing'}.

## Affiliation

Unofficial fan site. Not affiliated with, endorsed by, or sponsored by
${gameConfig.disclaimer.publisher}. ${gameConfig.disclaimer.trademarkOwners}
`;
}

export function GET(): Response {
  return new Response(buildLlmsTxt(), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}

import { gameConfig } from '@/config/game';
import { getAllGuides, getGuideCategories } from '@/config/guides-content';
import { localeNames, locales } from '@/config/locale';
import { PUBLIC_PAGES } from '@/config/locale/routes';
import { localizedUrl } from '@/shared/lib/seo';

export const dynamic = 'force-static';

function buildLlmsTxt(): string {
  const languageSections = locales
    .map((locale) => {
      const references = PUBLIC_PAGES.map(
        (page) => `- ${page.label}: ${localizedUrl(page.path, locale)}`
      ).join('\n');
      const categories = getGuideCategories(locale)
        .map(
          (category) =>
            `- ${category.title}: ${localizedUrl(`/guides/${category.slug}`, locale)}`
        )
        .join('\n');
      const guides = getAllGuides(locale)
        .map(
          (guide) =>
            `- ${guide.title}: ${localizedUrl(guide.href, locale)}\n  ${guide.description}`
        )
        .join('\n');
      return `## ${localeNames[locale]}\n\n${references}\n${categories}\n${guides}`;
    })
    .join('\n\n');

  return `# ${gameConfig.siteName}

> Independent fan guides for Find The Needle, the incremental automation game developed by FindTheNeedleDev and published by Hay Passionates.
> The Steam demo was released on September 10, 2026. The full game's Steam listing gives Q4 2026 as its planned release window.

This site covers the demo, the basic search and upgrade loop, automation, PC requirements and troubleshooting. Demo information is kept separate from announced full-game features. It does not claim a complete walkthrough or an optimal upgrade order.

${languageSections}

## Official sources

- Full game: https://store.steampowered.com/app/5160800/Find_The_Needle/
- Demo: https://store.steampowered.com/app/5165210/Find_The_Needle_Demo/
- Sitemap: ${gameConfig.origin}/sitemap.xml

## Affiliation

An unofficial fan site. Not affiliated with FindTheNeedleDev or Hay Passionates. Game names, artwork and trademarks belong to their respective owners.
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

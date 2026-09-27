import { envConfigs } from '@/config';
import { gameConfig } from '@/config/game';
import { locales } from '@/config/locale';
import { getCommonMessages } from '@/config/locale/messages';

/**
 * Site-wide JSON-LD @graph — emitted once in the root layout, so every page
 * carries it. Three cross-referenced entities:
 *
 *   #website  (WebSite)      — "this is a website"
 *      ├─ publisher → #org
 *      └─ about     → #game
 *   #org      (Organization) — brand + logo (feeds the Knowledge Panel)
 *   #game     (VideoGame)    — the game itself: genre, platform, release, price
 *                              (feeds a Google game Knowledge Panel)
 *
 * Per-page Article JSON-LD links INTO this graph via isPartOf → #website and
 * about → #game (see the guides [[...slug]] route), so Google ties pages to the
 * site and the game.
 *
 * NOTE: no SearchAction (Sitelinks Search Box) — the site has no on-site search
 * yet, and pointing Google at a search URL that 404s is a negative signal. Add
 * it only once a real /search exists.
 */
export function SiteJsonLd({ locale = 'en' }: { locale?: string }) {
  const origin = gameConfig.origin;
  const game = gameConfig.game ?? {};
  const developer = game.developer ?? gameConfig.disclaimer.publisher;
  const logo = envConfigs.app_logo.startsWith('http')
    ? envConfigs.app_logo
    : `${origin}${envConfigs.app_logo}`;
  const steamUrl = gameConfig.steamAppId
    ? `https://store.steampowered.com/app/${gameConfig.steamAppId}/`
    : undefined;

  const website = {
    '@type': 'WebSite',
    '@id': `${origin}/#website`,
    name: gameConfig.siteName,
    url: `${origin}/`,
    description: getCommonMessages(locale).metadata.description,
    inLanguage: locales,
    publisher: { '@id': `${origin}/#org` },
    about: { '@id': `${origin}/#game` },
  };

  const organization = {
    '@type': 'Organization',
    '@id': `${origin}/#org`,
    name: gameConfig.siteName,
    url: `${origin}/`,
    logo: { '@type': 'ImageObject', url: logo },
  };

  const videoGame = {
    '@type': 'VideoGame',
    '@id': `${origin}/#game`,
    name: gameConfig.gameFullName,
    description: game.description ?? gameConfig.tagline,
    ...(game.genre?.length ? { genre: game.genre } : {}),
    ...(game.platforms?.length ? { gamePlatform: game.platforms } : {}),
    author: { '@type': 'Organization', name: developer },
    publisher: {
      '@type': 'Organization',
      name: gameConfig.disclaimer.publisher,
    },
    ...(steamUrl ? { url: steamUrl } : {}),
    ...(game.price
      ? {
          offers: {
            '@type': 'Offer',
            price: game.price,
            priceCurrency: game.priceCurrency ?? 'USD',
            availability: 'https://schema.org/InStock',
            ...(steamUrl ? { url: steamUrl } : {}),
          },
        }
      : {}),
  };

  const graph = {
    '@context': 'https://schema.org',
    '@graph': [website, organization, videoGame],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}

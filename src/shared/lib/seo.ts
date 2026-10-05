import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { envConfigs } from '@/config';
import { gameConfig } from '@/config/game';
import { defaultLocale, localeLanguageTag, locales } from '@/config/locale';

/** Route root is '', everything else keeps a single leading slash. */
function normalizePath(path: string): string {
  if (!path || path === '/') return '';
  return path.startsWith('/') ? path.replace(/\/+$/, '') : `/${path}`;
}

/**
 * Absolute URL for `path` under `locale`.
 *
 * Routing uses `localePrefix: 'as-needed'`, so the default locale is served
 * without a prefix and every other locale carries one. This function is the
 * only place that convention is encoded — canonical URLs, hreflang alternates
 * and og:url all derive from it, so they cannot drift apart.
 */
export function localizedUrl(path: string, locale: string): string {
  const prefix = locale === defaultLocale ? '' : `/${locale}`;
  return `${gameConfig.origin}${prefix}${normalizePath(path)}`;
}

/**
 * hreflang set for `path`: one entry per published locale, plus `x-default`
 * aimed at the default locale. Without these, a translated page competes with
 * its original in the index instead of clustering with it.
 *
 * Returns undefined on single-locale sites, where the map would only ever point
 * at the page itself and adds nothing a crawler can act on.
 */
export function hreflangAlternates(
  path: string
): Record<string, string> | undefined {
  if (locales.length < 2) return undefined;

  const alternates: Record<string, string> = {
    'x-default': localizedUrl(path, defaultLocale),
  };
  for (const locale of locales) {
    alternates[localeLanguageTag(locale)] = localizedUrl(path, locale);
  }
  return alternates;
}

/**
 * Defaults for the whole `[locale]` segment, applied by its layout.
 *
 * Pages that build their own metadata (via `buildPageMetadata`) override title,
 * description and canonical; what survives from here is the site-wide keyword
 * list and the card shape, so every route advertises a consistent preview even
 * if someone adds a page and forgets its metadata.
 *
 * Title and description read the localized `common.metadata` block — the SEO
 * copy, which is deliberately not the brand string used for og:site_name.
 */
export async function siteMetadata(locale: string): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'common.metadata' });

  const title = t.has('title') ? t('title') : gameConfig.siteName;
  const description = t.has('description')
    ? t('description')
    : gameConfig.tagline;
  const keywords = t.has('keywords') ? t('keywords') : undefined;

  const canonical = localizedUrl('/', locale);
  const languages = hreflangAlternates('/');

  return {
    title,
    description,
    ...(keywords ? { keywords } : {}),
    alternates: {
      canonical,
      ...(languages ? { languages } : {}),
    },
    openGraph: {
      type: 'website',
      locale,
      url: canonical,
      title,
      description,
      siteName: gameConfig.siteName,
      images: [envConfigs.app_preview_image],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [envConfigs.app_preview_image],
    },
    robots: { index: true, follow: true },
  };
}

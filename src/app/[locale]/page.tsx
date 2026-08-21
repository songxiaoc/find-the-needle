import type { Metadata } from 'next';
import { fontVars } from '@/components/site/active-fonts';
import { HomeBlocks } from '@/components/site/HomeBlocks';
import { SiteShell } from '@/components/site/SiteShell';
import { WikiShell } from '@/components/site/WikiShell';
import { WikiSidebar } from '@/components/site/WikiSidebar';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { envConfigs } from '@/config';
import {
  getEntities,
  getPublishedEntityKinds,
} from '@/config/entities-content';
import { gameConfig } from '@/config/game';
import { getAllGuides, getGuideCategories } from '@/config/guides-content';
import { getHomeBlocks } from '@/config/homepage';
import { locales } from '@/config/locale';
import { hreflangAlternates, localizedUrl } from '@/shared/lib/seo';

// force-static: getGuideCategories() uses fs at call time. On Cloudflare Workers
// the filesystem is unavailable at runtime — pre-render at build time instead.
// Pair with staticAssetsIncrementalCache in open-next.config.ts.
export const dynamic = 'force-static';

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  // Homepage <title>/<description> come from the localized `common.metadata`
  // block (the SEO title), intentionally distinct from the brand/og:site_name.
  // Fall back to gameConfig so the hero never ships an empty <title>.
  const t = await getTranslations({ locale, namespace: 'common.metadata' });
  const title = t.has('title') ? t('title') : gameConfig.siteName;
  const description = t.has('description')
    ? t('description')
    : gameConfig.tagline;

  const canonical = localizedUrl('/', locale);
  const languages = hreflangAlternates('/');

  return {
    title,
    description,
    alternates: { canonical, ...(languages ? { languages } : {}) },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: gameConfig.siteName,
      type: 'website',
      images: [envConfigs.app_preview_image],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [envConfigs.app_preview_image],
    },
  };
}

// §02 "Latest updates" is a homepage teaser, not the full index: show the 5
// most recently updated guides and send everyone to /guides for the rest.
const HOMEPAGE_GUIDES_LIMIT = 5;

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const allGuides = getAllGuides(locale);

  // The site-wide WebSite/Organization/VideoGame @graph is emitted globally in
  // the root layout (SiteJsonLd), so there's no per-page WebSite node here.

  // The homepage is NOT a fixed layout — it's the ordered HOME_BLOCKS list
  // (src/config/homepage.ts) rendered by <HomeBlocks>. Data-driven blocks
  // (latest-guides / category-grid / entity-index) get runtime data via `ctx`.
  const entityKinds = getPublishedEntityKinds().map((kind) => ({
    kind,
    entities: getEntities(kind.id),
  }));
  const ctx = {
    locale,
    totalGuides: allGuides.length,
    latestGuides: allGuides.slice(0, HOMEPAGE_GUIDES_LIMIT),
    guideCategories: getGuideCategories(locale),
    entityKinds,
  };

  return (
    <div className={fontVars}>
      <SiteShell activeHref="/">
        <WikiShell sidebar={<WikiSidebar locale={locale} />}>
          <HomeBlocks blocks={getHomeBlocks(locale)} ctx={ctx} />
        </WikiShell>
      </SiteShell>
    </div>
  );
}

import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { fontVars } from '@/components/site/active-fonts';
import {
  ArticleContainer,
  Section,
  SiteShell,
} from '@/components/site/SiteShell';
import { Breadcrumb, BreadcrumbJsonLd } from '@/components/site/ui';

import { envConfigs } from '@/config';
import { gameConfig } from '@/config/game';
import { hreflangAlternates, localizedUrl } from '@/shared/lib/seo';

/**
 * Build a Next.js `Metadata` object that follows the spec rules:
 *   - title: either `{topic} - {gameFullName}` (titleTopic) OR a front-loaded
 *     verbatim string (titleAbsolute) for keyword pages — see below. ~50–60 chars
 *   - description ~150 chars containing the primary keyword
 *   - canonical that respects the locale prefix convention
 *
 * Pass exactly one of `titleTopic` / `titleAbsolute`.
 */
export function buildPageMetadata({
  titleTopic,
  titleAbsolute,
  description,
  path,
  locale,
  noIndex,
}: {
  /** Topic only — brand (`- {gameFullName}`) is appended automatically. */
  titleTopic?: string;
  /**
   * Full <title> verbatim, no brand appended. Use on keyword pages (codes,
   * boss/item catalogs, missions) that must FRONT-LOAD the exact search phrase
   * to match their H1 — e.g. "<Game> Laundry Code" rather than the brand-suffix
   * form. Prefer this when your brand/og:site_name string does NOT itself
   * contain the target keyword phrase (e.g. a spaceless brand handle), so the
   * phrase would otherwise be buried after the topic. See docs/seo-playbook.md.
   */
  titleAbsolute?: string;
  description: string;
  path: string; // leading slash, no locale (e.g. "/guides/beginners-guide")
  locale: string;
  /** Set true for placeholder / coming-soon pages with no real content yet. */
  noIndex?: boolean;
}): Metadata {
  const title = titleAbsolute ?? `${titleTopic} - ${gameConfig.gameFullName}`;
  const canonical = localizedUrl(path, locale);
  const languages = hreflangAlternates(path);
  return {
    title,
    description,
    alternates: { canonical, ...(languages ? { languages } : {}) },
    ...(noIndex ? { robots: { index: false, follow: true } } : {}),
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: gameConfig.siteName,
      type: 'article',
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

/**
 * Shared frame for every content page (guides, hubs, patch notes, FAQ, etc.).
 * Drops in SiteShell + breadcrumb + a content slot. Use `mode="article"` for
 * long-form prose (~880px reading column); `mode="wide"` for hubs that need
 * the full 1440px grid.
 */
export function PageFrame({
  breadcrumbs,
  activeHref,
  mode = 'article',
  hero,
  children,
}: {
  breadcrumbs: { label: string; href: string }[];
  activeHref?: string;
  mode?: 'article' | 'wide';
  /** Full-width slot rendered before the content container (e.g. ArticleHero). */
  hero?: ReactNode;
  children: ReactNode;
}) {
  // Breadcrumb component wants the last item without href; schema needs href.
  const crumbs = breadcrumbs.map((b, i) =>
    i === breadcrumbs.length - 1 ? { label: b.label } : b
  );
  return (
    <SiteShell activeHref={activeHref}>
      <BreadcrumbJsonLd items={breadcrumbs} site={gameConfig.origin} />
      {hero}
      {mode === 'article' ? (
        <ArticleContainer>
          {!hero && <Breadcrumb items={crumbs} />}
          {children}
        </ArticleContainer>
      ) : (
        <Section>
          {!hero && <Breadcrumb items={crumbs} />}
          {children}
        </Section>
      )}
    </SiteShell>
  );
}

/** Page-level font-variable wrapper. Apply once at the page root. */
export function PageRoot({ children }: { children: ReactNode }) {
  return <div className={fontVars}>{children}</div>;
}

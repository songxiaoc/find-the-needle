import type { MetadataRoute } from 'next';

import {
  getAllEntities,
  getEntities,
  getPublishedEntityKinds,
} from '@/config/entities-content';
import { gameConfig } from '@/config/game';
import { getAllGuides, getGuideCategories } from '@/config/guides-content';

const SITE =
  process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '') || gameConfig.origin;

// Bump manually when the home hub gains aggregated content or layout changes.
// Detail + category pages keep their own dates so they stay honest.
const SITE_LAST_UPDATED = '2026-01-01';

const max = (...dates: string[]) => dates.sort().at(-1)!;

export default function sitemap(): MetadataRoute.Sitemap {
  // Content is discovered from the filesystem (content/guides/**) — adding a
  // guide automatically adds its sitemap entry. Category listing pages are
  // included too; empty categories are skipped (getGuideCategories filters).
  const articles = getAllGuides();
  const categories = getGuideCategories();
  const entityKinds = getPublishedEntityKinds();
  const entities = getAllEntities();

  const latestGuideDate = articles
    .map((g) => g.lastModified ?? g.date)
    .sort()
    .at(-1);
  const hubLastModified = latestGuideDate
    ? max(SITE_LAST_UPDATED, latestGuideDate)
    : SITE_LAST_UPDATED;

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${SITE}/`,
      lastModified: hubLastModified,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${SITE}/guides`,
      lastModified: hubLastModified,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
  ];

  const categoryPages: MetadataRoute.Sitemap = categories.map((c) => ({
    url: `${SITE}/guides/${c.slug}`,
    lastModified: hubLastModified,
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  const guidePages: MetadataRoute.Sitemap = articles.map((g) => ({
    url: `${SITE}${g.href}`,
    lastModified: g.lastModified ?? g.date,
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  const entityHubPages: MetadataRoute.Sitemap =
    entityKinds.length > 0
      ? [
          {
            url: `${SITE}/database`,
            lastModified:
              entities
                .map((entity) => entity.updatedAt)
                .sort()
                .at(-1) ?? SITE_LAST_UPDATED,
            changeFrequency: 'weekly',
            priority: 0.9,
          },
        ]
      : [];

  const entityCatalogPages: MetadataRoute.Sitemap = entityKinds.map((kind) => ({
    url: `${SITE}${kind.route}`,
    lastModified:
      getEntities(kind.id)
        .map((entity) => entity.updatedAt)
        .sort()
        .at(-1) ?? SITE_LAST_UPDATED,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  const entityDetailPages: MetadataRoute.Sitemap = entities.map((entity) => ({
    url: `${SITE}${entity.href}`,
    lastModified: entity.updatedAt,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  return [
    ...staticPages,
    ...categoryPages,
    ...guidePages,
    ...entityHubPages,
    ...entityCatalogPages,
    ...entityDetailPages,
  ];
}

import type { MetadataRoute } from 'next';

import { getAllGuides, getGuideCategories } from '@/config/guides-content';
import { locales } from '@/config/locale';
import { PUBLIC_PAGES } from '@/config/locale/routes';
import { hreflangAlternates, localizedUrl } from '@/shared/lib/seo';

const SITE_LAST_UPDATED = '2026-09-27';

export default function sitemap(): MetadataRoute.Sitemap {
  const guides = getAllGuides();
  const latestContent = guides
    .map((guide) => guide.lastModified ?? guide.date)
    .sort()
    .at(-1);
  const hubDate = [SITE_LAST_UPDATED, latestContent ?? SITE_LAST_UPDATED]
    .sort()
    .at(-1)!;
  const pages = [
    ...PUBLIC_PAGES.map((page) => ({
      path: page.path as string,
      updated: hubDate,
    })),
    ...getGuideCategories().map((category) => ({
      path: `/guides/${category.slug}`,
      updated: hubDate,
    })),
    ...guides.map((guide) => ({
      path: guide.href,
      updated: guide.lastModified ?? guide.date,
    })),
  ];
  return locales.flatMap((locale) =>
    pages.map((page) => ({
      url: localizedUrl(page.path, locale),
      lastModified: page.updated,
      changeFrequency:
        page.path === '/' || page.path === '/guides'
          ? ('weekly' as const)
          : ('monthly' as const),
      priority:
        page.path === '/' ? 1 : page.path.startsWith('/guides') ? 0.8 : 0.5,
      alternates: { languages: hreflangAlternates(page.path) ?? {} },
    }))
  );
}

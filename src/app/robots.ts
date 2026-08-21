import { MetadataRoute } from 'next';

import { gameConfig } from '@/config/game';

export default function robots(): MetadataRoute.Robots {
  // Pin to the configured production origin rather than NEXT_PUBLIC_APP_URL, so
  // a preview deployment never publishes a robots.txt pointing at itself while
  // canonical, sitemap and hreflang all point at production.
  const site =
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '') || gameConfig.origin;

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Every route this template ships is a static, indexable content page, so
      // there is nothing to hide. The one guard is against query-string URLs:
      // if you later add search or URL-backed catalog filters, they produce
      // near-duplicates of pages that are already indexed on their own.
      //
      // Legal pages are deliberately NOT listed. They carry a page-level
      // `noindex`, and blocking them here would stop crawlers from reading it.
      disallow: ['/*?'],
    },
    sitemap: `${site}/sitemap.xml`,
  };
}

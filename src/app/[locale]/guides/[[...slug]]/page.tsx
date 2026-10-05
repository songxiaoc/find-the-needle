/**
 * Content-driven guides route. ONE catch-all renders three page types:
 *
 *   /guides                      → hub (all categories)
 *   /guides/<category>           → category listing
 *   /guides/<category>/<slug>... → article (compiled from .mdx on disk)
 *
 * Drop a file at content/guides/<category>/<slug>.mdx — no edits here needed.
 *
 * MDX is compiled at build time via next-mdx-remote/rsc (compileMDX).
 * All fs reads happen during generateStaticParams / generateMetadata / render,
 * which run at build time under force-static — safe on Cloudflare Workers.
 */
import { notFound } from 'next/navigation';
import { EntityLink } from '@/components/site/entities/EntityLink';
import { GuideRecords } from '@/components/site/entities/GuideRecords';
import { OnThisPage } from '@/components/site/OnThisPage';
import {
  buildPageMetadata,
  PageFrame,
  PageRoot,
} from '@/components/site/PageFrame';
import {
  ArticleHeader,
  GuideCard,
  RelatedGuides,
  SectionTitle,
} from '@/components/site/ui';
import { getMDXComponents } from '@/mdx-components';
import { setRequestLocale } from 'next-intl/server';
import { compileMDX } from 'next-mdx-remote/rsc';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';

import { gameConfig } from '@/config/game';
import { isGuideCategory } from '@/config/guides';
import {
  extractToc,
  getAllGuides,
  getGuideCategories,
  getGuidePage,
  getGuidesByCategory,
  getRelatedGuides,
  type GuideItem,
} from '@/config/guides-content';
import { locales } from '@/config/locale';
import { getCommonMessages } from '@/config/locale/messages';
import { localizedUrl } from '@/shared/lib/seo';

// No `revalidate`: it puts the route in ISR mode. Cloudflare Workers has no
// cache backend, so every request MISSes, falls back to a runtime render, and
// the fs reads below return nothing → 404 on every guide page. Pre-render only.
// See docs/PITFALLS.md → "Cloudflare Workers 部署" and open-next.config.ts.
export const dynamic = 'force-static';
export const dynamicParams = false;

const SITE = gameConfig.origin;

const MDX_OPTIONS = {
  mdxOptions: {
    remarkPlugins: [remarkGfm],
    // Fumadocs headings already link their children; a second autolink nests anchors.
    rehypePlugins: [rehypeSlug],
  },
} as const;

type Params = { locale: string; slug?: string[] };

export function generateStaticParams() {
  const out: { locale: string; slug: string[] }[] = [];
  for (const locale of locales) {
    out.push({ locale, slug: [] }); // hub: /guides
    for (const cat of getGuideCategories(locale))
      out.push({ locale, slug: [cat.slug] });
    for (const item of getAllGuides(locale))
      out.push({ locale, slug: item.slugs });
  }
  return out;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const copy = getCommonMessages(locale);

  if (!slug || slug.length === 0) {
    return buildPageMetadata({
      titleTopic: copy.navigation.guides,
      description: copy.category.description,
      path: '/guides',
      locale,
    });
  }

  if (slug.length === 1 && isGuideCategory(slug[0])) {
    const cat = getGuideCategories(locale).find((c) => c.slug === slug[0])!;
    return buildPageMetadata({
      titleTopic: cat.overviewTitle ?? cat.title,
      description:
        cat.overviewDescription ??
        `All ${cat.title} guides for ${gameConfig.gameFullName}.`,
      path: `/guides/${cat.slug}`,
      locale,
    });
  }

  const page = getGuidePage(slug, locale);
  if (!page)
    return buildPageMetadata({
      titleTopic: 'Not found',
      description: '',
      path: '/guides',
      locale,
      noIndex: true,
    });
  return buildPageMetadata({
    titleAbsolute: page.data.title,
    description: page.data.description,
    path: page.url,
    locale,
  });
}

export default async function GuidesPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  if (!slug || slug.length === 0) return <Hub locale={locale} />;
  if (slug.length === 1 && isGuideCategory(slug[0]))
    return <CategoryListing locale={locale} category={slug[0]} />;
  return <ArticleDetail locale={locale} slug={slug} />;
}

/* ── Hub: /guides ────────────────────────────────────────────────────────── */

function Hub({ locale }: { locale: string }) {
  const copy = getCommonMessages(locale);
  const categories = getGuideCategories(locale);

  const itemList = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${gameConfig.gameFullName} guides`,
    itemListElement: categories.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: localizedUrl(`/guides/${c.slug}`, locale),
      name: c.title,
    })),
  };

  return (
    <PageRoot>
      <JsonLd data={itemList} />
      <PageFrame
        activeHref="/guides"
        mode="wide"
        breadcrumbs={[
          { label: copy.navigation.home, href: '/' },
          { label: copy.navigation.guides, href: '/guides' },
        ]}
      >
        <SectionTitle
          as="h1"
          eyebrow={copy.navigation.guides}
          title={`${gameConfig.gameFullName} — ${copy.navigation.guides}`}
        />
        <p className="site-body-lg text-site-on-surface-variant mb-10 max-w-[70ch]">
          {copy.category.description}
        </p>
        {categories.length === 0 ? (
          <p className="text-site-on-surface-variant">
            No guides published yet.
          </p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {categories.map((c) => (
              <GuideCard
                key={c.slug}
                title={c.title}
                description={
                  c.overviewDescription ??
                  `${c.count} guide${c.count === 1 ? '' : 's'}.`
                }
                href={`/guides/${c.slug}`}
                cta={copy.ui.readGuide}
              />
            ))}
          </div>
        )}
      </PageFrame>
    </PageRoot>
  );
}

/* ── Category listing: /guides/<category> ────────────────────────────────── */

function CategoryListing({
  locale,
  category,
}: {
  locale: string;
  category: string;
}) {
  const copy = getCommonMessages(locale);
  const cat = getGuideCategories(locale).find((c) => c.slug === category)!;
  const items = getGuidesByCategory(category, locale);

  const itemList = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${cat.title} — ${gameConfig.gameFullName}`,
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: localizedUrl(it.href, locale),
      name: it.title,
    })),
  };

  return (
    <PageRoot>
      <JsonLd data={itemList} />
      <PageFrame
        activeHref={`/guides/${cat.slug}`}
        mode="wide"
        breadcrumbs={[
          { label: copy.navigation.home, href: '/' },
          { label: copy.navigation.guides, href: '/guides' },
          { label: cat.title, href: `/guides/${cat.slug}` },
        ]}
      >
        <SectionTitle
          as="h1"
          eyebrow={copy.navigation.guides}
          title={cat.overviewTitle ?? cat.title}
        />
        {cat.overviewDescription && (
          <p className="site-body-lg text-site-on-surface-variant mb-10 max-w-[70ch]">
            {cat.overviewDescription}
          </p>
        )}
        {items.length === 0 ? (
          <p className="text-site-on-surface-variant">
            No guides in this category yet.
          </p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {items.map((it) => (
              <GuideCard
                key={it.slug}
                title={it.title}
                description={it.description}
                href={it.href}
                cta={copy.ui.readGuide}
                tag={it.badge}
              />
            ))}
          </div>
        )}
      </PageFrame>
    </PageRoot>
  );
}

/* ── Article detail: /guides/<category>/<slug> ───────────────────────────── */

async function ArticleDetail({
  locale,
  slug,
}: {
  locale: string;
  slug: string[];
}) {
  const copy = getCommonMessages(locale);
  const page = getGuidePage(slug, locale);
  if (!page) notFound();

  const category = slug[0];
  const cat = getGuideCategories(locale).find((c) => c.slug === category);
  const catTitle = cat?.title ?? category;
  const data = page.data;
  const lastUpdated = data.lastModified ?? data.date;

  const item: GuideItem = {
    slugs: slug,
    slug: slug.join('/'),
    href: page.url,
    category,
    title: data.title,
    description: data.description,
    date: data.date,
    lastModified: data.lastModified,
    badge: data.badge,
  };
  const related = getRelatedGuides(item, locale);

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: data.title,
    description: data.description,
    datePublished: data.date,
    dateModified: lastUpdated,
    mainEntityOfPage: localizedUrl(page.url, locale),
    inLanguage: locale,
    ...(data.image
      ? {
          image: data.image.startsWith('http')
            ? data.image
            : `${SITE}${data.image}`,
        }
      : {}),
    author: { '@type': 'Organization', name: gameConfig.siteName },
    publisher: { '@id': `${SITE}/#org` },
    isPartOf: { '@id': `${SITE}/#website` },
    about: { '@id': `${SITE}/#game` },
  };

  const toc = extractToc(page.content).filter((t) => t.depth <= 3);

  const { content: MDXContent } = await compileMDX({
    source: page.content,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    options: MDX_OPTIONS as any,
    components: getMDXComponents({ EntityLink }),
  });

  return (
    <PageRoot>
      <JsonLd data={articleJsonLd} />
      <PageFrame
        activeHref={`/guides/${category}`}
        breadcrumbs={[
          { label: copy.navigation.home, href: '/' },
          { label: catTitle, href: `/guides/${category}` },
          { label: data.title, href: page.url },
        ]}
      >
        <ArticleHeader h1={data.title} lastUpdated={lastUpdated} />
        {toc.length > 0 && <OnThisPage items={toc} />}
        <div className="prose prose-lg mt-8">{MDXContent}</div>
        <GuideRecords href={page.url} locale={locale} />
        {related.length > 0 && (
          <RelatedGuides
            items={related.map((r) => ({
              title: r.title,
              href: r.href,
              description: r.description,
            }))}
          />
        )}
      </PageFrame>
    </PageRoot>
  );
}

function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

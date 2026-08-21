import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getMDXComponents } from '@/mdx-components';
import { createRelativeLink } from 'fumadocs-ui/mdx';
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
} from 'fumadocs-ui/page';

import { source } from '@/core/docs/source';
import { defaultLocale } from '@/config/locale';
import { hreflangAlternates, localizedUrl } from '@/shared/lib/seo';

// No `revalidate`: it would put the route in ISR mode. Cloudflare Workers has no
// cache backend, so every request MISSes, falls back to a runtime render, and
// the filesystem reads below return nothing → 404 on every docs page.
// Pre-render only. See docs/PITFALLS.md and open-next.config.ts.
export const dynamic = 'force-static';
export const dynamicParams = true;

export async function generateStaticParams() {
  return source.generateParams('slug', 'locale');
}

export default async function DocsContentPage(props: {
  params: Promise<{ slug?: string[]; locale?: string }>;
}) {
  const { slug, locale } = await props.params;
  const page = source.getPage(slug, locale);
  if (!page) notFound();

  const MDXContent = page.data.body;

  return (
    <DocsPage
      toc={page.data.toc}
      full={page.data.full}
      tableOfContent={{ style: 'clerk' }}
    >
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>
      <DocsBody>
        <MDXContent
          // Lets docs authors link to sibling pages by relative file path.
          components={getMDXComponents({
            a: createRelativeLink(source, page),
          })}
        />
      </DocsBody>
    </DocsPage>
  );
}

export async function generateMetadata(props: {
  params: Promise<{ slug?: string[]; locale?: string }>;
}): Promise<Metadata> {
  const { slug, locale } = await props.params;
  const page = source.getPage(slug, locale);
  if (!page) notFound();

  // Docs pages are real indexable URLs, so they need the same canonical and
  // hreflang treatment as guides — without them, translated docs compete with
  // their English original.
  const path = `/docs${slug?.length ? `/${slug.join('/')}` : ''}`;
  const canonical = localizedUrl(path, locale ?? defaultLocale);
  const languages = hreflangAlternates(path);

  return {
    title: page.data.title,
    description: page.data.description,
    alternates: { canonical, ...(languages ? { languages } : {}) },
    openGraph: {
      title: page.data.title,
      description: page.data.description,
      url: canonical,
      type: 'article',
    },
  };
}

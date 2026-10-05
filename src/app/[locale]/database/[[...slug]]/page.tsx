import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { EntityCatalog } from '@/components/site/entities/EntityCatalog';
import { EntityDetail } from '@/components/site/entities/EntityDetail';
import { EntityImage } from '@/components/site/entities/EntityImage';
import {
  buildPageMetadata,
  PageFrame,
  PageRoot,
} from '@/components/site/PageFrame';
import { getDiscoveryCopy } from '@/content/discovery-copy';
import { setRequestLocale } from 'next-intl/server';

import { Link } from '@/core/i18n/navigation';
import { getEntityCover, getEntityKind } from '@/config/entities';
import {
  getAllEntities,
  getEntities,
  getEntity,
  getPublishedEntityKinds,
} from '@/config/entities-content';
import { getAllGuides } from '@/config/guides-content';
import { locales } from '@/config/locale';
import { getCommonMessages } from '@/config/locale/messages';
import { localizedUrl } from '@/shared/lib/seo';

export const dynamic = 'force-static';
export const dynamicParams = false;
type Params = { locale: string; slug?: string[] };

export function generateStaticParams(): Params[] {
  return locales.flatMap((locale) => [
    { locale, slug: [] },
    ...getPublishedEntityKinds(locale).map((kind) => ({
      locale,
      slug: [kind.id],
    })),
    ...getAllEntities(locale).map((entity) => ({
      locale,
      slug: [entity.kindId, entity.id],
    })),
  ]);
}

function resolve({ locale, slug = [] }: Params) {
  if (slug.length > 2) notFound();
  const kind = slug[0] ? getEntityKind(slug[0], locale) : undefined;
  if (slug[0] && (!kind || !getEntities(kind.id, locale).length)) notFound();
  const entity =
    slug[1] && kind ? getEntity(kind.id, slug[1], locale) : undefined;
  if (slug[1] && !entity) notFound();
  return {
    kind,
    entity,
    path: `/database${slug.length ? `/${slug.join('/')}` : ''}`,
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const values = await params;
  const { kind, entity, path } = resolve(values);
  const copy = getDiscoveryCopy(values.locale);
  return buildPageMetadata({
    titleTopic: entity?.name ?? kind?.label ?? copy.databaseTitle,
    description: entity?.summary ?? kind?.description ?? copy.databaseIntro,
    path,
    locale: values.locale,
  });
}

export default async function DatabasePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const values = await params;
  const { locale } = values;
  setRequestLocale(locale);
  const { kind, entity, path } = resolve(values);
  const copy = getDiscoveryCopy(locale);
  const common = getCommonMessages(locale);
  const breadcrumbs = [
    { label: common.navigation.home, href: '/' },
    { label: copy.database, href: '/database' },
    ...(kind ? [{ label: kind.label, href: kind.route }] : []),
    ...(entity ? [{ label: entity.name, href: entity.href }] : []),
  ];
  const guides = getAllGuides(locale);
  const entries = entity
    ? [entity]
    : kind
      ? getEntities(kind.id, locale)
      : getAllEntities(locale);
  const schema = entity
    ? {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: entity.name,
        description: entity.summary,
        dateModified: entity.updatedAt,
        mainEntityOfPage: localizedUrl(path, locale),
        inLanguage: locale,
      }
    : {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: kind?.label ?? copy.databaseTitle,
        url: localizedUrl(path, locale),
        inLanguage: locale,
        mainEntity: {
          '@type': 'ItemList',
          numberOfItems: entries.length,
          itemListElement: entries.map((record, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: record.name,
            url: localizedUrl(record.href, locale),
          })),
        },
      };
  return (
    <PageRoot>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema).replace(/</g, '\\u003c'),
        }}
      />
      <PageFrame activeHref="/database" mode="wide" breadcrumbs={breadcrumbs}>
        {entity && kind ? (
          <EntityDetail
            locale={locale}
            kind={kind}
            entity={entity}
            relatedEntities={entity.relatedEntities.flatMap((relation) => {
              const record = getEntity(relation.kind, relation.id, locale);
              const relatedKind = getEntityKind(relation.kind, locale);
              return record && relatedKind
                ? [
                    {
                      name: record.name,
                      href: record.href,
                      kindLabel: relatedKind.singularLabel,
                    },
                  ]
                : [];
            })}
            relatedGuides={entity.relatedGuides.flatMap((href) => {
              const guide = guides.find((item) => item.href === href);
              return guide ? [{ title: guide.title, href: guide.href }] : [];
            })}
          />
        ) : (
          <>
            <header className="mb-8 max-w-3xl">
              <h1 className="site-display-lg text-site-on-surface [overflow-wrap:anywhere] hyphens-auto">
                {kind?.label ?? copy.databaseTitle}
              </h1>
              <p className="text-site-on-surface-variant mt-4 leading-7">
                {kind?.description ?? copy.databaseIntro}
              </p>
            </header>
            <nav
              aria-label={copy.database}
              className="mb-8 flex flex-wrap gap-3"
            >
              {getPublishedEntityKinds(locale).map((category) => (
                <Link
                  key={category.id}
                  href={category.route}
                  aria-current={kind?.id === category.id ? 'page' : undefined}
                  className="site-control border-site-outline-strong text-site-primary border px-4 py-3 text-sm hover:underline"
                >
                  {category.label} ({getEntities(category.id, locale).length})
                </Link>
              ))}
            </nav>
            {kind ? (
              <EntityCatalog kind={kind} entities={entries} locale={locale} />
            ) : (
              <div className="grid gap-5 md:grid-cols-3">
                {getPublishedEntityKinds(locale).map((category) => {
                  const records = getEntities(category.id, locale);
                  const cover = getEntityCover(category, records);
                  return (
                    <section
                      key={category.id}
                      className="site-card site-interactive-card border-site-outline-strong bg-site-surface-container min-w-0 overflow-hidden border p-6"
                    >
                      {cover && (
                        <Link
                          href={category.route}
                          className="focus-visible:outline-site-primary -mx-6 -mt-6 mb-6 block focus-visible:outline-2 focus-visible:outline-offset-[-2px]"
                        >
                          <EntityImage
                            entity={cover}
                            preview
                            sizes="(max-width: 767px) calc(100vw - 48px), (max-width: 1440px) calc((100vw - 112px) / 3), 440px"
                          />
                        </Link>
                      )}
                      <p className="text-site-primary text-sm">
                        {records.length} {copy.records}
                      </p>
                      <h2 className="site-headline-lg mt-3">
                        <Link href={category.route}>{category.label}</Link>
                      </h2>
                      <p className="text-site-on-surface-variant mt-3 text-sm leading-6">
                        {category.description}
                      </p>
                      <ul className="mt-5 space-y-3">
                        {records.map((record) => (
                          <li key={record.id}>
                            <Link
                              className="text-site-primary hover:underline"
                              href={record.href}
                            >
                              {record.name} →
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </section>
                  );
                })}
              </div>
            )}
          </>
        )}
      </PageFrame>
    </PageRoot>
  );
}

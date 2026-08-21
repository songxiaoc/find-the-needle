import { notFound } from 'next/navigation';
import { EntityCatalog } from '@/components/site/entities/EntityCatalog';
import {
  EntityDetail,
  type ResolvedEntityLink,
  type ResolvedGuideLink,
} from '@/components/site/entities/EntityDetail';
import {
  buildPageMetadata,
  PageFrame,
  PageRoot,
} from '@/components/site/PageFrame';
import { SectionTitle } from '@/components/site/ui';

import { Link } from '@/core/i18n/navigation';
import {
  getEntityKind,
  type EntityKind,
  type EntityRecord,
} from '@/config/entities';
import {
  getAllEntities,
  getEntities,
  getEntity,
  getPublishedEntityKinds,
} from '@/config/entities-content';
import { gameConfig } from '@/config/game';
import { getAllGuides } from '@/config/guides-content';
import { locales } from '@/config/locale';
import { siteProfile } from '@/config/site-profile';

// No `revalidate`: it puts the route in ISR mode. Cloudflare Workers has no
// cache backend, so every request MISSes, falls back to a runtime render, and
// the fs reads below return nothing → 404 on every guide page. Pre-render only.
// See docs/PITFALLS.md → "Cloudflare Workers 部署" and open-next.config.ts.
export const dynamic = 'force-static';
export const dynamicParams = false;

type Params = { locale: string; slug?: string[] };

export function generateStaticParams() {
  const kinds = getPublishedEntityKinds();
  if (kinds.length === 0) return [];

  const out: { locale: string; slug: string[] }[] = [];
  for (const locale of locales) {
    out.push({ locale, slug: [] });
    for (const kind of kinds) {
      out.push({ locale, slug: [kind.id] });
      for (const entity of getEntities(kind.id)) {
        out.push({ locale, slug: [kind.id, entity.id] });
      }
    }
  }
  return out;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}) {
  const { locale, slug } = await params;

  if (!slug || slug.length === 0) {
    return buildPageMetadata({
      titleTopic: 'Database',
      description: `Structured ${gameConfig.gameFullName} records with versioned attributes and guide references.`,
      path: '/database',
      locale,
    });
  }

  const kind = getEntityKind(slug[0]);
  if (
    !kind ||
    !getPublishedEntityKinds().some((entry) => entry.id === kind.id)
  ) {
    return buildPageMetadata({
      titleTopic: 'Not found',
      description: '',
      path: '/database',
      locale,
      noIndex: true,
    });
  }

  if (slug.length === 1) {
    return buildPageMetadata({
      titleTopic: kind.label,
      description: kind.description,
      path: kind.route,
      locale,
    });
  }

  const entity = getEntity(kind.id, slug[1]);
  if (!entity) {
    return buildPageMetadata({
      titleTopic: 'Not found',
      description: '',
      path: kind.route,
      locale,
      noIndex: true,
    });
  }

  return buildPageMetadata({
    titleTopic: entity.name,
    description: entity.summary,
    path: entity.href,
    locale,
  });
}

export default async function DatabasePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { locale, slug } = await params;

  if (!siteProfile.features.entities) notFound();
  if (!slug || slug.length === 0) return <DatabaseHub />;
  if (slug.length === 1) return <Catalog kindId={slug[0]} />;
  if (slug.length === 2) {
    return <Detail locale={locale} kindId={slug[0]} entityId={slug[1]} />;
  }
  notFound();
}

function DatabaseHub() {
  const kinds = getPublishedEntityKinds();
  if (kinds.length === 0) notFound();

  const total = getAllEntities().length;

  return (
    <PageRoot>
      <PageFrame
        activeHref="/database"
        mode="wide"
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Database', href: '/database' },
        ]}
      >
        <SectionTitle
          as="h1"
          eyebrow="Database"
          title={`${gameConfig.gameFullName} records`}
        />
        <p className="site-body-lg text-site-on-surface-variant mb-10 max-w-[70ch]">
          {total} versioned record{total === 1 ? '' : 's'} across {kinds.length}{' '}
          published collection{kinds.length === 1 ? '' : 's'}.
        </p>
        <div className="border-site-outline-strong bg-site-outline-strong grid gap-px border md:grid-cols-2">
          {kinds.map((kind) => {
            const count = getEntities(kind.id).length;
            return (
              <article
                key={kind.id}
                className="bg-site-surface-container flex min-h-56 flex-col p-6"
              >
                <p className="font-site-mono text-site-primary text-[10px] font-semibold tracking-[0.16em] uppercase">
                  {count} record{count === 1 ? '' : 's'}
                </p>
                <h2 className="site-headline-lg text-site-on-surface mt-3">
                  {kind.label}
                </h2>
                <p className="text-site-on-surface-variant mt-3 max-w-[60ch] text-sm leading-6">
                  {kind.description}
                </p>
                <Link
                  href={kind.route}
                  className="font-site-mono text-site-primary focus-visible:outline-site-primary mt-auto pt-6 text-[10px] font-semibold tracking-[0.14em] uppercase focus-visible:outline-2 focus-visible:outline-offset-4"
                >
                  Browse {kind.label.toLowerCase()} →
                </Link>
              </article>
            );
          })}
        </div>
      </PageFrame>
    </PageRoot>
  );
}

function Catalog({ kindId }: { kindId: string }) {
  const kind = getPublishedKind(kindId);
  if (!kind) notFound();

  const entities = getEntities(kind.id);

  return (
    <PageRoot>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          name: `${gameConfig.gameFullName} ${kind.label}`,
          itemListElement: entities.map((entity, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: entity.name,
            url: `${gameConfig.origin}${entity.href}`,
          })),
        }}
      />
      <PageFrame
        activeHref="/database"
        mode="wide"
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Database', href: '/database' },
          { label: kind.label, href: kind.route },
        ]}
      >
        <SectionTitle as="h1" eyebrow="Database" title={kind.label} />
        <p className="site-body-lg text-site-on-surface-variant mb-10 max-w-[70ch]">
          {kind.description}
        </p>
        <EntityCatalog kind={kind} entities={entities} />
      </PageFrame>
    </PageRoot>
  );
}

function Detail({
  locale,
  kindId,
  entityId,
}: {
  locale: string;
  kindId: string;
  entityId: string;
}) {
  const kind = getPublishedKind(kindId);
  const entity = kind ? getEntity(kind.id, entityId) : undefined;
  if (!kind || !entity) notFound();

  const relatedEntities = resolveRelatedEntities(entity);
  const relatedGuides = resolveRelatedGuides(entity, locale);

  return (
    <PageRoot>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Thing',
          name: entity.name,
          description: entity.summary,
          url: `${gameConfig.origin}${entity.href}`,
          dateModified: entity.updatedAt,
          isPartOf: {
            '@type': 'CollectionPage',
            name: kind.label,
            url: `${gameConfig.origin}${kind.route}`,
          },
        }}
      />
      <PageFrame
        activeHref="/database"
        mode="wide"
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Database', href: '/database' },
          { label: kind.label, href: kind.route },
          { label: entity.name, href: entity.href },
        ]}
      >
        <EntityDetail
          kind={kind}
          entity={entity}
          relatedEntities={relatedEntities}
          relatedGuides={relatedGuides}
        />
      </PageFrame>
    </PageRoot>
  );
}

function getPublishedKind(kindId: string): EntityKind | undefined {
  return getPublishedEntityKinds().find((kind) => kind.id === kindId);
}

function resolveRelatedEntities(entity: EntityRecord): ResolvedEntityLink[] {
  return entity.relatedEntities.map((relation) => {
    const relatedKind = getEntityKind(relation.kind);
    const related = getEntity(relation.kind, relation.id);

    if (!relatedKind || !related) {
      throw new Error(
        `[entities] "${entity.kindId}/${entity.id}" links to missing entity "${relation.kind}/${relation.id}".`
      );
    }

    return {
      name: related.name,
      href: related.href,
      kindLabel: relatedKind.singularLabel,
    };
  });
}

function resolveRelatedGuides(
  entity: EntityRecord,
  locale: string
): ResolvedGuideLink[] {
  const guides = new Map(
    getAllGuides(locale).map((guide) => [guide.href, guide])
  );

  return entity.relatedGuides.map((href) => {
    const guide = guides.get(href);
    if (!guide) {
      throw new Error(
        `[entities] "${entity.kindId}/${entity.id}" links to missing guide "${href}".`
      );
    }
    return { title: guide.title, href: guide.href };
  });
}

function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

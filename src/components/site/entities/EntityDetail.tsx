import { getEntityCopy } from '@/content/entity-copy';

import { Link } from '@/core/i18n/navigation';
import {
  getEntityField,
  type EntityKind,
  type EntityRecord,
} from '@/config/entities';

import { EntityFieldValue } from './EntityFieldValue';
import { EntityImage } from './EntityImage';

export type ResolvedEntityLink = {
  name: string;
  href: string;
  kindLabel: string;
};

export type ResolvedGuideLink = {
  title: string;
  href: string;
};

export function EntityDetail({
  kind,
  entity,
  relatedEntities,
  relatedGuides,
  locale = 'en',
}: {
  kind: EntityKind;
  entity: EntityRecord;
  relatedEntities: ResolvedEntityLink[];
  relatedGuides: ResolvedGuideLink[];
  locale?: string;
}) {
  const copy = getEntityCopy(locale);
  return (
    <article className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_300px]">
      <div className="min-w-0">
        <header className="site-card border-site-outline-strong bg-site-surface-container border p-6 md:p-10">
          <p className="font-site-mono text-site-primary text-[10px] font-semibold tracking-[0.18em] uppercase">
            {kind.singularLabel}
          </p>
          <h1 className="site-display-lg text-site-on-surface mt-4 text-balance [overflow-wrap:anywhere] hyphens-auto">
            {entity.name}
          </h1>
          {entity.image && entity.imageAlt && (
            <figure className="site-card border-site-outline-strong mt-6 overflow-hidden border">
              <a
                href={entity.image}
                target="_blank"
                rel="noreferrer"
                aria-label={copy.fullImage}
                className="focus-visible:outline-site-primary block cursor-zoom-in focus-visible:outline-2 focus-visible:outline-offset-[-2px]"
              >
                <EntityImage
                  entity={entity}
                  sizes="(max-width: 1023px) calc(100vw - 96px), (max-width: 1440px) calc(100vw - 492px), 948px"
                  priority
                />
              </a>
              {entity.imageCaption && (
                <figcaption className="text-site-on-surface-variant px-4 py-3 text-sm leading-6">
                  {entity.imageCaption}{' '}
                  <a
                    href={entity.image}
                    target="_blank"
                    rel="noreferrer"
                    className="text-site-primary underline underline-offset-4"
                  >
                    {copy.fullImage} ↗
                  </a>
                </figcaption>
              )}
            </figure>
          )}
          <p className="site-body-lg text-site-on-surface-variant mt-5 max-w-[65ch]">
            {entity.summary}
          </p>
        </header>

        <div className="mt-10 space-y-10">
          {kind.detailSections.map((section) => {
            const populatedFields = section.fields.filter(
              (fieldId) => entity.data[fieldId] !== undefined
            );
            if (populatedFields.length === 0) return null;

            return (
              <section
                key={section.id}
                aria-labelledby={`section-${section.id}`}
              >
                <div className="border-site-outline-strong mb-4 border-b pb-3">
                  <h2
                    id={`section-${section.id}`}
                    className="site-headline-lg text-site-on-surface"
                  >
                    {section.label}
                  </h2>
                  {section.description && (
                    <p className="text-site-on-surface-variant mt-2 text-sm">
                      {section.description}
                    </p>
                  )}
                </div>
                <dl className="border-site-outline-strong bg-site-outline-strong grid gap-px border">
                  {populatedFields.map((fieldId) => (
                    <div
                      key={fieldId}
                      className="bg-site-surface-container px-5 py-4"
                    >
                      <dt className="font-site-mono text-site-outline text-[10px] tracking-[0.14em] uppercase">
                        {getEntityField(kind, fieldId)?.label ?? fieldId}
                      </dt>
                      <dd className="text-site-on-surface mt-2 text-base leading-7">
                        <EntityFieldValue
                          kind={kind}
                          fieldId={fieldId}
                          value={entity.data[fieldId]}
                        />
                      </dd>
                    </div>
                  ))}
                </dl>
              </section>
            );
          })}
        </div>
      </div>

      <aside className="space-y-6 self-start lg:sticky lg:top-24">
        <section className="site-card border-site-outline-strong bg-site-surface-container border p-5">
          <h2 className="font-site-mono text-site-primary text-[10px] font-semibold tracking-[0.16em] uppercase">
            {copy.version}
          </h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="space-y-1">
              <dt className="text-site-on-surface-variant">{copy.scope}</dt>
              <dd className="text-site-on-surface leading-6">
                {entity.version}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="text-site-on-surface-variant">{copy.checked}</dt>
              <dd className="font-site-mono text-site-on-surface tabular-nums">
                <time dateTime={entity.updatedAt}>{entity.updatedAt}</time>
              </dd>
            </div>
          </dl>
          <ul className="border-site-outline-strong mt-4 space-y-3 border-t pt-4 text-sm">
            {entity.sources.map((source) => (
              <li key={source.url}>
                <a
                  href={source.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-site-primary focus-visible:outline-site-primary decoration-site-outline leading-6 underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2"
                >
                  {source.label} ↗
                </a>
              </li>
            ))}
          </ul>
        </section>

        {relatedEntities.length > 0 && (
          <nav
            aria-labelledby="related-entities-heading"
            className="site-card border-site-outline-strong bg-site-surface-container border p-5"
          >
            <h2
              id="related-entities-heading"
              className="font-site-mono text-site-primary text-[10px] font-semibold tracking-[0.16em] uppercase"
            >
              {copy.related}
            </h2>
            <ul className="divide-site-outline-variant mt-3 divide-y">
              {relatedEntities.map((related) => (
                <li key={related.href}>
                  <Link
                    href={related.href}
                    className="text-site-on-surface hover:text-site-primary focus-visible:outline-site-primary flex items-center justify-between gap-3 py-3 text-sm focus-visible:outline-2 focus-visible:outline-offset-2"
                  >
                    <span>{related.name}</span>
                    <span className="font-site-mono text-site-outline text-[9px] tracking-[0.1em] uppercase">
                      {related.kindLabel}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}

        {relatedGuides.length > 0 && (
          <nav
            aria-labelledby="related-guides-heading"
            className="site-card border-site-outline-strong bg-site-surface-container border p-5"
          >
            <h2
              id="related-guides-heading"
              className="font-site-mono text-site-primary text-[10px] font-semibold tracking-[0.16em] uppercase"
            >
              {copy.guides}
            </h2>
            <ul className="divide-site-outline-variant mt-3 divide-y">
              {relatedGuides.map((guide) => (
                <li key={guide.href}>
                  <Link
                    href={guide.href}
                    className="text-site-on-surface hover:text-site-primary focus-visible:outline-site-primary block py-3 text-sm focus-visible:outline-2 focus-visible:outline-offset-2"
                  >
                    {guide.title} →
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}

        <Link
          href={kind.route}
          className="font-site-mono text-site-primary focus-visible:outline-site-primary inline-block text-[10px] font-semibold tracking-[0.14em] uppercase focus-visible:outline-2 focus-visible:outline-offset-4"
        >
          ← {copy.back} {kind.label}
        </Link>
      </aside>
    </article>
  );
}

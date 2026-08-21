import { Link } from '@/core/i18n/navigation';
import {
  getEntityField,
  type EntityKind,
  type EntityRecord,
} from '@/config/entities';

import { EntityFieldValue } from './EntityFieldValue';

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
}: {
  kind: EntityKind;
  entity: EntityRecord;
  relatedEntities: ResolvedEntityLink[];
  relatedGuides: ResolvedGuideLink[];
}) {
  return (
    <article className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_300px]">
      <div className="min-w-0">
        <header className="border-site-outline-strong bg-site-surface-container border p-6 md:p-10">
          <p className="font-site-mono text-site-primary text-[10px] font-semibold tracking-[0.18em] uppercase">
            {kind.singularLabel} record
          </p>
          <h1 className="site-display-lg text-site-on-surface mt-4 text-balance">
            {entity.name}
          </h1>
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
                <dl className="border-site-outline-strong bg-site-outline-strong grid gap-px border sm:grid-cols-2">
                  {populatedFields.map((fieldId) => (
                    <div
                      key={fieldId}
                      className="bg-site-surface-container px-5 py-4"
                    >
                      <dt className="font-site-mono text-site-outline text-[10px] tracking-[0.14em] uppercase">
                        {getEntityField(kind, fieldId)?.label ?? fieldId}
                      </dt>
                      <dd className="text-site-on-surface mt-2 text-base tabular-nums">
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
        <section className="border-site-outline-strong bg-site-surface-container border p-5">
          <h2 className="font-site-mono text-site-primary text-[10px] font-semibold tracking-[0.16em] uppercase">
            Version information
          </h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex items-center justify-between gap-4">
              <dt className="text-site-on-surface-variant">Game build</dt>
              <dd className="font-site-mono text-site-on-surface tabular-nums">
                v{entity.version}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="text-site-on-surface-variant">Updated</dt>
              <dd className="font-site-mono text-site-on-surface tabular-nums">
                <time dateTime={entity.updatedAt}>{entity.updatedAt}</time>
              </dd>
            </div>
          </dl>
        </section>

        {relatedEntities.length > 0 && (
          <nav
            aria-labelledby="related-entities-heading"
            className="border-site-outline-strong bg-site-surface-container border p-5"
          >
            <h2
              id="related-entities-heading"
              className="font-site-mono text-site-primary text-[10px] font-semibold tracking-[0.16em] uppercase"
            >
              Related records
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
            className="border-site-outline-strong bg-site-surface-container border p-5"
          >
            <h2
              id="related-guides-heading"
              className="font-site-mono text-site-primary text-[10px] font-semibold tracking-[0.16em] uppercase"
            >
              Related guides
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
          ← Back to {kind.label}
        </Link>
      </aside>
    </article>
  );
}

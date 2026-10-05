'use client';

import { useMemo, useState } from 'react';
import { getEntityCopy } from '@/content/entity-copy';

import { Link } from '@/core/i18n/navigation';
import {
  getEntityField,
  type EntityKind,
  type EntityRecord,
} from '@/config/entities';

import { EntityFieldValue } from './EntityFieldValue';
import { EntityImage } from './EntityImage';

export function EntityCatalog({
  kind,
  entities,
  locale = 'en',
}: {
  kind: EntityKind;
  entities: EntityRecord[];
  locale?: string;
}) {
  const copy = getEntityCopy(locale);
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [sort, setSort] = useState('name-asc');

  const facetOptions = useMemo(
    () =>
      Object.fromEntries(
        kind.facets.map((facet) => [
          facet.field,
          facet.options ??
            [
              ...new Set(
                entities
                  .map((entity) => entity.data[facet.field])
                  .filter((value) => value !== undefined)
                  .map(String)
              ),
            ].sort((a, b) => a.localeCompare(b, locale)),
        ])
      ),
    [entities, kind.facets, locale]
  );

  const results = useMemo(() => {
    const search = query.trim().toLocaleLowerCase(locale);
    const filtered = entities.filter(
      (entity) =>
        [entity.name, entity.summary, ...Object.values(entity.data)]
          .join(' ')
          .toLocaleLowerCase(locale)
          .includes(search) &&
        kind.facets.every((facet) => {
          const selected = filters[facet.field];
          return (
            !selected || String(entity.data[facet.field] ?? '') === selected
          );
        })
    );

    return filtered.sort((a, b) => {
      if (sort === 'name-desc') return b.name.localeCompare(a.name, locale);
      if (sort === 'updated-desc') {
        return (
          b.updatedAt.localeCompare(a.updatedAt) ||
          a.name.localeCompare(b.name, locale)
        );
      }
      return a.name.localeCompare(b.name, locale);
    });
  }, [entities, filters, kind.facets, sort, query, locale]);

  const hasFilters = query.length > 0 || Object.values(filters).some(Boolean);
  const reset = () => {
    setFilters({});
    setQuery('');
  };

  return (
    <div>
      <div className="site-card border-site-outline-strong bg-site-surface-container mb-8 grid gap-5 border p-5 md:grid-cols-[repeat(auto-fit,minmax(180px,1fr))]">
        <label className="text-site-on-surface-variant flex flex-col gap-2 text-sm">
          <span className="font-site-mono text-[10px] font-semibold tracking-[0.16em] uppercase">
            {copy.search}
          </span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={copy.searchPlaceholder}
            className="site-control border-site-outline-strong bg-site-surface text-site-on-surface focus-visible:outline-site-primary min-h-11 w-full border px-3 text-sm focus-visible:outline-2 focus-visible:outline-offset-2"
          />
        </label>
        {kind.facets.map((facet) => (
          <label
            key={facet.field}
            className="text-site-on-surface-variant flex flex-col gap-2 text-sm"
          >
            <span className="font-site-mono text-[10px] font-semibold tracking-[0.16em] uppercase">
              {facet.label}
            </span>
            <select
              value={filters[facet.field] ?? ''}
              onChange={(event) =>
                setFilters((current) => ({
                  ...current,
                  [facet.field]: event.target.value,
                }))
              }
              className="site-control border-site-outline-strong bg-site-surface text-site-on-surface focus-visible:outline-site-primary min-h-11 border px-3 text-sm focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              <option value="">{copy.all}</option>
              {(facetOptions[facet.field] ?? []).map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
        ))}

        <label className="text-site-on-surface-variant flex flex-col gap-2 text-sm">
          <span className="font-site-mono text-[10px] font-semibold tracking-[0.16em] uppercase">
            {copy.sort}
          </span>
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value)}
            className="site-control border-site-outline-strong bg-site-surface text-site-on-surface focus-visible:outline-site-primary min-h-11 border px-3 text-sm focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            <option value="name-asc">{copy.ascending}</option>
            <option value="name-desc">{copy.descending}</option>
            <option value="updated-desc">{copy.updated}</option>
          </select>
        </label>
      </div>

      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <p
          aria-live="polite"
          className="font-site-mono text-site-on-surface-variant text-xs tabular-nums"
        >
          {copy.resultCount
            .replace('{shown}', String(results.length))
            .replace('{total}', String(entities.length))}
        </p>
        {hasFilters && (
          <button
            type="button"
            onClick={reset}
            className="site-control font-site-mono text-site-primary focus-visible:outline-site-primary text-[10px] font-semibold tracking-[0.14em] uppercase underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            {copy.clear}
          </button>
        )}
      </div>

      {results.length > 0 ? (
        <div className="grid gap-5 md:grid-cols-2">
          {results.map((entity) => (
            <article
              key={entity.id}
              className="site-card site-interactive-card border-site-outline-strong bg-site-surface-container flex min-h-56 min-w-0 flex-col overflow-hidden border"
            >
              {entity.image && entity.imageAlt && (
                <Link
                  href={entity.href}
                  className="focus-visible:outline-site-primary block focus-visible:outline-2 focus-visible:outline-offset-[-2px]"
                >
                  <EntityImage
                    entity={entity}
                    preview
                    sizes="(max-width: 767px) calc(100vw - 48px), (max-width: 1440px) calc((100vw - 112px) / 2), 664px"
                  />
                </Link>
              )}
              <div className="flex flex-1 flex-col p-6">
                <p className="font-site-mono text-site-primary text-[10px] font-semibold tracking-[0.16em] uppercase">
                  {kind.singularLabel}
                </p>
                <h2 className="site-headline-lg text-site-on-surface mt-3 [overflow-wrap:anywhere] hyphens-auto">
                  <Link
                    href={entity.href}
                    className="focus-visible:outline-site-primary hover:text-site-primary transition-colors focus-visible:outline-2 focus-visible:outline-offset-4"
                  >
                    {entity.name}
                  </Link>
                </h2>
                <p className="text-site-on-surface-variant mt-3 max-w-[60ch] text-sm leading-6">
                  {entity.summary}
                </p>
                <dl className="mt-6 grid grid-cols-2 gap-4">
                  {kind.cardFields.map((fieldId) => (
                    <div key={fieldId} className="min-w-0">
                      <dt className="font-site-mono text-site-outline text-[9px] tracking-[0.12em] uppercase">
                        {getEntityField(kind, fieldId)?.label ?? fieldId}
                      </dt>
                      <dd className="text-site-on-surface mt-1 text-sm tabular-nums">
                        <EntityFieldValue
                          kind={kind}
                          fieldId={fieldId}
                          value={entity.data[fieldId]}
                        />
                      </dd>
                    </div>
                  ))}
                </dl>
                <Link
                  href={entity.href}
                  className="font-site-mono text-site-primary focus-visible:outline-site-primary mt-auto pt-6 text-[10px] font-semibold tracking-[0.14em] uppercase focus-visible:outline-2 focus-visible:outline-offset-4"
                >
                  {copy.view} →
                </Link>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <section className="site-card border-site-outline-strong bg-site-surface-container border px-6 py-12 text-center">
          <h2 className="site-headline-lg text-site-on-surface">
            {copy.noMatches}
          </h2>
          <p className="text-site-on-surface-variant mx-auto mt-3 max-w-[52ch] text-sm">
            {copy.empty}
          </p>
          <button
            type="button"
            onClick={reset}
            className="site-control border-site-primary text-site-primary focus-visible:outline-site-primary mt-6 min-h-11 border px-5 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            {copy.reset}
          </button>
        </section>
      )}
    </div>
  );
}

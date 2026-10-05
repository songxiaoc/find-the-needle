import { getDiscoveryCopy } from '@/content/discovery-copy';

import { Link } from '@/core/i18n/navigation';
import { getAllEntities } from '@/config/entities-content';

export function GuideRecords({
  href,
  locale,
}: {
  href: string;
  locale: string;
}) {
  const records = getAllEntities(locale).filter((entity) =>
    entity.relatedGuides.includes(href)
  );
  if (!records.length) return null;
  const copy = getDiscoveryCopy(locale);
  return (
    <nav
      className="site-card border-site-outline-strong mt-10 border p-5"
      aria-label={copy.relatedRecords}
    >
      <h2 className="site-headline-lg">{copy.relatedRecords}</h2>
      <ul className="mt-5 grid gap-4 sm:grid-cols-2">
        {records.slice(0, 4).map((entity) => (
          <li key={entity.href}>
            <Link
              href={entity.href}
              className="text-site-primary hover:underline"
            >
              {entity.name} →
            </Link>
            <p className="text-site-on-surface-variant mt-2 text-sm leading-6">
              {entity.summary}
            </p>
          </li>
        ))}
      </ul>
      {records.length > 4 && (
        <Link
          href="/database"
          className="text-site-primary mt-5 inline-block text-sm hover:underline"
        >
          {copy.browse} {copy.database} →
        </Link>
      )}
    </nav>
  );
}

import { ChevronDown } from 'lucide-react';

import { Link } from '@/core/i18n/navigation';
import { advertisementLabel } from '@/config/advertising';
import { getGuideCategories } from '@/config/guides-content';
import { getCommonMessages } from '@/config/locale/messages';

import { AdSlot } from './AdSlot';
import { PlayCard } from './PlayCard';

/**
 * Persistent right rail for the wiki. Three stacked blocks, in priority order:
 *   1. category navigation (internal linking — the main job)
 *   2. play-the-game card (conversion)
 *   3. ad slot (monetization)
 *
 * Server component: reads categories from the filesystem-backed content index.
 * Each block self-hides when it has nothing to show (no categories / no play
 * URL / no ad), so the rail never renders an empty box.
 *
 * Sticky behaviour lives on the wrapping <aside> in WikiShell (needs self-start
 * in the grid or sticky silently does nothing).
 */
export function WikiSidebar({
  activeCategory,
  locale,
}: {
  /** Slug of the category currently being viewed — highlighted in the nav. */
  activeCategory?: string;
  locale?: string;
}) {
  const categories = getGuideCategories(locale);
  const copy = getCommonMessages(locale ?? 'en');

  return (
    <div className="space-y-6">
      {categories.length > 0 && (
        <nav
          aria-label={copy.ui.wikiNavigation}
          className="site-card border-site-outline-strong bg-site-surface-container border"
        >
          <p
            className="border-site-outline-variant text-site-outline border-b px-4 py-3"
            style={{
              fontFamily: 'var(--font-site-mono)',
              fontSize: 10,
              letterSpacing: '0.2em',
              fontWeight: 600,
              textTransform: 'uppercase',
            }}
          >
            {copy.ui.wikiNavigation}
          </p>
          {/* Native <details> = expand/collapse with zero client JS, fully
              keyboard-accessible. The active category starts open. */}
          <ul>
            {categories.map((c) => {
              const Icon = c.icon;
              const active = c.slug === activeCategory;
              return (
                <li
                  key={c.slug}
                  className="border-site-outline-variant border-b last:border-b-0"
                >
                  <details className="group" open={active}>
                    <summary className="text-site-on-surface-variant hover:text-site-primary flex cursor-pointer list-none items-center gap-3 px-4 py-3 transition-colors [&::-webkit-details-marker]:hidden">
                      <Icon className="h-4 w-4 shrink-0" aria-hidden />
                      <span
                        className="group-open:text-site-primary flex-1"
                        style={{
                          fontFamily: 'var(--font-site-body)',
                          fontSize: 14,
                        }}
                      >
                        {c.title}
                      </span>
                      <span
                        aria-hidden
                        className="text-site-outline"
                        style={{
                          fontFamily: 'var(--font-site-mono)',
                          fontSize: 11,
                        }}
                      >
                        {c.count}
                      </span>
                      <ChevronDown
                        className="text-site-outline h-3.5 w-3.5 shrink-0 transition-transform group-open:rotate-180"
                        aria-hidden
                      />
                    </summary>
                    <ul className="pb-2">
                      <li>
                        <Link
                          href={`/guides/${c.slug}`}
                          className="text-site-outline hover:text-site-primary block py-2 pr-4 pl-11 transition-colors"
                          style={{
                            fontFamily: 'var(--font-site-body)',
                            fontSize: 13,
                          }}
                        >
                          {copy.ui.overview}
                        </Link>
                      </li>
                      {c.items.map((a) => (
                        <li key={a.slug}>
                          <Link
                            href={a.href}
                            className="text-site-on-surface-variant hover:text-site-primary block py-2 pr-4 pl-11 transition-colors"
                            style={{
                              fontFamily: 'var(--font-site-body)',
                              fontSize: 13,
                            }}
                          >
                            {a.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </details>
                </li>
              );
            })}
          </ul>
        </nav>
      )}

      <PlayCard locale={locale} />
      <AdSlot label={advertisementLabel(locale ?? 'en')} />
    </div>
  );
}

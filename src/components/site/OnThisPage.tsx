'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

export type TocItem = { id: string; label: string };

/**
 * In-page anchor navigation for long article pages.
 *
 * Two presentations, one data source:
 *   - `< xl`: a collapsible "On this page" disclosure in normal flow, dropped
 *     in by the page right under the ArticleHeader. Works on mobile.
 *   - `xl+`: a fixed rail pinned in the left gutter of the centered 820px
 *     reading column, so it stays visible while scrolling (sticky behaviour
 *     without restructuring the shared ArticleContainer).
 *
 * Active-section highlight is driven by an IntersectionObserver over the
 * heading elements referenced by `items[].id`.
 */
export function OnThisPage({
  items,
  scrollThreshold = 0,
}: {
  items: TocItem[];
  /** Hide the fixed desktop rail until scroll exceeds this px value. */
  scrollThreshold?: number;
}) {
  const t = useTranslations('common.ui');
  const [active, setActive] = useState<string>(items[0]?.id ?? '');
  const [visible, setVisible] = useState(scrollThreshold === 0);

  useEffect(() => {
    if (scrollThreshold === 0) return;
    const handler = () => setVisible(window.scrollY > scrollThreshold);
    window.addEventListener('scroll', handler, { passive: true });
    handler();
    return () => window.removeEventListener('scroll', handler);
  }, [scrollThreshold]);

  useEffect(() => {
    const headings = items
      .map((it) => document.getElementById(it.id))
      .filter((el): el is HTMLElement => el !== null);
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the topmost heading currently intersecting the upper band.
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) {
          setActive(visible[0].target.id);
        }
      },
      // Trigger when a heading enters the top 20% of the viewport.
      { rootMargin: '0px 0px -75% 0px', threshold: 0 }
    );

    headings.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [items]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    e.preventDefault();
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setActive(id);
    if (history.replaceState) {
      history.replaceState(null, '', `#${id}`);
    }
  };

  const list = (
    <ul className="space-y-1">
      {items.map((it) => {
        const isActive = active === it.id;
        return (
          <li key={it.id}>
            <a
              href={`#${it.id}`}
              onClick={(e) => handleClick(e, it.id)}
              className="block border-l-2 py-1.5 pl-3.5 transition-colors"
              style={{
                fontFamily: 'var(--font-site-body)',
                fontSize: 14.5,
                lineHeight: 1.45,
                borderColor: isActive
                  ? 'var(--site-primary)'
                  : 'var(--site-outline-variant)',
                color: isActive
                  ? 'var(--site-primary)'
                  : 'var(--site-on-surface-variant)',
                fontWeight: isActive ? 600 : 400,
              }}
            >
              {it.label}
            </a>
          </li>
        );
      })}
    </ul>
  );

  const heading = (
    <p
      className="text-site-primary"
      style={{
        fontFamily: 'var(--font-site-mono)',
        fontSize: 11,
        letterSpacing: '0.22em',
        fontWeight: 600,
        textTransform: 'uppercase',
      }}
    >
      {t('onThisPage')}
    </p>
  );

  return (
    <>
      {/* Mobile / tablet: collapsible disclosure in normal flow. */}
      <details className="site-card border-site-outline-variant bg-site-surface-container mb-8 border p-4 xl:hidden">
        <summary className="cursor-pointer list-none">{heading}</summary>
        <div className="mt-3">{list}</div>
      </details>

      {/* Desktop: fixed rail in the left gutter of the reading column. */}
      <nav
        aria-label={t('onThisPage')}
        className="fixed top-28 z-10 hidden max-h-[70vh] w-52 overflow-y-auto xl:block"
        style={{
          left: 'max(1rem, calc((100vw - 820px) / 2 - 14rem))',
          opacity: visible ? 1 : 0,
          pointerEvents: visible ? 'auto' : 'none',
          transition: 'opacity 0.2s',
        }}
      >
        <div className="mb-3">{heading}</div>
        {list}
      </nav>
    </>
  );
}

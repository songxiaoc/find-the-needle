'use client';

import { Link, usePathname } from '@/core/i18n/navigation';
import { localeNames, locales } from '@/config/locale';

/**
 * Desktop language switcher. Uses next-intl's locale-aware navigation so that
 * switching language stays on the CURRENT page (e.g. /guides/codes → /es/guides/codes)
 * instead of jumping back to the locale homepage. `usePathname` here returns the
 * locale-agnostic path; the `locale` prop on <Link> rewrites the prefix.
 */
export function LocaleSwitcher() {
  const pathname = usePathname();
  return (
    <div className="relative hidden md:block">
      <details className="group">
        <summary
          className="text-site-on-surface-variant hover:text-site-primary flex cursor-pointer list-none items-center gap-1 rounded px-2 py-1 transition-colors [&::-webkit-details-marker]:hidden"
          style={{
            fontFamily: 'var(--font-site-mono)',
            fontSize: 11,
            letterSpacing: '0.12em',
            fontWeight: 600,
          }}
        >
          <span>🌐</span>
          <span className="uppercase">LANG</span>
        </summary>
        <div className="border-site-outline bg-site-surface absolute top-full right-0 z-50 mt-1 min-w-[120px] border py-1 shadow-lg">
          {locales.map((l) => (
            <Link
              key={l}
              href={pathname}
              locale={l}
              className="text-site-on-surface-variant hover:bg-site-surface-container hover:text-site-primary block px-4 py-2 transition-colors"
              style={{ fontFamily: 'var(--font-site-body)', fontSize: 13 }}
            >
              {localeNames[l] ?? l.toUpperCase()}
            </Link>
          ))}
        </div>
      </details>
    </div>
  );
}

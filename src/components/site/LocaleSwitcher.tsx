'use client';

import { useLocale, useTranslations } from 'next-intl';

import { usePathname } from '@/core/i18n/navigation';
import { localeNames, locales } from '@/config/locale';

import { LocaleLink } from './LocaleLink';

/**
 * Desktop language switcher. The shared path remains locale-agnostic while
 * LocaleLink resolves and prefetches the equivalent canonical language URL, so
 * switching stays on the current page without a document reload.
 */
export function LocaleSwitcher() {
  const pathname = usePathname();
  const currentLocale = useLocale();
  const t = useTranslations('common.navigation');
  return (
    <div className="relative">
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
          <span className="uppercase" aria-label={t('language')}>
            {currentLocale}
          </span>
        </summary>
        <div className="site-card border-site-outline-strong bg-site-surface absolute top-full right-0 z-50 mt-1 min-w-[120px] overflow-hidden border py-1 shadow-lg">
          {locales.map((l) => (
            <LocaleLink
              key={l}
              href={pathname}
              locale={l}
              aria-current={l === currentLocale ? 'page' : undefined}
              className="text-site-on-surface-variant hover:bg-site-surface-container hover:text-site-primary block px-4 py-2 transition-colors"
              style={{ fontFamily: 'var(--font-site-body)', fontSize: 13 }}
            >
              {localeNames[l] ?? l.toUpperCase()}
              {l === currentLocale ? ' ✓' : ''}
            </LocaleLink>
          ))}
        </div>
      </details>
    </div>
  );
}

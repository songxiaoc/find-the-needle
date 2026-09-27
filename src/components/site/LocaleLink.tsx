'use client';

import { useEffect, useState, type ComponentProps } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';

import { getPathname } from '@/core/i18n/navigation';
import { rememberLocale } from '@/core/i18n/preference';

type LocaleLinkProps = Omit<
  ComponentProps<typeof NextLink>,
  'href' | 'locale'
> & {
  href: string;
  locale: string;
};

/**
 * Locale-aware client link that points directly at the canonical target URL.
 *
 * next-intl intentionally disables prefetching when its Link receives a
 * `locale` prop. For a site-wide language switch that makes the RSC payload and
 * language resources arrive only after the click, which can feel like a page
 * reload. This link computes the localized URL up front and warms Next's client
 * router cache while preserving a real href for crawlers and new tabs.
 */
export function LocaleLink({
  href,
  locale,
  onClick,
  scroll = false,
  ...props
}: LocaleLinkProps) {
  const currentLocale = useLocale();
  const router = useRouter();
  const localizedPathname = getPathname({ href, locale });
  const [urlSuffix, setUrlSuffix] = useState('');

  useEffect(() => {
    // Language switches stay on the exact equivalent URL, including filters
    // or an in-page anchor, without making the initial server href unstable.
    const sync = () =>
      setUrlSuffix(`${window.location.search}${window.location.hash}`);
    sync();
    window.addEventListener('hashchange', sync);
    window.addEventListener('popstate', sync);
    return () => {
      window.removeEventListener('hashchange', sync);
      window.removeEventListener('popstate', sync);
    };
  }, [href]);

  const localizedHref = `${localizedPathname}${urlSuffix}`;

  useEffect(() => {
    if (locale !== currentLocale) {
      router.prefetch(localizedHref);
    }
  }, [currentLocale, locale, localizedHref, router]);

  return (
    <NextLink
      {...props}
      href={localizedHref}
      hrefLang={locale}
      prefetch
      scroll={scroll}
      onClick={(event) => {
        rememberLocale(locale);
        onClick?.(event);
        if (
          event.defaultPrevented ||
          event.metaKey ||
          event.ctrlKey ||
          event.shiftKey ||
          event.altKey ||
          event.button !== 0
        )
          return;
        event.preventDefault();
        event.currentTarget.closest('details')?.removeAttribute('open');
        router.push(
          `${localizedPathname}${window.location.search}${window.location.hash}`,
          { scroll }
        );
      }}
    />
  );
}

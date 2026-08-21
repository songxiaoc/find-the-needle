import type { ReactNode } from 'react';
import Image from 'next/image';
import { DocsLayout } from 'fumadocs-ui/layouts/notebook';
import { RootProvider } from 'fumadocs-ui/provider';

import { i18n, source } from '@/core/docs/source';
import { envConfigs } from '@/config';
import { defaultLocale, localeNames, locales } from '@/config/locale';

import '@/config/style/docs.css';

// Derived from the site's active locales. A hardcoded list here used to offer
// 简体中文 in the docs switcher on English-only sites, and to omit every
// language a site had actually added.
const docsLocales = locales.map((locale) => ({
  locale,
  name: localeNames[locale] ?? locale.toUpperCase(),
}));

export default async function DocsRootLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale?: string }>;
}) {
  const { locale } = await params;
  const lang = locale || defaultLocale;

  const nav = {
    // Send the logo back to the site root for the reader's own locale. A
    // hardcoded '/' would drop a zh reader onto the English homepage.
    url: lang === defaultLocale ? '/' : `/${lang}`,
    mode: 'top' as const,
    transparentMode: 'top' as const,
    title: (
      <>
        <Image
          src={envConfigs.app_logo}
          alt={envConfigs.app_name}
          width={28}
          height={28}
        />
        <span className="text-primary text-lg font-bold">
          {envConfigs.app_name}
        </span>
      </>
    ),
  };

  return (
    <RootProvider
      i18n={{ locale: lang, locales: docsLocales }}
      // Fumadocs search needs a server route to query. This template ships no
      // API routes — every page is statically pre-rendered for Cloudflare
      // Workers — so the search UI would only ever return errors. To enable it,
      // add a search handler and point `search.options.api` at it.
      search={{ enabled: false }}
    >
      <DocsLayout
        i18n={i18n}
        links={[]}
        nav={nav}
        tree={source.pageTree[lang]}
        sidebar={{ tabs: [] }}
        tabMode="sidebar"
      >
        {children}
      </DocsLayout>
    </RootProvider>
  );
}

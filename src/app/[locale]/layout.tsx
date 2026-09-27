import { notFound } from 'next/navigation';
import Script from 'next/script';
import { SiteJsonLd } from '@/components/site/SiteJsonLd';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';

import { routing } from '@/core/i18n/config';
import { analyticsConfig } from '@/config/analytics';
import { siteMetadata } from '@/shared/lib/seo';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return siteMetadata(locale);
}

// <html lang> + <body> live here (not the root layout) so the lang attribute
// reflects the actual route locale during static generation — the root layout
// sits above the [locale] segment and can't read params.locale. All page
// routes are nested under [locale], so this covers every rendered page.
export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const gaId = analyticsConfig.googleAnalyticsId;
  const clarityId = process.env.NEXT_PUBLIC_CLARITY_ID || '';
  const plausibleDomain = analyticsConfig.plausibleDomain;

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        {/* Site-wide @graph: WebSite + Organization + VideoGame, cross-linked
         * by @id. Per-page Article JSON-LD references #website / #game. */}
        <SiteJsonLd locale={locale} />
        {/* GA must load in <head> with beforeInteractive — afterInteractive at
         * the end of <body> can miss the initial pageview on fast navigations,
         * so analytics under-reports. See docs/PITFALLS.md. */}
        {gaId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="beforeInteractive"
            />
            <Script id="ga" strategy="beforeInteractive">
              {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', ${JSON.stringify(gaId)});`}
            </Script>
          </>
        )}
      </head>
      <body suppressHydrationWarning className="overflow-x-hidden">
        <NextIntlClientProvider>{children}</NextIntlClientProvider>

        {plausibleDomain && (
          <Script
            id="plausible"
            defer
            data-domain={plausibleDomain}
            src={analyticsConfig.plausibleScriptUrl}
            strategy="afterInteractive"
          />
        )}

        {clarityId && (
          <Script id="clarity" strategy="afterInteractive">
            {`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window, document, "clarity", "script", "${clarityId}");`}
          </Script>
        )}
      </body>
    </html>
  );
}

import { notFound } from 'next/navigation';
import Script from 'next/script';
import { NativeAdRuntime } from '@/components/site/NativeAd';
import { PlausibleAnalytics } from '@/components/site/PlausibleAnalytics';
import { SiteJsonLd } from '@/components/site/SiteJsonLd';
import { SiteThemeProvider } from '@/components/site/SiteThemeProvider';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';

import { routing } from '@/core/i18n/config';
import { adsterraConfig } from '@/config/advertising';
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

  return (
    <html lang={locale} className="dark" suppressHydrationWarning>
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
        <SiteThemeProvider>
          <NextIntlClientProvider>{children}</NextIntlClientProvider>
        </SiteThemeProvider>
        <NativeAdRuntime />

        <Script
          id="adsterra-social-bar"
          src={adsterraConfig.socialBarScriptUrl}
          strategy="afterInteractive"
          data-cfasync="false"
        />

        {analyticsConfig.gameradarPlausibleScriptUrl && (
          <Script id="gameradar-plausible-init" strategy="beforeInteractive">
            {`window.plausible=window.plausible||function(){(plausible.q=plausible.q||[]).push(arguments)},plausible.init=plausible.init||function(i){plausible.o=i||{}};plausible.init()`}
          </Script>
        )}
        <PlausibleAnalytics />

        {clarityId && (
          <Script id="clarity" strategy="afterInteractive">
            {`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window, document, "clarity", "script", "${clarityId}");`}
          </Script>
        )}
      </body>
    </html>
  );
}

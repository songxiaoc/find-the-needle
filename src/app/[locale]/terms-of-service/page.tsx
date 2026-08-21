import type { Metadata } from 'next';
import { fontVars } from '@/components/site/active-fonts';
import { ArticleContainer, SiteShell } from '@/components/site/SiteShell';
import {
  ArticleHeader,
  Breadcrumb,
  BreadcrumbJsonLd,
} from '@/components/site/ui';
import { setRequestLocale } from 'next-intl/server';

import { gameConfig } from '@/config/game';
import { locales } from '@/config/locale';

// force-static: SiteShell renders a footer column from getGuideCategories(),
// which reads the filesystem at call time. On Cloudflare Workers there is no fs
// at runtime, so this page must be pre-rendered — otherwise it is served as a
// runtime render and the guides footer/nav silently comes back empty.
// Pair with staticAssetsIncrementalCache in open-next.config.ts.
export const dynamic = 'force-static';

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

const SITE = gameConfig.origin;
const TITLE = `Terms of Service | ${gameConfig.siteName}`;
const DESCRIPTION = `Terms of service for ${gameConfig.domain}.`;
const H1 = 'Terms of Service';
const LAST_UPDATED = '2026-05-22';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const canonical =
    locale === 'en'
      ? `${SITE}/terms-of-service`
      : `${SITE}/${locale}/terms-of-service`;
  return {
    title: TITLE,
    description: DESCRIPTION,
    alternates: { canonical },
    robots: { index: false, follow: true },
  };
}

const BREADCRUMB = [
  { label: 'Home', href: '/' },
  { label: 'Terms of Service', href: '/terms-of-service' },
];

export default async function TermsOfServicePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className={fontVars}>
      <BreadcrumbJsonLd items={BREADCRUMB} site={SITE} />
      <SiteShell>
        <ArticleContainer>
          <Breadcrumb items={BREADCRUMB} />
          <ArticleHeader h1={H1} lastUpdated={LAST_UPDATED} />

          <div className="space-y-8">
            <section>
              <h2 className="site-headline-md text-site-on-surface mb-3">
                About This Site
              </h2>
              <p className="site-body-md text-site-on-surface-variant mb-4">
                {gameConfig.domain} is an unofficial fan-made guide site for{' '}
                {gameConfig.gameFullName}. We are not affiliated with{' '}
                {gameConfig.disclaimer.publisher} or the official{' '}
                {gameConfig.gameShortName} franchise.
              </p>
              <p className="site-body-md text-site-on-surface-variant">
                By accessing or using this site you agree to the terms below.
              </p>
            </section>

            <section>
              <h2 className="site-headline-md text-site-on-surface mb-3">
                Use of Content
              </h2>
              <p className="site-body-md text-site-on-surface-variant mb-3">
                All guides on {gameConfig.domain} are provided for general
                information and entertainment. You may:
              </p>
              <ul className="site-body-md text-site-on-surface-variant mb-4 list-disc space-y-2 pl-6">
                <li>Read, share, and link to our pages.</li>
                <li>Quote short excerpts with credit and a link back.</li>
              </ul>
              <p className="site-body-md text-site-on-surface-variant mb-3">
                You may not:
              </p>
              <ul className="site-body-md text-site-on-surface-variant list-disc space-y-2 pl-6">
                <li>
                  Republish full articles or major sections without prior
                  written permission.
                </li>
                <li>
                  Use automated scrapers in a way that overloads the site.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="site-headline-md text-site-on-surface mb-3">
                Game Information &amp; Accuracy
              </h2>
              <p className="site-body-md text-site-on-surface-variant mb-4">
                {gameConfig.gameFullName}
                {gameConfig.statusBadge
                  ? ` is in ${gameConfig.statusBadge}`
                  : ''}
                . Class balance, upgrades, builds, weapons, and other game
                systems change frequently. We update our guides as new
                information becomes available, but at any given moment some
                content may be outdated or incorrect.
              </p>
              <p className="site-body-md text-site-on-surface-variant">
                Use our guides as a starting point for your own play and
                decisions. We do not guarantee accuracy or completeness.
              </p>
            </section>

            <section>
              <h2 className="site-headline-md text-site-on-surface mb-3">
                Trademarks
              </h2>
              <p className="site-body-md text-site-on-surface-variant">
                {gameConfig.disclaimer.trademarkOwners} All game-related names,
                logos, art, and references are used here for the purpose of
                identification and commentary under nominative fair use. We do
                not claim ownership of any official game content.
              </p>
            </section>

            <section>
              <h2 className="site-headline-md text-site-on-surface mb-3">
                Third-Party Links
              </h2>
              <p className="site-body-md text-site-on-surface-variant">
                Pages may link to external sites (Steam, official patch notes,
                community resources). We are not responsible for the content or
                practices of those sites.
              </p>
            </section>

            <section>
              <h2 className="site-headline-md text-site-on-surface mb-3">
                Disclaimers
              </h2>
              <p className="site-body-md text-site-on-surface-variant">
                The site is provided{' '}
                <strong className="text-site-on-surface">as is</strong>, without
                warranties of any kind. To the maximum extent permitted by law,
                we are not liable for any damages, losses, or issues arising
                from your use of the site or reliance on its content.
              </p>
            </section>

            <section>
              <h2 className="site-headline-md text-site-on-surface mb-3">
                Changes
              </h2>
              <p className="site-body-md text-site-on-surface-variant">
                We may update these terms as the site evolves. Continued use of
                the site after a change constitutes acceptance of the new terms.
              </p>
            </section>

            <section>
              <h2 className="site-headline-md text-site-on-surface mb-3">
                Contact
              </h2>
              <p className="site-body-md text-site-on-surface-variant">
                For takedown requests, corrections, or general questions,
                contact us at the address listed in the footer.
              </p>
            </section>
          </div>
        </ArticleContainer>
      </SiteShell>
    </div>
  );
}

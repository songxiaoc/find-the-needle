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
const TITLE = `Privacy Policy | ${gameConfig.siteName}`;
const DESCRIPTION = `Privacy policy for ${gameConfig.domain}.`;
const H1 = 'Privacy Policy';
const LAST_UPDATED = '2026-05-22';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const canonical =
    locale === 'en'
      ? `${SITE}/privacy-policy`
      : `${SITE}/${locale}/privacy-policy`;
  return {
    title: TITLE,
    description: DESCRIPTION,
    alternates: { canonical },
    robots: { index: false, follow: true },
  };
}

const BREADCRUMB = [
  { label: 'Home', href: '/' },
  { label: 'Privacy Policy', href: '/privacy-policy' },
];

export default async function PrivacyPolicyPage({
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
                This page explains what information we collect when you visit
                the site, how it is used, and what choices you have.
              </p>
            </section>

            <section>
              <h2 className="site-headline-md text-site-on-surface mb-3">
                Information We Collect
              </h2>
              <p className="site-body-md text-site-on-surface-variant mb-4">
                We do not require accounts and do not ask you to submit personal
                information to read our guides.
              </p>
              <p className="site-body-md text-site-on-surface-variant mb-3">
                When you visit the site, the following may be collected
                automatically:
              </p>
              <ul className="site-body-md text-site-on-surface-variant list-disc space-y-2 pl-6">
                <li>
                  <strong className="text-site-on-surface">
                    Anonymous analytics
                  </strong>{' '}
                  — page views, country, device type, and referrer, through
                  Plausible, Google Analytics and/or Microsoft Clarity if those
                  are enabled. No personally identifying information is
                  collected by us.
                </li>
                <li>
                  <strong className="text-site-on-surface">Server logs</strong>{' '}
                  — standard HTTP request logs (IP address, user agent,
                  timestamp) collected by our hosting provider (Cloudflare) for
                  security and abuse prevention.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="site-headline-md text-site-on-surface mb-3">
                Cookies
              </h2>
              <p className="site-body-md text-site-on-surface-variant mb-3">
                We use a small number of cookies:
              </p>
              <ul className="site-body-md text-site-on-surface-variant mb-4 list-disc space-y-2 pl-6">
                <li>
                  <strong className="text-site-on-surface">
                    Analytics cookies
                  </strong>{' '}
                  set by Google Analytics or Microsoft Clarity to count unique
                  visits.
                </li>
                <li>
                  <strong className="text-site-on-surface">
                    Functional cookies
                  </strong>{' '}
                  that remember UI preferences (such as theme) if you change
                  them.
                </li>
              </ul>
              <p className="site-body-md text-site-on-surface-variant">
                You can block cookies through your browser settings. The site
                will continue to function without them.
              </p>
            </section>

            <section>
              <h2 className="site-headline-md text-site-on-surface mb-3">
                Third-Party Services
              </h2>
              <p className="site-body-md text-site-on-surface-variant mb-3">
                We may use the following third-party services. Each has its own
                privacy policy:
              </p>
              <ul className="site-body-md text-site-on-surface-variant mb-4 list-disc space-y-2 pl-6">
                <li>
                  <strong className="text-site-on-surface">Plausible</strong> —
                  privacy-friendly, cookieless traffic measurement.
                </li>
                <li>
                  <strong className="text-site-on-surface">
                    Google Analytics
                  </strong>{' '}
                  — traffic measurement.
                </li>
                <li>
                  <strong className="text-site-on-surface">
                    Microsoft Clarity
                  </strong>{' '}
                  — anonymized session insights.
                </li>
                <li>
                  <strong className="text-site-on-surface">Cloudflare</strong> —
                  hosting, caching, and DDoS protection.
                </li>
              </ul>
              <p className="site-body-md text-site-on-surface-variant">
                We do not sell or share data with advertisers, brokers, or other
                third parties.
              </p>
            </section>

            <section>
              <h2 className="site-headline-md text-site-on-surface mb-3">
                Children
              </h2>
              <p className="site-body-md text-site-on-surface-variant">
                The site is not directed to children under 13. We do not
                knowingly collect any information from children.
              </p>
            </section>

            <section>
              <h2 className="site-headline-md text-site-on-surface mb-3">
                Changes to This Policy
              </h2>
              <p className="site-body-md text-site-on-surface-variant">
                We may update this policy as the site evolves. Material changes
                will be noted by updating the date at the top.
              </p>
            </section>

            <section>
              <h2 className="site-headline-md text-site-on-surface mb-3">
                Contact
              </h2>
              <p className="site-body-md text-site-on-surface-variant">
                For any privacy questions or requests, contact us at the address
                listed in the footer.
              </p>
            </section>
          </div>
        </ArticleContainer>
      </SiteShell>
    </div>
  );
}

import {
  buildPageMetadata,
  PageFrame,
  PageRoot,
} from '@/components/site/PageFrame';
import { SectionTitle } from '@/components/site/ui';
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

const DESCRIPTION = `Contact ${gameConfig.domain} — submit a correction, share verified in-game data, or report a bug on the site.`;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return buildPageMetadata({
    titleTopic: 'Contact',
    description: DESCRIPTION,
    path: '/contact',
    locale,
  });
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <PageRoot>
      <PageFrame
        activeHref="/contact"
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Contact', href: '/contact' },
        ]}
      >
        <SectionTitle
          as="h1"
          eyebrow="Contact"
          title={`Contact ${gameConfig.domain}`}
        />

        <p className="site-body-lg text-site-on-surface-variant max-w-[70ch]">
          The best way to reach us is email. We read everything; we reply to
          anything that contains screenshots of in-game numbers, a draft log, or
          a clear bug report.
        </p>

        <div className="border-site-outline-variant bg-site-surface-container mt-8 rounded-lg border p-6">
          <p className="site-label-sm text-site-on-surface-variant">Email</p>
          <p className="site-headline-md text-site-on-surface mt-2">
            hello@{gameConfig.domain}
          </p>
        </div>

        <h2 className="site-headline-md text-site-on-surface mt-12">
          What helps
        </h2>
        <ul className="site-body-md text-site-on-surface-variant mt-3 list-disc space-y-2 pl-6">
          <li>
            Screenshots of the in-game champion screen with stats visible.
          </li>
          <li>Patch version (we version-stamp everything).</li>
          <li>A URL on this site you want corrected, if applicable.</li>
        </ul>
      </PageFrame>
    </PageRoot>
  );
}

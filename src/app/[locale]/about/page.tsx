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

const DESCRIPTION = `About ${gameConfig.domain} — an independent ${gameConfig.gameFullName} guide site. Our editorial standards, sourcing policy, and what we won't publish.`;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return buildPageMetadata({
    titleTopic: 'About',
    description: DESCRIPTION,
    path: '/about',
    locale,
  });
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <PageRoot>
      <PageFrame
        activeHref="/about"
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'About', href: '/about' },
        ]}
      >
        <SectionTitle
          as="h1"
          eyebrow="About"
          title={`About ${gameConfig.domain}`}
        />

        <p className="site-body-lg text-site-on-surface-variant max-w-[70ch]">
          {gameConfig.domain} is an independent, unofficial fan site for{' '}
          {gameConfig.gameFullName}. We write guides, track updates, and
          maintain a verified reference for the game.
        </p>

        <h2 className="site-headline-md text-site-on-surface mt-12">
          Our sourcing policy
        </h2>
        <p className="site-body-md text-site-on-surface-variant mt-3 max-w-[70ch]">
          We never publish a champion stat, skill value, or tier rating that we
          haven&apos;t verified ourselves against the in-game screen. Where a
          value is missing, you&apos;ll see <code>[TBD]</code> instead of a
          guess. If we make a mistake we fix it visibly and link the diff in the
          patch log.
        </p>

        <h2 className="site-headline-md text-site-on-surface mt-12">
          What you won&apos;t find here
        </h2>
        <ul className="site-body-md text-site-on-surface-variant mt-3 list-disc space-y-2 pl-6">
          <li>Made-up numbers dressed up to look authoritative.</li>
          <li>
            Stats from a different game or version re-labelled as current.
          </li>
          <li>
            Ratings based on vibes; we wait for a patch&apos;s dust to settle.
          </li>
        </ul>

        <h2 className="site-headline-md text-site-on-surface mt-12">
          Disclosure
        </h2>
        <p className="site-body-md text-site-on-surface-variant mt-3 max-w-[70ch]">
          {gameConfig.domain} is an independent fan-made site. We are not
          affiliated with, endorsed by, or sponsored by{' '}
          {gameConfig.disclaimer.publisher}.{' '}
          {gameConfig.disclaimer.trademarkOwners}
        </p>
      </PageFrame>
    </PageRoot>
  );
}

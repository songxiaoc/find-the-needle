import {
  buildPageMetadata,
  PageFrame,
  PageRoot,
} from '@/components/site/PageFrame';
import { FaqAccordion, SectionTitle } from '@/components/site/ui';
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

const DESCRIPTION = `Frequently asked questions about ${gameConfig.gameFullName}: releases, system requirements, and how this guide site works.`;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return buildPageMetadata({
    titleTopic: 'FAQ',
    description: DESCRIPTION,
    path: '/faq',
    locale,
  });
}

export default async function FaqPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <PageRoot>
      <PageFrame
        activeHref="/faq"
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'FAQ', href: '/faq' },
        ]}
      >
        <SectionTitle
          as="h1"
          eyebrow="FAQ"
          title={`${gameConfig.gameFullName} FAQ`}
        />

        <FaqAccordion
          items={[
            {
              q: `Is ${gameConfig.gameFullName} out?`,
              a: `${gameConfig.gameFullName} launched on ${gameConfig.eaLaunchDate}. This site currently tracks version v${gameConfig.gameVersion}.`,
            },
            {
              q: 'Where do your facts come from?',
              a: 'Only from the in-game screens and official announcements. We never use values from a different game or version, or community rumours. If a value is missing, the page shows [TBD] until verified.',
            },
            {
              q: 'How often do you update?',
              a: 'Each major update gets reviewed within a few days, and every page is stamped with the version it was last validated against.',
            },
            {
              q: 'Can I contribute?',
              a: 'Yes — see /contact for the email address. We accept screenshots of in-game data and corrections.',
            },
            {
              q: `Is this site affiliated with ${gameConfig.disclaimer.publisher}?`,
              a: `No. ${gameConfig.domain} is an unofficial fan site. ${gameConfig.disclaimer.trademarkOwners}`,
            },
          ]}
        />
      </PageFrame>
    </PageRoot>
  );
}

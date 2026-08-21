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

const DESCRIPTION = `${gameConfig.gameFullName} troubleshooting: crashes on launch, corrupted saves, and other common problems with fixes. Replace these with issues specific to your game.`;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return buildPageMetadata({
    titleTopic: 'Troubleshooting',
    description: DESCRIPTION,
    path: '/troubleshooting',
    locale,
  });
}

export default async function TroubleshootingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <PageRoot>
      <PageFrame
        activeHref="/troubleshooting"
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Troubleshooting', href: '/troubleshooting' },
        ]}
      >
        <SectionTitle
          as="h1"
          eyebrow="Troubleshooting"
          title={`${gameConfig.gameFullName} troubleshooting`}
        />
        <p className="site-body-lg text-site-on-surface-variant mb-8 max-w-[70ch]">
          Common issues and fixes for {gameConfig.gameFullName}. Replace the
          entries below with the most-reported problems for your game and the
          fixes that work. Point readers to your support channel for anything
          not covered here.
        </p>

        <FaqAccordion
          items={[
            {
              q: 'Game crashes on launch',
              a: 'Verify game files in your store client, update graphics drivers, and clear the local shader cache. (Replace with steps specific to your game.)',
            },
            {
              q: 'Save file won’t load after an update',
              a: 'Major updates sometimes break save compatibility. Document the rollback/recovery steps for your game here.',
            },
            {
              q: 'Game runs hot on a laptop',
              a: 'Cap the framerate in graphics options. (Replace with guidance specific to your game.)',
            },
            {
              q: 'Where is my save folder?',
              a: 'Document the save-file location per platform here so players can back it up before updates.',
            },
          ]}
        />
      </PageFrame>
    </PageRoot>
  );
}

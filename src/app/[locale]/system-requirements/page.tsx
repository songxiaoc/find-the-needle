import {
  buildPageMetadata,
  PageFrame,
  PageRoot,
} from '@/components/site/PageFrame';
import { DataTable, FaqAccordion, SectionTitle } from '@/components/site/ui';
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

const DESCRIPTION = `${gameConfig.gameFullName} system requirements: minimum and recommended specs, plus notes on handheld and laptop performance. Replace the specs below with your game's official values.`;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return buildPageMetadata({
    titleTopic: 'System requirements',
    description: DESCRIPTION,
    path: '/system-requirements',
    locale,
  });
}

export default async function SystemRequirementsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <PageRoot>
      <PageFrame
        activeHref="/system-requirements"
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'System requirements', href: '/system-requirements' },
        ]}
      >
        <SectionTitle
          as="h1"
          eyebrow="Specs"
          title={`${gameConfig.gameFullName} system requirements`}
        />
        <p className="site-body-lg text-site-on-surface-variant mb-8 max-w-[70ch]">
          Specs below are placeholders. Replace them with the official
          requirements for {gameConfig.gameFullName} (e.g. from its store page)
          and keep them updated as the listing changes.
        </p>

        <DataTable
          caption="Official system requirements"
          columns={[
            { key: 'spec', label: 'Spec' },
            { key: 'min', label: 'Minimum' },
            { key: 'rec', label: 'Recommended' },
          ]}
          rows={[
            {
              spec: 'Platforms',
              min: 'Windows / macOS / Linux',
              rec: 'Windows / macOS / Linux',
            },
            { spec: 'OS', min: '[Minimum OS]', rec: '[Recommended OS]' },
            { spec: 'CPU', min: '[Minimum CPU]', rec: '[Recommended CPU]' },
            { spec: 'RAM', min: '[Minimum RAM]', rec: '[Recommended RAM]' },
            { spec: 'GPU', min: '[Minimum GPU]', rec: '[Recommended GPU]' },
            {
              spec: 'Storage',
              min: '[Minimum storage]',
              rec: '[Recommended storage]',
            },
            {
              spec: 'Verify on store',
              min: 'Check store page for current values',
              rec: 'Check store page for current values',
            },
          ]}
        />

        <h2 className="site-headline-md text-site-on-surface mt-12">
          Handheld / laptop
        </h2>
        <p className="site-body-md text-site-on-surface-variant mt-3">
          Add notes here on how {gameConfig.gameShortName} runs on handhelds
          (Steam Deck etc.) and laptops once you know — battery, resolution, and
          any verification badge.
        </p>

        <h2 className="site-headline-md text-site-on-surface mt-12">
          macOS / Linux
        </h2>
        <p className="site-body-md text-site-on-surface-variant mt-3">
          Document macOS and Linux support here if your game offers it, with any
          platform-specific caveats.
        </p>

        <h2 className="site-headline-md text-site-on-surface mt-16 mb-6">
          Frequently asked about system requirements
        </h2>
        <FaqAccordion
          items={[
            {
              q: `Can a low-end PC run ${gameConfig.gameFullName}?`,
              a: `Compare the device against the official minimum requirements before installing ${gameConfig.gameFullName}; performance below those requirements is not guaranteed.`,
            },
            {
              q: `How much storage does ${gameConfig.gameFullName} need?`,
              a: `Use the current official store listing as the source of truth and keep additional free space available for updates.`,
            },
            {
              q: `Does ${gameConfig.gameFullName} run on Mac or Linux?`,
              a: `Only platforms listed by the publisher are considered supported; check the official store page for current macOS and Linux availability.`,
            },
          ]}
        />
      </PageFrame>
    </PageRoot>
  );
}

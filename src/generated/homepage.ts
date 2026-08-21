// Generated configuration seam. Application code imports src/config/homepage.ts.
import type { HomeBlock } from '@/config/homepage-schema';

export const generatedHomeBlocks = [
  {
    id: 'hero',
    type: 'hero',
    eyebrow: 'Game Guide & Reference',
    title: 'Example Game',
    description:
      'Verified Example Game guides and reference — codes, walkthroughs, and tier lists, version-stamped against the live build.',
    ctas: [
      { label: 'Browse the guides', href: '/guides' },
      { label: 'About this site', href: '/about' },
    ],
  },
  {
    id: 'start',
    type: 'start-cards',
    title: 'Start here',
    items: [
      {
        type: 'featured',
        id: 'example-boss',
        href: '/guides/bosses/example-boss',
        title: 'Example Game guide: how to get started',
        description:
          'A template guide page showing the structure — replace this with your own pillar guide.',
        readingTime: '5 min',
        tag: 'PILLAR',
        tagTone: 'solid',
      },
    ],
  },
  {
    id: 'database-stats',
    type: 'database-stats',
    title: 'Database at a glance',
    sub: 'A live summary calculated from the structured records published on this site.',
  },
  {
    id: 'entity-index',
    type: 'entity-index',
    title: 'Browse the database',
    sub: 'Structured records with comparable attributes and guide references.',
    previewLimit: 3,
  },
  {
    id: 'latest-guides',
    type: 'latest-guides',
    title: 'Latest updates',
    sub: 'The most recently updated guides — every page version-stamped.',
  },
  {
    id: 'categories',
    type: 'category-grid',
    title: 'Explore the wiki',
    sub: 'Every guide, organized by type.',
  },
  {
    id: 'faq',
    type: 'faq',
    title: 'Frequently asked',
    sub: 'A few common questions. Full list on the FAQ page.',
    items: [
      { q: 'What is Example Game?', a: 'Replace this with a short description of the game.' },
      {
        q: 'Where do your facts come from?',
        a: 'Everything is sourced from in-game screens and official announcements, cross-checked as we verify each patch.',
      },
      {
        q: 'How often is the site updated?',
        a: 'We aim to update guides within days of each new update. (Edit this to match your real cadence.)',
      },
    ],
  },
] satisfies readonly HomeBlock[];

export const generatedHomeBlocksI18n = {} satisfies Record<string, HomeBlock[]>;

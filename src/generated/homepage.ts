import type { HomeBlock } from '@/config/homepage-schema';

import { homeCopy } from './home-copy';

export const generatedHomeBlocks = [
  {
    id: 'hero',
    type: 'hero',
    eyebrow: 'Unofficial Steam game guide',
    title: 'Find the Needle',
    description:
      'A mountain of hay. A tiny needle. Learn the opening loop, plan your first production line and turn the search into a factory.',
    ctas: [
      { label: 'Start the guide', href: '/guides/guide/getting-started' },
      {
        label: 'Get the free demo',
        href: 'https://store.steampowered.com/app/5165210/',
      },
    ],
  },
  {
    id: 'start',
    type: 'start-cards',
    title: 'What do you need help with?',
    items: [
      {
        type: 'featured',
        id: 'getting-started',
        href: '/guides/guide/getting-started',
        title: 'From your first shovel to your first machine',
        description:
          'Make sense of collecting, selling and choosing your next upgrade.',
        readingTime: '3 min',
        tag: 'GETTING STARTED',
        tagTone: 'solid',
      },
      {
        type: 'latest',
        id: 'automation',
        href: '/guides/guide/automation',
        title: 'Build a line you can follow',
        description:
          'Plan the supply, belts, power and output before expanding.',
        readingTime: '3 min',
        tag: 'AUTOMATION',
        tagTone: 'amber',
      },
      {
        type: 'latest',
        id: 'demo',
        href: '/guides/guide/demo',
        title: 'Try the Steam demo',
        description:
          'Find the official download, PC requirements and full-game release window.',
        readingTime: '2 min',
        tag: 'DEMO & RELEASE',
        tagTone: 'green',
      },
    ],
  },
  {
    id: 'about-game',
    type: 'about',
    title: 'The haystack is only the beginning',
    paragraphs: [
      'Find the Needle is a first-person hay-processing game by FindTheNeedleDev. Start with manual tools, earn money from hay and build machinery that takes over the work.',
      'Conveyor belts, scanners and processing lines turn a simple search into a growing factory. This independent guide helps you get oriented without spoiling the mystery at the end.',
    ],
    stats: [
      { label: 'Platform', value: 'Windows · Steam' },
      { label: 'Available now', value: 'Free demo' },
      { label: 'Full game planned', value: 'Q4 2026' },
    ],
    cta: {
      label: 'View the game on Steam',
      href: 'https://store.steampowered.com/app/5160800/',
    },
  },
] satisfies readonly HomeBlock[];

export const generatedHomeBlocksI18n = Object.fromEntries(
  Object.entries(homeCopy).map(([locale, copy]) => [
    locale,
    generatedHomeBlocks.map((block): HomeBlock => {
      if (block.type === 'hero')
        return {
          ...block,
          eyebrow: copy.eyebrow,
          description: copy.description,
          ctas: block.ctas.map((cta, i) => ({
            ...cta,
            label: i === 0 ? copy.start : copy.demo,
          })),
        };
      if (block.type === 'start-cards')
        return {
          ...block,
          title: copy.help,
          items: block.items.map((item, i) => ({
            ...item,
            title: copy.cards[i][0],
            description: copy.cards[i][1],
            tag: copy.cards[i][2],
            readingTime:
              locale === 'ru'
                ? item.readingTime.replace('min', 'мин')
                : item.readingTime,
          })),
        };
      return {
        ...block,
        title: copy.about,
        paragraphs: [...copy.paragraphs],
        stats: copy.stats.map(([label, value]) => ({ label, value })),
        cta: { ...block.cta, label: copy.steam },
      };
    }),
  ])
) satisfies Record<string, HomeBlock[]>;

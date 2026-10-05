import type { HomeBlock } from '@/config/homepage-schema';
import { FACTORY_TOOL_PATHS, getDiscoveryCopy } from '@/content/discovery-copy';

import { homeCopy } from './home-copy';

function expansionBlocks(locale: string): HomeBlock[] {
  const copy = getDiscoveryCopy(locale);
  return [
    { id: 'factory-records', type: 'entity-index', title: copy.databaseTitle, sub: copy.databaseIntro, previewLimit: 2 },
    {
      id: 'factory-tools', type: 'start-cards', title: copy.toolsTitle,
      items: copy.toolCards.map(([title, description, tag], i) => ({
        id: ['line-check', 'checklist', 'production-calculator'][i], type: i === 0 ? 'featured' : 'latest',
        href: FACTORY_TOOL_PATHS[i], title, description, tag,
        readingTime: copy.interactive, tagTone: i === 0 ? 'solid' : 'amber',
      })),
    },
  ];
}

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
        title: 'Connect belts and get the power running',
        description:
          'Use sell-point snapping, check the grid and trace a stalled production line.',
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
          'Install the demo, check your PC and make a copy of your save.',
        readingTime: '3 min',
        tag: 'DEMO & RELEASE',
        tagTone: 'green',
      },
    ],
  },
  {
    id: 'explore',
    type: 'start-cards',
    title: 'Machines, needles and demo updates',
    items: [
      {
        type: 'featured',
        id: 'machines-and-products',
        href: '/guides/guide/machines-and-products',
        title: 'Get to know the machines and products',
        description:
          'Understand the equipment and the different ways hay can be processed.',
        readingTime: '3 min',
        tag: 'MACHINES & PRODUCTS',
        tagTone: 'amber',
      },
      {
        type: 'latest',
        id: 'needles-and-scanners',
        href: '/guides/guide/needles-and-scanners',
        title: 'Missing a needle? Follow the hay products',
        description:
          'Check the Silo, scanner bypasses and the reported 5/6 needle problem.',
        readingTime: '3 min',
        tag: 'FINDING NEEDLES',
        tagTone: 'solid',
      },
      {
        type: 'latest',
        id: 'demo-updates',
        href: '/guides/guide/demo-updates',
        title: 'Follow the demo updates',
        description:
          'Catch up on developer announcements and changes to the playable demo.',
        readingTime: '3 min',
        tag: 'DEMO UPDATES',
        tagTone: 'green',
      },
    ],
  },
  ...expansionBlocks('en'),
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
      if (block.id === 'factory-records' || block.id === 'factory-tools') {
        return expansionBlocks(locale).find((translated) => translated.id === block.id)!;
      }
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
      if (block.type === 'start-cards') {
        const cards = block.id === 'explore' ? copy.exploreCards : copy.cards;
        return {
          ...block,
          title: block.id === 'explore' ? copy.explore : copy.help,
          items: block.items.map((item, i) => ({
            ...item,
            title: cards[i][0],
            description: cards[i][1],
            tag: cards[i][2],
            readingTime:
              locale === 'ru'
                ? item.readingTime.replace('min', 'мин')
                : item.readingTime,
          })),
        };
      }
      if (block.type !== 'about') return block;
      return {
        ...block,
        title: copy.about,
        paragraphs: [...copy.paragraphs],
        stats: copy.stats.map(([label, value]) => ({ label, value })),
        cta: block.cta ? { ...block.cta, label: copy.steam } : undefined,
      };
    }),
  ])
) satisfies Record<string, HomeBlock[]>;

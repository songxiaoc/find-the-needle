import {
  generatedHomeBlocks,
  generatedHomeBlocksI18n,
} from '@/generated/homepage';

import {
  parseHomeBlocks,
  parseHomeBlocksI18n,
  type HomeBlock,
} from './homepage-schema';
import { defaultLocale, locales } from './locale';

export type { HomeBlock, HomeStartItem } from './homepage-schema';

export const HOME_BLOCKS = parseHomeBlocks(generatedHomeBlocks);
export const HOME_BLOCKS_I18N = parseHomeBlocksI18n(generatedHomeBlocksI18n);

function structuralShape(block: HomeBlock): unknown {
  const common = { id: block.id, type: block.type };
  switch (block.type) {
    case 'hero':
    case 'final-cta':
      return { ...common, ctas: block.ctas.map((cta) => cta.href) };
    case 'start-cards':
      return {
        ...common,
        items: block.items.map((item) => ({
          id: item.id,
          type: item.type,
          href: item.href,
          tagTone: item.tagTone,
        })),
      };
    case 'code-cards':
      return { ...common, href: block.href, count: block.codes.length };
    case 'tier-grid':
      return {
        ...common,
        href: block.href,
        rows: block.rows.map((row) => row.tone ?? null),
      };
    case 'step-by-step':
      return { ...common, href: block.href, count: block.steps.length };
    case 'card-list':
      return { ...common, href: block.href, count: block.cards.length };
    case 'about':
      return {
        ...common,
        paragraphs: block.paragraphs.length,
        stats: block.stats.length,
        cta: block.cta?.href ?? null,
      };
    case 'entity-index':
      return { ...common, previewLimit: block.previewLimit ?? null };
    case 'faq':
      return { ...common, count: block.items.length };
    default:
      return common;
  }
}

function assertUniqueBlockIds(locale: string, blocks: HomeBlock[]): void {
  const seen = new Set<string>();
  for (const block of blocks) {
    if (!block.id.trim()) {
      throw new Error(
        `[homepage] locale "${locale}" contains an empty block id.`
      );
    }
    if (seen.has(block.id)) {
      throw new Error(
        `[homepage] locale "${locale}" contains duplicate block id "${block.id}".`
      );
    }
    seen.add(block.id);
  }
}

function assertHomepageWiring(): void {
  assertUniqueBlockIds(defaultLocale, HOME_BLOCKS);
  const baseline = JSON.stringify(HOME_BLOCKS.map(structuralShape));

  for (const locale of locales) {
    if (locale === defaultLocale) continue;
    const translated = HOME_BLOCKS_I18N[locale];
    if (!translated) {
      throw new Error(
        `[homepage] locale "${locale}" is active but has no generated homepage blocks. ` +
          `Add HOME_BLOCKS_I18N["${locale}"] in src/config/homepage.ts; active locales may not fall back to English.`
      );
    }
    assertUniqueBlockIds(locale, translated);
    if (JSON.stringify(translated.map(structuralShape)) !== baseline) {
      throw new Error(
        `[homepage] locale "${locale}" does not preserve the default homepage structure ` +
          `(ids/order/types/links/tones/collection sizes must match).`
      );
    }
  }

  for (const locale of Object.keys(HOME_BLOCKS_I18N)) {
    if (!locales.includes(locale)) {
      throw new Error(
        `[homepage] locale "${locale}" has homepage data but is not active.`
      );
    }
  }
}

assertHomepageWiring();

export function getHomeBlocks(locale: string): HomeBlock[] {
  if (locale === defaultLocale) return HOME_BLOCKS;
  const translated = HOME_BLOCKS_I18N[locale];
  if (translated) return translated;
  if (locales.includes(locale)) {
    throw new Error(
      `[homepage] active locale "${locale}" has no homepage data.`
    );
  }
  return HOME_BLOCKS;
}

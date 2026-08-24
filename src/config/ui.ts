import uiRecipeJson from '@/generated/ui-recipe.json';

export const UI_ARCHETYPES = [
  'editorial',
  'industrial',
  'tactical',
  'cozy',
  'codex',
  'retro',
] as const;
export const UI_THEMES = [
  'tactical',
  'pixel',
  'neon',
  'aurora',
  'sakura',
] as const;
export const UI_HEROES = [
  'cover-split',
  'gameplay-panel',
  'video-center',
  'text-only',
] as const;
export const UI_NAVIGATIONS = [
  'wiki-sidebar',
  'top-bar',
  'compact-drawer',
] as const;
export const UI_GUIDE_CARDS = ['data-panel', 'editorial', 'image-led'] as const;
export const UI_CATEGORY_CARDS = [
  'outlined',
  'soft-panel',
  'image-led',
] as const;
export const UI_ARTICLE_LAYOUTS = [
  'technical-document',
  'editorial-reading',
  'codex-entry',
] as const;
export const UI_DENSITIES = ['compact', 'comfortable', 'airy'] as const;
export const UI_SHAPES = ['square', 'soft', 'rounded'] as const;
export const UI_MOTIONS = ['minimal', 'subtle', 'expressive'] as const;
export const UI_CUSTOM_BLOCKS = [
  'production-flow',
  'interactive-map',
  'character-archive',
  'deck-preview',
  'track-stats',
  'evidence-board',
] as const;

export const UI_SECTION_VARIANTS = [
  'plain',
  'panel',
  'tinted',
  'contrast-band',
  'framed',
] as const;
export const UI_HOME_LAYOUTS = [
  'equal-grid',
  'featured-split',
  'horizontal-rail',
  'compact-index',
  'bento-grid',
  'icon-matrix',
  'data-rows',
  'uniform-grid',
  'vertical-rail',
  'horizontal-flow',
  'checklist',
] as const;
export const UI_HOME_CARDS = [
  'action-panel',
  'data-panel',
  'editorial',
  'image-led',
  'compact-row',
  'icon-card',
] as const;
export const UI_HOME_RHYTHMS = ['uniform', 'alternating', 'editorial'] as const;
export const UI_HOME_WIDTHS = ['narrow', 'standard', 'wide', 'full'] as const;
export const UI_HOME_HEADERS = ['left', 'centered', 'split', 'inline'] as const;
export const UI_HOME_EMPHASIS = ['primary', 'normal', 'quiet'] as const;

export type HomepageBlockRecipe = {
  section: (typeof UI_SECTION_VARIANTS)[number];
  layout: (typeof UI_HOME_LAYOUTS)[number];
  card?: (typeof UI_HOME_CARDS)[number];
  asideCard?: (typeof UI_HOME_CARDS)[number];
  featuredItem?: string;
  width?: (typeof UI_HOME_WIDTHS)[number];
  header?: (typeof UI_HOME_HEADERS)[number];
  density?: (typeof UI_DENSITIES)[number];
  emphasis?: (typeof UI_HOME_EMPHASIS)[number];
};

export type UIRecipe = {
  schemaVersion: 1;
  archetype: (typeof UI_ARCHETYPES)[number];
  theme: (typeof UI_THEMES)[number];
  hero: (typeof UI_HEROES)[number];
  navigation: (typeof UI_NAVIGATIONS)[number];
  guideCard: (typeof UI_GUIDE_CARDS)[number];
  categoryCard: (typeof UI_CATEGORY_CARDS)[number];
  articleLayout: (typeof UI_ARTICLE_LAYOUTS)[number];
  density: (typeof UI_DENSITIES)[number];
  shape: (typeof UI_SHAPES)[number];
  motion: (typeof UI_MOTIONS)[number];
  customBlocks: (typeof UI_CUSTOM_BLOCKS)[number][];
  homepage?: {
    defaultSection: (typeof UI_SECTION_VARIANTS)[number];
    defaultCollectionLayout: (typeof UI_HOME_LAYOUTS)[number];
    rhythm: (typeof UI_HOME_RHYTHMS)[number];
    blocks: Record<string, HomepageBlockRecipe>;
  };
  rationale?: string;
};

const allowed = <T extends readonly string[]>(
  values: T,
  value: unknown
): value is T[number] =>
  typeof value === 'string' && values.includes(value as T[number]);

function validateHomepage(value: unknown): UIRecipe['homepage'] {
  if (value === undefined) return undefined;
  if (!value || typeof value !== 'object')
    throw new Error('[ui-recipe] homepage must be an object');
  const homepage = value as Record<string, unknown>;
  if (!allowed(UI_SECTION_VARIANTS, homepage.defaultSection))
    throw new Error('[ui-recipe] unsupported homepage.defaultSection');
  if (!allowed(UI_HOME_LAYOUTS, homepage.defaultCollectionLayout))
    throw new Error('[ui-recipe] unsupported homepage.defaultCollectionLayout');
  if (!allowed(UI_HOME_RHYTHMS, homepage.rhythm))
    throw new Error('[ui-recipe] unsupported homepage.rhythm');
  if (
    !homepage.blocks ||
    typeof homepage.blocks !== 'object' ||
    Array.isArray(homepage.blocks)
  )
    throw new Error('[ui-recipe] homepage.blocks must be an object');
  for (const [id, raw] of Object.entries(
    homepage.blocks as Record<string, unknown>
  )) {
    if (!raw || typeof raw !== 'object')
      throw new Error(`[ui-recipe] homepage.blocks.${id} must be an object`);
    const block = raw as Record<string, unknown>;
    if (!allowed(UI_SECTION_VARIANTS, block.section))
      throw new Error(`[ui-recipe] unsupported homepage.blocks.${id}.section`);
    if (!allowed(UI_HOME_LAYOUTS, block.layout))
      throw new Error(`[ui-recipe] unsupported homepage.blocks.${id}.layout`);
    if (block.card !== undefined && !allowed(UI_HOME_CARDS, block.card))
      throw new Error(`[ui-recipe] unsupported homepage.blocks.${id}.card`);
    if (
      block.asideCard !== undefined &&
      !allowed(UI_HOME_CARDS, block.asideCard)
    )
      throw new Error(
        `[ui-recipe] unsupported homepage.blocks.${id}.asideCard`
      );
    if (
      block.featuredItem !== undefined &&
      typeof block.featuredItem !== 'string'
    )
      throw new Error(
        `[ui-recipe] homepage.blocks.${id}.featuredItem must be a string`
      );
    if (block.width !== undefined && !allowed(UI_HOME_WIDTHS, block.width))
      throw new Error(`[ui-recipe] unsupported homepage.blocks.${id}.width`);
    if (block.header !== undefined && !allowed(UI_HOME_HEADERS, block.header))
      throw new Error(`[ui-recipe] unsupported homepage.blocks.${id}.header`);
    if (block.density !== undefined && !allowed(UI_DENSITIES, block.density))
      throw new Error(`[ui-recipe] unsupported homepage.blocks.${id}.density`);
    if (
      block.emphasis !== undefined &&
      !allowed(UI_HOME_EMPHASIS, block.emphasis)
    )
      throw new Error(`[ui-recipe] unsupported homepage.blocks.${id}.emphasis`);
  }
  return homepage as UIRecipe['homepage'];
}

export function validateUIRecipe(value: unknown): UIRecipe {
  if (!value || typeof value !== 'object')
    throw new Error('[ui-recipe] expected an object');
  const recipe = value as Record<string, unknown>;
  const checks: [string, readonly string[]][] = [
    ['archetype', UI_ARCHETYPES],
    ['theme', UI_THEMES],
    ['hero', UI_HEROES],
    ['navigation', UI_NAVIGATIONS],
    ['guideCard', UI_GUIDE_CARDS],
    ['categoryCard', UI_CATEGORY_CARDS],
    ['articleLayout', UI_ARTICLE_LAYOUTS],
    ['density', UI_DENSITIES],
    ['shape', UI_SHAPES],
    ['motion', UI_MOTIONS],
  ];
  if (recipe.schemaVersion !== 1)
    throw new Error('[ui-recipe] schemaVersion must equal 1');
  for (const [key, values] of checks)
    if (!allowed(values, recipe[key]))
      throw new Error(`[ui-recipe] unsupported ${key}: ${String(recipe[key])}`);
  if (
    !Array.isArray(recipe.customBlocks) ||
    recipe.customBlocks.some((item) => !allowed(UI_CUSTOM_BLOCKS, item))
  )
    throw new Error('[ui-recipe] customBlocks contains an unsupported value');
  validateHomepage(recipe.homepage);
  return recipe as UIRecipe;
}

/** Adaptive UI contract. The template ships a safe default. */
export const uiRecipe = validateUIRecipe(uiRecipeJson);

export function homeBlockRecipe(id: string, type: string): HomepageBlockRecipe {
  const configured = uiRecipe.homepage?.blocks[id];
  if (configured) return configured;
  const fallbackLayout =
    type === 'step-by-step'
      ? 'vertical-rail'
      : type === 'start-cards'
        ? 'equal-grid'
        : 'uniform-grid';
  return {
    section: uiRecipe.homepage?.defaultSection ?? 'plain',
    layout: fallbackLayout,
    card: type === 'start-cards' ? 'action-panel' : 'data-panel',
    width: 'standard',
    header: 'split',
    density: uiRecipe.density,
    emphasis: 'normal',
  };
}

export const uiDataAttributes = {
  'data-ui-archetype': uiRecipe.archetype,
  'data-ui-theme': uiRecipe.theme,
  'data-ui-navigation': uiRecipe.navigation,
  'data-ui-guide-card': uiRecipe.guideCard,
  'data-ui-category-card': uiRecipe.categoryCard,
  'data-ui-article-layout': uiRecipe.articleLayout,
  'data-ui-density': uiRecipe.density,
  'data-ui-shape': uiRecipe.shape,
  'data-ui-motion': uiRecipe.motion,
  'data-ui-home-rhythm': uiRecipe.homepage?.rhythm ?? 'uniform',
} as const;

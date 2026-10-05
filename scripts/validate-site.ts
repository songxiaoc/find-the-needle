import { createHash } from 'crypto';
import fs from 'fs';
import path from 'path';

import { envConfigs } from '../src/config';
import { siteAssets } from '../src/config/assets';
import { gameConfig } from '../src/config/game';
import { GUIDE_CATEGORIES, GUIDE_CATEGORY_ICONS } from '../src/config/guides';
import { getAllGuides } from '../src/config/guides-content';
import { HOME_BLOCKS, HOME_BLOCKS_I18N } from '../src/config/homepage';
import {
  defaultLocale,
  locales,
  supportedLocaleCodes,
} from '../src/config/locale';
import { readCommonMessages } from '../src/config/locale/message-schema';
import { PUBLIC_PATHS } from '../src/config/locale/routes';
import { assertI18nWiring } from '../src/config/locale/wiring';
import { uiRecipe, validateUIRecipe } from '../src/config/ui';
import siteManifest from '../src/generated/site-manifest.json';
import contract from '../template-contract.json';

const root = process.cwd();
const errors: string[] = [];
let checks = 0;

function scanGuideFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  const files: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const filePath = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...scanGuideFiles(filePath));
    else if (entry.name.endsWith('.md') || entry.name.endsWith('.mdx')) {
      files.push(filePath);
    }
  }
  return files;
}

function check(condition: unknown, message: string): void {
  checks += 1;
  if (!condition) errors.push(message);
}

function read(relative: string): string {
  return fs.readFileSync(path.join(root, relative), 'utf8');
}

function publicFile(urlPath: string): string {
  return path.join(root, 'public', urlPath.replace(/^\//, ''));
}

function canonicalJson(value: unknown): string {
  if (Array.isArray(value)) {
    return `[${value.map(canonicalJson).join(',')}]`;
  }
  if (value && typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>).sort(
      ([left], [right]) => left.localeCompare(right)
    );
    return `{${entries
      .map(([key, item]) => `${JSON.stringify(key)}:${canonicalJson(item)}`)
      .join(',')}}`;
  }
  return JSON.stringify(value);
}

function jsonSha256(value: unknown): string {
  return createHash('sha256').update(canonicalJson(value)).digest('hex');
}

check(
  contract.schemaVersion === 1,
  'template contract schemaVersion must equal 1'
);
check(
  siteManifest.templateContractVersion === contract.templateContractVersion,
  'site manifest and template contract versions differ'
);
check(
  siteManifest.templateContractSha256 === jsonSha256(contract),
  'site manifest template contract hash drift'
);
for (const capability of siteManifest.requiredCapabilities) {
  check(
    contract.capabilities.includes(capability),
    `site requires unsupported capability: ${capability}`
  );
}
const expectedManagedFiles = [
  ...new Set(
    contract.managedFiles.flatMap((pattern) =>
      pattern.includes('*')
        ? locales.map((locale) => pattern.replace('*', locale))
        : [pattern]
    )
  ),
].sort();
check(
  JSON.stringify(siteManifest.managedFiles) ===
    JSON.stringify(expectedManagedFiles),
  'site manifest managed files differ from template contract'
);
for (const relative of expectedManagedFiles) {
  check(
    fs.existsSync(path.join(root, relative)),
    `managed file is missing: ${relative}`
  );
}
check(locales.includes(defaultLocale), 'default locale must be active');
check(
  contract.supported.defaultLocales.includes(defaultLocale),
  'default locale is unsupported by the template contract'
);
check(
  defaultLocale === siteManifest.defaultLocale,
  'generated default locale drift'
);
check(
  JSON.stringify(locales) === JSON.stringify(siteManifest.locales),
  'generated active locale list drift'
);
for (const locale of locales) {
  check(
    supportedLocaleCodes.includes(
      locale as (typeof supportedLocaleCodes)[number]
    ),
    `unsupported active locale: ${locale}`
  );
  try {
    readCommonMessages(
      path.join(root, 'src/config/locale/messages', locale, 'common.json')
    );
    checks += 1;
  } catch (error) {
    errors.push(error instanceof Error ? error.message : String(error));
  }
}

check(
  !/^https?:\/\//.test(gameConfig.domain),
  'gameConfig.domain must not include a scheme'
);
check(
  gameConfig.origin === `https://${gameConfig.domain}`,
  'gameConfig.origin must derive from domain'
);
check(
  /^\d{4}-\d{2}-\d{2}$/.test(gameConfig.eaLaunchDate),
  'release date must use YYYY-MM-DD'
);
check(
  new Set(gameConfig.nav.map((item) => item.href)).size ===
    gameConfig.nav.length,
  'navigation hrefs must be unique'
);
check(
  new Set(GUIDE_CATEGORIES.map((category) => category.slug)).size ===
    GUIDE_CATEGORIES.length,
  'guide category slugs must be unique'
);
check(
  JSON.stringify(Object.keys(GUIDE_CATEGORY_ICONS).sort()) ===
    JSON.stringify([...contract.supported.categoryIcons].sort()),
  'guide category icon registry differs from template contract'
);

const categorySlugs = new Set(
  GUIDE_CATEGORIES.map((category) => category.slug)
);
for (const item of gameConfig.nav) {
  const match = item.href.match(/^\/guides\/([^/]+)$/);
  if (match)
    check(
      categorySlugs.has(match[1]),
      `navigation targets unknown category: ${item.href}`
    );
}

const contentRoot = path.join(root, 'content/guides');
try {
  assertI18nWiring(scanGuideFiles(contentRoot));
  checks += 1;
} catch (error) {
  errors.push(error instanceof Error ? error.message : String(error));
}
if (fs.existsSync(contentRoot)) {
  for (const entry of fs.readdirSync(contentRoot, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      const categoryDir = path.join(contentRoot, entry.name);
      const hasPublishedFiles = fs
        .readdirSync(categoryDir)
        .some((name) => name.endsWith('.md') || name.endsWith('.mdx'));
      if (hasPublishedFiles) {
        check(
          categorySlugs.has(entry.name),
          `content directory is not registered: ${entry.name}`
        );
      }
    }
  }
}
const guidesByLocale = new Map(
  locales.map((locale) => [locale, getAllGuides(locale)] as const)
);
const defaultGuides = guidesByLocale.get(defaultLocale) ?? [];
for (const item of gameConfig.nav) {
  const match = item.href.match(/^\/guides\/([^/]+)$/);
  if (match) {
    check(
      defaultGuides.some((guide) => guide.category === match[1]),
      `navigation category has no published guides: ${match[1]}`
    );
  }
}

const knownRoutes = new Set([
  ...PUBLIC_PATHS,
  '/',
  '/guides',
  '/about',
  '/contact',
  '/faq',
  '/database',
  '/privacy-policy',
  '/system-requirements',
  '/terms-of-service',
  '/troubleshooting',
  ...GUIDE_CATEGORIES.map((category) => `/guides/${category.slug}`),
  ...defaultGuides.map((guide) => guide.href),
]);
function blockHrefs(block: (typeof HOME_BLOCKS)[number]): string[] {
  switch (block.type) {
    case 'hero':
    case 'final-cta':
      return block.ctas.map((cta) => cta.href);
    case 'start-cards':
      return block.items.map((item) => item.href);
    case 'about':
      return block.cta ? [block.cta.href] : [];
    case 'code-cards':
    case 'tier-grid':
    case 'step-by-step':
    case 'card-list':
      return block.href ? [block.href] : [];
    default:
      return [];
  }
}
for (const block of HOME_BLOCKS) {
  for (const href of blockHrefs(block)) {
    if (href.startsWith('/')) {
      check(
        knownRoutes.has(href),
        `homepage block ${block.id} targets unknown route: ${href}`
      );
    }
  }
}

const ids = HOME_BLOCKS.map((block) => block.id);
check(new Set(ids).size === ids.length, 'homepage block ids must be unique');
for (const locale of locales) {
  if (locale !== defaultLocale) {
    check(
      Boolean(HOME_BLOCKS_I18N[locale]),
      `active locale lacks homepage blocks: ${locale}`
    );
  }
}

const activeThemeCss = read('src/config/style/active-theme.css');
const activeFonts = read('src/components/site/active-fonts.ts');
const cssTheme = activeThemeCss.match(/themes\/([^/]+)\/tokens\.css/)?.[1];
const fontTheme = activeFonts.match(/themes\/([^/]+)\/fonts/)?.[1];
check(Boolean(cssTheme), 'active CSS theme selector is invalid');
check(cssTheme === fontTheme, 'active CSS and font themes differ');
check(
  cssTheme === siteManifest.theme,
  'active theme differs from site manifest'
);
check(cssTheme === uiRecipe.theme, 'active theme differs from UI recipe');
try {
  validateUIRecipe(uiRecipe);
  checks += 1;
} catch (error) {
  errors.push(error instanceof Error ? error.message : String(error));
}

const brandCss = read('src/components/site/brand.css');
for (const variable of [
  '--brand-primary',
  '--brand-primary-dim',
  '--brand-on-primary',
]) {
  const matches = brandCss.match(new RegExp(`${variable}\\s*:`, 'g')) ?? [];
  check(
    matches.length === 1,
    `${variable} must appear exactly once in brand.css`
  );
}
for (const theme of contract.supported.themes) {
  const tokens = read(`src/components/site/themes/${theme}/tokens.css`);
  check(
    tokens.includes('--site-primary: var(--brand-primary)'),
    `${theme} must derive --site-primary from brand.css`
  );
}

for (const asset of [
  siteAssets.brand.logo,
  siteAssets.brand.favicon,
  siteAssets.brand.ogImage,
]) {
  check(
    fs.existsSync(publicFile(asset)),
    `asset manifest file is missing: ${asset}`
  );
}
check(
  envConfigs.app_logo ===
    (process.env.NEXT_PUBLIC_APP_LOGO ?? siteAssets.brand.logo),
  'runtime logo differs from asset manifest'
);
check(
  envConfigs.app_favicon ===
    (process.env.NEXT_PUBLIC_APP_FAVICON ?? siteAssets.brand.favicon),
  'runtime favicon differs from asset manifest'
);
check(
  envConfigs.app_preview_image ===
    (process.env.NEXT_PUBLIC_APP_PREVIEW_IMAGE ?? siteAssets.brand.ogImage),
  'runtime preview image differs from asset manifest'
);
if (gameConfig.heroStyle === 'video-center') {
  check(
    Boolean(gameConfig.trailerUrl),
    'video-center hero requires trailerUrl'
  );
}
if (gameConfig.heroStyle === 'cover-split') {
  check(Boolean(gameConfig.coverImage), 'cover-split hero requires coverImage');
  if (gameConfig.coverImage?.startsWith('/')) {
    check(
      fs.existsSync(publicFile(gameConfig.coverImage)),
      `cover image is missing: ${gameConfig.coverImage}`
    );
  }
}
if (gameConfig.heroStyle === 'gameplay-panel') {
  check(
    Boolean(gameConfig.gameplayImage),
    'gameplay-panel hero requires gameplayImage'
  );
  if (gameConfig.gameplayImage?.startsWith('/')) {
    check(
      fs.existsSync(publicFile(gameConfig.gameplayImage)),
      `gameplay image is missing: ${gameConfig.gameplayImage}`
    );
  }
}

if (siteManifest.planSha256) {
  check(
    /^[a-f0-9]{64}$/.test(siteManifest.planSha256),
    'planSha256 must be a SHA-256 hex digest'
  );
  const placeholderFiles = [
    'src/generated/game-config.ts',
    'src/generated/homepage.ts',
    'src/generated/visual-profile.json',
  ];
  for (const relative of placeholderFiles) {
    const text = read(relative);
    check(
      !/Example Game|REPLACE_WITH_OFFICIAL_SOURCE|Replace this/.test(text),
      `generated site retains placeholder in ${relative}`
    );
  }
}

if (errors.length > 0) {
  for (const error of errors) console.error(`SITE_VALIDATE_ERROR ${error}`);
  console.error(
    `SITE_VALIDATE_DONE status=failed checks=${checks} errors=${errors.length}`
  );
  process.exit(1);
}

console.log(`SITE_VALIDATE_DONE status=ok checks=${checks} errors=0`);

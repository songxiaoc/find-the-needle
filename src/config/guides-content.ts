/**
 * Content layer for guides — direct filesystem scanner.
 *
 *   content/guides/bosses/gelum.mdx    → slugs ['bosses', 'gelum'], locale 'en'
 *   content/guides/bosses/gelum.zh.mdx → slugs ['bosses', 'gelum'], locale 'zh'
 *
 * All functions use fs at call time. They are only invoked from:
 *   - generateStaticParams (build time)
 *   - generateMetadata     (build time with force-static)
 *   - page components      (build time with force-static)
 *
 * Cloudflare Workers never call these at runtime — the site is fully static.
 */
import fs from 'fs';
import path from 'path';
import GithubSlugger from 'github-slugger';
import matter from 'gray-matter';

import { GUIDE_CATEGORIES, type GuideCategory } from '@/config/guides';
import { localeOfFile, stripLocaleSuffix } from '@/config/locale/wiring';

const CONTENT_DIR = path.join(process.cwd(), 'content/guides');

export type GuideFrontmatter = {
  title: string;
  description: string;
  date: string;
  lastModified?: string;
  badge?: string;
  summary?: string;
  image?: string;
  [key: string]: unknown;
};

export type GuideItem = {
  /** Path segments, e.g. ['bosses', 'gelum']. */
  slugs: string[];
  /** slugs joined, e.g. 'bosses/gelum'. */
  slug: string;
  /** Route, e.g. '/guides/bosses/gelum'. */
  href: string;
  /** First slug segment. */
  category: string;
  title: string;
  description: string;
  /** ISO yyyy-mm-dd from frontmatter. */
  date: string;
  lastModified?: string;
  badge?: string;
  summary?: string;
  image?: string;
};

export type GuideCategoryGroup = GuideCategory & {
  count: number;
  items: GuideItem[];
};

export type TocItem = { id: string; label: string; depth: number };

// ── Internal helpers ──────────────────────────────────────────────────────────

function readMdx(filePath: string): {
  data: GuideFrontmatter;
  content: string;
} {
  const raw = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(raw);
  return { data: data as GuideFrontmatter, content };
}

/** Detect locale from filename: "gelum.zh.mdx" → "zh", "gelum.mdx" → "en". */
// localeOfFile / stripLocaleSuffix come from @/config/locale/wiring so the
// recognised codes stay in one place (SUPPORTED_LOCALES).

/** Absolute file path → slug segments (locale-stripped). */
function slugsOf(filePath: string): string[] {
  const rel = path.relative(CONTENT_DIR, filePath);
  const parts = rel.replace(/\.(mdx|md)$/, '').split(path.sep);
  const last = stripLocaleSuffix(parts[parts.length - 1]);
  return [...parts.slice(0, -1), last];
}

function scanDir(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  const result: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) result.push(...scanDir(full));
    else if (/\.(mdx|md)$/.test(entry.name)) result.push(full);
  }
  return result;
}

function toItem(
  filePath: string,
  slugs: string[],
  data: GuideFrontmatter
): GuideItem {
  void filePath;
  const slug = slugs.join('/');
  return {
    slugs,
    slug,
    href: `/guides/${slug}`,
    category: slugs[0] ?? '',
    title: data.title ?? '',
    description: data.description ?? '',
    date: data.date ?? '',
    lastModified: data.lastModified,
    badge: data.badge,
    summary: data.summary,
    image: data.image,
  };
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Every guide article, newest first. Files inside category folders only
 * (slugs.length >= 2). Locale files override the default file when present.
 */
export function getAllGuides(locale = 'en'): GuideItem[] {
  const files = scanDir(CONTENT_DIR);

  // key → { defaultFile, localeFiles }
  const byKey = new Map<string, { def?: string; loc: Map<string, string> }>();

  for (const file of files) {
    const slugs = slugsOf(file);
    if (slugs.length < 2) continue;
    const key = slugs.join('/');
    const fileLocale = localeOfFile(file);

    if (!byKey.has(key)) byKey.set(key, { loc: new Map() });
    const entry = byKey.get(key)!;

    if (fileLocale === 'en') entry.def = file;
    else entry.loc.set(fileLocale, file);
  }

  const items: GuideItem[] = [];
  for (const entry of byKey.values()) {
    const file = entry.loc.get(locale) ?? entry.def;
    if (!file) continue;
    const slugs = slugsOf(file);
    const { data } = readMdx(file);
    items.push(toItem(file, slugs, data));
  }

  return items.sort((a, b) => b.date.localeCompare(a.date));
}

export function getGuidesByCategory(
  category: string,
  locale = 'en'
): GuideItem[] {
  return getAllGuides(locale).filter((it) => it.category === category);
}

/**
 * Raw MDX frontmatter + content string for an article.
 * Tries locale-specific file first, falls back to default.
 */
export function getGuidePage(
  slugs: string[],
  locale = 'en'
): { data: GuideFrontmatter; content: string; url: string } | null {
  const base = path.join(CONTENT_DIR, ...slugs);
  const candidates = [
    `${base}.${locale}.mdx`,
    `${base}.${locale}.md`,
    `${base}.mdx`,
    `${base}.md`,
  ];
  for (const filePath of candidates) {
    if (fs.existsSync(filePath)) {
      const { data, content } = readMdx(filePath);
      return { data, content, url: `/guides/${slugs.join('/')}` };
    }
  }
  return null;
}

/** Same-category siblings, excluding the current article. */
export function getRelatedGuides(
  item: GuideItem,
  locale = 'en',
  limit = 4
): GuideItem[] {
  return getGuidesByCategory(item.category, locale)
    .filter((g) => g.slug !== item.slug)
    .slice(0, limit);
}

/**
 * Categories that have at least one published article, in registry order.
 * Empty categories are dropped so navigation never shows a dead link.
 */
export function getGuideCategories(locale = 'en'): GuideCategoryGroup[] {
  const all = getAllGuides(locale);
  return GUIDE_CATEGORIES.map((cat) => ({
    ...cat,
    items: all.filter((it) => it.category === cat.slug),
  }))
    .filter((cat) => cat.items.length > 0)
    .map((cat) => ({ ...cat, count: cat.items.length }));
}

/**
 * Extract headings from raw MDX content for a TOC.
 * Uses GithubSlugger to match the IDs injected by rehype-slug at compile time.
 */
export function extractToc(content: string): TocItem[] {
  const slugger = new GithubSlugger();
  const items: TocItem[] = [];
  for (const line of content.split('\n')) {
    const m = line.match(/^(#{1,4})\s+(.+?)(?:\s+#+)?$/);
    if (!m) continue;
    const depth = m[1].length;
    const label = m[2]
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // links
      .replace(/[*_`~]/g, '') // inline formatting
      .trim();
    items.push({ id: slugger.slug(label), label, depth });
  }
  return items;
}

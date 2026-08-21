/**
 * Convert competitor-style MDX metadata into fumadocs YAML frontmatter.
 *
 * Some MDX content (e.g. ported from @next/mdx sites) declares metadata as a JS
 * export at the top of the file:
 *
 *   export const metadata = {
 *     title: "Foo",
 *     description: "Bar",
 *     category: "bosses",
 *     date: "2026-06-11",
 *   }
 *
 * fumadocs-mdx reads YAML frontmatter instead:
 *
 *   ---
 *   title: 'Foo'
 *   description: 'Bar'
 *   date: '2026-06-11'
 *   ---
 *
 * This script rewrites the former into the latter. It DROPS the `category` field
 * on purpose — in this template category is derived from the folder name
 * (content/guides/<category>/...), so keeping it in frontmatter would be a second
 * source of truth that drifts. See source.config.ts.
 *
 * Usage (run from repo root):
 *   pnpm tsx scripts/mdx-metadata-to-frontmatter.ts            # dry-run, default target content/guides
 *   pnpm tsx scripts/mdx-metadata-to-frontmatter.ts --write    # apply changes
 *   pnpm tsx scripts/mdx-metadata-to-frontmatter.ts path/to/dir-or-file --write
 *
 * Safe to re-run: files that already start with `---` frontmatter are skipped.
 */
import fs from 'node:fs';
import path from 'node:path';

// Frontmatter fields the guides schema understands (source.config.ts). `category`
// is intentionally absent — it is folder-derived and dropped during conversion.
const KNOWN_FIELDS = [
  'title',
  'description',
  'date',
  'lastModified',
  'badge',
  'summary',
  'image',
] as const;

type Result =
  | {
      file: string;
      status: 'converted' | 'would-convert';
      dropped: string[];
      unknown: string[];
    }
  | { file: string; status: 'skipped'; reason: string };

/** Collect .mdx files under a path (file or directory, recursive). */
function collectMdx(target: string): string[] {
  const stat = fs.statSync(target);
  if (stat.isFile()) return target.endsWith('.mdx') ? [target] : [];
  return fs.readdirSync(target, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(target, entry.name);
    if (entry.isDirectory()) return collectMdx(full);
    return entry.name.endsWith('.mdx') ? [full] : [];
  });
}

/**
 * Extract the `export const metadata = { ... }` object literal by brace-counting
 * (handles nested braces and trailing commas). Returns the JS object text and the
 * full matched span, or null if not present.
 */
function extractMetadataBlock(
  source: string
): { objectText: string; start: number; end: number } | null {
  const match = source.match(/export\s+const\s+metadata\s*=\s*\{/);
  if (!match || match.index === undefined) return null;

  const braceStart = source.indexOf('{', match.index);
  let depth = 0;
  for (let i = braceStart; i < source.length; i++) {
    const ch = source[i];
    if (ch === '{') depth++;
    else if (ch === '}') {
      depth--;
      if (depth === 0) {
        // Swallow an optional trailing semicolon and following newlines.
        let end = i + 1;
        if (source[end] === ';') end++;
        while (source[end] === '\n' || source[end] === '\r') end++;
        return {
          objectText: source.slice(braceStart, i + 1),
          start: match.index,
          end,
        };
      }
    }
  }
  return null; // unbalanced braces — leave the file untouched
}

/** Quote a scalar as a YAML single-quoted string (escape ' by doubling). */
function yamlQuote(value: unknown): string {
  return `'${String(value).replace(/'/g, "''")}'`;
}

function toFrontmatter(meta: Record<string, unknown>): {
  yaml: string;
  dropped: string[];
  unknown: string[];
} {
  const dropped: string[] = [];
  const unknown: string[] = [];
  const lines: string[] = ['---'];

  // Emit known fields in schema order for stable output.
  for (const key of KNOWN_FIELDS) {
    if (meta[key] === undefined) continue;
    lines.push(`${key}: ${yamlQuote(meta[key])}`);
  }
  // Audit the rest.
  for (const key of Object.keys(meta)) {
    if (key === 'category') dropped.push(key);
    else if (!KNOWN_FIELDS.includes(key as (typeof KNOWN_FIELDS)[number]))
      unknown.push(key);
  }
  lines.push('---', '');
  return { yaml: lines.join('\n'), dropped, unknown };
}

function convertFile(file: string, write: boolean): Result {
  const source = fs.readFileSync(file, 'utf-8');

  if (source.trimStart().startsWith('---')) {
    return { file, status: 'skipped', reason: 'already has frontmatter' };
  }
  const block = extractMetadataBlock(source);
  if (!block) {
    return {
      file,
      status: 'skipped',
      reason: 'no `export const metadata` block',
    };
  }

  let meta: Record<string, unknown>;
  try {
    // Local content only. Evaluate the object literal (handles trailing commas,
    // single/double quotes) — JSON.parse would reject valid JS object syntax.
    meta = new Function(`return (${block.objectText})`)() as Record<
      string,
      unknown
    >;
  } catch (err) {
    return {
      file,
      status: 'skipped',
      reason: `could not parse metadata: ${(err as Error).message}`,
    };
  }

  const { yaml, dropped, unknown } = toFrontmatter(meta);
  const rest = source.slice(0, block.start) + source.slice(block.end);
  const next = yaml + rest.trimStart();

  if (write) fs.writeFileSync(file, next, 'utf-8');
  return {
    file,
    status: write ? 'converted' : 'would-convert',
    dropped,
    unknown,
  };
}

function main() {
  const args = process.argv.slice(2);
  const write = args.includes('--write');
  const targets = args.filter((a) => !a.startsWith('--'));
  const roots = targets.length > 0 ? targets : ['content/guides'];

  const files = roots.flatMap((root) => {
    if (!fs.existsSync(root)) {
      console.warn(`! target not found: ${root}`);
      return [];
    }
    return collectMdx(root);
  });

  if (files.length === 0) {
    console.log('No .mdx files found.');
    return;
  }

  let changed = 0;
  for (const file of files) {
    const r = convertFile(file, write);
    if (r.status === 'skipped') {
      console.log(`  skip   ${r.file}  (${r.reason})`);
      continue;
    }
    changed++;
    const notes: string[] = [];
    if (r.dropped.length) notes.push(`dropped ${r.dropped.join(', ')}`);
    if (r.unknown.length)
      notes.push(`UNKNOWN (not in schema): ${r.unknown.join(', ')}`);
    const label = r.status === 'converted' ? 'write ' : 'would ';
    console.log(
      `  ${label}  ${r.file}${notes.length ? `  [${notes.join('; ')}]` : ''}`
    );
  }

  console.log(
    `\n${changed} file(s) ${write ? 'converted' : 'to convert'}${write ? '' : ' — re-run with --write to apply'}.`
  );
}

main();

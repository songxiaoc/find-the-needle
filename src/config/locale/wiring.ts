import fs from 'fs';
import path from 'path';

import {
  defaultLocale,
  locales,
  supportedLocaleCodes,
  type SupportedLocale,
} from '.';
import { readCommonMessages } from './message-schema';

const MESSAGES_DIR = path.join(process.cwd(), 'src/config/locale/messages');

/** Locale suffix on a content filename: `gelum.es.mdx` → `es`. */
export function localeOfFile(filePath: string): string {
  const base = path.basename(filePath, path.extname(filePath));
  const parts = base.split('.');
  const last = parts.at(-1);
  if (
    parts.length > 1 &&
    last &&
    supportedLocaleCodes.includes(last as SupportedLocale)
  ) {
    return last;
  }
  return 'en';
}

export function stripLocaleSuffix(name: string): string {
  for (const code of supportedLocaleCodes) {
    if (name.endsWith(`.${code}`)) return name.slice(0, -(code.length + 1));
  }
  return name;
}

let verified = false;

/** Build-time, idempotent consistency check used by the filesystem content layer. */
export function assertI18nWiring(contentFiles: readonly string[]): void {
  if (verified) return;

  const active = new Set(locales);
  const supported = new Set<string>(supportedLocaleCodes);
  const problems: string[] = [];

  if (!active.has(defaultLocale)) {
    problems.push(`  · default locale "${defaultLocale}" is not active.`);
  }
  if (defaultLocale !== 'en') {
    problems.push(
      `  · default locale "${defaultLocale}" is unsupported by the current unsuffixed-content contract; use "en".`
    );
  }

  for (const locale of locales) {
    if (!supported.has(locale)) {
      problems.push(
        `  · active locale "${locale}" is not in SUPPORTED_LOCALES.`
      );
      continue;
    }
    const messagePath = path.join(MESSAGES_DIR, locale, 'common.json');
    if (!fs.existsSync(messagePath)) {
      problems.push(
        `  · locale "${locale}" is active but ${path.relative(process.cwd(), messagePath)} is missing.`
      );
      continue;
    }
    try {
      readCommonMessages(messagePath);
    } catch (error) {
      problems.push(
        `  · ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  const byArticle = new Map<string, Set<string>>();
  for (const file of contentFiles) {
    const locale = localeOfFile(file);
    if (!active.has(locale)) {
      problems.push(
        `  · translated content ${path.relative(process.cwd(), file)} uses inactive locale "${locale}".`
      );
    }
    const extension = path.extname(file);
    const stem = path.basename(file, extension);
    const key = path.join(path.dirname(file), stripLocaleSuffix(stem));
    const present = byArticle.get(key) ?? new Set<string>();
    present.add(locale);
    byArticle.set(key, present);
  }

  if (locales.length > 1) {
    for (const [article, present] of byArticle) {
      const missing = locales.filter((locale) => !present.has(locale));
      if (missing.length > 0) {
        problems.push(
          `  · ${path.relative(process.cwd(), article)} is missing active locale variant(s): ${missing.join(', ')}.`
        );
      }
    }
  }

  if (problems.length > 0) {
    throw new Error(
      `[i18n] locale wiring is inconsistent:\n\n${problems.join('\n')}\n`
    );
  }
  verified = true;
}

export type { SupportedLocale };

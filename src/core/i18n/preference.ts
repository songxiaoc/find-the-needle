import { locales } from '@/config/locale';

const PREFERENCE_KEY = 'find-the-needle-locale-v1';
const DISMISSED_PREFIX = 'find-the-needle-locale-dismissed-v1:';
const DAY_MS = 24 * 60 * 60 * 1000;
export const LOCALE_PREFERENCE_DAYS = 365;
export const LOCALE_DISMISSAL_DAYS = 180;

function read(key: string): string | null {
  try {
    const value = window.localStorage.getItem(key);
    if (!value) return null;
    const stored = JSON.parse(value) as { locale?: string; expiresAt?: number };
    if (
      !stored.locale ||
      !locales.includes(stored.locale) ||
      !stored.expiresAt ||
      stored.expiresAt <= Date.now()
    ) {
      window.localStorage.removeItem(key);
      return null;
    }
    return stored.locale;
  } catch {
    return null;
  }
}

function write(key: string, locale: string, days: number) {
  try {
    window.localStorage.setItem(
      key,
      JSON.stringify({ locale, expiresAt: Date.now() + days * DAY_MS })
    );
  } catch {
    // Private browsing can deny storage; language links still work normally.
  }
}

export function getRememberedLocale() {
  return read(PREFERENCE_KEY);
}
export function rememberLocale(locale: string) {
  write(PREFERENCE_KEY, locale, LOCALE_PREFERENCE_DAYS);
}
export function isLocalePromptDismissed(locale: string) {
  return read(`${DISMISSED_PREFIX}${locale}`) !== null;
}
export function dismissLocalePrompt(locale: string) {
  write(`${DISMISSED_PREFIX}${locale}`, locale, LOCALE_DISMISSAL_DAYS);
}

import { locales } from '.';

export const COUNTRY_LOCALES: Readonly<Record<string, string>> = {
  AT: 'de',
  DE: 'de',
  LI: 'de',
  FR: 'fr',
  MC: 'fr',
  ES: 'es',
  RU: 'ru',
};

export function browserLocaleSuggestion(
  languages: readonly string[],
  currentLocale: string
): string | null {
  const preferred = languages
    .map((language) => language.toLowerCase().split('-')[0])
    .find((locale) => locales.includes(locale));
  return preferred && preferred !== currentLocale ? preferred : null;
}

export function countryLocaleSuggestion(
  country?: string | null
): string | null {
  const locale = country ? COUNTRY_LOCALES[country.toUpperCase()] : undefined;
  return locale && locales.includes(locale) ? locale : null;
}

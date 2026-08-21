import { getRequestConfig } from 'next-intl/server';

import {
  defaultLocale,
  localeAliases,
  localeMessagesPaths,
} from '@/config/locale';

import { routing } from './config';

/** Active publication locales fail loudly instead of serving default-language copy. */
export async function loadMessages(
  namespace: string,
  locale: string = defaultLocale
) {
  try {
    const messages = await import(
      `../../config/locale/messages/${locale}/${namespace}.json`
    );
    return messages.default;
  } catch (error) {
    throw new Error(
      `[i18n] Could not load ${namespace} messages for active locale "${locale}": ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const aliased = requested
    ? (localeAliases[requested] ?? requested)
    : undefined;
  const locale =
    aliased && routing.locales.includes(aliased as string)
      ? aliased
      : routing.defaultLocale;

  const allMessages = await Promise.all(
    localeMessagesPaths.map((namespace) => loadMessages(namespace, locale))
  );
  const messages: Record<string, unknown> = {};

  localeMessagesPaths.forEach((namespace, index) => {
    const keys = namespace.split('/');
    let current = messages;
    for (let i = 0; i < keys.length - 1; i += 1) {
      const key = keys[i];
      const child = current[key];
      if (!child || typeof child !== 'object' || Array.isArray(child)) {
        current[key] = {};
      }
      current = current[key] as Record<string, unknown>;
    }
    current[keys.at(-1)!] = allMessages[index];
  });

  return { locale, messages };
});

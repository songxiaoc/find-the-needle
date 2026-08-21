import {
  generatedDefaultLocale,
  generatedLocales,
} from '@/generated/site-locales';

/** Every locale the pipeline and filename convention support. */
export const SUPPORTED_LOCALES = {
  en: 'English',
  zh: '简体中文',
  ja: '日本語',
  ko: '한국어',
  de: 'Deutsch',
  fr: 'Français',
  es: 'Español',
  pt: 'Português',
  id: 'Bahasa Indonesia',
} as const;

export type SupportedLocale = keyof typeof SUPPORTED_LOCALES;

export const supportedLocaleCodes = Object.keys(
  SUPPORTED_LOCALES
) as SupportedLocale[];

/** Publication locales; routing continues to import this module. */
export const locales: string[] = [...generatedLocales];
export const defaultLocale: string = generatedDefaultLocale;

export const localeNames: Record<string, string> = Object.fromEntries(
  locales.map((code) => [
    code,
    SUPPORTED_LOCALES[code as SupportedLocale] ?? code.toUpperCase(),
  ])
);

/** Request aliases are not publication locales or content suffixes. */
export const localeAliases: Record<string, string> = {
  'zh-CN': 'zh',
  'zh-SG': 'zh',
  'pt-BR': 'pt',
};

export const localePrefix = 'as-needed';
export const localeDetection = false;
export const localeMessagesRootPath = '@/config/locale/messages';
export const localeMessagesPaths = ['common'];

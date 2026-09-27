'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

import { usePathname } from '@/core/i18n/navigation';
import {
  dismissLocalePrompt,
  getRememberedLocale,
  isLocalePromptDismissed,
} from '@/core/i18n/preference';
import { localeNames, locales } from '@/config/locale';
import { browserLocaleSuggestion } from '@/config/locale/suggestion';

import { LocaleLink } from './LocaleLink';

export function LanguagePrompt({ locale }: { locale: string }) {
  const pathname = usePathname();
  const t = useTranslations('common.languagePrompt');
  const [suggestion, setSuggestion] = useState<string | null>(null);

  useEffect(() => {
    setSuggestion(null);
    if (getRememberedLocale()) return;
    const languages = navigator.languages.length
      ? navigator.languages
      : [navigator.language];
    const preferred = languages
      .map((language) => language.toLowerCase().split('-')[0])
      .find((language) => locales.includes(language));
    const browserSuggestion = browserLocaleSuggestion(languages, locale);
    if (preferred) {
      if (browserSuggestion && !isLocalePromptDismissed(browserSuggestion))
        setSuggestion(browserSuggestion);
      return;
    }
    const controller = new AbortController();
    fetch('/api/locale-suggestion', {
      cache: 'no-store',
      signal: controller.signal,
    })
      .then((response) => (response.ok ? response.json() : null))
      .then((data: { suggestedLocale?: string } | null) => {
        const next = data?.suggestedLocale;
        if (
          next &&
          next !== locale &&
          locales.includes(next) &&
          !isLocalePromptDismissed(next)
        )
          setSuggestion(next);
      })
      .catch(() => undefined);
    return () => controller.abort();
  }, [locale]);

  if (!suggestion) return null;
  const dismiss = () => {
    dismissLocalePrompt(suggestion);
    setSuggestion(null);
  };
  return (
    <aside
      aria-live="polite"
      className="border-site-outline-strong bg-site-surface-container fixed right-4 bottom-4 z-[70] w-[min(360px,calc(100vw-2rem))] border p-5 shadow-2xl"
    >
      <button
        type="button"
        aria-label={t('close')}
        onClick={dismiss}
        className="text-site-outline hover:text-site-on-surface absolute top-3 right-3 h-8 w-8 text-xl"
      >
        ×
      </button>
      <p className="text-site-on-surface pr-8 text-lg font-bold">
        {t('title', { language: localeNames[suggestion] })}
      </p>
      <p className="text-site-on-surface-variant mt-2 text-sm leading-6">
        {t('description')}
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <LocaleLink
          href={pathname}
          locale={suggestion}
          onClick={() => setSuggestion(null)}
          className="bg-site-primary text-site-on-primary px-4 py-2 text-sm font-semibold"
        >
          {localeNames[suggestion]}
        </LocaleLink>
        <button
          type="button"
          onClick={dismiss}
          className="text-site-on-surface-variant hover:text-site-primary px-2 py-2 text-sm"
        >
          {t('dismiss')}
        </button>
      </div>
    </aside>
  );
}

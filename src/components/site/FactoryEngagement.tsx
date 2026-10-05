'use client';

import { useEffect } from 'react';
import { FACTORY_TOOL_PATHS } from '@/content/discovery-copy';
import { useLocale } from 'next-intl';

import { defaultLocale, locales } from '@/config/locale';

type TrackerWindow = Window & {
  gtag?: (
    command: string,
    name: string,
    parameters: Record<string, string>
  ) => void;
  plausible?: (
    name: string,
    options: { props: Record<string, string> }
  ) => void;
};

export function FactoryEngagement() {
  const locale = useLocale();
  useEffect(() => {
    const report = (name: string, props: Record<string, string>) => {
      const tracker = window as TrackerWindow;
      tracker.gtag?.('event', name, { ...props, language: locale });
      tracker.plausible?.(name, { props: { ...props, language: locale } });
    };
    const onClick = (event: MouseEvent) => {
      const anchor =
        event.target instanceof Element
          ? event.target.closest('a[href]')
          : null;
      if (!anchor) return;
      const target = new URL(
        anchor.getAttribute('href') ?? '',
        window.location.href
      );
      if (target.origin !== window.location.origin) return;
      const prefix = target.pathname.split('/')[1];
      const route =
        prefix !== defaultLocale && locales.includes(prefix)
          ? target.pathname.slice(prefix.length + 1) || '/'
          : target.pathname;
      if (route.startsWith('/database/'))
        report('database_link_click', { destination: route });
      if (route.startsWith('/tools/'))
        report('factory_tool_open', { destination: route });
    };
    const onToolUse = (event: Event) => {
      const detail = (event as CustomEvent<{ action?: string; tool?: string }>)
        .detail;
      if (
        !detail ||
        !FACTORY_TOOL_PATHS.some((path) => path === `/tools/${detail.tool}`) ||
        !/^[a-z_-]{1,48}$/.test(detail.action ?? '')
      )
        return;
      report('factory_tool_use', {
        tool: detail.tool!,
        action: detail.action!,
      });
    };
    document.addEventListener('click', onClick);
    document.addEventListener('factory-interaction', onToolUse);
    return () => {
      document.removeEventListener('click', onClick);
      document.removeEventListener('factory-interaction', onToolUse);
    };
  }, [locale]);
  return null;
}

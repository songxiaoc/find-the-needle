import type { ReactNode } from 'react';

import { siteProfile } from '@/config/site-profile';
import { uiRecipe } from '@/config/ui';

/**
 * Config-driven homepage/workspace shell. The public API stays stable so pages
 * do not need to change when a site switches structural preset.
 *
 *   editorial : centered reading/content column
 *   wiki      : fluid main column + fixed right rail
 *   database  : fixed left navigation + wide workspace
 *
 * Below `lg`, supporting navigation is available through MobileNav's drawer,
 * so the desktop rail is intentionally hidden instead of duplicated in flow.
 */
export function WikiShell({
  children,
  sidebar,
}: {
  children: ReactNode;
  sidebar: ReactNode;
}) {
  if (siteProfile.shellPreset === 'editorial') {
    return (
      <div
        data-shell-preset="editorial"
        className="mx-auto max-w-[960px] px-6 py-12 md:px-14 md:py-16"
      >
        <div className="min-w-0">{children}</div>
      </div>
    );
  }

  if (siteProfile.shellPreset === 'database') {
    return (
      <div
        data-shell-preset="database"
        className="mx-auto max-w-[1440px] px-6 py-12 md:px-14 md:py-16"
      >
        <div className="grid gap-10 lg:grid-cols-[260px_minmax(0,1fr)]">
          <aside className="hidden self-start lg:sticky lg:top-24 lg:block">
            {sidebar}
          </aside>
          <div className="min-w-0">{children}</div>
        </div>
      </div>
    );
  }

  if (uiRecipe.navigation === 'top-bar') {
    return (
      <div
        data-shell-preset="wiki"
        className="mx-auto max-w-[1180px] px-6 py-12 md:px-14 md:py-16"
      >
        <div className="min-w-0">{children}</div>
        <div className="mt-12">{sidebar}</div>
      </div>
    );
  }

  return (
    <div
      data-shell-preset="wiki"
      className="mx-auto max-w-[1440px] px-6 py-12 md:px-14 md:py-16"
    >
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0">{children}</div>
        <aside className="hidden self-start lg:sticky lg:top-24 lg:block">
          {sidebar}
        </aside>
      </div>
    </div>
  );
}

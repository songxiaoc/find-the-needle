'use client';

import type { ReactNode } from 'react';
import { ThemeProvider } from 'next-themes';

export function SiteThemeProvider({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      storageKey="find-needle-theme"
      themes={['light', 'dark']}
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  );
}

'use client';

import { useSyncExternalStore } from 'react';
import { getThemeCopy } from '@/content/theme-copy';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

const subscribe = () => () => {};

export function ThemeToggle({ locale = 'en' }: { locale?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );
  const copy = getThemeCopy(locale);
  const nextTheme = resolvedTheme === 'light' ? 'dark' : 'light';
  const label = mounted ? copy[nextTheme] : copy.toggle;

  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={() => setTheme(nextTheme)}
      className="site-control border-site-outline-variant text-site-on-surface-variant hover:border-site-primary hover:text-site-primary focus-visible:outline-site-primary inline-flex h-10 w-10 shrink-0 items-center justify-center border transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
    >
      <Sun aria-hidden="true" className="hidden h-[18px] w-[18px] dark:block" />
      <Moon
        aria-hidden="true"
        className="block h-[18px] w-[18px] dark:hidden"
      />
    </button>
  );
}

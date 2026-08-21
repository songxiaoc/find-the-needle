'use client';

import { useEffect, useRef, useState } from 'react';

import { Link } from '@/core/i18n/navigation';
import type { NavItem } from '@/config/game';

import { activeNavHref } from './navActive';

export function MobileNav({
  activeHref,
  navItems,
  categories = [],
}: {
  activeHref?: string;
  navItems: readonly NavItem[];
  /** Guide categories shown below the primary nav (the sidebar's mobile form). */
  categories?: { label: string; href: string; count?: number }[];
}) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);

  // Keep keyboard focus inside the drawer, support Escape, and restore focus
  // to the trigger after every close path.
  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    const focusableSelector =
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';
    const getFocusable = () =>
      Array.from(
        drawerRef.current?.querySelectorAll<HTMLElement>(focusableSelector) ??
          []
      );

    document.body.style.overflow = 'hidden';

    const focusFrame = window.requestAnimationFrame(() => {
      getFocusable()[0]?.focus();
    });

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setOpen(false);
        return;
      }

      if (event.key !== 'Tab') return;

      const focusable = getFocusable();
      if (focusable.length === 0) {
        event.preventDefault();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
      triggerRef.current?.focus();
    };
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        ref={triggerRef}
        type="button"
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        aria-controls="mobile-site-navigation"
        onClick={() => setOpen((v) => !v)}
        className="text-site-on-surface focus-visible:outline-site-primary -mr-2 inline-flex h-10 w-10 items-center justify-center focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          aria-hidden
        >
          {open ? (
            <>
              <path d="M6 6l12 12" />
              <path d="M18 6L6 18" />
            </>
          ) : (
            <>
              <path d="M4 7h16" />
              <path d="M4 12h16" />
              <path d="M4 17h16" />
            </>
          )}
        </svg>
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/60"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <div
            ref={drawerRef}
            id="mobile-site-navigation"
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation"
            className="border-site-outline-variant bg-site-surface fixed inset-x-0 top-[73px] z-50 max-h-[calc(100dvh-73px)] overflow-y-auto border-b shadow-lg"
          >
            <ul className="mx-auto flex max-w-[1440px] flex-col px-6 py-2">
              {(() => {
                const activeNav = activeNavHref(activeHref, navItems);
                return navItems.map((item) => {
                  const active = activeNav === item.href;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className="site-label-md block py-3 transition-colors"
                        style={{
                          color: active
                            ? 'var(--site-primary)'
                            : 'var(--site-on-surface)',
                          fontWeight: active ? 600 : 400,
                        }}
                      >
                        {item.label}
                      </Link>
                    </li>
                  );
                });
              })()}
            </ul>
            {categories.length > 0 && (
              <nav
                aria-label="Wiki navigation"
                className="border-site-outline-variant mx-auto max-w-[1440px] border-t px-6 py-3"
              >
                <p
                  className="text-site-outline mb-1 py-1"
                  style={{
                    fontFamily: 'var(--font-site-mono)',
                    fontSize: 10,
                    letterSpacing: '0.2em',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                  }}
                >
                  Guides
                </p>
                <ul className="flex flex-col">
                  {categories.map((c) => (
                    <li key={c.href}>
                      <Link
                        href={c.href}
                        onClick={() => setOpen(false)}
                        aria-label={
                          c.count !== undefined
                            ? `${c.label}, ${c.count} guide${c.count === 1 ? '' : 's'}`
                            : c.label
                        }
                        className="text-site-on-surface-variant hover:text-site-primary flex items-center justify-between py-2.5"
                        style={{
                          fontFamily: 'var(--font-site-body)',
                          fontSize: 14,
                        }}
                      >
                        <span>{c.label}</span>
                        {c.count !== undefined && (
                          <span
                            aria-hidden
                            className="text-site-outline"
                            style={{
                              fontFamily: 'var(--font-site-mono)',
                              fontSize: 11,
                            }}
                          >
                            {c.count}
                          </span>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            )}
          </div>
        </>
      )}
    </div>
  );
}

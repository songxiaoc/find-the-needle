/**
 * Font loading for the TACTICAL CONSOLE theme (next/font, self-hosted, no CLS).
 *
 * - display → Space Grotesk (geometric, tight headings)
 * - body    → DM Sans       (clean, readable prose)
 * - mono    → JetBrains Mono (data labels, prices, version stamps)
 *
 * Exposes the same CSS variables the token preset reads (--font-site-display /
 * -body / -mono). Re-exported from ../../active-fonts.ts and applied once on the
 * SiteShell/frame root via `fontVars`. Swap families here to restyle the theme.
 */
import { DM_Sans, JetBrains_Mono, Space_Grotesk } from 'next/font/google';

export const fontDisplay = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-site-display',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

export const fontBody = DM_Sans({
  subsets: ['latin'],
  variable: '--font-site-body',
  display: 'swap',
});

export const fontMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-site-mono',
  display: 'swap',
});

/** Apply on a wrapping element to expose every --font-site-* CSS variable. */
export const fontVars = `${fontDisplay.variable} ${fontBody.variable} ${fontMono.variable}`;

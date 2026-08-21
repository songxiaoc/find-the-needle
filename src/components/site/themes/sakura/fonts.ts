/**
 * Font loading for the SAKURA theme (next/font, self-hosted, no CLS).
 *
 * - display → Baloo 2     (friendly rounded headings)
 * - body    → Nunito Sans (soft, warm, readable prose)
 * - mono    → IBM Plex Mono (data labels, prices, version stamps)
 *
 * Exposes the same CSS variables the token preset reads (--font-site-display /
 * -body / -mono). Re-exported from ../../active-fonts.ts and applied once on the
 * SiteShell/frame root via `fontVars`. Swap families here to restyle the theme.
 */
import { Baloo_2, IBM_Plex_Mono, Nunito_Sans } from 'next/font/google';

export const fontDisplay = Baloo_2({
  subsets: ['latin'],
  variable: '--font-site-display',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

export const fontBody = Nunito_Sans({
  subsets: ['latin'],
  variable: '--font-site-body',
  display: 'swap',
});

export const fontMono = IBM_Plex_Mono({
  subsets: ['latin'],
  variable: '--font-site-mono',
  display: 'swap',
  weight: ['400', '500', '600'],
});

/** Apply on a wrapping element to expose every --font-site-* CSS variable. */
export const fontVars = `${fontDisplay.variable} ${fontBody.variable} ${fontMono.variable}`;

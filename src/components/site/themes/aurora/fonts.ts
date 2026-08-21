/**
 * Font loading for the AURORA theme (next/font, self-hosted, no CLS).
 *
 * - display → Sora          (geometric, confident headings)
 * - body    → Inter         (crisp, neutral SaaS prose)
 * - mono    → IBM Plex Mono  (data labels, prices, version stamps)
 *
 * Exposes the same CSS variables the token preset reads (--font-site-display /
 * -body / -mono). Re-exported from ../../active-fonts.ts and applied once on the
 * SiteShell/frame root via `fontVars`. Swap families here to restyle the theme.
 */
import { IBM_Plex_Mono, Inter, Sora } from 'next/font/google';

export const fontDisplay = Sora({
  subsets: ['latin'],
  variable: '--font-site-display',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

export const fontBody = Inter({
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

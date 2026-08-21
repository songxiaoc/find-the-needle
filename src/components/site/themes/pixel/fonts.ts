/**
 * Font loading for the PIXEL HUD theme preset (next/font, self-hosted, no CLS).
 *
 * The pixel look uses a ROUNDED BOLD display face (Fredoka), NOT an 8-bit
 * pixel font — pixel fonts (Press Start 2P et al.) wreck prose readability and
 * SEO. The pixel feel comes from frames / hard shadows / bevels. See
 * docs/PITFALLS.md and docs/ui-design-pixel.md.
 *
 * - display / body  → Fredoka       (rounded, bold-capable, readable for prose)
 * - mono            → JetBrains Mono (tiny data labels, prices, version stamps)
 *
 * These expose the same CSS variables the pixel token preset reads
 * (--font-site-display / -body / -mono). Import `fontVars` and apply it once on
 * the SiteShell root so header + footer get it too. Only wired up when the
 * pixel theme is active — see docs/THEMES.md. Swap the families here to use a
 * different display/body font with the same machinery.
 */
import { Fredoka, JetBrains_Mono } from 'next/font/google';

export const fontDisplay = Fredoka({
  subsets: ['latin'],
  variable: '--font-site-display',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

export const fontBody = Fredoka({
  subsets: ['latin'],
  variable: '--font-site-body',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

export const fontMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-site-mono',
  display: 'swap',
});

/** Apply on a wrapping element to expose every --font-site-* CSS variable. */
export const fontVars = `${fontDisplay.variable} ${fontBody.variable} ${fontMono.variable}`;

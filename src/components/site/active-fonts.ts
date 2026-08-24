/* ╔══════════════════════════════════════════════════════════════════════╗
 * ║  ACTIVE FONTS — the single font selection point (pairs with the CSS    ║
 * ║  selection in src/config/style/active-theme.css).                      ║
 * ║  To switch theme fonts, change `tactical` below to another theme       ║
 * ║  folder (e.g. `pixel`). The bundled skill writes this for you.         ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 *
 * Frames (page.tsx, PageFrame.tsx, …) import `fontVars` from here and apply it
 * once on their root, so the whole tree gets the active theme's --font-site-*
 * variables. next/font is build-time, so this is a build-time choice.
 */
export {
  fontVars,
  fontDisplay,
  fontBody,
  fontMono,
} from './themes/tactical/fonts';

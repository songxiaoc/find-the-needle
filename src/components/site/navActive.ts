import { gameConfig, type NavItem } from '@/config/game';

/**
 * Pick the single active top-nav href for the current path.
 *
 * Nav hrefs are nested (`/guides`, `/guides/codes`, …), so a naive
 * `current.startsWith(item.href)` lights up the parent ('/guides') on every
 * child page. We instead return the LONGEST matching href so only the most
 * specific item is active. Compare with strict equality against `item.href`.
 */
export function activeNavHref(
  activeHref?: string,
  items: readonly NavItem[] = gameConfig.nav
): string | null {
  if (!activeHref) return null;
  const norm = (s: string) => s.replace(/\/+$/, '') || '/';
  const cur = norm(activeHref);
  let best: { href: string; len: number } | null = null;
  for (const { href } of items) {
    const h = norm(href);
    const match = cur === h || (h !== '/' && cur.startsWith(h + '/'));
    if (match && (!best || h.length > best.len)) best = { href, len: h.length };
  }
  return best?.href ?? null;
}

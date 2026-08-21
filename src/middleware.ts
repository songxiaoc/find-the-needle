import type { NextRequest } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';

import { routing } from '@/core/i18n/config';

const intlMiddleware = createIntlMiddleware(routing);

/**
 * Every page on this site is public, pre-rendered content, so the middleware has
 * exactly two jobs: resolve the locale prefix, and make the response cacheable.
 *
 * One hour at the edge with a four-hour grace window means a content update goes
 * live within the hour while a traffic spike still gets served from cache.
 */
const CACHE_CONTROL = 'public, s-maxage=3600, stale-while-revalidate=14400';

export async function middleware(request: NextRequest) {
  const response = intlMiddleware(request);

  response.headers.set('Cache-Control', CACHE_CONTROL);
  response.headers.set('CDN-Cache-Control', CACHE_CONTROL);
  response.headers.set('Cloudflare-CDN-Cache-Control', CACHE_CONTROL);

  // next-intl sets a locale cookie, and any Set-Cookie makes the response
  // uncacheable on most CDNs. Locale already lives in the URL, so drop it.
  response.headers.delete('Set-Cookie');

  // Read by server components that need the current URL, which is otherwise
  // unavailable to them in the App Router.
  response.headers.set('x-pathname', request.nextUrl.pathname);
  response.headers.set('x-url', request.url);

  return response;
}

export const config = {
  // Skip Next internals, generated image routes, and anything with a file
  // extension — notably /llms.txt, which must not get a locale prefix.
  matcher: [
    '/((?!_next|_vercel|icon|apple-icon|favicon|opengraph-image|twitter-image|manifest|sitemap|robots|.*\\..*).*)',
  ],
};

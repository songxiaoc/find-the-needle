import { NextResponse, type NextRequest } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';

import { routing } from '@/core/i18n/config';
import { locales } from '@/config/locale';
import { getCommonMessages } from '@/config/locale/messages';
import { PUBLIC_PATHS } from '@/config/locale/routes';

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
  const hostname = request.nextUrl.hostname;
  const preview =
    hostname.endsWith('.workers.dev') || hostname.endsWith('.pages.dev');
  const pathname = request.nextUrl.pathname;
  if (['/sitemap.xml', '/robots.txt', '/llms.txt'].includes(pathname)) {
    const response = NextResponse.next();
    if (preview) response.headers.set('X-Robots-Tag', 'noindex, nofollow');
    return response;
  }
  const segments = pathname.split('/').filter(Boolean);
  const locale = locales.includes(segments[0]) ? segments.shift()! : 'en';
  const route = `/${segments.join('/')}`;
  if (!PUBLIC_PATHS.has(route)) {
    const copy = getCommonMessages(locale);
    const home = locale === 'en' ? '/' : `/${locale}`;
    return new NextResponse(
      `<!doctype html><html lang="${locale}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>${copy.ui.notFound}</title></head><body style="margin:0;min-height:100vh;display:grid;place-items:center;background:#141712;color:#f5f0df;font-family:system-ui;text-align:center"><main><h1>${copy.ui.notFound}</h1><p><a style="color:#d4bb6b" href="${home}">${copy.ui.backHome}</a></p></main></body></html>`,
      {
        status: 404,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'X-Robots-Tag': 'noindex, nofollow',
        },
      }
    );
  }
  const response = intlMiddleware(request);
  if (preview) response.headers.set('X-Robots-Tag', 'noindex, nofollow');

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
    '/((?!api|_next|_vercel|icon|apple-icon|favicon|opengraph-image|twitter-image|manifest|sitemap|robots|.*\\..*).*)',
    '/sitemap.xml',
    '/robots.txt',
    '/llms.txt',
  ],
};

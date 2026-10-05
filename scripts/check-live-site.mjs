import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import matter from 'gray-matter';

import { PUBLIC_PATHS } from '../src/config/locale/routes.ts';
import {
  generatedDefaultLocale as defaultLocale,
  generatedLocales as locales,
} from '../src/generated/site-locales.ts';

const base = new URL(process.argv[2] || 'http://localhost:3000');
const canonicalOrigin = 'https://findtheneedle.site';
const entityPaths = readdirSync(
  new URL('../content/entities/', import.meta.url),
  { withFileTypes: true }
)
  .filter((entry) => entry.isDirectory())
  .flatMap((entry) =>
    readdirSync(new URL(`../content/entities/${entry.name}/`, import.meta.url))
      .filter((file) => /^[a-z0-9-]+\.json$/.test(file))
      .map((file) => `/database/${entry.name}/${file.slice(0, -5)}`)
  );
const expectedPaths = new Set([...PUBLIC_PATHS, ...entityPaths]);
const expectedPages = expectedPaths.size * locales.length;
const preview = /\.(workers|pages)\.dev$/.test(base.hostname);
const failures = [];
const snapshots = new Map();
const commonCopy = Object.fromEntries(
  locales.map((locale) => [
    locale,
    JSON.parse(
      readFileSync(
        new URL(
          `../src/config/locale/messages/${locale}/common.json`,
          import.meta.url
        ),
        'utf8'
      )
    ),
  ])
);

const decode = (value) =>
  value
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
const attributes = (tag) =>
  Object.fromEntries(
    [...tag.matchAll(/([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g)].map(
      (match) => [match[1].toLowerCase(), decode(match[2] ?? match[3])]
    )
  );
const tags = (html, name) =>
  [...html.matchAll(new RegExp(`<${name}\\b[^>]*>`, 'gi'))].map((match) =>
    attributes(match[0])
  );
const routeLocale = (pathname) =>
  locales.includes(pathname.split('/')[1])
    ? pathname.split('/')[1]
    : defaultLocale;
const semanticPath = (pathname) => {
  const locale = routeLocale(pathname);
  return locale === defaultLocale
    ? pathname
    : pathname.slice(locale.length + 1) || '/';
};
const languageUrl = (path, locale) =>
  `${canonicalOrigin}${locale === defaultLocale ? '' : `/${locale}`}${path === '/' ? '' : path}`;

function check(condition, message) {
  if (!condition) failures.push(message);
}

async function request(path) {
  const url = new URL(path, base);
  const response = await fetch(url, {
    redirect: 'manual',
    signal: AbortSignal.timeout(45000),
    headers: {
      'User-Agent': 'FindTheNeedleSiteVerification/1.0',
      'Cache-Control': 'no-cache',
    },
  });
  return { response, html: await response.text() };
}

const { response: sitemapResponse, html: sitemap } =
  await request('/sitemap.xml');
assert.equal(sitemapResponse.status, 200, 'Sitemap must return HTTP 200');
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) =>
  decode(match[1])
);
assert.equal(
  urls.length,
  expectedPages,
  `Expected ${expectedPages} published URLs`
);
assert.equal(
  new Set(urls).size,
  urls.length,
  'Sitemap must not contain duplicate URLs'
);
const publishedPaths = new Set(urls.map((url) => new URL(url).pathname));
for (const path of expectedPaths) {
  for (const locale of locales) {
    const expectedPath = new URL(languageUrl(path, locale)).pathname;
    check(
      publishedPaths.has(expectedPath),
      `Sitemap is missing published route ${expectedPath}`
    );
  }
}

for (let offset = 0; offset < urls.length; offset += 4) {
  await Promise.all(
    urls.slice(offset, offset + 4).map(async (url) => {
      const target = new URL(url);
      const path = target.pathname;
      const locale = routeLocale(path);
      try {
        const { response, html } = await request(path);
        check(response.status === 200, `${path}: HTTP ${response.status}`);
        if (response.status !== 200) return;
        check(
          tags(html, 'html')[0]?.lang === locale,
          `${path}: html lang must be ${locale}`
        );
        check(
          [...html.matchAll(/<h1\b/gi)].length === 1,
          `${path}: expected exactly one H1`
        );
        const text = decode(
          html
            .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
            .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '')
            .replace(/<[^>]*>/g, ' ')
        );
        if (/^\/guides\/guide\/[^/]+$/.test(semanticPath(path))) {
          const slug = semanticPath(path).split('/').at(-1);
          const suffix = locale === defaultLocale ? '' : `.${locale}`;
          const guide = matter(
            readFileSync(
              new URL(
                `../content/guides/guide/${slug}${suffix}.mdx`,
                import.meta.url
              ),
              'utf8'
            )
          );
          const heading = decode(
            (html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)?.[1] || '').replace(
              /<[^>]*>/g,
              ''
            )
          ).trim();
          check(
            heading === guide.data.title,
            `${path}: rendered H1 does not match the localized article`
          );
          for (const headingHtml of html.matchAll(
            /<h[2-6]\b[^>]*>[\s\S]*?<\/h[2-6]>/gi
          )) {
            check(
              !/<a\b[^>]*>(?:(?!<\/a>)[\s\S])*<a\b/i.test(headingHtml[0]),
              `${path}: nested heading links can break hydration`
            );
          }
          for (const line of guide.content
            .split('\n')
            .filter((line) => /^## /.test(line))) {
            check(
              text.includes(line.slice(3).trim()),
              `${path}: missing localized section ${line.slice(3)}`
            );
          }
          for (const match of guide.content.matchAll(
            /!\[[^\]]*\]\((\/images\/[^)]+)\)/g
          )) {
            check(
              html.includes(match[1]),
              `${path}: missing guide image ${match[1]}`
            );
          }
        }
        check(
          text.includes(commonCopy[locale].footer.disclaimer),
          `${path}: footer must use the route language ${locale}`
        );
        check(
          !/Example Game|example-boss|placeholder|lorem ipsum|TomeWiki/i.test(
            text
          ),
          `${path}: template placeholder in visible content`
        );
        const links = tags(html, 'link');
        const canonicals = links.filter((link) => link.rel === 'canonical');
        const expectedCanonical = languageUrl(semanticPath(path), locale);
        check(
          canonicals.length === 1 && canonicals[0].href === expectedCanonical,
          `${path}: expected canonical ${expectedCanonical}, got ${canonicals.map((link) => link.href).join(', ')}`
        );
        const alternates = new Map(
          links
            .filter((link) => link.rel === 'alternate' && link.hreflang)
            .map((link) => [link.hreflang, link.href])
        );
        check(
          alternates.size === locales.length + 1,
          `${path}: expected ${[...locales, 'x-default'].join('/')} hreflang`
        );
        for (const language of [...locales, 'x-default']) {
          check(
            alternates.get(language) ===
              languageUrl(
                semanticPath(path),
                language === 'x-default' ? defaultLocale : language
              ),
            `${path}: invalid ${language} alternate`
          );
        }
        snapshots.set(expectedCanonical, alternates);
        const noindex =
          /noindex/i.test(response.headers.get('x-robots-tag') || '') ||
          tags(html, 'meta').some(
            (meta) =>
              meta.name === 'robots' && /noindex/i.test(meta.content || '')
          );
        check(
          preview ? noindex : !noindex,
          `${path}: ${preview ? 'preview must be noindex' : 'published page must be indexable'}`
        );
        for (const anchor of tags(html, 'a')) {
          if (
            !anchor.href ||
            /^(#|mailto:|tel:|javascript:)/i.test(anchor.href)
          )
            continue;
          const href = new URL(anchor.href, new URL(path, base));
          if (
            ![base.origin, canonicalOrigin].includes(href.origin) ||
            /\.[a-z0-9]+$/i.test(href.pathname)
          )
            continue;
          check(
            publishedPaths.has(href.pathname),
            `${path}: internal link points to unpublished path ${href.pathname}`
          );
          if (!anchor.hreflang)
            check(
              routeLocale(href.pathname) === locale,
              `${path}: internal link leaves locale: ${href.pathname}`
            );
        }
      } catch (error) {
        failures.push(`${path}: ${error.message}`);
      }
    })
  );
  console.log(
    `Checked ${Math.min(offset + 4, urls.length)}/${urls.length} published URLs`
  );
}

for (const [url, alternates] of snapshots) {
  const locale = routeLocale(new URL(url).pathname);
  for (const alternate of alternates.values()) {
    check(
      snapshots.get(alternate)?.get(locale) === url,
      `${url}: hreflang is not reciprocal with ${alternate}`
    );
  }
}

const absentPaths = [
  '/docs',
  '/database/unknown',
  '/does-not-exist',
  '/ja',
  '/it/guides',
  '/fr/docs',
  '/de/database/machines/unknown',
  '/ru/guides/guide/unknown',
];
for (const path of absentPaths) {
  const { response, html } = await request(path);
  check(
    response.status === 404,
    `${path}: expected real HTTP 404, got ${response.status}`
  );
  check(
    /noindex/i.test(response.headers.get('x-robots-tag') || '') ||
      /name="robots"[^>]+noindex/i.test(html),
    `${path}: missing noindex`
  );
}

const { response: llmsResponse, html: llms } = await request('/llms.txt');
check(llmsResponse.status === 200, '/llms.txt must return HTTP 200');
for (const url of urls)
  check(llms.includes(url), `/llms.txt is missing ${url}`);
if (preview) {
  check(
    /noindex/i.test(sitemapResponse.headers.get('x-robots-tag') || ''),
    'Preview sitemap must have X-Robots-Tag: noindex'
  );
  check(
    /noindex/i.test(llmsResponse.headers.get('x-robots-tag') || ''),
    'Preview llms.txt must have X-Robots-Tag: noindex'
  );
}

if (failures.length) {
  console.error(
    `\n${failures.length} failure(s):\n${failures.map((failure) => `- ${failure}`).join('\n')}`
  );
  process.exitCode = 1;
} else {
  console.log(
    `PASS: ${urls.length} pages, self-canonicals, ${locales.length + 1} reciprocal hreflang links, HTML languages, single H1s, localized internal links, ${absentPaths.length} real 404s, sitemap and llms.txt on ${base.origin}.`
  );
}

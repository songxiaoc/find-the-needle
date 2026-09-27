import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

import { generatedGameConfig } from '../src/generated/game-config.ts';

const siteOrigin = `https://${generatedGameConfig.domain}`;
const endpoint = 'https://api.indexnow.org/indexnow';
const keyFilePattern = /^[A-Za-z0-9-]{8,128}\.txt$/;

async function loadKey() {
  const files = (await readdir('public')).filter((file) =>
    keyFilePattern.test(file)
  );
  const keys = [];
  for (const file of files) {
    const key = (await readFile(path.join('public', file), 'utf8')).trim();
    if (`${key}.txt` === file) keys.push({ file, key });
  }
  if (keys.length !== 1)
    throw new Error(
      `Expected exactly one IndexNow key file in public, found ${keys.length}.`
    );
  return keys[0];
}

function parseUrls(values) {
  if (values.length === 0)
    throw new Error('Pass the changed canonical URL or URLs to submit.');
  const urls = [...new Set(values.map((value) => new URL(value).href))];
  if (urls.length > 10_000)
    throw new Error('IndexNow accepts at most 10,000 URLs per request.');
  for (const url of urls) {
    const parsed = new URL(url);
    if (parsed.origin !== siteOrigin || parsed.search || parsed.hash)
      throw new Error(
        `URL must be a canonical ${siteOrigin} URL without a query or fragment: ${url}`
      );
  }
  return urls;
}

async function request(url, options = {}) {
  return fetch(url, {
    redirect: 'manual',
    signal: AbortSignal.timeout(30000),
    ...options,
  });
}

function attributes(tag) {
  return Object.fromEntries(
    [...tag.matchAll(/([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g)].map(
      (match) => [match[1].toLowerCase(), match[2] ?? match[3]]
    )
  );
}

async function preflight(urls, file, key) {
  const keyResponse = await request(`${siteOrigin}/${file}`);
  if (keyResponse.status !== 200 || (await keyResponse.text()).trim() !== key)
    throw new Error('The production IndexNow key file is not valid.');
  const sitemapResponse = await request(`${siteOrigin}/sitemap.xml`);
  if (sitemapResponse.status !== 200)
    throw new Error(`Sitemap returned HTTP ${sitemapResponse.status}.`);
  const sitemap = new Set(
    [...(await sitemapResponse.text()).matchAll(/<loc>([^<]+)<\/loc>/g)].map(
      (match) => new URL(match[1].replaceAll('&amp;', '&')).href
    )
  );
  for (const url of urls) {
    if (!sitemap.has(url))
      throw new Error(`URL is not in the live sitemap: ${url}`);
    const response = await request(url);
    if (response.status !== 200)
      throw new Error(`URL returned HTTP ${response.status}: ${url}`);
    const head = (await response.text()).split('</head>')[0];
    const metas = [...head.matchAll(/<meta\b[^>]*>/gi)].map((match) =>
      attributes(match[0])
    );
    const robots = metas
      .filter((meta) =>
        ['robots', 'bingbot', 'googlebot'].includes(meta.name?.toLowerCase())
      )
      .map((meta) => meta.content)
      .join(',');
    if (
      /\b(noindex|none)\b/i.test(
        `${robots},${response.headers.get('x-robots-tag') ?? ''}`
      )
    )
      throw new Error(`URL is noindex: ${url}`);
    const canonicals = [...head.matchAll(/<link\b[^>]*>/gi)]
      .map((match) => attributes(match[0]))
      .filter((link) => link.rel === 'canonical');
    if (canonicals.length !== 1 || new URL(canonicals[0].href).href !== url)
      throw new Error(`URL does not have a matching canonical: ${url}`);
  }
  console.log(
    `Preflight passed for ${urls.length} live, canonical sitemap URLs.`
  );
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const urls = parseUrls(args.filter((arg) => arg !== '--dry-run'));
  const { file, key } = await loadKey();
  await preflight(urls, file, key);
  if (dryRun) {
    console.log(urls.join('\n'));
    return;
  }
  const payload = JSON.stringify({
    host: new URL(siteOrigin).host,
    key,
    keyLocation: `${siteOrigin}/${file}`,
    urlList: urls,
  });

  for (let attempt = 1; attempt <= 6; attempt += 1) {
    const response = await request(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'User-Agent': 'find-the-needle-indexnow/1.0',
      },
      body: payload,
    });
    const body = await response.text();
    if (response.status === 200) {
      console.log(`IndexNow submitted ${urls.length} URL(s) with HTTP 200.`);
      return;
    }
    if (response.status === 202 && attempt < 6) {
      console.log(
        `IndexNow key validation is pending (attempt ${attempt}/6); retrying in 5 seconds.`
      );
      await new Promise((resolve) => setTimeout(resolve, 5_000));
      continue;
    }
    throw new Error(
      `IndexNow submission failed with HTTP ${response.status}: ${body || 'no response body'}`
    );
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});

import { defineCloudflareConfig } from '@opennextjs/cloudflare';
import staticAssetsIncrementalCache from '@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache';

/**
 * Cloudflare Workers deployment config.
 *
 * staticAssetsIncrementalCache: serves pre-rendered pages from the Workers
 * static-assets binding (the same ASSETS binding that serves JS/CSS).
 * This is required for guide/article routes to work on CF Workers — without
 * it, ISR falls back to runtime fs reads which are unavailable in Workers.
 *
 * Pair this with `dynamic = 'force-static'` and NO `revalidate` on all
 * pages that read content from the filesystem (guides, homepage).
 * See PITFALLS.md → "Cloudflare Workers: guide routes 404".
 */
export default defineCloudflareConfig({
  incrementalCache: staticAssetsIncrementalCache,
});

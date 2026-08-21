import bundleAnalyzer from '@next/bundle-analyzer';
import { initOpenNextCloudflareForDev } from '@opennextjs/cloudflare';
import { createMDX } from 'fumadocs-mdx/next';
import createNextIntlPlugin from 'next-intl/plugin';

const withMDX = createMDX();

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const withNextIntl = createNextIntlPlugin({
  requestConfig: './src/core/i18n/request.ts',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Vercel builds its own serverless output; everywhere else (Docker, and the
  // OpenNext Cloudflare adapter) wants a standalone server bundle.
  output: process.env.VERCEL ? undefined : 'standalone',
  reactStrictMode: false,
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
  images: {
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    qualities: [60, 70, 75],
    // Guide content routinely embeds art and screenshots hosted on wikis, CDNs
    // and storefronts, so the host list can't be enumerated ahead of time.
    remotePatterns: [{ protocol: 'https', hostname: '*' }],
  },
  async redirects() {
    // Add 301s here when you move or rename a URL, e.g.
    //   { source: '/old-path', destination: '/new-path', permanent: true }
    return [];
  },
  experimental: {
    // mdxRs is the Rust MDX compiler. It breaks fumadocs-mdx on Vercel's build
    // image, so it stays off there and on everywhere else.
    ...(process.env.VERCEL ? {} : { mdxRs: true }),
    reactCompiler: true,
  },
};

export default withBundleAnalyzer(withNextIntl(withMDX(nextConfig)));

// Gives `next dev` access to Cloudflare bindings (env, ASSETS, IMAGES) so local
// development matches what the Worker sees. No-op outside dev.
initOpenNextCloudflareForDev();

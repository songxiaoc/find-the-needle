import '@/config/style/global.css';

import type { Metadata, Viewport } from 'next';

import { envConfigs } from '@/config';

export const metadata: Metadata = {
  metadataBase: new URL(envConfigs.app_url),
  verification: {
    other: { 'msvalidate.01': envConfigs.bing_site_verification },
  },
  icons: {
    // Brand assets live in public/ and are listed in src/generated/asset-manifest.json.
    icon: [
      { url: envConfigs.app_favicon, type: 'image/png', sizes: '256x256' },
      { url: '/icon-192.png', type: 'image/png', sizes: '192x192' },
      { url: '/icon-512.png', type: 'image/png', sizes: '512x512' },
    ],
    shortcut: [envConfigs.app_favicon],
    apple: [
      { url: '/apple-touch-icon.png', type: 'image/png', sizes: '180x180' },
    ],
  },
  openGraph: {
    images: [envConfigs.app_preview_image],
  },
  twitter: {
    card: 'summary_large_image',
    images: [envConfigs.app_preview_image],
  },
};

// Next injects a viewport meta automatically; declare it here (rather than a
// hand-written <meta> in <head>) so there's exactly ONE viewport tag, not two.
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

// Pass-through root layout. <html>/<body> are rendered in app/[locale]/layout.tsx
// so the lang attribute can use the route locale (params.locale) during static
// generation. Every page route is nested under [locale], so that layout always
// runs. Root-level route handlers (sitemap, robots, llms.txt) need no <html>.
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}

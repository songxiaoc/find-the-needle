export const PUBLIC_PAGES = [
  { path: '/', label: 'Home' },
  { path: '/guides', label: 'Guides' },
  { path: '/faq', label: 'FAQ' },
  { path: '/system-requirements', label: 'System requirements' },
  { path: '/troubleshooting', label: 'Troubleshooting' },
  { path: '/about', label: 'About' },
  { path: '/contact', label: 'Contact' },
  { path: '/privacy-policy', label: 'Privacy policy' },
  { path: '/terms-of-service', label: 'Terms of use' },
] as const;

export const GUIDE_PATHS = [
  '/guides/guide',
  '/guides/guide/getting-started',
  '/guides/guide/automation',
  '/guides/guide/demo',
  '/guides/guide/machines-and-products',
  '/guides/guide/needles-and-scanners',
  '/guides/guide/demo-updates',
] as const;

export const PUBLIC_PATHS: ReadonlySet<string> = new Set([
  ...PUBLIC_PAGES.map((page) => page.path),
  ...GUIDE_PATHS,
]);

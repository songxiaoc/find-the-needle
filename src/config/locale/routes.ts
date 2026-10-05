import { ENTITY_KINDS } from '../entities';

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
  { path: '/database', label: 'Database' },
  { path: '/tools', label: 'Factory tools' },
  { path: '/tools/line-check', label: 'Production line check' },
  { path: '/tools/checklist', label: 'Factory checklist' },
  { path: '/tools/production-calculator', label: 'Production calculator' },
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
  ...ENTITY_KINDS.map((kind) => kind.route),
]);

export function isPublicPath(path: string): boolean {
  return (
    PUBLIC_PATHS.has(path) ||
    ENTITY_KINDS.some((kind) => {
      const prefix = `${kind.route}/`;
      return (
        path.startsWith(prefix) &&
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(path.slice(prefix.length))
      );
    })
  );
}

export const GUIDE_RELATIONS: Readonly<Record<string, readonly string[]>> = {
  'guide/automation': [
    'guide/needles-and-scanners',
    'guide/machines-and-products',
    'guide/getting-started',
  ],
  'guide/machines-and-products': [
    'guide/automation',
    'guide/needles-and-scanners',
    'guide/getting-started',
  ],
  'guide/getting-started': [
    'guide/machines-and-products',
    'guide/automation',
    'guide/needles-and-scanners',
  ],
  'guide/needles-and-scanners': [
    'guide/automation',
    'guide/machines-and-products',
    'guide/demo',
  ],
  'guide/demo': ['guide/getting-started', 'guide/demo-updates'],
  'guide/demo-updates': [
    'guide/automation',
    'guide/demo',
    'guide/needles-and-scanners',
  ],
};

import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';

/**
 * ESLint 9 flat config.
 *
 * `eslint-config-next` still ships in eslintrc format, so it is bridged through
 * FlatCompat. Without this file `pnpm lint` exits with "couldn't find an eslint
 * config file" — and every site cloned from the template inherits that.
 */
const compat = new FlatCompat({
  baseDirectory: dirname(fileURLToPath(import.meta.url)),
});

export default [
  {
    ignores: [
      '.next/**',
      '.open-next/**',
      '.source/**',
      '.wrangler/**',
      'node_modules/**',
      'out/**',
      'build/**',
      'skills/**',
      'workflow/**',
      'next-env.d.ts',
    ],
  },
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    rules: {
      // Content and config files legitimately carry wide record types.
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
];

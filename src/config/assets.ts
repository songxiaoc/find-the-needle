import assetManifestJson from '@/generated/asset-manifest.json';
import { z } from 'zod';

const publicAssetPath = z
  .string()
  .regex(/^\/(?!\/)/, 'Expected a root-relative public asset path')
  .refine(
    (value) => !value.split('/').includes('..'),
    'Asset path may not escape public/'
  );

const optionalPublicAssetPath = z.union([z.literal(''), publicAssetPath]);

const assetManifestSchema = z
  .object({
    schemaVersion: z.literal(1),
    hero: z
      .object({
        type: z.enum(['image', 'video', 'none']),
        source: z.string(),
        official: z.boolean(),
        title: z.string().trim().min(1),
        fallback: optionalPublicAssetPath,
        desktopFocus: z.string().trim().min(1),
        mobileFocus: z.string().trim().min(1),
      })
      .strict(),
    brand: z
      .object({
        logo: publicAssetPath,
        favicon: publicAssetPath,
        ogImage: publicAssetPath,
      })
      .strict(),
    source: z
      .object({
        path: z.string(),
        generationMode: z.enum([
          'approved-image',
          'programmatic-placeholder',
          'existing',
        ]),
      })
      .strict(),
  })
  .strict()
  .superRefine((manifest, ctx) => {
    if (manifest.hero.type !== 'none' && !manifest.hero.source.trim()) {
      ctx.addIssue({
        code: 'custom',
        path: ['hero', 'source'],
        message: `${manifest.hero.type} hero requires a source`,
      });
    }
  });

export type AssetManifest = z.infer<typeof assetManifestSchema>;

export const siteAssets: AssetManifest =
  assetManifestSchema.parse(assetManifestJson);

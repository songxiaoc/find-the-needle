import packageJson from '../../package.json';
import { siteAssets } from './assets';
import { gameConfig } from './game';
import { defaultLocale } from './locale';

export {
  getPrimaryNavigation,
  siteProfile,
  type DataStatus,
  type NavigationGroup,
  type ShellPreset,
  type SiteFeatures,
  type SiteProfile,
} from './site-profile';

export {
  ENTITY_KINDS,
  getEntityField,
  getEntityKind,
  type DetailSectionDefinition,
  type EntityFieldDefinition,
  type EntityKind,
  type EntityRecord,
  type EntityRelation,
  type EntityScalar,
  type FilterDefinition,
} from './entities';

export {
  getSemanticTone,
  semanticColors,
  type SemanticColorConfig,
  type SemanticDomain,
  type SemanticTone,
} from './game-semantics';

// Next.js loads .env files itself, for both `next dev` and `next build`, so
// nothing here reads them manually. Cloudflare Workers previews take their vars
// from .dev.vars instead — see docs/PITFALLS.md.

export type ConfigMap = Record<string, string>;

/** One normalized origin for metadata, sitemap, robots and generated page URLs. */
export const siteOrigin = (
  process.env.NEXT_PUBLIC_APP_URL || gameConfig.origin
).replace(/\/+$/, '');

export const envConfigs: ConfigMap = {
  app_url: siteOrigin,
  app_name: process.env.NEXT_PUBLIC_APP_NAME ?? gameConfig.siteName,
  app_description:
    process.env.NEXT_PUBLIC_APP_DESCRIPTION ?? gameConfig.tagline,
  app_logo: process.env.NEXT_PUBLIC_APP_LOGO ?? siteAssets.brand.logo,
  app_favicon: process.env.NEXT_PUBLIC_APP_FAVICON ?? siteAssets.brand.favicon,
  app_preview_image:
    process.env.NEXT_PUBLIC_APP_PREVIEW_IMAGE ?? siteAssets.brand.ogImage,
  theme: process.env.NEXT_PUBLIC_THEME ?? 'default',
  appearance: process.env.NEXT_PUBLIC_APPEARANCE ?? 'system',
  locale: defaultLocale,
  // No database/auth keys: this template has no ORM and no runtime database.
  // Structured data lives in content/entities/*.json, validated at build time
  // (docs/ENTITIES.md). Bring your own data layer if you outgrow that.
  version: packageJson.version,
  locale_detect_enabled:
    process.env.NEXT_PUBLIC_LOCALE_DETECT_ENABLED ?? 'false',
};

# Permitted paths and sign-off

## Paths this pass may write

- `.env` (copied from `.env.example`)
- `.dev.vars` (only when they need `cf:preview`)
- `wrangler.jsonc` — `name` and the `WORKER_SELF_REFERENCE` `service` must be the same slug
- `src/generated/game-config.ts`
- `src/generated/homepage.ts`
- `src/generated/site-locales.ts` — drop `scaffold-default:en-only`; extra locales only if requested
- `src/generated/visual-profile.json`
- `src/generated/asset-manifest.json` — titles and hero label; leave brand URLs as-is
- `src/generated/site-manifest.json` — `theme`, `locales`, `defaultLocale`
- `src/generated/ui-recipe.json` — `theme` / `archetype` matching the preset
- `src/config/locale/messages/en/common.json`
- `src/config/locale/messages/<lang>/common.json` — only when adding that language
- `src/components/site/brand.css`
- `src/config/style/active-theme.css`
- `src/components/site/active-fonts.ts`
- `public/logo.png`, `public/favicon.png`, `public/favicon.ico`, `public/og-image.png`
- extras from `scripts/gen-brand-assets.mjs`: `apple-touch-icon.png`, `icon-192.png`, `icon-512.png`

## Paths this pass must not touch

- `src/app/**` and `src/components/site/**` other than `brand.css` and `active-fonts.ts`
- adapters: `src/config/game.ts`, `src/config/homepage.ts`, `src/config/guides.ts`
- `template-contract.json`
- `content/guides/**`, `content/entities/**`
- category **slugs** in `src/generated/guide-categories.ts`

## How to know it worked

```bash
pnpm validate:site
pnpm build
```

Delete `.next` first if `public/logo.png` still looks like the template mark.

`validate:site` typically fails when:

- `domain` contains a scheme
- `eaLaunchDate` is not `YYYY-MM-DD`
- a homepage `href` has no matching route or content file
- CSS preset, font preset, `site-manifest.theme`, and `ui-recipe.theme` disagree
- brand CSS variables are missing or duplicated
- `public/logo.png`, `favicon.png`, or `og-image.png` is absent
- `cover-split` lacks `coverImage`, or `video-center` lacks `trailerUrl`
- `// scaffold-default:en-only` is still in `site-locales.ts`

If `site-manifest.planSha256` is set, leftover `Example Game`, `REPLACE_WITH_OFFICIAL_SOURCE`, or `Replace this` in generated identity files also fail.

## Tell the user

Finished: identity, SEO, homepage copy, theme/accent, brand images, plus validate/build outcome.

Still theirs: real guides and entity JSON, Cloudflare domain, analytics IDs, `pnpm cf:deploy` or Vercel, and `docs/PITFALLS.md`.

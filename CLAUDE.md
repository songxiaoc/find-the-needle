# game-wiki-template — Claude Code Instructions

This repository is a Next.js template for unofficial fan game-guide / wiki sites.

## First-pass customization

When the user wants to turn this clone into a real game wiki, follow **`.claude/skills/game-wiki-quick-start/SKILL.md`**. That skill is the v1 bootstrap (identity, SEO, homepage copy, theme, brand assets). Do not wander into routing or components on the first pass.

## Commands

```bash
pnpm dev            # local dev (http://localhost:3000)
pnpm build          # production build
pnpm quality:gate   # format + lint + typecheck + validate:site + build
pnpm cf:preview     # Cloudflare Worker preview
pnpm cf:deploy      # deploy to Cloudflare Workers
```

## Architecture

- **Theme = accent × preset, two independent axes** (see `docs/THEMES.md`):
  - **Accent knob**: `:root --brand-primary/-dim/-on-primary` in `src/components/site/brand.css` is the only knob. `--site-primary` and the wiki/docs `theme.css` `--primary`/`--ring` all derive from `var(--brand-*)` — change one place to re-accent the whole site. Use a dark `--brand-on-primary` on a light accent, white on a dark accent.
  - **Theme presets**: `src/components/site/themes/<name>/` (`tactical` default / `pixel` / `neon` / `aurora` / `sakura`). Each preset is `tokens.css` + `utils.css` + `fonts.ts`. **Chosen at build time** via exactly two files: `src/config/style/active-theme.css` (CSS) and `src/components/site/active-fonts.ts` (fonts). Variable names are stable across presets, so swapping a theme does not touch components.
  - Prose lives in `src/components/site/prose.css` (theme-agnostic, driven by `--site-*`).
- **Home = composable blocks** (see `docs/HOMEPAGE-BLOCKS.md`): the home page is the ordered `HOME_BLOCKS` array in `src/config/homepage.ts`, rendered by `src/components/site/HomeBlocks.tsx`. `page.tsx` **does not hard-code any section copy or structure**. Block `type` values: hero / start-cards / code-cards / tier-grid / step-by-step / card-list / about / final-cta / latest-guides / category-grid / faq. The home `<title>` comes from `common.metadata`, not `siteName`.
- **Hero layout**: the `hero` block's layout is controlled by `gameConfig.heroStyle` (`cover-split` / `video-center` / `text-only`); hero copy lives in the hero block; fact chips come from `gameConfig`.
- **Favicon / image assets**: all in `public/` (`favicon.png`, `logo.png`, `og-image.png`), referenced via `envConfigs.app_favicon` and friends. **Do not create `src/app/favicon.ico`** — it registers as an App Router route and 500s `GET /favicon.ico` when it coexists with `public/favicon.ico`.
- **Nav is not auto-generated**: maintain the `gameConfig.nav` array by hand; it is not derived from guide categories.
- **i18n is the default, en-only is the exception** (see `docs/PITFALLS.md`): the only switch is `locales` in `src/config/locale/index.ts` (the placeholder value is marked `// scaffold-default:en-only`, which `pnpm validate:site` greps). Language names, content-file suffixes, the docs language menu, and `zh-CN→zh` folding **all derive from `SUPPORTED_LOCALES` in that same file** — do not keep a second list in components or content. `src/config/locale/wiring.ts` fails the build if a translation exists for an unregistered locale, or a registered locale is missing `messages/<lang>/common.json`.

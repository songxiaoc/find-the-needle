# Accent and visual preset

Brand color and surface preset are separate.

## Brand color

`src/components/site/brand.css` — these three, once each:

```css
--brand-primary: #RRGGBB;
--brand-primary-dim: #RRGGBB;
--brand-on-primary: #ffffff;
```

`--brand-on-primary` sits on the accent (dark ink on a bright color, white on a dark one). Do not paint the hex into theme `tokens.css`; presets already read `var(--brand-primary)`.

## Surface preset

Folders under `src/components/site/themes/`: `tactical` (default), `pixel`, `neon`, `aurora`, `sakura`.

If they did not choose: `tactical` for most games; `pixel` for retro/cozy; `neon` for cyber/shooter; `aurora` for light/documentary; `sakura` for life-sim/cozy-romance.

All four must agree or `validate:site` fails:

1. `src/config/style/active-theme.css` — both `@import`s to the same folder
2. `src/components/site/active-fonts.ts` — `from './themes/<name>/fonts'`
3. `src/generated/site-manifest.json` `"theme"`
4. `src/generated/ui-recipe.json` `"theme"` (and `"archetype"` if it still names the old preset)

Restart `pnpm dev` so `next/font` reloads.

Pixel look is borders, hard shadows, and bevels — not 8-bit body type. Do not edit files inside `themes/<name>/` on this pass, and do not pair CSS from one folder with fonts from another.

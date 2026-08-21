# Pixel HUD — theme design source-of-truth

> Style code: **Pixel HUD** — an alternate preset for this template.
> A warm, dark, square "retro game HUD" look. This doc is the design
> source-of-truth; implement against the **§8 checklist**, don't freestyle.
>
> To wire the preset up, follow `docs/THEMES.md`. Pitfalls: `docs/PITFALLS.md`.

---

## 0. The one principle

> **The pixel is in the FRAME, not the FONT.** Retro game UI panels are pixel
> art (outlined frames, beveled buttons), but the in-game *text* is usually a
> rounded bold face — **not** an 8-bit pixel font. So on the site: frames /
> bevels / hard shadows / sprites carry the pixel texture; the **type stays a
> rounded readable face (Fredoka)**. Pixel fonts in prose kill readability and
> SEO (see `docs/PITFALLS.md`).
>
> Pull the palette from **in-game UI screenshots**, not just key art: warm
> neutral dark brown/charcoal panels, crimson reserved for title bars / CTAs,
> gold/bronze for ornate trim, cream text. **Don't flood red** over large areas
> — it collapses hierarchy.

What the template already gives you (keep, don't fight):
- Square corners (`--radius: 0`) — required for pixel.
- Dark surfaces + a metallic accent — classic retro "coin gold."
- Tile / info-dense grid layout — reads as inventory slots.
- Tailwind v4 `@theme` tokens — re-skin the whole site by swapping the token file.

---

## 1. Palette (from in-game UI screenshots)

Warm neutral dark panels + crimson CTA + gold trim. **KEY: keep surface levels
clearly stepped in lightness** — too-close levels make cards disappear into the
background.

### Surfaces (dark → light, warm neutral, clearly stepped)
| Token | Value | Use |
|---|---|---|
| `--site-surface-lowest` | `#141110` | footer / lowest |
| `--site-surface` | `#1A1614` | page bg (warm near-black) |
| `--site-surface-low` | `#221C19` | alternating section bg |
| `--site-surface-container` | `#2C2521` | card / panel (clearly lighter) |
| `--site-surface-high` | `#382F29` | card hover |
| `--site-surface-highest` | `#463A31` | raised tier |

### Foreground (warm cream)
| Token | Value | Use |
|---|---|---|
| `--site-on-surface` | `#F3E7D5` | body text |
| `--site-on-surface-variant` | `#BFAE9C` | secondary text |
| `--site-outline` | `#9A8674` | mono labels |
| `--site-outline-variant` | `#36302A` | 1px hairline rule |
| `--site-outline-strong` | `#574638` | card borders (visible warm) |

### Accent & functional
| Role | Token | Value | Note |
|---|---|---|---|
| Primary accent (trim / text / links / arrows / card top-edge) | `--site-primary` | `#D8AE62` | bronze gold |
| Crimson (primary buttons / banners / hot badges) | `--site-crimson` / `--site-secondary` | `#B23A3A` | the CTA color |
| Online / live / positive | `--site-green` | `#5BD46A` | player counts, buffs |
| Danger / nerf / alert | `--site-red` | `#FF6B5C` | coral — **deliberately distinct from crimson** |
| Info / link | `--site-blue` | `#5AA2FF` | info, external links |
| Magic / rare | `--site-purple` | `#C58BFF` | optional |
| Hard shadow / outline | `--ink` | `#0C0908` | **every hard shadow & outer outline uses this** |

> Primary CTA = `bg-site-crimson` + cream text + bevel. `text-site-primary`
> (gold) for eyebrows / section numbers / links / arrows / card top-edges.

### Tier colors (if your game has a tier list — generic S→F ramp)
`S=#E0503F` · `A=#E0954A` · `B=#D8AE62` · `C=#5BD46A` · `D=#5AA2FF` · `F=#8A7666`

### Class / role colors (per-game)
Add your own under `.site-theme` and `@theme` (e.g. `--class-tank`, `--class-dps`).
Pick hues that read at a glance and don't collide with the functional accents.

> Implementation: write each value into BOTH the `.site-theme` block (CSS vars
> the components read) and the `@theme` block (generates `bg-site-*` /
> `text-site-*` utilities) of the token preset.

---

## 2. Type system (rounded, NOT pixel)

In-game text is **rounded and bold** with a hard outline/shadow. Match it with
**Fredoka** across weights. **Do not** use an 8-bit pixel font for prose.

| Level | Font | Use |
|---|---|---|
| **Display (titles / hero / wordmark)** | `Fredoka` 700 + game-style hard `text-shadow` | `.site-display-lg` / `.site-pixel`: H1, wordmark, big numbers |
| **Headings / body / UI** | `Fredoka` 400–700 | paragraphs, card titles, nav, buttons |
| **Data / mono** | `JetBrains Mono` | value tables, prices, version stamps, § numbers, tiny labels |

> The `.site-pixel` class name is kept (so call sites don't change), but its
> definition is **Fredoka 700 + outline**, not a pixel font.

Implementation:
- Fonts centralized in `src/components/site/fonts.ts` (`next/font/google`),
  exposing `--font-site-display / -body / -mono`. `fontVars` is applied on the
  `SiteShell` root so header + footer inherit it.
- The token preset maps `--font-site-*` to Fredoka / JetBrains Mono.
- **Game-style outline:** `.site-display-lg` / `.site-pixel` use multi-direction
  `text-shadow` (`3px 3px 0 var(--ink)` + four 1px offsets) to fake the hard
  outlined title look.
- **Sizes:** titles `clamp(38px, 6.4vw, 76px)`; body ≥16px, `line-height: 1.7`.

---

## 3. The three pixel-texture techniques (core visual language)

Defined as opt-in utilities in `src/config/style/pixel-utils.css`.

### 3.1 Hard shadow (no blur)
The soul of the look. Cards / buttons / popovers use **pure-offset, zero-blur**
shadows:
```css
box-shadow: 4px 4px 0 0 var(--ink);   /* .px-shadow (default) */
box-shadow: 6px 6px 0 0 var(--ink);   /* .px-shadow-lg (big cards) */
box-shadow: 2px 2px 0 0 var(--ink);   /* .px-shadow-sm (small) */
```
> Replaces the blur-based `--shadow-*`. **No blur shadows in the pixel theme.**

### 3.2 Beveled / stepped borders
**A. Solid hard outline (default):** `border: 2px solid var(--ink);`

**B. 3D bevel (buttons / clickable blocks)** — classic 8-bit button:
```css
.px-bevel {
  border: 2px solid var(--ink);
  box-shadow:
    inset 2px 2px 0 0 rgba(255,255,255,0.25),   /* top-left highlight */
    inset -2px -2px 0 0 rgba(0,0,0,0.45),         /* bottom-right shade */
    4px 4px 0 0 var(--ink);                        /* outer hard shadow */
}
```

**C. Pixel notch corners (advanced, optional)** — `clip-path` to fake low-res
rounding. Accent use only; **breaks on mobile / overflow if overused** (see
`docs/PITFALLS.md`).

### 3.3 Pixel image rendering
Keep game art crisp when scaled: `img.pixel, .pixel-art { image-rendering: pixelated; }`.
Apply `.pixel-art` to sprites / screenshots / icons. Functional line icons
(lucide/tabler) can stay smooth.

---

## 4. Interaction & motion (restrained + tactile)

| Element | State | Behavior |
|---|---|---|
| button / clickable card | hover | lift: `translate(-2px,-2px)`, shadow → `6px 6px` |
| button / clickable card | active | press: `translate(2px,2px)`, shadow → `0 0` (snaps flat) |
| link | hover | hard 2px pixel underline (`box-shadow: 0 2px 0 currentColor`), no smooth transition |
| live/online dot | idle | green square `steps()` blink (not fade) |
| sprite | decoration | optional walk animation, `steps()` frames |

- Transitions use `steps()` not `ease`, to keep the "framey" feel:
  `transition: transform .08s steps(2), box-shadow .08s steps(2);`
- **`prefers-reduced-motion`** disables sprite/blink, keeps hover offset.

---

## 5. Component styling (against `src/components/site/ui.tsx`)

Pixelate existing components by **changing styles, not their API** — add `px-*`
classes per the table. Keep exported props stable so pages don't break.

| Component | Pixelation |
|---|---|
| `CtaPrimary` / `CtaSecondary` | `.px-bevel` gold / outlined ghost; hover lift, active press |
| `GuideCard` | "card/slot": `.px-shadow` + ink border + colored top-edge; hover lift |
| `Chip` | all-caps small label, 2px ink border; functional-color variants (green=live / red=alert / gold=hot) |
| `Stat` | "HUD value panel": big display number + mono label |
| `SectionHead` | numbered pixel badge + 2px solid rule below |
| `DataTable` | dark header block + JetBrains Mono; row hover; zebra via `surface-low` |
| `TierBadge` | filled tile by tier color + ink border + hard shadow (S/A/B/C/D/F) |
| `FaqAccordion` | pixel triangle (▸/▾); hard-bordered panels |
| `Breadcrumb` | pixel `>` arrows; current item gold |

Per-game additions you may need (not in template — build for your game): tier
rows, class/role cards, a live online counter, a patch/version badge. Keep them
token-driven and `px-*`-styled.

---

## 6. Texture & atmosphere (sparingly)

- **Background:** very faint pixel grid / dot matrix over `surface`
  (`.px-grid-bg`, opacity ~0.04).
- **Dividers:** 2px solid + 1px dark "double line," or pixel sawtooth.
- **Optional scanlines:** ≤0.03 opacity CRT overlay; skip if it costs readability/perf.
- **Corner accents:** pixel right-angle brackets on hero/feature cards.
- **Banned:** soft gradients, glassmorphism, big radii, blurred shadows.

---

## 7. Implementation checklist

1. **Token preset** (`src/components/site/themes/pixel.tokens.css`) — palette
   (§1) in both `.site-theme` and `@theme`; `--ink`, fonts, tier/class colors.
2. **`src/config/style/theme.css`** — `--radius: 0`; let `.px-shadow*` override
   the blur shadows at the component layer.
3. **Fonts** (`src/components/site/fonts.ts`) — Fredoka + JetBrains Mono via
   `next/font`, `display: 'swap'`; apply `fontVars` on `SiteShell`.
4. **Utilities** (`src/config/style/pixel-utils.css`) — `.px-shadow{,-sm,-lg}`,
   `.px-bevel`, `.px-corner`, `.pixel-art`, `steps()` transitions,
   `prefers-reduced-motion`. Import it from `global.css`.
5. **`src/components/site/ui.tsx`** — apply §5 styling per component (keep APIs).
6. **`public/`** — pixel sprites: logo, favicon, og-image, any art (`.pixel-art`).
7. **QA:** `pnpm dev` on home + a content page; check mobile `clip-path` and font
   sizes; verify `prefers-reduced-motion`; Lighthouse for font/CLS.

---

## 8. Risks & red lines

- ⚠️ **Never set body copy in a pixel font** — guides become unreadable; bounce
  up, SEO down. Rounded readable face only.
- ⚠️ **Subset + `display:swap`** any display font to avoid CLS.
- ⚠️ **`clip-path` notches** bug out on mobile/overflow — accent use only.
- ⚠️ **Palette discipline** — every new color becomes a §1 token; no bare hex in markup.
- ⚠️ **All decorative motion** gated behind `prefers-reduced-motion`.

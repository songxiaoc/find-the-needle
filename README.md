# Game Wiki Template

English · [简体中文](./README.zh-CN.md)

A production-ready Next.js base for **unofficial fan guide / wiki sites**. Brings the boring stuff (shell, theme, SEO patterns, MDX, i18n, deploy) and gets out of your way for page structure.

Hands-on steps: **[Quick Start](./docs/QUICKSTART.md)**.

## Philosophy

Every game guide site looks different — souls-likes want walkthroughs + boss pages, roguelites want classes + items + builds, card games want cards + decks + meta. This template makes **no assumptions about your page structure**. It ships:

- A configurable site shell + five build-time theme presets
- A validated adaptive UI recipe (`src/generated/ui-recipe.json`) with data attributes and generated tokens
- A library of UI primitives for guide writing
- SEO patterns (canonical, JSON-LD Article/Breadcrumb, sitemap, robots, llms.txt)
- Fumadocs MDX docs, next-intl i18n, Tailwind + Radix, and OpenNext-on-Cloudflare deploy

It's intentionally lean — a content/SEO site, **not** a SaaS starter. There's no auth,
admin console, database, or payments wired up (a guide site doesn't need them). You design
your own URL structure and pages. Everything below is a **placeholder for "Example Game"** — replace it.

## What you get out of the box

```
/                       Home — composable block list (src/config/homepage.ts)
/guides                 Guides hub (categories from src/config/guides.ts)
/guides/bosses          Category listing — auto-grouped from content/guides/bosses/
/guides/bosses/example-boss        Seed guide — the content-driven pattern to copy
/guides/tier-list/example-tier-list  A second seed, in a second category
/database               Entity hub (kinds from src/config/entities.ts)
/database/items         Entity catalog with facet filters
/database/items/ashen-greatsword   Entity detail page (content/entities/items/*.json)
/about                  About + sourcing policy (config-driven)
/contact                Contact
/faq                    FAQ (placeholder Q&A)
/system-requirements    Specs table (placeholder values)
/troubleshooting        Common issues (placeholder)
/privacy-policy         Legal — config-driven, ready to ship
/terms-of-service       Legal — config-driven, ready to ship
/docs, /docs/example-doc Fumadocs MDX section + one example doc
/sitemap.xml  /robots.txt  /llms.txt
```

These are scaffolds, not a finished site. The home page, guides, FAQ, and reference
pages all ship with "Example Game" placeholder copy marked *replace this*. Delete the
pages you don't need and assemble your own from the recipes below — **no assumptions are
made about your content architecture.**

## 5-minute setup

Follow **[docs/QUICKSTART.md](./docs/QUICKSTART.md)** for clone → run → first content. Short version:

1. **Edit [`src/generated/game-config.ts`](./src/generated/game-config.ts)** — site name, domain, game name, tagline, version, nav, disclaimer. [`src/config/game.ts`](./src/config/game.ts) is the typed adapter; header, footer, SEO metadata, sitemap, robots, and llms.txt are all generated from these values.
2. **Replace the placeholder content** — edit/replace `src/config/guides.ts`, `src/config/homepage.ts`, `content/docs/*`, and the genericized pages under `src/app/[locale]/`. Swap `public/logo.png`, `public/favicon.png`, `public/og-image.png` for your own.
3. **Select the visual contract** — choose a preset via [`docs/THEMES.md`](./docs/THEMES.md) and, if you need to, edit the safe defaults under `src/generated/`.
4. **Build your pages** — create folders under `src/app/[locale]/<slug>/page.tsx`, compose with the UI building blocks below, add the slug to `nav` / `footerExtras`, and add the URL to [`src/app/sitemap.ts`](./src/app/sitemap.ts).

## Develop

```bash
pnpm install
pnpm dev
```

Visit http://localhost:3000

## Checks

```bash
pnpm quality:gate
```

That runs Prettier, ESLint, `tsc`, `validate:site`, and a production build. `validate:site` enforces the contract in [`template-contract.json`](./template-contract.json) (locales, assets, homepage blocks, generated config).

## Adaptive UI contract

The template keeps routing, content, SEO and accessibility stable while exposing a controlled visual recipe. The generated contract consists of:

```text
DESIGN.md
src/generated/ui-recipe.json
src/generated/visual-profile.json
src/generated/asset-manifest.json
src/generated/design-tokens.css
```

`src/config/ui.ts` validates the recipe loudly at build time and exposes it as `data-ui-*` attributes on the `.site-theme` root. Components may consume only the supported recipe enums; the contract does not authorize arbitrary generated React. Existing sites remain compatible because the repository ships a tactical safe default.

## UI building blocks

All exported from [`src/components/site/ui.tsx`](./src/components/site/ui.tsx). Wrap pages in `SiteShell` from [`src/components/site/SiteShell.tsx`](./src/components/site/SiteShell.tsx) so they inherit header, footer, and theme.

| Component | Use for |
|---|---|
| `Hero` | Landing / section opener with eyebrow + title + subtitle + 1-2 CTAs |
| `Section`, `ArticleContainer` | Layout wrappers |
| `SectionTitle` | Eyebrow + h2 pair |
| `Breadcrumb` + `BreadcrumbJsonLd` | Nav crumbs + matching JSON-LD |
| `ArticleHeader` | h1 + last-updated + reading time |
| `QuickAnswer` | Voice-search-friendly TL;DR paragraph |
| `DataTable` | Generic table (rows are objects, columns key off them) |
| `TierBadge` (+ `Tier`) | S/A/B/C/D badge for tier lists |
| `FaqAccordion` (+ `FaqItem`) | Accordion FAQ (also emit FAQPage JSON-LD yourself) |
| `Checklist`, `MistakeList` | Bulleted checkmark / strike lists |
| `GuideCard`, `QuickStartCard` | Card variants |
| `RelatedGuides` | Cross-link footer block |
| `Sources` | Cited-sources footer block |
| `Chip`, `Stat`, `SectionHead` | Tactical-Console primitives (badges, stat tiles, numbered headers) |

## Page recipes

### Listicle / how-to article (e.g. beginner guide)

```tsx
<SiteShell activeHref="/beginner-guide">
  <ArticleContainer>
    <Breadcrumb items={crumbs} />
    <ArticleHeader h1="..." lastUpdated="2026-01-01" readingTime="8 min" />
    <QuickAnswer>One-paragraph TL;DR…</QuickAnswer>
    <h2>First-run priorities</h2>
    <DataTable caption="…" columns={[…]} rows={…} />
    <MistakeList items={[…]} />
    <Checklist items={[…]} />
    <FaqAccordion items={faq} />
    <RelatedGuides items={[…]} />
  </ArticleContainer>
</SiteShell>
```

### Tier list

```tsx
const rows = classes.map(c => ({
  name: c.name,
  role: c.role,
  solo: <TierBadge tier={c.solo} />,
  coop: <TierBadge tier={c.coop} />,
}));

<DataTable
  caption="Class tier list"
  columns={[
    { key: 'name', label: 'Class' },
    { key: 'role', label: 'Role' },
    { key: 'solo', label: 'Solo' },
    { key: 'coop', label: 'Co-op' },
  ]}
  rows={rows}
/>
```

### Catalog (items, bosses, weapons) — use the Entity layer

The template ships a generic catalog/detail pattern: register a kind in
[`src/config/entities.ts`](./src/config/entities.ts), drop JSON files under
`content/entities/<kind>/`, and the shared catch-all route renders the hub,
the faceted catalog, and every detail page. **Do not add another `page.tsx`.**
See [`docs/ENTITIES.md`](./docs/ENTITIES.md).

Records are filesystem-backed and validated with Zod at build time — invalid
fields, mismatched filenames, broken Entity relations, and missing related
Guides all fail the build with a file-specific error. There is no runtime
database; if you outgrow JSON, bring your own data layer.

### Walkthrough (sequential chapters)

Similar to catalog, but add prev/next links. The template has no built-in chapter component yet; compose with `ArticleHeader` + a custom prev/next footer.

## SEO patterns to copy

Every page should have:

- `generateMetadata` with `title`, `description`, `alternates.canonical`, `openGraph`
- A JSON-LD `<script>` (Article / WebSite / FAQPage as appropriate)
- For sub-pages: `BreadcrumbJsonLd` matching the visible `Breadcrumb`

Look at [`src/app/[locale]/privacy-policy/page.tsx`](./src/app/[locale]/privacy-policy/page.tsx) for the smallest complete example.

## Deploy

Cloudflare via OpenNext (`pnpm cf:deploy`) is preconfigured. Self-host with the `Dockerfile`, or import the repo into Vercel as a standard Next.js app.

## Underneath

MIT licensed — see [LICENSE](./LICENSE), and [NOTICE](./NOTICE) for the
third-party components (shadcn/ui, Radix, Tailwind, next-intl, Fumadocs).
See [CONTRIBUTING.md](./CONTRIBUTING.md) and the
[Code of Conduct](./CODE_OF_CONDUCT.md).

There is no ORM and no runtime database. Structured game data lives in
`content/entities/*.json` and is validated with Zod at build time, so the whole
site pre-renders to static assets and runs on a Cloudflare Worker with no
stateful backend to operate.

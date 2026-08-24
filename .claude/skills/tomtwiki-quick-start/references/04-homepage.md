# Homepage copy

Edit `src/generated/homepage.ts`. Leave `src/config/homepage.ts` alone; it only parses.

Rewrite strings. Keep each block's `id` and `type` unless the user asked to add or drop a section.

| id | type | Rewrite |
|---|---|---|
| `hero` | `hero` | `eyebrow`, `title`, `description`, `ctas[].label` (keep `/guides`, `/about` if those pages exist) |
| `start` | `start-cards` | Titles and descriptions. Keep `href`s on seed guides until new ones exist |
| `database-stats` | `database-stats` | `title` / `sub` |
| `entity-index` | `entity-index` | `title` / `sub` |
| `latest-guides` | `latest-guides` | `title` / `sub` |
| `categories` | `category-grid` | `title` / `sub` |
| `faq` | `faq` | Every `q` / `a`. No `Example Game` or `Replace this` |

`pnpm validate:site` requires every internal homepage `href` to exist. Do not invent `/guides/foo` without a file under `content/guides/`.

`start-cards` items: `type` is `latest` or `featured`; `tagTone` is `amber`, `blue`, `red`, `green`, `mute`, or `solid`. Skip `code-cards` / `tier-grid` unless the user has real codes or tiers. `generatedHomeI18n` stays `{}` for English-only.

If they want more sections and the links resolve: `code-cards`, `tier-grid`, `step-by-step`, `card-list`, `about`, `final-cta`.

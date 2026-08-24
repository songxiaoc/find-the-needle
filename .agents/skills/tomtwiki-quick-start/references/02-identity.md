# Site identity

Edit `src/generated/game-config.ts`. Leave `src/config/game.ts` alone; it is the typed adapter. `origin` is `https://${domain}` — do not store `origin` on this object.

Keep the object shape. Fill:

| Key | Notes |
|---|---|
| `siteName` | Header, footer, metadata fallback |
| `domain` | Hostname only |
| `gameFullName` / `gameShortName` | |
| `tagline` | One sentence |
| `gameVersion` | |
| `statusBadge` | `""` hides it; keep the key |
| `eaLaunchDate` | `YYYY-MM-DD` |
| `steamAppId` | `""` if unknown; keep the key |
| `heroFacts` | `{ label: string }[]` under the hero |
| `playUrl` / `playLabel` | Store or official CTA |
| `social` | Adapter keys only: `discord`, `youtube`, `x`, `roblox` |
| `contactEmail` | |
| `coverImage` | `""` or key art / a store banner under `public/`; never use it as a gameplay screenshot |
| `gameplayImage` | `""` or a clean gameplay screenshot under `public/`; required by `gameplay-panel` |
| `heroStyle` | `text-only` \| `cover-split` \| `gameplay-panel` \| `video-center` |
| `trailerUrl` | Required for `video-center` |
| `game.genre` / `game.platforms` | Short factual lists |
| `nav` | Keep shipped routes (`/guides`, `/faq`, `/about`) |
| `disclaimer.publisher` / `disclaimer.trademarkHolders` | Real names only |

Also:

- `src/generated/visual-profile.json` — `game`, `genre`, `evidence[].source` (no `REPLACE_WITH_OFFICIAL_SOURCE`)
- `src/generated/asset-manifest.json` — `hero.title` (no `Example Game`)

In `src/generated/site-locales.ts`, delete `// scaffold-default:en-only` even if English stays the only language. Docs and `pnpm validate:site` treat that comment as "still a template". Extra languages need `src/config/locale/messages/<lang>/common.json` and homepage i18n; skip unless asked.

Do not retarget `nav` at routes this template does not ship. Do not call the site official.

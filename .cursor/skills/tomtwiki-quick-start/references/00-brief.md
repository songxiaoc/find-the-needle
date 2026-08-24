# Game brief

Ask for a game name and a hostname. Fill the rest with defaults or `TODO:` — do not stall.

## Must have

- **gameFullName** — e.g. `Hades II`
- **domain** — hostname only, e.g. `hades2.wiki`

## Defaults if the user skipped them

- **gameShortName** — initials of `gameFullName`
- **siteName** — `{gameFullName} Guide`
- **tagline** — `Guides, builds, and a living reference for {gameFullName}.`
- **gameVersion** — `1.0.0`
- **statusBadge** — `""` (hides the chip; keep the key)
- **eaLaunchDate** — today, or a date the user stated. Do not fabricate history.
- **steamAppId** — `""`. Never guess.
- **heroFacts** — up to four `{ label }` chips (genre, platform, version)
- **playUrl** / **playLabel** — `""` / `Play now`
- **contactEmail** — `""`
- **coverImage** — key art / store banner only; use a real file under `public/` when possible
- **gameplayImage** — a clean gameplay screenshot, used only by `gameplay-panel`
- **heroStyle** — `text-only` by default; use `cover-split` for key art, `gameplay-panel` for a clean gameplay screenshot, or `video-center` for a trailer
- **trailerUrl** — `""` unless `heroStyle` is `video-center`
- **accentColor** — hex; borrow from official art if they did not pick one
- **theme** — `tactical` unless the game clearly fits `pixel`, `neon`, `aurora`, or `sakura`
- **locales** — `["en"]` unless they asked for more
- **publisher** / **trademarkHolders** — real names, or a cautious fan-site line plus `TODO:`
- **referenceLinks** — official site, store, wiki, Reddit. Facts only; do not scrape art.

## Guardrails

- Unofficial fan site. No publisher voice, no endorsement claim.
- Do not paste a competitor's article. User-supplied and official facts are fine.
- Leave analytics IDs blank unless the user pasted them.

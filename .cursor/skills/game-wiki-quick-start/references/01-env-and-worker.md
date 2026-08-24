# Worker and environment

Start from `.env.example`. Write a local `.env` (gitignored). Add `.dev.vars` only if they will run `pnpm cf:preview`. Edit `wrangler.jsonc`.

## `.env`

Need these two; they are what `.env.example` and `src/config/index.ts` read:

- `NEXT_PUBLIC_APP_URL` — `https://<domain>` (localhost is fine while developing)
- `NEXT_PUBLIC_APP_NAME` — the **siteName**

Do not invent `SITE_*` names.

Leave blank unless the user pasted IDs:

- `NEXT_PUBLIC_GOOGLE_ANALYTICS_ID`
- `NEXT_PUBLIC_PLAUSIBLE_ID`
- `NEXT_PUBLIC_CLARITY_ID`

No database URL, no auth secret. This template has neither.

`.dev.vars` for Worker preview is one line:

```
NEXTJS_ENV=development
```

## Cloudflare worker

In `wrangler.jsonc`, the top-level `"name"` and the `services[]` item with `"binding": "WORKER_SELF_REFERENCE"` (`"service"`) must be the same kebab-case slug (from domain or short name). Leaving `game-wiki-template` collides with other workers on the same account.

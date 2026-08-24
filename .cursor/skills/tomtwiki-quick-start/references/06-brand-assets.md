# Logo, favicon, social preview

`src/generated/asset-manifest.json` points at:

- `public/logo.png` → `/logo.png`
- `public/favicon.png` → `/favicon.png`
- `public/og-image.png` → `/og-image.png`

Also write `public/favicon.ico` (browsers fetch it first). Never add `src/app/favicon.ico`.

If the user handed over art, resize it into those names so the manifest URLs stay put.

If they did not, this tree often has no PNGs in `public/` yet. Run the in-repo generator — do not keep Example Game marks:

```bash
node scripts/gen-brand-assets.mjs \
  --game "<gameFullName>" \
  --short "<gameShortName>" \
  --domain "<domain>" \
  --color "<#accent>" \
  --tagline "<tagline>"
```

`--emblem path/to/square.png` is optional. The script may also emit `apple-touch-icon.png`, `icon-192.png`, `icon-512.png`. Keep them. Run `pnpm install` first if `sharp` is missing.

Then:

- Manifest paths still match disk
- `hero.title` in the manifest is the real game
- Rebuild after deleting `.next` if an old logo is still served

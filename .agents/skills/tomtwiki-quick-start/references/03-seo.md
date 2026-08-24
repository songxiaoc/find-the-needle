# Titles and meta

Edit `src/config/locale/messages/en/common.json`. For any extra language in this pass, add `src/config/locale/messages/<lang>/common.json` with the same keys.

Put the public strings on `metadata.title`, `metadata.description`, and `metadata.keywords`.

- title: `{gameFullName} Guide`, optionally with a short promise after an em dash
- description: one or two sentences; unofficial fan site; no fake ratings
- keywords: game name plus a few queries the pages will actually support

Strip `Example Game`. Do not pad the keyword list. The home document title comes from `common.metadata`, not from `siteName`.

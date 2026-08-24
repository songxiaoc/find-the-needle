# Contributing

## Setup

```bash
pnpm install   # lockfile is pnpm 10.x (`lockfileVersion: '9.0'`)
pnpm dev       # http://localhost:3000
```

Use pnpm 10.34.5 (the version CI pins) so you do not rewrite `pnpm-lock.yaml` to a newer format. Node 24 is required (`engines.node`).

## Checks

```bash
pnpm quality:gate
```

That runs, in order: Prettier check → ESLint → `tsc --noEmit` → `validate:site` → `next build`. A PR that fails any step will fail CI.

`validate:site` enforces the template contract in `template-contract.json`: locales, assets, homepage blocks, and generated config stay consistent.

## Pull requests

- Keep the change scoped. This is a template: avoid adding auth, a database, or a SaaS admin console.
- Do not commit secrets, `.env`, or `.dev.vars`.
- User-facing copy for the placeholder site stays generic ("Example Game"). Do not add a real game's name, domain, or assets.
- Architecture notes live in `CLAUDE.md` and `docs/`. Update them when behavior changes.

## License

By contributing you agree that your contribution is licensed under the MIT License in [`LICENSE`](./LICENSE).

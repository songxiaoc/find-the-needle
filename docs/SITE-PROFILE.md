# Site profile

`siteProfile` describes the site's **product structure**. It is deliberately
separate from both game identity and visual theme configuration.

```text
gameConfig   = which game and brand this site represents
theme preset = how the site looks
siteProfile  = which structural/product capabilities the site can use
```

The configuration lives in `src/config/site-profile.ts` and is also exported
from `@/config`.

## Shell preset

```ts
type ShellPreset = 'editorial' | 'wiki' | 'database';
```

| Preset      | Intended use                                                                   |
| ----------- | ------------------------------------------------------------------------------ |
| `editorial` | Small guide sites and long-form reading pages.                                 |
| `wiki`      | Guide portals with a persistent supporting rail. This is the template default. |
| `database`  | Entity-heavy sites with domain navigation and a wide data workspace.           |

Stage 1 defined this contract. Stage 3 wires it into `WikiShell`, so changing
this single value switches the homepage/workspace structure without editing
page components.

Runtime behavior:

- `editorial` uses a centered 960px content column and no desktop rail.
- `wiki` keeps the existing main-column + 320px right-rail layout.
- `database` moves the same supporting navigation into a 260px left rail.
- Below `lg`, all presets use the shared mobile drawer instead of duplicating
  the desktop rail in page flow.

## Feature switches

Features are explicit so that a small guide site does not automatically inherit
the complexity or bundle cost of a database/product site.

```ts
features: {
  search: false,
  patchStatus: true,
  entities: true,
  tools: false,
  saveImport: false,
  community: false,
  market: false,
}
```

> The template default enables `entities` because Stage 4 shipped the Entity
> layer (see [`ENTITIES.md`](./ENTITIES.md)) and the default `HOME_BLOCKS` include
> the `database-stats` / `entity-index` blocks. Registered kinds with zero JSON
> records still render nothing, so a site that never adds records sees no Entity
> UI either way — set it to `false` to strip the routes entirely.

Rules:

- A disabled feature must render no UI, route, empty panel, or dead link.
- Enabling a feature does nothing until its implementation stage is complete.
- Search stays disabled until content scale justifies a site-wide index.
- Game-specific functionality belongs behind a feature switch or adapter, not
  in the base theme package.

## Navigation groups

`navigationGroups` is the future structural navigation registry. The default
group reuses `gameConfig.nav`, so there is still one source of truth for the
links already shown in the header.

```ts
navigationGroups: [
  {
    id: 'primary',
    label: 'Explore',
    items: gameConfig.nav,
  },
];
```

The compact helper `getPrimaryNavigation()` returns a flattened copy for future
header consumers. Stage 1 does not wire it into `SiteShell` or `MobileNav`.

## Data status

`dataStatus` stores honest provenance metadata for a future site-wide version
strip:

```ts
dataStatus: {
  label: 'Tracked build',
  sourceLabel: 'Version-stamped guides',
  // verifiedAt: '2026-07-21',
  // changelogHref: '/patch-notes',
}
```

- `verifiedAt` should be an ISO `YYYY-MM-DD` date.
- Omit fields the site cannot substantiate.
- Do not describe data as live or verified unless the update pipeline supports
  that claim.
- No status UI is introduced in Stage 1.

## Stage 1 boundary (historical)

Stage 1 added configuration only. It intentionally did not modify:

- `SiteShell` or `WikiShell`
- desktop or mobile navigation
- homepage blocks
- guide routes
- PatchBar/status UI
- entity routes
- search or SearchAction JSON-LD

That boundary kept the change reviewable and guaranteed no visual regression.

Later stages consumed the contract: Stage 3 wired `shellPreset` into
`WikiShell`, and Stage 4 wired `features.entities` into the Entity routes and
homepage blocks. `search`, `tools`, `saveImport`, `community`, and `market` are
still contract-only — flipping them changes nothing yet.

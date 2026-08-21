# Homepage database stats

`database-stats` is an optional homepage data block. It summarizes the Entity
records already published by the site; it does not contain manually maintained
numbers.

## Enable and position

Add the block anywhere in `HOME_BLOCKS`:

```ts
{
  type: 'database-stats',
  title: 'Database at a glance',
  sub: 'A live summary calculated from the structured records published on this site.',
}
```

The default template places it after `start-cards` and before `entity-index`.
The block is automatically omitted when there are no published Entity kinds, so
section numbering stays continuous.

## Data sources

The renderer calculates all four values from the Entity context loaded by the
homepage:

- published records: total records across enabled Entity kinds;
- collections: number of enabled, published Entity kinds;
- linked guides: distinct guide paths referenced by records;
- latest record update: newest `updatedAt` date across all records.

Update Entity JSON files normally; the homepage summary follows automatically.

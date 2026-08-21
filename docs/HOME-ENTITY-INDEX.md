# Entity index homepage block

Stage 6 adds one optional homepage data block: entity-index.

The block reads the published Entity registry at build time and renders:

- each published Entity collection and its actual record count;
- a short collection description;
- a configurable number of record previews;
- semantic field values from the shared Entity field definitions;
- links to the database hub, catalog, and detail records.

Configure it in src/config/homepage.ts:

    {
      type: 'entity-index',
      title: 'Browse the database',
      sub: 'Structured records with comparable attributes.',
      previewLimit: 3
    }

The block is intentionally absent when Entity features are disabled or every
registered collection is empty. Hidden data blocks do not consume a homepage
section number.

No other Stage 6 block is implemented or enabled by this change.

# Entity data

The Entity layer adds structured game records beside the existing MDX Guide
system. Stage 4 ships one example kind, items, through one generic route:

    /database
    /database/items
    /database/items/ashen-greatsword

## Add a record

Create a JSON file under content/entities/<kind>/. The filename must match the
record ID.

Every file is parsed with Zod during the production build. Invalid fields,
invalid IDs, mismatched filenames, broken Entity relations, and missing related
Guides fail the build with a file-specific error.

## Add another kind

Add one entry to ENTITY_KINDS in src/config/entities.ts, then add JSON files
under a matching folder. The registry defines:

- route and labels;
- filter facets;
- fields visible on cards;
- detail-page sections and their fields.

Do not add another page.tsx. The shared catch-all route renders the hub,
catalog, and detail views for every registered kind.

## Link Guides and Entities

Entity JSON uses relatedGuides:

    {
      "relatedGuides": ["/guides/bosses/example-boss"]
    }

MDX Guides use the server-side EntityLink component:

    <EntityLink kind="items" id="ashen-greatsword">
      Ashen Greatsword
    </EntityLink>

When the target record is absent, EntityLink renders its children as plain
text. It never leaves a dead anchor.

## Publication behavior

- siteProfile.features.entities = false removes all Entity routes and UI.
- Registered kinds with zero JSON records are omitted from navigation, routes,
  and sitemap.
- If every kind is empty, the Database navigation item and hub disappear.
- Data stays filesystem-backed and build-time only; this stage does not add a
  live database, player save import, or global search.

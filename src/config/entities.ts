import type { SemanticDomain } from './game-semantics';

export type EntityScalar = string | number | boolean;

export type EntityFieldDefinition = {
  readonly id: string;
  readonly label: string;
  readonly semantic?: SemanticDomain;
};

export type FilterDefinition = {
  readonly field: string;
  readonly label: string;
  readonly options?: readonly string[];
};

export type DetailSectionDefinition = {
  readonly id: string;
  readonly label: string;
  readonly description?: string;
  readonly fields: readonly string[];
};

export type EntityKind = {
  readonly id: string;
  readonly label: string;
  readonly singularLabel: string;
  readonly route: string;
  readonly description: string;
  readonly fields: readonly EntityFieldDefinition[];
  readonly facets: readonly FilterDefinition[];
  readonly cardFields: readonly string[];
  readonly detailSections: readonly DetailSectionDefinition[];
};

export type EntityRelation = {
  readonly kind: string;
  readonly id: string;
};

export type EntityRecord = {
  readonly kindId: string;
  readonly id: string;
  readonly name: string;
  readonly summary: string;
  readonly image?: string;
  readonly updatedAt: string;
  readonly version: string;
  readonly data: Readonly<Record<string, EntityScalar>>;
  readonly relatedEntities: readonly EntityRelation[];
  readonly relatedGuides: readonly string[];
  readonly href: string;
};

export const ENTITY_KINDS: readonly EntityKind[] = [
  {
    id: 'items',
    label: 'Items',
    singularLabel: 'Item',
    route: '/database/items',
    description:
      'Browse equipment and consumables with comparable attributes, acquisition sources, and guide references.',
    fields: [
      { id: 'type', label: 'Type' },
      { id: 'rarity', label: 'Rarity', semantic: 'rarity' },
      { id: 'slot', label: 'Slot' },
      { id: 'power', label: 'Power' },
      { id: 'weight', label: 'Weight' },
      { id: 'source', label: 'Source' },
      { id: 'location', label: 'Location' },
    ],
    facets: [
      { field: 'type', label: 'Type' },
      { field: 'rarity', label: 'Rarity' },
    ],
    cardFields: ['type', 'rarity', 'power'],
    detailSections: [
      {
        id: 'identity',
        label: 'Classification',
        fields: ['type', 'rarity', 'slot'],
      },
      {
        id: 'attributes',
        label: 'Base attributes',
        fields: ['power', 'weight'],
      },
      {
        id: 'acquisition',
        label: 'Acquisition',
        fields: ['source', 'location'],
      },
    ],
  },
];

export function getEntityKind(id: string): EntityKind | undefined {
  return ENTITY_KINDS.find((kind) => kind.id === id);
}

export function getEntityField(
  kind: EntityKind,
  fieldId: string
): EntityFieldDefinition | undefined {
  return kind.fields.find((field) => field.id === fieldId);
}

import { getEntityCopy } from '@/content/entity-copy';

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
  readonly imageAlt?: string;
  readonly imageCaption?: string;
  readonly imagePosition?: string;
  readonly imageZoom?: number;
  readonly updatedAt: string;
  readonly version: string;
  readonly data: Readonly<Record<string, EntityScalar>>;
  readonly sources: readonly { readonly label: string; readonly url: string }[];
  readonly relatedEntities: readonly EntityRelation[];
  readonly relatedGuides: readonly string[];
  readonly href: string;
};

function kindsForLocale(locale: string): EntityKind[] {
  const copy = getEntityCopy(locale);
  return ['machines', 'tools', 'products'].map((id) => ({
    id,
    ...copy.kinds[id as keyof typeof copy.kinds],
    route: `/database/${id}`,
    fields: Object.entries(copy.fields).map(([fieldId, label]) => ({
      id: fieldId,
      label,
    })),
    facets: [
      { field: 'role', label: copy.fields.role },
      { field: 'scope', label: copy.fields.scope },
    ],
    cardFields: ['role', 'scope'],
    detailSections: [
      { id: 'use', label: copy.use, fields: ['function', 'operation'] },
      {
        id: 'checks',
        label: copy.checks,
        fields: ['check', 'community', 'limits'],
      },
      {
        id: 'products',
        label: copy.productTypes,
        fields: ['pulp', 'bales', 'bricks', 'paper', 'pellets'],
      },
    ],
  }));
}

export const ENTITY_KINDS: readonly EntityKind[] = kindsForLocale('en');

export function getEntityKind(
  id: string,
  locale = 'en'
): EntityKind | undefined {
  return kindsForLocale(locale).find((kind) => kind.id === id);
}

export function getEntityField(
  kind: EntityKind,
  fieldId: string
): EntityFieldDefinition | undefined {
  return kind.fields.find((field) => field.id === fieldId);
}

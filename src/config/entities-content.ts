import 'server-only';

import fs from 'fs';
import path from 'path';
import { z } from 'zod';

import {
  ENTITY_KINDS,
  getEntityKind,
  type EntityKind,
  type EntityRecord,
} from './entities';
import { locales } from './locale';
import { localeOfFile, stripLocaleSuffix } from './locale/wiring';
import { siteProfile } from './site-profile';

const ENTITIES_DIR = path.join(process.cwd(), 'content/entities');
const ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

const entityScalarSchema = z.union([
  z.string(),
  z.number().finite(),
  z.boolean(),
]);

const entityFileSchema = z
  .object({
    id: z.string().regex(ID_PATTERN),
    name: z.string().trim().min(1),
    summary: z.string().trim().min(1),
    image: z.string().trim().min(1).optional(),
    imageAlt: z.string().trim().min(1).optional(),
    imageCaption: z.string().trim().min(1).optional(),
    updatedAt: z.string().regex(ISO_DATE_PATTERN),
    version: z.string().trim().min(1),
    data: z.record(z.string(), entityScalarSchema),
    sources: z
      .array(
        z.object({
          label: z.string().trim().min(1),
          url: z.url().startsWith('https://'),
        })
      )
      .min(1),
    relatedEntities: z
      .array(
        z.object({
          kind: z.string().regex(ID_PATTERN),
          id: z.string().regex(ID_PATTERN),
        })
      )
      .default([]),
    relatedGuides: z
      .array(z.string().regex(/^\/guides\/[a-z0-9/-]+$/))
      .default([]),
  })
  .strict();

function validationError(filePath: string, issues: z.ZodIssue[]): Error {
  const details = issues
    .map((issue) => `  - ${issue.path.join('.') || 'root'}: ${issue.message}`)
    .join('\n');
  return new Error(
    `[entities] Invalid data in ${path.relative(process.cwd(), filePath)}:\n${details}`
  );
}

function validateKindRegistry(kind: EntityKind) {
  const fields = new Set(kind.fields.map((field) => field.id));
  const references = [
    ...kind.facets.map((facet) => facet.field),
    ...kind.cardFields,
    ...kind.detailSections.flatMap((section) => section.fields),
  ];
  const unknown = [
    ...new Set(references.filter((field) => !fields.has(field))),
  ];

  if (unknown.length > 0) {
    throw new Error(
      `[entities] Kind "${kind.id}" references unknown fields: ${unknown.join(', ')}`
    );
  }
}

function readEntityFile(kind: EntityKind, filePath: string): EntityRecord {
  let json: unknown;

  try {
    json = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    throw new Error(
      `[entities] Could not parse ${path.relative(process.cwd(), filePath)}: ${error instanceof Error ? error.message : String(error)}`
    );
  }

  const parsed = entityFileSchema.safeParse(json);
  if (!parsed.success) {
    throw validationError(filePath, parsed.error.issues);
  }

  const fileId = stripLocaleSuffix(path.basename(filePath, '.json'));
  if (fileId !== parsed.data.id) {
    throw new Error(
      `[entities] Filename "${fileId}.json" must match entity id "${parsed.data.id}".`
    );
  }

  const knownFields = new Set(kind.fields.map((field) => field.id));
  for (const field of Object.keys(parsed.data.data)) {
    if (!knownFields.has(field))
      throw new Error(`[entities] Unknown field "${field}" in ${filePath}.`);
  }
  if (parsed.data.image) {
    if (
      !parsed.data.imageAlt ||
      !parsed.data.image.startsWith('/images/') ||
      !fs.existsSync(path.join(process.cwd(), 'public', parsed.data.image))
    ) {
      throw new Error(
        `[entities] Image must have descriptive alt text and a real local file: ${filePath}.`
      );
    }
  }

  const locale = localeOfFile(filePath);
  const suffix = locale === 'en' ? '' : `.${locale}`;
  for (const relation of parsed.data.relatedEntities) {
    if (
      !getEntityKind(relation.kind) ||
      !fs.existsSync(
        path.join(ENTITIES_DIR, relation.kind, `${relation.id}${suffix}.json`)
      )
    ) {
      throw new Error(
        `[entities] Broken related entity ${relation.kind}/${relation.id} (${locale}) in ${filePath}.`
      );
    }
  }
  for (const href of parsed.data.relatedGuides) {
    const guidePath = path.join(
      process.cwd(),
      'content',
      `${href.slice(1)}${suffix}`
    );
    if (
      !['.mdx', '.md'].some((extension) =>
        fs.existsSync(`${guidePath}${extension}`)
      )
    ) {
      throw new Error(
        `[entities] Broken related guide ${href} (${locale}) in ${filePath}.`
      );
    }
  }

  return {
    ...parsed.data,
    kindId: kind.id,
    href: `${kind.route}/${parsed.data.id}`,
  };
}

export function getEntities(kindId: string, locale = 'en'): EntityRecord[] {
  if (!siteProfile.features.entities) return [];

  const kind = getEntityKind(kindId, locale);
  if (!kind) return [];
  validateKindRegistry(kind);

  const directory = path.join(ENTITIES_DIR, kind.id);
  if (!fs.existsSync(directory)) return [];

  const files = fs
    .readdirSync(directory, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith('.json'));
  for (const entry of files.filter(
    (entry) => localeOfFile(entry.name) === 'en'
  )) {
    const id = path.basename(entry.name, '.json');
    for (const activeLocale of locales) {
      const filename = `${id}${activeLocale === 'en' ? '' : `.${activeLocale}`}.json`;
      if (!files.some((file) => file.name === filename))
        throw new Error(
          `[entities] Missing ${activeLocale} translation for ${kind.id}/${id}.`
        );
    }
  }
  const entities = files
    .filter((entry) => localeOfFile(entry.name) === locale)
    .map((entry) => readEntityFile(kind, path.join(directory, entry.name)))
    .sort((a, b) => a.name.localeCompare(b.name));

  const ids = new Set<string>();
  for (const entity of entities) {
    if (ids.has(entity.id)) {
      throw new Error(
        `[entities] Duplicate id "${entity.id}" in kind "${kind.id}".`
      );
    }
    ids.add(entity.id);
  }

  return entities;
}

export function getAllEntities(locale = 'en'): EntityRecord[] {
  if (!siteProfile.features.entities) return [];
  return ENTITY_KINDS.flatMap((kind) => getEntities(kind.id, locale));
}

export function getPublishedEntityKinds(locale = 'en'): EntityKind[] {
  if (!siteProfile.features.entities) return [];
  return ENTITY_KINDS.filter(
    (kind) => getEntities(kind.id, locale).length > 0
  ).map((kind) => getEntityKind(kind.id, locale)!);
}

export function getEntity(
  kindId: string,
  entityId: string,
  locale = 'en'
): EntityRecord | undefined {
  return getEntities(kindId, locale).find((entity) => entity.id === entityId);
}

import { z } from 'zod';

const nonEmptyText = z.string().trim().min(1);
const href = nonEmptyText.refine(
  (value) =>
    (/^\/(?!\/)/.test(value) && !value.split('/').includes('..')) ||
    /^https?:\/\//.test(value),
  'Expected a safe root-relative URL or an HTTP(S) URL'
);

const ctaSchema = z
  .object({
    label: nonEmptyText,
    href,
  })
  .strict();

export const homeToneSchema = z.enum([
  'amber',
  'blue',
  'red',
  'green',
  'mute',
  'solid',
]);

const blockBase = {
  id: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
};

const heroSchema = z
  .object({
    ...blockBase,
    type: z.literal('hero'),
    eyebrow: nonEmptyText.optional(),
    title: nonEmptyText,
    description: nonEmptyText,
    ctas: z.array(ctaSchema).min(1),
  })
  .strict();

const startCardsSchema = z
  .object({
    ...blockBase,
    type: z.literal('start-cards'),
    title: nonEmptyText,
    items: z
      .array(
        z
          .object({
            type: z.enum(['latest', 'featured']),
            id: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
            href,
            title: nonEmptyText,
            description: nonEmptyText,
            readingTime: nonEmptyText,
            badge: z.enum(['NEW', 'UPDATED']).optional(),
            tag: nonEmptyText.optional(),
            tagTone: homeToneSchema,
          })
          .strict()
      )
      .min(1),
  })
  .strict();

const linkedCopy = {
  eyebrow: nonEmptyText.optional(),
  title: nonEmptyText,
  description: nonEmptyText.optional(),
  href: href.optional(),
};

const codeCardsSchema = z
  .object({
    ...blockBase,
    type: z.literal('code-cards'),
    ...linkedCopy,
    codes: z
      .array(
        z
          .object({
            code: nonEmptyText,
            reward: nonEmptyText,
            badge: nonEmptyText.optional(),
          })
          .strict()
      )
      .min(1),
  })
  .strict();

const tierGridSchema = z
  .object({
    ...blockBase,
    type: z.literal('tier-grid'),
    ...linkedCopy,
    rows: z
      .array(
        z
          .object({
            tier: nonEmptyText,
            label: nonEmptyText,
            detail: nonEmptyText,
            tone: homeToneSchema.optional(),
          })
          .strict()
      )
      .min(1),
  })
  .strict();

const stepByStepSchema = z
  .object({
    ...blockBase,
    type: z.literal('step-by-step'),
    ...linkedCopy,
    steps: z.array(z.object({ detail: nonEmptyText }).strict()).min(1),
  })
  .strict();

const cardListSchema = z
  .object({
    ...blockBase,
    type: z.literal('card-list'),
    ...linkedCopy,
    cards: z
      .array(z.object({ label: nonEmptyText, detail: nonEmptyText }).strict())
      .min(1),
  })
  .strict();

const aboutSchema = z
  .object({
    ...blockBase,
    type: z.literal('about'),
    title: nonEmptyText,
    paragraphs: z.array(nonEmptyText).min(1),
    stats: z
      .array(z.object({ label: nonEmptyText, value: nonEmptyText }).strict())
      .min(1),
    cta: ctaSchema.optional(),
  })
  .strict();

const finalCtaSchema = z
  .object({
    ...blockBase,
    type: z.literal('final-cta'),
    title: nonEmptyText,
    description: nonEmptyText.optional(),
    ctas: z.array(ctaSchema).min(1),
  })
  .strict();

function dataBlock<
  const T extends 'latest-guides' | 'category-grid' | 'database-stats',
>(type: T) {
  return z
    .object({
      ...blockBase,
      type: z.literal(type),
      title: nonEmptyText.optional(),
      sub: nonEmptyText.optional(),
    })
    .strict();
}

const entityIndexSchema = z
  .object({
    ...blockBase,
    type: z.literal('entity-index'),
    title: nonEmptyText.optional(),
    sub: nonEmptyText.optional(),
    previewLimit: z.number().int().positive().optional(),
  })
  .strict();

const faqSchema = z
  .object({
    ...blockBase,
    type: z.literal('faq'),
    title: nonEmptyText.optional(),
    sub: nonEmptyText.optional(),
    items: z
      .array(z.object({ q: nonEmptyText, a: nonEmptyText }).strict())
      .min(1),
  })
  .strict();

export const homeBlockSchema = z.discriminatedUnion('type', [
  heroSchema,
  startCardsSchema,
  codeCardsSchema,
  tierGridSchema,
  stepByStepSchema,
  cardListSchema,
  aboutSchema,
  finalCtaSchema,
  dataBlock('latest-guides'),
  dataBlock('category-grid'),
  dataBlock('database-stats'),
  entityIndexSchema,
  faqSchema,
]);

export const homeBlocksSchema = z.array(homeBlockSchema).min(1);
export const homeBlocksI18nSchema = z.record(z.string(), homeBlocksSchema);

export type HomeBlock = z.infer<typeof homeBlockSchema>;
export type HomeStartItem = Extract<
  HomeBlock,
  { type: 'start-cards' }
>['items'][number];
export type HomeTone = z.infer<typeof homeToneSchema>;

export function parseHomeBlocks(value: unknown): HomeBlock[] {
  return homeBlocksSchema.parse(value);
}

export function parseHomeBlocksI18n(
  value: unknown
): Record<string, HomeBlock[]> {
  return homeBlocksI18nSchema.parse(value);
}

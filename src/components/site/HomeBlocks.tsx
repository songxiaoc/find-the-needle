import type { ReactNode } from 'react';
import { DragScrollRow } from '@/components/site/DragScrollRow';
import { EntityFieldValue } from '@/components/site/entities/EntityFieldValue';
import { EntityImage } from '@/components/site/entities/EntityImage';
import { HeroTrailer } from '@/components/site/HeroTrailer';
import {
  Chip,
  CtaPrimary,
  CtaSecondary,
  FaqAccordion,
  GuideCard,
  SectionHead,
} from '@/components/site/ui';
import { getDiscoveryCopy } from '@/content/discovery-copy';
import { useTranslations } from 'next-intl';

import { Link } from '@/core/i18n/navigation';
import {
  getEntityCover,
  type EntityKind,
  type EntityRecord,
} from '@/config/entities';
import { gameConfig } from '@/config/game';
import type { HomeBlock } from '@/config/homepage';
import {
  homeBlockRecipe,
  uiRecipe,
  type HomepageBlockRecipe,
} from '@/config/ui';

/**
 * Composable homepage renderer. The homepage is NOT a fixed layout — it's the
 * ordered `HOME_BLOCKS` list rendered here. Each block's copy comes from config
 * (src/config/homepage.ts); nothing user-facing is hard-coded in this file.
 *
 * Two kinds of block:
 *   - copy blocks (hero, code-cards, tier-grid, step-by-step, card-list, about,
 *     final-cta, start-cards, faq) — fully driven by their config props.
 *   - data blocks (latest-guides, category-grid, database-stats, entity-index) — need runtime data passed via
 *     `ctx` (computed per-request in page.tsx because it depends on locale).
 */
export type HomeCtx = {
  locale: string;
  totalGuides: number;
  latestGuides: {
    slug: string;
    href: string;
    title: string;
    description: string;
    lastModified?: string;
    date?: string;
  }[];
  guideCategories: {
    slug: string;
    title: string;
    count: number;
    overviewDescription?: string;
    icon: React.ComponentType;
  }[];
  entityKinds: {
    kind: EntityKind;
    entities: EntityRecord[];
  }[];
};

const sectionNumberedTypes = new Set([
  'start-cards',
  'code-cards',
  'tier-grid',
  'step-by-step',
  'card-list',
  'latest-guides',
  'category-grid',
  'database-stats',
  'entity-index',
  'faq',
]);

export function HomeBlocks({
  blocks,
  ctx,
}: {
  blocks: HomeBlock[];
  ctx: HomeCtx;
}) {
  let secNum = 0;
  return (
    <div className="ui-home-stack">
      {blocks.map((block, i) => {
        if (
          (block.type === 'database-stats' || block.type === 'entity-index') &&
          ctx.entityKinds.length === 0
        ) {
          return null;
        }
        const num = sectionNumberedTypes.has(block.type)
          ? String(++secNum).padStart(2, '0')
          : undefined;
        return (
          <BlockSwitch
            key={block.id ?? `${block.type}-${i}`}
            block={block}
            num={num}
            ctx={ctx}
          />
        );
      })}
    </div>
  );
}

function BlockSwitch({
  block,
  num,
  ctx,
}: {
  block: HomeBlock;
  num?: string;
  ctx: HomeCtx;
}) {
  const recipe = homeBlockRecipe(block.id ?? block.type, block.type);
  switch (block.type) {
    case 'hero':
      return <HeroBlock block={block} totalGuides={ctx.totalGuides} />;
    case 'start-cards':
      return <StartCardsBlock block={block} num={num!} recipe={recipe} />;
    case 'code-cards':
      return <CodeCardsBlock block={block} num={num!} />;
    case 'tier-grid':
      return <TierGridBlock block={block} num={num!} />;
    case 'step-by-step':
      return <StepByStepBlock block={block} num={num!} recipe={recipe} />;
    case 'card-list':
      return <CardListBlock block={block} num={num!} recipe={recipe} />;
    case 'about':
      return <AboutBlock block={block} />;
    case 'final-cta':
      return <FinalCtaBlock block={block} />;
    case 'latest-guides':
      return <LatestGuidesBlock block={block} num={num!} ctx={ctx} />;
    case 'category-grid':
      return <CategoryGridBlock block={block} num={num!} ctx={ctx} />;
    case 'database-stats':
      return <DatabaseStatsBlock block={block} num={num!} ctx={ctx} />;
    case 'entity-index':
      return <EntityIndexBlock block={block} num={num!} ctx={ctx} />;
    case 'faq':
      return <FaqBlock block={block} num={num!} />;
    default:
      return assertNever(block);
  }
}

function assertNever(value: never): never {
  throw new Error(`Unsupported homepage block: ${JSON.stringify(value)}`);
}

// ─── database stats ────────────────────────────────────────────────────────

function DatabaseStatsBlock({
  block,
  num,
  ctx,
}: {
  block: Extract<HomeBlock, { type: 'database-stats' }>;
  num: string;
  ctx: HomeCtx;
}) {
  const entities = ctx.entityKinds.flatMap(({ entities: records }) => records);
  const guideCount = new Set(entities.flatMap((entity) => entity.relatedGuides))
    .size;
  const latestUpdate = entities
    .map((entity) => entity.updatedAt)
    .sort((a, b) => a.localeCompare(b))
    .at(-1);

  return (
    <section>
      <SectionHead
        num={num}
        title={block.title ?? 'Database at a glance'}
        sub={block.sub}
        rightSlot={<HubLink href={'/database'} />}
      />
      <dl className="border-site-outline-strong bg-site-surface grid border sm:grid-cols-2 lg:grid-cols-[1.35fr_repeat(3,minmax(0,0.75fr))]">
        <div className="border-site-outline-variant flex min-h-40 flex-col justify-between border-b p-6 sm:col-span-2 md:p-8 lg:col-span-1 lg:border-r lg:border-b-0">
          <dt className="font-site-mono text-site-on-surface-variant text-[10px] font-semibold tracking-[0.16em] uppercase">
            Published records
          </dt>
          <dd className="site-display-lg text-site-primary mt-8 tabular-nums">
            {entities.length}
          </dd>
        </div>
        <DatabaseStat
          label="Collections"
          value={ctx.entityKinds.length}
          detail={`${ctx.entityKinds.length === 1 ? 'Entity type' : 'Entity types'} available`}
        />
        <DatabaseStat
          label="Linked guides"
          value={guideCount}
          detail={`${guideCount === 1 ? 'Guide' : 'Guides'} referenced by records`}
        />
        <div className="border-site-outline-variant flex min-h-32 flex-col justify-between border-t p-6 sm:col-span-2 md:p-8 lg:col-span-1 lg:border-t-0 lg:border-l">
          <dt className="font-site-mono text-site-on-surface-variant text-[10px] font-semibold tracking-[0.16em] uppercase">
            Latest record update
          </dt>
          <dd className="text-site-on-surface mt-6 text-lg font-semibold tabular-nums">
            {latestUpdate ? (
              <time dateTime={latestUpdate}>{latestUpdate}</time>
            ) : (
              '—'
            )}
          </dd>
        </div>
      </dl>
    </section>
  );
}

function DatabaseStat({
  label,
  value,
  detail,
}: {
  label: string;
  value: number;
  detail: string;
}) {
  return (
    <div className="border-site-outline-variant flex min-h-32 flex-col justify-between border-b p-6 sm:border-r sm:border-b-0 md:p-8">
      <dt className="font-site-mono text-site-on-surface-variant text-[10px] font-semibold tracking-[0.16em] uppercase">
        {label}
      </dt>
      <dd className="mt-6">
        <span className="text-site-on-surface block text-3xl font-semibold tabular-nums">
          {value}
        </span>
        <span className="text-site-on-surface-variant mt-2 block text-xs leading-5">
          {detail}
        </span>
      </dd>
    </div>
  );
}

// ─── entity index ───────────────────────────────────────────────────────────

function EntityIndexBlock({
  block,
  num,
  ctx,
}: {
  block: Extract<HomeBlock, { type: 'entity-index' }>;
  num: string;
  ctx: HomeCtx;
}) {
  const previewLimit = Math.max(1, block.previewLimit ?? 3);
  const copy = getDiscoveryCopy(ctx.locale);

  return (
    <section>
      <SectionHead
        num={num}
        title={block.title ?? 'Browse the database'}
        sub={block.sub}
        rightSlot={<HubLink href={'/database'} />}
      />
      <div className="border-site-outline-strong bg-site-outline-strong border">
        {ctx.entityKinds.map(({ kind, entities }) => (
          <article
            key={kind.id}
            className="border-site-outline-strong bg-site-outline-strong grid gap-px border-b last:border-b-0 lg:grid-cols-[minmax(240px,0.72fr)_minmax(0,1.28fr)]"
          >
            <div className="bg-site-surface-container flex flex-col p-6 md:p-8">
              {getEntityCover(kind, entities) && (
                <Link
                  href={kind.route}
                  className="focus-visible:outline-site-primary -mx-6 -mt-6 mb-6 block focus-visible:outline-2 focus-visible:outline-offset-[-2px] md:-mx-8 md:-mt-8"
                >
                  <EntityImage
                    entity={getEntityCover(kind, entities)!}
                    preview
                    sizes="(max-width: 1023px) calc(100vw - 48px), 480px"
                  />
                </Link>
              )}
              <p className="font-site-mono text-site-primary text-[10px] font-semibold tracking-[0.16em] uppercase">
                {entities.length} {copy.records}
              </p>
              <h3 className="site-headline-lg text-site-on-surface mt-3">
                {kind.label}
              </h3>
              <p className="text-site-on-surface-variant mt-3 max-w-[52ch] text-sm leading-6">
                {kind.description}
              </p>
              <Link
                href={kind.route}
                className="font-site-mono text-site-primary focus-visible:outline-site-primary mt-6 w-fit text-[10px] font-semibold tracking-[0.14em] uppercase focus-visible:outline-2 focus-visible:outline-offset-4 lg:mt-auto lg:pt-8"
              >
                {copy.browse} {kind.label} →
              </Link>
            </div>

            <ol className="bg-site-surface">
              {entities.slice(0, previewLimit).map((entity, index) => (
                <li
                  key={entity.id}
                  className="border-site-outline-variant border-b last:border-b-0"
                >
                  <Link
                    href={entity.href}
                    className="focus-visible:outline-site-primary group bg-site-surface hover:bg-site-surface-high grid min-h-24 gap-4 px-5 py-4 transition-colors focus-visible:outline-2 focus-visible:outline-offset-[-2px] sm:grid-cols-[2rem_minmax(0,1fr)_auto] sm:items-center"
                  >
                    <span className="font-site-mono text-site-outline text-xs tabular-nums">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="min-w-0">
                      <strong className="text-site-on-surface group-hover:text-site-primary block text-base font-semibold transition-colors">
                        {entity.name}
                      </strong>
                      <span className="text-site-on-surface-variant mt-1 block truncate text-sm">
                        {entity.summary}
                      </span>
                    </span>
                    <span className="flex flex-wrap items-center gap-2 sm:justify-end">
                      {kind.cardFields.slice(0, 2).map((fieldId) => (
                        <EntityFieldValue
                          key={fieldId}
                          kind={kind}
                          fieldId={fieldId}
                          value={entity.data[fieldId]}
                        />
                      ))}
                    </span>
                  </Link>
                </li>
              ))}
            </ol>
          </article>
        ))}
      </div>
    </section>
  );
}

function SectionFrame({
  recipe,
  children,
}: {
  recipe: HomepageBlockRecipe;
  children: ReactNode;
}) {
  const surface = {
    plain: '',
    panel:
      'ui-shaped border border-site-outline-strong bg-site-surface-container p-5 sm:p-7',
    tinted:
      'ui-shaped border border-site-primary/30 bg-site-primary/5 p-5 sm:p-7',
    'contrast-band':
      'ui-shaped border border-site-outline-strong bg-site-surface-high p-5 sm:p-8',
    framed: 'ui-shaped border-2 border-site-outline-strong p-5 sm:p-7',
  }[recipe.section];
  return (
    <section
      data-home-layout={recipe.layout}
      data-home-section={recipe.section}
      className={surface}
    >
      {children}
    </section>
  );
}

// ─── shared bits ────────────────────────────────────────────────────────────

function Ctas({
  ctas,
  center,
}: {
  ctas: { label: string; href: string }[];
  center?: boolean;
}) {
  return (
    <div
      className={`mt-8 flex flex-wrap gap-3${center ? 'justify-center' : ''}`}
    >
      {ctas.map((c, i) =>
        i === 0 ? (
          <CtaPrimary key={c.href} href={c.href}>
            {c.label}
          </CtaPrimary>
        ) : (
          <CtaSecondary key={c.href} href={c.href}>
            {c.label}
          </CtaSecondary>
        )
      )}
    </div>
  );
}

function HubLink({ href }: { href?: string }): ReactNode {
  const t = useTranslations('common.ui');
  if (!href) return undefined;
  return (
    <Link
      href={href}
      className="text-site-primary hover:underline"
      style={{
        fontFamily: 'var(--font-site-mono)',
        fontSize: 12,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
      }}
    >
      {t('allGuides')} →
    </Link>
  );
}

// ─── hero ─────────────────────────────────────────────────────────────────

function HeroBlock({
  block,
  totalGuides,
}: {
  block: Extract<HomeBlock, { type: 'hero' }>;
  totalGuides: number;
}) {
  const t = useTranslations('common.ui');
  const style =
    gameConfig.heroStyle ??
    (gameConfig.coverImage ? 'cover-split' : uiRecipe.hero);

  // Fail LOUD in dev when heroStyle is set but its required media is missing —
  // otherwise the branch silently falls back to text-only (see #hero-drift).
  if (process.env.NODE_ENV !== 'production') {
    const reason =
      style === 'video-center' && !gameConfig.trailerUrl
        ? "heroStyle 'video-center' needs gameConfig.trailerUrl"
        : style === 'cover-split' && !gameConfig.coverImage
          ? "heroStyle 'cover-split' needs gameConfig.coverImage"
          : style === 'gameplay-panel' && !gameConfig.gameplayImage
            ? "heroStyle 'gameplay-panel' needs gameConfig.gameplayImage"
            : ![
                  'video-center',
                  'cover-split',
                  'gameplay-panel',
                  'text-only',
                ].includes(style)
              ? `heroStyle '${style}' is not a supported value`
              : null;
    if (reason) {
      throw new Error(
        `[gameConfig] ${reason} — hero would silently render as text-only. Fix the config or unset heroStyle.`
      );
    }
  }

  const eyebrow = block.eyebrow ? (
    <p className="text-site-primary mb-3 text-sm font-semibold tracking-wider uppercase">
      {block.eyebrow}
    </p>
  ) : null;
  const chips = (
    <>
      {gameConfig.statusBadge ? (
        <Chip tone="green">
          <span
            aria-hidden
            className="bg-site-green inline-block"
            style={{ width: 6, height: 6 }}
          />
          {gameConfig.statusBadge.toUpperCase()}
        </Chip>
      ) : null}
      <Chip tone="amber">{t('demoAvailable')}</Chip>
      <Chip tone="mute">{t('guideCount', { count: totalGuides })}</Chip>
      {gameConfig.heroFacts?.map((f) => (
        <Chip key={f.label} tone="mute">
          {f.label}
        </Chip>
      ))}
    </>
  );

  if (style === 'video-center' && gameConfig.trailerUrl) {
    return (
      <section className="text-center">
        {eyebrow}
        <h1 className="site-display-lg text-site-on-surface">{block.title}</h1>
        <div className="mx-auto mt-7 max-w-3xl">
          <HeroTrailer
            trailerUrl={gameConfig.trailerUrl}
            gameTitle={gameConfig.gameFullName}
          />
        </div>
        <p className="site-body-lg text-site-on-surface-variant mx-auto mt-6 max-w-2xl">
          {block.description}
        </p>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2.5">
          {chips}
        </div>
        <Ctas ctas={block.ctas} center />
      </section>
    );
  }

  if (style === 'gameplay-panel' && gameConfig.gameplayImage) {
    return (
      <section className="border-site-outline-strong bg-site-outline-strong grid gap-px overflow-hidden border lg:grid-cols-[0.9fr_1.1fr]">
        <div className="px-grid-bg bg-site-surface flex min-h-[480px] flex-col justify-center p-7 md:min-h-[560px] md:p-12 lg:p-16">
          {eyebrow}
          <h1 className="site-display-lg text-site-on-surface max-w-[14ch]">
            {block.title}
          </h1>
          <p className="site-body-lg mt-7 max-w-[52ch]">{block.description}</p>
          <div className="mt-6 flex flex-wrap gap-2.5">{chips}</div>
          <Ctas ctas={block.ctas} />
          <p className="site-mono text-site-primary mt-10 border-t border-[var(--site-outline-strong)] pt-4">
            {t('comingQ4')}
          </p>
        </div>
        <div className="bg-site-surface-container relative min-h-[320px] overflow-hidden lg:min-h-0">
          <img
            src={gameConfig.gameplayImage}
            alt={t('gameplayImageAlt')}
            className="absolute inset-0 h-full w-full object-cover"
            width={1920}
            height={1080}
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-[linear-gradient(180deg,transparent_55%,color-mix(in_srgb,var(--site-surface)_78%,transparent)_100%)]"
          />
        </div>
      </section>
    );
  }

  if (style === 'cover-split' && gameConfig.coverImage) {
    return (
      <section>
        <div className="grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            {eyebrow}
            <h1 className="site-display-lg text-site-on-surface">
              {block.title}
            </h1>
            <p className="site-body-lg mt-7 max-w-[560px]">
              {block.description}
            </p>
            <div className="mt-6 flex flex-wrap gap-2.5">{chips}</div>
            <Ctas ctas={block.ctas} />
          </div>
          <div className="ui-shaped border-site-outline-strong bg-site-surface-container overflow-hidden border">
            <img
              src={gameConfig.coverImage}
              alt={`${gameConfig.gameFullName} key art`}
              className="aspect-video w-full object-cover"
              width={1200}
              height={675}
            />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section>
      {eyebrow}
      <h1 className="site-display-lg text-site-on-surface">{block.title}</h1>
      <p className="site-body-lg mt-7 max-w-[560px]">{block.description}</p>
      <div className="mt-6 flex flex-wrap gap-2.5">{chips}</div>
      <Ctas ctas={block.ctas} />
    </section>
  );
}

// ─── start-cards ────────────────────────────────────────────────────────────

function StartCardsBlock({
  block,
  num,
  recipe,
}: {
  block: Extract<HomeBlock, { type: 'start-cards' }>;
  num: string;
  recipe: HomepageBlockRecipe;
}) {
  const featured = recipe.featuredItem
    ? block.items.find((item) => item.id === recipe.featuredItem)
    : block.items[0];
  const others = block.items.filter((item) => item !== featured);
  if (recipe.layout === 'featured-split' && featured) {
    return (
      <SectionFrame recipe={recipe}>
        <SectionHead num={num} title={block.title} />
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.55fr)_minmax(280px,0.8fr)]">
          <StartCard
            item={featured}
            index={0}
            total={block.items.length}
            featured
          />
          <div className="grid gap-3">
            {others.map((item, i) => (
              <StartCard
                key={item.id}
                item={item}
                index={i + 1}
                total={block.items.length}
                compact
              />
            ))}
          </div>
        </div>
      </SectionFrame>
    );
  }
  if (recipe.layout === 'compact-index') {
    return (
      <SectionFrame recipe={recipe}>
        <SectionHead num={num} title={block.title} />
        <div className="divide-site-outline-variant border-site-outline-strong divide-y border-y">
          {block.items.map((item, i) => (
            <StartCard
              key={item.id}
              item={item}
              index={i}
              total={block.items.length}
              compact
            />
          ))}
        </div>
      </SectionFrame>
    );
  }
  return (
    <SectionFrame recipe={recipe}>
      <SectionHead num={num} title={block.title} />
      {recipe.layout === 'horizontal-rail' ? (
        <DragScrollRow>
          {block.items.map((item, i) => (
            <StartCard
              key={item.id}
              item={item}
              index={i}
              total={block.items.length}
              rail
            />
          ))}
        </DragScrollRow>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {block.items.map((item, i) => (
            <StartCard
              key={item.id}
              item={item}
              index={i}
              total={block.items.length}
            />
          ))}
        </div>
      )}
    </SectionFrame>
  );
}

function StartCard({
  item: c,
  index,
  total,
  featured,
  compact,
  rail,
}: {
  item: Extract<HomeBlock, { type: 'start-cards' }>['items'][number];
  index: number;
  total: number;
  featured?: boolean;
  compact?: boolean;
  rail?: boolean;
}) {
  return (
    <Link
      href={c.href}
      draggable={false}
      className={`ui-shaped border-site-outline-strong bg-site-surface-container text-site-on-surface hover:border-site-primary flex border no-underline transition-colors ${featured ? 'flex-col justify-between p-7 lg:min-h-[320px] lg:p-9' : compact ? 'min-h-11 items-center gap-4 p-4' : `min-h-[240px] flex-col p-6 ${rail ? 'w-[88vw] shrink-0 snap-start sm:w-[360px]' : ''}`}`}
    >
      <div className={compact ? 'min-w-0 flex-1' : 'w-full'}>
        <div className="mb-4 flex items-center justify-between gap-3">
          <Chip tone={c.tagTone}>{c.badge || c.tag}</Chip>
          <span className="text-site-outline font-mono text-[10px] tracking-widest">
            {String(index + 1).padStart(2, '0')} /{' '}
            {String(total).padStart(2, '0')}
          </span>
        </div>
        <div
          className={`text-site-on-surface ${featured ? 'site-headline-lg' : compact ? 'text-base font-semibold' : 'text-2xl font-semibold'}`}
        >
          {c.title}
        </div>
        {!compact ? (
          <p className="text-site-on-surface-variant mt-3 text-sm leading-6">
            {c.description}
          </p>
        ) : null}
      </div>
      <div
        className={`${compact ? '' : 'border-site-outline-variant mt-6 border-t pt-4'} flex items-center justify-between gap-4`}
      >
        <span className="text-site-outline font-mono text-xs">
          {c.readingTime}
        </span>
        <span className="text-site-primary">→</span>
      </div>
    </Link>
  );
}

// ─── code-cards ─────────────────────────────────────────────────────────────

function CodeCardsBlock({
  block,
  num,
}: {
  block: Extract<HomeBlock, { type: 'code-cards' }>;
  num: string;
}) {
  return (
    <section>
      <SectionHead
        num={num}
        title={block.title}
        sub={block.description}
        rightSlot={<HubLink href={block.href} />}
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {block.codes.map((c) => (
          <div
            key={c.code}
            className="ui-shaped border-site-outline-strong bg-site-surface-container border p-5"
          >
            <div className="mb-3 flex items-center justify-between gap-2">
              <code
                className="text-site-primary"
                style={{
                  fontFamily: 'var(--font-site-mono)',
                  fontSize: 16,
                  fontWeight: 600,
                  letterSpacing: '0.04em',
                }}
              >
                {c.code}
              </code>
              {c.badge ? <Chip tone="green">{c.badge}</Chip> : null}
            </div>
            <p
              className="text-site-on-surface-variant"
              style={{
                fontFamily: 'var(--font-site-body)',
                fontSize: 14,
                lineHeight: 1.5,
              }}
            >
              {c.reward}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── tier-grid ──────────────────────────────────────────────────────────────

function TierGridBlock({
  block,
  num,
}: {
  block: Extract<HomeBlock, { type: 'tier-grid' }>;
  num: string;
}) {
  return (
    <section>
      <SectionHead
        num={num}
        title={block.title}
        sub={block.description}
        rightSlot={<HubLink href={block.href} />}
      />
      <div className="border-site-outline-strong bg-site-surface-container border">
        {block.rows.map((r, i) => (
          <div
            key={`${r.tier}-${r.label}`}
            className="grid grid-cols-[56px_1fr] items-center gap-4 px-5 py-4"
            style={{
              borderTop:
                i > 0 ? '1px solid var(--site-outline-variant)' : 'none',
            }}
          >
            <Chip tone={r.tone ?? 'amber'}>{r.tier}</Chip>
            <div>
              <p
                className="text-site-on-surface"
                style={{
                  fontFamily: 'var(--font-site-display)',
                  fontSize: 16,
                  fontWeight: 600,
                }}
              >
                {r.label}
              </p>
              <p
                className="text-site-on-surface-variant mt-0.5"
                style={{
                  fontFamily: 'var(--font-site-body)',
                  fontSize: 13,
                  lineHeight: 1.5,
                }}
              >
                {r.detail}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── step-by-step ───────────────────────────────────────────────────────────

function StepByStepBlock({
  block,
  num,
  recipe,
}: {
  block: Extract<HomeBlock, { type: 'step-by-step' }>;
  num: string;
  recipe: HomepageBlockRecipe;
}) {
  const horizontal = recipe.layout === 'horizontal-flow';
  const checklist = recipe.layout === 'checklist';
  return (
    <SectionFrame recipe={recipe}>
      <SectionHead
        num={num}
        title={block.title}
        sub={block.description}
        rightSlot={<HubLink href={block.href} />}
      />
      <ol
        className={
          horizontal
            ? 'grid gap-3 md:grid-cols-2 xl:grid-cols-4'
            : checklist
              ? 'grid gap-3 sm:grid-cols-2 xl:grid-cols-3'
              : 'ui-shaped border-site-outline-strong bg-site-surface-container overflow-hidden border'
        }
      >
        {block.steps.map((s, i) => (
          <li
            key={i}
            className={
              horizontal || checklist
                ? 'ui-shaped border-site-outline-strong bg-site-surface-container border p-5'
                : 'grid grid-cols-[44px_1fr] items-start gap-4 px-5 py-4'
            }
            style={
              !horizontal && !checklist
                ? {
                    borderTop:
                      i > 0 ? '1px solid var(--site-outline-variant)' : 'none',
                  }
                : undefined
            }
          >
            <span
              className="text-site-primary"
              style={{
                fontFamily: 'var(--font-site-mono)',
                fontSize: 14,
                fontWeight: 600,
              }}
            >
              {checklist ? '✓' : String(i + 1).padStart(2, '0')}
            </span>
            <p
              className={`text-site-on-surface ${horizontal || checklist ? 'mt-3' : ''}`}
              style={{
                fontFamily: 'var(--font-site-body)',
                fontSize: 14,
                lineHeight: 1.55,
              }}
            >
              {s.detail}
            </p>
          </li>
        ))}
      </ol>
    </SectionFrame>
  );
}

// ─── card-list ──────────────────────────────────────────────────────────────

function CardListBlock({
  block,
  num,
  recipe,
}: {
  block: Extract<HomeBlock, { type: 'card-list' }>;
  num: string;
  recipe: HomepageBlockRecipe;
}) {
  const rows =
    recipe.layout === 'data-rows' || recipe.layout === 'compact-index';
  const bento = recipe.layout === 'bento-grid';
  return (
    <SectionFrame recipe={recipe}>
      <SectionHead
        num={num}
        title={block.title}
        sub={block.description}
        rightSlot={<HubLink href={block.href} />}
      />
      <div
        className={
          rows
            ? 'divide-site-outline-variant border-site-outline-strong divide-y border-y'
            : bento
              ? 'grid auto-rows-[minmax(150px,auto)] gap-4 sm:grid-cols-2 lg:grid-cols-3'
              : 'grid gap-4 sm:grid-cols-2 lg:grid-cols-3'
        }
      >
        {block.cards.map((c, i) => {
          const bentoSpan = !bento
            ? ''
            : i === 0
              ? 'sm:col-span-2'
              : i === block.cards.length - 1
                ? 'sm:col-span-2 lg:col-span-1'
                : '';
          return (
            <div
              key={c.label}
              className={
                rows
                  ? 'grid gap-2 py-4 sm:grid-cols-[minmax(180px,0.4fr)_1fr] sm:items-center'
                  : `ui-shaped border-site-outline-strong bg-site-surface-container border p-5 ${bentoSpan}`
              }
            >
              <p
                className="text-site-on-surface mb-1.5"
                style={{
                  fontFamily: 'var(--font-site-display)',
                  fontSize: 16,
                  fontWeight: 600,
                }}
              >
                {c.label}
              </p>
              <p
                className="text-site-on-surface-variant"
                style={{
                  fontFamily: 'var(--font-site-body)',
                  fontSize: 14,
                  lineHeight: 1.5,
                }}
              >
                {c.detail}
              </p>
            </div>
          );
        })}
      </div>
    </SectionFrame>
  );
}

// ─── about ──────────────────────────────────────────────────────────────────

function AboutBlock({
  block,
}: {
  block: Extract<HomeBlock, { type: 'about' }>;
}) {
  const t = useTranslations('common.ui');
  return (
    <section>
      <div className="grid grid-cols-1 gap-14 lg:grid-cols-2">
        <div>
          <Chip tone="mute">{t('aboutGame')}</Chip>
          <h2 className="site-headline-lg text-site-on-surface mt-4">
            {block.title}
          </h2>
          {block.paragraphs.map((p, i) => (
            <p key={i} className="site-body-lg mt-4">
              {p}
            </p>
          ))}
          {block.cta ? <Ctas ctas={[block.cta]} /> : null}
        </div>
        <div className="ui-shaped border-site-outline-strong bg-site-surface-container border p-6">
          <p
            className="text-site-primary mb-4"
            style={{
              fontFamily: 'var(--font-site-mono)',
              fontSize: 10,
              letterSpacing: '0.2em',
              fontWeight: 600,
              textTransform: 'uppercase',
            }}
          >
            {t('atAGlance')}
          </p>
          {block.stats.map((s, i) => (
            <div
              key={s.label}
              className="grid grid-cols-[1fr_auto] gap-3.5 py-3"
              style={{
                borderTop:
                  i > 0 ? '1px solid var(--site-outline-variant)' : 'none',
              }}
            >
              <span
                className="text-site-on-surface-variant"
                style={{ fontFamily: 'var(--font-site-body)', fontSize: 14 }}
              >
                {s.label}
              </span>
              <span
                className="text-site-on-surface"
                style={{
                  fontFamily: 'var(--font-site-mono)',
                  fontSize: 14,
                  fontWeight: 600,
                }}
              >
                {s.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── final-cta ──────────────────────────────────────────────────────────────

function FinalCtaBlock({
  block,
}: {
  block: Extract<HomeBlock, { type: 'final-cta' }>;
}) {
  return (
    <section className="ui-shaped border-site-outline-strong bg-site-surface-container border p-10 text-center">
      <h2 className="site-headline-lg text-site-on-surface">{block.title}</h2>
      {block.description ? (
        <p className="site-body-lg text-site-on-surface-variant mx-auto mt-4 max-w-2xl">
          {block.description}
        </p>
      ) : null}
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        {block.ctas.map((c, i) =>
          i === 0 ? (
            <CtaPrimary key={c.href} href={c.href}>
              {c.label}
            </CtaPrimary>
          ) : (
            <CtaSecondary key={c.href} href={c.href}>
              {c.label}
            </CtaSecondary>
          )
        )}
      </div>
    </section>
  );
}

// ─── latest-guides (data) ─────────────────────────────────────────────────────

function LatestGuidesBlock({
  block,
  num,
  ctx,
}: {
  block: Extract<HomeBlock, { type: 'latest-guides' }>;
  num: string;
  ctx: HomeCtx;
}) {
  const { latestGuides, totalGuides } = ctx;
  return (
    <section>
      <SectionHead
        num={num}
        title={block.title ?? 'Latest updates'}
        sub={
          block.sub ??
          'The most recently updated guides — every page version-stamped.'
        }
        rightSlot={<HubLink href={'/guides'} />}
      />
      <div className="border-site-outline-strong bg-site-surface-container border">
        {latestGuides.map((g, i) => (
          <Link
            key={g.slug}
            href={g.href}
            className="text-site-on-surface hover:bg-site-surface-high grid grid-cols-[40px_1fr_24px] items-center gap-4 px-5 py-5 no-underline sm:grid-cols-[60px_1fr_200px_40px] sm:gap-5 sm:px-6"
            style={{
              borderTop:
                i > 0 ? '1px solid var(--site-outline-variant)' : 'none',
            }}
          >
            <span
              className="text-site-outline"
              style={{
                fontFamily: 'var(--font-site-mono)',
                fontSize: 11,
                letterSpacing: '0.14em',
              }}
            >
              {String(i + 1).padStart(2, '0')}
            </span>
            <div>
              <p
                style={{
                  fontFamily: 'var(--font-site-display)',
                  fontSize: 19,
                  fontWeight: 600,
                  letterSpacing: '-0.01em',
                }}
              >
                {g.title}
              </p>
              <p
                className="text-site-on-surface-variant mt-1"
                style={{ fontFamily: 'var(--font-site-body)', fontSize: 13 }}
              >
                {g.description}
              </p>
            </div>
            <span
              className="text-site-on-surface-variant hidden sm:inline"
              style={{
                fontFamily: 'var(--font-site-mono)',
                fontSize: 10,
                letterSpacing: '0.14em',
              }}
            >
              {g.lastModified ?? g.date}
            </span>
            <span
              className="text-site-primary text-right"
              style={{ fontFamily: 'var(--font-site-mono)' }}
            >
              →
            </span>
          </Link>
        ))}
        {totalGuides > latestGuides.length && (
          <Link
            href="/guides"
            className="text-site-primary hover:bg-site-surface-high flex items-center justify-between px-6 py-5 no-underline"
            style={{ borderTop: '1px solid var(--site-outline-variant)' }}
          >
            <span
              style={{
                fontFamily: 'var(--font-site-mono)',
                fontSize: 13,
                letterSpacing: '0.08em',
              }}
            >
              View all {totalGuides} guides
            </span>
            <span style={{ fontFamily: 'var(--font-site-mono)' }}>→</span>
          </Link>
        )}
      </div>
    </section>
  );
}

// ─── category-grid (data) ─────────────────────────────────────────────────────

function CategoryGridBlock({
  block,
  num,
  ctx,
}: {
  block: Extract<HomeBlock, { type: 'category-grid' }>;
  num: string;
  ctx: HomeCtx;
}) {
  if (ctx.guideCategories.length === 0) return null;
  return (
    <section>
      <SectionHead
        num={num}
        title={block.title ?? 'Explore the wiki'}
        sub={block.sub ?? 'Every guide, organized by type.'}
        rightSlot={<HubLink href={'/guides'} />}
      />
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {ctx.guideCategories.map((c) => {
          const Icon = c.icon;
          return (
            <GuideCard
              key={c.slug}
              href={`/guides/${c.slug}`}
              title={c.title}
              description={
                c.overviewDescription ??
                `${c.count} guide${c.count === 1 ? '' : 's'} for ${gameConfig.gameShortName}.`
              }
              cta={`${c.count} guide${c.count === 1 ? '' : 's'}`}
              icon={<Icon />}
              countBadge={c.count}
            />
          );
        })}
      </div>
    </section>
  );
}

// ─── faq ──────────────────────────────────────────────────────────────────

function FaqBlock({
  block,
  num,
}: {
  block: Extract<HomeBlock, { type: 'faq' }>;
  num: string;
}) {
  return (
    <section>
      <SectionHead
        num={num}
        title={block.title ?? 'Frequently asked'}
        sub={block.sub ?? 'A few common questions. Full list on the FAQ page.'}
        rightSlot={<HubLink href={'/faq'} />}
      />
      <FaqAccordion items={block.items} />
    </section>
  );
}

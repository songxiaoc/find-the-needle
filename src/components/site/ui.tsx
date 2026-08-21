'use client';

import type { CSSProperties, ReactNode } from 'react';
import * as Accordion from '@radix-ui/react-accordion';
import { ChevronRight, Plus, Square, XCircle } from 'lucide-react';

import { Link } from '@/core/i18n/navigation';

/* =============================================================================
 * "Tactical Console" UI primitives — chips, stats, section heads, cards.
 * All square (no border-radius). Mono labels are uppercase + wide-tracked.
 * Edit the design tokens in tokens.css to re-skin the whole site.
 * =============================================================================
 */

export type Tone = 'amber' | 'blue' | 'red' | 'green' | 'mute' | 'solid';

const TONE_STYLES: Record<Tone, { c: string; bd: string; bg: string }> = {
  amber: {
    c: '#F5A524',
    bd: 'rgba(245,165,36,.4)',
    bg: 'rgba(245,165,36,.08)',
  },
  blue: { c: '#3B82F6', bd: 'rgba(59,130,246,.4)', bg: 'rgba(59,130,246,.08)' },
  red: { c: '#EF4444', bd: 'rgba(239,68,68,.4)', bg: 'rgba(239,68,68,.08)' },
  green: { c: '#22C55E', bd: 'rgba(34,197,94,.4)', bg: 'rgba(34,197,94,.08)' },
  mute: { c: '#94A0AE', bd: '#2A3849', bg: 'transparent' },
  solid: { c: '#0A0E14', bd: '#F5A524', bg: '#F5A524' },
};

export function Chip({
  children,
  tone = 'mute',
  style,
}: {
  children: ReactNode;
  tone?: Tone;
  style?: CSSProperties;
}) {
  const t = TONE_STYLES[tone];
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        fontFamily: 'var(--font-site-mono)',
        fontSize: 10,
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        padding: '4px 9px',
        border: `1px solid ${t.bd}`,
        color: t.c,
        background: t.bg,
        fontWeight: 500,
        ...style,
      }}
    >
      {children}
    </span>
  );
}

export function Stat({
  k,
  v,
  sub,
  color,
}: {
  k: string;
  v: ReactNode;
  sub?: string;
  color?: string;
}) {
  return (
    <div>
      <div
        style={{
          fontFamily: 'var(--font-site-mono)',
          fontSize: 10,
          color: '#5B6776',
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
        }}
      >
        {k}
      </div>
      <div
        style={{
          fontFamily: 'var(--font-site-display)',
          fontSize: 28,
          color: color || '#E8ECF1',
          marginTop: 4,
          fontWeight: 600,
          lineHeight: 1,
        }}
      >
        {v}
      </div>
      {sub && (
        <div
          style={{
            fontFamily: 'var(--font-site-mono)',
            fontSize: 10,
            color: '#5B6776',
            marginTop: 4,
            letterSpacing: '0.1em',
          }}
        >
          {sub}
        </div>
      )}
    </div>
  );
}

/** Section divider used at the top of every homepage section: "§ NN" + title + sub + right slot. */
export function SectionHead({
  num,
  title,
  sub,
  rightSlot,
}: {
  num: string;
  title: ReactNode;
  sub?: string;
  rightSlot?: ReactNode;
}) {
  return (
    <div
      className="mb-7 flex flex-wrap items-end justify-between gap-4 border-b pb-4"
      style={{ borderColor: 'var(--site-outline-strong)' }}
    >
      <div className="flex items-baseline gap-4">
        <span
          className="text-site-primary"
          style={{
            fontFamily: 'var(--font-site-mono)',
            fontSize: 11,
            letterSpacing: '0.2em',
            fontWeight: 600,
          }}
        >
          § {num}
        </span>
        <div>
          <h2 className="site-headline-lg text-site-on-surface">{title}</h2>
          {sub && (
            <p
              className="text-site-on-surface-variant mt-1.5"
              style={{ fontFamily: 'var(--font-site-body)', fontSize: 14 }}
            >
              {sub}
            </p>
          )}
        </div>
      </div>
      {rightSlot}
    </div>
  );
}

/* =============================================================================
 * Hero — wide single-column hero variant (used on article + hub pages).
 * The homepage uses a custom split-hero (see app/[locale]/page.tsx).
 * =============================================================================
 */

export function Hero({
  eyebrow,
  title,
  subtitle,
  primaryCta,
  secondaryCta,
}: {
  eyebrow: string;
  title: ReactNode;
  subtitle: string;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
}) {
  return (
    <div className="border-site-outline-strong bg-site-surface-container border p-6 md:p-12">
      <Chip tone="amber">{eyebrow}</Chip>
      <h1 className="site-display-lg text-site-on-surface mt-5">{title}</h1>
      <p className="site-body-lg mt-6 max-w-[60ch]">{subtitle}</p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        {primaryCta && (
          <CtaPrimary href={primaryCta.href}>{primaryCta.label}</CtaPrimary>
        )}
        {secondaryCta && (
          <CtaSecondary href={secondaryCta.href}>
            {secondaryCta.label}
          </CtaSecondary>
        )}
      </div>
    </div>
  );
}

/* =============================================================================
 * Buttons — amber solid (primary) + transparent w/ line border (secondary).
 * =============================================================================
 */

export function CtaPrimary({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className="ui-shaped bg-site-primary text-site-on-primary inline-flex items-center justify-center gap-2.5 px-5 py-3.5 transition-[filter] hover:brightness-110"
      style={{
        fontFamily: 'var(--font-site-display)',
        fontSize: 14,
        fontWeight: 600,
        letterSpacing: '0.02em',
      }}
    >
      {children}
      <span
        aria-hidden
        style={{ fontFamily: 'var(--font-site-mono)', fontSize: 16 }}
      >
        →
      </span>
    </Link>
  );
}

export function CtaSecondary({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className="ui-shaped border-site-outline-strong text-site-on-surface hover:text-site-primary inline-flex items-center justify-center border px-5 py-3.5 transition-colors"
      style={{
        fontFamily: 'var(--font-site-display)',
        fontSize: 14,
        fontWeight: 500,
      }}
    >
      {children}
    </Link>
  );
}

/* =============================================================================
 * Section title helper (for non-homepage simple pages)
 * =============================================================================
 */

export function SectionTitle({
  eyebrow,
  title,
  as = 'h2',
}: {
  eyebrow?: string;
  title: ReactNode;
  /** Use "h1" for the top-of-page title on a hub; "h2" (default) for sections. */
  as?: 'h1' | 'h2';
}) {
  const Heading = as;
  return (
    <div className="mb-8">
      {eyebrow && (
        <p
          className="text-site-primary"
          style={{
            fontFamily: 'var(--font-site-mono)',
            fontSize: 11,
            letterSpacing: '0.2em',
            fontWeight: 600,
            textTransform: 'uppercase',
          }}
        >
          {eyebrow}
        </p>
      )}
      <Heading className="site-headline-lg text-site-on-surface mt-3">
        {title}
      </Heading>
    </div>
  );
}

/* =============================================================================
 * Cards — square, amber-bordered on hover, mono meta line at the bottom.
 * =============================================================================
 */

export function GuideCard({
  title,
  description,
  href,
  cta,
  meta,
  tag,
  tagTone = 'amber',
  index,
  total,
  icon,
  countBadge,
}: {
  title: string;
  description: string;
  href: string;
  cta: string;
  meta?: string;
  tag?: string;
  tagTone?: Tone;
  index?: number;
  total?: number;
  /** Optional leading icon (e.g. a category glyph). Square, line-style — no colored circle. */
  icon?: ReactNode;
  /** Optional count shown top-right (e.g. number of guides in a category). */
  countBadge?: string | number;
}) {
  return (
    <Link
      href={href}
      className="group border-site-outline-strong bg-site-surface-container text-site-on-surface hover:border-site-primary flex h-full min-h-[260px] flex-col border p-6 no-underline transition-colors"
    >
      <div className="mb-7 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {icon && (
            <span className="border-site-outline-strong text-site-primary grid h-9 w-9 place-items-center border [&_svg]:h-5 [&_svg]:w-5">
              {icon}
            </span>
          )}
          {tag && <Chip tone={tagTone}>{tag}</Chip>}
        </div>
        {countBadge !== undefined ? (
          <Chip tone="mute">{countBadge}</Chip>
        ) : (
          typeof index === 'number' &&
          typeof total === 'number' && (
            <span
              className="text-site-outline"
              style={{
                fontFamily: 'var(--font-site-mono)',
                fontSize: 10,
                letterSpacing: '0.12em',
              }}
            >
              {String(index).padStart(2, '0')} /{' '}
              {String(total).padStart(2, '0')}
            </span>
          )
        )}
      </div>
      <h3
        className="text-site-on-surface"
        style={{
          fontFamily: 'var(--font-site-display)',
          fontSize: 24,
          fontWeight: 600,
          lineHeight: 1.15,
          letterSpacing: '-0.02em',
        }}
      >
        {title}
      </h3>
      <p
        className="text-site-on-surface-variant mt-3 flex-1"
        style={{
          fontFamily: 'var(--font-site-body)',
          fontSize: 14,
          lineHeight: 1.55,
        }}
      >
        {description}
      </p>
      <div className="border-site-outline-variant mt-5 flex items-center justify-between border-t pt-3.5">
        <span
          className="text-site-outline"
          style={{
            fontFamily: 'var(--font-site-mono)',
            fontSize: 11,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
          }}
        >
          {meta ?? cta}
        </span>
        <span
          aria-hidden
          className="text-site-primary transition-transform group-hover:translate-x-1"
          style={{ fontFamily: 'var(--font-site-mono)', fontSize: 14 }}
        >
          →
        </span>
      </div>
    </Link>
  );
}

export function QuickStartCard({
  label,
  title,
  href,
}: {
  label: string;
  title: string;
  href?: string;
}) {
  const inner = (
    <>
      <p
        className="text-site-primary"
        style={{
          fontFamily: 'var(--font-site-mono)',
          fontSize: 10,
          letterSpacing: '0.18em',
          fontWeight: 600,
          textTransform: 'uppercase',
        }}
      >
        {label}
      </p>
      <p
        className="text-site-on-surface mt-2"
        style={{
          fontFamily: 'var(--font-site-display)',
          fontSize: 16,
          fontWeight: 600,
          lineHeight: 1.25,
        }}
      >
        {title}
      </p>
    </>
  );
  if (!href) {
    return (
      <div className="border-site-outline-strong bg-site-surface-container border p-5">
        {inner}
      </div>
    );
  }
  return (
    <Link
      href={href}
      className="border-site-outline-strong bg-site-surface-container hover:border-site-primary block border p-5 transition-colors"
    >
      {inner}
    </Link>
  );
}

/* =============================================================================
 * Article primitives
 * =============================================================================
 */

export function QuickAnswer({ children }: { children: ReactNode }) {
  return (
    <div className="border-site-outline-strong border-l-site-primary bg-site-surface-container border border-l-2 p-5">
      <p
        className="text-site-primary"
        style={{
          fontFamily: 'var(--font-site-mono)',
          fontSize: 10,
          letterSpacing: '0.22em',
          fontWeight: 600,
          textTransform: 'uppercase',
        }}
      >
        Quick Answer
      </p>
      <p
        className="text-site-on-surface mt-2.5"
        style={{
          fontFamily: 'var(--font-site-body)',
          fontSize: 17,
          lineHeight: 1.55,
        }}
      >
        {children}
      </p>
    </div>
  );
}

export function Breadcrumb({
  items,
}: {
  items: { label: string; href?: string }[];
}) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="mb-6 flex flex-wrap items-center gap-2"
    >
      {items.map((item, i) => {
        const last = i === items.length - 1;
        return (
          <span
            key={i}
            className="flex items-center gap-2"
            style={{
              fontFamily: 'var(--font-site-mono)',
              fontSize: 11,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}
          >
            {item.href && !last ? (
              <Link
                href={item.href}
                className="text-site-on-surface-variant hover:text-site-primary"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-site-primary">{item.label}</span>
            )}
            {!last && (
              <ChevronRight className="text-site-outline h-3 w-3" aria-hidden />
            )}
          </span>
        );
      })}
    </nav>
  );
}

export function ArticleHeader({
  h1,
  lastUpdated,
  readingTime,
}: {
  h1: string;
  lastUpdated: string;
  readingTime?: string;
}) {
  return (
    <header className="border-site-outline-variant mb-8 border-b pb-6">
      <h1 className="site-headline-lg text-site-on-surface">{h1}</h1>
      <p
        className="text-site-outline mt-3"
        style={{
          fontFamily: 'var(--font-site-mono)',
          fontSize: 11,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
        }}
      >
        Updated {lastUpdated}
        {readingTime ? ` · ${readingTime} read` : ''}
      </p>
    </header>
  );
}

export function ArticleHero({
  title,
  description,
  date,
  breadcrumb,
}: {
  title: string;
  description?: string;
  date: string;
  breadcrumb?: { label: string; href?: string }[];
}) {
  const ghostWord = title.split(' ').slice(-2).join(' ');
  return (
    <div
      className="border-site-outline-variant relative overflow-hidden border-b py-14 text-center md:py-20"
      style={{
        background:
          'linear-gradient(180deg, color-mix(in srgb, var(--color-site-surface-container) 90%, transparent) 0%, var(--color-site-surface) 100%)',
      }}
    >
      {/* Ghost watermark */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden select-none"
        style={{
          fontSize: 'clamp(80px, 14vw, 180px)',
          fontWeight: 900,
          color: 'rgba(255,255,255,0.03)',
          lineHeight: 1,
          whiteSpace: 'nowrap',
          letterSpacing: '-0.02em',
        }}
      >
        {ghostWord}
      </div>

      <div className="relative mx-auto max-w-[820px] px-6">
        {/* Breadcrumb */}
        {breadcrumb && breadcrumb.length > 0 && (
          <p
            className="text-site-outline mb-6"
            style={{
              fontFamily: 'var(--font-site-mono)',
              fontSize: 11,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
            }}
          >
            {breadcrumb.map((crumb, i) => (
              <span key={i}>
                {i > 0 && <span className="mx-2 opacity-40">/</span>}
                {crumb.href ? (
                  <Link
                    href={crumb.href}
                    className="hover:text-site-primary text-site-outline no-underline transition-colors"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span>{crumb.label}</span>
                )}
              </span>
            ))}
          </p>
        )}

        {/* Title */}
        <h1
          className="text-site-on-surface"
          style={{
            fontSize: 'clamp(28px, 4.5vw, 54px)',
            fontWeight: 900,
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
          }}
        >
          {title}
        </h1>

        {/* Description */}
        {description && (
          <p
            className="text-site-on-surface-variant mx-auto mt-4 max-w-[58ch]"
            style={{ fontSize: 16, lineHeight: 1.6 }}
          >
            {description}
          </p>
        )}

        {/* Date */}
        <p
          className="text-site-outline mt-5"
          style={{
            fontFamily: 'var(--font-site-mono)',
            fontSize: 11,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
          }}
        >
          {date}
        </p>
      </div>
    </div>
  );
}

export function DataTable<T extends Record<string, ReactNode>>({
  caption,
  columns,
  rows,
}: {
  caption: string;
  columns: { key: keyof T; label: string }[];
  rows: T[];
}) {
  return (
    <div className="border-site-outline-strong bg-site-surface-container overflow-x-auto border">
      <table className="w-full border-collapse">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr className="bg-site-surface-low">
            {columns.map((col) => (
              <th
                key={String(col.key)}
                scope="col"
                className="text-site-outline px-4 py-3 text-left"
                style={{
                  fontFamily: 'var(--font-site-mono)',
                  fontSize: 10,
                  letterSpacing: '0.18em',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                }}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-site-outline-variant border-t">
              {columns.map((col) => (
                <td
                  key={String(col.key)}
                  className="text-site-on-surface px-4 py-3 align-top"
                  style={{ fontFamily: 'var(--font-site-body)', fontSize: 14 }}
                >
                  {row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export type Tier = 'S' | 'A' | 'B' | 'C' | 'D' | '?';

const TIER_COLOR: Record<Tier, string> = {
  S: '#F5A524',
  A: '#22C55E',
  B: '#3B82F6',
  C: '#94A0AE',
  D: '#EF4444',
  '?': '#5B6776',
};

export function TierBadge({ tier }: { tier: Tier }) {
  return (
    <span
      className="bg-site-surface-low inline-flex h-7 w-7 items-center justify-center border"
      style={{
        color: TIER_COLOR[tier],
        borderColor: TIER_COLOR[tier],
        fontFamily: 'var(--font-site-display)',
        fontSize: 14,
        fontWeight: 700,
      }}
      aria-label={`Tier ${tier}`}
    >
      {tier}
    </span>
  );
}

export type FaqItem = { q: string; a: string };

export function FaqAccordion({ items }: { items: FaqItem[] }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((it) => ({
      '@type': 'Question',
      name: it.q,
      acceptedAnswer: { '@type': 'Answer', text: it.a },
    })),
  };
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Accordion.Root
        type="single"
        collapsible
        className="divide-site-outline-variant border-site-outline-strong bg-site-surface-container divide-y border"
      >
        {items.map((item, i) => (
          <Accordion.Item value={`item-${i}`} key={i}>
            <Accordion.Header>
              <Accordion.Trigger className="group text-site-on-surface hover:text-site-primary site-label-md flex w-full items-center justify-between px-5 py-4 text-left transition-colors">
                <span>{item.q}</span>
                <Plus
                  className="h-4 w-4 shrink-0 transition-transform group-data-[state=open]:rotate-45"
                  aria-hidden
                />
              </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content
              className="text-site-on-surface-variant px-5 pb-5"
              style={{
                fontFamily: 'var(--font-site-body)',
                fontSize: 14,
                lineHeight: 1.6,
              }}
            >
              {item.a}
            </Accordion.Content>
          </Accordion.Item>
        ))}
      </Accordion.Root>
    </>
  );
}

export function MistakeList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-3">
      {items.map((m, i) => (
        <li
          key={i}
          className="text-site-on-surface flex gap-3"
          style={{ fontFamily: 'var(--font-site-body)', fontSize: 15 }}
        >
          <XCircle
            className="text-site-red mt-0.5 h-4 w-4 shrink-0"
            aria-hidden
          />
          <span>{m}</span>
        </li>
      ))}
    </ul>
  );
}

export function Checklist({ items }: { items: string[] }) {
  return (
    <ul className="space-y-3">
      {items.map((m, i) => (
        <li
          key={i}
          className="text-site-on-surface flex gap-3"
          style={{ fontFamily: 'var(--font-site-body)', fontSize: 15 }}
        >
          <Square
            className="text-site-outline mt-0.5 h-4 w-4 shrink-0"
            aria-hidden
          />
          <span>{m}</span>
        </li>
      ))}
    </ul>
  );
}

export function RelatedGuides({
  items,
}: {
  items: { title: string; href: string; description: string }[];
}) {
  return (
    <div className="border-site-outline-strong mt-16 border-t pt-10">
      <p
        className="text-site-primary mb-6"
        style={{
          fontFamily: 'var(--font-site-mono)',
          fontSize: 11,
          letterSpacing: '0.2em',
          fontWeight: 600,
          textTransform: 'uppercase',
        }}
      >
        Related Guides
      </p>
      <div className="grid gap-4 md:grid-cols-2">
        {items.map((it) => (
          <GuideCard
            key={it.href}
            title={it.title}
            description={it.description}
            href={it.href}
            cta={`Read →`}
          />
        ))}
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------------------
 * Sources — bottom-of-page block. Replaces the inline [[citation]] tags from
 * source briefs per renderer contract (docs/source/README.md §2).
 * --------------------------------------------------------------------------- */

export function Sources({
  items,
}: {
  items: { label: string; href: string }[];
}) {
  return (
    <section
      className="border-site-outline-strong mt-16 border-t pt-8"
      aria-labelledby="sources-heading"
    >
      <p
        id="sources-heading"
        className="text-site-primary mb-4"
        style={{
          fontFamily: 'var(--font-site-mono)',
          fontSize: 11,
          letterSpacing: '0.22em',
          fontWeight: 600,
          textTransform: 'uppercase',
        }}
      >
        Sources
      </p>
      <ul className="space-y-2">
        {items.map((it) => {
          // Internal links (site-relative paths) stay in-tab via Next Link so
          // they keep the session alive and aren't counted as exits. Only
          // external sources open in a new tab.
          const isInternal = it.href.startsWith('/');
          return (
            <li
              key={it.href}
              style={{
                fontFamily: 'var(--font-site-body)',
                fontSize: 13,
                lineHeight: 1.5,
              }}
            >
              {isInternal ? (
                <Link
                  href={it.href}
                  className="text-site-on-surface-variant hover:text-site-primary"
                >
                  {it.label}
                </Link>
              ) : (
                <a
                  href={it.href}
                  target="_blank"
                  rel="noreferrer"
                  className="text-site-on-surface-variant hover:text-site-primary"
                >
                  {it.label}
                  <span aria-hidden className="text-site-outline ml-1">
                    ↗
                  </span>
                </a>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export function BreadcrumbJsonLd({
  items,
  site,
}: {
  items: { label: string; href: string }[];
  site: string;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.label,
      item: `${site}${it.href}`,
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

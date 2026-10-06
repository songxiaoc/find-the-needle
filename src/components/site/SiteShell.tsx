import type { ReactNode } from 'react';
import { FACTORY_TOOL_PATHS, getDiscoveryCopy } from '@/content/discovery-copy';
import { useLocale } from 'next-intl';

import { Link } from '@/core/i18n/navigation';
import { envConfigs, getPrimaryNavigation, siteProfile } from '@/config';
// import { advertisementLabel } from '@/config/advertising';
import { getPublishedEntityKinds } from '@/config/entities-content';
import { gameConfig, type FooterLinkGroup, type NavItem } from '@/config/game';
import { getGuideCategories } from '@/config/guides-content';
import { locales } from '@/config/locale';
import { getCommonMessages } from '@/config/locale/messages';
import { uiDataAttributes } from '@/config/ui';

// import { AdSlot } from './AdSlot';
import { FactoryEngagement } from './FactoryEngagement';
import { LanguagePrompt } from './LanguagePrompt';
import { LocaleSwitcher } from './LocaleSwitcher';
import { MobileNav } from './MobileNav';
// import { NativeAd } from './NativeAd';
import { activeNavHref } from './navActive';
import { PatchBar } from './PatchBar';
import { SocialLinks } from './SocialLinks';
import { ThemeToggle } from './ThemeToggle';

function BrandMark({
  width = 230,
  height = 54,
  compact = false,
}: {
  width?: number;
  height?: number;
  compact?: boolean;
}) {
  return (
    <img
      src={envConfigs.app_logo}
      alt={gameConfig.siteName}
      width={width}
      height={height}
      className={`site-brandmark block h-auto shrink-0 ${compact ? 'w-[124px] min-[375px]:w-[160px] md:w-[230px]' : 'w-[160px] md:w-[230px]'}`}
    />
  );
}

function SiteHeader({
  activeHref,
  navItems,
  locale,
}: {
  activeHref?: string;
  navItems: readonly NavItem[];
  locale: string;
}) {
  const localizedNavItems = navItems;
  const copy = getCommonMessages(locale);
  // Categories for the mobile drawer (the desktop sidebar's equivalent on phones,
  // so content pages also get category nav). MobileNav is a client component and
  // can't read the content index itself — we resolve it here on the server.
  const categories = getGuideCategories(locale).map((c) => ({
    label: c.title,
    href: `/guides/${c.slug}`,
    count: c.count,
  }));
  return (
    <header className="border-site-outline-variant bg-site-surface border-b">
      <nav
        className="mx-auto flex max-w-[1440px] items-center justify-between gap-3 px-4 py-4 md:px-14"
        aria-label={copy.navigation.primary}
      >
        <Link
          href="/"
          className="text-site-on-surface flex items-center no-underline"
        >
          <BrandMark compact />
        </Link>
        <div className="hidden items-center gap-5 xl:flex">
          {(() => {
            const activeNav = activeNavHref(activeHref, localizedNavItems);
            return localizedNavItems.map((item) => {
              const active = activeNav === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="site-label-md transition-colors"
                  style={{
                    color: active
                      ? 'var(--site-primary)'
                      : 'var(--site-on-surface)',
                    fontWeight: active ? 600 : 400,
                  }}
                >
                  {item.label}
                </Link>
              );
            });
          })()}
        </div>
        <div className="flex shrink-0 items-center gap-1 md:gap-2">
          <ThemeToggle locale={locale} />
          {locales.length > 1 && <LocaleSwitcher />}
          <MobileNav
            activeHref={activeHref}
            navItems={navItems}
            categories={categories}
          />
        </div>
      </nav>
    </header>
  );
}

function SiteFooter({
  entityKinds,
  locale,
}: {
  entityKinds: ReturnType<typeof getPublishedEntityKinds>;
  locale: string;
}) {
  // The "Guides" column is derived from content/guides/** so it always mirrors
  // the live category set (and renders on every page — site-wide internal links
  // to each category). Empty categories are already filtered out. Falls back to
  // a single hub link before any content exists.
  const categories = getGuideCategories(locale);
  const copy = getCommonMessages(locale);
  const guidesGroup: FooterLinkGroup = {
    heading: copy.footer.guides,
    links: categories.length
      ? categories.map((c) => ({ label: c.title, href: `/guides/${c.slug}` }))
      : [{ label: copy.ui.allGuides, href: '/guides' }],
  };
  const entityGroup: FooterLinkGroup | null = entityKinds.length
    ? {
        heading: getDiscoveryCopy(locale).database,
        links: entityKinds.map((kind) => ({
          label: kind.label,
          href: kind.route,
        })),
      }
    : null;
  const footerGroups: FooterLinkGroup[] = [
    guidesGroup,
    ...(entityGroup ? [entityGroup] : []),
    {
      heading: getDiscoveryCopy(locale).tools,
      links: FACTORY_TOOL_PATHS.map((href, i) => ({
        href,
        label: getDiscoveryCopy(locale).toolCards[i][0],
      })),
    },
    {
      heading: copy.footer.resources,
      links: [
        { label: copy.navigation.faq, href: '/faq' },
        { label: copy.navigation.requirements, href: '/system-requirements' },
        { label: copy.navigation.troubleshooting, href: '/troubleshooting' },
      ],
    },
    {
      heading: copy.footer.site,
      links: [
        { label: copy.navigation.about, href: '/about' },
        { label: copy.navigation.contact, href: '/contact' },
        { label: copy.navigation.privacy, href: '/privacy-policy' },
        { label: copy.navigation.terms, href: '/terms-of-service' },
      ],
    },
  ];

  return (
    <footer
      className="border-site-outline-variant text-site-on-surface-variant border-t"
      style={{ background: 'var(--site-surface-lowest)' }}
    >
      <div className="mx-auto max-w-[1440px] px-6 pt-12 pb-8 md:px-14">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-[1.6fr_repeat(5,minmax(0,1fr))]">
          <div>
            <div className="flex items-center gap-3">
              <BrandMark width={184} height={43} />
            </div>
            <p
              className="text-site-outline mt-3.5 max-w-[360px]"
              style={{
                fontFamily: 'var(--font-site-body)',
                fontSize: 13,
                lineHeight: 1.55,
              }}
            >
              {copy.footer.disclaimer}
            </p>
            <SocialLinks className="mt-5" />
          </div>
          {footerGroups.map((group) => (
            <div key={group.heading}>
              <p
                className="text-site-primary mb-3"
                style={{
                  fontFamily: 'var(--font-site-mono)',
                  fontSize: 10,
                  letterSpacing: '0.2em',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                }}
              >
                {group.heading}
              </p>
              <ul className="flex flex-col gap-2">
                {group.links.map((link) =>
                  link.comingSoon ? (
                    <li
                      key={link.label}
                      className="text-site-outline"
                      style={{
                        fontFamily: 'var(--font-site-body)',
                        fontSize: 13,
                      }}
                    >
                      {link.label}
                    </li>
                  ) : (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-site-on-surface hover:text-site-primary"
                        style={{
                          fontFamily: 'var(--font-site-body)',
                          fontSize: 13,
                        }}
                      >
                        {link.label}
                      </Link>
                    </li>
                  )
                )}
              </ul>
            </div>
          ))}
        </div>
        <div
          className="border-site-outline-variant text-site-outline mt-9 flex flex-wrap justify-between gap-3 border-t pt-5"
          style={{
            fontFamily: 'var(--font-site-mono)',
            fontSize: 11,
            letterSpacing: '0.08em',
          }}
        >
          <span>
            © {new Date().getFullYear()} · {gameConfig.domain.toUpperCase()}
          </span>
          {gameConfig.contactEmail && (
            <a
              href={`mailto:${gameConfig.contactEmail}`}
              className="hover:text-site-primary"
            >
              {gameConfig.contactEmail}
            </a>
          )}
        </div>
      </div>
    </footer>
  );
}

export function SiteShell({
  children,
  activeHref,
  locale: requestedLocale,
}: {
  children: ReactNode;
  activeHref?: string;
  locale?: string;
}) {
  const currentLocale = useLocale();
  const locale = requestedLocale ?? currentLocale;
  const entityKinds = siteProfile.features.entities
    ? getPublishedEntityKinds(locale)
    : [];
  const copy = getCommonMessages(locale);
  const routeLabels: Record<string, string> = {
    '/': copy.navigation.home,
    '/guides': copy.navigation.guides,
    '/faq': copy.navigation.faq,
    '/system-requirements': copy.navigation.requirements,
    '/troubleshooting': copy.navigation.troubleshooting,
    '/about': copy.navigation.about,
    '/contact': copy.navigation.contact,
    '/guides/guide/demo': copy.navigation.demo,
    '/tools': getDiscoveryCopy(locale).tools,
    '/database': getDiscoveryCopy(locale).database,
  };
  const navItems: NavItem[] = getPrimaryNavigation().map((item) => ({
    ...item,
    label: routeLabels[item.href] ?? item.label,
  }));

  if (
    entityKinds.length > 0 &&
    !navItems.some((item) => item.href === '/database')
  ) {
    navItems.push({
      label: getDiscoveryCopy(locale).database,
      href: '/database',
    });
  }

  return (
    <div
      className="site-theme bg-site-surface min-h-screen"
      {...uiDataAttributes}
    >
      <SiteHeader activeHref={activeHref} navItems={navItems} locale={locale} />
      <PatchBar />
      {/* Third-party ads temporarily disabled while unwanted redirects are investigated.
      <div className="mx-auto max-w-[1440px] px-0 pt-6 min-[344px]:px-3 md:px-14">
        <AdSlot variant="leaderboard" label={advertisementLabel(locale)} />
      </div>
      */}
      <main>{children}</main>
      {/*
      <div className="mx-auto max-w-[1180px] px-6 pb-10 md:px-14">
        <NativeAd label={advertisementLabel(locale)} />
      </div>
      */}
      <SiteFooter entityKinds={entityKinds} locale={locale} />
      <LanguagePrompt locale={locale} />
      <FactoryEngagement />
    </div>
  );
}

export function Section({
  children,
  className = '',
  alt = false,
}: {
  children: ReactNode;
  className?: string;
  /** When true, uses the slightly-lighter bg used for alternating sections. */
  alt?: boolean;
}) {
  return (
    <section
      className={
        'border-site-outline-variant border-b px-6 py-14 md:px-14 md:py-16 ' +
        (alt ? 'bg-site-surface-low ' : '') +
        className
      }
    >
      <div className="mx-auto max-w-[1440px]">{children}</div>
    </section>
  );
}

export function ArticleContainer({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto max-w-[820px] px-6 py-12 md:px-0 md:py-16">
      {children}
    </div>
  );
}

export function EarlyAccessNote({ children }: { children?: ReactNode }) {
  if (!gameConfig.statusBadge) return null;
  return (
    <div
      className="border-site-outline-strong bg-site-surface-container text-site-on-surface-variant flex items-center gap-3 border px-4 py-3"
      style={{
        fontFamily: 'var(--font-site-body)',
        fontSize: 13,
      }}
    >
      <span
        aria-hidden
        className="bg-site-primary inline-block"
        style={{ width: 6, height: 6 }}
      />
      <span
        className="text-site-primary"
        style={{
          fontFamily: 'var(--font-site-mono)',
          fontSize: 10,
          letterSpacing: '0.2em',
          fontWeight: 600,
        }}
      >
        {gameConfig.statusBadge.toUpperCase()}
      </span>
      <span>
        {children ??
          `Site content is version-stamped against ${gameConfig.gameShortName} v${gameConfig.gameVersion}.`}
      </span>
    </div>
  );
}

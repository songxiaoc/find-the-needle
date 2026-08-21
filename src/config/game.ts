import { generatedGameConfig } from '@/generated/game-config';

/** Public game/site configuration consumed by the application. */
export type NavItem = {
  label: string;
  href: string;
};

export type FooterLinkGroup = {
  heading: string;
  links: { label: string; href: string; comingSoon?: boolean }[];
};

export type GameConfig = {
  siteName: string;
  domain: string;
  origin: string;
  gameFullName: string;
  gameShortName: string;
  tagline: string;
  gameVersion: string;
  statusBadge?: string;
  eaLaunchDate: string;
  steamAppId: string;
  heroFacts?: { label: string }[];
  playUrl?: string;
  playLabel?: string;
  social?: { discord?: string; youtube?: string; x?: string; roblox?: string };
  contactEmail?: string;
  coverImage?: string;
  heroStyle?: 'cover-split' | 'video-center' | 'text-only';
  trailerUrl?: string;
  game?: {
    description?: string;
    genre?: string[];
    platforms?: string[];
    developer?: string;
    price?: string;
    priceCurrency?: string;
  };
  nav: NavItem[];
  footerExtras: FooterLinkGroup[];
  disclaimer: {
    publisher: string;
    trademarkOwners: string;
  };
};

const footerExtras: FooterLinkGroup[] = [
  {
    heading: 'Reference',
    links: [
      { label: 'FAQ', href: '/faq' },
      { label: 'System requirements', href: '/system-requirements' },
      { label: 'Troubleshooting', href: '/troubleshooting' },
    ],
  },
  {
    heading: 'Site',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Contact', href: '/contact' },
      { label: 'Sitemap', href: '/sitemap.xml' },
      { label: 'Privacy Policy', href: '/privacy-policy' },
      { label: 'Terms of Service', href: '/terms-of-service' },
    ],
  },
];

/**
 * Values live in `src/generated/game-config.ts`; this adapter keeps
 * the stable public type and derives values that must never become independent
 * truth sources. Optional fields omitted by a plan get safe structural defaults.
 */
const generated = generatedGameConfig as unknown as Omit<
  Partial<GameConfig>,
  'origin' | 'footerExtras'
> &
  Pick<
    GameConfig,
    | 'siteName'
    | 'domain'
    | 'gameFullName'
    | 'gameShortName'
    | 'tagline'
    | 'gameVersion'
    | 'eaLaunchDate'
    | 'nav'
    | 'disclaimer'
  >;

export const gameConfig: GameConfig = {
  siteName: generated.siteName,
  domain: generated.domain,
  origin: `https://${generated.domain}`,
  gameFullName: generated.gameFullName,
  gameShortName: generated.gameShortName,
  tagline: generated.tagline,
  gameVersion: generated.gameVersion,
  statusBadge: generated.statusBadge,
  eaLaunchDate: generated.eaLaunchDate,
  steamAppId: generated.steamAppId ?? '',
  heroFacts: generated.heroFacts ? [...generated.heroFacts] : [],
  playUrl: generated.playUrl ?? '',
  playLabel: generated.playLabel ?? 'Play now',
  social: generated.social ? { ...generated.social } : {},
  contactEmail: generated.contactEmail ?? '',
  coverImage: generated.coverImage ?? '',
  heroStyle: generated.heroStyle,
  trailerUrl: generated.trailerUrl ?? '',
  game: generated.game
    ? {
        ...generated.game,
        genre: generated.game.genre ? [...generated.game.genre] : undefined,
        platforms: generated.game.platforms
          ? [...generated.game.platforms]
          : undefined,
      }
    : undefined,
  nav: generated.nav.map((item) => ({ ...item })),
  footerExtras,
  disclaimer: { ...generated.disclaimer },
};

import { gameConfig, type NavItem } from './game';

/**
 * Product structure is intentionally separate from visual theme selection.
 *
 * - editorial: header + reading/content layouts
 * - wiki:      content with a persistent right rail
 * - database:  domain navigation on the left + a wide data workspace
 *
 * A site can change shell preset without changing its accent or theme package.
 */
export type ShellPreset = 'editorial' | 'wiki' | 'database';

export type SiteFeatures = {
  search: boolean;
  patchStatus: boolean;
  entities: boolean;
  tools: boolean;
  saveImport: boolean;
  community: boolean;
  market: boolean;
};

export type NavigationGroup = {
  readonly id: string;
  readonly label: string;
  readonly items: readonly NavItem[];
};

export type DataStatus = {
  /** Short label before the version, e.g. "Tracked build". */
  label: string;
  /** Optional ISO date for the last manual/data verification. */
  verifiedAt?: string;
  /** Explains the provenance without claiming more than the site can prove. */
  sourceLabel?: string;
  /** Optional patch notes or methodology destination. */
  changelogHref?: string;
  changelogLabel?: string;
};

export type SiteProfile = {
  readonly shellPreset: ShellPreset;
  readonly features: Readonly<SiteFeatures>;
  readonly navigationGroups: readonly NavigationGroup[];
  readonly dataStatus?: Readonly<DataStatus>;
};

/**
 * Template default: retain the current wiki portal, add a lightweight global
 * version/status strip, and keep larger product capabilities opt-in.
 */
export const siteProfile: SiteProfile = {
  shellPreset: 'wiki',
  features: {
    search: false,
    patchStatus: false,
    entities: false,
    tools: false,
    saveImport: false,
    community: false,
    market: false,
  },
  navigationGroups: [
    {
      id: 'primary',
      label: 'Explore',
      items: gameConfig.nav,
    },
  ],
  dataStatus: {
    label: 'Tracked build',
    sourceLabel: 'Version-stamped guides',
  },
};

/** Flatten the registry for compact desktop navigation. */
export function getPrimaryNavigation(): NavItem[] {
  return siteProfile.navigationGroups.flatMap((group) => group.items);
}

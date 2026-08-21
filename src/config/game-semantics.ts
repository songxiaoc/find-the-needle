export type SemanticDomain = 'rarity' | 'difficulty' | 'roles';

export type SemanticTone =
  | 'neutral'
  | 'common'
  | 'uncommon'
  | 'rare'
  | 'epic'
  | 'legendary'
  | 'warning'
  | 'danger'
  | 'support';

export type SemanticColorConfig = Readonly<
  Record<SemanticDomain, Readonly<Record<string, SemanticTone>>>
>;

/**
 * Game-data meaning is configured here, independently from the active site
 * theme. Keys are normalized to lowercase before lookup.
 */
export const semanticColors: SemanticColorConfig = {
  rarity: {
    common: 'common',
    uncommon: 'uncommon',
    rare: 'rare',
    epic: 'epic',
    legendary: 'legendary',
  },
  difficulty: {},
  roles: {},
};

export function getSemanticTone(
  domain: SemanticDomain,
  value: string
): SemanticTone {
  return semanticColors[domain][value.trim().toLowerCase()] ?? 'neutral';
}

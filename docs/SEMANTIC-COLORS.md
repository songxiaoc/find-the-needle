# Game semantic colors

Game-data meaning is independent from the active visual theme.

- Theme presets control surfaces, typography, spacing, and brand accent.
- semanticColors maps game values such as Rare or Legendary to stable tones.
- semantic.css owns the accessible foreground, background, and border colors.
- SemanticValue always renders a marker and a text label, never color alone.

## Configure a semantic field

Mark an Entity field in src/config/entities.ts:

    { id: 'rarity', label: 'Rarity', semantic: 'rarity' }

Map game values in src/config/game-semantics.ts:

    semanticColors: {
      rarity: {
        rare: 'rare',
        legendary: 'legendary'
      },
      difficulty: {},
      roles: {}
    }

Lookups ignore case and surrounding whitespace. Missing domains or values use
the neutral tone, so new content remains readable before its mapping is added.

## Accessibility contract

Every built-in tone uses white text on a fixed dark semantic surface. The
semantic badge also includes:

- the original value as text;
- a domain-specific marker;
- a visible contrasting border.

This keeps meaning stable in Tactical, Pixel, Neon, Aurora, and Sakura themes
without relying on the active theme accent.

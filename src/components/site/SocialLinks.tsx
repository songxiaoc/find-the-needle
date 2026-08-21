import type { ComponentType } from 'react';
import { SiDiscord, SiRoblox, SiX, SiYoutube } from 'react-icons/si';

import { gameConfig } from '@/config/game';

// Brand glyphs live in react-icons/si (Simple Icons) — lucide has no brand marks.
const PLATFORMS: {
  key: keyof NonNullable<typeof gameConfig.social>;
  label: string;
  Icon: ComponentType<{ className?: string; 'aria-hidden'?: boolean }>;
}[] = [
  { key: 'discord', label: 'Discord', Icon: SiDiscord },
  { key: 'youtube', label: 'YouTube', Icon: SiYoutube },
  { key: 'x', label: 'X', Icon: SiX },
  { key: 'roblox', label: 'Roblox', Icon: SiRoblox },
];

/**
 * Footer social icon row. Each platform renders only when its URL is set in
 * gameConfig.social; the whole row renders nothing when none are set.
 */
export function SocialLinks({ className = '' }: { className?: string }) {
  const social = gameConfig.social ?? {};
  const links = PLATFORMS.filter((p) => social[p.key]);
  if (links.length === 0) return null;

  return (
    <div className={`flex items-center gap-4 ${className}`}>
      {links.map(({ key, label, Icon }) => (
        <a
          key={key}
          href={social[key]}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          title={label}
          className="text-site-on-surface-variant hover:text-site-primary transition-colors"
        >
          <Icon className="h-5 w-5" aria-hidden />
        </a>
      ))}
    </div>
  );
}

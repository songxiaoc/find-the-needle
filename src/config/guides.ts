import { generatedGuideCategories } from '@/generated/guide-categories';
import {
  BookOpen,
  Code2,
  Flame,
  Map,
  Package,
  Swords,
  Trophy,
  type LucideIcon,
} from 'lucide-react';

export type GuideCategory = {
  /** Folder name under content/guides/ AND the URL segment (/guides/<slug>). */
  slug: string;
  title: string;
  icon: LucideIcon;
  overviewTitle?: string;
  overviewDescription?: string;
};

export const GUIDE_CATEGORY_ICONS = {
  BookOpen,
  Code2,
  Flame,
  Map,
  Package,
  Swords,
  Trophy,
} as const satisfies Record<string, LucideIcon>;

/** Icon keys are serializable strings; this adapter maps them to components. */
export const GUIDE_CATEGORIES: GuideCategory[] = generatedGuideCategories.map(
  (category) => {
    const generated = category as typeof category & {
      overviewTitle?: string;
      overviewDescription?: string;
    };
    const icon =
      GUIDE_CATEGORY_ICONS[
        generated.iconKey as keyof typeof GUIDE_CATEGORY_ICONS
      ];
    if (!icon) {
      throw new Error(
        `[guides] generated category "${generated.slug}" uses unsupported icon "${generated.iconKey}".`
      );
    }
    return {
      slug: generated.slug,
      title: generated.title,
      icon,
      overviewTitle: generated.overviewTitle,
      overviewDescription: generated.overviewDescription,
    };
  }
);

export function getCategory(slug: string): GuideCategory | undefined {
  return GUIDE_CATEGORIES.find((category) => category.slug === slug);
}

export function isGuideCategory(slug: string): boolean {
  return GUIDE_CATEGORIES.some((category) => category.slug === slug);
}

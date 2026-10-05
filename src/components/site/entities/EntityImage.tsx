import Image from 'next/image';

import type { EntityRecord } from '@/config/entities';

export function EntityImage({
  entity,
  sizes,
  priority = false,
  preview = false,
}: {
  entity: Pick<
    EntityRecord,
    'image' | 'imageAlt' | 'imagePosition' | 'imageZoom'
  >;
  sizes: string;
  priority?: boolean;
  preview?: boolean;
}) {
  if (!entity.image || !entity.imageAlt) return null;
  // Focus the catalog viewport while retaining the complete source in details.
  const zoom = preview ? (entity.imageZoom ?? 1) : 1;
  const focus = (entity.imagePosition ?? '50% 50%').split(' ').map(parseFloat);
  const shifts = focus.map(
    (position) =>
      Math.max(100 - 100 * zoom, Math.min(0, 50 - position * zoom)) -
      (50 - 50 * zoom)
  );
  return (
    <span className="bg-site-surface-high relative block aspect-video overflow-hidden">
      <Image
        src={entity.image}
        alt={entity.imageAlt}
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover"
        style={{
          transform: `translate(${shifts[0]}%, ${shifts[1]}%) scale(${zoom})`,
        }}
      />
    </span>
  );
}

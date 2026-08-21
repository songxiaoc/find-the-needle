import type { ReactNode } from 'react';

import { Link } from '@/core/i18n/navigation';
import { getEntity } from '@/config/entities-content';
import { siteProfile } from '@/config/site-profile';

export function EntityLink({
  kind,
  id,
  children,
}: {
  kind: string;
  id: string;
  children: ReactNode;
}) {
  const entity = siteProfile.features.entities
    ? getEntity(kind, id)
    : undefined;

  if (!entity) {
    return <span>{children}</span>;
  }

  return <Link href={entity.href}>{children}</Link>;
}

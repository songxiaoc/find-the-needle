import {
  getEntityField,
  type EntityKind,
  type EntityScalar,
} from '@/config/entities';

import { SemanticValue } from './SemanticValue';

function formatValue(value: EntityScalar | undefined): string {
  if (value === undefined) return '—';
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  return String(value);
}

export function EntityFieldValue({
  kind,
  fieldId,
  value,
}: {
  kind: EntityKind;
  fieldId: string;
  value: EntityScalar | undefined;
}) {
  const field = getEntityField(kind, fieldId);

  if (field?.semantic && typeof value === 'string') {
    return <SemanticValue domain={field.semantic} value={value} />;
  }

  return <>{formatValue(value)}</>;
}

export const CHECKLIST_IDS = [
  'material',
  'storage',
  'transport',
  'power',
  'inputs',
  'scan',
  'sale',
  'observe',
];
const STORAGE_KEY = 'find-the-needle:factory-checklist:v1';
type Store = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;

export function readChecklist(getStore: () => Store): {
  checks: string[];
  error: boolean;
} {
  try {
    const saved = getStore().getItem(STORAGE_KEY);
    if (saved === null) return { checks: [], error: false };
    const parsed: unknown = JSON.parse(saved);
    if (
      !Array.isArray(parsed) ||
      !parsed.every(
        (id) => typeof id === 'string' && CHECKLIST_IDS.includes(id)
      )
    )
      return { checks: [], error: true };
    return { checks: [...new Set(parsed)], error: false };
  } catch {
    return { checks: [], error: true };
  }
}
export function saveChecklist(
  getStore: () => Store,
  checks: string[],
  reset = false
): boolean {
  try {
    if (reset) getStore().removeItem(STORAGE_KEY);
    else getStore().setItem(STORAGE_KEY, JSON.stringify(checks));
    return true;
  } catch {
    return false;
  }
}

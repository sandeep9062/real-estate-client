const KEY = "pb_compare_ids";
const MAX = 4;

export function getCompareIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

export function setCompareIds(ids: string[]) {
  if (typeof window === "undefined") return;
  const next = [...new Set(ids)].slice(0, MAX);
  sessionStorage.setItem(KEY, JSON.stringify(next));
  window.dispatchEvent(new Event("pb-compare-changed"));
}

export function toggleCompareId(id: string): string[] {
  const cur = getCompareIds();
  const has = cur.includes(id);
  const next = has
    ? cur.filter((x) => x !== id)
    : [id, ...cur.filter((x) => x !== id)].slice(0, MAX);
  setCompareIds(next);
  return next;
}

export function compareCount(): number {
  return getCompareIds().length;
}

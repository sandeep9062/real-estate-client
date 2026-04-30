const KEY = "pb_recent_local";
const MAX = 12;

export function pushLocalRecentPropertyId(id: string) {
  if (typeof window === "undefined" || !id) return;
  try {
    const raw = localStorage.getItem(KEY);
    let cur: string[] = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(cur)) cur = [];
    cur = [id, ...cur.filter((x) => x !== id)].slice(0, MAX);
    localStorage.setItem(KEY, JSON.stringify(cur));
  } catch {
    /* ignore */
  }
}

export function getLocalRecentPropertyIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    const cur = raw ? JSON.parse(raw) : [];
    return Array.isArray(cur) ? cur.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

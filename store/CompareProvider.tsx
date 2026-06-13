"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";

// ──────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────
export interface CompareItem {
  _id: string;
  title: string;
  image: string;
}

interface CompareContextValue {
  items: CompareItem[];
  count: number;
  addItem: (item: CompareItem) => void;
  removeItem: (id: string) => void;
  clearAll: () => void;
  maxLimit: number;
}

// ──────────────────────────────────────────────
// Constants
// ──────────────────────────────────────────────
const META_KEY = "pb_compare_meta";
const IDS_KEY = "pb_compare_ids";
const MAX = 4; // Drawer shows max 4

// ──────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────
function getMetaFromStorage(): Record<string, CompareItem> {
  if (typeof window === "undefined") return {};
  try {
    const raw = sessionStorage.getItem(META_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function setMetaToStorage(meta: Record<string, CompareItem>) {
  try {
    sessionStorage.setItem(META_KEY, JSON.stringify(meta));
  } catch {
    // ignore
  }
}

// ──────────────────────────────────────────────
// Context
// ──────────────────────────────────────────────
const CompareContext = createContext<CompareContextValue | null>(null);

export function useCompare(): CompareContextValue {
  const ctx = useContext(CompareContext);
  if (!ctx) throw new Error("useCompare must be used within CompareProvider");
  return ctx;
}

// ──────────────────────────────────────────────
// Provider
// ──────────────────────────────────────────────
export function CompareProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CompareItem[]>([]);
  const metaRef = useRef<Record<string, CompareItem>>({});

  // Sync from sessionStorage on mount + on custom event
  const syncFromStorage = useCallback(() => {
    if (typeof window === "undefined") return;

    // Read IDs from existing compare storage
    let ids: string[] = [];
    try {
      const raw = sessionStorage.getItem(IDS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        ids = Array.isArray(parsed)
          ? parsed.filter((x) => typeof x === "string")
          : [];
      }
    } catch {
      ids = [];
    }

    // Read metadata
    const meta = getMetaFromStorage();
    metaRef.current = meta;

    // Build items array from IDs + meta (only up to MAX)
    const resolved: CompareItem[] = [];
    for (const id of ids) {
      if (resolved.length >= MAX) break;
      const existing = meta[id];
      if (existing) {
        resolved.push(existing);
      } else {
        // Placeholder for items without metadata
        resolved.push({
          _id: id,
          title: "Property",
          image: "/images/property-tricity.jpg",
        });
      }
    }

    setItems(resolved);
  }, []);

  // Initial sync
  useEffect(() => {
    syncFromStorage();

    // Re-sync whenever the custom event fires
    window.addEventListener("pb-compare-changed", syncFromStorage);
    return () =>
      window.removeEventListener("pb-compare-changed", syncFromStorage);
  }, [syncFromStorage]);

  // ── addItem ─────────────────────────────────
  const addItem = useCallback((item: CompareItem) => {
    if (typeof window === "undefined") return;

    // Read current IDs
    let ids: string[] = [];
    try {
      const raw = sessionStorage.getItem(IDS_KEY);
      if (raw) ids = JSON.parse(raw);
    } catch {
      ids = [];
    }

    // Don't add if already present
    if (ids.includes(item._id)) return;

    // Enforce max limit (max 4 properties allowed)
    if (ids.length >= 4) {
      return; // Caller should show alert
    }

    // Prepend
    ids = [item._id, ...ids.filter((x) => x !== item._id)].slice(0, 4);
    sessionStorage.setItem(IDS_KEY, JSON.stringify(ids));

    // Store metadata
    const meta = { ...getMetaFromStorage(), [item._id]: item };
    setMetaToStorage(meta);
    metaRef.current = meta;

    window.dispatchEvent(new Event("pb-compare-changed"));
  }, []);

  // ── removeItem ──────────────────────────────
  const removeItem = useCallback((id: string) => {
    if (typeof window === "undefined") return;

    let ids: string[] = [];
    try {
      const raw = sessionStorage.getItem(IDS_KEY);
      if (raw) ids = JSON.parse(raw);
    } catch {
      ids = [];
    }

    ids = ids.filter((x) => x !== id);
    sessionStorage.setItem(IDS_KEY, JSON.stringify(ids));

    // Also clean up metadata
    const meta = getMetaFromStorage();
    delete meta[id];
    setMetaToStorage(meta);
    metaRef.current = meta;

    window.dispatchEvent(new Event("pb-compare-changed"));
  }, []);

  // ── clearAll ────────────────────────────────
  const clearAll = useCallback(() => {
    if (typeof window === "undefined") return;
    sessionStorage.removeItem(IDS_KEY);
    sessionStorage.removeItem(META_KEY);
    metaRef.current = {};
    window.dispatchEvent(new Event("pb-compare-changed"));
  }, []);

  const value: CompareContextValue = {
    items,
    count: items.length,
    addItem,
    removeItem,
    clearAll,
    maxLimit: MAX,
  };

  return (
    <CompareContext.Provider value={value}>{children}</CompareContext.Provider>
  );
}

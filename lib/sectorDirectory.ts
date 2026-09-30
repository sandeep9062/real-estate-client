/**
 * Pure taxonomy + link derivation for the /sectors directory page.
 *
 * Chandigarh, Mohali and Panchkula are literally numbered sector grids
 * (Le Corbusier's plan — each sector is a real, self-contained numbered
 * block; there is famously no Sector 13). Zirakpur and Kharar are NOT
 * sector-numbered — they're organised by named localities — so they render
 * as a locality list rather than a fabricated numeric grid.
 *
 * The input is the live, guardrail-checked root SEO slug list
 * (`getRootSeoStaticParams` — the same source QuickLinks uses), so every
 * href this module emits is a URL the site itself already renders. Sectors /
 * localities with no live listings yet are still SHOWN (so the directory
 * looks complete, not full of gaps) but get no `href` — the UI disables
 * those tiles instead of linking them.
 *
 * It also derives the /sectors map pins (`buildCityMapPoints`) — one
 * clickable pin per sector/locality, positioned from the real coordinates of
 * the listings behind it (never hand-drawn map positions).
 *
 * Kept dependency-free (`node:test`-friendly, same convention as
 * `lib/filterSlug.ts`) so the derivation is unit-tested directly — see
 * `lib/__tests__/sectorDirectory.test.ts`. The server-side fetch wrapper
 * lives in `components/sector-directory/sectorDirectoryData.ts`.
 */
import { parseRootSlug } from "./rootSlugPatterns.ts";
import type { ResolvedSlug } from "./rootSlugPatterns.ts";
import type { SeoCity } from "./filterSlug.ts";
import {
  LANDMARKS,
  LANDMARK_RADIUS_KM,
  coordinatesOf,
  getLandmarkBySlug,
  propertiesNearLandmark,
} from "./landmarks.ts";

export type SectorLayout = "grid" | "list";

export interface SectorEntry {
  /** Display label — a number ("17") for grid cities, a name for list cities. */
  label: string;
  /** Present only when this sector/locality has live listings to link to. */
  href?: string;
}

export interface CityGroup {
  /** Canonical SEO city slug — doubles as the lookup key for map pins. */
  key: SeoCity;
  name: string;
  layout: SectorLayout;
  sectors: SectorEntry[];
}

/** Real, publicly documented sector ranges — used to show every sector of a
 * grid city, not only the ones that happen to have live listings. */
const KNOWN_SECTOR_RANGES: Record<string, [number, number]> = {
  // Chandigarh's official sectoral grid runs 1–60; Sector 13 does not exist
  // (a well-documented planning quirk, not a data gap).
  chandigarh: [1, 60],
  // Mohali's sectors continue past Chandigarh's sequence into the 100s+
  // (Sector 60, 65, 102, 125 …). Cap at 135 to reject obvious typos while
  // accepting all real, publicly documented Mohali sectors.
  mohali: [55, 135],
  panchkula: [1, 32],
};

/** Curated locality lists for the two non-grid cities (they have no sector
 * numbers), so their lists stay complete even when few pages are live. */
const KNOWN_LOCALITIES: Record<string, string[]> = {
  zirakpur: [
    "VIP Road",
    "Patiala Road",
    "Dhakoli",
    "Baltana",
    "Peer Muchalla",
    "Singpura",
    "Devi Nagar",
  ],
  kharar: [
    "Landran Road",
    "Kurali Road",
    "Sunny Enclave",
    "Gazipur",
    "Mohali Road",
  ],
};

function makeCityShell(): CityGroup[] {
  return [
    { key: "chandigarh", name: "Chandigarh", layout: "grid", sectors: [] },
    { key: "mohali", name: "Mohali", layout: "grid", sectors: [] },
    { key: "panchkula", name: "Panchkula", layout: "grid", sectors: [] },
    { key: "zirakpur", name: "Zirakpur", layout: "list", sectors: [] },
    { key: "kharar", name: "Kharar", layout: "list", sectors: [] },
  ];
}

/** "sector-40" → "40". `parseRootSlug` only emits numeric sector slugs, but
 * stay defensive so a future non-numeric slug can never fake a grid tile. */
function gridLabel(sectorSlug: string | null): string | null {
  const match = sectorSlug ? /^sector-(\d+)$/.exec(sectorSlug) : null;
  return match ? match[1] : null;
}

/** List cities link by landmark page (`{type}-for-rent-near-{landmark}`),
 * because that is the only live root URL family those cities have — a
 * price-bucket slug is city-wide and must NOT fabricate an area chip. */
function listLabel(resolved: ResolvedSlug): string | null {
  if (!resolved.landmarkSlug) return null;
  return getLandmarkBySlug(resolved.city, resolved.landmarkSlug)?.name ?? null;
}

/**
 * Preference order when one sector/locality has several live root pages
 * (e.g. flats + houses + PG): flats, houses, then PG. Applied consistently
 * so the tile's target never depends on backend response order.
 */
function hrefRank(spec: ResolvedSlug["spec"]): number {
  if (spec.kind === "category") {
    return spec.category === "Apartment/Flat" ? 0 : 1;
  }
  if (spec.kind === "pg") return 2;
  return Number.POSITIVE_INFINITY;
}

function normalizeLabel(label: string): string {
  return label.toLowerCase().replace(/\s+/g, " ").trim();
}

/**
 * Derive the full directory (live hrefs + disabled filler entries) from the
 * live root SEO slug list. Pure — never throws; unparseable slugs, duplicates
 * and slug families with no sector/locality (price buckets) are ignored.
 */
export function buildSectorDirectory(
  rootSlugs: readonly string[],
): CityGroup[] {
  const groups = makeCityShell();
  const bestRank = new Map<string, number>();
  const seen = new Set<string>();

  for (const slug of rootSlugs) {
    if (seen.has(slug)) continue;
    const resolved = parseRootSlug(slug);
    if (!resolved) continue;
    const group = groups.find((g) => g.key === resolved.city);
    if (!group) continue; // unreachable while SEO_CITIES === the shell keys

    const label =
      group.layout === "grid"
        ? gridLabel(resolved.sectorSlug)
        : listLabel(resolved);
    if (!label) continue;
    seen.add(slug);

    const rank = hrefRank(resolved.spec);
    const rankKey = `${group.key}|${normalizeLabel(label)}`;
    const existing = group.sectors.find(
      (s) => normalizeLabel(s.label) === normalizeLabel(label),
    );
    if (!existing) {
      group.sectors.push({ label, href: `/${slug}` });
      bestRank.set(rankKey, rank);
    } else if (rank < (bestRank.get(rankKey) ?? Number.POSITIVE_INFINITY)) {
      existing.href = `/${slug}`;
      bestRank.set(rankKey, rank);
    }
  }

  return groups.map(fillKnownEntries);
}

/** Grid cities → the full numbered grid, live tiles in place. List cities →
 * the curated locality list with live chips in place, then any extra live
 * localities (a landmark added after curation) appended. */
function fillKnownEntries(group: CityGroup): CityGroup {
  if (group.layout === "grid") {
    const range = KNOWN_SECTOR_RANGES[group.key];
    if (!range) return group;
    const [start, end] = range;
    const live = new Map(group.sectors.map((s) => [s.label, s]));
    const sectors: SectorEntry[] = [];
    for (let n = start; n <= end; n++) {
      if (group.key === "chandigarh" && n === 13) continue; // no Sector 13
      const label = String(n);
      sectors.push(live.get(label) ?? { label });
    }
    return { ...group, sectors };
  }

  const known = KNOWN_LOCALITIES[group.key] ?? [];
  const live = new Map(group.sectors.map((s) => [normalizeLabel(s.label), s]));
  const sectors: SectorEntry[] = known.map(
    (name) => live.get(normalizeLabel(name)) ?? { label: name },
  );
  const knownKeys = new Set(known.map(normalizeLabel));
  for (const entry of group.sectors) {
    if (!knownKeys.has(normalizeLabel(entry.label))) sectors.push(entry);
  }
  return { ...group, sectors };
}

/* ── Map pins for the /sectors map view ──────────────────────────────────── */

/**
 * One clickable pin on the /sectors map: a numbered sector (grid cities) or a
 * named locality (Zirakpur/Kharar). `href` is present only when that
 * sector/locality has a live listings page — the map navigates there on click.
 */
export interface SectorMapPoint {
  /** Stable per-pin id ("sector-40", landmark slug, or a slugified label). */
  id: string;
  lat: number;
  lng: number;
  title: string;
  subtitle: string;
  /** Short text rendered inside the pin disc (grid sectors: "40"). */
  badge?: string;
  /** Live sector/locality page for this pin, when one exists. */
  href?: string;
}

const SECTOR_IN_TEXT = /\bsec(?:tor)?\s*,?\s*-?\s*(\d{1,3})[a-z]?\b/i;
const BARE_NUMBER = /^(\d{1,3})$/;

/**
 * Pull a sector number out of free text — structured `location.sector` values
 * ("Sector 40", "40", "Sector 40A") and listing titles ("1 BHK Apartment for
 * Rent in Sector 40, Chandigarh"), which carry the sector even when the field
 * itself is blank. Returns null when there is no plausible 1–99 number.
 */
export function sectorNumberFromText(text: unknown): string | null {
  const s = String(text ?? "");
  const match = s.match(SECTOR_IN_TEXT) ?? s.trim().match(BARE_NUMBER);
  if (!match) return null;
  const n = Number(match[1]);
  return Number.isInteger(n) && n >= 1 && n <= 99 ? String(n) : null;
}

/** Sector label for one grid-city listing, or null when it can't be placed. */
function gridLabelForListing(
  listing: any,
  range: [number, number],
): string | null {
  const rawSector = String(listing?.location?.sector ?? "").trim();
  const num = sectorNumberFromText(rawSector) ?? sectorNumberFromText(listing?.title);
  if (num) {
    const n = Number(num);
    return n >= range[0] && n <= range[1] ? num : null;
  }
  // Non-numeric `sector` values ("Phase 7", "IT Park", "CU Area") are real
  // locality anchors in grid cities — keep them, but only from the structured
  // field (a title could contain anything).
  return rawSector || null;
}

/**
 * One pin per sector (grid cities) or per curated locality (Zirakpur/Kharar),
 * built from the live listings behind the directory:
 *   - Grid pins sit at the average coordinates of the listings that map to
 *     that sector, and link to the sector's page when one is live.
 *   - List-city pins use the curated landmark coordinates (those cities have
 *     no sector numbers), with the locality's live page joined when present.
 * Pure — never throws; listings without usable coordinates are skipped.
 */
export function buildCityMapPoints(
  group: CityGroup,
  listings: readonly any[],
): SectorMapPoint[] {
  if (group.layout === "grid") {
    const range = KNOWN_SECTOR_RANGES[group.key];
    if (!range) return [];

    const accumulators = new Map<
      string,
      { label: string; latSum: number; lngSum: number; count: number }
    >();

    for (const listing of listings) {
      const label = gridLabelForListing(listing, range);
      if (!label) continue;
      const coords = coordinatesOf(listing);
      if (!coords) continue;

      const key = normalizeLabel(label);
      const acc =
        accumulators.get(key) ??
        { label, latSum: 0, lngSum: 0, count: 0 };
      acc.latSum += coords.lat;
      acc.lngSum += coords.lng;
      acc.count += 1;
      accumulators.set(key, acc);
    }

    return Array.from(accumulators.values()).map((acc) => {
      const numeric = /^\d+$/.test(acc.label);
      const entry = group.sectors.find(
        (s) => normalizeLabel(s.label) === normalizeLabel(acc.label),
      );
      return {
        id: numeric
          ? `sector-${acc.label}`
          : normalizeLabel(acc.label).replace(/\s+/g, "-"),
        lat: acc.latSum / acc.count,
        lng: acc.lngSum / acc.count,
        title: numeric ? `Sector ${acc.label}` : acc.label,
        subtitle: `${acc.count} listing${acc.count === 1 ? "" : "s"}${
          entry?.href ? "" : " · page coming soon"
        }`,
        badge: numeric ? acc.label : undefined,
        href: entry?.href,
      };
    });
  }

  return LANDMARKS.filter((landmark) => landmark.city === group.key).map(
    (landmark) => {
      const entry = group.sectors.find(
        (s) => normalizeLabel(s.label) === normalizeLabel(landmark.name),
      );
      const nearby = propertiesNearLandmark(landmark, listings as any[]).length;
      return {
        id: landmark.slug,
        lat: landmark.lat,
        lng: landmark.lng,
        title: landmark.name,
        subtitle:
          nearby > 0
            ? `${nearby} listing${nearby === 1 ? "" : "s"} within ${LANDMARK_RADIUS_KM} km`
            : "No live listings yet",
        href: entry?.href,
      };
    },
  );
}

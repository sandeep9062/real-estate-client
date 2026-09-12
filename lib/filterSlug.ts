/**
 * Programmatic local-intent SEO pages — filter-slug utilities.
 *
 * Slugs look like:
 *   for-rent-2bhk  → { kind: "bhk", dealType: "rent", bhk: 2 }
 *   for-sale-3bhk  → { kind: "bhk", dealType: "sale", bhk: 3 }
 *   pg             → { kind: "pg" }
 *   pg-boys        → { kind: "pg", gender: "boys" }
 *   pg-girls       → { kind: "pg", gender: "girls" }
 *
 * URLs built from these slugs:
 *   /properties/chandigarh/for-rent-2bhk                     (city only)
 *   /properties/chandigarh/sector-40/for-rent-2bhk           (city + sector)
 *
 * This file is intentionally dependency-free so it can be unit-tested with
 * plain `node --test` (Node ≥ 23.6 strips TS types natively) and imported
 * from both server and client code.
 */

/** A city/sector/filter page is only rendered when at least this many real
 * listings match. Single source of truth — pages, related links and the
 * sitemap all read this constant. */
export const MIN_LISTINGS_FOR_SEO_PAGE = 3;

/** Maximum BHK value encoded in a filter slug (matches the backend's
 * bedrooms filter, which also supports "5+"). */
export const MAX_BHK_SLUG = 5;

/** Cities that get programmatic SEO pages. */
export const SEO_CITIES = [
  "chandigarh",
  "mohali",
  "panchkula",
  "zirakpur",
  "kharar",
] as const;

export type SeoCity = (typeof SEO_CITIES)[number];

export const SEO_CITY_DISPLAY: Record<SeoCity, string> = {
  chandigarh: "Chandigarh",
  mohali: "Mohali",
  panchkula: "Panchkula",
  zirakpur: "Zirakpur",
  kharar: "Kharar",
};

export type DealType = "rent" | "sale";
export type PgGender = "boys" | "girls";

/**
 * Structured representation of a filter slug.
 * - `kind: "bhk"` pages target deal type + bedroom count (any property
 *   category except PG — those have their own slugs).
 * - `kind: "pg"` pages target PG/Hostel inventory, optionally narrowed by
 *   gender (boys/girls is derived from listing title/description because the
 *   backend has no dedicated gender field).
 */
export type SeoFilterSpec =
  | { kind: "bhk"; dealType: DealType; bhk: number }
  | { kind: "pg"; gender?: PgGender };

/** Result of `parseFilterSlug` — null when the slug is not a known pattern. */
export type ParsedFilter = SeoFilterSpec | null;

/**
 * Convert a filter slug into structured query params.
 * Returns `null` for slugs that don't match a supported pattern, so callers
 * can `notFound()` on garbage URLs.
 */
export function parseFilterSlug(slug: string): ParsedFilter {
  const s = String(slug || "").toLowerCase().trim();

  const bhkMatch = s.match(/^for-(rent|sale)-([1-9])bhk$/);
  if (bhkMatch) {
    const bhk = Number(bhkMatch[2]);
    if (bhk >= 1 && bhk <= MAX_BHK_SLUG) {
      return {
        kind: "bhk",
        dealType: bhkMatch[1] as DealType,
        bhk,
      };
    }
    return null;
  }

  if (s === "pg") return { kind: "pg" };

  const pgMatch = s.match(/^pg-(boys|girls)$/);
  if (pgMatch) return { kind: "pg", gender: pgMatch[1] as PgGender };

  return null;
}

/** Inverse of `parseFilterSlug` — build the canonical filter slug. */
export function buildFilterSlug(spec: SeoFilterSpec): string {
  if (spec.kind === "pg") {
    return spec.gender ? `pg-${spec.gender}` : "pg";
  }
  return `for-${spec.dealType}-${spec.bhk}bhk`;
}

/** URL-safe slug for a sector/locality name, e.g. "Sector 40" → "sector-40". */
export function sectorToSlug(sector: string): string {
  return String(sector || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Display name for a sector slug, e.g. "sector-40" → "Sector 40". */
export function sectorSlugToDisplay(sectorSlug: string): string {
  return String(sectorSlug || "")
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Normalize a raw `location.city` value ("Chandigarh", "chandigarh",
 * " New Chandigarh" etc.) to a supported city slug. Returns null for cities
 * outside the SEO program.
 */
export function normalizeCity(raw: unknown): SeoCity | null {
  const s = String(raw || "")
    .toLowerCase()
    .replace(/[^a-z]/g, "");
  // "New Chandigarh", "Chandigarh " etc. normalize to "chandigarh".
  for (const city of SEO_CITIES) {
    if (s === city || s.endsWith(city)) return city;
  }
  return null;
}

/** Normalize a raw `location.sector` value for exact matching. */
export function normalizeSector(raw: unknown): string {
  return String(raw || "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Build the full SEO path for a combination.
 * `/properties/{city}[/{sector}]/{filter}`
 */
export function buildSeoPath(
  city: SeoCity,
  spec: SeoFilterSpec,
  sectorSlug?: string | null,
): string {
  const parts = ["properties", city];
  if (sectorSlug) parts.push(sectorSlug);
  parts.push(buildFilterSlug(spec));
  return `/${parts.join("/")}`;
}

/**
 * Map a SeoFilterSpec to backend API query params for GET /api/properties.
 * Note: PG gender is NOT an API param — callers narrow it locally via
 * `matchesFilterSpec` because the backend has no gender field.
 */
export function filtersToApiParams(
  spec: SeoFilterSpec,
): Record<string, string> {
  if (spec.kind === "pg") {
    return { propertyCategory: "PG/Hostel" };
  }
  return {
    deal: spec.dealType === "rent" ? "Rent" : "Sale",
    bedrooms: String(spec.bhk),
  };
}

const wordBoundary = (word: string) => new RegExp(`\\b${word}\\b`, "i");

const isBoysPg = (property: any): boolean => {
  const text = `${property.title || ""} ${property.description || ""}`;
  return (
    wordBoundary("boys").test(text) ||
    wordBoundary("boy").test(text) ||
    /\bmale\b/i.test(text)
  );
};

const isGirlsPg = (property: any): boolean => {
  const text = `${property.title || ""} ${property.description || ""}`;
  return (
    wordBoundary("girls").test(text) ||
    wordBoundary("girl").test(text) ||
    /\bfemale\b/i.test(text)
  );
};

/**
 * Does a raw property document (as returned by the API) match a filter spec?
 * Used to (a) narrow PG gender locally and (b) double-check API results so
 * substring matches from the backend's case-insensitive sector regex never
 * leak through (e.g. "sector 4" would otherwise match "Sector 40").
 */
export function matchesFilterSpec(
  property: any,
  spec: SeoFilterSpec,
): boolean {
  if (!property) return false;

  if (spec.kind === "pg") {
    if (String(property.propertyCategory || "") !== "PG/Hostel") return false;
    if (!spec.gender) return true;
    return spec.gender === "boys" ? isBoysPg(property) : isGirlsPg(property);
  }

  const deal = String(property.deal || "").toLowerCase();
  if (deal !== spec.dealType) return false;
  // PG/Hostel listings are covered by the dedicated `pg*` slugs — never let
  // them count toward BHK pages (keeps page counts consistent with
  // `eligibleSeoCombos`, which applies the same rule).
  if (String(property.propertyCategory || "") === "PG/Hostel") return false;
  const bedrooms = Number(property?.facilities?.bedrooms);
  return Number.isFinite(bedrooms) && bedrooms === spec.bhk;
}

export interface SeoCombo {
  city: SeoCity;
  /** null = city-level page, otherwise the sector slug ("sector-40"). */
  sectorSlug: string | null;
  spec: SeoFilterSpec;
  slug: string;
  count: number;
}

/**
 * Group raw property documents into every (city, sector, filter) combination
 * and keep only those with at least `MIN_LISTINGS_FOR_SEO_PAGE` listings.
 * Pure function — reused by the sitemap generator so the URL list is always
 * derived from live data, never hand-maintained.
 */
export function eligibleSeoCombos(properties: any[]): SeoCombo[] {
  const counts = new Map<string, SeoCombo>();

  for (const p of properties || []) {
    if (p.isActive === false || p.deletedAt) continue;

    const city = normalizeCity(p?.location?.city);
    if (!city) continue;

    const sectorRaw = normalizeSector(p?.location?.sector);
    const sectorSlug = sectorRaw ? sectorToSlug(sectorRaw) : null;

    const isPg = String(p.propertyCategory || "") === "PG/Hostel";
    const specs: SeoFilterSpec[] = [];
    if (isPg) {
      specs.push({ kind: "pg" });
      if (isBoysPg(p)) specs.push({ kind: "pg", gender: "boys" });
      if (isGirlsPg(p)) specs.push({ kind: "pg", gender: "girls" });
    } else {
      const deal = String(p.deal || "").toLowerCase();
      const bhk = Number(p?.facilities?.bedrooms);
      if (
        (deal === "rent" || deal === "sale") &&
        Number.isFinite(bhk) &&
        bhk >= 1 &&
        bhk <= MAX_BHK_SLUG
      ) {
        specs.push({ kind: "bhk", dealType: deal as DealType, bhk });
      }
    }

    for (const spec of specs) {
      // Every listing counts toward its city-level combination, and listings
      // with a sector additionally count toward their sector-level one —
      // matching the page queries (city-only filter = citywide results).
      const slug = buildFilterSlug(spec);
      const cityKey = `${city}||${slug}`;
      const cityCombo = counts.get(cityKey);
      if (cityCombo) {
        cityCombo.count += 1;
      } else {
        counts.set(cityKey, { city, sectorSlug: null, spec, slug, count: 1 });
      }
      if (sectorSlug) {
        const sectorKey = `${city}|${sectorSlug}|${slug}`;
        const sectorCombo = counts.get(sectorKey);
        if (sectorCombo) {
          sectorCombo.count += 1;
        } else {
          counts.set(sectorKey, {
            city,
            sectorSlug,
            spec,
            slug,
            count: 1,
          });
        }
      }
    }
  }

  return Array.from(counts.values()).filter(
    (c) => c.count >= MIN_LISTINGS_FOR_SEO_PAGE,
  );
}

/**
 * Map the `/properties` UI filter object to a canonical SEO href when the
 * selected filters exactly match one of the page patterns. Returns null when
 * the filters don't map to an SEO page (caller keeps the query-string URL).
 * Anything not encoded in the path is returned as leftover query params so
 * extra filters (price, furnishing, …) survive the navigation.
 */
export function buildSeoHrefFromFilters(
  filters: Record<string, unknown> | null | undefined,
): string | null {
  if (!filters) return null;

  const city = normalizeCity(filters.city);
  if (!city) return null;

  let spec: SeoFilterSpec | null = null;
  const consumed = new Set<string>(["city"]);

  const category = String(filters.propertyCategory || "");
  if (category === "PG/Hostel") {
    // The UI filter carries no gender signal; link to the plain `pg` page.
    spec = { kind: "pg" };
    consumed.add("propertyCategory");
  } else {
    const deal = String(filters.deal || "").toLowerCase();
    const bhk = Number(filters.bedrooms);
    if (
      (deal === "rent" || deal === "sale") &&
      Number.isFinite(bhk) &&
      bhk >= 1 &&
      bhk <= MAX_BHK_SLUG
    ) {
      spec = { kind: "bhk", dealType: deal as DealType, bhk };
      consumed.add("deal");
      consumed.add("bedrooms");
    }
  }
  if (!spec) return null;

  const sectorRaw = String(filters.sector || "").trim();
  let sectorSlug: string | null = null;
  if (sectorRaw) {
    sectorSlug = sectorToSlug(sectorRaw);
    consumed.add("sector");
  }

  const leftover: string[] = [];
  for (const [key, value] of Object.entries(filters)) {
    if (consumed.has(key)) continue;
    if (value === undefined || value === null || value === "") continue;
    leftover.push(
      `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`,
    );
  }

  const path = buildSeoPath(city, spec, sectorSlug);
  return leftover.length > 0 ? `${path}?${leftover.join("&")}` : path;
}

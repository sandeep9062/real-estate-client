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
 * Root-level flat URLs (see `lib/rootSlugPatterns.ts`) reuse the same specs:
 *   /house-for-rent-in-sector-12-chandigarh                  (category spec)
 *   /property-for-rent-in-mohali-under-10-thousand           (price spec)
 *   /flat-for-rent-near-pgi-chandigarh                       (landmark page)
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

/**
 * Fixed rent price buckets for `/property-for-rent-in-{city}-under-{amount}-
 * {thousand|lakh}` pages. Buckets are a closed list on purpose — free-form
 * amounts parsed out of URLs would generate near-duplicate thin pages, so
 * `parseRootSlug` validates `amount * multiplier` against this list and
 * rejects everything else.
 */
export const PRICE_BUCKETS_INR = [
  5_000, 10_000, 15_000, 20_000, 25_000, 30_000, 40_000, 50_000,
] as const;

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
 * - `kind: "category"` pages target one property category (Flats vs Houses)
 *   for the root-level `/{type}-for-rent-in-sector-{n}-{city}` and
 *   `/{type}-for-rent-near-{landmark}-{city}` URL families.
 * - `kind: "price"` pages target `deal=rent AND price <= maxPrice` for the
 *   root-level `property-for-rent-in-{city}-under-…` URL family.
 * - `kind: "independent-room"` / `kind: "flatmate"` map to subletting-enabled
 *   inventory (see `matchesFilterSpec`) for the `independent-room` / `flatmate`
 *   landmark URL types. NOTE (open decision #1): the mapping
 *   `allowsSubletting === true` / `allowsSubletting === true AND
 *   maxPersonsSharing > 1` is provisional — pages for these two kinds 404
 *   until it is confirmed.
 */
export type SeoFilterSpec =
  | { kind: "bhk"; dealType: DealType; bhk: number }
  | { kind: "pg"; gender?: PgGender }
  | {
      kind: "category";
      dealType: DealType;
      category: "House/Villa" | "Apartment/Flat";
    }
  | { kind: "price"; dealType: DealType; maxPrice: number }
  | { kind: "independent-room" }
  | { kind: "flatmate" };

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

/** Inverse of `parseFilterSlug` — build the canonical filter slug.
 *
 * Only `bhk` and `pg` specs are parseable by `parseFilterSlug` (they are the
 * only kinds that exist as nested `/properties/...` filter segments). The
 * remaining kinds get canonical key tokens here so combo grouping, related-link
 * comparisons and debugging all share one slug source of truth — those kinds
 * are root-URL-only (see `lib/rootSlugPatterns.ts`).
 */
export function buildFilterSlug(spec: SeoFilterSpec): string {
  if (spec.kind === "pg") {
    return spec.gender ? `pg-${spec.gender}` : "pg";
  }
  if (spec.kind === "bhk") {
    return `for-${spec.dealType}-${spec.bhk}bhk`;
  }
  if (spec.kind === "category") {
    return `${spec.category === "House/Villa" ? "house" : "flat"}-for-${spec.dealType}`;
  }
  if (spec.kind === "price") {
    return `for-${spec.dealType}-under-${spec.maxPrice}`;
  }
  if (spec.kind === "independent-room") {
    return "independent-room-for-rent";
  }
  return "flatmate-for-rent";
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
  if (spec.kind === "category") {
    return {
      deal: spec.dealType === "rent" ? "Rent" : "Sale",
      propertyCategory: spec.category,
    };
  }
  if (spec.kind === "price") {
    return { deal: "Rent", priceMax: String(spec.maxPrice) };
  }
  if (spec.kind === "independent-room" || spec.kind === "flatmate") {
    // No clean backend params yet (open decision #1) — the geo endpoint
    // returns nearby rent docs and `matchesFilterSpec` narrows locally.
    return { deal: "Rent" };
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

  if (spec.kind === "category") {
    return (
      String(property.deal || "").toLowerCase() === spec.dealType &&
      String(property.propertyCategory || "") === spec.category
    );
  }

  if (spec.kind === "price") {
    const price = Number(property.price);
    return (
      String(property.deal || "").toLowerCase() === spec.dealType &&
      Number.isFinite(price) &&
      price <= spec.maxPrice
    );
  }

  // Provisional mappings for open decision #1 — do not wire live until
  // confirmed (pages for these kinds 404 for now).
  if (spec.kind === "independent-room") {
    return (
      String(property.deal || "").toLowerCase() === "rent" &&
      property.allowsSubletting === true
    );
  }
  if (spec.kind === "flatmate") {
    return (
      String(property.deal || "").toLowerCase() === "rent" &&
      property.allowsSubletting === true &&
      Number(property.maxPersonsSharing) > 1
    );
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

/**
 * Derive every SEO filter spec a raw property document belongs to.
 * Extracted from the `eligibleSeoCombos` loop so the sector/city combo
 * generator and the landmark combo generator (`lib/seoListings.ts`) group
 * documents identically and can never drift apart.
 *
 * Pure function — dependency-free per this file's header convention.
 */
export function specsForProperty(property: any): SeoFilterSpec[] {
  const specs: SeoFilterSpec[] = [];
  if (!property) return specs;

  const category = String(property.propertyCategory || "");
  if (category === "PG/Hostel") {
    // PG listings are covered by the dedicated `pg*` slugs only; gender
    // variants are derived from title/description text (no backend field).
    specs.push({ kind: "pg" });
    if (isBoysPg(property)) specs.push({ kind: "pg", gender: "boys" });
    if (isGirlsPg(property)) specs.push({ kind: "pg", gender: "girls" });
    return specs;
  }

  const deal = String(property.deal || "").toLowerCase();
  if (deal !== "rent" && deal !== "sale") return specs;

  // TODO(open decision #1): independent-room/flatmate specs are derived so the
  // mapping can be switched on in one place, but combo generators skip these
  // kinds until the subletting mapping is confirmed live.
  if (deal === "rent" && property.allowsSubletting === true) {
    specs.push({ kind: "independent-room" });
    if (Number(property.maxPersonsSharing) > 1) {
      specs.push({ kind: "flatmate" });
    }
  }

  const bedrooms = Number(property?.facilities?.bedrooms);
  if (Number.isFinite(bedrooms) && bedrooms >= 1 && bedrooms <= MAX_BHK_SLUG) {
    specs.push({ kind: "bhk", dealType: deal as DealType, bhk: bedrooms });
  }

  if (category === "House/Villa" || category === "Apartment/Flat") {
    specs.push({
      kind: "category",
      dealType: deal as DealType,
      category: category as "House/Villa" | "Apartment/Flat",
    });
  }

  return specs;
}

export interface SeoCombo {
  city: SeoCity;
  /** null = city-level page, otherwise the sector slug ("sector-40"). */
  sectorSlug: string | null;
  /**
   * null = non-landmark page, otherwise the landmark slug. Mutually exclusive
   * with `sectorSlug` (landmark pages are proximity-based, never sector-scoped).
   */
  landmarkSlug: string | null;
  spec: SeoFilterSpec;
  slug: string;
  count: number;
}

/**
 * Group raw property documents into every (city, sector, filter) combination
 * and keep only those with at least `MIN_LISTINGS_FOR_SEO_PAGE` listings.
 * Pure function — reused by the sitemap generator so the URL list is always
 * derived from live data, never hand-maintained.
 *
 * Spec derivation lives in `specsForProperty` (shared with the landmark combo
 * generator in `lib/seoListings.ts`) so the two generators cannot drift apart.
 */
export function eligibleSeoCombos(properties: any[]): SeoCombo[] {
  const counts = new Map<string, SeoCombo>();

  for (const p of properties || []) {
    if (p.isActive === false || p.deletedAt) continue;

    const city = normalizeCity(p?.location?.city);
    if (!city) continue;

    const sectorRaw = normalizeSector(p?.location?.sector);
    const sectorSlug = sectorRaw ? sectorToSlug(sectorRaw) : null;

    for (const spec of specsForProperty(p)) {
      // TODO(open decision #1): independent-room/flatmate URL types are not
      // live yet — skip them here so the sitemap never lists a 404.
      if (spec.kind === "independent-room" || spec.kind === "flatmate") {
        continue;
      }

      // Every listing counts toward its city-level combination, and listings
      // with a sector additionally count toward their sector-level one —
      // matching the page queries (city-only filter = citywide results).
      // City-level combos only exist for kinds with a nested city-level URL
      // (bhk, pg); category specs are root-URL-only and sector-scoped, which
      // is what lets sector pages report accurate Flats-only vs Houses-only
      // counts instead of blended BHK counts.
      const slug = buildFilterSlug(spec);
      if (spec.kind === "bhk" || spec.kind === "pg") {
        const cityKey = `${city}||${slug}`;
        const cityCombo = counts.get(cityKey);
        if (cityCombo) {
          cityCombo.count += 1;
        } else {
          counts.set(cityKey, {
            city,
            sectorSlug: null,
            landmarkSlug: null,
            spec,
            slug,
            count: 1,
          });
        }
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
            landmarkSlug: null,
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
 * City-level price-bucket combos for the root-level
 * `/property-for-rent-in-{city}-under-{amount}-{thousand|lakh}` URL family.
 * Pure function over the same raw property documents `eligibleSeoCombos`
 * consumes, applying the same `MIN_LISTINGS_FOR_SEO_PAGE` guardrail so the
 * sitemap and `generateStaticParams` can never list a URL the site would 404.
 * Buckets are the fixed `PRICE_BUCKETS_INR` list — never free-form amounts.
 */
export function eligiblePriceBucketCombos(properties: any[]): SeoCombo[] {
  const counts = new Map<string, { count: number; bucket: number }>();

  for (const p of properties || []) {
    if (p.isActive === false || p.deletedAt) continue;

    const city = normalizeCity(p?.location?.city);
    if (!city) continue;
    if (String(p.deal || "").toLowerCase() !== "rent") continue;

    const price = Number(p.price);
    if (!Number.isFinite(price)) continue;

    for (const bucket of PRICE_BUCKETS_INR) {
      if (price > bucket) continue;
      const key = `${city}||${bucket}`;
      const entry = counts.get(key);
      if (entry) {
        entry.count += 1;
      } else {
        counts.set(key, { count: 1, bucket });
      }
    }
  }

  const combos: SeoCombo[] = [];
  for (const [key, { count, bucket }] of counts) {
    if (count < MIN_LISTINGS_FOR_SEO_PAGE) continue;
    const city = key.split("||")[0] as SeoCity;
    const spec: SeoFilterSpec = {
      kind: "price",
      dealType: "rent",
      maxPrice: bucket,
    };
    combos.push({
      city,
      sectorSlug: null,
      landmarkSlug: null,
      spec,
      slug: buildFilterSlug(spec),
      count,
    });
  }
  return combos;
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

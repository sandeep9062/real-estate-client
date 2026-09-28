/**
 * Parsers/builders for the root-level flat SEO URLs
 * (competitor-parity with LetsRentz), kept dependency-free apart from
 * `lib/filterSlug.ts` and `lib/landmarks.ts` so it can be unit-tested with
 * plain `node --test` (same convention as `filterSlug.ts`).
 *
 * Supported patterns, in match order (first match wins):
 *   1. /property-for-rent-in-{city}-under-{amount}-{thousand|lakh}   (price)
 *   2. /pg-in-sector-{n}-{city}                                      (pg)
 *   3. /(house|flat)-for-rent-in-sector-{n}-{city}                   (category)
 *   4. /(house|flat|independent-room|pg|flatmate)-for-rent-near-
 *      {landmark-slug}-{city}                                        (landmark)
 *
 * Canonical-only: any slug containing uppercase letters or characters outside
 * [a-z0-9-] is rejected, as is any city spelling that isn't the exact SEO
 * city slug — duplicate URLs must never render the same content.
 */
import {
  SEO_CITIES,
  SEO_CITY_DISPLAY,
  PRICE_BUCKETS_INR,
  sectorSlugToDisplay,
} from "./filterSlug.ts";
import type { SeoCity, SeoFilterSpec } from "./filterSlug.ts";
import { getLandmarkBySlug } from "./landmarks.ts";

export interface ResolvedSlug {
  city: SeoCity;
  sectorSlug: string | null;
  landmarkSlug: string | null;
  spec: SeoFilterSpec;
}

/** Root-level URL type tokens for the landmark/category URL families. */
export type RootListingType =
  | "house"
  | "flat"
  | "independent-room"
  | "pg"
  | "flatmate";

const CITY_ALT = SEO_CITIES.join("|");

/** Map a spec to the `{type}` token of the root URL families (null if none). */
export function rootTypeForSpec(spec: SeoFilterSpec): RootListingType | null {
  if (spec.kind === "category") {
    return spec.category === "House/Villa" ? "house" : "flat";
  }
  if (spec.kind === "pg") return "pg";
  if (spec.kind === "independent-room") return "independent-room";
  if (spec.kind === "flatmate") return "flatmate";
  return null;
}

function specForRootType(type: RootListingType): SeoFilterSpec {
  switch (type) {
    case "house":
      return { kind: "category", dealType: "rent", category: "House/Villa" };
    case "flat":
      return { kind: "category", dealType: "rent", category: "Apartment/Flat" };
    case "pg":
      return { kind: "pg" };
    case "independent-room":
      return { kind: "independent-room" };
    case "flatmate":
      return { kind: "flatmate" };
  }
}

/**
 * Parse a root-level slug into a structured page request.
 * Returns null (never throws) for anything that doesn't match a supported
 * pattern, so callers can `notFound()` on garbage URLs.
 */
export function parseRootSlug(slug: string): ResolvedSlug | null {
  const s = String(slug || "");

  // Canonical-only: reject non-lowercase or non-[a-z0-9-] slugs outright.
  if (!s || s !== s.toLowerCase() || !/^[a-z0-9-]+$/.test(s)) return null;

  // 1. Price bucket: property-for-rent-in-{city}-under-{amount}-{unit}
  const priceMatch = s.match(
    new RegExp(
      `^property-for-rent-in-(${CITY_ALT})-under-(\\d+)-(thousand|lakh)$`,
    ),
  );
  if (priceMatch) {
    const city = priceMatch[1] as SeoCity;
    const amount = Number(priceMatch[2]);
    const multiplier = priceMatch[3] === "lakh" ? 100_000 : 1_000;
    const maxPrice = amount * multiplier;
    // Fixed buckets only — arbitrary amounts would create near-duplicate
    // thin pages, so anything not in PRICE_BUCKETS_INR 404s.
    if (!(PRICE_BUCKETS_INR as readonly number[]).includes(maxPrice)) {
      return null;
    }
    return {
      city,
      sectorSlug: null,
      landmarkSlug: null,
      spec: { kind: "price", dealType: "rent", maxPrice },
    };
  }

  // 2. PG sector: pg-in-sector-{n}-{city}
  const pgSectorMatch = s.match(
    new RegExp(`^pg-in-sector-([1-9]\\d?)-(${CITY_ALT})$`),
  );
  if (pgSectorMatch) {
    return {
      city: pgSectorMatch[2] as SeoCity,
      sectorSlug: `sector-${pgSectorMatch[1]}`,
      landmarkSlug: null,
      spec: { kind: "pg" },
    };
  }

  // 3. Category sector: (house|flat)-for-rent-in-sector-{n}-{city}
  const catSectorMatch = s.match(
    new RegExp(`^(house|flat)-for-rent-in-sector-([1-9]\\d?)-(${CITY_ALT})$`),
  );
  if (catSectorMatch) {
    return {
      city: catSectorMatch[3] as SeoCity,
      sectorSlug: `sector-${catSectorMatch[2]}`,
      landmarkSlug: null,
      spec: specForRootType(catSectorMatch[1] as RootListingType),
    };
  }

  // 4. Landmark: {type}-for-rent-near-{landmark-slug}-{city}
  const nearMatch = s.match(
    new RegExp(
      `^(house|flat|independent-room|pg|flatmate)-for-rent-near-(.+)-(${CITY_ALT})$`,
    ),
  );
  if (nearMatch) {
    const city = nearMatch[3] as SeoCity;
    const landmarkSlug = nearMatch[2];
    const landmark = getLandmarkBySlug(city, landmarkSlug);
    if (!landmark) return null;
    return {
      city,
      sectorSlug: null,
      landmarkSlug: landmark.slug,
      spec: specForRootType(nearMatch[1] as RootListingType),
    };
  }

  return null;
}

/**
 * Inverse of `parseRootSlug` — build the canonical root-level slug for a
 * resolved page. Returns null when the (city, sector/landmark, spec)
 * combination has no root-level URL (e.g. bhk specs stay on the nested
 * `/properties/...` routes) — callers fall back to `buildSeoPath`.
 */
export function buildRootSlug(
  city: SeoCity,
  spec: SeoFilterSpec,
  opts?: { sectorSlug?: string | null; landmarkSlug?: string | null },
): string | null {
  const landmarkSlug = opts?.landmarkSlug || null;
  const sectorSlug = opts?.sectorSlug || null;

  // Landmark pages: /{type}-for-rent-near-{landmark-slug}-{city}
  if (landmarkSlug) {
    const type = rootTypeForSpec(spec);
    if (!type) return null;
    return `${type}-for-rent-near-${landmarkSlug}-${city}`;
  }

  // Price buckets: /property-for-rent-in-{city}-under-{amount}-{unit}
  if (spec.kind === "price") {
    const maxPrice = spec.maxPrice;
    if (!(PRICE_BUCKETS_INR as readonly number[]).includes(maxPrice)) {
      return null;
    }
    const unit =
      maxPrice % 100_000 === 0
        ? `${maxPrice / 100_000}-lakh`
        : `${maxPrice / 1_000}-thousand`;
    return `property-for-rent-in-${city}-under-${unit}`;
  }

  // Sector + type-only pages (no BHK):
  //   /{house|flat}-for-rent-in-sector-{n}-{city}
  //   /pg-in-sector-{n}-{city}
  if (sectorSlug) {
    if (spec.kind === "category" && spec.dealType === "rent") {
      return `${rootTypeForSpec(spec)}-for-rent-in-${sectorSlug}-${city}`;
    }
    if (spec.kind === "pg" && !spec.gender) {
      return `pg-in-${sectorSlug}-${city}`;
    }
    return null;
  }

  return null;
}

/**
 * Canonical URL path for a `SeoCombo` (from `eligibleSeoCombos`,
 * `eligibleLandmarkSeoCombos` or `eligiblePriceBucketCombos`). Root-level
 * kinds (category / landmark / price) resolve to flat URLs; bhk/pg combos
 * keep the nested `/properties/...` path. Returns null when the combo has no
 * live URL (caller skips it, e.g. sitemap / generateStaticParams).
 */
export function seoComboPath(combo: {
  city: SeoCity;
  sectorSlug: string | null;
  landmarkSlug: string | null;
  spec: SeoFilterSpec;
}): string | null {
  const rootSlug = buildRootSlug(combo.city, combo.spec, {
    sectorSlug: combo.sectorSlug,
    landmarkSlug: combo.landmarkSlug,
  });
  if (rootSlug) return `/${rootSlug}`;
  // Nested fallback is only valid for the original bhk/pg combos.
  if (combo.spec.kind === "bhk") {
    return `/properties/${combo.city}${combo.sectorSlug ? `/${combo.sectorSlug}` : ""}/for-${combo.spec.dealType}-${combo.spec.bhk}bhk`;
  }
  if (combo.spec.kind === "pg") {
    return `/properties/${combo.city}${combo.sectorSlug ? `/${combo.sectorSlug}` : ""}/${combo.spec.gender ? `pg-${combo.spec.gender}` : "pg"}`;
  }
  return null;
}

/**
 * Short human label for a root-level slug, for quick-link / chip UI
 * (homepage "popular searches").
 *   /flat-for-rent-in-sector-40-chandigarh       → "Flats in Sector 40, Chandigarh"
 *   /pg-in-sector-14-chandigarh                  → "PG in Sector 14, Chandigarh"
 *   /flat-for-rent-near-pgi-chandigarh           → "Flats near PGI Hospital (PGIMER)"
 *   /property-for-rent-in-mohali-under-10-thousand → "Under ₹10,000 in Mohali"
 * Returns null for slugs that don't resolve (callers skip them silently).
 * Pure function — dependency-free per this file's header convention.
 */
export function quickLinkLabel(slug: string): string | null {
  const resolved = parseRootSlug(slug);
  if (!resolved) return null;
  const city = SEO_CITY_DISPLAY[resolved.city];

  if (resolved.landmarkSlug) {
    const landmark = getLandmarkBySlug(resolved.city, resolved.landmarkSlug);
    const type =
      resolved.spec.kind === "category"
        ? resolved.spec.category === "House/Villa"
          ? "Houses"
          : "Flats"
        : resolved.spec.kind === "pg"
          ? "PG"
          : resolved.spec.kind === "independent-room"
            ? "Independent rooms"
            : "Flatmate rooms";
    return `${type} near ${landmark?.name ?? resolved.landmarkSlug}`;
  }

  if (resolved.spec.kind === "category") {
    const type = resolved.spec.category === "House/Villa" ? "Houses" : "Flats";
    return resolved.sectorSlug
      ? `${type} in ${sectorSlugToDisplay(resolved.sectorSlug)}, ${city}`
      : `${type} in ${city}`;
  }

  if (resolved.spec.kind === "pg") {
    return resolved.sectorSlug
      ? `PG in ${sectorSlugToDisplay(resolved.sectorSlug)}, ${city}`
      : `PG in ${city}`;
  }

  if (resolved.spec.kind === "price") {
    return `Under ₹${resolved.spec.maxPrice.toLocaleString("en-IN")} in ${city}`;
  }

  return null;
}
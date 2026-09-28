/**
 * SEO copy builders for the programmatic local-intent landing pages.
 * Pure functions — no imports — so they are unit-testable with `node --test`.
 */
import type { Metadata } from "next";
import {
  SeoCity,
  SeoFilterSpec,
  SEO_CITY_DISPLAY,
  buildSeoPath,
  normalizeCity,
  parseFilterSlug,
  sectorSlugToDisplay,
} from "./filterSlug";
import { buildRootSlug } from "./rootSlugPatterns";
import type { Landmark } from "./landmarks";
import type { ResolvedSlug } from "./rootSlugPatterns";

const truncate = (text: string, max: number): string =>
  text.length <= max ? text : `${text.slice(0, max - 1).trimEnd()}…`;

const dealNoun = (dealType: "rent" | "sale") =>
  dealType === "rent" ? "Rent" : "Sale";

const dealPhrase = (dealType: "rent" | "sale") =>
  dealType === "rent" ? "rent" : "buying";

const bhkPropertyNoun = (bhk: number) => (bhk === 1 ? "Flat" : "Flats");

const inr = (amount: number) => `₹${amount.toLocaleString("en-IN")}`;

/**
 * Place suffix: "Sector 40, Chandigarh", just "Chandigarh", or
 * "near PGI Hospital (PGIMER), Chandigarh" for landmark pages.
 */
export function placeLabel(
  city: SeoCity,
  sectorSlug: string | null,
  landmark?: Landmark | null,
): string {
  const cityDisplay = SEO_CITY_DISPLAY[city];
  if (landmark) return `near ${landmark.name}, ${cityDisplay}`;
  return sectorSlug
    ? `${sectorSlugToDisplay(sectorSlug)}, ${cityDisplay}`
    : cityDisplay;
}

/**
 * H1 pattern:
 *   "2 BHK Flats for Rent in Sector 40, Chandigarh"
 *   "PG Accommodation for Boys in Sector 34, Chandigarh"
 *   "PG Accommodation in Kharar" (city-level)
 *   "Flats for Rent in Sector 12, Chandigarh"              (category)
 *   "Flats for Rent near PGI Hospital (PGIMER), Chandigarh" (landmark)
 *   "Property for Rent in Mohali under ₹10,000"            (price bucket)
 */
export function pageH1(
  city: SeoCity,
  sectorSlug: string | null,
  spec: SeoFilterSpec,
  landmark?: Landmark | null,
): string {
  const place = placeLabel(city, sectorSlug, landmark);
  if (spec.kind === "pg") {
    return spec.gender
      ? `PG Accommodation for ${
          spec.gender.charAt(0).toUpperCase() + spec.gender.slice(1)
        } in ${place}`
      : `PG Accommodation in ${place}`;
  }
  if (spec.kind === "category") {
    const noun = spec.category === "House/Villa" ? "Houses" : "Flats";
    return `${noun} for ${dealNoun(spec.dealType)} in ${place}`;
  }
  if (spec.kind === "price") {
    return `Property for ${dealNoun(spec.dealType)} in ${place} under ${inr(spec.maxPrice)}`;
  }
  if (spec.kind === "independent-room") {
    return `Independent Rooms for Rent in ${place}`;
  }
  if (spec.kind === "flatmate") {
    return `Flatmate Rooms for Rent in ${place}`;
  }
  return `${spec.bhk} BHK ${bhkPropertyNoun(spec.bhk)} for ${dealNoun(
    spec.dealType,
  )} in ${place}`;
}

/** Meta title — same pattern, truncated to ~60 chars. */
export function seoMetaTitle(
  city: SeoCity,
  sectorSlug: string | null,
  spec: SeoFilterSpec,
  landmark?: Landmark | null,
): string {
  return truncate(pageH1(city, sectorSlug, spec, landmark), 60);
}

/** Meta description — ~155 chars. */
export function seoMetaDescription(
  city: SeoCity,
  sectorSlug: string | null,
  spec: SeoFilterSpec,
  landmark?: Landmark | null,
): string {
  const place = placeLabel(city, sectorSlug, landmark);
  const inPlace = `in ${place}`;
  if (spec.kind === "pg") {
    const who = spec.gender ? ` for ${spec.gender}` : "";
    return truncate(
      `Browse verified PG accommodation${who} in ${place}. No hidden fees, no fake listings. Updated daily on PropertyBulbul.`,
      155,
    );
  }
  if (spec.kind === "category") {
    const noun =
      spec.category === "House/Villa" ? "houses" : "flats & apartments";
    return truncate(
      `Browse verified ${noun} for ${dealPhrase(spec.dealType)} ${inPlace}. No hidden fees, no fake listings. Updated daily on PropertyBulbul.`,
      155,
    );
  }
  if (spec.kind === "price") {
    return truncate(
      `Browse verified rental properties ${inPlace} under ${inr(spec.maxPrice)}. No hidden fees, no fake listings. Updated daily on PropertyBulbul.`,
      155,
    );
  }
  if (spec.kind === "independent-room") {
    return truncate(
      `Browse verified independent rooms for rent ${inPlace} (subletting allowed). No hidden fees, no fake listings. Updated daily on PropertyBulbul.`,
      155,
    );
  }
  if (spec.kind === "flatmate") {
    return truncate(
      `Browse verified rooms to share with flatmates ${inPlace}. No hidden fees, no fake listings. Updated daily on PropertyBulbul.`,
      155,
    );
  }
  return truncate(
    `Browse verified ${spec.bhk} BHK ${bhkPropertyNoun(
      spec.bhk,
    )} for ${dealPhrase(spec.dealType)} ${inPlace}. No hidden fees, no fake listings. Updated daily on PropertyBulbul.`,
    155,
  );
}

/**
 * Intro paragraph with the live listing count injected:
 * "Looking for a 2 BHK rental in Sector 40, Chandigarh? PropertyBulbul lists
 * 14 verified properties in this area, refreshed daily from active Tricity
 * brokers."
 */
export function seoIntroParagraph(
  city: SeoCity,
  sectorSlug: string | null,
  spec: SeoFilterSpec,
  count: number,
  landmark?: Landmark | null,
): string {
  const place = placeLabel(city, sectorSlug, landmark);
  if (spec.kind === "pg") {
    const who = spec.gender ? ` for ${spec.gender}` : "";
    return `Looking for PG accommodation${who} in ${place}? PropertyBulbul lists ${count} verified PG in this area, refreshed daily from active Tricity brokers.`;
  }
  if (spec.kind === "category") {
    const noun =
      spec.category === "House/Villa" ? "houses" : "flats & apartments";
    return `Looking for ${noun} for ${dealPhrase(spec.dealType)} ${place}? PropertyBulbul lists ${count} verified options in this area, refreshed daily from active Tricity brokers.`;
  }
  if (spec.kind === "price") {
    return `Looking for a rental ${place} under ${inr(spec.maxPrice)}? PropertyBulbul lists ${count} verified properties in this price range, refreshed daily from active Tricity brokers.`;
  }
  if (spec.kind === "independent-room") {
    return `Looking for an independent room for rent ${place}? PropertyBulbul lists ${count} verified rooms in this area, refreshed daily from active Tricity brokers.`;
  }
  if (spec.kind === "flatmate") {
    return `Looking for a room to share with flatmates ${place}? PropertyBulbul lists ${count} verified options in this area, refreshed daily from active Tricity brokers.`;
  }
  return `Looking for a ${spec.bhk} BHK ${
    spec.dealType === "rent" ? "rental" : "property to buy"
  } in ${place}? PropertyBulbul lists ${count} verified ${
    spec.bhk
  } BHK ${bhkPropertyNoun(spec.bhk).toLowerCase()} in this area, refreshed daily from active Tricity brokers.`;
}

/** Human label for a related-page link. */
export function relatedPageLabel(spec: SeoFilterSpec): string {
  if (spec.kind === "pg") {
    return spec.gender
      ? `PG for ${spec.gender.charAt(0).toUpperCase() + spec.gender.slice(1)}`
      : "All PG Accommodation";
  }
  if (spec.kind === "category") {
    return spec.category === "House/Villa" ? "Houses" : "Flats";
  }
  if (spec.kind === "price") {
    return `Under ${inr(spec.maxPrice)}`;
  }
  if (spec.kind === "independent-room") return "Independent Rooms";
  if (spec.kind === "flatmate") return "Flatmate Rooms";
  return `${spec.bhk} BHK for ${dealNoun(spec.dealType)}`;
}

/**
 * Next.js Metadata for an SEO landing page. Returns null when the
 * city/filter combination is not a valid page pattern (caller 404s).
 */
export function buildSeoMetadata(
  citySlug: string,
  sectorSlug: string | null,
  filterSlug: string,
): Metadata | null {
  const city = normalizeCity(citySlug);
  const spec = parseFilterSlug(filterSlug);
  if (!city || !spec) return null;
  // Only canonical slugs get metadata; non-canonical city spellings fall
  // through to notFound().
  if (city !== String(citySlug || "").toLowerCase()) return null;

  const path = buildSeoPath(city, spec, sectorSlug);
  return {
    title: seoMetaTitle(city, sectorSlug, spec),
    description: seoMetaDescription(city, sectorSlug, spec),
    alternates: { canonical: path },
    openGraph: {
      title: seoMetaTitle(city, sectorSlug, spec),
      description: seoMetaDescription(city, sectorSlug, spec),
      locale: "en_IN",
      type: "website",
    },
  };
}

/**
 * Next.js Metadata for a ROOT-LEVEL SEO landing page
 * (`app/[slug]/page.tsx`), built from the structured `parseRootSlug` result
 * instead of route segments. Returns null when the combination has no live
 * URL (caller 404s).
 */
export function buildRootSeoMetadata(
  resolved: ResolvedSlug,
  landmark?: Landmark | null,
): Metadata | null {
  const { city, sectorSlug, landmarkSlug, spec } = resolved;
  const rootSlug = buildRootSlug(city, spec, { sectorSlug, landmarkSlug });
  if (!rootSlug) return null;

  return {
    title: seoMetaTitle(city, sectorSlug, spec, landmark),
    description: seoMetaDescription(city, sectorSlug, spec, landmark),
    alternates: { canonical: `/${rootSlug}` },
    openGraph: {
      title: seoMetaTitle(city, sectorSlug, spec, landmark),
      description: seoMetaDescription(city, sectorSlug, spec, landmark),
      locale: "en_IN",
      type: "website",
    },
  };
}

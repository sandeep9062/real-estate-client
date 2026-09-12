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

const truncate = (text: string, max: number): string =>
  text.length <= max ? text : `${text.slice(0, max - 1).trimEnd()}…`;

const dealNoun = (dealType: "rent" | "sale") =>
  dealType === "rent" ? "Rent" : "Sale";

const dealPhrase = (dealType: "rent" | "sale") =>
  dealType === "rent" ? "rent" : "buying";

const bhkPropertyNoun = (bhk: number) => (bhk === 1 ? "Flat" : "Flats");

/** Place suffix: "Sector 40, Chandigarh" or just "Chandigarh". */
export function placeLabel(
  city: SeoCity,
  sectorSlug: string | null,
): string {
  const cityDisplay = SEO_CITY_DISPLAY[city];
  return sectorSlug
    ? `${sectorSlugToDisplay(sectorSlug)}, ${cityDisplay}`
    : cityDisplay;
}

/**
 * H1 pattern:
 *   "2 BHK Flats for Rent in Sector 40, Chandigarh"
 *   "PG Accommodation for Boys in Sector 34, Chandigarh"
 *   "PG Accommodation in Kharar" (city-level)
 */
export function pageH1(
  city: SeoCity,
  sectorSlug: string | null,
  spec: SeoFilterSpec,
): string {
  const place = placeLabel(city, sectorSlug);
  if (spec.kind === "pg") {
    return spec.gender
      ? `PG Accommodation for ${
          spec.gender.charAt(0).toUpperCase() + spec.gender.slice(1)
        } in ${place}`
      : `PG Accommodation in ${place}`;
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
): string {
  return truncate(pageH1(city, sectorSlug, spec), 60);
}

/** Meta description — ~155 chars. */
export function seoMetaDescription(
  city: SeoCity,
  sectorSlug: string | null,
  spec: SeoFilterSpec,
): string {
  const place = placeLabel(city, sectorSlug);
  const inPlace = sectorSlug ? `in ${place}` : `in ${place}`;
  if (spec.kind === "pg") {
    const who = spec.gender ? ` for ${spec.gender}` : "";
    return truncate(
      `Browse verified PG accommodation${who} in ${place}. No hidden fees, no fake listings. Updated daily on PropertyBulbul.`,
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
): string {
  const place = placeLabel(city, sectorSlug);
  if (spec.kind === "pg") {
    const who = spec.gender ? ` for ${spec.gender}` : "";
    return `Looking for PG accommodation${who} in ${place}? PropertyBulbul lists ${count} verified PG in this area, refreshed daily from active Tricity brokers.`;
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

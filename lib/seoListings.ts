/**
 * Server-side data helpers for the programmatic local-intent SEO pages.
 *
 * Strategy: fetch all active listings for a city ONCE per request (React
 * `cache` dedupes within the request), then apply the filter spec locally.
 * This gives consistent counts between the page grid, the thin-content
 * guardrail and the related-page links, with a single API call.
 *
 * Local (exact) filtering also protects against the backend's case-
 * insensitive substring `sector` regex over-matching (e.g. "sector 4"
 * matching "Sector 40") — see `matchesFilterSpec`.
 */
import { cache } from "react";
import { fetchAllPropertiesServer } from "@/services/propertiesApi";
import {
  MAX_BHK_SLUG,
  MIN_LISTINGS_FOR_SEO_PAGE,
  SEO_CITY_DISPLAY,
  SeoCity,
  SeoFilterSpec,
  buildFilterSlug,
  buildSeoPath,
  matchesFilterSpec,
  normalizeSector,
} from "./filterSlug";
import { relatedPageLabel } from "./seoCopy";

/** All active listings for one SEO city (cached per request). */
export const getCityListings = cache(
  async (city: SeoCity): Promise<any[]> => {
    const { properties } = await fetchAllPropertiesServer(
      { city: SEO_CITY_DISPLAY[city] },
      200,
    );
    return (properties || []).filter((p: any) => p.isActive !== false);
  },
);

/** Sector slug ("sector-40") → normalized raw value ("sector 40"). */
const sectorSlugToNormalized = (sectorSlug: string): string =>
  normalizeSector(sectorSlug.split("-").join(" "));

/**
 * Listings matching a full page combination (city + optional sector + filter).
 * Empty/short lists are handled by the caller via the
 * `MIN_LISTINGS_FOR_SEO_PAGE` guardrail.
 */
export async function getListingsForFilter(
  city: SeoCity,
  sectorSlug: string | null,
  spec: SeoFilterSpec,
): Promise<any[]> {
  const all = await getCityListings(city);
  const wantedSector = sectorSlug ? sectorSlugToNormalized(sectorSlug) : null;

  return all.filter((p: any) => {
    if (wantedSector !== null) {
      if (normalizeSector(p?.location?.sector) !== wantedSector) return false;
    }
    return matchesFilterSpec(p, spec);
  });
}

/** Count for a combination — same query function the page renders with. */
export async function countListingsForFilter(
  city: SeoCity,
  sectorSlug: string | null,
  spec: SeoFilterSpec,
): Promise<number> {
  const listings = await getListingsForFilter(city, sectorSlug, spec);
  return listings.length;
}

export interface RelatedPage {
  href: string;
  label: string;
  count: number;
}

/**
 * Candidate related specs for a page. Only combinations that also pass the
 * 3-listing threshold end up in the returned links.
 */
function relatedCandidateSpecs(spec: SeoFilterSpec): SeoFilterSpec[] {
  if (spec.kind === "pg") {
    const out: SeoFilterSpec[] = [];
    if (spec.gender) out.push({ kind: "pg" });
    out.push({ kind: "pg", gender: "girls" }, { kind: "pg", gender: "boys" });
    for (const bhk of [1, 2, 3]) {
      out.push({ kind: "bhk", dealType: "rent", bhk });
    }
    return out.filter((s) => {
      if (s.kind !== "pg" || !spec.gender) return true;
      return s.gender !== spec.gender;
    });
  }
  // From a BHK page: other BHKs (same deal), the same BHK on the other deal
  // type, then the PG pages.
  const out: SeoFilterSpec[] = [];
  for (const bhk of [1, 2, 3, 4, 5]) {
    if (bhk !== spec.bhk) out.push({ kind: "bhk", dealType: spec.dealType, bhk });
  }
  const otherDeal = spec.dealType === "rent" ? "sale" : "rent";
  out.push({ kind: "bhk", dealType: otherDeal as "rent" | "sale", bhk: spec.bhk });
  out.push({ kind: "pg" }, { kind: "pg", gender: "boys" }, { kind: "pg", gender: "girls" });
  return out;
}

/**
 * 2–3 related filter pages for the same sector/city that pass the listing
 * threshold. `buildRelatedPageHref` lets callers attach a path-only href.
 */
export async function getRelatedPages(
  city: SeoCity,
  sectorSlug: string | null,
  spec: SeoFilterSpec,
): Promise<RelatedPage[]> {
  const all = await getCityListings(city);
  const wantedSector = sectorSlug ? sectorSlugToNormalized(sectorSlug) : null;
  const currentSlug = buildFilterSlug(spec);

  const matches = (p: any, candidate: SeoFilterSpec): boolean => {
    if (wantedSector !== null) {
      if (normalizeSector(p?.location?.sector) !== wantedSector) return false;
    }
    return matchesFilterSpec(p, candidate);
  };

  const related: RelatedPage[] = [];
  for (const candidate of relatedCandidateSpecs(spec)) {
    if (related.length >= 3) break;
    // Never link to the page we're already on.
    if (buildFilterSlug(candidate) === currentSlug) continue;
    const count = all.filter((p: any) => matches(p, candidate)).length;
    if (count < MIN_LISTINGS_FOR_SEO_PAGE) continue;
    related.push({
      href: buildSeoPath(city, candidate, sectorSlug),
      label: relatedPageLabel(candidate),
      count,
    });
  }
  return related;
}

export { MAX_BHK_SLUG };

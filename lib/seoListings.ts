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
import { fetchAllPropertiesServer, fetchGeoListingsServer } from "@/services/propertiesApi";
import {
  MAX_BHK_SLUG,
  MIN_LISTINGS_FOR_SEO_PAGE,
  SEO_CITY_DISPLAY,
  SeoCity,
  SeoCombo,
  SeoFilterSpec,
  buildFilterSlug,
  eligiblePriceBucketCombos,
  eligibleSeoCombos,
  matchesFilterSpec,
  normalizeSector,
  specsForProperty,
} from "./filterSlug";
import { LANDMARKS, LANDMARK_RADIUS_KM, Landmark } from "./landmarks";
import { seoComboPath } from "./rootSlugPatterns";
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
  if (spec.kind === "category") {
    // From a Flats page: the Houses page (and vice versa) plus popular BHKs
    // and the PG pages.
    const other = spec.category === "House/Villa" ? "Apartment/Flat" : "House/Villa";
    return [
      { kind: "category", dealType: spec.dealType, category: other },
      { kind: "bhk", dealType: spec.dealType, bhk: 2 },
      { kind: "bhk", dealType: spec.dealType, bhk: 3 },
      { kind: "pg" },
    ];
  }
  if (spec.kind === "price") {
    return [
      { kind: "bhk", dealType: "rent", bhk: 2 },
      { kind: "bhk", dealType: "rent", bhk: 3 },
      { kind: "pg" },
    ];
  }
  if (spec.kind === "independent-room" || spec.kind === "flatmate") {
    return [{ kind: "pg" }];
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
    // Root-level kinds (category/price/landmark) resolve to flat URLs via
    // seoComboPath; combos without a live URL are skipped.
    const href = seoComboPath({
      city,
      sectorSlug,
      landmarkSlug: null,
      spec: candidate,
    });
    if (!href) continue;
    related.push({
      href,
      label: relatedPageLabel(candidate),
      count,
    });
  }
  return related;
}

export { MAX_BHK_SLUG };

/* ─────────────────────────────────────────────────────────────────────────
 * Landmark (geo-proximity) SEO pages — root-level
 * /{type}-for-rent-near-{landmark-slug}-{city}
 * ───────────────────────────────────────────────────────────────────────── */

/** Query params the backend's `$geoNear` endpoint understands per spec kind. */
function geoParamsForSpec(spec: SeoFilterSpec): Record<string, string> {
  if (spec.kind === "category") {
    return {
      deal: spec.dealType === "rent" ? "Rent" : "Sale",
      propertyCategory: spec.category,
    };
  }
  if (spec.kind === "pg") {
    return { propertyCategory: "PG/Hostel" };
  }
  if (spec.kind === "price") {
    return { deal: "Rent", priceMax: String(spec.maxPrice) };
  }
  // independent-room / flatmate (open decision #1): no clean server-side
  // filter yet — nearby rent docs come back and `matchesFilterSpec` narrows
  // locally via `allowsSubletting` / `maxPersonsSharing`.
  return { deal: "Rent" };
}

/**
 * Listings near a landmark matching a filter spec. Distances are computed by
 * MongoDB's native `$geoNear` on the 2dsphere index (never haversine in JS),
 * and the endpoint excludes `[0, 0]` coordinates — the schema default for
 * unset coordinates, which is a real point (Gulf of Guinea), not missing
 * data. Results are re-narrowed locally with `matchesFilterSpec`, the same
 * way the sector pages double-check API results.
 */
export async function getListingsForLandmark(
  landmark: Landmark,
  spec: SeoFilterSpec,
): Promise<any[]> {
  const docs = await fetchGeoListingsServer({
    lat: String(landmark.lat),
    lng: String(landmark.lng),
    km: String(LANDMARK_RADIUS_KM),
    ...geoParamsForSpec(spec),
  });
  return docs.filter((p: any) => matchesFilterSpec(p, spec));
}

/**
 * Every (landmark, spec) combination with at least `MIN_LISTINGS_FOR_SEO_PAGE`
 * listings within `LANDMARK_RADIUS_KM`. For each landmark this triggers ONE
 * `$geoNear` aggregation on the backend (not a per-spec query — landmarks ×
 * specs queries would be far too chatty); the returned documents are then
 * grouped client-side by the shared `specsForProperty` helper so the grouping
 * can never drift from `eligibleSeoCombos`.
 */
export async function eligibleLandmarkSeoCombos(): Promise<SeoCombo[]> {
  const counts = new Map<string, SeoCombo>();

  for (const landmark of LANDMARKS) {
    const docs = await fetchGeoListingsServer({
      lat: String(landmark.lat),
      lng: String(landmark.lng),
      km: String(LANDMARK_RADIUS_KM),
    });

    for (const doc of docs) {
      for (const spec of specsForProperty(doc)) {
        // TODO(open decision #1): independent-room/flatmate URL types are not
        // live yet — skip them so the sitemap never lists a 404.
        if (spec.kind === "independent-room" || spec.kind === "flatmate") {
          continue;
        }
        const slug = buildFilterSlug(spec);
        const key = `${landmark.city}|${landmark.slug}|${slug}`;
        const combo = counts.get(key);
        if (combo) {
          combo.count += 1;
        } else {
          counts.set(key, {
            city: landmark.city,
            sectorSlug: null,
            landmarkSlug: landmark.slug,
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
 * `generateStaticParams` source for `app/[slug]/page.tsx` — root-level
 * category/sector, landmark and price-bucket slugs, derived from live data
 * (never hand-maintained, same principle as the sitemap generator). Returns
 * [] on failure so unlisted slugs simply render on demand (dynamicParams).
 */
export async function getRootSeoStaticParams(): Promise<
  { slug: string }[]
> {
  try {
    const { properties } = await fetchAllPropertiesServer({}, 200);
    const [combos, landmarkCombos] = await Promise.all([
      Promise.resolve(eligibleSeoCombos(properties)),
      eligibleLandmarkSeoCombos(),
    ]);
    const priceCombos = eligiblePriceBucketCombos(properties);

    const slugs = new Set<string>();
    for (const combo of [...combos, ...landmarkCombos, ...priceCombos]) {
      const path = seoComboPath(combo);
      // Only root-level (flat) paths belong to this catch-all.
      if (path && !path.startsWith("/properties/")) {
        slugs.add(path.replace(/^\//, ""));
      }
    }
    return Array.from(slugs).map((slug) => ({ slug }));
  } catch (error) {
    console.error("[seoListings] getRootSeoStaticParams failed:", error);
    return [];
  }
}

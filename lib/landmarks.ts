/**
 * Curated landmark data for the root-level
 * `/{type}-for-rent-near-{landmark-slug}-{city}` URL family.
 *
 * This file is intentionally dependency-free apart from the `SeoCity` type so
 * it can be unit-tested with plain `node --test` (see `lib/filterSlug.ts`).
 *
 * Coordinates are approximate values from manual curation — accurate enough
 * for an 8 km proximity radius, but re-verify with the Google Places API when
 * adding or refining entries (the Places key is already used elsewhere in the
 * app via `@react-google-maps/api` / `use-places-autocomplete`).
 *
 * IMPORTANT: `slug` values are validated to be GLOBALLY unique (not just
 * unique per city) — the root URL regex parser strips the trailing `-{city}`
 * suffix and looks landmarks up by slug alone, so a cross-city duplicate would
 * silently resolve pages to the wrong landmark.
 */
import type { SeoCity } from "./filterSlug.ts";

export interface Landmark {
  slug: string;
  name: string;
  city: SeoCity;
  lat: number;
  lng: number;
  category?: "hospital" | "college" | "it-park" | "transit" | "other";
}

/** Proximity radius for landmark pages ($maxDistance, in km). */
export const LANDMARK_RADIUS_KM = 8;

export const LANDMARKS: Landmark[] = [
  // ── Chandigarh ─────────────────────────────────────────────────────────
  {
    slug: "pgi",
    name: "PGI Hospital (PGIMER)",
    city: "chandigarh",
    lat: 30.7642,
    lng: 76.7762,
    category: "hospital",
  },
  {
    slug: "gmch-sector-32",
    name: "GMCH Sector 32",
    city: "chandigarh",
    lat: 30.731,
    lng: 76.759,
    category: "hospital",
  },
  {
    slug: "civil-hospital-sector-16",
    name: "Civil Hospital Sector 16",
    city: "chandigarh",
    lat: 30.7455,
    lng: 76.784,
    category: "hospital",
  },
  {
    slug: "gcg-college-sector-11",
    name: "GCG College Sector 11",
    city: "chandigarh",
    lat: 30.7475,
    lng: 76.782,
    category: "college",
  },
  {
    slug: "panjab-university",
    name: "Panjab University",
    city: "chandigarh",
    lat: 30.76,
    lng: 76.787,
    category: "college",
  },
  {
    slug: "dav-college-sector-10",
    name: "DAV College Sector 10",
    city: "chandigarh",
    lat: 30.753,
    lng: 76.787,
    category: "college",
  },
  {
    slug: "mcm-dav-college-sector-36",
    name: "MCM DAV College Sector 36",
    city: "chandigarh",
    lat: 30.733,
    lng: 76.768,
    category: "college",
  },
  {
    slug: "ggdsd-college-sector-32",
    name: "GGDSD College Sector 32",
    city: "chandigarh",
    lat: 30.729,
    lng: 76.758,
    category: "college",
  },
  {
    slug: "sector-17-plaza",
    name: "Sector 17 Plaza",
    city: "chandigarh",
    lat: 30.741,
    lng: 76.7822,
    category: "other",
  },
  {
    slug: "elante-mall",
    name: "Elante Mall",
    city: "chandigarh",
    lat: 30.7055,
    lng: 76.7979,
    category: "other",
  },
  {
    slug: "isbt-sector-17",
    name: "ISBT Sector 17",
    city: "chandigarh",
    lat: 30.7395,
    lng: 76.778,
    category: "transit",
  },
  {
    slug: "isbt-sector-43",
    name: "ISBT Sector 43",
    city: "chandigarh",
    lat: 30.715,
    lng: 76.789,
    category: "transit",
  },
  {
    slug: "chandigarh-railway-station",
    name: "Chandigarh Railway Station",
    city: "chandigarh",
    lat: 30.7047,
    lng: 76.8347,
    category: "transit",
  },
  {
    slug: "chandigarh-international-airport",
    name: "Chandigarh International Airport",
    city: "chandigarh",
    lat: 30.6735,
    lng: 76.7885,
    category: "transit",
  },
  {
    slug: "it-park-chandigarh",
    name: "Rajiv Gandhi IT Park",
    city: "chandigarh",
    lat: 30.76,
    lng: 76.791,
    category: "it-park",
  },
  {
    slug: "rock-garden",
    name: "Rock Garden",
    city: "chandigarh",
    lat: 30.7526,
    lng: 76.8068,
    category: "other",
  },
  {
    slug: "sukhna-lake",
    name: "Sukhna Lake",
    city: "chandigarh",
    lat: 30.7421,
    lng: 76.8186,
    category: "other",
  },
  {
    slug: "sector-34-market",
    name: "Sector 34 Market",
    city: "chandigarh",
    lat: 30.7296,
    lng: 76.7772,
    category: "other",
  },
  {
    slug: "sector-22-market",
    name: "Sector 22 Market",
    city: "chandigarh",
    lat: 30.734,
    lng: 76.779,
    category: "other",
  },

  // ── Mohali ─────────────────────────────────────────────────────────────
  {
    slug: "fortis-hospital-mohali",
    name: "Fortis Hospital Mohali",
    city: "mohali",
    lat: 30.7,
    lng: 76.723,
    category: "hospital",
  },
  {
    slug: "civil-hospital-mohali",
    name: "Civil Hospital Mohali Phase 6",
    city: "mohali",
    lat: 30.706,
    lng: 76.712,
    category: "hospital",
  },
  {
    slug: "pca-stadium-mohali",
    name: "PCA Cricket Stadium",
    city: "mohali",
    lat: 30.6872,
    lng: 76.7217,
    category: "other",
  },
  {
    slug: "iiser-mohali",
    name: "IISER Mohali",
    city: "mohali",
    lat: 30.668,
    lng: 76.729,
    category: "college",
  },

  // ── Panchkula ──────────────────────────────────────────────────────────
  {
    slug: "mansa-devi-temple",
    name: "Mansa Devi Temple",
    city: "panchkula",
    lat: 30.688,
    lng: 76.844,
    category: "other",
  },
  {
    slug: "civil-hospital-panchkula",
    name: "Civil Hospital Panchkula Sector 6",
    city: "panchkula",
    lat: 30.698,
    lng: 76.846,
    category: "hospital",
  },
  {
    slug: "panchkula-sector-5-market",
    name: "Sector 5 Market Panchkula",
    city: "panchkula",
    lat: 30.7,
    lng: 76.844,
    category: "other",
  },

  // ── Zirakpur ───────────────────────────────────────────────────────────
  {
    slug: "zirakpur-chowk",
    name: "Zirakpur Chowk",
    city: "zirakpur",
    lat: 30.645,
    lng: 76.829,
    category: "other",
  },
  {
    slug: "peer-muchalla",
    name: "Peer Muchalla",
    city: "zirakpur",
    lat: 30.632,
    lng: 76.856,
    category: "other",
  },

  // ── Kharar ─────────────────────────────────────────────────────────────
  {
    slug: "kharar-bus-stand",
    name: "Kharar Bus Stand",
    city: "kharar",
    lat: 30.748,
    lng: 76.647,
    category: "transit",
  },
  {
    slug: "chandigarh-university-gharuan",
    name: "Chandigarh University",
    city: "kharar",
    lat: 30.7699,
    lng: 76.574,
    category: "college",
  },
];

/**
 * Data-quality guard, run once at module load: landmark slugs must be
 * globally unique (see file header). Throws loudly rather than letting a
 * duplicate slug silently resolve the wrong pages.
 */
function assertUniqueLandmarkSlugs(): void {
  const seen = new Set<string>();
  for (const landmark of LANDMARKS) {
    if (seen.has(landmark.slug)) {
      throw new Error(
        `Duplicate landmark slug "${landmark.slug}" in LANDMARKS — slugs must be globally unique across cities (the root URL parser depends on this).`,
      );
    }
    seen.add(landmark.slug);
  }
}
assertUniqueLandmarkSlugs();

/** Look a landmark up by (city, slug). Null when unknown or city-mismatched.
 *  Canonical-only: non-lowercase input never matches (guardrail parity with
 *  `parseRootSlug` / the nested filter pages). */
export function getLandmarkBySlug(city: SeoCity, slug: string): Landmark | null {
  const normalized = String(slug || "").trim();
  if (!normalized) return null;
  const landmark = LANDMARKS.find((l) => l.slug === normalized) || null;
  if (!landmark || landmark.city !== city) return null;
  return landmark;
}

/** All curated landmarks for one SEO city. */
export function landmarksForCity(city: SeoCity): Landmark[] {
  return LANDMARKS.filter((l) => l.city === city);
}

/* ── Local proximity fallback ──────────────────────────────────────────────
 * Landmark pages, the sitemap and the homepage quick links all read proximity
 * data from the backend `$geoNear` endpoint. That endpoint is a single point of
 * failure: while it is unreachable (backend mid-deploy, outage) it returns no
 * documents, and every landmark link would silently disappear from the
 * prerendered pages until the next revalidation/rebuild. The helpers below let
 * callers fall back to the city property snapshot they already fetch, using
 * the same radius and the same `[0, 0]`-default exclusion as the backend
 * query. Pure functions — unit-testable with `node --test`. */

/** Great-circle distance between two WGS84 points, in km (haversine). */
export function distanceKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const EARTH_RADIUS_KM = 6371;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.min(1, Math.sqrt(a)));
}

/**
 * Read a property document's coordinates, tolerating both shapes the API
 * serves:
 *   - `GET /properties`                 → `location.coordinates` = { lat, lng }
 *     (transformed — see the backend's `transformPropertyCoordinates`)
 *   - `GET /properties/seo/geo-listings` → `location.coordinates.coordinates`
 *     = [lng, lat] (raw GeoJSON)
 * Returns null for missing/malformed coordinates and for the `[0, 0]` schema
 * default (a real point in the Gulf of Guinea, not "missing data" — the
 * backend `$geoNear` query excludes it explicitly for the same reason).
 */
export function coordinatesOf(
  property: any,
): { lat: number; lng: number } | null {
  const coords = property?.location?.coordinates;
  if (!coords) return null;

  let lat: number;
  let lng: number;
  if (Array.isArray(coords.coordinates) && coords.coordinates.length >= 2) {
    [lng, lat] = [Number(coords.coordinates[0]), Number(coords.coordinates[1])];
  } else if (
    Array.isArray(coords) &&
    coords.length >= 2 // tolerate a flat [lng, lat] array
  ) {
    [lng, lat] = [Number(coords[0]), Number(coords[1])];
  } else if (coords.lat != null && coords.lng != null) {
    lat = Number(coords.lat);
    lng = Number(coords.lng);
  } else {
    return null;
  }

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  if (Math.abs(lat) > 90 || Math.abs(lng) > 180) return null;
  if (lat === 0 && lng === 0) return null;
  return { lat, lng };
}

/**
 * Properties within `km` of a landmark, nearest-first — the local mirror of
 * the backend `$geoNear` query: same radius, same `[0, 0]`-default exclusion,
 * and the same inactive/deleted filtering the other combo generators apply.
 * Used as a fallback when the geo endpoint returns no documents, so landmark
 * derivations can never silently collapse to nothing because of one failing
 * endpoint.
 */
export function propertiesNearLandmark(
  landmark: Landmark,
  properties: any[],
  km: number = LANDMARK_RADIUS_KM,
): any[] {
  const withDistance: { property: any; distance: number }[] = [];

  for (const property of properties || []) {
    if (!property || property.isActive === false || property.deletedAt) continue;
    const coords = coordinatesOf(property);
    if (!coords) continue;
    const distance = distanceKm(landmark.lat, landmark.lng, coords.lat, coords.lng);
    if (!(distance <= km)) continue; // NaN-safe
    withDistance.push({ property, distance });
  }

  // Stable nearest-first ordering, matching $geoNear's distance ordering.
  withDistance.sort((a, b) => a.distance - b.distance);
  return withDistance.map((entry) => entry.property);
}

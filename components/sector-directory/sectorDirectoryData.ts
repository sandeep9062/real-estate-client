import { getCityListings, getRootSeoStaticParams } from "@/lib/seoListings";
import {
  buildCityMapPoints,
  buildSectorDirectory,
} from "@/lib/sectorDirectory";
import type { CityGroup, SectorMapPoint } from "@/lib/sectorDirectory";

/**
 * Server-side data layer for the /sectors directory page.
 *
 * Pulls the live, guardrail-checked root SEO slugs the same way QuickLinks
 * does (`getRootSeoStaticParams` — never hand-maintained, so the directory
 * can only ever link to a URL the site itself already renders) and hands
 * them to the pure taxonomy in `lib/sectorDirectory.ts`.
 *
 * Failure mode: if the underlying fetch throws (e.g. the backend is
 * unreachable while a build runs), the fully-filled, all-disabled directory
 * is still returned — the page degrades gracefully instead of erroring.
 */
export async function getSectorDirectoryData(): Promise<CityGroup[]> {
  try {
    const rootSlugs = (await getRootSeoStaticParams()).map((p) => p.slug);
    return buildSectorDirectory(rootSlugs);
  } catch (error) {
    console.error(
      "[sectorDirectoryData] failed to derive from live data:",
      error,
    );
    return buildSectorDirectory([]);
  }
}

export interface SectorMapData {
  /** Map pins per city key — one per sector/locality with real listings. */
  points: Record<string, SectorMapPoint[]>;
  /** Active listings fetched per city (capped by the API page size). */
  listingCounts: Record<string, number>;
}

/**
 * Map data for the /sectors map view: one pin per sector (grid cities) /
 * curated locality (Zirakpur, Kharar), positioned from the real coordinates
 * of the listings behind the directory — see `buildCityMapPoints` — plus the
 * per-city listing counts for the header stats. Listings are request-cached
 * per city, so this shares the same snapshot the SEO pages use.
 *
 * Failure mode: a city whose fetch fails simply renders without pins; the
 * directory itself is unaffected.
 */
export async function getSectorMapData(
  cities: CityGroup[],
): Promise<SectorMapData> {
  const results = await Promise.all(
    cities.map(async (group) => {
      try {
        const listings = await getCityListings(group.key);
        return {
          key: group.key,
          points: buildCityMapPoints(group, listings),
          count: listings.length,
        } as const;
      } catch (error) {
        console.error(
          `[sectorDirectoryData] map pins failed for ${group.key}:`,
          error,
        );
        return {
          key: group.key,
          points: [] as SectorMapPoint[],
          count: 0,
        } as const;
      }
    }),
  );

  const points: Record<string, SectorMapPoint[]> = {};
  const listingCounts: Record<string, number> = {};
  for (const result of results) {
    points[result.key] = result.points;
    listingCounts[result.key] = result.count;
  }
  return { points, listingCounts };
}

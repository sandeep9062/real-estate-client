import { MetadataRoute } from "next";
import {
  eligiblePriceBucketCombos,
  eligibleSeoCombos,
} from "../lib/filterSlug";
import { seoComboPath } from "../lib/rootSlugPatterns";
import { eligibleLandmarkSeoCombos } from "../lib/seoListings";

interface ApiProperty {
  _id: string;
  slug?: string;
  updatedAt?: string;
}

interface ApiPropertyFull {
  _id: string;
  isActive?: boolean;
  deletedAt?: string | null;
  deal?: string;
  propertyCategory?: string;
  title?: string;
  description?: string;
  location?: { city?: string; sector?: string };
  facilities?: { bedrooms?: number | string };
  updatedAt?: string;
}

interface ApiJournal {
  _id: string;
  slug: string;
  updatedAt?: string;
  createdAt?: string;
}

interface ApiProject {
  _id: string;
  slug: string;
  updatedAt?: string;
  createdAt?: string;
}

interface ApiDeveloper {
  _id: string;
  slug?: string;
  updatedAt?: string;
  createdAt?: string;
}

interface ApiSitemapResponse {
  success: boolean;
  data?: unknown[];
  count?: number;
}

async function fetchJson(url: string): Promise<unknown> {
  const res = await fetch(url, { next: { revalidate: 3600 } });
  if (!res.ok) {
    console.warn(
      `Sitemap: fetch failed for ${url} — ${res.status} ${res.statusText}`,
    );
    return null;
  }
  return res.json();
}

/**
 * Fetch every property document (paginated) so the programmatic SEO landing
 * page URLs can be derived from live inventory. Runs on every build/deploy —
 * combinations that drop below MIN_LISTINGS_FOR_SEO_PAGE automatically fall
 * out of the sitemap (and 404 on the site), so this list is never
 * hand-maintained.
 */
async function fetchAllPropertiesForSeo(
  base: string,
): Promise<ApiPropertyFull[]> {
  const LIMIT = 100;
  const MAX_PAGES = 50; // safety cap: 5,000 listings
  const all: ApiPropertyFull[] = [];
  for (let page = 1; page <= MAX_PAGES; page++) {
    const payload = (await fetchJson(
      `${base}/properties?limit=${LIMIT}&page=${page}&sort=-createdAt`,
    )) as ApiSitemapResponse | null;
    const batch = Array.isArray(payload?.data)
      ? (payload.data as ApiPropertyFull[])
      : [];
    all.push(...batch);
    if (batch.length < LIMIT) break;
  }
  return all;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://www.propertybulbul.com";

  // Use the production API URLs directly for sitemap generation so that
  // during next build (on Vercel/Render) it always fetches from the live backend,
  // not from a potentially unavailable localhost.
  //
  // Properties:  /api/properties/sitemap-data  (mounted at /api/properties)
  // Journals:    /api/v1/journals/sitemap-data (mounted at /api/v1/journals)
  // Projects:    /api/v1/projects              (mounted at /api/v1/projects)
  // Developers:  /api/v1/developers            (mounted at /api/v1/developers)
  const API_BASE = "https://api.propertybulbul.com/api";
  const API_V1_BASE = "https://api.propertybulbul.com/api/v1";

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      priority: 1.0,
      changeFrequency: "always",
    },
    {
      url: `${baseUrl}/properties`,
      lastModified: new Date(),
      priority: 0.9,
      changeFrequency: "daily",
    },
    {
      url: `${baseUrl}/emi-calculator`,
      lastModified: new Date(),
      priority: 0.8,
    },
    {
      url: `${baseUrl}/properties/chandigarh`,
      lastModified: new Date(),
      priority: 0.9,
    },
    {
      url: `${baseUrl}/properties/mohali`,
      lastModified: new Date(),
      priority: 0.9,
    },
    {
      url: `${baseUrl}/properties/panchkula`,
      lastModified: new Date(),
      priority: 0.9,
    },
    {
      url: `${baseUrl}/properties/zirakpur`,
      lastModified: new Date(),
      priority: 0.9,
    },
    {
      url: `${baseUrl}/properties/kharar`,
      lastModified: new Date(),
      priority: 0.9,
    },
    {
      url: `${baseUrl}/sectors`,
      lastModified: new Date(),
      priority: 0.7,
      changeFrequency: "weekly",
    },
    { url: `${baseUrl}/projects`, lastModified: new Date(), priority: 0.8 },
    { url: `${baseUrl}/journal`, lastModified: new Date(), priority: 0.8 },
    { url: `${baseUrl}/developers`, lastModified: new Date(), priority: 0.7 },
    { url: `${baseUrl}/services`, lastModified: new Date(), priority: 0.7 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), priority: 0.6 },
    { url: `${baseUrl}/about-us`, lastModified: new Date(), priority: 0.6 },
    { url: `${baseUrl}/faq`, lastModified: new Date(), priority: 0.5 },
    { url: `${baseUrl}/terms`, lastModified: new Date(), priority: 0.3 },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: new Date(),
      priority: 0.3,
    },
    { url: `${baseUrl}/disclaimer`, lastModified: new Date(), priority: 0.3 },
    { url: `${baseUrl}/refund`, lastModified: new Date(), priority: 0.3 },
  ];

  // --- Properties (via sitemap-data endpoint - no pagination) ---
  let propertyUrls: MetadataRoute.Sitemap = [];
  try {
    const propertyData = await fetchJson(`${API_BASE}/properties/sitemap-data`);
    console.log(
      "Sitemap /api/properties/sitemap-data response structure:",
      JSON.stringify(propertyData).slice(0, 500),
    );
    // Response: { success: true, count, data: [...] }
    const response = propertyData as ApiSitemapResponse | null;
    const rawProperties = response?.data;
    if (Array.isArray(rawProperties)) {
      console.log(
        `Sitemap: Fetched ${rawProperties.length} properties for sitemap`,
      );
      propertyUrls = (rawProperties as ApiProperty[]).map((p) => ({
        url: `${baseUrl}/property/${p.slug || p._id}`,
        lastModified: new Date(p.updatedAt || Date.now()),
        changeFrequency: "weekly" as const,
        priority: 0.8,
      }));
    } else {
      console.warn(
        "Sitemap: properties sitemap-data is not an array. Type:",
        typeof rawProperties,
      );
    }
  } catch (error) {
    console.error("Sitemap: Failed to fetch properties sitemap-data —", error);
  }

  // --- Journals (via sitemap-data endpoint - no pagination) ---
  let journalUrls: MetadataRoute.Sitemap = [];
  try {
    const journalData = await fetchJson(`${API_V1_BASE}/journals/sitemap-data`);
    console.log(
      "Sitemap /api/journals/sitemap-data response structure:",
      JSON.stringify(journalData).slice(0, 500),
    );
    // Response: { success: true, data: [...] }
    const response = journalData as ApiSitemapResponse | null;
    const rawJournals = response?.data;
    if (Array.isArray(rawJournals)) {
      console.log(
        `Sitemap: Fetched ${rawJournals.length} journals for sitemap`,
      );
      journalUrls = (rawJournals as ApiJournal[]).map((j) => ({
        url: `${baseUrl}/journal/${j.slug}`,
        lastModified: new Date(j.updatedAt || j.createdAt || Date.now()),
        changeFrequency: "monthly" as const,
        priority: 0.7,
      }));
    } else {
      console.warn(
        "Sitemap: journals sitemap-data is not an array. Type:",
        typeof rawJournals,
      );
    }
  } catch (error) {
    console.error("Sitemap: Failed to fetch journals sitemap-data —", error);
  }

  // --- Projects ---
  let projectUrls: MetadataRoute.Sitemap = [];
  try {
    const projectData = await fetchJson(`${API_BASE}/v1/projects`);
    console.log(
      "Sitemap /api/v1/projects response structure:",
      JSON.stringify(projectData).slice(0, 500),
    );
    // The API returns the array directly via res.json(projects)
    if (Array.isArray(projectData)) {
      projectUrls = (projectData as ApiProject[]).map((p) => ({
        url: `${baseUrl}/projects/${p.slug}`,
        lastModified: new Date(p.updatedAt || p.createdAt || Date.now()),
        changeFrequency: "daily" as const,
        priority: 0.9,
      }));
    } else {
      console.warn(
        "Sitemap: projects data is not an array. Type:",
        typeof projectData,
      );
    }
  } catch (error) {
    console.error("Sitemap: Failed to fetch projects —", error);
  }

  // --- Developers ---
  let developerUrls: MetadataRoute.Sitemap = [];
  try {
    const developerData = await fetchJson(`${API_BASE}/v1/developers`);
    console.log(
      "Sitemap /api/v1/developers response structure:",
      JSON.stringify(developerData).slice(0, 500),
    );
    // Try array directly first, then fallback to nested property
    let rawDevelopers: unknown = developerData;
    if (
      developerData &&
      typeof developerData === "object" &&
      "data" in (developerData as Record<string, unknown>)
    ) {
      rawDevelopers = (developerData as Record<string, unknown>).data;
    }
    if (Array.isArray(rawDevelopers)) {
      developerUrls = (rawDevelopers as ApiDeveloper[]).map((d) => ({
        url: `${baseUrl}/developers/${d._id}`,
        lastModified: new Date(d.updatedAt || d.createdAt || Date.now()),
        changeFrequency: "monthly" as const,
        priority: 0.5,
      }));
    } else {
      console.warn(
        "Sitemap: developers data is not an array. Type:",
        typeof rawDevelopers,
      );
    }
  } catch (error) {
    console.error("Sitemap: Failed to fetch developers —", error);
  }

  // --- Programmatic SEO landing pages (/properties/{city}[/{sector}]/{filter}
  //     plus the root-level flat URLs: sector+type, landmark, price buckets) ---
  // Same `eligibleSeoCombos` logic the pages use for the 3-listing guardrail,
  // so the sitemap can never list a URL the site itself would 404.
  let seoLandingUrls: MetadataRoute.Sitemap = [];
  try {
    const allProperties = await fetchAllPropertiesForSeo(API_BASE);
    const combos = eligibleSeoCombos(allProperties);
    seoLandingUrls = combos
      .map((c) => ({
        combo: c,
        path: seoComboPath(c),
      }))
      .filter((e): e is { combo: (typeof combos)[number]; path: string } =>
        Boolean(e.path),
      )
      .map(({ combo: c, path }) => ({
        url: `${baseUrl}${path}`,
        lastModified: new Date(),
        changeFrequency: "daily" as const,
        // bhk/pg combos with a sector are the deepest nested pages;
        // root-level sector pages carry the same weight.
        priority: c.sectorSlug || c.landmarkSlug ? 0.9 : 0.8,
      }));
    console.log(
      `Sitemap: Fetched ${allProperties.length} properties — ${combos.length} SEO landing pages eligible`,
    );

    // --- Root-level landmark pages (one $geoNear aggregation per landmark,
    //     grouped with the shared specsForProperty helper) ---
    const landmarkCombos = await eligibleLandmarkSeoCombos();
    const landmarkUrls: MetadataRoute.Sitemap = landmarkCombos
      .map((c) => ({ path: seoComboPath(c) }))
      .filter((e): e is { path: string } => Boolean(e.path))
      .map(({ path }) => ({
        url: `${baseUrl}${path}`,
        lastModified: new Date(),
        changeFrequency: "daily" as const,
        priority: 0.9,
      }));
    seoLandingUrls = [...seoLandingUrls, ...landmarkUrls];
    console.log(
      `Sitemap: ${landmarkCombos.length} landmark SEO pages eligible`,
    );

    // --- Root-level price-bucket pages. Buckets are fixed/enumerable, so
    //     they don't need combo derivation — but the same
    //     MIN_LISTINGS_FOR_SEO_PAGE guardrail applies, so a bucket is skipped
    //     for a city that doesn't have enough matching rent listings. ---
    const priceCombos = eligiblePriceBucketCombos(allProperties);
    const priceUrls: MetadataRoute.Sitemap = priceCombos
      .map((c) => ({ path: seoComboPath(c) }))
      .filter((e): e is { path: string } => Boolean(e.path))
      .map(({ path }) => ({
        url: `${baseUrl}${path}`,
        lastModified: new Date(),
        changeFrequency: "daily" as const,
        priority: 0.8,
      }));
    seoLandingUrls = [...seoLandingUrls, ...priceUrls];
    console.log(`Sitemap: ${priceCombos.length} price-bucket pages eligible`);
  } catch (error) {
    console.error(
      "Sitemap: Failed to derive SEO landing page URLs —",
      error,
    );
  }

  const totalUrls =
    staticRoutes.length +
    propertyUrls.length +
    journalUrls.length +
    projectUrls.length +
    developerUrls.length +
    seoLandingUrls.length;
  console.log(
    `Sitemap: Total URLs generated — ${totalUrls} (static: ${staticRoutes.length}, properties: ${propertyUrls.length}, journals: ${journalUrls.length}, projects: ${projectUrls.length}, developers: ${developerUrls.length}, seo-landings: ${seoLandingUrls.length})`,
  );

  return [
    ...staticRoutes,
    ...propertyUrls,
    ...journalUrls,
    ...projectUrls,
    ...developerUrls,
    ...seoLandingUrls,
  ];
}

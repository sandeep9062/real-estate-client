import { MetadataRoute } from "next";

interface ApiProperty {
  _id: string;
  slug?: string;
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

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://www.propertybulbul.com";
  const apiBaseUrl =
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "") ||
    "http://localhost:9000/api";

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

  if (!apiBaseUrl) {
    console.warn(
      "Sitemap: NEXT_PUBLIC_API_URL is not defined. Returning static URLs only.",
    );
    return staticRoutes;
  }

  // --- Properties (via sitemap-data endpoint - no pagination) ---
  let propertyUrls: MetadataRoute.Sitemap = [];
  try {
    const propertyData = await fetchJson(
      `${apiBaseUrl}/properties/sitemap-data`,
    );
    console.log(
      "Sitemap /api/properties/sitemap-data response structure:",
      JSON.stringify(propertyData).slice(0, 500),
    );
    // Response: { success: true, count, data: [...] }
    const response = propertyData as ApiSitemapResponse | null;
    const rawProperties = response?.data;
    if (Array.isArray(rawProperties)) {
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
    const journalData = await fetchJson(`${apiBaseUrl}/journals/sitemap-data`);
    console.log(
      "Sitemap /api/journals/sitemap-data response structure:",
      JSON.stringify(journalData).slice(0, 500),
    );
    // Response: { success: true, data: [...] }
    const response = journalData as ApiSitemapResponse | null;
    const rawJournals = response?.data;
    if (Array.isArray(rawJournals)) {
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
    const projectData = await fetchJson(`${apiBaseUrl}/v1/projects`);
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
    const developerData = await fetchJson(`${apiBaseUrl}/v1/developers`);
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

  return [
    ...staticRoutes,
    ...propertyUrls,
    ...journalUrls,
    ...projectUrls,
    ...developerUrls,
  ];
}

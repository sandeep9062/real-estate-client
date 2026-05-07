import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://www.propertybulbul.com";
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;

  let propertyUrls: MetadataRoute.Sitemap = [];
  let journalUrls: MetadataRoute.Sitemap = [];
  let projectUrls: MetadataRoute.Sitemap = [];
  let developerUrls: MetadataRoute.Sitemap = [];

  try {
    if (apiBaseUrl) {
      // ── 1. Fetch active properties ──
      const propertiesRes = await fetch(`${apiBaseUrl}/properties`, {
        next: { revalidate: 3600 }, // cache for 1 hour
      });
      if (propertiesRes.ok) {
        const properties = await propertiesRes.json();
        propertyUrls =
          properties?.map((property: any) => ({
            url: `${baseUrl}/property/${property.slug || property._id}`,
            lastModified: new Date(property.updatedAt || Date.now()),
          })) ?? [];
      }

      // ── 2. Fetch published journals ──
      const journalsRes = await fetch(`${apiBaseUrl}/v1/journals`, {
        next: { revalidate: 3600 },
      });
      if (journalsRes.ok) {
        const journals = await journalsRes.json();
        journalUrls =
          journals?.map((journal: any) => ({
            url: `${baseUrl}/journal/${journal.slug}`,
            lastModified: new Date(
              journal.updatedAt || journal.createdAt || Date.now(),
            ),
          })) ?? [];
      }

      // ── 3. Fetch current projects ──
      const projectsRes = await fetch(`${apiBaseUrl}/v1/projects`, {
        next: { revalidate: 3600 },
      });
      if (projectsRes.ok) {
        const projects = await projectsRes.json();
        projectUrls =
          projects?.map((project: any) => ({
            url: `${baseUrl}/projects/${project.slug}`,
            lastModified: new Date(
              project.updatedAt || project.createdAt || Date.now(),
            ),
          })) ?? [];
      }

      // ── 4. Fetch developers ──
      const developersRes = await fetch(`${apiBaseUrl}/v1/developers`, {
        next: { revalidate: 3600 },
      });
      if (developersRes.ok) {
        const developers = await developersRes.json();
        developerUrls =
          developers?.map((dev: any) => ({
            url: `${baseUrl}/developers/${dev._id}`,
            lastModified: new Date(
              dev.updatedAt || dev.createdAt || Date.now(),
            ),
          })) ?? [];
      }
    }
  } catch (error) {
    console.error("Sitemap fetch error:", error);
  }

  // ── 4. Static routes ──
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), priority: 1.0 },
    { url: `${baseUrl}/properties`, lastModified: new Date(), priority: 0.9 },
    {
      url: `${baseUrl}/emi-calculator`,
      lastModified: new Date(),
      priority: 0.9,
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
    { url: `${baseUrl}/developers`, lastModified: new Date(), priority: 0.8 },
    { url: `${baseUrl}/services`, lastModified: new Date(), priority: 0.8 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), priority: 0.7 },
    { url: `${baseUrl}/about-us`, lastModified: new Date(), priority: 0.7 },
    { url: `${baseUrl}/faq`, lastModified: new Date(), priority: 0.6 },
    { url: `${baseUrl}/whyproperty`, lastModified: new Date(), priority: 0.6 },
    { url: `${baseUrl}/terms`, lastModified: new Date(), priority: 0.4 },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: new Date(),
      priority: 0.4,
    },
    { url: `${baseUrl}/disclaimer`, lastModified: new Date(), priority: 0.4 },
    { url: `${baseUrl}/refund`, lastModified: new Date(), priority: 0.4 },
  ];

  return [
    ...staticRoutes,
    ...propertyUrls,
    ...journalUrls,
    ...projectUrls,
    ...developerUrls,
  ];
}

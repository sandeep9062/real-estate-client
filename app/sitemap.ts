import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://www.propertybulbul.com";
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;

  let propertyUrls: MetadataRoute.Sitemap = [];
  let journalUrls: MetadataRoute.Sitemap = [];
  let projectUrls: MetadataRoute.Sitemap = [];

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
            url: `${baseUrl}/property/${property._id}`,
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
    }
  } catch (error) {
    console.error("Sitemap fetch error:", error);
  }

  // ── 4. Static routes ──
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date() },
    { url: `${baseUrl}/about-us`, lastModified: new Date() },
    { url: `${baseUrl}/contact`, lastModified: new Date() },
    { url: `${baseUrl}/properties`, lastModified: new Date() },
    { url: `${baseUrl}/journal`, lastModified: new Date() },
    { url: `${baseUrl}/projects`, lastModified: new Date() },
    { url: `${baseUrl}/developers`, lastModified: new Date() },
    { url: `${baseUrl}/faq`, lastModified: new Date() },
    { url: `${baseUrl}/services`, lastModified: new Date() },
    { url: `${baseUrl}/whyproperty`, lastModified: new Date() },
    { url: `${baseUrl}/terms`, lastModified: new Date() },
    { url: `${baseUrl}/privacy-policy`, lastModified: new Date() },
    { url: `${baseUrl}/disclaimer`, lastModified: new Date() },
    { url: `${baseUrl}/refund`, lastModified: new Date() },

    // Tool pages (SEO magnets)
    {
      url: `${baseUrl}/emi-calculator`,
      lastModified: new Date(),
      priority: 0.9,
    },

    // City SEO pages
    { url: `${baseUrl}/properties/chandigarh`, lastModified: new Date() },
    { url: `${baseUrl}/properties/mohali`, lastModified: new Date() },
    { url: `${baseUrl}/properties/panchkula`, lastModified: new Date() },
    { url: `${baseUrl}/properties/zirakpur`, lastModified: new Date() },
    { url: `${baseUrl}/properties/kharar`, lastModified: new Date() },
  ];

  return [...staticRoutes, ...propertyUrls, ...journalUrls, ...projectUrls];
}

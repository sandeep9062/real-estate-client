import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://www.propertybulbul.com";
  // Lightsail shift ke baad ye super-fast ho jayega
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiBaseUrl) {
    console.warn("Sitemap: NEXT_PUBLIC_API_URL is not defined.");
  }

  // ── Parallel Fetching for Performance ──
  // Promise.allSettled ensures that if one API fails, others still work.
  const [propertiesRes, journalsRes, projectsRes, developersRes] =
    await Promise.allSettled([
      fetch(`${apiBaseUrl}/properties`, { next: { revalidate: 3600 } }),
      fetch(`${apiBaseUrl}/v1/journals`, { next: { revalidate: 3600 } }),
      fetch(`${apiBaseUrl}/v1/projects`, { next: { revalidate: 3600 } }),
      fetch(`${apiBaseUrl}/v1/developers`, { next: { revalidate: 3600 } }),
    ]);

  // ── 1. Map Properties ──
  const propertyUrls: MetadataRoute.Sitemap =
    propertiesRes.status === "fulfilled" && propertiesRes.value.ok
      ? (await propertiesRes.value.json()).map((p: any) => ({
          url: `${baseUrl}/property/${p.slug || p._id}`,
          lastModified: new Date(p.updatedAt || Date.now()),
          changeFrequency: "daily",
          priority: 0.8,
        }))
      : [];

  // ── 2. Map Journals ──
  const journalUrls: MetadataRoute.Sitemap =
    journalsRes.status === "fulfilled" && journalsRes.value.ok
      ? (await journalsRes.value.json()).map((j: any) => ({
          url: `${baseUrl}/journal/${j.slug}`,
          lastModified: new Date(j.updatedAt || j.createdAt || Date.now()),
          changeFrequency: "weekly",
          priority: 0.7,
        }))
      : [];

  // ── 3. Map Projects ──
  const projectUrls: MetadataRoute.Sitemap =
    projectsRes.status === "fulfilled" && projectsRes.value.ok
      ? (await projectsRes.value.json()).map((p: any) => ({
          url: `${baseUrl}/projects/${p.slug}`,
          lastModified: new Date(p.updatedAt || p.createdAt || Date.now()),
          changeFrequency: "daily",
          priority: 0.9,
        }))
      : [];

  // ── 4. Map Developers ──
  const developerUrls: MetadataRoute.Sitemap =
    developersRes.status === "fulfilled" && developersRes.value.ok
      ? (await developersRes.value.json()).map((d: any) => ({
          url: `${baseUrl}/developers/${d._id}`,
          lastModified: new Date(d.updatedAt || d.createdAt || Date.now()),
          changeFrequency: "monthly",
          priority: 0.5,
        }))
      : [];

  // ── 5. Static Routes with SEO Priorities ──
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
    // Local SEO Goldmines
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
    // Main Sections
    { url: `${baseUrl}/projects`, lastModified: new Date(), priority: 0.8 },
    { url: `${baseUrl}/journal`, lastModified: new Date(), priority: 0.8 },
    { url: `${baseUrl}/developers`, lastModified: new Date(), priority: 0.7 },
    { url: `${baseUrl}/services`, lastModified: new Date(), priority: 0.7 },
    // Info Pages
    { url: `${baseUrl}/contact`, lastModified: new Date(), priority: 0.6 },
    { url: `${baseUrl}/about-us`, lastModified: new Date(), priority: 0.6 },
    { url: `${baseUrl}/faq`, lastModified: new Date(), priority: 0.5 },
    { url: `${baseUrl}/whyproperty`, lastModified: new Date(), priority: 0.5 },
    // Compliance (Lower Priority)
    { url: `${baseUrl}/terms`, lastModified: new Date(), priority: 0.3 },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: new Date(),
      priority: 0.3,
    },
    { url: `${baseUrl}/disclaimer`, lastModified: new Date(), priority: 0.3 },
    { url: `${baseUrl}/refund`, lastModified: new Date(), priority: 0.3 },
  ];

  return [
    ...staticRoutes,
    ...propertyUrls,
    ...journalUrls,
    ...projectUrls,
    ...developerUrls,
  ];
}

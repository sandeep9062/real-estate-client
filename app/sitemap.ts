import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://propertybulbul.com";
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
    ? `${process.env.NEXT_PUBLIC_API_URL}/properties`
    : null;

  let propertyUrls: MetadataRoute.Sitemap = [];

  try {
    if (apiUrl) {
      const res = await fetch(apiUrl, {
        next: { revalidate: 3600 }, // ✅ cache for 1 hour
      });

      if (res.ok) {
        const json = await res.json();

        propertyUrls =
          json?.data?.map((property: any) => ({
            url: `${baseUrl}/property/${property._id}`,
            lastModified: new Date(property.updatedAt || Date.now()),
          })) ?? [];
      }
    }
  } catch (error) {
    console.error("Sitemap fetch error:", error);
  }

  return [
    { url: baseUrl, lastModified: new Date() },
    { url: `${baseUrl}/about-us`, lastModified: new Date() },
    { url: `${baseUrl}/contact`, lastModified: new Date() },
    { url: `${baseUrl}/properties`, lastModified: new Date() },

    { url: `${baseUrl}/buy`, lastModified: new Date() },
    { url: `${baseUrl}/rent`, lastModified: new Date() },

    // ✅ City SEO pages
    { url: `${baseUrl}/properties/chandigarh`, lastModified: new Date() },
    { url: `${baseUrl}/properties/mohali`, lastModified: new Date() },
    { url: `${baseUrl}/properties/panchkula`, lastModified: new Date() },
    { url: `${baseUrl}/properties/zirakpur`, lastModified: new Date() },
    { url: `${baseUrl}/properties/kharar`, lastModified: new Date() },

    // ✅ Tool pages
    {
      url: `${baseUrl}/tools/emi-calculator`,
      lastModified: new Date(),
      priority: 0.9,
      changeFrequency: "monthly",
    },

    ...propertyUrls,
  ];
}

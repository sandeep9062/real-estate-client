import { fetchPropertiesServer } from "@/services/propertiesApi";
import HomeClient from "./HomeClient";

export default async function Home() {
  // Fetch featured listings server-side — no loading spinner.
  let featuredProperties: any[] = [];
  try {
    const result = await fetchPropertiesServer({ isFeatured: "true" }, 20);
    featuredProperties = result.properties;
  } catch (err) {
    console.error("Failed to fetch featured listings server-side:", err);
  }

  return <HomeClient featuredProperties={featuredProperties} />;
}

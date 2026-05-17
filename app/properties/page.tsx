import { fetchPropertiesServer } from "@/services/propertiesApi";
import PropertiesClient from "@/components/PropertiesClient";

/**
 * ISR revalidation period (in seconds).
 * Next.js will re-generate this page every 1 hour on demand,
 * ensuring search engines always see fresh content.
 */
export const revalidate = 3600;

/**
 * Static Site Generation (SSG) for /properties.
 *
 * Previously this page was `"use client"`, meaning the server only sent
 * an empty `<div>Loading...</div>` shell — Google could not index any
 * property listings, prices, or descriptions.
 *
 * Now the server:
 *   1. Fetches the first page of properties at BUILD TIME (SSG).
 *   2. Renders them into the static HTML sent to every visitor.
 *   3. Periodically revalidates (ISR) so the content stays fresh.
 *
 * The client wrapper receives the pre-fetched data and:
 *   - Shows it immediately (no loading spinner for the initial view).
 *   - Falls back to client-side fetching when the user applies filters
 *     or changes URL search params.
 */
export default async function PropertiesPage() {
  // Fetch initial property data at build time (SSG) or on ISR revalidation
  const { properties, total, hasMore } = await fetchPropertiesServer();

  return (
    <PropertiesClient
      initialProperties={properties}
      initialTotal={total}
      initialHasMore={hasMore}
    />
  );
}

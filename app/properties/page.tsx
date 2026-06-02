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
 * SCALABILITY STRATEGY:
 * ─────────────────────────────────────────────────────────────────────
 * The SSG fetches ONLY the first page (limit=100) at build time. This
 * keeps the build fast and the initial HTML small, regardless of how
 * many properties exist (200, 4,000, or 40,000).
 *
 * Why limit=100 (not 20)?
 *   - 100 items ≈ 2-3 viewports on a 4-column desktop grid.
 *   - Visitor sees a meaningful chunk of listings immediately,
 *     without waiting for a client-side fetch.
 *   - The backend's public max limit is 100, so this is the
 *     biggest single chunk we can ship in the initial HTML.
 *
 * The client then loads subsequent pages on-demand via infinite
 * scroll, using limit=100 per page. For 4,000 properties that's
 * only ~40 round trips total (39 after the SSG).
 *
 * For 200 properties: SSG ships 100, client loads 2 more pages.
 * For 4,000 properties: SSG ships 100, client loads 39 more pages.
 * For 40,000 properties: SSG ships 100, client loads 399 more pages.
 *
 * The same component code handles all of these — no per-dataset
 * tuning required.
 *
 * The client wrapper handles:
 *   - Showing the SSG seed immediately.
 *   - Loading more pages as the user scrolls.
 *   - Filter / search URL params (refetches with filters).
 *   - Map / list view toggling.
 *   - Property selection from the map.
 */
export default async function PropertiesPage() {
  // Fetch the first page of properties at build time (SSG) or on ISR
  // revalidation. With limit=100, this gives the visitor a meaningful
  // initial set without overwhelming the HTML payload.
  const { properties, total, hasMore } = await fetchPropertiesServer(
    undefined,
    100,
  );

  return (
    <PropertiesClient
      initialProperties={properties}
      initialTotal={total}
      initialHasMore={hasMore}
    />
  );
}

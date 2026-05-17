import { fetchDevelopersServer } from "@/services/developersApi";
import DevelopersContent from "@/components/DevelopersContent";

/**
 * ISR revalidation period (in seconds).
 * Next.js will re-generate this page every 1 hour on demand,
 * ensuring search engines always see fresh content.
 */
export const revalidate = 3600;

/**
 * Static Site Generation (SSG) for /developers.
 *
 * Previously this page was `"use client"`, meaning the server only sent
 * an empty loading shell — Google could not index any developer listings,
 * stats, or descriptions.
 *
 * Now the server:
 *   1. Fetches all developers at BUILD TIME (SSG).
 *   2. Renders them into the static HTML sent to every visitor.
 *   3. Periodically revalidates (ISR) so the content stays fresh.
 *
 * The client wrapper receives the pre-fetched data and:
 *   - Shows it immediately (no loading spinner).
 *   - Handles client-side search/filtering interactively.
 */
export default async function DevelopersPage() {
  const developers = await fetchDevelopersServer();

  return <DevelopersContent initialDevelopers={developers} />;
}

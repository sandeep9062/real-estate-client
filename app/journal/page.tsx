import {
  fetchJournalsServer,
  fetchJournalCategoriesServer,
} from "@/services/journalApi";
import JournalClient from "@/components/JournalClient";

/**
 * ISR revalidation period (in seconds).
 * Next.js will re-generate this page every 1 hour on demand,
 * ensuring search engines always see fresh content.
 */
export const revalidate = 3600;

/**
 * Static Site Generation (SSG) for /journal.
 *
 * Previously this page was `"use client"`, meaning the server only sent
 * an empty loading shell — Google could not index any journal articles.
 *
 * Now the server:
 *   1. Fetches the first page of journals at BUILD TIME (SSG).
 *   2. Renders them into the static HTML sent to every visitor.
 *   3. Periodically revalidates (ISR) so the content stays fresh.
 *
 * The client wrapper receives the pre-fetched data and:
 *   - Shows it immediately (no loading spinner for the initial view).
 *   - Falls back to client-side fetching when the user changes category
 *     or uses the search box.
 */
export default async function JournalPage() {
  // Fetch initial journal data at build time (SSG) or on ISR revalidation
  const [journalsResult, categoriesResult] = await Promise.all([
    fetchJournalsServer(1, 12),
    fetchJournalCategoriesServer(),
  ]);

  return (
    <JournalClient
      initialJournals={journalsResult.journals}
      initialTotal={journalsResult.total}
      initialHasNextPage={journalsResult.hasNextPage}
      initialCurrentPage={journalsResult.currentPage}
      initialCategories={categoriesResult.categories}
    />
  );
}

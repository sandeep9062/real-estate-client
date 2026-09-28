"use client";

import Link from "next/link";
import { toast } from "@/hooks/use-toast";
import {
  useListSavedSearchesQuery,
  useDeleteSavedSearchMutation,
  useUpdateSavedSearchMutation,
} from "@/services/savedSearchesApi";
import { buildSavedSearchHref } from "@/lib/cityRouteUtils";

/**
 * Heading + intro copy, rendered in every state (loading / error / list) so the
 * route always ships a server-rendered <h1> and descriptive text instead of
 * only the transient loading placeholder.
 */
function SavedSearchesHeader() {
  return (
    <>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Saved searches</h1>
      <p className="text-sm text-gray-600 mb-8">
        Email and in-app alerts when new listings match your filters. Managed on
        the backend every 15 minutes.
      </p>
    </>
  );
}

export default function SavedSearchesPageClient() {
  const { data, isLoading, isError } = useListSavedSearchesQuery();
  const [remove] = useDeleteSavedSearchMutation();
  const [update] = useUpdateSavedSearchMutation();

  if (isLoading) {
    return (
      <div className="pt-24 min-h-screen bg-gray-50 pb-20 px-4">
        <div className="max-w-3xl mx-auto">
          <SavedSearchesHeader />
          <p className="text-center py-20 text-gray-600">Loading…</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="pt-24 min-h-screen bg-gray-50 pb-20 px-4">
        <div className="max-w-3xl mx-auto">
          <SavedSearchesHeader />
          <p className="text-center py-20 text-red-600">
            Sign in to manage saved searches.{" "}
            <Link
              href="/login"
              className="font-semibold text-[#4161df] hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    );
  }

  const items = data || [];

  return (
    <div className="pt-24 min-h-screen bg-gray-50 pb-20 px-4">
      <div className="max-w-3xl mx-auto">
        <SavedSearchesHeader />
        {items.length === 0 ? (
          <p className="text-gray-600">
            No saved searches yet. Use &quot;Save search &amp; alerts&quot; on the{" "}
            <Link
              href="/properties"
              className="font-semibold text-[#4161df] hover:underline"
            >
              properties page
            </Link>
            .
          </p>
        ) : (
          <ul className="space-y-3">
            {items.map((s) => (
              <li
                key={s._id}
                className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
              >
                <div>
                  <p className="font-semibold text-gray-900">{s.name}</p>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                    {JSON.stringify(s.filters)}
                  </p>
                  <div className="flex gap-3 mt-2 text-xs text-gray-600">
                    <span>Email: {s.notifyEmail ? "on" : "off"}</span>
                    <span>In-app: {s.notifyInApp ? "on" : "off"}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Link
                    href={buildSavedSearchHref(s.filters as Record<string, unknown>)}
                    className="text-sm font-semibold text-[#4161df]"
                  >
                    Run search
                  </Link>
                  <button
                    type="button"
                    className="text-sm text-gray-600"
                    onClick={async () => {
                      try {
                        await update({
                          id: s._id,
                          patch: { isActive: !s.isActive },
                        }).unwrap();
                        toast.success(
                          s.isActive
                            ? "Alerts paused for this search"
                            : "Alerts resumed",
                        );
                      } catch {
                        toast.error("Could not update alerts. Try again.");
                      }
                    }}
                  >
                    {s.isActive ? "Pause" : "Resume"}
                  </button>
                  <button
                    type="button"
                    className="text-sm text-red-600"
                    onClick={async () => {
                      try {
                        await remove(s._id).unwrap();
                        toast.success("Saved search deleted");
                      } catch {
                        toast.error("Could not delete saved search.");
                      }
                    }}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

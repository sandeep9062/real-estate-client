"use client";

import { useState } from "react";
import {
  useListMyConnectionsQuery,
  useRespondToConnectionRequestMutation,
} from "@/services/roommatesApi";

const STATUS_LABEL: Record<string, string> = {
  pending: "Pending",
  accepted: "Accepted",
  declined: "Declined",
  withdrawn: "Withdrawn",
};

export default function ConnectionsPage() {
  const {
    data: connections = [],
    isLoading: loading,
    error,
    refetch,
  } = useListMyConnectionsQuery();
  const [respondToConnectionRequest] = useRespondToConnectionRequestMutation();
  const [actionError, setActionError] = useState<string | null>(null);

  const errorMessage = actionError || getErrorMessage(error);

  async function respond(id: string, status: "accepted" | "declined") {
    setActionError(null);
    try {
      await respondToConnectionRequest({ id, status }).unwrap();
      refetch();
    } catch (err) {
      setActionError(getErrorMessage(err));
    }
  }

  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="text-2xl font-semibold text-slate-900">Connection requests</h1>

      {errorMessage && <p className="mt-4 text-sm text-red-600">{errorMessage}</p>}
      {loading && <p className="mt-6 text-sm text-slate-500">Loading…</p>}

      {!loading && connections.length === 0 && (
        <p className="mt-6 text-sm text-slate-500">
          No connection requests yet. Once you connect with someone (or they
          connect with you), it'll show up here.
        </p>
      )}

      <div className="mt-6 space-y-3">
        {connections.map((c) => {
          const fromProfile =
            typeof c.fromProfile === "object" ? c.fromProfile : undefined;
          const toProfile =
            typeof c.toProfile === "object" ? c.toProfile : undefined;
          const sameProfile =
            fromProfile && toProfile && fromProfile._id === toProfile._id;

          return (
            <div key={c._id} className="rounded-lg border border-slate-200 p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-900">
                  {sameProfile
                    ? "Connection"
                    : `${fromProfile?.occupation || "Someone"} ↔ ${
                        toProfile?.occupation || "someone"
                      }`}
                </p>
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                  {STATUS_LABEL[c.status]}
                </span>
              </div>

              {typeof c.matchScore === "number" && (
                <p className="mt-1 text-xs text-slate-500">
                  {c.matchScore}% compatibility at the time of the request
                </p>
              )}

              {c.message && <p className="mt-2 text-sm text-slate-700">{c.message}</p>}

              {c.status === "pending" && (
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => respond(c._id, "accepted")}
                    className="rounded-md bg-slate-900 px-3 py-1.5 text-xs font-medium text-white"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => respond(c._id, "declined")}
                    className="rounded-md border border-slate-300 px-3 py-1.5 text-xs"
                  >
                    Decline
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </main>
  );
}

function getErrorMessage(error: unknown): string {
  if (!error) return "";
  const e = error as {
    data?: { message?: string };
    error?: string;
    message?: string;
  };
  return (
    e.data?.message || e.error || e.message || "Something went wrong. Please try again."
  );
}
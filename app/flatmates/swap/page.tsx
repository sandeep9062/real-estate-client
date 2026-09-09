"use client";

import Link from "next/link";
import { useSearchSwapMatchesQuery } from "@/services/roommatesApi";
import ListingCard from "../../../components/flatmates/ListingCardFlat";

export default function SwapMatchesPage() {
  const {
    data: matches = [],
    isLoading: loading,
    error,
  } = useSearchSwapMatchesQuery();

  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="text-2xl font-semibold text-slate-900">Swap matches</h1>
      <p className="mt-1 text-sm text-slate-600">
        Only shown here: listings where your location fits their desired area,
        and theirs fits yours.
      </p>

      {error && (
        <p className="mt-6 text-sm text-red-600">
          {getErrorMessage(error)}{" "}
          <Link href="/flatmates/onboarding?intent=swap" className="underline">
            Set up a swap listing
          </Link>
          .
        </p>
      )}

      {loading && <p className="mt-6 text-sm text-slate-500">Loading…</p>}

      {!loading && !error && matches.length === 0 && (
        <p className="mt-6 text-sm text-slate-500">
          No mutual matches yet — check back as more swap listings come in.
        </p>
      )}

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {matches.map((m) => (
          <ListingCard key={m._id} source="room_flat" listing={m} />
        ))}
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
    e.data?.message ||
    e.error ||
    e.message ||
    "Something went wrong. Please try again."
  );
}

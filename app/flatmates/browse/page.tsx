"use client";

import { useState } from "react";
import Link from "next/link";
import {
  useBrowseRoomsAndFlatsQuery,
  type BrowseResult,
} from "@/services/roommatesApi";
import ListingCard from "../../../components/flatmates/ListingCardFlat";

const EMPTY_RESULT: BrowseResult = {
  matchedListings: [],
  sharingAllowedProperties: [],
};

export default function BrowsePage() {
  const [filters, setFilters] = useState({
    city: "",
    minRent: "",
    maxRent: "",
  });
  const [applied, setApplied] = useState({
    city: "",
    minRent: "",
    maxRent: "",
  });

  const params = {
    city: applied.city || undefined,
    minRent: applied.minRent || undefined,
    maxRent: applied.maxRent || undefined,
  };

  const {
    data: results = EMPTY_RESULT,
    isLoading: loading,
    error,
  } = useBrowseRoomsAndFlatsQuery(params);

  function runSearch(e?: React.FormEvent) {
    e?.preventDefault();
    setApplied(filters);
  }

  const allResults = [
    ...results.matchedListings,
    ...results.sharingAllowedProperties,
  ];

  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-900">Browse rooms</h1>
        <Link
          href="/flatmates/swap"
          className="text-sm underline underline-offset-2"
        >
          Looking to swap instead?
        </Link>
      </div>

      <form onSubmit={runSearch} className="mt-6 flex flex-wrap gap-3">
        <input
          placeholder="City"
          value={filters.city}
          onChange={(e) => setFilters((f) => ({ ...f, city: e.target.value }))}
          className="rounded-md border border-slate-300 p-2 text-sm"
        />
        <input
          type="number"
          placeholder="Min rent"
          value={filters.minRent}
          onChange={(e) =>
            setFilters((f) => ({ ...f, minRent: e.target.value }))
          }
          className="w-32 rounded-md border border-slate-300 p-2 text-sm"
        />
        <input
          type="number"
          placeholder="Max rent"
          value={filters.maxRent}
          onChange={(e) =>
            setFilters((f) => ({ ...f, maxRent: e.target.value }))
          }
          className="w-32 rounded-md border border-slate-300 p-2 text-sm"
        />
        <button
          type="submit"
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white"
        >
          Search
        </button>
      </form>

      {error && (
        <p className="mt-4 text-sm text-red-600">{getErrorMessage(error)}</p>
      )}

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {loading && <p className="text-sm text-slate-500">Searching…</p>}

        {!loading && allResults.length === 0 && (
          <p className="text-sm text-slate-500">
            No listings match yet — try widening the city or rent range.
          </p>
        )}

        {allResults.map((r) => (
          <ListingCard
            key={r.listing._id || r.listing.id}
            source={r.source}
            listing={r.listing}
          />
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

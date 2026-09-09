"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  ArrowLeftRight,
  AlertCircle,
  Loader2,
  MapPin,
} from "lucide-react";
import {
  useBrowseRoomsAndFlatsQuery,
  type BrowseResult,
} from "@/services/roommatesApi";
import ListingCard from "../../../components/flatmates/ListingCardFlat";

const BRAND = "#4161df";
const INK = "#161A2E";
const INK_SOFT = "#5C5F73";
const BORDER = "#E5E7F2";

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
    <main className="mx-auto max-w-4xl px-6 py-14 sm:py-20">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1
            className="text-2xl sm:text-3xl font-bold tracking-tight"
            style={{ color: INK }}
          >
            Browse rooms
          </h1>
          <p className="mt-1.5 text-sm" style={{ color: INK_SOFT }}>
            Matched roommate listings and owner-approved shares, in one search.
          </p>
        </div>
        <Link
          href="/flatmates/swap"
          className="inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-semibold transition-colors hover:bg-[#EEF1FC]"
          style={{ borderColor: BORDER, color: INK }}
        >
          <ArrowLeftRight className="h-3.5 w-3.5" />
          Looking to swap instead?
        </Link>
      </div>

      <form
        onSubmit={runSearch}
        className="mt-6 flex flex-wrap items-end gap-3 rounded-2xl border bg-white p-4 sm:p-5"
        style={{ borderColor: BORDER }}
      >
        <div className="flex-1 min-w-[140px]">
          <label
            className="mb-1 block text-xs font-semibold"
            style={{ color: INK_SOFT }}
          >
            City
          </label>
          <input
            placeholder="e.g. Mohali"
            value={filters.city}
            onChange={(e) =>
              setFilters((f) => ({ ...f, city: e.target.value }))
            }
            className="w-full rounded-lg border p-2.5 text-sm outline-none transition-shadow focus:ring-2"
            style={{ borderColor: BORDER }}
          />
        </div>
        <div className="w-28">
          <label
            className="mb-1 block text-xs font-semibold"
            style={{ color: INK_SOFT }}
          >
            Min rent
          </label>
          <input
            type="number"
            placeholder="₹"
            value={filters.minRent}
            onChange={(e) =>
              setFilters((f) => ({ ...f, minRent: e.target.value }))
            }
            className="w-full rounded-lg border p-2.5 text-sm outline-none transition-shadow focus:ring-2"
            style={{ borderColor: BORDER }}
          />
        </div>
        <div className="w-28">
          <label
            className="mb-1 block text-xs font-semibold"
            style={{ color: INK_SOFT }}
          >
            Max rent
          </label>
          <input
            type="number"
            placeholder="₹"
            value={filters.maxRent}
            onChange={(e) =>
              setFilters((f) => ({ ...f, maxRent: e.target.value }))
            }
            className="w-full rounded-lg border p-2.5 text-sm outline-none transition-shadow focus:ring-2"
            style={{ borderColor: BORDER }}
          />
        </div>
        <button
          type="submit"
          className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          style={{ background: BRAND }}
        >
          <Search className="h-4 w-4" />
          Search
        </button>
      </form>

      {error && (
        <div
          className="mt-4 flex items-center gap-2.5 rounded-xl border-l-[3px] bg-rose-50/70 px-4 py-3"
          style={{ borderLeftColor: "#e11d48" }}
        >
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
          <p className="text-sm text-rose-700">{getErrorMessage(error)}</p>
        </div>
      )}

      <div className="mt-8">
        {loading && (
          <div className="flex items-center gap-2.5 py-10 justify-center">
            <Loader2
              className="h-5 w-5 animate-spin"
              style={{ color: BRAND }}
            />
            <p className="text-sm" style={{ color: INK_SOFT }}>
              Searching…
            </p>
          </div>
        )}

        {!loading && allResults.length === 0 && (
          <div
            className="flex flex-col items-center gap-2 rounded-2xl border border-dashed py-14 text-center"
            style={{ borderColor: BORDER }}
          >
            <MapPin className="h-6 w-6" style={{ color: "#9CA3AF" }} />
            <p className="text-sm" style={{ color: INK_SOFT }}>
              No listings match yet — try widening the city or rent range.
            </p>
          </div>
        )}

        {!loading && allResults.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2">
            {allResults.map((r) => (
              <ListingCard
                key={r.listing._id || r.listing.id}
                source={r.source}
                listing={r.listing}
              />
            ))}
          </div>
        )}
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

"use client";

import Link from "next/link";
import {
  AlertCircle,
  ArrowLeftRight,
  ArrowRight,
  Search,
  Sparkles,
} from "lucide-react";
import { useSearchSwapMatchesQuery } from "@/services/roommatesApi";
import ListingCard from "../../../components/flatmates/ListingCardFlat";

const BRAND = "#4161df";
const INK = "#161A2E";
const INK_SOFT = "#5C5F73";
const BORDER = "#E5E7F2";
const SWAP_ACCENT = "#7C3AED";
const SWAP_TINT = "#F5F3FF";

const SWAP_STEPS = [
  "Your flat is where they want to live",
  "Their flat is where you want to live",
  "Only these mutual fits are shown",
];

export default function SwapMatchesPage() {
  const {
    data: matches = [],
    isLoading: loading,
    error,
  } = useSearchSwapMatchesQuery();

  return (
    <main className="mx-auto w-full max-w-5xl px-4 pb-20 pt-24 sm:px-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <span
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl"
          style={{ background: SWAP_TINT, color: SWAP_ACCENT }}
        >
          <ArrowLeftRight className="h-6 w-6" strokeWidth={1.9} />
        </span>
        <div>
          <h1
            className="text-2xl font-bold tracking-tight"
            style={{ color: INK }}
          >
            Swap matches
          </h1>
          <p
            className="mt-1 max-w-xl text-sm leading-relaxed"
            style={{ color: INK_SOFT }}
          >
            Trade places with someone whose location works better for you — and
            vice versa.
          </p>
        </div>
      </div>

      {/* How mutual matching works */}
      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        {SWAP_STEPS.map((step, index) => (
          <div
            key={step}
            className="flex items-center gap-3 rounded-xl border bg-white px-4 py-3"
            style={{ borderColor: BORDER }}
          >
            <span
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold"
              style={{ background: SWAP_TINT, color: SWAP_ACCENT }}
            >
              {index + 1}
            </span>
            <p className="text-[13px] font-medium" style={{ color: INK }}>
              {step}
            </p>
          </div>
        ))}
      </div>

      {error && (
        <div
          className="mt-6 rounded-2xl border-l-[3px] bg-rose-50/70 px-5 py-4"
          style={{ borderLeftColor: "#e11d48" }}
        >
          <p className="flex items-center gap-2 text-sm font-semibold text-rose-700">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {getErrorMessage(error)}
          </p>
          <p className="mt-2 text-sm text-rose-600/80">
            To see swap matches you need an active swap listing.{" "}
            <Link
              href="/flatmates/onboarding?intent=swap"
              className="font-semibold underline underline-offset-2"
            >
              Set one up
            </Link>{" "}
            — it takes a couple of minutes.
          </p>
        </div>
      )}

      {/* Loading skeletons */}
      {loading && (
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-[420px] animate-pulse rounded-2xl border bg-white"
              style={{ borderColor: BORDER }}
            >
              <div className="h-56 rounded-t-2xl bg-slate-100" />
              <div className="space-y-3 p-5">
                <div className="h-3 w-24 rounded bg-slate-100" />
                <div className="h-6 w-36 rounded bg-slate-100" />
                <div className="h-3 w-48 rounded bg-slate-100" />
                <div className="h-3 w-32 rounded bg-slate-100" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Results */}
      {!loading && !error && (
        <>
          <div className="mt-8 flex items-center justify-between gap-3">
            <p className="text-sm font-semibold" style={{ color: INK }}>
              {matches.length} mutual {matches.length === 1 ? "match" : "matches"}
            </p>
            <Link
              href="/flatmates/browse"
              className="inline-flex items-center gap-1.5 text-[13px] font-semibold transition-colors hover:opacity-75"
              style={{ color: BRAND }}
            >
              <Search className="h-3.5 w-3.5" />
              Browse all rooms
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {matches.length === 0 ? (
            <div
              className="mt-4 flex flex-col items-center gap-3 rounded-2xl border border-dashed px-6 py-14 text-center"
              style={{ borderColor: BORDER }}
            >
              <span
                className="flex h-12 w-12 items-center justify-center rounded-full"
                style={{ background: SWAP_TINT, color: SWAP_ACCENT }}
              >
                <Sparkles className="h-5 w-5" />
              </span>
              <p className="text-sm font-semibold" style={{ color: INK }}>
                No mutual matches yet
              </p>
              <p
                className="max-w-sm text-[13px] leading-relaxed"
                style={{ color: INK_SOFT }}
              >
                As more people list swap flats in your desired area,
                they&apos;ll show up here automatically.
              </p>
              <div className="mt-2 flex flex-wrap justify-center gap-2.5">
                <Link
                  href="/flatmates/browse"
                  className="inline-flex items-center gap-1.5 rounded-full border bg-white px-4 py-2 text-[13px] font-semibold transition-colors hover:bg-[#EEF1FC]"
                  style={{ borderColor: BORDER, color: INK }}
                >
                  <Search className="h-3.5 w-3.5" style={{ color: BRAND }} />
                  Browse rooms meanwhile
                </Link>
                <Link
                  href="/flatmates/onboarding?intent=swap"
                  className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-[13px] font-semibold text-white transition-opacity hover:opacity-90"
                  style={{ background: BRAND }}
                >
                  Update my swap listing
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {matches.map((m) => (
                <div key={m._id} className="animate-fade-in-up">
                  <ListingCard source="room_flat" listing={m} />
                </div>
              ))}
            </div>
          )}
        </>
      )}

      <div className="mt-10">
        <Link
          href="/flatmates"
          className="inline-flex items-center gap-1.5 text-sm font-semibold transition-colors hover:opacity-75"
          style={{ color: INK_SOFT }}
        >
          <ArrowLeftRight
            className="h-3.5 w-3.5"
            style={{ color: BRAND }}
          />
          All flatmate options
        </Link>
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

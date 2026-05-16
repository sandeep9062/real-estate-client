"use client";
// components/PropertiesClient.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Everything interactive lives here: map toggle, filters, infinite scroll.
// It receives the first page of properties as props (already fetched on the
// server), so the page is never blank — not even for a millisecond.
// ─────────────────────────────────────────────────────────────────────────────

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Map, List as ListIcon, X } from "lucide-react";

import { SearchResultsView } from "@/components/SearchResults";
import TopSearchBar from "@/components/TopSearchBar";
import PropertiesMapExplorer from "@/components/PropertiesMapExplorer";
import { useInfiniteProperties } from "@/hooks/useInfiniteProperties";

// ── Types ────────────────────────────────────────────────────────────────────

interface Property {
  id: string;
  [key: string]: unknown;
}

interface PropertiesClientProps {
  /** First page of properties, fetched server-side */
  initialProperties: Property[];
  /** Total matching count from the server */
  initialTotal: number;
  /** Active filter query from the URL (already flattened to strings) */
  initialQuery: Record<string, string>;
}

type TabType = "list" | "map";

// ── URL helpers ──────────────────────────────────────────────────────────────

function buildParams(
  base: URLSearchParams,
  extra: Record<string, string | null | undefined>,
): URLSearchParams {
  const merged: Record<string, string> = Object.fromEntries(base.entries());
  Object.entries(extra).forEach(([k, v]) => {
    if (v == null || v === "") delete merged[k];
    else merged[k] = String(v);
  });
  const params = new URLSearchParams();
  Object.entries(merged).forEach(([k, v]) => {
    if (v !== "") params.set(k, v);
  });
  return params;
}

// ── Sub-components ───────────────────────────────────────────────────────────

function ToggleButton({
  isMapOpen,
  onClick,
  size = "md",
  label,
}: {
  isMapOpen: boolean;
  onClick: () => void;
  size?: "sm" | "md";
  label?: string;
}) {
  const iconCls = size === "sm" ? "w-4 h-4" : "w-5 h-5";
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label ?? (isMapOpen ? "Hide map" : "Show map")}
      aria-pressed={isMapOpen}
      className={`
        flex flex-col items-center gap-1 bg-[#4161df] text-white rounded-2xl
        shadow-2xl transition-all duration-200 active:scale-95
        hover:bg-[#3251cf] focus-visible:outline-none
        focus-visible:ring-2 focus-visible:ring-[#4161df] focus-visible:ring-offset-2
        ${size === "sm" ? "px-2 py-3" : "px-3 py-4"}
      `}
    >
      {isMapOpen ? (
        <>
          <ListIcon className={iconCls} aria-hidden />
          <span className="text-[10px] font-semibold leading-tight">
            {size === "sm" ? "List" : "Hide map"}
          </span>
        </>
      ) : (
        <>
          <Map className={iconCls} aria-hidden />
          <span className="text-[10px] font-semibold leading-tight">Map</span>
        </>
      )}
    </button>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-20 px-4">
      <X className="w-10 h-10 text-red-400" />
      <p className="text-gray-700 font-medium text-center">
        Something went wrong loading properties.
      </p>
      <p className="text-sm text-red-500 text-center max-w-md">{message}</p>
      <button
        onClick={() => window.location.reload()}
        className="mt-2 px-4 py-2 text-sm font-medium bg-[#4161df] text-white rounded-lg hover:bg-[#3251cf] transition-colors"
      >
        Try again
      </button>
    </div>
  );
}

// ── Main component ───────────────────────────────────────────────────────────

export default function PropertiesClient({
  initialProperties,
  initialTotal,
  initialQuery,
}: PropertiesClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>("list");
  const [laptopMapOpen, setLaptopMapOpen] = useState(false);

  // ── URL helpers ───────────────────────────────────────────────────────────

  const mergeToUrl = useCallback(
    (extra: Record<string, string | null | undefined>) => {
      const params = buildParams(searchParams, extra);
      router.push(`/properties?${params.toString()}`);
    },
    [router, searchParams],
  );

  const handleApplyFilters = useCallback(
    (filters: Record<string, unknown>) => {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([k, v]) => {
        if (v != null && v !== "") params.set(k, String(v));
      });
      router.push(`/properties?${params.toString()}`);
    },
    [router],
  );

  // Derive the live query object from URL (reflects filter changes after hydration)
  const query = useMemo(
    () => Object.fromEntries(searchParams.entries()),
    [searchParams],
  );

  // ── Infinite scroll (client-side, continues from SSR initial page) ────────
  const {
    properties,
    hasMore,
    total,
    initialLoading,
    loadingMore,
    error,
    loadMore,
  } = useInfiniteProperties(query, {
    // Seed the hook with the server-rendered first page so the list isn't
    // blank during hydration and no duplicate network request is made.
    initialData: initialProperties,
    initialTotal,
  });

  // ── Scroll selected card into view ────────────────────────────────────────
  useEffect(() => {
    if (!selectedId) return;
    document
      .querySelector(`[data-property-id="${selectedId}"]`)
      ?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [selectedId, properties]);

  const handleSelectProperty = useCallback((id: string) => {
    setSelectedId(id);
    if (window.innerWidth < 1024) setActiveTab("list");
  }, []);

  if (error) return <ErrorState message={error} />;

  const displayTotal = total ?? initialTotal;
  const displayProperties = properties.length ? properties : initialProperties;

  return (
    <div className="w-full pt-20 bg-gray-50 min-h-screen relative">

      {/* Floating toggle — mobile */}
      <div className="lg:hidden fixed right-4 top-1/2 -translate-y-1/2 z-[1000]">
        <ToggleButton
          isMapOpen={activeTab === "map"}
          onClick={() => setActiveTab((t) => (t === "list" ? "map" : "list"))}
          size="sm"
          label={activeTab === "list" ? "Open map view" : "Open list view"}
        />
      </div>

      {/* Floating toggle — desktop */}
      <div className="hidden lg:flex fixed right-4 top-1/2 -translate-y-1/2 z-[1000]">
        <ToggleButton
          isMapOpen={laptopMapOpen}
          onClick={() => setLaptopMapOpen((o) => !o)}
          size="md"
          label={laptopMapOpen ? "Hide map" : "Show map beside listings"}
        />
      </div>

      <div className="flex flex-col items-center gap-4 sm:gap-6 md:gap-8 max-w-full mx-auto px-4 sm:px-6 md:px-10 py-6 sm:py-8 md:py-12">

        {/* Heading */}
        <header className="w-full text-center">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2 sm:mb-3">
            Find Your Perfect Property in Tricity
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-500 px-2 max-w-2xl mx-auto">
            Verified homes, apartments &amp; commercial spaces for sale and rent
            in Chandigarh, Panchkula, Mohali &amp; more.
          </p>
        </header>

        {/* Search / filter bar */}
        <div className="w-full">
          <TopSearchBar
            onApply={handleApplyFilters}
            initialFilters={initialQuery}
          />
        </div>

        {/* Result count */}
        {!initialLoading && displayTotal != null && (
          <p className="w-full text-sm text-gray-500">
            {displayTotal === 0
              ? "No properties found — try adjusting your filters."
              : `Showing ${displayProperties.length} of ${displayTotal} propert${displayTotal === 1 ? "y" : "ies"}`}
          </p>
        )}

        {/* List + map grid */}
        <div
          className={`w-full grid grid-cols-1 gap-6 items-start transition-all duration-300 ${
            laptopMapOpen ? "lg:grid-cols-2" : "lg:grid-cols-1"
          }`}
        >
          {/* List column */}
          <div
            className={`${activeTab === "list" ? "block" : "hidden"} lg:block order-2 lg:order-1 space-y-3 min-w-0`}
          >
            <SearchResultsView
              query={query}
              columns={laptopMapOpen ? "two" : "four"}
              selectedId={selectedId}
              properties={displayProperties}
              hasMore={hasMore}
              total={displayTotal}
              initialLoading={initialLoading}
              loadingMore={loadingMore}
              error={error}
              loadMore={loadMore}
            />
          </div>

          {/* Map column */}
          <div
            className={`
              ${activeTab === "map" ? "block" : "hidden"}
              ${laptopMapOpen ? "lg:block" : "lg:hidden"}
              order-1 lg:order-2 lg:sticky lg:top-24 z-10 w-full min-w-0 self-start
            `}
          >
            <PropertiesMapExplorer
              properties={displayProperties}
              selectedId={selectedId}
              onSelectProperty={handleSelectProperty}
              onSearchThisArea={(bbox) =>
                mergeToUrl({ bbox, polygon: undefined })
              }
              onPolygonApply={(polygonJson) =>
                mergeToUrl({ polygon: polygonJson, bbox: undefined })
              }
              heightClass="h-[min(72dvh,calc(100dvh-13rem))] min-h-[280px] lg:min-h-0 lg:h-[min(920px,85vh,calc(100dvh-3rem))]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

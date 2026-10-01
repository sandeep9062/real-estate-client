"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowUpRight, MapPin, Search, X } from "lucide-react";
import type { CityGroup, SectorMapPoint } from "@/lib/sectorDirectory";

/**
 * Leaflet can only run in the browser, so the map is client-loaded with an
 * SSR-safe skeleton (same pattern as PropertiesMapExplorer).
 */
const SectorMap = dynamic(() => import("./SectorMap"), {
  ssr: false,
  loading: () => (
    <div className="h-[75vh] min-h-[460px] w-full animate-pulse bg-slate-100" />
  ),
});

const BRAND = "#4161df";

interface SectorDirectoryProps {
  cities: CityGroup[];
  /** Map pins per city key — one per sector/locality with real listings. */
  mapPoints?: Record<string, SectorMapPoint[]>;
  /** Active listings per city key (header stats). */
  listingCounts?: Record<string, number>;
}

export default function SectorDirectory({
  cities,
  mapPoints,
  listingCounts,
}: SectorDirectoryProps) {
  const [query, setQuery] = useState("");

  // Every city's pins share one map — panning/zooming IS the city switcher.
  const allPoints = cities.flatMap((city) => mapPoints?.[city.key] ?? []);

  const liveSectors = useMemo(
    () =>
      cities.flatMap((city) =>
        city.sectors
          .filter((sector) => sector.href)
          .map((sector) => ({
            city: city.name,
            layout: city.layout,
            label: sector.label,
            href: sector.href as string,
            text:
              city.layout === "grid" ? `Sector ${sector.label}` : sector.label,
          })),
      ),
    [cities],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return liveSectors;
    return liveSectors.filter((s) =>
      `${s.text} ${s.city}`.toLowerCase().includes(q),
    );
  }, [liveSectors, query]);

  const totalLive = liveSectors.length;
  const totalMapped = Object.values(mapPoints ?? {}).reduce(
    (sum, list) => sum + list.length,
    0,
  );
  const totalListings = Object.values(listingCounts ?? {}).reduce(
    (sum, count) => sum + count,
    0,
  );

  return (
    <section className="mx-auto w-full max-w-full px-4 pb-16 pt-8 sm:px-6 sm:pt-12 lg:px-8">
      {/* Header + stats */}
      <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#EEF1FC] px-3 py-1 text-xs font-semibold text-[#4161df]">
            <MapPin className="h-3.5 w-3.5" aria-hidden />
            Sector directory
          </span>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Browse the Tricity, sector by sector
          </h1>
          <p className="mt-3 text-base leading-relaxed text-slate-600">
            Chandigarh, Mohali and Panchkula are planned as numbered sectors.
            Zirakpur and Kharar are organised by locality. Pan and zoom the map,
            then click a pin to see its listings.
          </p>
        </div>

        <dl className="grid w-full max-w-md grid-cols-3 divide-x divide-slate-200 rounded-2xl border border-slate-200 bg-white py-4 shadow-sm lg:w-auto">
          <Stat value={totalLive} label="Sector pages" />
          <Stat value={totalMapped} label="Areas with listings" />
          <Stat value={totalListings} label="Active listings" />
        </dl>
      </div>

      {/* Full-width map — all five cities on one canvas, viewport-wide with
          24px gutters (w-screen + centering transform; page clips overflow). */}
      <div className="relative left-1/2 mt-8 w-screen -translate-x-1/2 px-4 sm:px-6">
        {allPoints.length > 0 ? (
          <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_8px_30px_rgb(15_23_42/0.08)]">
            <SectorMap markers={allPoints} />

            {/* Legend overlay */}
            <div className="pointer-events-none absolute left-3 top-3 z-[1000] sm:left-4 sm:top-4">
              <div className="pointer-events-auto space-y-1.5 rounded-xl border border-white/60 bg-white/90 px-3.5 py-2.5 text-xs text-slate-600 shadow-lg backdrop-blur">
                <p className="flex items-center gap-2">
                  <span
                    className="size-2.5 rounded-full ring-2 ring-[#4161df]/25"
                    style={{ background: BRAND }}
                  />
                  Page live — click to open
                </p>
                <p className="flex items-center gap-2">
                  <span className="size-2.5 rounded-full bg-slate-400 ring-2 ring-slate-400/25" />
                  Listings only — page coming soon
                </p>
              </div>
            </div>

            {/* Interaction hint */}
            <p className="pointer-events-none absolute bottom-3 left-1/2 z-[1000] hidden -translate-x-1/2 rounded-full bg-slate-900/80 px-3.5 py-1.5 text-xs font-medium text-white backdrop-blur sm:block">
              Drag to pan, scroll to zoom
            </p>
          </div>
        ) : (
          <div className="flex h-[60vh] flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-6 text-center">
            <span className="flex size-12 items-center justify-center rounded-full bg-white shadow-sm">
              <MapPin className="h-5 w-5 text-slate-400" aria-hidden />
            </span>
            <div>
              <p className="text-sm font-semibold text-slate-700">
                No mapped listings yet
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Pins appear here as soon as listings land in the Tricity.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Live sector pages — plain links, the map is the city switcher */}
      <div className="mt-10 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Live sector pages
            </h2>
            <p className="mt-0.5 text-sm text-slate-500">
              {totalLive > 0
                ? `${totalLive} ready to browse, or pan the map above.`
                : "Nothing live yet."}
            </p>
          </div>

          {totalLive > 0 && (
            <label className="relative block w-full sm:w-72">
              <span className="sr-only">Filter sector pages</span>
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                aria-hidden
              />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search e.g. 17 or Mohali"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-9 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#4161df] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4161df]/20"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  aria-label="Clear search"
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 hover:text-slate-700"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </label>
          )}
        </div>

        {totalLive === 0 ? (
          <p className="mt-5 rounded-xl bg-slate-50 px-4 py-3 text-sm leading-relaxed text-slate-500">
            Sector pages go live once a sector has enough listings. Grey map
            pins show where inventory exists today.
          </p>
        ) : filtered.length === 0 ? (
          <p className="mt-5 rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-500">
            No sector pages match “{query}”. Try a sector number or a city name.
          </p>
        ) : (
          <ul className="mt-5 grid grid-cols-1 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((sector) => (
              <li
                key={`${sector.city}-${sector.label}`}
                className="border-b border-slate-100"
              >
                <Link
                  href={sector.href}
                  className="group flex items-center justify-between gap-3 rounded-md py-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4161df] focus-visible:ring-offset-1"
                >
                  <span className="min-w-0 truncate">
                    <span className="font-medium text-slate-900 transition-colors group-hover:text-[#4161df]">
                      {sector.text}
                    </span>
                    <span className="text-slate-400">, {sector.city}</span>
                  </span>
                  <ArrowUpRight
                    className="h-4 w-4 shrink-0 text-slate-300 transition-colors group-hover:text-[#4161df]"
                    aria-hidden
                  />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div className="px-4 text-center sm:px-6 lg:text-left">
      <dd className="text-2xl font-bold tabular-nums text-slate-900 sm:text-3xl">
        {value.toLocaleString("en-IN")}
      </dd>
      <dt className="mt-0.5 text-xs font-medium text-slate-500">{label}</dt>
    </div>
  );
}

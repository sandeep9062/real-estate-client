"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { MapPin } from "lucide-react";
import type { CityGroup, SectorMapPoint } from "@/lib/sectorDirectory";

/**
 * Leaflet can only run in the browser, so the map is client-loaded with an
 * SSR-safe skeleton (same pattern as PropertiesMapExplorer).
 */
const SectorMap = dynamic(() => import("./SectorMap"), {
  ssr: false,
  loading: () => <div className="h-[80vh] w-full animate-pulse bg-slate-100" />,
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
  // Every city's pins share one map — panning/zooming IS the city switcher.
  const allPoints = cities.flatMap((city) => mapPoints?.[city.key] ?? []);

  // One flat list of every live sector page — no per-city groups or buttons.
  // Panning/zooming the map above is the city switcher.
  const liveSectors = cities.flatMap((city) =>
    city.sectors
      .filter((sector) => sector.href)
      .map((sector) => ({
        city: city.name,
        layout: city.layout,
        label: sector.label,
        href: sector.href as string,
      })),
  );

  const totalLive = cities.reduce(
    (sum, city) => sum + city.sectors.filter((s) => s.href).length,
    0,
  );
  const totalMapped = Object.values(mapPoints ?? {}).reduce(
    (sum, list) => sum + list.length,
    0,
  );
  const totalListings = Object.values(listingCounts ?? {}).reduce(
    (sum, count) => sum + count,
    0,
  );

  return (
    <section className="mx-auto w-full max-w-full px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <div className="mb-8">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#EEF1FC] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#4161df]">
          <MapPin className="h-3.5 w-3.5" />
          Sector directory
        </span>
        <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Browse Tricity, sector by sector
        </h1>
        <p className="mt-1.5 max-w-2xl text-sm text-slate-500">
          Chandigarh, Mohali and Panchkula are planned as numbered sectors.
          Zirakpur and Kharar are organised by locality instead — pan and zoom
          across the map and click a pin to explore its listings.
        </p>
      </div>

      {/* Tricity stats */}
      <div className="grid max-w-xl grid-cols-3 gap-2 sm:gap-3">
        <Stat value={totalLive} label="Live sector pages" />
        <Stat value={totalMapped} label="Sectors with listings" />
        <Stat value={totalListings} label="Active listings" />
      </div>

      {/* Legend */}
      <div className="mt-8 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
        <div className="flex flex-wrap items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span
              className="size-2.5 rounded-full"
              style={{ background: BRAND }}
            />
            Live page — click to open
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-slate-400" />
            Listings only — page coming soon
          </span>
        </div>
        <span className="font-medium text-slate-600">
          Drag to pan · scroll to zoom across Chandigarh, Mohali, Panchkula,
          Zirakpur &amp; Kharar
        </span>
      </div>

      {/* Full-width map — all five cities on one canvas, viewport-wide with
          24px gutters (w-screen + centering transform; page clips overflow). */}
      <div className="relative left-1/2 mt-4 w-screen -translate-x-1/2 px-6">
        {allPoints.length > 0 ? (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <SectorMap markers={allPoints} />
          </div>
        ) : (
          <div className="flex h-[80vh] flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 text-center">
            <span className="flex size-12 items-center justify-center rounded-full bg-slate-100">
              <MapPin className="h-5 w-5 text-slate-400" />
            </span>
            <div>
              <p className="text-sm font-semibold text-slate-700">
                No mapped listings yet
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Pins appear here as soon as listings land in the Tricity.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Live listings — plain text links (not buttons/chips): the map above
          is the city switcher, users pan/scroll it to move between cities. */}
      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="text-sm font-bold text-slate-900">
            Live sector pages
          </h2>
          <p className="text-xs text-slate-500">
            {totalLive > 0
              ? `${totalLive} ready to browse — or pan the map above`
              : "Nothing live yet"}
          </p>
        </div>

        {liveSectors.length > 0 ? (
          <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
            {liveSectors.map((sector) => (
              <li key={`${sector.city}-${sector.label}`}>
                <Link
                  href={sector.href}
                  className="text-xs font-medium text-[#4161df] underline decoration-[#4161df]/30 underline-offset-4 transition-colors hover:decoration-[#4161df] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4161df] focus-visible:ring-offset-1"
                >
                  {sector.layout === "grid"
                    ? `Sector ${sector.label}, ${sector.city}`
                    : `${sector.label}, ${sector.city}`}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 rounded-lg bg-slate-50 px-3 py-2 text-xs leading-relaxed text-slate-500">
            Sector pages go live once a sector has enough listings. Grey map
            pins already show where inventory exists today.
          </p>
        )}
      </div>
    </section>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 shadow-sm">
      <p className="text-xl font-bold tabular-nums text-slate-900">{value}</p>
      <p className="mt-0.5 text-[11px] font-medium uppercase tracking-wide text-slate-400">
        {label}
      </p>
    </div>
  );
}

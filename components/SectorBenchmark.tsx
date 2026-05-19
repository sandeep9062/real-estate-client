"use client";

/**
 * <SectorBenchmark sector="Sector 74" propertyType="2BHK" listingPrice={15000} />
 *
 * Drop this anywhere on a property listing page.
 * Shows how the current listing price compares to the sector median.
 * Uses useGetSectorDrilldownQuery — fetches only when sector is known.
 */

import { useGetSectorDrilldownQuery } from "@/services/marketIndexApi";

interface Props {
  sector: string;
  propertyType: string;
  listingPrice: number;
  listingType: "rent" | "sale";
}

function fmt(n: number) {
  if (n >= 10_000_000) return `₹${(n / 10_000_000).toFixed(1)}Cr`;
  if (n >= 100_000) return `₹${(n / 100_000).toFixed(1)}L`;
  return `₹${n.toLocaleString("en-IN")}`;
}

export default function SectorBenchmark({
  sector,
  propertyType,
  listingPrice,
  listingType,
}: Props) {
  const { data, isLoading, isError } = useGetSectorDrilldownQuery(sector);

  if (isLoading)
    return (
      <div className="border border-gray-100 rounded-xl p-4 animate-pulse">
        <div className="h-3 w-40 bg-gray-100 rounded mb-2" />
        <div className="h-3 w-32 bg-gray-50 rounded" />
      </div>
    );

  if (isError || !data) return null;

  const pool = listingType === "rent" ? data.rent : data.sale;
  const matched = pool.find((r) => r.propertyType === propertyType);

  if (!matched) return null;

  const diff = Math.round(
    ((listingPrice - matched.medianPrice) / matched.medianPrice) * 100,
  );
  const above = diff > 0;
  const neutral = Math.abs(diff) <= 5;

  const label = neutral
    ? "Fair Price"
    : above
      ? "Above Market"
      : "Below Market";
  const color = neutral
    ? "text-emerald-600"
    : above
      ? "text-red-500"
      : "text-blue-600";
  const bgColor = neutral
    ? "bg-emerald-50"
    : above
      ? "bg-red-50"
      : "bg-blue-50";
  const border = neutral
    ? "border-emerald-100"
    : above
      ? "border-red-100"
      : "border-blue-100";

  return (
    <div className={`border rounded-xl p-4 ${bgColor} ${border}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-gray-600 mb-0.5">
            {sector} · {propertyType} Market Rate
          </p>
          <p className="text-xs text-gray-400">
            Based on {matched.count} active listings · {data.quarter}
          </p>
        </div>
        <span className={`text-sm font-bold ${color}`}>
          {label}
          {!neutral && (
            <span className="text-xs font-medium ml-1">
              ({above ? "+" : ""}
              {diff}%)
            </span>
          )}
        </span>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2">
        {[
          { label: "Median", value: fmt(matched.medianPrice) },
          { label: "Lowest", value: fmt(matched.minPrice) },
          { label: "Highest", value: fmt(matched.maxPrice) },
        ].map(({ label, value }) => (
          <div key={label} className="bg-white rounded-lg p-2.5 text-center">
            <p className="text-xs text-gray-400">{label}</p>
            <p className="text-xs font-bold text-gray-800 mt-0.5">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

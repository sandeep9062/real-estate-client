"use client";

import { useState, useMemo } from "react";
import {
  useGetMarketIndexQuery,
  SectorEntry,
  YieldEntry,
} from "@/services/marketIndexApi";

// ─── Formatters ───────────────────────────────────────────────────────────────

function fmt(n?: number | null): string {
  if (!n) return "—";
  if (n >= 10_000_000) return `₹${(n / 10_000_000).toFixed(1)}Cr`;
  if (n >= 100_000) return `₹${(n / 100_000).toFixed(1)}L`;
  return `₹${n.toLocaleString("en-IN")}`;
}

function fmtSqft(n?: number | null): string {
  return n ? `₹${n.toLocaleString("en-IN")}/sqft` : "—";
}

// ─── Shared UI atoms ─────────────────────────────────────────────────────────

const PRICE_TAG_CLS: Record<string, string> = {
  Overpriced:
    "bg-red-100/70   text-red-700    border-red-200/70 ring-1 ring-red-200/40",
  "Fair Market":
    "bg-emerald-100/70 text-emerald-700 border-emerald-200/70 ring-1 ring-emerald-200/40",
  "Value Deal":
    "bg-blue-100/70   text-blue-700   border-blue-200/70 ring-1 ring-blue-200/40",
  "New Data": "bg-gray-200/60  text-gray-500   border-gray-300/60",
};

const YIELD_TAG_CLS: Record<string, string> = {
  "High Yield":
    "bg-violet-100/70 text-violet-700 border-violet-200/70 ring-1 ring-violet-200/40",
  "Moderate Yield":
    "bg-amber-100/70  text-amber-700  border-amber-200/70 ring-1 ring-amber-200/40",
  "Low Yield": "bg-gray-200/60   text-gray-400   border-gray-300/60",
};

const BRAND = "#4161df";

function Tag({
  label,
  type = "price",
}: {
  label: string;
  type?: "price" | "yield";
}) {
  const cls = type === "yield" ? YIELD_TAG_CLS[label] : PRICE_TAG_CLS[label];
  return (
    <span
      className={`inline-block border text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap ${cls}`}
    >
      {label}
    </span>
  );
}

function TrendPill({ trend }: { trend: number | null }) {
  if (trend === null || trend === undefined) return null;
  const up = trend > 0;
  return (
    <span
      className={`inline-flex items-center text-xs font-semibold px-2.5 py-0.5 rounded-full border ${
        up
          ? "bg-red-100/70 text-red-600 border-red-200/70"
          : "bg-emerald-100/70 text-emerald-600 border-emerald-200/70"
      }`}
    >
      <span
        className={`inline-block mr-0.5 text-sm leading-none ${up ? "text-red-500" : "text-emerald-500"}`}
      >
        {up ? "↑" : "↓"}
      </span>
      {Math.abs(trend)}%
    </span>
  );
}

// ─── Skeleton loader with shimmer ────────────────────────────────────────────

function Skeleton() {
  return (
    <div className="space-y-5 animate-pulse">
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="border border-gray-100 rounded-2xl overflow-hidden shadow-sm bg-white"
        >
          <div className="bg-gradient-to-r from-gray-100 via-gray-200/60 to-gray-100 h-12 w-full" />
          {[...Array(2)].map((_, j) => (
            <div
              key={j}
              className="px-5 py-4 flex justify-between items-center border-t border-gray-50"
            >
              <div className="space-y-2">
                <div className="h-3 w-28 bg-gradient-to-r from-gray-100 via-gray-200/60 to-gray-100 rounded" />
                <div className="h-2 w-20 bg-gradient-to-r from-gray-100 via-gray-200/60 to-gray-100 rounded" />
              </div>
              <div className="space-y-2 text-right">
                <div className="h-5 w-24 bg-gradient-to-r from-gray-100 via-gray-200/60 to-gray-100 rounded ml-auto" />
                <div className="h-3 w-16 bg-gradient-to-r from-gray-100 via-gray-200/60 to-gray-100 rounded ml-auto" />
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

// ─── Stat card (used in sector header) ───────────────────────────────────────

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white/80 backdrop-blur-sm border border-gray-100/80 rounded-xl px-4 py-3 text-center shadow-sm hover:shadow-md transition-shadow duration-300">
      <p className="text-[10px] uppercase tracking-wider text-gray-400 font-medium mb-1">
        {label}
      </p>
      <p className="font-bold text-gray-900 text-sm">{value}</p>
    </div>
  );
}

// ─── Sector Card (shared by Rent & Sale) ─────────────────────────────────────

function SectorCard({
  sector,
  city,
  rows,
  showSqft = false,
}: {
  sector: string;
  city: string;
  rows: SectorEntry[];
  showSqft?: boolean;
}) {
  return (
    <div className="group bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:border-gray-200 transition-all duration-300">
      {/* Sector header with gradient accent */}
      <div className="relative bg-gradient-to-r from-gray-50 to-white px-5 py-4 border-b border-gray-100">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#4161df] to-blue-400 rounded-r-sm" />
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm font-bold text-gray-900">{sector}</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <svg
                className="w-3 h-3 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <p className="text-xs text-gray-400">{city}</p>
            </div>
          </div>
          <span className="text-[11px] font-medium text-gray-400 bg-gray-100/80 px-2.5 py-1 rounded-full">
            {rows.reduce((s, r) => s + r.count, 0).toLocaleString("en-IN")}{" "}
            listings
          </span>
        </div>
      </div>

      {/* Property rows */}
      <div className="divide-y divide-gray-50">
        {rows.map((r, i) => (
          <div
            key={i}
            className="px-5 py-3.5 flex items-center justify-between gap-3 hover:bg-gray-50/50 transition-colors duration-150"
          >
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-gray-800">
                {r.propertyType}
              </p>
              <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1.5">
                <span>{r.count.toLocaleString("en-IN")} listings</span>
                {showSqft && r.pricePerSqft && (
                  <>
                    <span className="text-gray-200">·</span>
                    <span>{fmtSqft(r.pricePerSqft)}</span>
                  </>
                )}
              </p>
            </div>
            <div className="flex items-center gap-2.5 flex-wrap justify-end shrink-0">
              <TrendPill trend={r.trend} />
              <Tag label={r.priceTag} />
              <div className="text-right min-w-[90px]">
                <p className="font-bold text-gray-900 text-base leading-tight">
                  {fmt(r.medianPrice)}
                  <span className="text-[10px] font-normal text-gray-400 ml-0.5">
                    /mo
                  </span>
                </p>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  {fmt(r.minPrice)} – {fmt(r.maxPrice)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Rent Tab ─────────────────────────────────────────────────────────────────

function RentTab({ data }: { data: SectorEntry[] }) {
  const grouped = data.reduce<Record<string, SectorEntry[]>>((acc, r) => {
    (acc[r.sector] ??= []).push(r);
    return acc;
  }, {});

  if (!Object.keys(grouped).length) return <EmptyState tab="rental" />;

  return (
    <div className="space-y-5">
      {Object.entries(grouped).map(([sector, rows]) => (
        <SectorCard
          key={sector}
          sector={sector}
          city={rows[0].city}
          rows={rows}
        />
      ))}
    </div>
  );
}

// ─── Sale Tab ─────────────────────────────────────────────────────────────────

function SaleTab({ data }: { data: SectorEntry[] }) {
  const grouped = data.reduce<Record<string, SectorEntry[]>>((acc, r) => {
    (acc[r.sector] ??= []).push(r);
    return acc;
  }, {});

  if (!Object.keys(grouped).length) return <EmptyState tab="sale" />;

  return (
    <div className="space-y-5">
      {Object.entries(grouped).map(([sector, rows]) => (
        <SectorCard
          key={sector}
          sector={sector}
          city={rows[0].city}
          rows={rows}
          showSqft
        />
      ))}
    </div>
  );
}

// ─── Yield Tab ────────────────────────────────────────────────────────────────

function YieldTab({ data }: { data: YieldEntry[] }) {
  if (!data.length) return <EmptyState tab="yield" />;

  return (
    <div className="space-y-4">
      {/* Info banner */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50/50 border border-amber-100/80 rounded-xl px-4 py-3 text-xs text-amber-700 leading-relaxed flex items-start gap-2.5">
        <span className="text-lg shrink-0 mt-0.5">💡</span>
        <span>
          <strong>Annual yield</strong> = (monthly rent × 12) ÷ sale price ×
          100. Sorted by highest yield — best for NRI and investor decisions.
        </span>
      </div>

      {data.map((r, i) => (
        <div
          key={i}
          className="group bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-lg hover:border-gray-200 transition-all duration-300"
        >
          {/* Header row */}
          <div className="flex items-start justify-between mb-5">
            <div className="flex items-start gap-3">
              {/* Rank badge */}
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#4161df] to-blue-400 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                {i + 1}
              </div>
              <div>
                <p className="font-bold text-gray-900">{r.sector}</p>
                <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  {r.city}
                </p>
                <span className="text-xs text-gray-300">·</span>
                <span className="text-xs text-gray-400">{r.propertyType}</span>
              </div>
            </div>
            <div className="flex items-center gap-2.5 shrink-0">
              <Tag label={r.yieldTag} type="yield" />
              <div className="text-right">
                <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">
                  Yield
                </p>
                <span className="text-2xl font-black text-gray-900">
                  {r.annualYield}%
                </span>
              </div>
            </div>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-3 gap-3">
            {[
              {
                label: "Buy at",
                value: fmt(r.salePrice),
                icon: (
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                ),
              },
              {
                label: "Rent earned",
                value: `${fmt(r.monthlyRent)}/mo`,
                icon: (
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                    />
                  </svg>
                ),
              },
              {
                label: "Price/sqft",
                value: r.pricePerSqft
                  ? `₹${r.pricePerSqft.toLocaleString("en-IN")}`
                  : "—",
                icon: (
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                    />
                  </svg>
                ),
              },
            ].map(({ label, value, icon }) => (
              <div
                key={label}
                className="bg-gradient-to-b from-gray-50 to-white rounded-xl p-3.5 text-center border border-gray-100/60 group-hover:border-gray-200/60 transition-colors duration-300"
              >
                <div className="flex items-center justify-center gap-1 text-gray-400 mb-1.5">
                  {icon}
                  <p className="text-[10px] font-medium uppercase tracking-wider">
                    {label}
                  </p>
                </div>
                <p className="font-bold text-gray-800 text-sm">{value}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Empty / Error states ─────────────────────────────────────────────────────

function EmptyState({ tab }: { tab: string }) {
  return (
    <div className="text-center py-20">
      <div className="text-5xl mb-4 opacity-50">📊</div>
      <p className="text-gray-500 font-medium">No {tab} data available yet</p>
      <p className="text-xs text-gray-400 mt-1.5 max-w-xs mx-auto">
        More listings needed for meaningful {tab} insights. Check back next
        quarter.
      </p>
    </div>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="text-center py-20">
      <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center">
        <svg
          className="w-6 h-6 text-red-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
          />
        </svg>
      </div>
      <p className="text-sm text-red-500 font-medium">
        Failed to load market data
      </p>
      <p className="text-xs text-gray-400 mt-1.5">{message}</p>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

const TABS = [
  { label: "Rental Prices", key: "rent" },
  { label: "Property Prices", key: "sale" },
  { label: "Investment Yield", key: "yield" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

export default function TricityMarketIndexPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("rent");

  const { data: report, isLoading, isError, error } = useGetMarketIndexQuery();

  const errorMessage = isError
    ? ((error as any)?.data?.error ?? "Failed to load market data.")
    : null;

  // Compute aggregate stats for the header summary
  const stats = useMemo(() => {
    if (!report) return null;
    const allSectors = new Set([
      ...report.rentData.map((r) => r.sector),
      ...report.saleData.map((r) => r.sector),
    ]);
    return {
      sectors: allSectors.size,
      listings: report.totalListings,
      quarter: report.quarter,
    };
  }, [report]);

  return (
    <main className="min-h-screen mt-20 bg-gradient-to-b from-gray-50/50 to-white">
      {/* ── Sticky header ── */}
      <div className="border-b border-gray-100/80 bg-white/95 backdrop-blur-md sticky top-0 z-20 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 pt-6 pb-0">
          {/* Meta badges */}
          <div className="flex items-center gap-2.5 mb-2">
            {stats ? (
              <>
                <span className="text-[11px] font-bold bg-gradient-to-r from-[#4161df] to-blue-500 text-white px-2.5 py-0.5 rounded-full shadow-sm">
                  {stats.quarter}
                </span>
                <span className="text-[11px] text-gray-400 font-medium">
                  {stats.listings.toLocaleString("en-IN")} listings ·{" "}
                  {stats.sectors} sectors
                </span>
              </>
            ) : (
              <div className="h-4 w-36 bg-gray-100 rounded animate-pulse" />
            )}
          </div>

          {/* Title row */}
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">
              Tricity Market Index
            </h1>
          </div>
          <p className="text-sm text-gray-400 mb-4 flex items-center gap-1.5">
            <svg
              className="w-3.5 h-3.5 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            Chandigarh · Mohali · Panchkula · Zirakpur · New Chandigarh · Kharar
          </p>

          {/* Tab strip */}
          <div className="flex gap-1 border-b border-gray-100">
            {TABS.map((t) => (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                className={`relative px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                  activeTab === t.key
                    ? "text-[#4161df]"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                {t.label}
                {activeTab === t.key && (
                  <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-gradient-to-r from-[#4161df] to-blue-400 rounded-full" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="max-w-2xl mx-auto px-4 py-6">
        {isLoading && <Skeleton />}

        {isError && <ErrorState message={errorMessage!} />}

        {report && (
          <div className="transition-opacity duration-300">
            {activeTab === "rent" && <RentTab data={report.rentData} />}
            {activeTab === "sale" && <SaleTab data={report.saleData} />}
            {activeTab === "yield" && <YieldTab data={report.yieldData} />}
          </div>
        )}

        {/* Methodology note */}
        {report && (
          <div className="mt-10 bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-gray-100 to-gray-50 border border-gray-200 flex items-center justify-center">
                <svg
                  className="w-3 h-3 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <p className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                Methodology
              </p>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">
              Median prices from active PropertyBulbul listings in the last 90
              days. Trend compares the previous 90-day period. Minimum 5
              listings for rental data, 3 for sale. Price/sqft shown where area
              data is available.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="text-[10px] bg-red-50/80 text-red-600 border border-red-100/80 px-2 py-0.5 rounded-full font-medium">
                {`Overpriced: >8% above trend`}
              </span>
              <span className="text-[10px] bg-emerald-50/80 text-emerald-600 border border-emerald-100/80 px-2 py-0.5 rounded-full font-medium">
                Fair Market: within ±8%
              </span>
              <span className="text-[10px] bg-blue-50/80 text-blue-600 border border-blue-100/80 px-2 py-0.5 rounded-full font-medium">
                {`Value Deal: >5% below trend`}
              </span>
            </div>
          </div>
        )}

        {/* CTA */}
        {report && (
          <div className="mt-4 bg-gradient-to-br from-[#4161df] to-[#2d4bc7] rounded-2xl p-6 text-white relative overflow-hidden shadow-lg shadow-blue-200/40">
            {/* Decorative elements */}
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/5 rounded-full blur-xl" />
            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-white/5 rounded-full blur-lg" />

            <div className="relative">
              <p className="font-bold text-base mb-1">
                Find your perfect property in Tricity
              </p>
              <p className="text-sm text-blue-200 mb-4">
                Browse listings across all sectors — rent, buy, or PG.
              </p>
              <a
                href="/properties"
                className="inline-flex items-center gap-2 bg-white text-[#4161df] text-sm font-bold px-5 py-2.5 rounded-xl hover:bg-blue-50 transition-all duration-200 shadow-lg shadow-blue-900/20 active:scale-[0.98]"
              >
                Browse listings
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </a>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { useGetComparePropertiesQuery } from "@/services/propertiesApi";
import Link from "next/link";
import Image from "next/image";
import {
  getCompareIds,
  toggleCompareId,
  setCompareIds,
} from "@/lib/compareStorage";
import { toast } from "@/hooks/use-toast";
import {
  FaBed,
  FaBath,
  FaCar,
  FaMapMarkerAlt,
  FaHome,
  FaTimes,
} from "react-icons/fa";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { GiSunrise } from "react-icons/gi";
import { MdOutlineCompareArrows } from "react-icons/md";
import {
  Building2,
  CalendarClock,
  DollarSign,
  Home,
  Maximize2,
  X,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface RowConfig {
  section?: string;
  label: string;
  key: string;
  icon?: React.ReactNode;
  fmt: (p: any) => React.ReactNode;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const formatInr = (n: number) => `₹${(Number(n) || 0).toLocaleString("en-IN")}`;

const availLabel = (p: any) => {
  const v = p.listingAvailability || p.availability || "Available";
  const map: Record<string, { label: string; color: string }> = {
    Available: { label: "Available", color: "bg-emerald-100 text-emerald-800" },
    Fresh: { label: "Fresh listing", color: "bg-blue-100 text-blue-800" },
    "Under offer": {
      label: "Under offer",
      color: "bg-amber-100 text-amber-800",
    },
    Booked: { label: "Booked / hold", color: "bg-red-100 text-red-800" },
  };
  const m = map[v] || { label: v, color: "bg-gray-100 text-gray-700" };
  return (
    <span
      className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${m.color}`}
    >
      {m.label}
    </span>
  );
};

const getFirstImage = (p: any): string => {
  const img = p.image?.[0];
  if (img && typeof img === "string" && img.trim()) return img;
  if (img && typeof img === "object" && img.url) return img.url;
  return "/images/property-tricity.jpg";
};

const getLocation = (p: any): string =>
  [p.location?.address, p.location?.sector, p.location?.city, p.location?.state]
    .filter(Boolean)
    .join(", ") || "—";

// ---------------------------------------------------------------------------
// Row definitions (grouped into sections)
// ---------------------------------------------------------------------------
const rows: RowConfig[] = [
  // ── Pricing ──
  {
    section: "Pricing & Status",
    label: "Listing status",
    key: "listingAvailability",
    icon: <IoMdCheckmarkCircleOutline className="w-4 h-4" />,
    fmt: availLabel,
  },
  {
    label: "Price (₹)",
    key: "price",
    icon: <DollarSign className="w-4 h-4" />,
    fmt: (p: any) => {
      const v = p.price;
      if (v == null) return "—";
      return (
        <span className="font-semibold text-slate-900">{formatInr(v)}</span>
      );
    },
  },
  {
    label: "Maintenance",
    key: "maintenanceCharge",
    icon: <DollarSign className="w-4 h-4" />,
    fmt: (p: any) =>
      p.maintenanceCharge != null
        ? `₹${p.maintenanceCharge.toLocaleString("en-IN")}/mo`
        : "—",
  },

  // ── Property Details ──
  {
    section: "Property Details",
    label: "Bedrooms (BHK)",
    key: "beds",
    icon: <FaBed className="w-3.5 h-3.5" />,
    fmt: (p: any) => p.facilities?.bedrooms ?? "—",
  },
  {
    label: "Bathrooms",
    key: "baths",
    icon: <FaBath className="w-3.5 h-3.5" />,
    fmt: (p: any) =>
      p.facilities?.bathrooms != null ? `${p.facilities.bathrooms}` : "—",
  },
  {
    label: "Balconies",
    key: "balconies",
    icon: <Home className="w-4 h-4" />,
    fmt: (p: any) =>
      p.facilities?.balconies != null ? `${p.facilities.balconies}` : "—",
  },
  {
    label: "Parking",
    key: "parking",
    icon: <FaCar className="w-3.5 h-3.5" />,
    fmt: (p: any) =>
      p.facilities?.parkings != null
        ? `${p.facilities.parkings} slot${p.facilities.parkings !== 1 ? "s" : ""}`
        : "—",
  },
  {
    label: "Area",
    key: "area",
    icon: <Maximize2 className="w-4 h-4" />,
    fmt: (p: any) =>
      p.area?.value != null
        ? `${p.area.value.toLocaleString("en-IN")} ${p.area.unit || "sqft"}`
        : "—",
  },
  {
    label: "Carpet Area",
    key: "carpetArea",
    icon: <Maximize2 className="w-4 h-4" />,
    fmt: (p: any) =>
      p.area?.carpetArea?.value != null
        ? `${p.area.carpetArea.value.toLocaleString("en-IN")} ${p.area.carpetArea.unit || p.area.unit || "sqft"}`
        : "—",
  },
  {
    label: "Super Built-up",
    key: "superBuiltUpArea",
    icon: <Maximize2 className="w-4 h-4" />,
    fmt: (p: any) =>
      p.area?.superBuiltUpArea?.value != null
        ? `${p.area.superBuiltUpArea.value.toLocaleString("en-IN")} ${p.area.superBuiltUpArea.unit || p.area.unit || "sqft"}`
        : "—",
  },
  {
    label: "Construction",
    key: "constructionStatus",
    icon: <CalendarClock className="w-4 h-4" />,
    fmt: (p: any) => {
      if (p.availability !== "Under Construction") return "Ready to Move";
      const parts: string[] = [];
      if (p.constructionStatus?.percentageComplete != null)
        parts.push(`${p.constructionStatus.percentageComplete}%`);
      if (p.constructionStatus?.currentPhase)
        parts.push(p.constructionStatus.currentPhase);
      if (p.constructionStatus?.expectedOCDate)
        parts.push(
          `OC: ${new Date(p.constructionStatus.expectedOCDate).toLocaleDateString("en-IN")}`,
        );
      return parts.length ? parts.join(" · ") : "Under Construction";
    },
  },
  {
    label: "Floor",
    key: "floor",
    icon: <Building2 className="w-4 h-4" />,
    fmt: (p: any) =>
      p.floor != null ? `${p.floor}${getFloorSuffix(p.floor)} Floor` : "—",
  },
  {
    label: "Facing",
    key: "facing",
    icon: <GiSunrise className="w-4 h-4" />,
    fmt: (p: any) => p.facing || "—",
  },
  {
    label: "Furnishing",
    key: "furnishing",
    icon: <Home className="w-4 h-4" />,
    fmt: (p: any) => p.furnishing || "—",
  },
  {
    label: "Transaction Type",
    key: "transactionType",
    icon: <MdOutlineCompareArrows className="w-4 h-4" />,
    fmt: (p: any) => {
      const t = p.transactionType || p.deal;
      const colors: Record<string, string> = {
        Sale: "bg-purple-100 text-purple-800",
        Rent: "bg-teal-100 text-teal-800",
        Lease: "bg-indigo-100 text-indigo-800",
      };
      return t ? (
        <span
          className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${colors[t] || "bg-gray-100 text-gray-700"}`}
        >
          {t}
        </span>
      ) : (
        "—"
      );
    },
  },
  {
    label: "Possession",
    key: "possession",
    icon: <CalendarClock className="w-4 h-4" />,
    fmt: (p: any) => {
      if (p.availability) return p.availability;
      if (p.possessionDate) {
        const d = new Date(p.possessionDate);
        return d instanceof Date && !isNaN(d.getTime())
          ? d.toLocaleDateString("en-IN", { year: "numeric", month: "short" })
          : p.possessionDate;
      }
      return "—";
    },
  },

  // ── Location ──
  {
    section: "Location",
    label: "Address",
    key: "loc",
    icon: <FaMapMarkerAlt className="w-3.5 h-3.5" />,
    fmt: (p: any) => {
      const loc = [
        p.location?.address,
        p.location?.sector,
        p.location?.city,
        p.location?.state,
      ]
        .filter(Boolean)
        .join(", ");
      return loc || "—";
    },
  },
];

function getFloorSuffix(n: number): string {
  if (n === 1) return "st";
  if (n === 2) return "nd";
  if (n === 3) return "rd";
  return "th";
}

function isDifferent(data: any[], rowKey: string, colIdx: number): boolean {
  if (!data || data.length < 2) return false;
  const values = data.map((p: any) => {
    // Extract the value for this row
    const row = rows.find((r) => r.key === rowKey);
    if (!row) return null;
    const raw = getNestedValue(p, rowKey);
    return raw;
  });
  const thisVal = values[colIdx];
  return values.some((v) => v !== thisVal);
}

function getNestedValue(obj: any, key: string): any {
  // Handle special compound keys
  if (key === "beds") return obj.facilities?.bedrooms ?? null;
  if (key === "baths") return obj.facilities?.bathrooms ?? null;
  if (key === "balconies") return obj.facilities?.balconies ?? null;
  if (key === "parking") return obj.facilities?.parkings ?? null;
  if (key === "area") return obj.area?.value ?? null;
  if (key === "loc") return getLocation(obj);
  if (key === "possession")
    return obj.availability || obj.possessionDate || null;
  if (key === "transactionType") return obj.transactionType || obj.deal || null;
  if (key === "listingAvailability")
    return obj.listingAvailability || obj.availability || "Available";
  return obj[key] ?? null;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function ComparePageClient() {
  const [ids, setIds] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Read compare IDs from sessionStorage only on the client (after hydration)
  useEffect(() => {
    setIds(getCompareIds());
    setHydrated(true);
  }, []);

  // Listen for compare changes (e.g. remove from card)
  useEffect(() => {
    if (!hydrated) return;
    const sync = () => setIds(getCompareIds());
    window.addEventListener("pb-compare-changed", sync);
    return () => window.removeEventListener("pb-compare-changed", sync);
  }, [hydrated]);

  const idsCsv = ids.join(",");
  const { data, isLoading, isError } = useGetComparePropertiesQuery(idsCsv, {
    skip: ids.length < 2,
  });
  const errorToasted = useRef(false);

  useEffect(() => {
    if (isError && ids.length >= 2 && !errorToasted.current) {
      errorToasted.current = true;
      toast.error("Could not load listings for comparison.");
    }
    if (!isError) errorToasted.current = false;
  }, [isError, ids.length]);

  const handleRemove = (id: string) => {
    const next = toggleCompareId(id);
    setIds(next);
    if (next.length === 0) {
      window.dispatchEvent(new Event("pb-compare-changed"));
    }
  };

  // Show nothing during SSR to avoid hydration mismatch.
  // After first client render show empty state, loading, or compare view.
  if (!hydrated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pt-28 pb-20 px-4" />
    );
  }

  // ── Empty state ──
  if (ids.length < 2) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pt-28 pb-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8 flex justify-center">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-indigo-100 to-blue-100 flex items-center justify-center shadow-inner">
              <MdOutlineCompareArrows className="w-12 h-12 text-indigo-500" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-3">
            Compare Properties
          </h1>
          <p className="text-slate-600 text-lg mb-8 max-w-md mx-auto leading-relaxed">
            Add at least two properties to start comparing them side by side.
          </p>
          <Link
            href="/properties/chandigarh"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:from-indigo-700 hover:to-blue-700 transition-all duration-200"
          >
            <Building2 className="w-5 h-5" />
            Browse properties
          </Link>
          <p className="mt-6 text-sm text-slate-400">
            Use the compare icon{" "}
            <MdOutlineCompareArrows className="inline w-4 h-4 text-indigo-400" />{" "}
            on any property card
          </p>
        </div>
      </div>
    );
  }

  // ── Loading state ──
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pt-28 pb-20 px-4">
        <div className="max-w-[1200px] mx-auto">
          <SkeletonHeader />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {ids.map((id) => (
              <SkeletonColumn key={id} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── Error state ──
  if (isError || !data?.length) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pt-28 pb-20 px-4">
        <div className="max-w-lg mx-auto text-center">
          <div className="mb-6 flex justify-center">
            <div className="w-20 h-20 rounded-2xl bg-red-50 flex items-center justify-center shadow-inner">
              <X className="w-10 h-10 text-red-400" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-3">
            Could not load comparison
          </h2>
          <p className="text-slate-600 mb-6">
            Something went wrong while loading these listings. Please try again.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2.5 bg-slate-800 text-white font-medium rounded-xl hover:bg-slate-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // ── Main compare view ──
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 pt-24 pb-20">
      <div className="max-w-[1200px] mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 flex items-center gap-3">
              <MdOutlineCompareArrows className="w-7 h-7 text-indigo-600" />
              Compare Properties
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Comparing {data.length} property{data.length > 1 ? "ies" : ""}
            </p>
          </div>
          <Link
            href="/properties/chandigarh"
            className="text-sm text-indigo-600 hover:text-indigo-800 font-medium underline-offset-2 hover:underline transition-colors"
          >
            Add more
          </Link>
        </div>

        {/* Comparison Grid */}
        <div className="overflow-x-auto pb-4">
          <div className="flex gap-4 min-w-[700px]">
            {/* Property Columns */}
            {data.map((property: any, colIdx: number) => (
              <div
                key={property._id}
                className="flex-1 min-w-[200px] bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden animate-in fade-in-5"
                style={{ animationDelay: `${colIdx * 80}ms` }}
              >
                {/* Property Image */}
                <div className="relative h-40 md:h-48 bg-slate-100 group">
                  <Image
                    src={getFirstImage(property)}
                    alt={property.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

                  {/* Remove button */}
                  <button
                    onClick={() => handleRemove(property._id)}
                    className="absolute top-2 right-2 z-10 w-8 h-8 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow-sm hover:shadow-md transition-all opacity-0 group-hover:opacity-100"
                    title="Remove from comparison"
                  >
                    <FaTimes className="w-3.5 h-3.5 text-slate-700" />
                  </button>

                  {/* Price overlay */}
                  <div className="absolute bottom-2 left-3 right-3">
                    <p className="text-white font-bold text-lg drop-shadow-sm">
                      {property.price != null ? formatInr(property.price) : "—"}
                    </p>
                  </div>
                </div>

                {/* Property Title */}
                <div className="px-4 pt-3 pb-2">
                  <Link
                    href={`/property/${property.slug || property._id}`}
                    className="text-sm font-semibold text-slate-800 hover:text-indigo-600 line-clamp-2 transition-colors"
                  >
                    {property.title}
                  </Link>
                  <p className="text-xs text-slate-500 mt-0.5 truncate">
                    {getLocation(property)}
                  </p>
                </div>

                {/* Quick Stats */}
                <div className="px-4 pb-3 flex flex-wrap gap-2 border-b border-slate-100">
                  {property.facilities?.bedrooms > 0 && (
                    <span className="inline-flex items-center gap-1 text-xs bg-slate-50 text-slate-700 px-2 py-1 rounded-md">
                      <FaBed className="w-3 h-3" />{" "}
                      {property.facilities.bedrooms} BHK
                    </span>
                  )}
                  {property.facilities?.bathrooms > 0 && (
                    <span className="inline-flex items-center gap-1 text-xs bg-slate-50 text-slate-700 px-2 py-1 rounded-md">
                      <FaBath className="w-3 h-3" />{" "}
                      {property.facilities.bathrooms}
                    </span>
                  )}
                  {property.area?.value > 0 && (
                    <span className="inline-flex items-center gap-1 text-xs bg-slate-50 text-slate-700 px-2 py-1 rounded-md">
                      <Maximize2 className="w-3 h-3" />{" "}
                      {property.area.value.toLocaleString("en-IN")}{" "}
                      {property.area.unit || "sqft"}
                    </span>
                  )}
                </div>

                {/* Detail Rows */}
                <div className="px-4 pb-4">
                  {renderPropertyDetails(property, data, colIdx)}
                </div>

                {/* View Details CTA */}
                <div className="px-4 pb-4">
                  <Link
                    href={`/property/${property.slug || property._id}`}
                    className="block w-full text-center text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 py-2.5 rounded-xl transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="mt-8 text-center text-xs text-slate-400">
          <p>Hover over a property to remove it from comparison</p>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Detail rows rendered inside each column
// ---------------------------------------------------------------------------
function renderPropertyDetails(property: any, allData: any[], colIdx: number) {
  let currentSection = "";

  return (
    <div className="space-y-0 divide-y divide-slate-50">
      {rows.map((row) => {
        const showSectionHeader = row.section && row.section !== currentSection;
        if (row.section) currentSection = row.section;

        const value = row.fmt(property);
        const diff = isDifferent(allData, row.key, colIdx);

        return (
          <div key={row.key}>
            {showSectionHeader && (
              <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 pt-4 pb-1.5">
                {row.section}
              </div>
            )}
            <div className="py-1.5">
              <div className="flex items-center gap-1.5 mb-0.5">
                {row.icon && (
                  <span className="text-slate-400 flex-shrink-0">
                    {row.icon}
                  </span>
                )}
                <span className="text-[11px] text-slate-500">{row.label}</span>
              </div>
              <div
                className={`text-xs font-medium ${
                  diff ? "text-indigo-700" : "text-slate-800"
                }`}
              >
                {value}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Skeleton components
// ---------------------------------------------------------------------------
function SkeletonHeader() {
  return (
    <div className="mb-8 animate-pulse">
      <div className="h-8 w-56 bg-slate-200 rounded-lg mb-2" />
      <div className="h-4 w-36 bg-slate-100 rounded" />
    </div>
  );
}

function SkeletonColumn() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden animate-pulse">
      <div className="h-40 bg-slate-200" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-slate-200 rounded w-3/4" />
        <div className="h-3 bg-slate-100 rounded w-1/2" />
        <div className="flex gap-2 mt-3">
          <div className="h-6 w-14 bg-slate-100 rounded-md" />
          <div className="h-6 w-14 bg-slate-100 rounded-md" />
        </div>
        <div className="space-y-2 mt-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-3 bg-slate-100 rounded w-full" />
          ))}
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useRef } from "react";
import { useGetComparePropertiesQuery } from "@/services/propertiesApi";
import Link from "next/link";
import { getCompareIds } from "@/lib/compareStorage";
import { toast } from "@/hooks/use-toast";

export default function ComparePageClient() {
  const ids = getCompareIds();
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

  if (ids.length < 2) {
    return (
      <div className="pt-24 max-w-3xl mx-auto px-4 py-16 text-center text-gray-600">
        <p className="mb-4">Add at least two properties from listing cards using the compare control.</p>
        <Link href="/properties/chandigarh" className="text-[#4161df] font-semibold">
          Browse properties
        </Link>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="pt-24 flex justify-center py-20 text-gray-600">
        Loading comparison…
      </div>
    );
  }

  if (isError || !data?.length) {
    return (
      <div className="pt-24 text-center py-20 text-red-600">
        Could not load properties for comparison.
      </div>
    );
  }

  const availLabel = (p: any) => {
    const v = p.listingAvailability || "Available";
    const map: Record<string, string> = {
      Available: "Available",
      Fresh: "Fresh listing",
      "Under offer": "Under offer",
      Booked: "Booked / hold",
    };
    return map[v] || v;
  };

  const rows = [
    {
      label: "Listing status",
      key: "listingAvailability",
      fmt: availLabel,
    },
    { label: "Price (₹)", key: "price", fmt: (p: any) => p.price?.toLocaleString("en-IN") },
    {
      label: "Area",
      key: "area",
      fmt: (p: any) =>
        p.area?.value != null ? `${p.area.value} ${p.area.unit || ""}` : "—",
    },
    {
      label: "Floor",
      key: "floor",
      fmt: (p: any) => (p.floor != null ? String(p.floor) : "—"),
    },
    { label: "Facing", key: "facing", fmt: (p: any) => p.facing || "—" },
    {
      label: "Maintenance",
      key: "maintenanceCharge",
      fmt: (p: any) =>
        p.maintenanceCharge != null
          ? `₹${p.maintenanceCharge.toLocaleString("en-IN")}/mo`
          : "—",
    },
    {
      label: "BHK",
      key: "beds",
      fmt: (p: any) => p.facilities?.bedrooms ?? "—",
    },
    {
      label: "City / address",
      key: "loc",
      fmt: (p: any) =>
        [p.location?.sector, p.location?.city].filter(Boolean).join(", ") ||
        p.location?.address ||
        "—",
    },
  ];

  return (
    <div className="pt-24 min-h-screen bg-gray-50 pb-20 px-4">
      <div className="max-w-[1100px] mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Compare listings</h1>
        <p className="text-sm text-gray-600 mb-6">
          Side-by-side view of selected properties. Up to four listings.
        </p>
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left p-3 font-semibold text-gray-700 w-36">
                  Detail
                </th>
                {data.map((p: any) => (
                  <th key={p._id} className="text-left p-3 font-semibold text-gray-900 min-w-[180px]">
                    <Link
                      href={`/property/${p._id}`}
                      className="text-[#4161df] hover:underline line-clamp-2"
                    >
                      {p.title}
                    </Link>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.key} className="border-b border-gray-50">
                  <td className="p-3 text-gray-500 font-medium">{row.label}</td>
                  {data.map((p: any) => (
                    <td key={p._id + row.key} className="p-3 text-gray-900">
                      {row.fmt(p)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

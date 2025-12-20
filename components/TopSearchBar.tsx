"use client";
import { useState, useEffect } from "react";
import { Slider } from "@/components/ui/slider";

const DEAL_OPTIONS = ["Sale", "Rent"];
const TYPE_OPTIONS = ["Residential", "Commercial"];
const CATEGORY_OPTIONS = [
  "Apartment/Flat",
  "House/Villa",
  "Land/Plot",
  "Retail",
  "Office",
  "Industrial",
  "Warehouse",
  "Shop/Showroom",
];
const FURNISHING_OPTIONS = ["Furnished", "Semi Furnished", "Un-Furnished"];
const AVAILABILITY_OPTIONS = ["Ready to Move", "Under Construction"];
const POSTED_BY_OPTIONS = ["Owner", "Agent", "Builder"];
const BEDROOMS_OPTIONS = [1, 2, 3, 4, 5, "5+"];

export default function TopSearchBar({ onApply, initialFilters = {} }: any) {
  const [filters, setFilters] = useState({
    deal: initialFilters.deal || "",
    type: initialFilters.type || "",
    propertyCategory: initialFilters.propertyCategory || "",
    priceMin: initialFilters.priceMin || 0,
    priceMax: initialFilters.priceMax || 100000000,
    areaMin: initialFilters.areaMin || 0,
    areaMax: initialFilters.areaMax || 100000,
    bedrooms: initialFilters.bedrooms || "",
    furnishing: initialFilters.furnishing || "",
    availability: initialFilters.availability || "",
    postedBy: initialFilters.postedBy || "",
    city: initialFilters.city || "",
  });

  useEffect(() => {
    const definedFilters = Object.fromEntries(
      Object.entries(initialFilters).filter(([_, v]) => v !== undefined && v !== null)
    );
    setFilters((prev) => ({ ...prev, ...definedFilters }));
  }, [initialFilters]);

  const clearFilters = () => {
    const cleared = {
      deal: "",
      type: "",
      propertyCategory: "",
      priceMin: 0,
      priceMax: 100000000,
      areaMin: 0,
      areaMax: 100000,
      bedrooms: "",
      furnishing: "",
      availability: "",
      postedBy: "",
      city: "",
    };
    setFilters(cleared);
    onApply({});
  };

  return (
    <div className="w-full bg-indigo-50/20 backdrop-blur-lg shadow-lg p-4 sm:p-6 rounded-3xl border border-gray-200 space-y-6">
      {/* HEADER */}
      <h2 className="text-xl font-bold text-indigo-900 tracking-tight flex items-center gap-2">
        Property Filters
      </h2>

      {/* FILTERS CONTAINER */}
      <div className="max-h-[18vh] overflow-y-auto sm:max-h-none p-3 bg-blue-50/60 rounded-xl border border-blue-100 shadow-inner">
        {/* GRID INPUTS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-8 gap-4">
          {[
            { label: "Deal Type", key: "deal", options: DEAL_OPTIONS },
            { label: "Property Type", key: "type", options: TYPE_OPTIONS },
            {
              label: "Category",
              key: "propertyCategory",
              options: CATEGORY_OPTIONS,
            },
            { label: "Bedrooms", key: "bedrooms", options: BEDROOMS_OPTIONS },
            {
              label: "Furnishing",
              key: "furnishing",
              options: FURNISHING_OPTIONS,
            },
            {
              label: "Availability",
              key: "availability",
              options: AVAILABILITY_OPTIONS,
            },
            { label: "Posted By", key: "postedBy", options: POSTED_BY_OPTIONS },
          ].map(({ label, key, options }) => (
            <div key={key} className="flex flex-col">
              <label className="text-xs font-semibold text-gray-600 mb-1">
                {label}
              </label>
              <select
                className="
              border border-gray-300 rounded-lg p-2 bg-white 
              focus:ring-2 focus:ring-blue-500 transition text-sm
            "
                value={(filters as any)[key]}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, [key]: e.target.value }))
                }
              >
                <option value="">Any</option>
                {options.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </div>
          ))}

          {/* City */}
          <div className="flex flex-col col-span-1 sm:col-span-2 md:col-span-1">
            <label className="text-xs font-semibold text-gray-700 mb-1">
              City
            </label>
            <input
              type="text"
              placeholder="Enter City"
              className="
            border border-gray-300 rounded-lg p-2 bg-white 
            focus:ring-2 focus:ring-blue-500 transition text-sm
          "
              value={filters.city}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, city: e.target.value }))
              }
            />
          </div>
        </div>

        {/* SLIDERS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* PRICE */}
          <div className="bg-white p-4 rounded-xl border shadow-sm">
            <div className="flex justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">
                Price Range
              </label>
              <span className="text-sm font-bold text-blue-700">
                ₹ {filters.priceMin.toLocaleString()} - ₹{" "}
                {filters.priceMax.toLocaleString()}
              </span>
            </div>
            <Slider
              min={0}
              max={100000000}
              step={100000}
              value={[filters.priceMin, filters.priceMax]}
              onValueChange={([min, max]) =>
                setFilters((prev) => ({
                  ...prev,
                  priceMin: min,
                  priceMax: max,
                }))
              }
            />
          </div>

          {/* AREA */}
          <div className="bg-white p-4 rounded-xl border shadow-sm">
            <div className="flex justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">
                Area (sqft)
              </label>
              <span className="text-sm font-bold text-blue-700">
                {filters.areaMin} - {filters.areaMax} sqft
              </span>
            </div>
            <Slider
              min={0}
              max={100000}
              step={100}
              value={[filters.areaMin, filters.areaMax]}
              onValueChange={([min, max]) =>
                setFilters((prev) => ({
                  ...prev,
                  areaMin: min,
                  areaMax: max,
                }))
              }
            />
          </div>
        </div>
      </div>

      {/* BUTTONS */}
      <div className="flex justify-end gap-2 sm:gap-3 pt-2">
        {/* Search */}
        <button
          className="
        px-4 py-1.5 text-sm sm:px-6 sm:py-2 sm:text-base
        rounded-xl bg-[#4161df] text-white font-semibold
        hover:bg-[#2b4fdd] active:scale-95 transition 
        shadow-md hover:shadow-lg
      "
          onClick={() => onApply(filters)}
        >
          Search
        </button>

        {/* Clear */}
        <button
          className="
        px-4 py-1.5 text-sm sm:px-6 sm:py-2 sm:text-base
        rounded-xl bg-gray-200 text-gray-800 font-semibold
        hover:bg-gray-300 active:scale-95 transition shadow-sm
      "
          onClick={clearFilters}
        >
          Clear
        </button>
      </div>
    </div>
  );
}

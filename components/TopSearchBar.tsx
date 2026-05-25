"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import {
  Search,
  RotateCcw,
  Home,
  Building2,
  MapPin,
  BedDouble,
  Armchair,
  Calendar,
  User,
  ChevronDown,
  ChevronUp,
  X,
  SlidersHorizontal,
  Bath,
  Car,
  Sun,
  Users,
  Shield,
  PawPrint,
  Building,
  CheckCircle,
  Layers,
} from "lucide-react";
import { parseSearchQuery, SearchFilters } from "@/components/SearchBar";

const DEAL_OPTIONS = ["Sale", "Rent"];
const SEARCH_DELAY = 400;
const TYPE_OPTIONS = [
  "Residential",
  "Commercial",
  "Industrial",
  "Agricultural",
];
const CATEGORY_OPTIONS = [
  "Apartment/Flat",
  "House/Villa",
  "Land/Plot",
  "PG/Hostel",
  "Farmhouse",
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
const BATHROOMS_OPTIONS = [1, 2, 3, 4, "5+"];
const BALCONIES_OPTIONS = [1, 2, "3+"];
const PARKINGS_OPTIONS = [1, 2, 3, "4+"];
const FACING_OPTIONS = [
  "North",
  "South",
  "East",
  "West",
  "North-East",
  "North-West",
  "South-East",
  "South-West",
];
const TENANT_PREFERENCE_OPTIONS = [
  "Family",
  "Bachelors",
  "Any",
  "Working Professionals",
];
const OWNERSHIP_TYPE_OPTIONS = [
  "Freehold",
  "Leasehold",
  "Co-operative",
  "Power of Attorney",
];
const PETS_OPTIONS = ["Yes", "No"];
const LISTING_AVAILABILITY_OPTIONS = [
  "Available",
  "Fresh",
  "Under offer",
  "Booked",
];

function buildSearchPayload(filters: Record<string, unknown>) {
  const out: Record<string, unknown> = {};
  for (const [key, val] of Object.entries(filters)) {
    if (val === "" || val === undefined || val === null) continue;
    if (key === "priceMin" && Number(val) === 0) continue;
    if (key === "priceMax" && Number(val) >= 1000000000) continue;
    if (key === "areaMin" && Number(val) === 0) continue;
    if (key === "areaMax" && Number(val) >= 100000) continue;
    out[key] = val;
  }
  return out;
}

export default function TopSearchBar({ onApply, initialFilters = {} }: any) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [searchInput, setSearchInput] = useState(initialFilters.search || "");
  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [filters, setFilters] = useState({
    search: initialFilters.search || "",
    deal: initialFilters.deal || "",
    type: initialFilters.type || "",
    propertyCategory: initialFilters.propertyCategory || "",
    priceMin: initialFilters.priceMin || 0,
    priceMax: initialFilters.priceMax || 1000000000,
    areaMin: initialFilters.areaMin || 0,
    areaMax: initialFilters.areaMax || 100000,
    bedrooms: initialFilters.bedrooms || "",
    bathrooms: initialFilters.bathrooms || "",
    balconies: initialFilters.balconies || "",
    parkings: initialFilters.parkings || "",
    furnishing: initialFilters.furnishing || "",
    availability: initialFilters.availability || "",
    postedBy: initialFilters.postedBy || "",
    facing: initialFilters.facing || "",
    tenantPreference: initialFilters.tenantPreference || "",
    ownershipType: initialFilters.ownershipType || "",
    petsAllowed: initialFilters.petsAllowed || "",
    floorMin: initialFilters.floorMin || "",
    floorMax: initialFilters.floorMax || "",
    totalFloors: initialFilters.totalFloors || "",
    builderName: initialFilters.builderName || "",
    projectName: initialFilters.projectName || "",
    listingAvailability: initialFilters.listingAvailability || "",
    isVerified: initialFilters.isVerified || "",
    city: initialFilters.city || "",
    sector: initialFilters.sector || "",
    bbox: initialFilters.bbox || "",
    polygon: initialFilters.polygon || "",
  });

  useEffect(() => {
    const definedFilters = Object.fromEntries(
      Object.entries(initialFilters).filter(
        ([_, v]) => v !== undefined && v !== null,
      ),
    );
    setFilters((prev) => ({ ...prev, ...definedFilters }));
  }, [initialFilters]);

  // Sync searchInput when initialFilters.search changes externally
  useEffect(() => {
    setSearchInput(initialFilters.search || "");
  }, [initialFilters.search]);

  // Debounced search – auto-apply after user stops typing
  const handleSearchChange = (value: string) => {
    setSearchInput(value);
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    searchTimerRef.current = setTimeout(() => {
      setFilters((prev) => ({ ...prev, search: value }));
    }, SEARCH_DELAY);
  };

  // Clear timer on unmount
  useEffect(() => {
    return () => {
      if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    };
  }, []);

  const clearFilters = () => {
    const cleared = {
      search: "",
      deal: "",
      type: "",
      propertyCategory: "",
      priceMin: 0,
      priceMax: 1000000000,
      areaMin: 0,
      areaMax: 100000,
      bedrooms: "",
      bathrooms: "",
      balconies: "",
      parkings: "",
      furnishing: "",
      availability: "",
      postedBy: "",
      facing: "",
      tenantPreference: "",
      ownershipType: "",
      petsAllowed: "",
      floorMin: "",
      floorMax: "",
      totalFloors: "",
      builderName: "",
      projectName: "",
      listingAvailability: "",
      isVerified: "",
      city: "",
      sector: "",
      bbox: "",
      polygon: "",
    };
    setSearchInput("");
    setFilters(cleared);
    onApply({});
  };

  const activeFiltersCount = Object.entries(filters).filter(([key, v]) => {
    if (key === "bbox" || key === "polygon")
      return typeof v === "string" && v.length > 0;
    return v !== "" && v !== 0 && v !== 1000000000 && v !== 100000;
  }).length;

  const formatPrice = (price: number) => {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(1)} Cr`;
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(1)} L`;
    }
    return `₹${price.toLocaleString("en-IN")}`;
  };

  return (
    <div className="w-full bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {/* HEADER - Mobile & Desktop */}
      <div className="px-4 py-2.5 border-b border-gray-100 bg-gray-50/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-[#4161df] rounded-lg flex items-center justify-center">
              <Search className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-gray-900">
                Search Properties
              </h2>
              <p className="text-[11px] text-gray-500 hidden sm:block">
                {activeFiltersCount > 0
                  ? `${activeFiltersCount} filter${activeFiltersCount > 1 ? "s" : ""} applied`
                  : "Apply filters to refine your search"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {activeFiltersCount > 0 && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                <span className="hidden sm:inline">Clear</span>
              </button>
            )}
            {/* Mobile Toggle Button */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="md:hidden flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-[#4161df] text-white rounded-md transition-colors"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Filters
              {activeFiltersCount > 0 && (
                <span className="ml-1 px-1.5 py-0.5 bg-white/20 rounded-full text-[10px]">
                  {activeFiltersCount}
                </span>
              )}
              {isExpanded ? (
                <ChevronUp className="w-3.5 h-3.5 ml-1" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5 ml-1" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* FILTERS CONTAINER */}
      <div className={`${isExpanded ? "block" : "hidden"} md:block p-4`}>
        {/* KEYWORD SEARCH BAR */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <Input
            placeholder="Search by property name, location, city, sector…"
            className="w-full h-10 pl-9 pr-9 text-sm bg-white border-gray-200 rounded-lg focus:ring-1 focus:ring-[#4161df]/20 focus:border-[#4161df]"
            value={searchInput}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
          {searchInput && (
            <button
              type="button"
              onClick={() => {
                setSearchInput("");
                setFilters((prev) => ({ ...prev, search: "" }));
              }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-3.5 h-3.5 text-gray-400" />
            </button>
          )}
        </div>

        {/* PRIMARY FILTERS ROW */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-2.5 mb-4">
          {/* Deal Type */}
          <FilterSelect
            icon={<Home className="w-4 h-4" />}
            label="Deal Type"
            value={filters.deal}
            options={DEAL_OPTIONS}
            onChange={(v) => setFilters((prev) => ({ ...prev, deal: v }))}
          />

          {/* Property Type */}
          <FilterSelect
            icon={<Building2 className="w-4 h-4" />}
            label="Property Type"
            value={filters.type}
            options={TYPE_OPTIONS}
            onChange={(v) => setFilters((prev) => ({ ...prev, type: v }))}
          />

          {/* Category */}
          <FilterSelect
            icon={<Building2 className="w-4 h-4" />}
            label="Category"
            value={filters.propertyCategory}
            options={CATEGORY_OPTIONS}
            onChange={(v) =>
              setFilters((prev) => ({ ...prev, propertyCategory: v }))
            }
          />

          {/* Bedrooms */}
          <FilterSelect
            icon={<BedDouble className="w-4 h-4" />}
            label="Bedrooms"
            value={filters.bedrooms?.toString()}
            options={BEDROOMS_OPTIONS.map((b) => b.toString())}
            onChange={(v) => setFilters((prev) => ({ ...prev, bedrooms: v }))}
          />

          {/* Bathrooms */}
          <FilterSelect
            icon={<Bath className="w-4 h-4" />}
            label="Bathrooms"
            value={filters.bathrooms?.toString()}
            options={BATHROOMS_OPTIONS.map((b) => b.toString())}
            onChange={(v) => setFilters((prev) => ({ ...prev, bathrooms: v }))}
          />

          {/* Furnishing */}
          <FilterSelect
            icon={<Armchair className="w-4 h-4" />}
            label="Furnishing"
            value={filters.furnishing}
            options={FURNISHING_OPTIONS}
            onChange={(v) => setFilters((prev) => ({ ...prev, furnishing: v }))}
          />

          {/* Availability */}
          <FilterSelect
            icon={<Calendar className="w-4 h-4" />}
            label="Availability"
            value={filters.availability}
            options={AVAILABILITY_OPTIONS}
            onChange={(v) =>
              setFilters((prev) => ({ ...prev, availability: v }))
            }
          />
        </div>

        {/* SECONDARY FILTERS ROW */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-2.5 mb-4">
          {/* Posted By */}
          <FilterSelect
            icon={<User className="w-4 h-4" />}
            label="Posted By"
            value={filters.postedBy}
            options={POSTED_BY_OPTIONS}
            onChange={(v) => setFilters((prev) => ({ ...prev, postedBy: v }))}
          />

          {/* Balconies */}
          <FilterSelect
            icon={<Home className="w-4 h-4" />}
            label="Balconies"
            value={filters.balconies?.toString()}
            options={BALCONIES_OPTIONS.map((b) => b.toString())}
            onChange={(v) => setFilters((prev) => ({ ...prev, balconies: v }))}
          />

          {/* Parkings */}
          <FilterSelect
            icon={<Car className="w-4 h-4" />}
            label="Parking"
            value={filters.parkings?.toString()}
            options={PARKINGS_OPTIONS.map((b) => b.toString())}
            onChange={(v) => setFilters((prev) => ({ ...prev, parkings: v }))}
          />

          {/* Facing */}
          <FilterSelect
            icon={<Sun className="w-4 h-4" />}
            label="Facing"
            value={filters.facing}
            options={FACING_OPTIONS}
            onChange={(v) => setFilters((prev) => ({ ...prev, facing: v }))}
          />

          {/* Tenant Preference */}
          <FilterSelect
            icon={<Users className="w-4 h-4" />}
            label="Tenant Preference"
            value={filters.tenantPreference}
            options={TENANT_PREFERENCE_OPTIONS}
            onChange={(v) =>
              setFilters((prev) => ({ ...prev, tenantPreference: v }))
            }
          />

          {/* Ownership Type */}
          <FilterSelect
            icon={<Shield className="w-4 h-4" />}
            label="Ownership"
            value={filters.ownershipType}
            options={OWNERSHIP_TYPE_OPTIONS}
            onChange={(v) =>
              setFilters((prev) => ({ ...prev, ownershipType: v }))
            }
          />
        </div>

        {/* LOCATION & RANGE FILTERS */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3 mb-4">
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-600 flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              Locality / sector
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Sector, locality"
                className="w-full h-8 px-2.5 py-1.5 text-xs bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-[#4161df]/20 focus:border-[#4161df] transition-all placeholder:text-gray-400"
                value={filters.sector}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, sector: e.target.value }))
                }
              />
              {filters.sector && (
                <button
                  type="button"
                  onClick={() =>
                    setFilters((prev) => ({ ...prev, sector: "" }))
                  }
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 p-0.5 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-3 h-3 text-gray-400" />
                </button>
              )}
            </div>
          </div>

          {/* City Input */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-600 flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              City
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Enter city"
                className="w-full h-8 px-2.5 py-1.5 text-xs bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-[#4161df]/20 focus:border-[#4161df] transition-all placeholder:text-gray-400"
                value={filters.city}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, city: e.target.value }))
                }
              />
              {filters.city && (
                <button
                  onClick={() => setFilters((prev) => ({ ...prev, city: "" }))}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 p-0.5 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-3 h-3 text-gray-400" />
                </button>
              )}
            </div>
          </div>

          {/* Price Range */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-600">
              Price Range
            </label>
            <div className="h-8 px-2.5 py-1.5 bg-white border border-gray-200 rounded-md flex items-center">
              <span className="text-xs text-gray-900 font-medium">
                {formatPrice(filters.priceMin)} -{" "}
                {formatPrice(filters.priceMax)}
              </span>
            </div>
            <div className="px-1 -mt-0.5">
              <Slider
                min={0}
                max={1000000000}
                step={100000}
                value={[filters.priceMin, filters.priceMax]}
                onValueChange={([min, max]) =>
                  setFilters((prev) => ({
                    ...prev,
                    priceMin: min,
                    priceMax: max,
                  }))
                }
                className="[&_[role=slider]]:h-3.5 [&_[role=slider]]:w-3.5 [&_[role=slider]]:bg-[#4161df] [&_[role=slider]]:border-2 [&_[role=slider]]:border-white [&_[role=slider]]:shadow-sm [&_[role=slider]]:cursor-pointer"
              />
            </div>
          </div>

          {/* Area Range */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-600">
              Area (sq.ft.)
            </label>
            <div className="h-8 px-2.5 py-1.5 bg-white border border-gray-200 rounded-md flex items-center">
              <span className="text-xs text-gray-900 font-medium">
                {filters.areaMin.toLocaleString("en-IN")} -{" "}
                {filters.areaMax.toLocaleString("en-IN")} sq.ft.
              </span>
            </div>
            <div className="px-1 -mt-0.5">
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
                className="[&_[role=slider]]:h-3.5 [&_[role=slider]]:w-3.5 [&_[role=slider]]:bg-[#4161df] [&_[role=slider]]:border-2 [&_[role=slider]]:border-white [&_[role=slider]]:shadow-sm [&_[role=slider]]:cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* MAP FILTER INDICATOR */}
        {(filters.bbox || filters.polygon) && (
          <div className="flex flex-wrap items-center gap-2 px-1 py-2 border-t border-dashed border-gray-100">
            <span className="text-[11px] font-medium text-[#4161df] bg-[#4161df]/10 rounded-md px-2 py-1">
              Map area filter active
            </span>
            <button
              type="button"
              className="text-[11px] font-semibold text-gray-600 hover:text-gray-900 underline"
              onClick={() => {
                const next = {
                  ...filters,
                  bbox: "",
                  polygon: "",
                };
                setFilters(next);
                onApply(buildSearchPayload(next));
              }}
            >
              Clear map filter only
            </button>
          </div>
        )}

        {/* ADVANCED FILTERS TOGGLE */}
        <div className="mt-3 pt-3 border-t border-gray-100">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-gray-700 transition-colors"
          >
            <Layers className="w-3.5 h-3.5" />
            {showAdvanced ? "Hide" : "Show"} Advanced Filters
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform duration-150 ${
                showAdvanced ? "rotate-180" : ""
              }`}
            />
          </button>

          {showAdvanced && (
            <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-2.5">
              {/* Pets Allowed */}
              <FilterSelect
                icon={<PawPrint className="w-4 h-4" />}
                label="Pets Allowed"
                value={filters.petsAllowed}
                options={PETS_OPTIONS}
                onChange={(v) =>
                  setFilters((prev) => ({ ...prev, petsAllowed: v }))
                }
              />

              {/* Listing Availability */}
              <FilterSelect
                icon={<CheckCircle className="w-4 h-4" />}
                label="Listing Status"
                value={filters.listingAvailability}
                options={LISTING_AVAILABILITY_OPTIONS}
                onChange={(v) =>
                  setFilters((prev) => ({ ...prev, listingAvailability: v }))
                }
              />

              {/* Verified Only */}
              <FilterSelect
                icon={<Shield className="w-4 h-4" />}
                label="Verified Only"
                value={filters.isVerified}
                options={["Yes", "No"]}
                onChange={(v) => {
                  const val = v === "Yes" ? "true" : v === "No" ? "false" : "";
                  setFilters((prev) => ({ ...prev, isVerified: val }));
                }}
              />

              {/* Builder Name */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-600 flex items-center gap-1">
                  <Building className="w-3 h-3" />
                  Builder Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Builder name"
                    className="w-full h-8 px-2.5 py-1.5 text-xs bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-[#4161df]/20 focus:border-[#4161df] transition-all placeholder:text-gray-400"
                    value={filters.builderName}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        builderName: e.target.value,
                      }))
                    }
                  />
                  {filters.builderName && (
                    <button
                      type="button"
                      onClick={() =>
                        setFilters((prev) => ({ ...prev, builderName: "" }))
                      }
                      className="absolute right-1.5 top-1/2 -translate-y-1/2 p-0.5 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <X className="w-3 h-3 text-gray-400" />
                    </button>
                  )}
                </div>
              </div>

              {/* Project Name */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-600 flex items-center gap-1">
                  <Building2 className="w-3 h-3" />
                  Project Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Project name"
                    className="w-full h-8 px-2.5 py-1.5 text-xs bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-[#4161df]/20 focus:border-[#4161df] transition-all placeholder:text-gray-400"
                    value={filters.projectName}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        projectName: e.target.value,
                      }))
                    }
                  />
                  {filters.projectName && (
                    <button
                      type="button"
                      onClick={() =>
                        setFilters((prev) => ({ ...prev, projectName: "" }))
                      }
                      className="absolute right-1.5 top-1/2 -translate-y-1/2 p-0.5 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <X className="w-3 h-3 text-gray-400" />
                    </button>
                  )}
                </div>
              </div>

              {/* Floor Range */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-600 flex items-center gap-1">
                  <Layers className="w-3 h-3" />
                  Floor Range
                </label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    min={0}
                    placeholder="Min"
                    className="w-full h-8 px-2 py-1.5 text-xs bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-[#4161df]/20 focus:border-[#4161df] transition-all placeholder:text-gray-400"
                    value={filters.floorMin}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        floorMin: e.target.value,
                      }))
                    }
                  />
                  <span className="text-gray-400 text-xs">-</span>
                  <input
                    type="number"
                    min={0}
                    placeholder="Max"
                    className="w-full h-8 px-2 py-1.5 text-xs bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-[#4161df]/20 focus:border-[#4161df] transition-all placeholder:text-gray-400"
                    value={filters.floorMax}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        floorMax: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 mt-4 pt-3 border-t border-gray-100">
          <Button
            variant="outline"
            onClick={clearFilters}
            className="h-9 sm:h-8 px-4 text-xs font-medium border-gray-300 hover:bg-gray-50 hover:border-gray-400 w-full sm:w-auto"
          >
            <RotateCcw className="w-3.5 h-3.5 sm:hidden mr-1.5" />
            Reset
          </Button>
          <Button
            onClick={() => {
              // ── NL parse the search text and merge extracted fields ──
              const nl = parseSearchQuery(searchInput);
              const merged = {
                ...buildSearchPayload(filters),
                // Override with NL parsed values if they exist
                ...(nl.bedrooms != null && { bedrooms: String(nl.bedrooms) }),
                ...(nl.deal && { deal: nl.deal }),
                ...(nl.city && { city: nl.city }),
                ...(nl.maxPrice != null && {
                  priceMax: String(nl.maxPrice),
                  maxPrice: String(nl.maxPrice),
                }),
                ...(nl.propertyCategory && {
                  propertyCategory: nl.propertyCategory,
                }),
                ...(nl.landmark && { landmark: nl.landmark }),
                // Update search to the auto-corrected query
                ...(nl.query && { search: nl.query }),
              };
              onApply(merged);
              setIsExpanded(false);
            }}
            className="h-9 sm:h-8 px-5 text-xs font-medium bg-[#4161df] hover:bg-[#3451c9] text-white w-full sm:w-auto"
          >
            <Search className="w-3.5 h-3.5 mr-1.5" />
            Search Properties
          </Button>
        </div>
      </div>
    </div>
  );
}

// Professional Filter Select Component
function FilterSelect({
  icon,
  label,
  value,
  options,
  onChange,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const displayValue =
    value === "true" ? "Yes" : value === "false" ? "No" : value;

  return (
    <div className="space-y-1">
      <label className="text-xs font-medium text-gray-600 flex items-center gap-1">
        {icon}
        {label}
      </label>
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full h-8 px-2.5 py-1.5 text-xs text-left rounded-md border transition-all flex items-center justify-between ${
            value
              ? "bg-[#4161df]/5 border-[#4161df]/30 text-[#4161df] font-medium"
              : "bg-white border-gray-200 text-gray-700 hover:border-gray-300"
          }`}
        >
          <span className="truncate">{displayValue || "Select"}</span>
          <ChevronDown
            className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-150 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* Dropdown */}
        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsOpen(false)}
            />
            <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-md border border-gray-200 shadow-lg z-20 overflow-hidden">
              <div className="max-h-40 overflow-y-auto py-0.5">
                <button
                  onClick={() => {
                    onChange("");
                    setIsOpen(false);
                  }}
                  className={`w-full px-2.5 py-1.5 text-left text-xs hover:bg-gray-50 transition-colors ${
                    !value
                      ? "bg-[#4161df]/5 text-[#4161df] font-medium"
                      : "text-gray-600"
                  }`}
                >
                  Any
                </button>
                {options.map((option) => (
                  <button
                    key={option}
                    onClick={() => {
                      onChange(option);
                      setIsOpen(false);
                    }}
                    className={`w-full px-2.5 py-1.5 text-left text-xs hover:bg-gray-50 transition-colors ${
                      displayValue === option
                        ? "bg-[#4161df]/5 text-[#4161df] font-medium"
                        : "text-gray-600"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

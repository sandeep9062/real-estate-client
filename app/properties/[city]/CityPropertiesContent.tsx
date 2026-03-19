"use client";
import React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useGetAllPropertiesQuery } from "../../../services/propertiesApi";
import SearchResults from "@/components/SearchResults";
import PropertyGrid from "@/components/PropertyGrid";
import { PuffLoader } from "react-spinners";
import TopSearchBar from "@/components/TopSearchBar";

const cityMap: Record<string, string> = {
  chandigarh: "Chandigarh",
  mohali: "Mohali",
  panchkula: "Panchkula",
  kharar: "Kharar",
  zirakpur: "Zirakpur",
};

const CityPropertiesContent = ({ city }: { city: string }) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const handleApplyFilters = (filters: any) => {
    const params = new URLSearchParams();
    params.set("city", city); // Always include the city
    for (const key in filters) {
      if (filters[key] != null && filters[key] !== "") {
        params.set(key, filters[key]);
      }
    }
    router.push(`/properties/${city}?${params.toString()}`);
  };

  // Construct query object from URL params, always include city
  const query = React.useMemo(() => {
    const params: { [key: string]: string } = {
      city: city,
    };
    searchParams.forEach((value, key) => {
      params[key] = value;
    });
    return params;
  }, [searchParams, city]);

  const { data, isError, isLoading } = useGetAllPropertiesQuery(query);

  if (isError) {
    return (
      <div className="w-full flex justify-center items-center py-20">
        <span className="text-red-500 font-medium">
          Error while fetching data
        </span>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="w-full flex justify-center items-center h-[60vh]">
        <PuffLoader size={80} aria-label="puff-loading" />
      </div>
    );
  }

  const displayCity = cityMap[city] || "Tricity";

  return (
    <div className="w-full bg-gray-50">
      <div className="flex flex-col items-center gap-8 max-w-full mx-auto px-10 py-12">
        <div className="w-full text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Find Your Perfect Property in {displayCity}
          </h1>
          <p className="text-lg text-gray-600">
            Discover homes, apartments, and commercial spaces for sale and rent
            in {displayCity}.
          </p>
        </div>
        <div className="w-full">
          <TopSearchBar onApply={handleApplyFilters} initialFilters={query} />
        </div>
        {/* Properties Listing */}
        {Object.keys(query).length > 1 ? ( // More than city
          <SearchResults query={query as any} />
        ) : (
          <PropertyGrid properties={data || []} />
        )}
      </div>
    </div>
  );
};

export default CityPropertiesContent;

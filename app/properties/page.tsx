"use client";
import React, { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useGetAllPropertiesQuery } from "../../services/propertiesApi";
import SearchResults from "@/components/SearchResults";
import PropertyGrid from "@/components/PropertyGrid";
import { PuffLoader } from "react-spinners";
import TopSearchBar from "@/components/TopSearchBar";

const PropertiesContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const handleApplyFilters = (filters: any) => {
    const params = new URLSearchParams();
    for (const key in filters) {
      if (filters[key] != null && filters[key] !== "") {
        params.set(key, filters[key]);
      }
    }
    router.push(`/properties?${params.toString()}`);
  };

  // Construct query object from URL params
  const query = React.useMemo(() => {
    const params: { [key: string]: string } = {};
    searchParams.forEach((value, key) => {
      params[key] = value;
    });
    return params;
  }, [searchParams]);

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

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <div className="flex flex-col items-center gap-4 sm:gap-6 lg:gap-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-8 lg:py-12">
        {/* Header Section */}
        <div className="w-full text-center">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2 sm:mb-3 lg:mb-4">
            Find Your Perfect Property in Tricity
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto">
            Discover homes, apartments, and commercial spaces for sale and rent
            in Chandigarh, Panchkula, Mohali & more.
          </p>
        </div>

        {/* Search Bar */}
        <div className="w-full max-w-5xl">
          <TopSearchBar onApply={handleApplyFilters} initialFilters={query} />
        </div>

        {/* Properties Listing */}
        {Object.keys(query).length > 0 ? (
          <SearchResults query={query as any} />
        ) : (
          <PropertyGrid properties={data || []} />
        )}
      </div>
    </div>
  );
};

const Properties = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <PropertiesContent />
  </Suspense>
);

export default Properties;

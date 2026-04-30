"use client";
import React, { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useGetAllPropertiesQuery } from "../../services/propertiesApi";
import SearchResults from "@/components/SearchResults";
import PropertyGrid from "@/components/PropertyGrid";
import PropertyGridSkeleton from "@/components/PropertyGridSkeleton";
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
      <div className="w-full pt-20 bg-gray-50">
        <div className="flex flex-col items-center gap-6 max-w-full mx-auto px-4 sm:px-6 md:px-10 py-8">
          <div className="h-8 w-2/3 max-w-lg animate-pulse rounded-lg bg-slate-200" />
          <div className="h-12 w-full max-w-3xl animate-pulse rounded-xl bg-slate-200" />
          <PropertyGridSkeleton count={9} columns="three" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full pt-20 bg-gray-50">
      <div className="flex flex-col items-center gap-4 sm:gap-6 md:gap-8 max-w-full mx-auto px-4 sm:px-6 md:px-10 py-6 sm:py-8 md:py-12">
        <div className="w-full text-center">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2 sm:mb-3 md:mb-4">
            Find Your Perfect Property in Tricity
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 px-2">
            Discover homes, apartments, and commercial spaces for sale and rent
            in Chandigarh, Panchkula, Mohali & more.
          </p>
        </div>
        <div className="w-full">
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

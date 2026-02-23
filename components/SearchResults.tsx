"use client";

import { useGetAllPropertiesQuery } from "@/services/propertiesApi";
import PropertyGrid from "./PropertyGrid";

interface SearchResultsProps {
  query: { [key: string]: string };
}

export default function SearchResults({ query }: SearchResultsProps) {
  const { data, isLoading, isError } = useGetAllPropertiesQuery(query);

  if (!query || Object.keys(query).length === 0) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="w-full">
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="text-xl font-semibold">Searching for “{query.search || ''}”</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-40 w-full rounded-lg bg-gray-200" />
              <div className="mt-3 h-4 w-1/2 rounded bg-gray-200" />
              <div className="mt-2 h-3 w-2/3 rounded bg-gray-200" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full flex justify-center items-center py-12 text-red-500">
        Failed to load results.
      </div>
    );
  }

  const results = data || [];

  const generateQueryString = (query: { [key: string]: string }) => {
    const descriptions = [];
    if (query.deal) descriptions.push(`Deal: ${query.deal}`);
    if (query.type) descriptions.push(`Type: ${query.type}`);
    if (query.propertyCategory) descriptions.push(`Category: ${query.propertyCategory}`);
    if (query.city) descriptions.push(`City: ${query.city}`);
    if (query.bedrooms) descriptions.push(`Bedrooms: ${query.bedrooms}`);
    if (query.furnishing) descriptions.push(`Furnishing: ${query.furnishing}`);
    if (query.availability) descriptions.push(`Availability: ${query.availability}`);
    if (query.postedBy) descriptions.push(`Posted By: ${query.postedBy}`);
    if (query.priceMin && query.priceMax) {
      descriptions.push(`Price: ₹${query.priceMin} - ₹${query.priceMax}`);
    }
    if (query.areaMin && query.areaMax) {
      descriptions.push(`Area: ${query.areaMin} - ${query.areaMax} sqft`);
    }
    return descriptions.join(', ');
  };

  return (
    <div className="w-full">
      <div className="flex items-baseline justify-between mb-4">
        <h2 className="text-xl font-semibold">Results for “{generateQueryString(query) || 'All Properties'}”</h2>
        <span className="text-sm text-gray-500">{results.length} found</span>
      </div>
      <PropertyGrid properties={results} />
    </div>
  );
}

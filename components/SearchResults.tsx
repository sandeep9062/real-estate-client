"use client";

import React from "react";
import { useInfiniteProperties } from "../hooks/useInfiniteProperties";
import PropertyGrid, { type PropertyGridColumns } from "./PropertyGrid";
import PropertyGridSkeleton from "./PropertyGridSkeleton";
import InfiniteScrollLoader from "./InfiniteScrollLoader";

export interface SearchResultsViewProps {
  query: { [key: string]: string };
  columns?: PropertyGridColumns;
  selectedId?: string | null;
  properties: any[];
  hasMore: boolean;
  total: number;
  initialLoading: boolean;
  loadingMore: boolean;
  error: string | null;
  loadMore: () => void;
}

/** Listing + infinite scroll driven by `useInfiniteProperties` (or any compatible source). */
export function SearchResultsView({
  query,
  columns = "three",
  selectedId = null,
  properties,
  hasMore,
  total,
  initialLoading,
  loadingMore,
  error,
  loadMore,
}: SearchResultsViewProps) {
  if (error) {
    return (
      <div className="w-full flex justify-center items-center py-20 text-red-500">
        Failed to load results: {error}
      </div>
    );
  }

  if (initialLoading) {
    return (
      <div className="w-full">
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="text-xl font-semibold">
            {Object.keys(query).length > 0
              ? `Searching for "${query.search || Object.values(query).filter(Boolean).join(", ")}"`
              : "Loading properties..."}
          </h2>
        </div>
        <PropertyGridSkeleton count={6} columns={columns} variant="carousel" />
      </div>
    );
  }

  const generateQueryString = (q: { [key: string]: string }) => {
    const descriptions = [];
    if (q.deal) descriptions.push(`Deal: ${q.deal}`);
    if (q.type) descriptions.push(`Type: ${q.type}`);
    if (q.propertyCategory)
      descriptions.push(`Category: ${q.propertyCategory}`);
    if (q.city) descriptions.push(`City: ${q.city}`);
    if (q.bedrooms) descriptions.push(`Bedrooms: ${q.bedrooms}`);
    if (q.furnishing) descriptions.push(`Furnishing: ${q.furnishing}`);
    if (q.availability) descriptions.push(`Availability: ${q.availability}`);
    if (q.postedBy) descriptions.push(`Posted By: ${q.postedBy}`);
    if (q.priceMin && q.priceMax) {
      descriptions.push(`Price: ₹${q.priceMin} - ₹${q.priceMax}`);
    }
    if (q.areaMin && q.areaMax) {
      descriptions.push(`Area: ${q.areaMin} - ${q.areaMax} sqft`);
    }
    return descriptions.join(", ");
  };

  const hasFilters = Object.keys(query).length > 0;

  return (
    <div className="w-full">
      {hasFilters && (
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-3 sm:mb-4 gap-1 sm:gap-0">
          <h2 className="text-base sm:text-lg md:text-xl font-semibold">
            Results for &ldquo;
            {generateQueryString(query) || "All Properties"}
            &rdquo;
          </h2>
          <span className="text-xs sm:text-sm text-gray-500">
            {total} {total === 1 ? "result" : "results"} found
          </span>
        </div>
      )}
      <PropertyGrid
        properties={properties}
        columns={columns}
        variant="carousel"
        selectedId={selectedId}
      />
      <InfiniteScrollLoader
        onIntersect={loadMore}
        loading={loadingMore}
        hasMore={hasMore}
      />
      {!hasMore && properties.length > 0 && (
        <div className="w-full text-center py-6 text-sm text-gray-400">
          {total > 0
            ? `Showing all ${total} properties`
            : "No more properties to load"}
        </div>
      )}
    </div>
  );
}

interface SearchResultsProps {
  query: { [key: string]: string };
  columns?: PropertyGridColumns;
}

export default function SearchResults({
  query,
  columns = "three",
}: SearchResultsProps) {
  const hookResult = useInfiniteProperties(query);
  return (
    <SearchResultsView query={query} columns={columns} {...hookResult} />
  );
}

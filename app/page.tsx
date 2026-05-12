"use client";
import dynamic from "next/dynamic";
import { useState, useMemo } from "react";
import { SearchFilters } from "@/components/SearchBar";
import Hero from "@/components/Hero";
import { useInfiniteProperties } from "@/hooks/useInfiniteProperties";
import PropertyGridSkeleton from "@/components/PropertyGridSkeleton";
import InfiniteScrollLoader from "@/components/InfiniteScrollLoader";

import Testimonial from "@/components/Testimonial";
import GetStarted from "@/components/GetStarted";
import WhyPropertyBulbul from "@/components/WhyPropertyBulbul";
// Lazy load heavy components for better initial load
const Companies = dynamic(() => import("@/components/Companies"), {
  ssr: false,
});
const Contact = dynamic(() => import("@/components/Contact"), { ssr: false });
const TestimonialGetStartedWrapper = dynamic(
  () => import("@/components/TestimonialGetStartedWrapper"),
  {
    ssr: false,
  },
);
const PropertyGrid = dynamic(() => import("@/components/PropertyGrid"), {
  ssr: false,
});
const Residencies = dynamic(() => import("@/components/Residencies"), {
  ssr: false,
});
const Value = dynamic(() => import("@/components/Value"), { ssr: false });
const PostPropertyCTA = dynamic(() => import("@/components/PostPropertyCTA"), {
  ssr: false,
});
const BecauseYouViewedSection = dynamic(
  () => import("@/components/BecauseYouViewedSection"),
  { ssr: false },
);

/** Convert homepage SearchFilters into the query format expected by useInfiniteProperties */
function filtersToQuery(filters: SearchFilters): Record<string, string> {
  const query: Record<string, string> = {};
  if (filters.query) query.search = filters.query;
  if (filters.bedrooms) query.bedrooms = String(filters.bedrooms);
  if (filters.deal) query.deal = filters.deal;
  if (filters.type) query.type = filters.type;
  if (filters.propertyCategory)
    query.propertyCategory = filters.propertyCategory;
  if (filters.minPrice != null) query.priceMin = String(filters.minPrice);
  if (filters.maxPrice != null) query.priceMax = String(filters.maxPrice);
  if (filters.city) query.city = filters.city;
  if (filters.state) query.state = filters.state;
  if (filters.country) query.country = filters.country;
  return query;
}

/** Check if at least one filter is active */
function hasActiveFilter(filter: SearchFilters): boolean {
  return !!(
    filter.query ||
    filter.bedrooms ||
    filter.deal ||
    filter.type ||
    filter.propertyCategory ||
    filter.maxPrice ||
    filter.minPrice ||
    filter.city ||
    filter.state ||
    filter.country
  );
}

export default function Home() {
  const [filter, setFilter] = useState<SearchFilters>({ query: "" });

  const hasFilters = hasActiveFilter(filter);
  const query = useMemo(() => filtersToQuery(filter), [filter]);

  const { properties, hasMore, initialLoading, loadingMore, error, loadMore } =
    useInfiniteProperties(query);

  return (
    <main>
      {/* hero search bar will set filter */}
      <Hero setFilter={setFilter} />

      {/* show search results only when filter has content */}
      {hasFilters && (
        <section className="container mx-auto px-4 py-8">
          {error ? (
            <div className="w-full flex justify-center items-center py-12 text-red-500">
              Error loading results: {error}
            </div>
          ) : initialLoading ? (
            <PropertyGridSkeleton
              count={6}
              columns="three"
              variant="carousel"
            />
          ) : properties.length === 0 ? (
            <div className="w-full flex flex-col gap-2 justify-center items-center py-12 text-gray-600">
              <span>No properties found.</span>
              <span className="text-sm">Try adjusting your search.</span>
            </div>
          ) : (
            <>
              <PropertyGrid properties={properties} variant="carousel" />
              <InfiniteScrollLoader
                onIntersect={loadMore}
                loading={loadingMore}
                hasMore={hasMore}
              />
              {!hasMore && properties.length > 0 && (
                <div className="w-full text-center py-6 text-sm text-gray-400">
                  Showing all {properties.length} properties
                </div>
              )}
            </>
          )}
        </section>
      )}

      <BecauseYouViewedSection />

      <div className="mx-auto h-px w-[90%] max-w-7xl bg-gradient-to-r from-transparent via-neutral-200 to-transparent" />

      <section>
        <Companies />
      </section>

      <section>
        <Residencies />
      </section>

      <div className="mx-auto h-px w-[90%] max-w-7xl bg-gradient-to-r from-transparent via-neutral-200 to-transparent" />

      <section className="container mx-auto px-4">
        <Value />
      </section>

      <WhyPropertyBulbul />

      <section className="container mx-auto px-4 bg-white/60">
        <PostPropertyCTA />
      </section>

      <section className=" bg-white/60 relative z-10">
        <Testimonial />
      </section>
      <section className="bg-white/60 relative z-10">
        <GetStarted />
      </section>
    </main>
  );
}

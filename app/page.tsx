"use client";
import { useState, useMemo } from "react";
import { SearchFilters } from "@/components/SearchBar";
import Hero from "@/components/Hero";
import { SearchResultsView } from "@/components/SearchResults";
import { useInfiniteProperties } from "@/hooks/useInfiniteProperties";

import Companies from "@/components/Companies";
import Residencies from "@/components/Residencies";
import Value from "@/components/Value";
import PostPropertyCTA from "@/components/PostPropertyCTA";
import BecauseYouViewedSection from "@/components/BecauseYouViewedSection";
import Testimonial from "@/components/Testimonial";
import GetStarted from "@/components/GetStarted";
import WhyPropertyBulbul from "@/components/WhyPropertyBulbul";

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

  const {
    properties,
    hasMore,
    total,
    initialLoading,
    loadingMore,
    error,
    loadMore,
  } = useInfiniteProperties(query);

  return (
    <main>
      <Hero setFilter={setFilter} />

      {hasFilters && (
        <section className="container mx-auto px-4 py-8">
          <SearchResultsView
            query={query}
            columns="four"
            properties={properties}
            hasMore={hasMore}
            total={total}
            initialLoading={initialLoading}
            loadingMore={loadingMore}
            error={error}
            loadMore={loadMore}
          />
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

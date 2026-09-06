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
import AgentLandlordCTA from "@/components/AgentLandlordCTA";
import BecauseYouViewedSection from "@/components/BecauseYouViewedSection";
import Testimonial from "@/components/Testimonial";
import GetStarted from "@/components/GetStarted";
import WhyPropertyBulbul from "@/components/WhyPropertyBulbul";

import AppDownloadBanner from "@/components/home/AppDownloadBanner";
import TrendingLocalities from "@/components/home/TrendingLocalities";
import RoommateBanner from "@/components/home/RoommateBanner";

/** Convert homepage SearchFilters into the query format expected by useInfiniteProperties */
function filtersToQuery(filters: SearchFilters): Record<string, string> {
  const query: Record<string, string> = {};
  if (filters.query) query.search = filters.query;
  if (filters.bedrooms) query.bedrooms = String(filters.bedrooms);
  if (filters.deal) query.deal = filters.deal;
  if (filters.type) query.type = filters.type;
  if (filters.propertyCategory)
    query.propertyCategory = filters.propertyCategory;
  if (filters.minPrice != null) {
    const val = String(filters.minPrice);
    query.minPrice = val;
    query.priceMin = val;
  }
  if (filters.maxPrice != null) {
    const val = String(filters.maxPrice);
    // 🔥 Explicitly push maxPrice into the outbound network payload
    query.maxPrice = val;
    query.priceMax = val;
  }
  if (filters.city) query.city = filters.city;
  if (filters.state) query.state = filters.state;
  if (filters.country) query.country = filters.country;
  if (filters.landmark) query.landmark = filters.landmark;
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

interface HomeClientProps {
  featuredProperties: any[];
}

export default function HomeClient({ featuredProperties }: HomeClientProps) {
  const [filter, setFilter] = useState<SearchFilters>({ query: "" });

  // Also check landmark as an active filter
  const hasFilters = hasActiveFilter(filter) || !!filter.landmark;
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

      {/* <section>
        <AppDownloadBanner />
      </section>
      <section>
        <TrendingLocalities />
      </section>
      <section>
        <RoommateBanner />
      </section> */}

      <section>
        <Residencies featuredProperties={featuredProperties} />
      </section>

      <div className="mx-auto h-px w-[90%] max-w-7xl bg-gradient-to-r from-transparent via-neutral-200 to-transparent" />
      <WhyPropertyBulbul />

      <section className="container mx-auto px-4">
        <Value />
      </section>

      <section className="container mx-auto px-4 bg-white/60">
        <PostPropertyCTA />
      </section>
      {/* 
      <section className="bg-white/60 relative z-10">
        <AgentLandlordCTA />
      </section> */}

      <section className="bg-white/60 relative z-10">
        <Testimonial />
      </section>
      <section className="bg-white/60 relative z-10">
        <GetStarted />
      </section>
    </main>
  );
}

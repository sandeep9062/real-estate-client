"use client";
import dynamic from "next/dynamic";
import { useState, useMemo, useCallback } from "react";
import { SearchFilters } from "@/components/SearchBar";
import Hero from "@/components/Hero";

import { useGetAllPropertiesQuery } from "../services/propertiesApi";
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

export default function Home() {
  const [filter, setFilter] = useState<SearchFilters>({ query: "" });

  // Single API call - data is cached by RTK Query
  const { data } = useGetAllPropertiesQuery(undefined);

  // Memoized filter logic to prevent recalculation on every render
  const filteredData = useMemo(() => {
    if (!data) return [];

    return data.filter((p: any) => {
      const hasSpecificFilters =
        filter.bedrooms ||
        filter.deal ||
        filter.type ||
        filter.propertyCategory ||
        filter.maxPrice ||
        filter.minPrice ||
        filter.city ||
        filter.state ||
        filter.country;

      if (hasSpecificFilters) {
        if (filter.bedrooms && p.facilities?.bedrooms !== filter.bedrooms)
          return false;
        if (filter.deal && p.deal !== filter.deal) return false;
        if (filter.type && p.type !== filter.type) return false;
        if (
          filter.propertyCategory &&
          p.propertyCategory !== filter.propertyCategory
        )
          return false;
        if (filter.maxPrice && p.price > filter.maxPrice) return false;
        if (filter.minPrice && p.price < filter.minPrice) return false;
        if (filter.city && p.location?.city?.toLowerCase() !== filter.city)
          return false;
        if (filter.state && p.location?.state?.toLowerCase() !== filter.state)
          return false;
        if (
          filter.country &&
          p.location?.country?.toLowerCase() !== filter.country
        )
          return false;
        return true;
      } else {
        const query = filter.query.toLowerCase();
        return (
          p.title?.toLowerCase().includes(query) ||
          p.description?.toLowerCase().includes(query) ||
          p.location?.city?.toLowerCase().includes(query) ||
          p.location?.state?.toLowerCase().includes(query) ||
          p.location?.country?.toLowerCase().includes(query) ||
          p.location?.address?.toLowerCase().includes(query)
        );
      }
    });
  }, [data, filter]);

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
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
  }, [filter]);

  return (
    <main>
      {/* className="relative"*/}

      {/* <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute left-1/2 top-[-8rem] h-72 w-72 -translate-x-1/2 rounded-full bg-blue-200/40 blur-3xl" />
        <div className="absolute right-[-4rem] top-24 h-64 w-64 rounded-full bg-indigo-200/30 blur-3xl" />
        <div className="absolute left-[-6rem] bottom-24 h-64 w-64 rounded-full bg-cyan-200/30 blur-3xl" />
      </div> */}

      {/* hero search bar will set filter */}

      <Hero setFilter={setFilter} />

      {/* show search results only when filter has content */}
      {(filter.query ||
        filter.bedrooms ||
        filter.deal ||
        filter.type ||
        filter.propertyCategory ||
        filter.maxPrice ||
        filter.minPrice ||
        filter.city ||
        filter.state ||
        filter.country) && (
        <section className="container mx-auto px-4">
          <PropertyGrid properties={filteredData} />
        </section>
      )}

      <div className="mx-auto h-px w-[90%] max-w-7xl bg-gradient-to-r from-transparent via-neutral-200 to-transparent" />

      <section>
        <Companies />
      </section>

      {/* <section>
        <PropertyCarousel />
      </section> */}

      <section>
        <Residencies />
      </section>

      <div className="mx-auto h-px w-[90%] max-w-7xl bg-gradient-to-r from-transparent via-neutral-200 to-transparent" />

      <section className="container mx-auto px-4">
        <Value />
      </section>

      {/* <section className="container mx-auto px-4 bg-white/60">
        <AdvertiserTypeCard />
      </section> */}
      {/* 
      <section className="container mx-auto px-4 bg-white/60">
        <ExploreServices />
      </section> */}

      <WhyPropertyBulbul />
      <section className="container mx-auto px-4 bg-white/60">
        <PostPropertyCTA />
      </section>
      <section className="container mx-auto px-4 bg-white/60">
        <Contact />
      </section>

      <section className=" bg-white/60 relative z-10">
        <Testimonial />
      </section>
      <section className="bg-white/60 relative z-10">
        <GetStarted />
      </section>

      {/* <TestimonialGetStartedWrapper /> */}
    </main>
  );
}

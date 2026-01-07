"use client";
import Companies from "@/components/Companies";
import Contact from "@/components/Contact";
import GetStarted from "@/components/GetStarted";
import Hero from "@/components/Hero";
import PropertyGrid from "@/components/PropertyGrid";
import Residencies from "@/components/Residencies";
import Testimonial from "@/components/Testimonial";
import Value from "@/components/Value";
import { useState } from "react";
import { useGetAllPropertiesQuery } from "../services/propertiesApi";
import PostPropertyCTA from "@/components/PostPropertyCTA";
import AdvertiserTypeCard from "@/components/AdvertiserTypeCard";
import ExploreServices from "@/components/ExploreServices";
import PropertyCarousel from "@/components/PropertyCrousal";
import { SearchFilters } from "@/components/SearchBar";

export default function Home() {
  const [filter, setFilter] = useState<SearchFilters>({ query: "" });
  const { data, isError, isLoading } = useGetAllPropertiesQuery(undefined);

  // Smart filter data based on parsed filters
  const filteredData = (data || []).filter((p: any) => {
    // Check if any specific filters are set
    const hasSpecificFilters = filter.bedrooms || filter.deal || filter.type ||
                              filter.propertyCategory || filter.maxPrice ||
                              filter.minPrice || filter.city || filter.state || filter.country;

    // If we have specific filters, use those as primary criteria
    // Otherwise, fall back to text search
    let matchesFilters = true;

    if (hasSpecificFilters) {
      // Bedrooms filter
      if (filter.bedrooms && p.facilities?.bedrooms !== filter.bedrooms) {
        matchesFilters = false;
      }

      // Deal type filter (Rent/Sale)
      if (filter.deal && p.deal !== filter.deal) {
        matchesFilters = false;
      }

      // Property type filter (Residential/Commercial)
      if (filter.type && p.type !== filter.type) {
        matchesFilters = false;
      }

      // Property category filter
      if (filter.propertyCategory && p.propertyCategory !== filter.propertyCategory) {
        matchesFilters = false;
      }

      // Price filters
      if (filter.maxPrice && p.price > filter.maxPrice) {
        matchesFilters = false;
      }
      if (filter.minPrice && p.price < filter.minPrice) {
        matchesFilters = false;
      }

      // Location filters
      if (filter.city && p.location?.city?.toLowerCase() !== filter.city) {
        matchesFilters = false;
      }
      if (filter.state && p.location?.state?.toLowerCase() !== filter.state) {
        matchesFilters = false;
      }
      if (filter.country && p.location?.country?.toLowerCase() !== filter.country) {
        matchesFilters = false;
      }
    } else {
      // No specific filters, use text search
      matchesFilters = (
        p.title?.toLowerCase().includes(filter.query) ||
        p.description?.toLowerCase().includes(filter.query) ||
        p.location?.city?.toLowerCase().includes(filter.query) ||
        p.location?.state?.toLowerCase().includes(filter.query) ||
        p.location?.country?.toLowerCase().includes(filter.query) ||
        p.location?.address?.toLowerCase().includes(filter.query)
      );
    }

    return matchesFilters;
  });

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
      {(filter.query || filter.bedrooms || filter.deal || filter.type || filter.propertyCategory ||
        filter.maxPrice || filter.minPrice || filter.city || filter.state || filter.country) && (
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

      {/* <section className="container mx-auto px-4 bg-white/60">
        <ExploreServices />
      </section> */}

      <section className="container mx-auto px-4 bg-white/60">
        <PostPropertyCTA />
      </section>

      <section className="container mx-auto px-4 bg-white/60">
        <Contact />
      </section>

      <section className="container mx-auto px-4 bg-white/60">
        <Testimonial />
      </section>

      <section className="container mx-auto px-4 bg-white/60">
        <GetStarted />
      </section>
    </main>
  );
}

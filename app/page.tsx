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

export default function Home() {
  const [filter, setFilter] = useState("");
  const { data, isError, isLoading } = useGetAllPropertiesQuery(undefined);

  // filter data
  const filteredData = (data || []).filter((p: any) => {
    const text = filter.toLowerCase();
    return (
      p.title?.toLowerCase().includes(text) ||
      p.description?.toLowerCase().includes(text) ||
      p.location?.city?.toLowerCase().includes(text) ||
      p.location?.state?.toLowerCase().includes(text) ||
      p.location?.country?.toLowerCase().includes(text) ||
      p.location?.address?.toLowerCase().includes(text)
    );
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

      {/* show search results only when filter exists */}
      {filter && (
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

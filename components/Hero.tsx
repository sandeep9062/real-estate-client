"use client";

import React, { useCallback, useState, useEffect, useRef } from "react";
import CountUp from "react-countup";
import { motion } from "framer-motion";
import SearchBar, { SearchFilters } from "./SearchBar";
import Link from "next/link";
import Image from "next/image";
import { getApiUrl } from "../services/propertiesApi";

interface HeroProps {
  setFilter: React.Dispatch<React.SetStateAction<SearchFilters>>;
}

interface HeroStats {
  properties: number;
  projects: number;
  cities: number;
}

async function fetchHeroStats(): Promise<HeroStats> {
  const apiUrl = getApiUrl();
  const response = await fetch(`${apiUrl}/properties/stats/hero`, {
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error("Failed to fetch hero stats");
  }
  const result = await response.json();
  return result.data;
}

const Hero: React.FC<HeroProps> = ({ setFilter }) => {
  const [stats, setStats] = useState<HeroStats | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        const data = await fetchHeroStats();
        if (!mounted) return;
        setStats(data);
      } catch {
        // silently fail – keep static fallback values
      }
    };

    load();

    // Re-fetch every 60 seconds for real-time updates
    intervalRef.current = setInterval(load, 60_000);

    return () => {
      mounted = false;
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const display = stats || { properties: 181, projects: 3, cities: 7 };

  // Memoize the search handler to prevent unnecessary re-renders
  const handleSearch = useCallback(
    (filters: SearchFilters) => {
      setFilter(filters);
    },
    [setFilter],
  );

  return (
    <section className="relative bg-background text-foreground pt-22 sm:pt-26 md:pt-36 pb-6 sm:pb-10 md:pb-16 lg:pb-20 overflow-hidden">
      {/* BACKGROUND BLOB EFFECT */}
      <div
        aria-hidden="true"
        className="absolute inset-0 grid grid-cols-2 -space-x-52 opacity-40 dark:opacity-20"
      >
        <div className="blur-[106px] h-48 bg-gradient-to-br from-primary to-purple-400 dark:from-blue-700" />
        <div className="blur-[106px] h-32 bg-gradient-to-r from-cyan-400 to-sky-300 dark:to-indigo-600" />
      </div>
      {/* CONTENT */}
      <div className="container mx-auto px-1 sm:px-2 lg:px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-10 lg:gap-12 items-center">
          {/* LEFT SIDE */}
          <div className="flex flex-col gap-4 text-center md:text-left">
            {/* TITLE */}
            <motion.h1
              initial={{ y: "2rem", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1.2, type: "spring" }}
              className="font-extrabold text-3xl sm:text-4xl md:text-5xl lg:text-7xl tracking-tighter leading-[1.1] text-slate-900"
            >
              Discover <br className="hidden sm:block" />
              Your Perfect{" "}
              <span className="text-[#4161df]">Home in Tricity</span>
            </motion.h1>

            {/* SUBTEXT */}
            <p className="text-muted-foreground text-sm sm:text-base md:text-lg max-w-full mb-3 sm:mb-4 mx-auto md:mx-0 px-2 sm:px-0">
              From luxury apartments to independent houses — discover homes that
              truly match your lifestyle across Chandigarh, Mohali & Panchkula.
            </p>

            {/* SEARCH BAR */}
            <div className="w-full flex justify-center md:justify-start">
              <SearchBar onSearch={handleSearch} />
            </div>

            {/* BUTTONS */}
            <div
              className="flex flex-wrap items-center justify-center md:justify-start gap-2 sm:gap-3"
              onClick={(e) => e.stopPropagation()}
            >
              <Link
                href="/properties"
                className="
      inline-flex items-center justify-center rounded-full
   text-white bg-[#4161df]
      text-xs px-3 py-2
      sm:text-sm sm:px-6 sm:py-3
      shadow-sm transition-colors hover:bg-[#3456df]
    "
              >
                Explore Properties
              </Link>

              <Link
                href="/contact"
                className="
      inline-flex items-center justify-center rounded-full
      border border-border text-foreground
      text-xs px-3 py-2 
      sm:text-sm sm:px-6 sm:py-3 
      transition-colors hover:bg-muted
    "
              >
                Contact us
              </Link>
            </div>

            {/* STATS */}
            <div className="flex justify-center items-center gap-4 sm:gap-6 md:gap-8 lg:gap-10 mt-4 sm:mt-6 flex-nowrap">
              {/* ITEM */}
              <div className="flex flex-col items-center">
                <span className="text-xs sm:text-base md:text-xl lg:text-3xl font-semibold text-gray-500 leading-none">
                  <CountUp
                    start={display.properties - 100}
                    end={display.properties}
                    duration={4}
                  />
                  +
                </span>
                <span className="text-muted-foreground text-[9px] sm:text-xs md:text-sm lg:text-base leading-none mt-1">
                  Verified Listings
                </span>
              </div>

              {/* Divider */}
              <div className="h-6 sm:h-8 w-px bg-border" />

              {/* ITEM */}
              <div className="flex flex-col items-center">
                <span className="text-xs sm:text-base md:text-xl lg:text-3xl font-semibold text-gray-500 leading-none">
                  <CountUp start={0} end={display.projects} duration={4} />+
                </span>
                <span className="text-muted-foreground text-[9px] sm:text-xs md:text-sm lg:text-base leading-none mt-1">
                  Major Projects
                </span>
              </div>

              {/* Divider */}
              <div className="h-6 sm:h-8 w-px bg-border" />

              {/* ITEM */}
              <div className="flex flex-col items-center">
                <span className="text-xs sm:text-base md:text-xl lg:text-3xl font-semibold text-gray-500 leading-none">
                  <CountUp start={0} end={display.cities} duration={4} />+
                </span>
                <span className="text-muted-foreground text-[9px] sm:text-xs md:text-sm lg:text-base leading-none mt-1">
                  Cities Covered
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE IMAGE */}
          <div className="flex justify-center order-first md:order-last">
            <motion.div
              initial={{ x: "7rem", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 1.5, type: "spring" }}
              className="relative w-48 h-56 sm:w-64 sm:h-72 md:w-80 md:h-96 lg:w-[26rem] lg:h-[32rem] overflow-hidden rounded-t-[8rem] sm:rounded-t-[10rem] md:rounded-t-[12rem] border-4 sm:border-6 md:border-8 border-border shadow-lg"
            >
              <Image
                src="/hero-image.png"
                alt="Modern house"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover"
              />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

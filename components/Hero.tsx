"use client";

import React, { useCallback } from "react";
import CountUp from "react-countup";
import { motion } from "framer-motion";
import SearchBar, { SearchFilters } from "./SearchBar";
import Link from "next/link";
import Image from "next/image";

interface HeroProps {
  setFilter: React.Dispatch<React.SetStateAction<SearchFilters>>;
}

// Reduce animation complexity for better performance
const heroVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const imageVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
};

const Hero: React.FC<HeroProps> = ({ setFilter }) => {
  // Memoize the search handler to prevent unnecessary re-renders
  const handleSearch = useCallback(
    (filters: SearchFilters) => {
      setFilter(filters);
    },
    [setFilter],
  );

  return (
    <section className="relative bg-background text-foreground py-6 sm:py-10 md:py-16 lg:py-20 overflow-hidden">
      {/* BACKGROUND BLOB EFFECT */}
      <div
        aria-hidden="true"
        className="absolute inset-0 grid grid-cols-2 -space-x-52 opacity-40 dark:opacity-20"
      >
        <div className="blur-[106px] h-48 bg-gradient-to-br from-primary to-purple-400 dark:from-blue-700" />
        <div className="blur-[106px] h-32 bg-gradient-to-r from-cyan-400 to-sky-300 dark:to-indigo-600" />
      </div>

      {/* CONTENT */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
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
                  <CountUp start={798} end={900} duration={4} />+
                </span>
                <span className="text-muted-foreground text-[9px] sm:text-xs md:text-sm lg:text-base leading-none mt-1">
                  Premium Listings
                </span>
              </div>

              {/* Divider */}
              <div className="h-6 sm:h-8 w-px bg-border" />

              {/* ITEM */}
              <div className="flex flex-col items-center">
                <span className="text-xs sm:text-base md:text-xl lg:text-3xl font-semibold text-gray-500 leading-none">
                  <CountUp start={150} end={200} duration={4} />+
                </span>
                <span className="text-muted-foreground text-[9px] sm:text-xs md:text-sm lg:text-base leading-none mt-1">
                  Happy Customers
                </span>
              </div>

              {/* Divider */}
              <div className="h-6 sm:h-8 w-px bg-border" />

              {/* ITEM */}
              <div className="flex flex-col items-center">
                <span className="text-xs sm:text-base md:text-xl lg:text-3xl font-semibold text-gray-500 leading-none">
                  <CountUp start={15} end={20} duration={4} />+
                </span>
                <span className="text-muted-foreground text-[9px] sm:text-xs md:text-sm lg:text-base leading-none mt-1">
                  Projects
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

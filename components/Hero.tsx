"use client";

import React, { useCallback, useState, useEffect, useRef } from "react";

import { motion } from "framer-motion";
import SearchBar, { SearchFilters } from "./SearchBar";
import Link from "next/link";
import Image from "next/image";
import { getApiUrl } from "../services/propertiesApi";

import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { selectIsAuthenticated, selectUser } from "@/store/authSlice";
import {
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  BadgeIndianRupee,
  FileText,
  ArrowRight,
} from "lucide-react";

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

const CITIES = ["Chandigarh", "Panchkula", "Mohali", "Kharar", "Zirakpur"];

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

  const display = stats || { properties: 181, projects: 3, cities: 5 };
  const router = useRouter();

  const isAuthenticated = useSelector(selectIsAuthenticated);

  const handleSearch = useCallback(
    (filters: SearchFilters) => {
      setFilter(filters);
    },
    [setFilter],
  );

  const handleAddPropertyClick = () => {
    if (isAuthenticated) {
      router.push("/add-property");
    } else {
      router.push("/login");
    }
  };

  return (
    <section className="relative bg-background text-foreground pt-20 xs:pt-22 sm:pt-26 md:pt-36 pb-6 sm:pb-10 md:pb-16 lg:pb-20 overflow-hidden">
      {/* BACKGROUND GLOW — brand-consistent blue/indigo wash */}
      <div
        aria-hidden="true"
        className="absolute inset-0 grid grid-cols-2 -space-x-52 opacity-40 dark:opacity-20 pointer-events-none"
      >
        <div className="blur-[106px] h-48 bg-gradient-to-br from-[#4161df] to-indigo-400 dark:from-blue-700 max-md:h-32 max-md:blur-[80px]" />
        <div className="blur-[106px] h-32 bg-gradient-to-r from-indigo-300 to-blue-300 dark:to-indigo-600 max-md:h-24 max-md:blur-[80px]" />
      </div>

      {/* CONTENT */}
      <div className="container mx-auto px-1 sm:px-2 lg:px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 xs:gap-5 sm:gap-8 md:gap-10 lg:gap-12 items-center">
          {/* LEFT SIDE */}
          <div className="flex flex-col gap-4 text-center md:text-left">
            {/* TITLE */}
            <motion.h1
              initial={{ y: "2rem", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1.2, type: "spring" }}
              className="font-heading font-extrabold text-[1.625rem] xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tighter leading-[1.1] text-slate-900"
            >
              Tricity&apos;s
              <br className="hidden sm:block" /> Most Helpful
              <br className="hidden sm:block" />
              <br className="sm:hidden" />
              <span className="text-[#4161df]">Real Estate Partner</span>
            </motion.h1>

            {/* SUBTEXT */}
            <p className="text-muted-foreground text-xs xs:text-sm sm:text-base md:text-lg max-w-full mb-1 xs:mb-2 sm:mb-2 mx-auto md:mx-0 px-2 xs:px-3 sm:px-0">
              Stop chasing stale posts and bait listings. Access a curated
              marketplace of fresh, active properties across the entire Tricity
              region with zero hidden fees and no spam.
            </p>

            {/* SEARCH BAR */}
            <div className="w-full flex justify-center md:justify-start">
              <SearchBar onSearch={handleSearch} />
            </div>

            {/* BUTTONS */}
            <div
              className="flex flex-wrap items-center justify-center md:justify-start gap-2 sm:gap-3 mt-1"
              onClick={(e) => e.stopPropagation()}
            >
              <Link
                href="/properties"
                className="
                  group inline-flex items-center justify-center gap-1.5 rounded-full
                  text-white bg-gradient-to-tr from-[#4161df] to-indigo-700
                  text-[0.625rem] xs:text-xs px-3 py-1.5
                  sm:text-sm sm:px-6 sm:py-3
                  shadow-md shadow-blue-500/20
                  transition-all hover:from-[#3a56c8] hover:to-indigo-800
                  hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]
                  min-h-[2rem] xs:min-h-0
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4161df] focus-visible:ring-offset-2
                "
              >
                Browse Verified Properties
                <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>

              <button
                onClick={handleAddPropertyClick}
                className="
                  inline-flex items-center justify-center rounded-full
                  border border-slate-200 bg-white text-foreground
                  text-[0.625rem] xs:text-xs px-3 py-1.5
                  sm:text-sm sm:px-5.5 sm:py-2.5
                  shadow-sm transition-all hover:border-[#4161df]/40 hover:bg-blue-50/60
                  hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]
                  min-h-[2rem] xs:min-h-0
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4161df] focus-visible:ring-offset-2
                "
              >
                List Your Property
              </button>
            </div>

            {/* CITIES WE COVER */}
            <div className="mt-1 xs:mt-2 sm:mt-2 flex flex-wrap justify-center md:justify-start gap-1.5 xs:gap-2">
              {CITIES.map((city) => (
                <Link
                  key={city}
                  href={`/properties/${city.toLowerCase()}`}
                  className="
                    inline-flex items-center gap-1 xs:gap-1.5 rounded-full
                    bg-white/80 border border-slate-200 px-2 xs:px-2.5 py-1
                    text-[9px] xs:text-[10px] sm:text-xs font-medium text-slate-700
                    transition-colors hover:border-[#4161df]/40 hover:text-[#4161df] hover:bg-blue-50/60
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4161df] focus-visible:ring-offset-1
                  "
                >
                  <CheckCircle2 className="w-3 xs:w-3.5 h-3 xs:h-3.5 text-green-500 flex-shrink-0" />
                  {city}
                </Link>
              ))}
            </div>
          </div>

          {/* RIGHT SIDE IMAGE */}
          <div className="flex justify-center order-first md:order-last">
            <motion.div
              initial={{ x: "7rem", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 1.5, type: "spring" }}
              className="relative w-36 h-44 xs:w-44 xs:h-52 sm:w-64 sm:h-72 md:w-[21rem] md:h-[25rem] lg:w-[28rem] lg:h-[34rem] overflow-hidden rounded-t-[5rem] xs:rounded-t-[6rem] sm:rounded-t-[10rem] md:rounded-t-[12rem] border-4 sm:border-6 md:border-8 border-border shadow-xl shadow-blue-900/10"
            >
              <Image
                src="/hero-image.png"
                alt="Tricity property platform"
                fill
                priority
                sizes="(max-width: 475px) 70vw, (max-width: 768px) 50vw, (max-width: 1200px) 45vw, 40vw"
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

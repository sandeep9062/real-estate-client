"use client";

import React, { useCallback, useState, useEffect, useRef } from "react";

import { motion } from "framer-motion";
import SearchBar, { SearchFilters } from "./SearchBar";
import Link from "next/link";
import Image from "next/image";
import { getApiUrl } from "../services/propertiesApi";
import AddPropertyModal from "./AddPropertyModal";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { selectIsAuthenticated, selectUser } from "@/store/authSlice";
import { CheckCircle2 } from "lucide-react";
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

  const display = stats || { properties: 181, projects: 3, cities: 5 };
  const router = useRouter();
  const [modalOpened, setModalOpened] = useState(false);

  const isAuthenticated = useSelector(selectIsAuthenticated);
  // Memoize the search handler to prevent unnecessary re-renders
  const handleSearch = useCallback(
    (filters: SearchFilters) => {
      setFilter(filters);
    },
    [setFilter],
  );

  const handleAddPropertyClick = () => {
    if (isAuthenticated) {
      setModalOpened(true);
    } else {
      router.push("/login");
    }
  };

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
              className="font-extrabold text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tighter leading-[1.1] text-slate-900"
            >
              Tricity's
              <br className="hidden sm:block" /> Most Helpful
              <br className="hidden sm:block" />
              <span className="text-[#4161df]">Real Estate Partner</span>
            </motion.h1>
            {/* SUBTEXT */}
            <p className="text-muted-foreground  text-sm sm:text-base md:text-lg max-w-full mb-5 sm:mb-5 mx-auto md:mx-0 px-2 sm:px-0">
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
                Browse Verified Properties
              </Link>

              <button
                onClick={handleAddPropertyClick}
                className="
      inline-flex items-center justify-center rounded-full
      border border-border text-foreground
      text-xs px-2.5 py-1.5 
      sm:text-sm sm:px-5.5 sm:py-2.5 
      transition-colors hover:bg-muted
    "
              >
                List Your Property
              </button>
            </div>
            <AddPropertyModal opened={modalOpened} setOpened={setModalOpened} />

            <div className="mt-1 sm:mt-2 flex flex-wrap justify-center gap-x-4 sm:gap-x-6 gap-y-1.5 sm:gap-y-2 text-[10px] xs:text-xs sm:text-sm text-gray-300 font-medium">
              {["Chandigarh", "Panchkula", "Mohali", "Kharar", "Zirakpur"].map(
                (city) => (
                  <span key={city} className=" text-gray-800">
                    <Link
                      href={`/properties/${city.toLowerCase()}`}
                      className="hover:text-[#4161df] flex items-center gap-1.5 transition"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
                      {city}
                    </Link>
                  </span>
                ),
              )}
            </div>

            {/* ── HERO STRIPS ───────────── */}
            <div className="mt-4 sm:mt-6 space-y-4">
              {/* Row 1 — seeker benefits */}
              <div className="flex flex-wrap justify-center gap-2">
                <div className="flex items-start gap-2 bg-white/90 backdrop-blur-sm border border-blue-100 rounded-2xl px-3 py-2 shadow-sm min-w-[140px]">
                  <div className="w-1 self-stretch rounded-full bg-blue-600 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-blue-900 leading-tight">
                      AI Property Match
                    </p>
                    <p className="text-[10px] text-muted-foreground leading-tight mt-0.5">
                      Exact fit for your needs
                    </p>
                  </div>
                </div>

                {/* <div className="flex items-start gap-2 bg-white/90 backdrop-blur-sm border border-green-100 rounded-2xl px-3 py-2 shadow-sm min-w-[150px]">
                  <div className="w-1 self-stretch rounded-full bg-green-600 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-green-900 leading-tight">
                      Commute Time Filter
                    </p>
                    <p className="text-[10px] text-muted-foreground leading-tight mt-0.5">
                      Filter by commute distance
                    </p>
                  </div>
                </div> */}

                {/* <div className="flex items-start gap-2 bg-white/90 backdrop-blur-sm border border-purple-100 rounded-2xl px-3 py-2 shadow-sm min-w-[150px]">
                  <div className="w-1 self-stretch rounded-full bg-purple-600 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-purple-900 leading-tight">
                      Roommate Matching
                    </p>
                    <p className="text-[10px] text-muted-foreground leading-tight mt-0.5">
                      Compatible profiles only
                    </p>
                  </div>
                </div> */}

                <div className="flex items-start gap-2 bg-white/90 backdrop-blur-sm border border-blue-100 rounded-2xl px-3 py-2 shadow-sm min-w-[148px]">
                  <div className="w-1 self-stretch rounded-full bg-blue-600 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-blue-900 leading-tight">
                      Verified Listings Only
                    </p>
                    <p className="text-[10px] text-muted-foreground leading-tight mt-0.5">
                      No fake or expired posts
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2 bg-white/90 backdrop-blur-sm border border-green-100 rounded-2xl px-3 py-2 shadow-sm min-w-[148px]">
                  <div className="w-1 self-stretch rounded-full bg-green-600 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-green-900 leading-tight">
                      No Hidden Charges
                    </p>
                    <p className="text-[10px] text-muted-foreground leading-tight mt-0.5">
                      Transparent pricing, no surprises
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2 bg-white/90 backdrop-blur-sm border border-orange-100 rounded-2xl px-3 py-2 shadow-sm min-w-[148px]">
                  <div className="w-1 self-stretch rounded-full bg-orange-500 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-orange-900 leading-tight">
                      Instant PDF Brochure
                    </p>
                    <p className="text-[10px] text-muted-foreground leading-tight mt-0.5">
                      One click, share anywhere
                    </p>
                  </div>
                </div>
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
                alt="tricity property platform"
                fill
                priority
                sizes="(max-width: 768px) 90vw, (max-width: 1200px) 45vw, 40vw"
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

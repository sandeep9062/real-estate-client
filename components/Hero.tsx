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
    <section className="relative bg-background text-foreground pt-20 xs:pt-22 sm:pt-26 md:pt-36 pb-6 sm:pb-10 md:pb-16 lg:pb-20 overflow-hidden">
      {/* BACKGROUND BLOB EFFECT */}
      <div
        aria-hidden="true"
        className="absolute inset-0 grid grid-cols-2 -space-x-52 opacity-40 dark:opacity-20 pointer-events-none"
      >
        <div className="blur-[106px] h-48 bg-gradient-to-br from-primary to-purple-400 dark:from-blue-700 max-md:h-32 max-md:blur-[80px]" />
        <div className="blur-[106px] h-32 bg-gradient-to-r from-cyan-400 to-sky-300 dark:to-indigo-600 max-md:h-24 max-md:blur-[80px]" />
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
              className="font-extrabold text-[1.625rem] xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tighter leading-[1.1] text-slate-900"
            >
              Tricity's
              <br className="hidden sm:block" /> Most Helpful
              <br className="hidden sm:block" />
              <br className="sm:hidden" />
              <span className="text-[#4161df]">Real Estate Partner</span>
            </motion.h1>
            {/* SUBTEXT */}
            <p className="text-muted-foreground text-xs xs:text-sm sm:text-base md:text-lg max-w-full mb-3 xs:mb-4 sm:mb-5 mx-auto md:mx-0 px-2 xs:px-3 sm:px-0">
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
      text-[0.625rem] xs:text-xs px-2.5 py-1.5
      sm:text-sm sm:px-6 sm:py-3
      shadow-sm transition-colors hover:bg-[#3456df]
      min-h-[2rem] xs:min-h-0
    "
              >
                Browse Verified Properties
              </Link>

              <button
                onClick={handleAddPropertyClick}
                className="
      inline-flex items-center justify-center rounded-full
      border border-border text-foreground
      text-[0.625rem] xs:text-xs px-2 py-1.5
      sm:text-sm sm:px-5.5 sm:py-2.5
      transition-colors hover:bg-muted
      min-h-[2rem] xs:min-h-0
    "
              >
                List Your Property
              </button>
            </div>
            <AddPropertyModal opened={modalOpened} setOpened={setModalOpened} />

            {/* cites the cities we cover */}
            <div className="mt-1 xs:mt-2 sm:mt-2 flex flex-wrap justify-center gap-x-2 xs:gap-x-3 sm:gap-x-6 gap-y-1 sm:gap-y-2 text-[9px] xs:text-[10px] sm:text-xs md:text-sm text-gray-300 font-medium">
              {["Chandigarh", "Panchkula", "Mohali", "Kharar", "Zirakpur"].map(
                (city) => (
                  <span key={city} className="text-gray-800">
                    <Link
                      href={`/properties/${city.toLowerCase()}`}
                      className="hover:text-[#4161df] flex items-center gap-1 xs:gap-1.5 transition"
                    >
                      <CheckCircle2 className="w-3 xs:w-3.5 h-3 xs:h-3.5 text-green-400 flex-shrink-0" />
                      <span className="truncate">{city}</span>
                    </Link>
                  </span>
                ),
              )}
            </div>

            {/* ── HERO STRIPS ───────────── */}
            <div className="mt-3 xs:mt-4 sm:mt-6">
              {/* Row 1 — seeker benefits */}
              <div className="grid grid-cols-2 xs:grid-cols-2 sm:flex sm:flex-wrap justify-center gap-1.5 xs:gap-2">
                <div className="flex items-start gap-1.5 xs:gap-2 bg-white/90 backdrop-blur-sm border border-blue-100 rounded-xl xs:rounded-2xl px-2 xs:px-3 py-1.5 xs:py-2 shadow-sm min-w-0">
                  <div className="w-0.5 xs:w-1 self-stretch rounded-full bg-blue-600 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[10px] xs:text-xs font-semibold text-blue-900 leading-tight truncate">
                      AI Property Match
                    </p>
                    <p className="text-[8px] xs:text-[10px] text-muted-foreground leading-tight mt-0.5 truncate">
                      Exact fit for your needs
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-1.5 xs:gap-2 bg-white/90 backdrop-blur-sm border border-blue-100 rounded-xl xs:rounded-2xl px-2 xs:px-3 py-1.5 xs:py-2 shadow-sm min-w-0">
                  <div className="w-0.5 xs:w-1 self-stretch rounded-full bg-blue-600 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[10px] xs:text-xs font-semibold text-blue-900 leading-tight truncate">
                      Verified Listings Only
                    </p>
                    <p className="text-[8px] xs:text-[10px] text-muted-foreground leading-tight mt-0.5 truncate">
                      No fake or expired posts
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-1.5 xs:gap-2 bg-white/90 backdrop-blur-sm border border-green-100 rounded-xl xs:rounded-2xl px-2 xs:px-3 py-1.5 xs:py-2 shadow-sm min-w-0">
                  <div className="w-0.5 xs:w-1 self-stretch rounded-full bg-green-600 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[10px] xs:text-xs font-semibold text-green-900 leading-tight truncate">
                      No Hidden Charges
                    </p>
                    <p className="text-[8px] xs:text-[10px] text-muted-foreground leading-tight mt-0.5 truncate">
                      Transparent pricing, no surprises
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-1.5 xs:gap-2 bg-white/90 backdrop-blur-sm border border-orange-100 rounded-xl xs:rounded-2xl px-2 xs:px-3 py-1.5 xs:py-2 shadow-sm min-w-0">
                  <div className="w-0.5 xs:w-1 self-stretch rounded-full bg-orange-500 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[10px] xs:text-xs font-semibold text-orange-900 leading-tight truncate">
                      Instant PDF Brochure
                    </p>
                    <p className="text-[8px] xs:text-[10px] text-muted-foreground leading-tight mt-0.5 truncate">
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
              className="relative w-36 h-44 xs:w-44 xs:h-52 sm:w-64 sm:h-72 md:w-[21rem] md:h-[25rem] lg:w-[28rem] lg:h-[34rem] overflow-hidden rounded-t-[5rem] xs:rounded-t-[6rem] sm:rounded-t-[10rem] md:rounded-t-[12rem] border-4 sm:border-6 md:border-8 border-border shadow-lg"
            >
              <Image
                src="/hero1.png"
                alt="tricity property platform"
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

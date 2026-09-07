import React, { useRef } from "react";
import {
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Home,
  ArrowRight,
  MapPin,
} from "lucide-react";
import { trendingLocalitiesData } from "../../data/Localities.js";

const BRAND = "#4161df";
const INK = "#161A2E";
const INK_SOFT = "#5C5F73";
const TINT_BG = "#EEF1FC";
const TINT_LINE = "#DCE1F7";

interface Locality {
  id: number;
  name: string;
  city: string;
  region: string;
  rank: number;
  badge: string;
  avgPrice: string;
  priceChange: string;
  pricePositive: boolean;
  demand: string;
  listings: number;
  score: number;
  tag: string;
  imageUrl: string;
  imageAlt: string;
}

export default function TrendingLocalities() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const { scrollLeft } = scrollContainerRef.current;
      const scrollTo =
        direction === "left" ? scrollLeft - 220 : scrollLeft + 220;
      scrollContainerRef.current.scrollTo({
        left: scrollTo,
        behavior: "smooth",
      });
    }
  };

  return (
    <section
      className="w-full py-10 sm:py-12"
      style={{ background: "#F9FAFC" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-end justify-between gap-3 mb-5">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span
                className="h-[3px] w-6 rounded-full"
                style={{ background: BRAND }}
              />
              <span
                className="text-xs font-semibold uppercase tracking-wide"
                style={{ color: BRAND }}
              >
                Trending localities
              </span>
            </div>
            <h2
              className="text-lg sm:text-xl font-bold tracking-tight"
              style={{ color: INK }}
            >
              Where Tricity is buying right now
            </h2>
            <p
              className="text-xs sm:text-[13px] mt-1"
              style={{ color: INK_SOFT }}
            >
              Most searched sectors and investment hubs, updated weekly
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              className="text-xs font-semibold hidden sm:flex items-center gap-1 transition-colors"
              style={{ color: BRAND }}
            >
              See all
              <ArrowRight className="w-3 h-3" />
            </button>
            <div className="flex gap-1.5">
              <button
                onClick={() => scroll("left")}
                className="p-1.5 bg-white rounded-full shadow-sm transition-all active:scale-95"
                style={{ border: `1px solid ${TINT_LINE}`, color: INK_SOFT }}
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => scroll("right")}
                className="p-1.5 bg-white rounded-full shadow-sm transition-all active:scale-95"
                style={{ border: `1px solid ${TINT_LINE}`, color: INK_SOFT }}
                aria-label="Scroll right"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Scrollable card row */}
        <div className="relative -mx-4 sm:mx-0">
          {/* Edge fades hint that the row scrolls */}
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-4 sm:w-6 bg-gradient-to-r from-[#F9FAFC] to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-4 sm:w-6 bg-gradient-to-l from-[#F9FAFC] to-transparent" />

          <div
            ref={scrollContainerRef}
            className="flex gap-3 overflow-x-auto scroll-smooth pb-2 px-4 sm:px-0 snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {trendingLocalitiesData.map((locality: Locality) => (
              <div
                key={locality.id}
                className="min-w-[168px] sm:min-w-[184px] max-w-[184px] bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 group snap-start overflow-hidden flex flex-col cursor-pointer"
                style={{ border: `1px solid ${TINT_LINE}` }}
              >
                {/* Image */}
                <div
                  className="h-24 w-full relative overflow-hidden"
                  style={{ background: TINT_BG }}
                >
                  <img
                    src={locality.imageUrl}
                    alt={locality.imageAlt}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />

                  {locality.badge && (
                    <span className="absolute top-1.5 left-1.5 bg-rose-500 text-white text-[9px] uppercase tracking-wide font-bold px-1.5 py-0.5 rounded-md">
                      {locality.badge}
                    </span>
                  )}

                  <span
                    className={`absolute top-1.5 right-1.5 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md flex items-center gap-0.5 ${
                      locality.pricePositive ? "bg-emerald-500" : "bg-rose-500"
                    }`}
                  >
                    {locality.pricePositive ? (
                      <TrendingUp className="w-2.5 h-2.5" />
                    ) : (
                      <TrendingDown className="w-2.5 h-2.5" />
                    )}
                    {locality.priceChange}
                  </span>

                  <span className="absolute bottom-1.5 left-1.5 flex items-center gap-1 bg-black/45 backdrop-blur-sm text-white text-[9px] font-medium px-1.5 py-0.5 rounded-md">
                    <MapPin className="w-2.5 h-2.5" />
                    {locality.tag}
                  </span>
                </div>

                {/* Content */}
                <div className="p-2.5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start gap-1">
                      <div className="min-w-0">
                        <h3
                          className="text-[13px] font-bold leading-tight truncate transition-colors duration-200"
                          style={{ color: INK }}
                        >
                          {locality.name}
                        </h3>
                        <p
                          className="text-[11px] mt-0.5 capitalize truncate"
                          style={{ color: INK_SOFT }}
                        >
                          {locality.city}
                        </p>
                      </div>
                      <span
                        className="shrink-0 inline-flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-md"
                        style={{ background: TINT_BG, color: BRAND }}
                      >
                        ★ {locality.score}
                      </span>
                    </div>

                    <div
                      className="mt-2 pt-2 flex items-center justify-between"
                      style={{ borderTop: `1px solid ${TINT_LINE}` }}
                    >
                      <div>
                        <span
                          className="block text-[9px] uppercase font-semibold tracking-wide"
                          style={{ color: INK_SOFT }}
                        >
                          Avg price
                        </span>
                        <span
                          className="text-[13px] font-extrabold"
                          style={{ color: INK }}
                        >
                          {locality.avgPrice}
                          <span
                            className="text-[9px] font-normal"
                            style={{ color: INK_SOFT }}
                          >
                            /sf
                          </span>
                        </span>
                      </div>

                      <div className="text-right flex flex-col items-end justify-center gap-0.5">
                        <span
                          className="p-1 rounded-md"
                          style={{ background: TINT_BG, color: BRAND }}
                        >
                          <Home className="w-3 h-3" />
                        </span>
                        <span
                          className="text-[10px] font-semibold"
                          style={{ color: INK_SOFT }}
                        >
                          {locality.listings} units
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Explore — always visible so it reads fine on touch devices too */}
                  <div
                    className="mt-2 pt-1.5 flex items-center justify-between"
                    style={{ borderTop: `1px dashed ${TINT_LINE}` }}
                  >
                    <span
                      className="text-[10px] font-semibold"
                      style={{ color: BRAND }}
                    >
                      Explore
                    </span>
                    <div
                      className="p-1 rounded-full transition-all duration-300 group-hover:translate-x-0.5"
                      style={{ background: TINT_BG, color: BRAND }}
                    >
                      <ArrowRight className="w-3 h-3" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile-only See all */}
        <div className="w-full mt-3 sm:hidden">
          <button
            className="w-full text-xs font-semibold py-2 rounded-xl"
            style={{ background: TINT_BG, color: BRAND }}
          >
            See all localities
          </button>
        </div>
      </div>
    </section>
  );
}

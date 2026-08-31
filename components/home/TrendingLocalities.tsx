import React, { useRef } from "react";
import {
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Home,
  ArrowRight,
} from "lucide-react";
import { trendingLocalitiesData } from "../../data/Localities.js";

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
        direction === "left" ? scrollLeft - 240 : scrollLeft + 240;
      scrollContainerRef.current.scrollTo({
        left: scrollTo,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="w-full py-6 bg-[#F8FAFC]">
      <div className="max-w-full mx-auto px-6 sm:px-6 lg:px-8">
        {/* Header Block Row */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-[#0F172A] tracking-tight">
              Trending Localities
            </h2>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Most searched sectors and investment hubs across the Tricity
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button className="text-[11px] font-bold text-[#4161DF] hover:text-blue-700 transition-colors hidden sm:block">
              See All
            </button>
            <div className="flex gap-1">
              <button
                onClick={() => scroll("left")}
                className="p-1 bg-white rounded-md border border-slate-200 hover:border-slate-300 shadow-xs transition-all text-slate-700 active:scale-95"
                aria-label="Scroll Left"
              >
                <ChevronLeft className="w-3 h-3" />
              </button>
              <button
                onClick={() => scroll("right")}
                className="p-1 bg-white rounded-md border border-slate-200 hover:border-slate-300 shadow-xs transition-all text-slate-700 active:scale-95"
                aria-label="Scroll Right"
              >
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        {/* Ultra-Compact Horizontal Scrollable Slider */}
        <div
          ref={scrollContainerRef}
          className="flex gap-3.5 overflow-x-auto no-scrollbar scroll-smooth pb-2 snap-x mandatory"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {trendingLocalitiesData.map((locality: Locality) => (
            <div
              key={locality.id}
              className="min-w-[210px] sm:min-w-[220px] bg-white rounded-xl border border-slate-100 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.02)] hover:shadow-[0_6px_16px_-6px_rgba(0,0,0,0.05)] transition-all duration-300 group snap-start overflow-hidden flex flex-col cursor-pointer"
            >
              {/* Image Frame Holder with Zoom Effect - Height reduced to h-26 */}
              <div className="h-26 w-full bg-slate-200 relative overflow-hidden">
                <img
                  src={locality.imageUrl}
                  alt={locality.imageAlt}
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500 ease-out"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                {/* Dynamic Condition Status Badge */}
                {locality.badge && (
                  <div className="absolute top-1.5 left-1.5 bg-red-500 text-white text-[8px] uppercase tracking-wider font-extrabold px-1 rounded-sm shadow-xs">
                    {locality.badge}
                  </div>
                )}

                {/* Performance PriceChange Indicator Gauge */}
                <div
                  className={`absolute top-1.5 right-1.5 text-white text-[9px] font-bold px-1 py-0.5 rounded-md flex items-center gap-0.5 shadow-xs ${
                    locality.pricePositive ? "bg-emerald-500" : "bg-rose-500"
                  }`}
                >
                  {locality.pricePositive ? (
                    <TrendingUp className="w-2 h-2" />
                  ) : (
                    <TrendingDown className="w-2 h-2" />
                  )}
                  {locality.priceChange}
                </div>

                {/* Category Micro Tag Pill Overlay */}
                <div className="absolute bottom-1.5 left-1.5 bg-black/40 backdrop-blur-xs text-white text-[8px] font-medium px-1.5 py-0.5 rounded-sm">
                  {locality.tag}
                </div>
              </div>

              {/* Tightened Specifications Payload */}
              <div className="p-2.5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start gap-1">
                    <div>
                      <h3 className="text-xs+ font-bold text-[#0F172A] group-hover:text-[#4161DF] transition-colors duration-200 line-clamp-1 tracking-tight">
                        {locality.name}
                      </h3>
                      <p className="text-[10px] font-medium text-slate-400 mt-0.5 capitalize">
                        {locality.city}
                      </p>
                    </div>
                    <div className="shrink-0">
                      <span className="inline-block text-[8px] font-bold px-1 bg-slate-50 text-slate-600 rounded-sm border border-slate-100">
                        ★ {locality.score}
                      </span>
                    </div>
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="block text-[8px] uppercase font-bold tracking-wider text-slate-400">
                        Avg Price
                      </span>
                      <span className="text-xs+ font-black text-[#0F172A]">
                        {locality.avgPrice}
                        <span className="text-[8px] text-slate-400 font-normal">
                          /sf
                        </span>
                      </span>
                    </div>

                    <div className="text-right flex flex-col items-end justify-center">
                      <span className="p-0.5 bg-blue-50 rounded-xs text-[#4161DF] mb-0.5">
                        <Home className="w-2.5 h-2.5" />
                      </span>
                      <span className="text-[9px] font-bold text-slate-600">
                        {locality.listings} units
                      </span>
                    </div>
                  </div>
                </div>

                {/* 🚀 Sleek Ultra-Minimal Explore Button Element */}
                <div className="mt-2 pt-1.5 border-t border-dashed border-slate-100 flex items-center justify-between text-[#4161DF]">
                  <span className="text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Explore
                  </span>
                  <div className="p-1 rounded-full bg-slate-50 border border-slate-100 transition-all duration-300 group-hover:bg-[#4161DF] group-hover:text-white group-hover:border-[#4161DF] group-hover:translate-x-0.5">
                    <ArrowRight className="w-2.5 h-2.5" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile-Only See All Button trigger */}
        <div className="w-full mt-1 sm:hidden text-center">
          <button className="text-[11px] font-bold text-[#4161DF] bg-blue-50/40 w-full py-1.5 rounded-lg">
            See All Localities
          </button>
        </div>
      </div>
    </section>
  );
}

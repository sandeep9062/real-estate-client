"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Building,
  Search,
  ShieldCheck,
  MapPin,
  ChevronRight,
  Award,
  Star,
  Calendar,
  BadgeCheck,
  Users,
  Zap,
  Home,
  ChevronDown,
  Sparkles,
  ArrowRight,
  Shield,
  Filter,
  X,
} from "lucide-react";

interface DevelopersContentProps {
  initialDevelopers: any[];
}

export default function DevelopersContent({
  initialDevelopers,
}: DevelopersContentProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("All");
  const [topRatedOnly, setTopRatedOnly] = useState(false);

  // Derive dynamic stats from actual data
  const stats = useMemo(() => {
    if (!initialDevelopers || initialDevelopers.length === 0)
      return { verified: 0, projects: 0, cities: 3, established: 0 };
    const verified = initialDevelopers.filter((d: any) => d.isVerified).length;
    const projects = initialDevelopers.reduce(
      (acc: number, d: any) => acc + (d.projectCount || 0),
      0,
    );
    // Collect unique cities
    const citySet = new Set<string>();
    initialDevelopers.forEach((d: any) => {
      if (d.cities && Array.isArray(d.cities)) {
        d.cities.forEach((c: string) => citySet.add(c));
      }
      if (d.headquarters) citySet.add(d.headquarters);
    });
    // Find earliest established year
    const years = initialDevelopers
      .filter((d: any) => d.establishedYear)
      .map((d: any) => d.establishedYear);
    const maxYear = years.length ? Math.max(...years) : 0;
    const experience = maxYear ? new Date().getFullYear() - maxYear : 10;

    return {
      verified,
      projects,
      cities: citySet.size || 3,
      established: experience,
    };
  }, [initialDevelopers]);

  // Unique cities for filter dropdown
  const allCities = useMemo(() => {
    const cities = new Set<string>();
    initialDevelopers?.forEach((d: any) => {
      if (d.cities && Array.isArray(d.cities)) {
        d.cities.forEach((c: string) => cities.add(c));
      }
      if (d.headquarters) cities.add(d.headquarters);
    });
    return ["All", ...Array.from(cities).sort()];
  }, [initialDevelopers]);

  const filteredDevelopers = useMemo(() => {
    if (!initialDevelopers || initialDevelopers.length === 0) return [];
    let result = [...initialDevelopers];

    // Top rated filter
    if (topRatedOnly) {
      result = result.filter((dev: any) => dev.rating >= 4.5);
    }

    // Location filter
    if (locationFilter !== "All") {
      result = result.filter(
        (dev: any) =>
          (dev.cities &&
            Array.isArray(dev.cities) &&
            dev.cities.includes(locationFilter)) ||
          dev.headquarters === locationFilter,
      );
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (dev: any) =>
          dev.name?.toLowerCase().includes(q) ||
          dev.headquarters?.toLowerCase().includes(q) ||
          dev.shortDescription?.toLowerCase().includes(q) ||
          dev.description?.toLowerCase().includes(q) ||
          (dev.cities &&
            dev.cities.some((c: string) => c.toLowerCase().includes(q))),
      );
    }

    return result;
  }, [initialDevelopers, searchQuery, locationFilter, topRatedOnly]);

  const hasDevelopers = initialDevelopers && initialDevelopers.length > 0;

  return (
    <div
      className="min-h-screen bg-[#f9fafb]"
      style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
    >
      {/* ── HERO SECTION ── */}
      <div
        className="relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #1e3a5f 0%, #4161df 100%)",
        }}
      >
        {/* Dot grid */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        {/* Decorative circles */}
        {[
          { size: 350, top: -120, left: -100, op: 0.06 },
          { size: 250, top: 30, right: -80, op: 0.08 },
          { size: 180, bottom: -80, left: "35%", op: 0.05 },
          { size: 120, bottom: 60, right: "15%", op: 0.07 },
        ].map((c, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              width: c.size,
              height: c.size,
              borderRadius: "50%",
              background: "white",
              opacity: c.op,
              top: c.top,
              left: c.left,
              right: c.right,
              bottom: c.bottom,
            }}
          />
        ))}

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
          {/* Eyebrow badge */}
          <div className="flex justify-center mb-5">
            <span
              className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase px-4 py-2 rounded-full"
              style={{
                background: "rgba(255,255,255,0.12)",
                border: "1px solid rgba(255,255,255,0.20)",
                color: "rgba(255,255,255,0.9)",
                letterSpacing: "0.1em",
              }}
            >
              <Shield size={12} style={{ color: "rgba(255,255,255,0.7)" }} />{" "}
              Verified by PropertyBulbul
            </span>
          </div>

          {/* Title with animated underline */}
          <h1 className="text-center text-4xl sm:text-5xl md:text-6xl font-black text-white leading-[1.05] mb-4">
            Top Developers in{" "}
            <span className="relative">
              <span style={{ color: "#93a8f8" }}>Tricity</span>
              <svg
                className="absolute -bottom-1 left-0 w-full"
                viewBox="0 0 300 10"
                fill="none"
                style={{ height: "8px" }}
              >
                <path
                  d="M2 6 Q75 2 150 6 Q225 9 298 4"
                  stroke="#4161df"
                  strokeWidth="3"
                  strokeLinecap="round"
                  opacity="0.7"
                />
              </svg>
            </span>
          </h1>

          <p
            className="text-center text-base sm:text-lg max-w-xl mx-auto mb-10 leading-relaxed"
            style={{ color: "rgba(255,255,255,0.8)" }}
          >
            Discover premium real estate projects from the most trusted and
            verified developers across Chandigarh, Mohali & Panchkula.
          </p>

          {/* Stats row */}
          {hasDevelopers && (
            <div className="flex flex-wrap justify-center gap-8 mb-10">
              {[
                {
                  icon: <ShieldCheck size={18} />,
                  val: `${stats.verified}+`,
                  lab: "Verified Developers",
                },
                {
                  icon: <Building size={18} />,
                  val: `${stats.projects}+`,
                  lab: "Total Projects",
                },
                {
                  icon: <MapPin size={18} />,
                  val: `${stats.cities}`,
                  lab: "Cities Covered",
                },
                {
                  icon: <Zap size={18} />,
                  val: `${stats.established}+`,
                  lab: "Years Experience",
                },
              ].map((s) => (
                <div key={s.lab} className="flex items-center gap-2.5">
                  <span style={{ color: "rgba(255,255,255,0.7)" }}>
                    {s.icon}
                  </span>
                  <div>
                    <p className="text-white font-black text-lg leading-none">
                      {s.val}
                    </p>
                    <p
                      className="text-xs font-medium"
                      style={{ color: "rgba(255,255,255,0.5)" }}
                    >
                      {s.lab}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Search */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search developers by name, city, or description..."
                className="w-full pl-11 pr-4 py-4 rounded-2xl bg-white text-sm text-gray-800 shadow-xl focus:outline-none focus:ring-2 focus:ring-[#4161df]/40 placeholder-gray-400 font-medium"
              />
            </div>
          </div>
        </div>

        {/* Bottom wave */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0]">
          <svg
            viewBox="0 0 1440 40"
            preserveAspectRatio="none"
            className="w-full h-8 fill-[#f9fafb]"
          >
            <path d="M0,24 C480,40 960,8 1440,24 L1440,40 L0,40 Z" />
          </svg>
        </div>
      </div>

      {/* ── FILTERS SECTION ── */}
      {hasDevelopers && (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex flex-wrap gap-3 items-center">
            {/* Top rated toggle */}
            <button
              onClick={() => setTopRatedOnly(!topRatedOnly)}
              className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full border-2 text-sm font-bold transition-all duration-150 ${
                topRatedOnly
                  ? "border-amber-400 bg-amber-50 text-amber-700"
                  : "border-gray-200 bg-white text-gray-600 hover:border-amber-300"
              }`}
            >
              <Sparkles size={13} /> Top Rated Only
            </button>

            {/* Location filter */}
            <div className="relative">
              <MapPin
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <select
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="pl-8 pr-8 py-2.5 rounded-full border-2 border-gray-200 bg-white text-sm font-bold text-gray-700 focus:outline-none focus:border-[#4161df] appearance-none cursor-pointer"
              >
                {allCities.map((city) => (
                  <option key={city}>{city}</option>
                ))}
              </select>
              <ChevronDown
                size={14}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />
            </div>

            {/* Results count */}
            <span className="ml-auto text-sm text-gray-400 font-semibold">
              {filteredDevelopers.length} developer
              {filteredDevelopers.length !== 1 ? "s" : ""} found
            </span>
          </div>
        </div>
      )}

      {/* ── DEVELOPERS GRID ── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-20">
        {hasDevelopers && filteredDevelopers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDevelopers.map((dev: any, index: number) => (
              <Link key={dev._id} href={`/developers/${dev._id}`}>
                <div
                  className="group relative bg-white border-2 border-gray-100 rounded-2xl p-6 hover:shadow-xl hover:border-[#4161df]/20 transition-all duration-300 text-center flex flex-col items-center h-full"
                  style={{
                    animation: `fadeSlideUp 0.4s ease-out ${index * 60}ms both`,
                  }}
                >
                  {/* Verified Badge */}
                  {dev.isVerified && (
                    <div className="absolute top-3 right-3 z-10">
                      <div className="bg-gradient-to-br from-[#4161df] to-[#3456df] p-1.5 rounded-full shadow-lg shadow-[#4161df]/20">
                        <ShieldCheck
                          className="w-3.5 h-3.5 text-white"
                          fill="currentColor"
                        />
                      </div>
                    </div>
                  )}

                  {/* Featured Badge */}
                  {dev.featured && (
                    <div className="absolute top-3 left-3 z-10">
                      <div className="bg-gradient-to-br from-amber-400 to-amber-500 px-2.5 py-1 rounded-full shadow-lg shadow-amber-500/20">
                        <span className="text-[10px] font-bold text-white">
                          ⭐ Featured
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Logo Container with glass effect */}
                  <div className="relative w-28 h-28 mb-4 flex items-center justify-center">
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border border-gray-200/50" />
                    <div className="relative w-24 h-24 flex items-center justify-center p-2">
                      {dev.logo ? (
                        <Image
                          src={dev.logo}
                          alt={dev.name}
                          fill
                          className="object-contain group-hover:scale-110 transition-transform duration-500"
                          sizes="96px"
                        />
                      ) : (
                        <div className="w-full h-full rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
                          <Building className="w-12 h-12 text-blue-300" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Developer Name */}
                  <h3 className="font-bold text-gray-800 group-hover:text-[#4161df] transition-colors text-base md:text-lg mb-1">
                    {dev.name}
                  </h3>

                  {/* Rating */}
                  {dev.rating > 0 && (
                    <div className="flex items-center gap-1.5 mb-2">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      </div>
                      <span className="text-sm font-bold text-gray-700">
                        {dev.rating.toFixed(1)}
                      </span>
                      {dev.totalReviews > 0 && (
                        <span className="text-xs text-gray-400">
                          ({dev.totalReviews} reviews)
                        </span>
                      )}
                    </div>
                  )}

                  {/* Short Description / Tagline */}
                  {dev.shortDescription && (
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed px-2">
                      {dev.shortDescription}
                    </p>
                  )}

                  {/* Details row */}
                  <div className="flex flex-wrap items-center justify-center gap-3 mt-3 pt-3 border-t border-gray-100 w-full">
                    {dev.projectCount > 0 && (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-500">
                        <Building className="w-3.5 h-3.5 text-gray-400" />
                        {dev.projectCount} project
                        {dev.projectCount !== 1 ? "s" : ""}
                      </span>
                    )}
                    {dev.establishedYear && (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-500">
                        <Calendar className="w-3.5 h-3.5 text-gray-400" />
                        Est. {dev.establishedYear}
                      </span>
                    )}
                  </div>

                  {/* CTA */}
                  <div className="mt-auto pt-3 w-full">
                    <div className="inline-flex items-center gap-1 text-sm font-semibold text-[#4161df] bg-[#eef1fd] px-4 py-2 rounded-xl group-hover:bg-[#4161df] group-hover:text-white transition-all duration-300">
                      View Profile
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : hasDevelopers && filteredDevelopers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-black text-gray-800 mb-2">
              No developers match your filters
            </h3>
            <p className="text-gray-400 text-sm mb-6">
              Try broadening your location or search query
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setLocationFilter("All");
                setTopRatedOnly(false);
              }}
              className="px-6 py-3 rounded-2xl bg-[#4161df] text-white font-bold text-sm hover:bg-[#3456df] transition shadow-lg shadow-[#4161df]/20"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="text-6xl mb-4">🏗️</div>
            <h3 className="text-xl font-black text-gray-800 mb-2">
              No developers found
            </h3>
            <p className="text-gray-400 text-sm mb-6">
              Developers are being onboarded. Check back soon!
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#4161df] text-white font-bold text-sm hover:bg-[#3456df] transition shadow-lg shadow-[#4161df]/20"
            >
              Register as a Developer <ArrowRight size={16} />
            </Link>
          </div>
        )}
      </div>

      {/* ── CTA BANNER ── */}
      <div
        className="py-14 px-4"
        style={{
          background: "linear-gradient(135deg, #1e3a5f 0%, #4161df 100%)",
        }}
      >
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-black text-white mb-3">
            Are You a Real Estate Developer?
          </h2>
          <p className="text-[#93a8f8] text-sm sm:text-base mb-8 leading-relaxed max-w-xl mx-auto">
            List your projects on PropertyBulbul and reach thousands of
            potential buyers actively searching for properties in Tricity.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="/contact"
              className="inline-flex items-center justify-center gap-2 bg-white text-[#4161df] font-black text-sm px-8 py-4 rounded-2xl shadow-lg hover:bg-gray-50 hover:scale-105 transition-all duration-200"
            >
              Get in Touch <ArrowRight size={16} />
            </a>
            <a
              href="/contact"
              className="inline-flex items-center justify-center gap-2 bg-white/15 border-2 border-white/30 text-white font-bold text-sm px-8 py-4 rounded-2xl hover:bg-white/25 transition-all duration-200"
            >
              Learn More
            </a>
          </div>
        </div>
      </div>

      {/* Animation styles */}
      <style jsx>{`
        @keyframes fadeSlideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

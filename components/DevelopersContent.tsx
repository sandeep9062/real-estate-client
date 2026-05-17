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
} from "lucide-react";

interface DevelopersContentProps {
  initialDevelopers: any[];
}

export default function DevelopersContent({
  initialDevelopers,
}: DevelopersContentProps) {
  const [searchQuery, setSearchQuery] = useState("");

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

  const filteredDevelopers = useMemo(() => {
    if (!initialDevelopers || initialDevelopers.length === 0) return [];
    if (!searchQuery.trim()) return initialDevelopers;
    const q = searchQuery.toLowerCase();
    return initialDevelopers.filter(
      (dev: any) =>
        dev.name?.toLowerCase().includes(q) ||
        dev.headquarters?.toLowerCase().includes(q) ||
        dev.shortDescription?.toLowerCase().includes(q) ||
        dev.description?.toLowerCase().includes(q) ||
        (dev.cities &&
          dev.cities.some((c: string) => c.toLowerCase().includes(q))),
    );
  }, [initialDevelopers, searchQuery]);

  const hasDevelopers = initialDevelopers && initialDevelopers.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0a1628] via-[#1a2a4a] to-[#0a1628] pt-20 pb-16 md:pt-28 md:pb-20">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/10 rounded-full px-4 py-1.5 mb-6">
              <Award className="w-4 h-4 text-yellow-400" />
              <span className="text-white/80 text-sm font-medium">
                Trusted Developers in Tricity
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 tracking-tight">
              Top Developers in{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                Tricity
              </span>
            </h1>
            <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto mb-8 leading-relaxed">
              Discover premium real estate projects from the most trusted and
              verified developers across Chandigarh, Mohali & Panchkula.
            </p>

            {/* Search Bar */}
            <div className="relative max-w-xl mx-auto">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search developers by name, city, or description..."
                className="w-full pl-12 pr-4 py-3.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Quick Stats - now driven by actual data */}
          {hasDevelopers && (
            <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
              {[
                {
                  label: "Verified Developers",
                  value: stats.verified,
                  icon: ShieldCheck,
                },
                {
                  label: "Total Projects",
                  value: stats.projects,
                  icon: Building,
                },
                {
                  label: "Cities Covered",
                  value: stats.cities,
                  icon: MapPin,
                },
                {
                  label: "Years Experience",
                  value: stats.established,
                  icon: Calendar,
                  suffix: "+",
                },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 text-center"
                >
                  <stat.icon className="w-5 h-5 text-blue-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">
                    {stat.value}
                    {stat.suffix || "+"}
                  </div>
                  <div className="text-xs text-gray-400 mt-0.5">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Developers Grid */}
      {hasDevelopers && (
        <section className="max-w-7xl mx-auto px-4 py-16">
          {/* Section Header */}
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                {searchQuery ? "Search Results" : "All Developers"}
              </h2>
              <p className="text-gray-500 mt-1">
                {filteredDevelopers.length} developer
                {filteredDevelopers.length !== 1 ? "s" : ""} found
              </p>
            </div>
          </div>

          {filteredDevelopers.length === 0 ? (
            <div className="text-center py-20">
              <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-1">
                No developers found
              </h3>
              <p className="text-gray-400 text-sm">
                Try adjusting your search query
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredDevelopers.map((dev: any, index: number) => (
                <Link key={dev._id} href={`/developers/${dev._id}`}>
                  <div
                    className="group relative bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-xl hover:border-blue-100 transition-all duration-300 text-center flex flex-col items-center"
                    style={{
                      animationDelay: `${index * 50}ms`,
                    }}
                  >
                    {/* Verified Badge */}
                    {dev.isVerified && (
                      <div className="absolute top-3 right-3">
                        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-1.5 rounded-full shadow-lg shadow-blue-500/20">
                          <ShieldCheck
                            className="w-3.5 h-3.5 text-white"
                            fill="currentColor"
                          />
                        </div>
                      </div>
                    )}

                    {/* Featured Badge */}
                    {dev.featured && (
                      <div className="absolute top-3 left-3">
                        <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 px-2 py-0.5 rounded-full shadow-lg shadow-yellow-500/20">
                          <span className="text-[10px] font-bold text-white">
                            Featured
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Logo Container */}
                    <div className="relative w-24 h-24 mb-4 flex items-center justify-center">
                      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl" />
                      <div className="relative w-20 h-20 flex items-center justify-center">
                        {dev.logo ? (
                          <Image
                            src={dev.logo}
                            alt={dev.name}
                            fill
                            className="object-contain group-hover:scale-110 transition-transform duration-500"
                            sizes="80px"
                          />
                        ) : (
                          <Building className="w-10 h-10 text-gray-300" />
                        )}
                      </div>
                    </div>

                    {/* Developer Name */}
                    <h3 className="font-bold text-gray-800 group-hover:text-blue-600 transition-colors text-sm md:text-base">
                      {dev.name}
                    </h3>

                    {/* Short Description / Tagline */}
                    {dev.shortDescription && (
                      <p className="text-xs text-gray-400 mt-1 line-clamp-2 leading-relaxed">
                        {dev.shortDescription}
                      </p>
                    )}

                    {/* Rating */}
                    {dev.rating > 0 && (
                      <div className="flex items-center gap-1 mt-2">
                        <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs font-medium text-gray-600">
                          {dev.rating.toFixed(1)}
                        </span>
                        {dev.totalReviews > 0 && (
                          <span className="text-xs text-gray-400">
                            ({dev.totalReviews})
                          </span>
                        )}
                      </div>
                    )}

                    {/* Project Count */}
                    {dev.projectCount > 0 && (
                      <p className="text-xs text-gray-400 mt-1.5 flex items-center gap-1">
                        <Building className="w-3 h-3" />
                        {dev.projectCount} project
                        {dev.projectCount !== 1 ? "s" : ""}
                      </p>
                    )}

                    {/* Established Year */}
                    {dev.establishedYear && (
                      <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Est. {dev.establishedYear}
                      </p>
                    )}

                    {/* CTA */}
                    <div className="mt-3 flex items-center gap-1 text-xs font-medium text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                      View Profile
                      <ChevronRight className="w-3 h-3" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      )}

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-16 mt-8">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Are You a Real Estate Developer?
          </h2>
          <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
            List your projects on PropertyBulbul and reach thousands of
            potential buyers actively searching for properties in Tricity.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center gap-2 bg-white text-blue-600 font-semibold px-8 py-3.5 rounded-xl hover:bg-blue-50 transition-colors shadow-lg"
          >
            Get in Touch
            <ChevronRight className="w-4 h-4" />
          </a>
        </div>
      </section>
    </div>
  );
}

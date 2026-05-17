"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import { ProjectCard } from "@/components/ProjectCard";
import {
  Building,
  Search,
  MapPin,
  Award,
  ChevronRight,
  Building2,
  Layers,
  TrendingUp,
  ArrowRight,
  SlidersHorizontal,
  X,
  Grid3X3,
  List,
  Sparkles,
  LayoutGrid,
  Home,
} from "lucide-react";

interface ProjectsContentProps {
  initialProjects: any[];
}

export default function ProjectsContent({
  initialProjects,
}: ProjectsContentProps) {
  const [selectedCity, setSelectedCity] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState<
    "default" | "price-low" | "price-high" | "name"
  >("default");
  const [visibleCount, setVisibleCount] = useState(6);
  const gridRef = useRef<HTMLDivElement>(null);

  const cities = useMemo(() => {
    if (!initialProjects || initialProjects.length === 0) return [];
    const citySet = new Set<string>();
    initialProjects.forEach((p: any) => {
      if (p.location?.city) citySet.add(p.location.city);
    });
    return Array.from(citySet).sort();
  }, [initialProjects]);

  const filteredProjects = useMemo(() => {
    if (!initialProjects || initialProjects.length === 0) return [];

    let filtered = [...initialProjects];

    // City filter
    if (selectedCity) {
      filtered = filtered.filter((p: any) => p.location?.city === selectedCity);
    }

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p: any) =>
          p.name?.toLowerCase().includes(query) ||
          p.developer?.name?.toLowerCase().includes(query) ||
          p.location?.city?.toLowerCase().includes(query) ||
          p.location?.sector?.toLowerCase().includes(query),
      );
    }

    // Sort
    switch (sortBy) {
      case "price-low":
        filtered.sort((a: any, b: any) => a.pricing?.from - b.pricing?.from);
        break;
      case "price-high":
        filtered.sort((a: any, b: any) => b.pricing?.from - a.pricing?.from);
        break;
      case "name":
        filtered.sort((a: any, b: any) => a.name?.localeCompare(b.name));
        break;
    }

    return filtered;
  }, [initialProjects, selectedCity, searchQuery, sortBy]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    if (!gridRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((prev) =>
            Math.min(prev + 6, filteredProjects.length),
          );
        }
      },
      { threshold: 0.1 },
    );
    const sentinel = gridRef.current;
    if (sentinel) observer.observe(sentinel);
    return () => {
      if (sentinel) observer.unobserve(sentinel);
    };
  }, [filteredProjects.length]);

  const hasProjects = initialProjects && initialProjects.length > 0;

  const StatCard = ({
    icon: Icon,
    label,
    value,
    color,
  }: {
    icon: any;
    label: string;
    value: number;
    color: string;
  }) => (
    <div className="group bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/10 hover:bg-white/20 transition-all duration-300">
      <div
        className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}
      >
        <Icon size={22} className="text-white" />
      </div>
      <p className="text-3xl md:text-4xl font-bold text-white mb-1">
        {value.toLocaleString()}
      </p>
      <p className="text-blue-200 text-sm">{label}</p>
    </div>
  );

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-16 md:pt-20">
        <div className="relative max-w-7xl mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-6">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-black mb-2 tracking-tight">
              New Projects in{" "}
              <span className="text-transparent bg-clip-text bg-[#4161df]">
                Tricity
              </span>
            </h1>
            <p className="text-gray-600 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
              Explore premium townships, luxury high-rises, and upcoming
              residential developments across Chandigarh, Mohali & Panchkula.
            </p>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      {hasProjects && (
        <section className="max-w-7xl mx-auto px-4 py-6">
          {/* Search & Filter Bar */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-3 mb-6">
            <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center">
              {/* Search */}
              <div className="relative flex-1">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  placeholder="Search by project name, developer, or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 bg-gray-50 text-xs outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              {/* City Filter */}
              <div className="relative min-w-[180px]">
                <MapPin
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full pl-9 pr-8 py-2 rounded-xl border border-gray-200 bg-gray-50 text-xs outline-none focus:ring-2 focus:ring-[#4161df] focus:border-transparent transition-all appearance-none cursor-pointer"
                >
                  <option value="">All Cities</option>
                  {cities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
                <ChevronRight
                  size={14}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none rotate-90"
                />
              </div>

              {/* Sort */}
              <div className="relative min-w-[160px]">
                <TrendingUp
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="w-full pl-9 pr-8 py-2 rounded-xl border border-gray-200 bg-gray-50 text-xs outline-none focus:ring-2 focus:ring-[#4161df] focus:border-transparent transition-all appearance-none cursor-pointer"
                >
                  <option value="default">Default Order</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name">Name: A-Z</option>
                </select>
                <ChevronRight
                  size={14}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none rotate-90"
                />
              </div>

              {/* View Toggle */}
              <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === "grid"
                      ? "bg-white shadow-sm text-[#4161df]"
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                  aria-label="Grid view"
                >
                  <LayoutGrid size={16} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === "list"
                      ? "bg-white shadow-sm text-[#4161df]"
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                  aria-label="List view"
                >
                  <List size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Results Header */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                {selectedCity ? `Projects in ${selectedCity}` : "All Projects"}
              </h2>
              <p className="text-gray-500 mt-0.5 flex items-center gap-1.5 text-xs">
                <Layers size={12} />
                <span>
                  {filteredProjects.length} project
                  {filteredProjects.length !== 1 ? "s" : ""} found
                  {(searchQuery || selectedCity) && (
                    <button
                      onClick={() => {
                        setSearchQuery("");
                        setSelectedCity("");
                        setSortBy("default");
                      }}
                      className="ml-2 text-blue-600 hover:text-blue-700 underline text-xs"
                    >
                      Clear all filters
                    </button>
                  )}
                </span>
              </p>
            </div>
            {filteredProjects.length > 0 && (
              <span className="hidden md:flex items-center gap-2 text-xs text-gray-400 bg-gray-50 px-3 py-1.5 rounded-full">
                <Home size={12} />
                Showing {Math.min(
                  visibleCount,
                  filteredProjects.length,
                )} of {filteredProjects.length}
              </span>
            )}
          </div>

          {/* No Results */}
          {filteredProjects.length === 0 ? (
            <div className="text-center py-24">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-10 h-10 text-gray-300" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No projects found
              </h3>
              <p className="text-gray-400 max-w-md mx-auto mb-6">
                {searchQuery
                  ? `We couldn't find any projects matching "${searchQuery}". Try adjusting your search or filters.`
                  : "Try selecting a different city or adjusting your filters."}
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCity("");
                  setSortBy("default");
                }}
                className="inline-flex items-center gap-2 bg-[#4161df] text-white font-medium px-6 py-2.5 rounded-xl hover:bg-[#3a56c0] transition-colors shadow-sm"
              >
                <ArrowRight size={16} />
                Reset Filters
              </button>
            </div>
          ) : (
            <>
              {/* Grid View */}
              {viewMode === "grid" && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProjects
                    .slice(0, visibleCount)
                    .map((project: any, index: number) => (
                      <div
                        key={project._id}
                        className="animate-fade-in-up"
                        style={{
                          animationDelay: `${(index % 6) * 75}ms`,
                        }}
                      >
                        <ProjectCard project={project} />
                      </div>
                    ))}
                </div>
              )}

              {/* List View */}
              {viewMode === "list" && (
                <div className="space-y-4">
                  {filteredProjects
                    .slice(0, visibleCount)
                    .map((project: any, index: number) => (
                      <div
                        key={project._id}
                        className="animate-fade-in-up"
                        style={{
                          animationDelay: `${(index % 6) * 75}ms`,
                        }}
                      >
                        <ProjectCard project={project} />
                      </div>
                    ))}
                </div>
              )}

              {/* Load More Sentinel */}
              {visibleCount < filteredProjects.length && (
                <div ref={gridRef} className="flex justify-center mt-8">
                  <button
                    onClick={() =>
                      setVisibleCount((prev) =>
                        Math.min(prev + 6, filteredProjects.length),
                      )
                    }
                    className="inline-flex items-center gap-2 bg-white text-[#4161df] font-medium px-6 py-2.5 rounded-xl border-2 border-[#4161df] hover:border-[#3a56c0] hover:bg-[#f0f4ff] transition-all shadow-sm text-sm"
                  >
                    Load More Projects
                    <ArrowRight size={16} />
                  </button>
                </div>
              )}

              {visibleCount >= filteredProjects.length &&
                filteredProjects.length > 6 && (
                  <p className="text-center text-gray-400 text-xs mt-6">
                    You've viewed all {filteredProjects.length} project
                    {filteredProjects.length !== 1 ? "s" : ""}
                  </p>
                )}
            </>
          )}
        </section>
      )}

      {/* CTA Section */}
      <section className="relative overflow-hidden bg-[#4161df] py-8 mt-8">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white/80 text-sm px-4 py-1.5 rounded-full mb-4 border border-white/10">
            <Sparkles size={14} />
            <span>Partner with us</span>
          </div>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3">
            Want to List Your Project?
          </h2>
          <p className="text-blue-100 text-base mb-6 max-w-2xl mx-auto leading-relaxed">
            Reach thousands of potential buyers actively searching for new
            projects in Tricity. List your project on PropertyBulbul and get
            unparalleled visibility in the real estate market.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="/contact"
              className="inline-flex items-center gap-2 bg-white text-[#4161df] font-semibold px-6 py-3 rounded-xl hover:bg-[#f0f4ff] transition-all shadow-lg hover:shadow-xl"
            >
              Get in Touch
              <ChevronRight className="w-4 h-4" />
            </a>
            <a
              href="/pricing"
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white font-medium px-6 py-3 rounded-xl border border-white/20 hover:bg-white/20 transition-all"
            >
              View Pricing
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

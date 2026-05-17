"use client";

import React, { useState, useMemo } from "react";
import { ProjectCard } from "@/components/ProjectCard";
import { Building, Search, MapPin, Award, ChevronRight } from "lucide-react";

interface ProjectsContentProps {
  initialProjects: any[];
}

export default function ProjectsContent({
  initialProjects,
}: ProjectsContentProps) {
  const [selectedCity, setSelectedCity] = useState("");

  const stats = useMemo(() => {
    if (!initialProjects || initialProjects.length === 0)
      return { total: 0, cities: 0, developers: 0 };

    const citySet = new Set<string>();
    const developerSet = new Set<string>();

    initialProjects.forEach((p: any) => {
      if (p.location?.city) citySet.add(p.location.city);
      if (p.developer?.name) developerSet.add(p.developer.name);
    });

    return {
      total: initialProjects.length,
      cities: citySet.size || 0,
      developers: developerSet.size || 0,
    };
  }, [initialProjects]);

  const filteredProjects = useMemo(() => {
    if (!initialProjects || initialProjects.length === 0) return [];
    if (!selectedCity) return initialProjects;
    return initialProjects.filter(
      (p: any) => p.location?.city === selectedCity,
    );
  }, [initialProjects, selectedCity]);

  // Compute unique cities for the filter dropdown (derived from data)
  const cities = useMemo(() => {
    if (!initialProjects || initialProjects.length === 0) return [];
    const citySet = new Set<string>();
    initialProjects.forEach((p: any) => {
      if (p.location?.city) citySet.add(p.location.city);
    });
    return Array.from(citySet).sort();
  }, [initialProjects]);

  const hasProjects = initialProjects && initialProjects.length > 0;

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
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 tracking-tight">
              New Projects in{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                Tricity
              </span>
            </h1>
            <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto mb-8 leading-relaxed">
              Explore premium townships and luxury high-rises across Chandigarh,
              Mohali & Panchkula.
            </p>
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      {hasProjects && (
        <section className="max-w-7xl mx-auto px-4 py-16">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                {selectedCity ? `Projects in ${selectedCity}` : "All Projects"}
              </h2>
              <p className="text-gray-500 mt-1">
                {filteredProjects.length} project
                {filteredProjects.length !== 1 ? "s" : ""} found
              </p>
            </div>

            {/* City Filter */}
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="border rounded-lg px-4 py-2 text-sm bg-white outline-none focus:ring-2 ring-blue-500"
            >
              <option value="">All Cities</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          {filteredProjects.length === 0 ? (
            <div className="text-center py-20">
              <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-1">
                No projects found
              </h3>
              <p className="text-gray-400 text-sm">
                Try selecting a different city
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {filteredProjects.map((project: any, index: number) => (
                <div
                  key={project._id}
                  style={{
                    animationDelay: `${index * 50}ms`,
                  }}
                >
                  <ProjectCard project={project} />
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-16 mt-8">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Want to List Your Project?
          </h2>
          <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
            Reach thousands of potential buyers actively searching for new
            projects in Tricity. List your project on PropertyBulbul today.
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

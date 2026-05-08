"use client";
import React, { useState } from "react";
import { useGetProjectsQuery } from "../../services/projectsApi";
import { ProjectCard } from "@/components/ProjectCard";

export default function ProjectsPage() {
  const [filters, setFilters] = useState({ city: "", status: "" });
  const { data: projects, isLoading } = useGetProjectsQuery(filters);

  return (
    <div className="max-w-7xl pt-20 mx-auto px-4 py-10">
      <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            New Projects in Tricity
          </h1>
          <p className="text-gray-500">
            Explore premium townships and luxury high-rises
          </p>
        </div>

        <div className="flex gap-3">
          <select
            onChange={(e) => setFilters({ ...filters, city: e.target.value })}
            className="border rounded-lg px-4 py-2 text-sm bg-white outline-none focus:ring-2 ring-blue-500"
          >
            <option value="">All Cities</option>
            <option value="Mohali">Mohali</option>
            <option value="Chandigarh">Chandigarh</option>
            <option value="Zirakpur">Zirakpur</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-xl overflow-hidden border border-gray-100 animate-pulse"
            >
              <div className="aspect-video bg-gray-200" />
              <div className="p-4 space-y-3">
                <div className="h-3 w-1/3 bg-gray-200 rounded" />
                <div className="h-5 w-3/4 bg-gray-200 rounded" />
                <div className="h-3 w-1/2 bg-gray-200 rounded" />
                <div className="border-t pt-4 mt-4 flex justify-between items-center">
                  <div className="space-y-1">
                    <div className="h-3 w-16 bg-gray-200 rounded" />
                    <div className="h-5 w-24 bg-gray-200 rounded" />
                  </div>
                  <div className="h-10 w-28 bg-gray-200 rounded-lg" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {projects?.map((project: any) => (
            <ProjectCard key={project._id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}

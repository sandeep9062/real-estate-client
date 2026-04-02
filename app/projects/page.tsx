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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-gray-200 h-80 rounded-xl" />
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

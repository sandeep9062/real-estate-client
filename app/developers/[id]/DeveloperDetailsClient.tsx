"use client";
import { ProjectCard } from "@/components/ProjectCard";
import { Globe, ShieldCheck } from "lucide-react";
import { Building } from "lucide-react";

interface DeveloperDetailsClientProps {
  developer: any;
  projects: any[];
}

export default function DeveloperDetailsClient({
  developer,
  projects,
}: DeveloperDetailsClientProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Brand Header */}
      <div className="bg-white border-b py-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row gap-8 items-center">
          <div className="w-32 h-32 md:w-48 md:h-48 border rounded-2xl p-4 flex items-center justify-center bg-white shadow-sm">
            <img
              src={developer.logo}
              className="max-h-full object-contain"
              alt={developer.name}
            />
          </div>
          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
              <h1 className="text-3xl font-bold">{developer.name}</h1>
              <ShieldCheck className="text-blue-500" fill="currentColor" />
            </div>
            <p className="text-gray-600 max-w-2xl mb-4">
              {developer.description}
            </p>
            <div className="flex gap-4 justify-center md:justify-start">
              <a
                href={developer.website}
                target="_blank"
                className="flex items-center text-sm font-medium text-blue-600 hover:underline"
              >
                <Globe size={16} className="mr-1" /> Official Website
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Developer's Projects Section */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
          <Building className="text-gray-400" />
          Active Projects by {developer.name}
        </h2>

        {projects?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {projects.map((project: any) => (
              <ProjectCard key={project._id} project={project} />
            ))}
          </div>
        ) : (
          <div className="bg-white p-12 rounded-2xl border text-center text-gray-400">
            No active projects listed for this developer yet.
          </div>
        )}
      </div>
    </div>
  );
}

import React from "react";
import Link from "next/link";
import { MapPin, Building2, CheckCircle2 } from "lucide-react";

export const ProjectCard = ({ project }: { project: any }) => {
  return (
    <Link href={`/projects/${project._id}`} className="group">
      <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-gray-100">
        <div className="relative aspect-video">
          <img
            src={project.media?.images[0] || "/placeholder-project.jpg"}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            alt={project.name}
          />
          <div className="absolute top-3 left-3 flex gap-2">
            <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">
              {project.constructionStatus}
            </span>
            {project.isVerified && (
              <span className="bg-green-500 text-white p-1 rounded-full">
                <CheckCircle2 size={14} />
              </span>
            )}
          </div>
        </div>

        <div className="p-4">
          <div className="flex items-center gap-2 text-blue-600 mb-1">
            <Building2 size={16} />
            <span className="text-xs font-semibold uppercase tracking-wider">
              {project.developer?.name || "Premium Developer"}
            </span>
          </div>
          <h3 className="text-lg font-bold text-gray-900 truncate">
            {project.name}
          </h3>
          <div className="flex items-center text-gray-500 text-sm mt-1">
            <MapPin size={14} className="mr-1" />
            {project.location.sector}, {project.location.city}
          </div>

          <div className="mt-4 flex items-center justify-between border-t pt-3">
            <div>
              <p className="text-gray-400 text-xs">Starting from</p>
              <p className="text-blue-700 font-bold text-lg">
                ₹{project.pricing.from.toLocaleString("en-IN")}
              </p>
            </div>
            <button className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium group-hover:bg-blue-600 transition-colors">
              View Details
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

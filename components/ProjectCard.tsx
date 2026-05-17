"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  MapPin,
  Building2,
  CheckCircle2,
  ChevronRight,
  Heart,
  Bed,
  Bath,
  Maximize2,
  Square,
} from "lucide-react";

export const ProjectCard = ({ project }: { project: any }) => {
  const [isFavourite, setIsFavourite] = useState(false);
  const [imageError, setImageError] = useState(false);

  const unitTypes = project.unitTypes || [];
  const displayUnits = unitTypes.slice(0, 3);

  return (
    <div className="group relative">
      {/* Favourite Button */}
      <button
        onClick={(e) => {
          e.preventDefault();
          setIsFavourite(!isFavourite);
        }}
        className="absolute top-3 right-3 z-20 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm hover:bg-white transition-all opacity-0 group-hover:opacity-100"
        aria-label="Toggle favourite"
      >
        <Heart
          size={16}
          className={`transition-colors ${isFavourite ? "fill-red-500 text-red-500" : "text-gray-600"}`}
        />
      </button>

      <Link href={`/projects/${project.slug}`} className="block">
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-100 hover:-translate-y-1">
          {/* Image Section */}
          <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
            {!imageError ? (
              <Image
                src={project.media?.images[0] || "/placeholder-project.jpg"}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                alt={project.name}
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
                <Building2 size={48} className="text-blue-200" />
              </div>
            )}

            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Top Badges */}
            <div className="absolute top-3 left-3 flex flex-wrap gap-2 z-10">
              <span className="bg-white/95 backdrop-blur-sm text-blue-600 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                {project.constructionStatus}
              </span>
              {project.isVerified && (
                <span className="bg-emerald-500/95 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1">
                  <CheckCircle2 size={12} />
                  Verified
                </span>
              )}
              {project.featured && (
                <span className="bg-amber-500/95 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                  Featured
                </span>
              )}
            </div>

            {/* Image Counter */}
            {project.media?.images?.length > 1 && (
              <div className="absolute bottom-3 right-3 z-10 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-md">
                {project.media.images.length}+ photos
              </div>
            )}

            {/* Quick View Overlay */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
              <span className="bg-white/95 backdrop-blur-sm text-gray-900 px-5 py-2.5 rounded-full text-sm font-semibold shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                Quick View
              </span>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-5">
            {/* Developer */}
            <div className="flex items-center gap-2 text-blue-600 mb-1.5">
              <Building2 size={14} />
              <span className="text-xs font-semibold uppercase tracking-wider">
                {project.developer?.name || "Premium Developer"}
              </span>
            </div>

            {/* Project Name */}
            <h3 className="text-lg font-bold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
              {project.name}
            </h3>

            {/* Location */}
            <div className="flex items-center text-gray-500 text-sm mt-1.5">
              <MapPin size={14} className="mr-1 shrink-0" />
              <span className="truncate">
                {project.location.sector}, {project.location.city}
              </span>
            </div>

            {/* Unit Types */}
            {displayUnits.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {displayUnits.map((type: string, idx: number) => (
                  <span
                    key={idx}
                    className="bg-gray-50 text-gray-600 text-xs px-2.5 py-1 rounded-md border border-gray-100"
                  >
                    {type}
                  </span>
                ))}
                {unitTypes.length > 3 && (
                  <span className="text-gray-400 text-xs px-2 py-1">
                    +{unitTypes.length - 3} more
                  </span>
                )}
              </div>
            )}

            {/* Divider */}
            <div className="mt-4 mb-3 border-t border-gray-100" />

            {/* Bottom Row */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-xs">Starting from</p>
                <p className="text-blue-600 font-bold text-xl tracking-tight">
                  ₹{project.pricing.from.toLocaleString("en-IN")}
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-600 font-semibold px-4 py-2.5 rounded-xl text-sm group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-sm group-hover:shadow-md">
                View Details
                <ChevronRight
                  size={16}
                  className="group-hover:translate-x-0.5 transition-transform"
                />
              </span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

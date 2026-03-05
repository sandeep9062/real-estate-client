"use client";
import { useParams } from "next/navigation";
import { useGetProjectBySlugQuery } from "@/services/projectsApi";
import {
  MapPin,
  ShieldCheck,
  Calendar,
  Info,
  CheckCircle2,
} from "lucide-react";

export default function ProjectDetailsPage() {
  const { slug } = useParams();
  const { data: project, isLoading } = useGetProjectBySlugQuery(slug);

  if (isLoading)
    return (
      <div className="h-screen flex items-center justify-center">
        Loading Project...
      </div>
    );

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Hero Gallery */}
      <div className="h-[50vh] bg-gray-900 relative">
        <img
          src={project?.media?.images[0] || "/placeholder-project.jpg"}
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 flex items-center justify-center flex-col text-white">
          <h1 className="text-4xl md:text-6xl font-black">{project?.name}</h1>
          <p className="flex items-center mt-4 text-xl">
            <MapPin className="mr-2" /> {project?.location.sector},{" "}
            {project?.location.city}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-[-50px] relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-2xl shadow-sm border">
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full uppercase">
                  {project?.projectType}
                </span>
                <h2 className="text-3xl font-bold mt-2">About Project</h2>
              </div>
              <div className="text-right">
                <p className="text-gray-400 text-sm font-medium">RERA NO.</p>
                <p className="font-mono font-bold text-blue-600">
                  {project?.reraNumber}
                </p>
              </div>
            </div>
            <p className="text-gray-600 leading-relaxed">
              {project?.description}
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border">
            <h3 className="text-xl font-bold mb-6">Project Amenities</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {project?.amenities?.map((item: string) => (
                <div
                  key={item}
                  className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg text-sm font-medium"
                >
                  <CheckCircle2 size={16} className="text-green-500" /> {item}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Sticky Panel */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-2xl shadow-lg border-2 border-blue-50 sticky top-24">
            <div className="flex items-center gap-4 mb-6">
              <img
                src={project?.developer?.logo || "/placeholder-logo.jpg"}
                className="w-16 h-16 rounded-lg object-contain border"
              />
              <div>
                <p className="text-xs text-gray-400">Developed By</p>
                <p className="font-bold text-lg">
                  {project?.developer?.name || "Premium Developer"}
                </p>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500 flex items-center">
                  <Calendar size={16} className="mr-2" /> Possession
                </span>
                <span className="font-semibold">
                  {new Date(project?.stats.possessionDate).getFullYear()}
                </span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500 flex items-center">
                  <ShieldCheck size={16} className="mr-2" /> Status
                </span>
                <span className="text-green-600 font-bold">
                  {project?.constructionStatus}
                </span>
              </div>
            </div>

            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all shadow-blue-200 shadow-lg">
              Download Brochure
            </button>
            <p className="text-center text-xs text-gray-400 mt-4 italic">
              Verified by PropertyBulbul Authority
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

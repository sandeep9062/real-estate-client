"use client";
import { useParams } from "next/navigation";
import { useGetProjectBySlugQuery } from "@/services/projectsApi";
import { useGetAllPropertiesQuery } from "@/services/propertiesApi";
import {
  MapPin,
  ShieldCheck,
  Calendar,
  Info,
  CheckCircle2,
  Building2,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { add } from "lodash";

export default function ProjectDetailsPage() {
  const { slug } = useParams();

  // Debug: Log the slug parameter
  console.log("Project slug from URL:", slug);

  const {
    data: project,
    isLoading: projectLoading,
    error,
  } = useGetProjectBySlugQuery(slug);

  // Fetch properties specifically linked to this Project ID
  const { data: properties, isLoading: propsLoading } =
    useGetAllPropertiesQuery(
      project?._id ? { projectId: project._id } : undefined,
      { skip: !project?._id },
    );

  if (projectLoading)
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse flex flex-col items-center">
          <Building2 size={48} className="text-blue-200 mb-4" />
          <p className="text-gray-500 font-medium">
            Loading Project Details...
          </p>
        </div>
      </div>
    );

  // Handle 404 error
  if (error) {
    const errorStatus = "status" in error ? error.status : null;
    if (errorStatus === 404) {
      return (
        <div className="h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center p-8">
            <h1 className="text-6xl font-black text-gray-800 mb-4">404</h1>
            <p className="text-xl text-gray-600 mb-8">Project not found</p>
            <p className="text-gray-500 mb-8">
              The project you're looking for doesn't exist or may have been
              removed.
            </p>
            <Link
              href="/projects"
              className="bg-[#4161df] text-white px-6 py-3 rounded-lg font-bold hover:bg-[#4161df]/90 transition-colors"
            >
              Browse All Projects
            </Link>
          </div>
        </div>
      );
    }
  }

  // Handle case where project is null/undefined
  if (!project) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8">
          <h1 className="text-6xl font-black text-gray-800 mb-4">404</h1>
          <p className="text-xl text-gray-600 mb-8">Project not found</p>
          <p className="text-gray-500 mb-8">
            The project you're looking for doesn't exist or may have been
            removed.
          </p>
          <Link
            href="/projects"
            className="bg-[#4161df] text-white px-6 py-3 rounded-lg font-bold hover:bg-[#4161df]/90 transition-colors"
          >
            Browse All Projects
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Hero Gallery */}
      <div className="h-[60vh] bg-gray-900 relative overflow-hidden">
        <img
          src={project?.media?.images[0] || "/placeholder-project.jpg"}
          className="w-full h-full object-cover opacity-70 transform hover:scale-105 transition-transform duration-700"
          alt={project?.name}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />
        <div className="absolute inset-0 flex items-center justify-center flex-col text-white px-4 text-center">
          <div className="bg-[#4161df] text-[10px] uppercase tracking-widest font-bold px-4 py-1 rounded-full mb-4">
            Premium Verified Project
          </div>
          <h1 className="text-4xl md:text-7xl font-black drop-shadow-2xl">
            {project?.name}
          </h1>
          <p className="flex items-center mt-4 text-xl md:text-2xl font-light opacity-90">
            <MapPin className="mr-2 text-[#4161df]" />{" "}
            {project?.location.address}, {project?.location.city}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-[-80px] relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* About Section */}
          <div className="bg-white p-8 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100">
            <div className="flex flex-col md:flex-row justify-between items-start mb-8 border-b pb-6 border-gray-50">
              <div>
                <span className="bg-[#4161df] text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">
                  {project?.projectType}
                </span>
                <h2 className="text-3xl font-bold mt-3 text-gray-800">
                  About {project?.name}
                </h2>
              </div>
              <div className="mt-4 md:mt-0 p-4 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">
                  RERA Registration
                </p>
                <p className="font-mono font-black text-[#4161df] text-lg uppercase">
                  {project?.reraNumber || "Applied"}
                </p>
              </div>
            </div>
            <p className="text-gray-600 leading-relaxed text-lg whitespace-pre-line">
              {project?.description}
            </p>
          </div>

          {/* Amenities Section */}
          <div className="bg-white p-8 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100">
            <h3 className="text-2xl font-bold mb-8 text-gray-800 flex items-center">
              World Class Amenities
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {project?.amenities?.map((item: string) => (
                <div
                  key={item}
                  className="group flex items-center gap-3 p-4 bg-gray-50 rounded-2xl text-sm font-semibold text-gray-700 hover:bg-[#4161df] hover:text-white transition-all cursor-default"
                >
                  <CheckCircle2
                    size={18}
                    className="text-green-500 group-hover:text-white"
                  />{" "}
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Properties in this Project Section */}
          <div className="space-y-6">
            <div className="flex justify-between items-end px-2">
              <div>
                <h3 className="text-2xl font-black text-gray-800 uppercase tracking-tight">
                  Available Units
                </h3>
                <p className="text-gray-500 text-sm">
                  Verified properties listed within this society
                </p>
              </div>
              <div className="text-blue-600 font-bold text-sm bg-blue-50 px-3 py-1 rounded-lg">
                {properties?.length || 0} Total
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {properties?.length > 0 ? (
                properties.map((prop: any) => (
                  <Link href={`/property/${prop._id}`} key={prop._id}>
                    <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex gap-4">
                      <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
                        <img
                          src={prop.image?.[0] || "/placeholder-property.jpg"}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex flex-col justify-center">
                        <h4 className="font-bold text-gray-800 line-clamp-1">
                          {prop.title}
                        </h4>
                        <p className="text-xs text-gray-400 mt-1 flex items-center">
                          <MapPin size={10} className="mr-1" />{" "}
                          {prop.location.address}, {prop.location.city}
                        </p>
                        <p className="text-blue-600 font-black mt-2 text-sm">
                          ₹{prop.price}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="col-span-full p-12 bg-white rounded-3xl border-2 border-dashed border-gray-100 text-center">
                  <p className="text-gray-400 italic">
                    No direct listings available in this project right now.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Sticky Panel */}
        <div className="lg:col-span-1">
          <div className="bg-white p-8 rounded-3xl shadow-2xl shadow-blue-100 border border-blue-50 sticky top-24">
            <div className="flex items-center gap-5 mb-8 pb-8 border-b border-gray-100">
              <div className="p-2 bg-gray-50 rounded-xl border">
                <img
                  src={project?.developer?.logo || "/placeholder-logo.jpg"}
                  className="w-16 h-16 rounded-lg object-contain"
                />
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                  Master Developer
                </p>
                <p className="font-black text-xl text-gray-800 leading-tight">
                  {project?.developer?.name || "Premium Developer"}
                </p>
              </div>
            </div>

            <div className="space-y-5 mb-8">
              <div className="flex justify-between items-center p-4 bg-blue-50/50 rounded-2xl">
                <span className="text-gray-500 text-sm flex items-center font-medium">
                  <Calendar size={18} className="mr-3 text-[#4161df]" />{" "}
                  Possession
                </span>
                <span className="font-black text-[#4161df]">
                  {project?.stats?.possessionDate
                    ? new Date(project.stats.possessionDate).getFullYear()
                    : "TBA"}
                </span>
              </div>
              <div className="flex justify-between items-center p-4 bg-green-50/50 rounded-2xl">
                <span className="text-gray-500 text-sm flex items-center font-medium">
                  <ShieldCheck size={18} className="mr-3 text-green-500" />{" "}
                  Current Status
                </span>
                <span className="text-green-700 font-black text-sm uppercase">
                  {project?.constructionStatus}
                </span>
              </div>
            </div>

            <button className="w-full bg-[#4161df] hover:bg-[#4161df]/90 text-white font-black py-5 rounded-2xl transition-all shadow-xl shadow-blue-200 flex items-center justify-center gap-2 group">
              Download Project Brochure{" "}
              <ArrowRight
                size={18}
                className="group-hover:translate-x-1 transition-transform"
              />
            </button>

            <div className="mt-8 pt-6 border-t border-gray-50 text-center">
              <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mb-1">
                Authenticity Guaranteed
              </p>
              <p className="text-xs text-gray-500 italic">
                This project is officially verified by the PropertyBulbul
                Research Team.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

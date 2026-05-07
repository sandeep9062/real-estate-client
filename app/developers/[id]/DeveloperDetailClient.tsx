"use client";
import { useGetDeveloperByIdQuery } from "@/services/developersApi";
import { ProjectCard } from "@/components/ProjectCard";
import {
  Globe,
  ShieldCheck,
  Building,
  MapPin,
  ChevronRight,
  ArrowLeft,
  Calendar,
  Users,
  ExternalLink,
  Star,
  Phone,
  Mail,
  Award,
  Facebook,
  Instagram,
  Linkedin,
  Youtube,
  Image as ImageIcon,
  CheckCircle2,
  Clock,
  Home,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface DeveloperDetailClientProps {
  id: string;
}

export default function DeveloperDetailClient({
  id,
}: DeveloperDetailClientProps) {
  const { data, isLoading, isError } = useGetDeveloperByIdQuery(id);

  // Loading State
  if (isLoading)
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-20">
        <div className="max-w-7xl mx-auto px-4 py-12 animate-pulse">
          <div className="bg-white rounded-2xl p-8 md:p-12 border">
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="w-32 h-32 md:w-48 md:h-48 bg-gray-200 rounded-2xl" />
              <div className="flex-1 space-y-4 text-center md:text-left">
                <div className="h-8 bg-gray-200 rounded w-64 mx-auto md:mx-0" />
                <div className="h-4 bg-gray-100 rounded w-full max-w-lg mx-auto md:mx-0" />
                <div className="h-4 bg-gray-100 rounded w-3/4 max-w-md mx-auto md:mx-0" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );

  // Error State
  if (isError || !data) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-20">
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <div className="bg-red-50 border border-red-200 rounded-2xl p-12 max-w-lg mx-auto">
            <Building className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-red-700 mb-2">
              Developer Not Found
            </h2>
            <p className="text-red-500 text-sm mb-6">
              This developer profile could not be loaded. It may have been
              removed or the link is invalid.
            </p>
            <Link
              href="/developers"
              className="inline-flex items-center gap-2 text-red-600 font-medium hover:underline"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Developers
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const { developer, projects } = data;

  // Compute derived values
  const establishedYearsAgo = developer.establishedYear
    ? new Date().getFullYear() - developer.establishedYear
    : null;
  const hasSocialLinks =
    developer.socialLinks &&
    Object.values(developer.socialLinks).some((v: any) => v);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Back Navigation */}
      <div className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <Link
            href="/developers"
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            All Developers
          </Link>
        </div>
      </div>

      {/* Brand Header - with coverImage if available */}
      <div className="relative overflow-hidden">
        {/* Cover Image */}
        {developer.coverImage && (
          <div className="absolute inset-0 w-full h-full">
            <Image
              src={developer.coverImage}
              alt=""
              fill
              className="object-cover"
              sizes="100vw"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80" />
          </div>
        )}

        <div
          className={`relative ${
            developer.coverImage
              ? ""
              : "bg-gradient-to-br from-[#0a1628] via-[#1a2a4a] to-[#0a1628]"
          }`}
        >
          {/* Decorative Elements (only when no cover image) */}
          {!developer.coverImage && (
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
              <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
            </div>
          )}

          <div className="relative max-w-7xl mx-auto px-4 py-12 md:py-16">
            <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center md:items-start">
              {/* Logo */}
              <div className="flex-shrink-0">
                <div
                  className={`w-28 h-28 md:w-44 md:h-44 ${
                    developer.coverImage
                      ? "bg-white/20 backdrop-blur-md border border-white/30"
                      : "bg-white/10 backdrop-blur-sm border border-white/20"
                  } rounded-2xl p-4 flex items-center justify-center shadow-xl`}
                >
                  {developer.logo ? (
                    <div className="relative w-full h-full">
                      <Image
                        src={developer.logo}
                        alt={developer.name}
                        fill
                        className="object-contain"
                        sizes="176px"
                      />
                    </div>
                  ) : (
                    <Building className="w-16 h-16 text-white/40" />
                  )}
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-3 mb-3">
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
                    {developer.name}
                  </h1>
                  {developer.isVerified && (
                    <div className="flex items-center gap-1.5 bg-green-500/20 border border-green-400/30 rounded-full px-3 py-1">
                      <ShieldCheck className="w-4 h-4 text-green-400" />
                      <span className="text-green-300 text-xs font-medium">
                        Verified
                      </span>
                    </div>
                  )}
                  {developer.featured && (
                    <div className="flex items-center gap-1.5 bg-yellow-500/20 border border-yellow-400/30 rounded-full px-3 py-1">
                      <Award className="w-4 h-4 text-yellow-400" />
                      <span className="text-yellow-300 text-xs font-medium">
                        Featured
                      </span>
                    </div>
                  )}
                </div>

                {/* Short Description as tagline */}
                {developer.shortDescription && (
                  <p className="text-blue-200 text-sm md:text-base font-medium mb-2">
                    {developer.shortDescription}
                  </p>
                )}

                {/* Headquarters & Cities */}
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-1 text-gray-300 text-sm mb-3">
                  {developer.headquarters && (
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-blue-400" />
                      {developer.headquarters}
                    </span>
                  )}
                  {developer.cities && developer.cities.length > 0 && (
                    <span className="flex items-center gap-1.5 text-gray-400">
                      <Building className="w-3.5 h-3.5" />
                      {developer.cities.join(", ")}
                    </span>
                  )}
                  {developer.establishedYear && (
                    <span className="flex items-center gap-1.5 text-gray-400">
                      <Calendar className="w-3.5 h-3.5" />
                      Est. {developer.establishedYear}
                      {establishedYearsAgo && (
                        <span className="text-gray-500">
                          ({establishedYearsAgo} years)
                        </span>
                      )}
                    </span>
                  )}
                </div>

                {/* Description */}
                <p className="text-gray-300 text-base md:text-lg max-w-2xl leading-relaxed mb-6">
                  {developer.description ||
                    "Premium real estate developer building quality projects across Tricity."}
                </p>

                {/* Company Stats Strip */}
                <div className="flex flex-wrap gap-3 justify-center md:justify-start mb-6">
                  {developer.completedProjects > 0 && (
                    <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-2.5 text-center min-w-[100px]">
                      <div className="text-lg font-bold text-white">
                        {developer.completedProjects}+
                      </div>
                      <div className="text-[10px] text-gray-400 uppercase tracking-wider">
                        Completed
                      </div>
                    </div>
                  )}
                  {developer.ongoingProjects > 0 && (
                    <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-2.5 text-center min-w-[100px]">
                      <div className="text-lg font-bold text-white">
                        {developer.ongoingProjects}
                      </div>
                      <div className="text-[10px] text-gray-400 uppercase tracking-wider">
                        Ongoing
                      </div>
                    </div>
                  )}
                  {developer.totalUnitsDelivered > 0 && (
                    <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-2.5 text-center min-w-[100px]">
                      <div className="text-lg font-bold text-white">
                        {developer.totalUnitsDelivered.toLocaleString("en-IN")}
                      </div>
                      <div className="text-[10px] text-gray-400 uppercase tracking-wider">
                        Units Delivered
                      </div>
                    </div>
                  )}
                  {developer.rating > 0 && (
                    <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-2.5 text-center min-w-[100px]">
                      <div className="text-lg font-bold text-white flex items-center justify-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        {developer.rating.toFixed(1)}
                      </div>
                      <div className="text-[10px] text-gray-400 uppercase tracking-wider">
                        {developer.totalReviews || 0} Reviews
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                  {developer.website && (
                    <a
                      href={developer.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white px-5 py-2.5 rounded-xl transition-all text-sm font-medium"
                    >
                      <Globe className="w-4 h-4" />
                      Official Website
                      <ExternalLink className="w-3.5 h-3.5 opacity-60" />
                    </a>
                  )}
                  {developer.phone && (
                    <a
                      href={`tel:${developer.phone}`}
                      className="inline-flex items-center gap-2 bg-green-500/20 hover:bg-green-500/30 border border-green-400/30 text-green-300 px-5 py-2.5 rounded-xl transition-all text-sm font-medium"
                    >
                      <Phone className="w-4 h-4" />
                      {developer.phone}
                    </a>
                  )}
                  {developer.email && (
                    <a
                      href={`mailto:${developer.email}`}
                      className="inline-flex items-center gap-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/30 text-blue-300 px-5 py-2.5 rounded-xl transition-all text-sm font-medium"
                    >
                      <Mail className="w-4 h-4" />
                      Email
                    </a>
                  )}
                  <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 text-gray-300 px-5 py-2.5 rounded-xl text-sm">
                    <Building className="w-4 h-4 text-blue-400" />
                    {projects?.length || 0} Project
                    {(projects?.length || 0) !== 1 ? "s" : ""}
                  </div>
                </div>

                {/* Social Links */}
                {hasSocialLinks && (
                  <div className="flex items-center gap-2 mt-4 justify-center md:justify-start">
                    {developer.socialLinks.facebook && (
                      <a
                        href={developer.socialLinks.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-9 h-9 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors"
                        title="Facebook"
                      >
                        <Facebook className="w-4 h-4 text-gray-300" />
                      </a>
                    )}
                    {developer.socialLinks.instagram && (
                      <a
                        href={developer.socialLinks.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-9 h-9 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors"
                        title="Instagram"
                      >
                        <Instagram className="w-4 h-4 text-gray-300" />
                      </a>
                    )}
                    {developer.socialLinks.linkedin && (
                      <a
                        href={developer.socialLinks.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-9 h-9 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors"
                        title="LinkedIn"
                      >
                        <Linkedin className="w-4 h-4 text-gray-300" />
                      </a>
                    )}
                    {developer.socialLinks.youtube && (
                      <a
                        href={developer.socialLinks.youtube}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-9 h-9 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors"
                        title="YouTube"
                      >
                        <Youtube className="w-4 h-4 text-gray-300" />
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Awards Section */}
      {developer.awards && developer.awards.length > 0 && (
        <section className="bg-white border-b border-gray-100 py-10">
          <div className="max-w-7xl mx-auto px-4">
            <div className="inline-flex items-center gap-2 bg-yellow-50 border border-yellow-100 rounded-full px-4 py-1.5 mb-6">
              <Award className="w-4 h-4 text-yellow-600" />
              <span className="text-yellow-700 text-sm font-medium">
                Awards & Recognition
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {developer.awards.map((award: any, i: number) => (
                <div
                  key={i}
                  className="bg-gradient-to-br from-yellow-50 to-white border border-yellow-100 rounded-xl p-5"
                >
                  <div className="flex items-start gap-3">
                    <Award className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-gray-900 text-sm">
                        {award.title}
                      </h4>
                      {award.year && (
                        <p className="text-xs text-yellow-600 font-medium">
                          {award.year}
                        </p>
                      )}
                      {award.description && (
                        <p className="text-xs text-gray-500 mt-1">
                          {award.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Gallery Section */}
      {developer.gallery && developer.gallery.length > 0 && (
        <section className="bg-gray-50 border-b border-gray-100 py-12">
          <div className="max-w-7xl mx-auto px-4">
            <div className="inline-flex items-center gap-2 bg-purple-50 border border-purple-100 rounded-full px-4 py-1.5 mb-6">
              <ImageIcon className="w-4 h-4 text-purple-600" />
              <span className="text-purple-700 text-sm font-medium">
                Gallery
              </span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {developer.gallery.map((img: string, i: number) => (
                <div
                  key={i}
                  className="relative aspect-video rounded-xl overflow-hidden group"
                >
                  <Image
                    src={img}
                    alt={`${developer.name} gallery ${i + 1}`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Projects Section */}
      <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-full px-4 py-1.5 mb-4">
            <Building className="w-4 h-4 text-blue-600" />
            <span className="text-blue-700 text-sm font-medium">
              Active Developments
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            Projects by {developer.name}
          </h2>
          <p className="text-gray-500 mt-2">
            Explore premium residential and commercial projects developed by{" "}
            {developer.name} across Tricity.
          </p>
        </div>

        {projects?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project: any) => (
              <ProjectCard key={project._id} project={project} />
            ))}
          </div>
        ) : (
          <div className="bg-white border border-gray-100 rounded-2xl p-16 text-center shadow-sm">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Building className="w-8 h-8 text-gray-300" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              No Projects Listed Yet
            </h3>
            <p className="text-gray-400 text-sm max-w-md mx-auto">
              There are currently no active projects listed for {developer.name}
              . Check back soon for new developments.
            </p>
          </div>
        )}
      </div>

      {/* Why Choose Section - with actual stats where available */}
      <section className="bg-white border-t border-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              Why Choose {developer.name}?
            </h2>
            <p className="text-gray-500 mt-2 max-w-2xl mx-auto">
              Building trust through quality construction and timely delivery
              across Tricity.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                icon: ShieldCheck,
                title: developer.isVerified
                  ? "Verified Developer"
                  : "Trusted Developer",
                desc: developer.isVerified
                  ? "Thoroughly verified by our team to ensure authenticity and credibility."
                  : "Committed to quality and transparency in every project.",
              },
              {
                icon: Home,
                title: `${developer.completedProjects || "100+"}+ Projects Delivered`,
                desc: `Successfully delivered ${
                  developer.completedProjects || "hundreds of"
                } residential and commercial projects across Tricity.`,
              },
              {
                icon: Users,
                title: `${
                  developer.totalUnitsDelivered
                    ? `${developer.totalUnitsDelivered.toLocaleString("en-IN")}+`
                    : "Thousands of"
                } Happy Homeowners`,
                desc: "Trusted by thousands of families and businesses across Chandigarh, Mohali & Panchkula.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="text-center p-6 rounded-2xl hover:bg-gray-50 transition-colors"
              >
                <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-7 h-7 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Explore More CTA */}
      <section className="bg-gradient-to-r from-gray-900 to-gray-800 py-14">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
            Explore More Developers
          </h2>
          <p className="text-gray-400 mb-6 max-w-xl mx-auto">
            Discover other trusted developers and their premium projects in
            Tricity.
          </p>
          <Link
            href="/developers"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold px-8 py-3.5 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg shadow-blue-500/25"
          >
            View All Developers
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}

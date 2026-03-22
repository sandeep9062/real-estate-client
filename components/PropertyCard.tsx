"use client";
import React, { useMemo, memo } from "react";
import Image from "next/image";
import { truncate } from "lodash";
import { useRouter } from "next/navigation";
import Heart from "./Heart";
import { useSelector } from "react-redux";
import { selectUser } from "@/store/authSlice";
import { FaBed, FaBath, FaCar, FaMapMarkerAlt } from "react-icons/fa";

interface PropertyCardProps {
  card: any;
  isFavourite?: boolean;
  editable?: boolean;
  onEdit?: (property: any) => void;
}

const PropertyCard: React.FC<PropertyCardProps> = ({
  card,
  isFavourite,
  editable = false,
  onEdit,
}) => {
  const router = useRouter();

  const displayImage = useMemo(() => {
    const imageUrls = (card.image || []).filter((img: string) => {
      const lower = img.toLowerCase();
      return !(
        lower.endsWith(".mp4") ||
        lower.endsWith(".webm") ||
        lower.endsWith(".ogg") ||
        lower.includes("youtube.com")
      );
    });
    return (
      imageUrls[0] ||
      card.image?.[0] ||
      // card.images?.[0] ||
      "/images/property-tricity.jpg"
    );
  }, [card.image]);

  const hasValidImage = displayImage && displayImage.trim() !== "";

  return (
    <div
      className="group flex flex-col bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-2xl hover:border-blue-100 transition-all duration-500 cursor-pointer overflow-hidden w-full h-full min-h-[420px]"
      onClick={() => router.push(`/property/${card._id}`)}
    >
      {/* Image Container */}
      <div className="relative h-52 sm:h-60 w-full overflow-hidden">
        {hasValidImage ? (
          <Image
            src={displayImage}
            alt={card.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-slate-100 flex items-center justify-center">
            <span className="text-slate-400 text-sm">No Image Available</span>
          </div>
        )}

        {/* Gradient Overlay for bottom text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Top Actions */}
        <div className="absolute top-3 left-3 right-3 flex justify-between items-start z-10">
          <span
            className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest backdrop-blur-md shadow-sm border ${
              card.deal === "Sale"
                ? "bg-emerald-500/90 text-white border-emerald-400"
                : "bg-rose-500/90 text-white border-rose-400"
            }`}
          >
            For {card.deal}
          </span>
          <div className="flex gap-2">
            {editable && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit?.(card);
                }}
                className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white text-slate-700 transition-all"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
              </button>
            )}
            <div className="bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all">
              <Heart card={card} />
            </div>
          </div>
        </div>

        {/* Featured Tag */}
        {card.isFeatured && (
          <div className="absolute bottom-0 left-0 z-10">
            <div
              className="bg-[#4161df] text-white text-[10px] font-black px-4 py-1.5

rounded-tr-3xl shadow-md flex items-center gap-1 uppercase tracking-tighter"
            >
              <span>★</span> FEATURED
            </div>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-5 flex flex-col flex-1 gap-3">
        {/* Price & Badge */}
        <div className="flex justify-between items-baseline">
          <h4 className="text-2xl font-black text-[#4161df] tracking-tight">
            ₹{card.price.toLocaleString("en-IN")}
          </h4>
          <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-1 rounded">
            {card.propertyCategory}
          </span>
        </div>

        {/* Title & Address */}
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-slate-900 leading-snug group-hover:text-[#4161df] transition-colors line-clamp-1">
            {card.title}
          </h3>
          <div className="flex items-center gap-1 text-slate-500">
            <FaMapMarkerAlt className="text-[#4161df] text-xs" />
            <p className="text-xs font-medium truncate">
              {card.location.address}, {card.location.city}
              {card.location.state && `, ${card.location.state}`}
            </p>
          </div>
        </div>

        {/* Features Row */}
        <div className="flex items-center justify-between border-t border-slate-50 pt-4 mt-auto">
          <div className="flex items-center gap-4 text-slate-600">
            {card.facilities?.bedrooms > 0 && (
              <>
                <div className="flex flex-col items-center gap-1">
                  <div className="flex items-center gap-1.5 font-bold text-slate-900">
                    <FaBed className="text-[#4161df]" />
                    <span>{card.facilities?.bedrooms || 0}</span>
                  </div>
                  <span className="text-[10px] uppercase text-slate-400 tracking-wider">
                    Beds
                  </span>
                </div>
                <div className="w-[1px] h-6 bg-slate-100" />{" "}
              </>
            )}
            {card.facilities?.bathrooms > 0 && (
              <>
                <div className="flex flex-col items-center gap-1">
                  <div className="flex items-center gap-1.5 font-bold text-slate-900">
                    <FaBath className="text-[#4161df]" />
                    <span>{card.facilities?.bathrooms || 0}</span>
                  </div>
                  <span className="text-[10px] uppercase text-slate-400 tracking-wider">
                    Baths
                  </span>
                </div>
                <div className="w-[1px] h-6 bg-slate-100" />
              </>
            )}

            {card.facilities?.parkings > 0 && (
              <>
                <div className="flex flex-col items-center gap-1">
                  <div className="flex items-center gap-1.5 font-bold text-slate-900">
                    <FaCar className="text-[#4161df]" />
                    <span>{card.facilities?.parkings || 0}</span>
                  </div>
                  <span className="text-[10px] uppercase text-slate-400 tracking-wider">
                    Park
                  </span>
                </div>
              </>
            )}
          </div>

          <div className="text-right">
            <span className="block text-sm font-bold text-slate-900">
              {card.area.value}
            </span>
            <span className="block text-[10px] text-slate-400 uppercase">
              {card.area.unit}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(PropertyCard);

"use client";
import React from "react";
import Image from "next/image";
import { truncate } from "lodash";
import { useRouter } from "next/navigation";
import Heart from "./Heart";
import { useSelector } from "react-redux";
import { selectUser } from "@/store/authSlice";
interface PropertyCardProps {
  card: any;
  isFavourite?: boolean;
  editable?: boolean;
  onEdit?: (property: any) => void;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ card, isFavourite, editable = false, onEdit }) => {
  const router = useRouter();
  const user = useSelector(selectUser);

  const isBooked = false; // This needs to be re-evaluated if you have booking info available
  const isFavourited = isFavourite;

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit?.(card);
  };

  // Filter out video URLs from images
  const imageUrls = (card.image || []).filter((img: string) => {
    const lower = img.toLowerCase();
    return !(lower.endsWith('.mp4') || lower.endsWith('.webm') || lower.endsWith('.ogg'));
  });

  const displayImage = imageUrls[0] || card.image?.[0]; // Fallback to first if no images
  const hasValidImage = displayImage && displayImage.trim() !== '';

  return (
    <div
      className="flex flex-col bg-white rounded-2xl shadow-md border border-gray-200 hover:shadow-xl hover:border-blue-200 transition-all duration-300 cursor-pointer overflow-hidden w-full h-[450px]"
      onClick={() => router.push(`/property/${card._id}`)}
    >
      {/* Image */}
      <div className="relative h-48 sm:h-60 w-full">
        {hasValidImage ? (
          <Image
            src={displayImage}
            alt={card.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <div className="text-gray-400 text-center">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="mx-auto mb-2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <polyline points="21 15 16 10 5 21"></polyline>
              </svg>
              <span className="text-sm">No Image</span>
            </div>
          </div>
        )}

        {/* Heart */}
        <div className="absolute top-3 right-3 z-10">
          <Heart card={card} />
        </div>

        {/* Edit Button */}
        {editable && (
          <button
            onClick={handleEditClick}
            className="absolute top-3 right-16 z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-50 transition-colors"
            title="Edit Property"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
          </button>
        )}

        {/* Deal Tag */}
        <div className="absolute top-3 left-3 z-10">
          <span
            className={`text-xs font-medium px-1 py-1 rounded-b-md border backdrop-blur-sm ${
              card.deal === "Sale"
                ? "bg-green-100 text-green-800 border-green-200"
                : "bg-red-100 text-red-800 border-red-200"
            }`}
          >
            For {card.deal}
          </span>
        </div>

        {/* Favourite / Booked Tag */}
        {(isFavourited || isBooked) && (
          <div className="absolute bottom-3 left-3 z-10">
            <span
              className={`text-xs font-medium px-2 py-1 rounded-full border backdrop-blur-sm ${
                isBooked
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : "bg-rose-50 text-rose-600 border-rose-200"
              }`}
            >
              {isBooked ? "Booked" : "Favourited"}
            </span>
          </div>
        )}
      </div>

      {/* Details */}
      <div className="p-4 flex flex-col gap-3 grow">
        {/* Price and Area */}
        <div className="flex flex-wrap justify-between items-center gap-2">
          <p className="text-xl sm:text-2xl font-bold text-blue-600">
            <span className="text-sm font-normal">₹</span>
            {card.price.toLocaleString()}
          </p>
          <p className="text-xs sm:text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded-md">
            {card.area.value} {card.area.unit}
          </p>
        </div>

        {/* Title */}
        <h3 className="text-base sm:text-lg font-bold text-gray-900 truncate h-14">
          {card.title}
        </h3>

        {/* Address */}
        <p className="text-gray-600 text-sm truncate">
          {truncate(`${card.location.address}, ${card.location.city}`, {
            length: 30,
          })}
        </p>

        {/* Spacer */}
        <div className="grow" />

        {/* Facilities */}
        <div className="flex flex-wrap justify-start items-center gap-x-4 gap-y-2 text-xs sm:text-sm text-gray-700 border-t pt-3 mt-auto">
          {card.facilities?.bedrooms > 0 && (
            <div className="flex items-center gap-1">
              <span role="img" aria-label="beds">
                🛏️
              </span>
              <span>{card.facilities.bedrooms} Beds</span>
            </div>
          )}
          {card.facilities?.bathrooms > 0 && (
            <div className="flex items-center gap-1">
              <span role="img" aria-label="baths">
                🛁
              </span>
              <span>{card.facilities.bathrooms} Baths</span>
            </div>
          )}
          {card.facilities?.parkings > 0 && (
            <div className="flex items-center gap-1">
              <span role="img" aria-label="parking">
                🚗
              </span>
              <span>{card.facilities.parkings} Parking</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;

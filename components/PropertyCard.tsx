"use client";
import React, { useMemo, memo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { selectIsAuthenticated } from "@/store/authSlice";
import Heart from "./Heart";

import { Scale, Check } from "lucide-react";
import { toggleCompareId, getCompareIds } from "@/lib/compareStorage";
import { toast } from "@/hooks/use-toast";
import {
  FaBed,
  FaBath,
  FaCar,
  FaMapMarkerAlt,
  FaWhatsapp,
  FaHome,
} from "react-icons/fa";
import {
  PropertyTrustBadges,
  ListingAvailabilityPill,
  ListingPostedByTag,
} from "@/components/PropertyTrustBadges";

interface PropertyCardProps {
  card: any;
  isFavourite?: boolean;
  editable?: boolean;
  onEdit?: (property: any) => void;
  isSelected?: boolean;
  /** Tighter card for carousels: ~65% media / ~35% content, shorter copy */
  variant?: "default" | "carousel";
}

const formatInr = (n: number) => `₹${(Number(n) || 0).toLocaleString("en-IN")}`;

const PropertyCard: React.FC<PropertyCardProps> = ({
  card,
  isFavourite: _isFavourite,
  editable = false,
  onEdit,
  isSelected = false,
  variant = "default",
}) => {
  const router = useRouter();
  const pid = String(card._id || card.id);
  const slug = card.slug;

  const [inCompare, setInCompare] = React.useState(false);
  React.useEffect(() => {
    const sync = () =>
      setInCompare(
        typeof window !== "undefined" && getCompareIds().includes(pid),
      );
    sync();
    window.addEventListener("pb-compare-changed", sync);
    return () => window.removeEventListener("pb-compare-changed", sync);
  }, [pid]);

  const firstMedia = (card.image || [])[0] || "/images/property-tricity.jpg";
  const [imageFailed, setImageFailed] = useState(false);

  const isVideo = useMemo(() => {
    const lower = String(firstMedia).toLowerCase();
    return (
      lower.endsWith(".mp4") ||
      lower.endsWith(".webm") ||
      lower.endsWith(".ogg")
    );
  }, [firstMedia]);

  const hasValidMedia = firstMedia && String(firstMedia).trim() !== "";

  const areaValue = card.area?.superBuiltUpArea?.value || card.area?.value;
  const areaUnit =
    card.area?.superBuiltUpArea?.unit || card.area?.unit || "sqft";
  const carpetValue = card.area?.carpetArea?.value;
  const carpetUnit = card.area?.carpetArea?.unit || card.area?.unit || "sqft";
  const isRent = card.deal === "Rent";
  const displayPhone =
    card.agent?.phone ||
    card.user?.phone?.replace(/\D/g, "").slice(-10) ||
    (card.contactNumber?.[0]
      ? card.contactNumber[0].replace(/\D/g, "").slice(-10)
      : null);

  const locationLine = [card.location?.address, card.location?.city]
    .filter(Boolean)
    .join(", ");
  const statePart = card.location?.state
    ? `${locationLine ? ", " : ""}${card.location.state}`
    : "";

  const carousel = variant === "carousel";
  const statIconClass = carousel
    ? "size-3 text-slate-600"
    : "size-3.5 text-slate-600";

  const statItems = [
    card.facilities?.bedrooms > 0 && {
      key: "bed",
      icon: <FaBed className={statIconClass} aria-hidden />,
      label: carousel
        ? `${card.facilities.bedrooms} bed`
        : `${card.facilities.bedrooms} bedroom${card.facilities.bedrooms !== 1 ? "s" : ""}`,
    },
    card.facilities?.bathrooms > 0 && {
      key: "bath",
      icon: <FaBath className={statIconClass} aria-hidden />,
      label: carousel
        ? `${card.facilities.bathrooms} bath`
        : `${card.facilities.bathrooms} bathroom${card.facilities.bathrooms !== 1 ? "s" : ""}`,
    },
    card.facilities?.parkings > 0 && {
      key: "park",
      icon: <FaCar className={statIconClass} aria-hidden />,
      label: carousel
        ? `${card.facilities.parkings} park`
        : `${card.facilities.parkings} parking space${card.facilities.parkings !== 1 ? "s" : ""}`,
    },
  ].filter(Boolean) as { key: string; icon: React.ReactNode; label: string }[];

  const isAuthenticated = useSelector(selectIsAuthenticated);

  // MATCHING WHATSAPP LOGIC FROM PROPERTYDETAILS.TSX
  // Direct WhatsApp contact is gated — only logged-in users can reach the
  // owner/agent chat. Everyone else is sent to /login first.
  const handleWhatsAppClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.error("Please log in to chat on WhatsApp");
      router.push("/login");
      return;
    }
    if (!displayPhone) return;

    const message = `Hi, I saw your property "${card.title}" on PropertyBulbul. Is it still available?\n\nProperty link: https://www.propertybulbul.com/property/${slug}`;
    const whatsappUrl = `https://wa.me/${displayPhone}?text=${encodeURIComponent(message)}`;

    window.open(whatsappUrl, "_blank");

    // GA4 Lead Tracking
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", "generate_lead", {
        event_category: "Engagement",
        event_label: card?.title || "Unknown Property",
        value: 1,
      });
    }
  };
  return (
    <article
      className={[
        "group relative w-full max-w-full cursor-pointer overflow-hidden rounded-2xl border bg-white transition-shadow duration-300",
        carousel
          ? "flex h-[396px] flex-col sm:h-[420px]"
          : "flex min-h-[460px] h-full flex-col",
        isSelected
          ? "border-slate-400/80 shadow-md ring-1 ring-slate-400/60"
          : "border-slate-200 shadow-sm hover:border-slate-300 hover:shadow-md",
      ].join(" ")}
      onClick={() => router.push(`/property/${slug}`)}
    >
      {/* Media — ~65% of card height in carousel variant */}
      <div
        className={
          carousel
            ? "relative h-48 w-full shrink-0 overflow-hidden sm:h-56"
            : "relative aspect-[4/3] min-h-[12.5rem] w-full flex-1 basis-0 overflow-hidden sm:min-h-[14rem]"
        }
      >
        {imageFailed ? (
          <div className="flex h-full w-full flex-col items-center justify-center gap-1.5 bg-slate-100">
            <FaHome className={carousel ? "size-8 text-slate-300" : "size-10 text-slate-300"} aria-hidden />
            <span className={carousel ? "text-[10px] font-medium text-slate-500" : "text-xs font-medium text-slate-500"}>
              Image not available
            </span>
          </div>
        ) : hasValidMedia ? (
          isVideo ? (
            <video
              src={firstMedia}
              autoPlay
              muted
              loop
              playsInline
              className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
            />
          ) : (
            <Image
              src={firstMedia}
              alt={card.title || "Property"}
              fill
              sizes={
                carousel
                  ? "(max-width: 640px) 90vw, (max-width: 1280px) 50vw, 33vw"
                  : "(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
              }
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
              onError={() => setImageFailed(true)}
            />
          )
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-1.5 bg-slate-100">
            <FaHome
              className={
                carousel ? "size-8 text-slate-300" : "size-10 text-slate-300"
              }
              aria-hidden
            />
            <span
              className={
                carousel
                  ? "text-[10px] font-medium text-slate-500"
                  : "text-xs font-medium text-slate-500"
              }
            >
              Image not available
            </span>
          </div>
        )}

        {/* Base gradient for readability */}
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/40 via-slate-950/5 to-transparent transition-opacity duration-300 group-hover:from-slate-950/50"
          aria-hidden
        />

        {/* Top row */}
        <div
          className={`absolute inset-x-0 top-0 z-10 flex items-start justify-between ${carousel ? "p-2 sm:p-2.5" : "p-3 sm:p-4"}`}
        >
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={[
                "inline-flex items-center rounded-md font-semibold uppercase tracking-widest text-white shadow-sm",
                carousel ? "px-2 py-0.5 text-[9px]" : "px-2.5 py-1 text-[10px]",
                isRent ? "bg-slate-800" : "bg-slate-900",
              ].join(" ")}
            >
              {isRent ? "For rent" : "For sale"}
            </span>
            {card.type && (
              <span className="hidden rounded-md bg-white/15 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-white ring-1 ring-white/25 backdrop-blur-sm sm:inline-flex">
                {card.type}
              </span>
            )}
          </div>

          <div
            className={`flex items-center ${carousel ? "gap-1" : "gap-1.5"}`}
          >
            <button
              type="button"
              aria-label={
                inCompare ? "Remove from comparison" : "Add to comparison"
              }
              title={inCompare ? "Remove from comparison" : "Add to comparison"}
              onClick={(e) => {
                e.stopPropagation();
                const wasIn = getCompareIds().includes(pid);

                // Check if we're about to exceed the limit (4 total)
                if (!wasIn && getCompareIds().length >= 4) {
                  toast.error("You can compare up to 4 properties at a time");
                  return;
                }

                // Save metadata so the drawer can show real data
                if (!wasIn) {
                  try {
                    const metaKey = "pb_compare_meta";
                    const raw = sessionStorage.getItem(metaKey);
                    const meta = raw ? JSON.parse(raw) : {};
                    meta[pid] = {
                      _id: pid,
                      title: card.title || "Property",
                      image:
                        (card.image?.[0] &&
                          (typeof card.image[0] === "string"
                            ? card.image[0]
                            : card.image[0].url)) ||
                        "/images/property-tricity.jpg",
                    };
                    sessionStorage.setItem(metaKey, JSON.stringify(meta));
                  } catch {
                    // ignore
                  }
                }

                const next = toggleCompareId(pid);
                setInCompare(next.includes(pid));
                if (wasIn) {
                  toast.success("Removed from compare");
                } else {
                  toast.success("Added to compare");
                }
              }}
              className={[
                "flex items-center justify-center rounded-full border border-white/20 bg-white/95 text-slate-700 shadow-sm transition-colors",
                carousel ? "size-8" : "size-9",
                inCompare
                  ? "border-[#4161df]/40 bg-[#4161df] "
                  : "hover:bg-white hover:text-[#4161df]",
              ].join(" ")}
            >
              {inCompare ? (
                <Check
                  className={carousel ? "size-3.5" : "size-4"}
                  strokeWidth={3.5}
                />
              ) : (
                <Scale
                  className={carousel ? "size-3.5" : "size-4"}
                  strokeWidth={2.25}
                />
              )}
            </button>
            {displayPhone && (
              <button
                type="button"
                onClick={handleWhatsAppClick}
                className={`flex items-center justify-center rounded-full border border-white/20 bg-[#128C7E] text-white shadow-sm transition-colors hover:bg-[#0f7a6e] ${carousel ? "size-8" : "size-9"}`}
                title="Contact via WhatsApp"
                aria-label="Contact via WhatsApp"
              >
                <FaWhatsapp className={carousel ? "size-3.5" : "size-4"} />
              </button>
            )}
            {editable && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit?.(card);
                }}
                className={`flex items-center justify-center rounded-full border border-white/20 bg-white/95 text-slate-700 shadow-sm transition-colors hover:bg-white ${carousel ? "size-8" : "size-9"}`}
                title="Edit listing"
                aria-label="Edit listing"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden
                >
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
              </button>
            )}
            <div className="shrink-0 rounded-full border border-white/20 bg-white/95 shadow-sm">
              <Heart card={card} />
            </div>
          </div>
        </div>

        {/* Bottom badges on image */}
        <div
          className={`absolute bottom-0 left-0 right-0 z-10 flex flex-wrap items-end justify-between gap-1.5 ${carousel ? "p-2 sm:p-2.5" : "gap-2 p-3 sm:p-4"}`}
        >
          {card.isFeatured && (
            <span
              className={`inline-flex items-center rounded-md bg-[#4161df] font-semibold uppercase tracking-widest text-white ${carousel ? "px-2 py-0.5 text-[8px]" : "px-2.5 py-1 text-[10px]"}`}
            >
              Featured listing
            </span>
          )}
          <div className="ml-auto flex flex-col items-end gap-1.5">
            <ListingAvailabilityPill
              listingAvailability={card.listingAvailability}
            />
            {(card.virtualTourUrl ||
              (card.floorPlanImages?.length ?? 0) > 0) && (
              <span className="inline-flex rounded-md border border-white/25 bg-black/50 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-white backdrop-blur-sm">
                {card.virtualTourUrl ? "Virtual tour" : "Floor plans"}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Body — ~35% of card height in carousel variant */}
      <div
        className={
          carousel
            ? "flex flex-1 flex-col gap-1.5 p-2.5 sm:p-3"
            : "flex shrink-0 flex-col gap-3 p-4 pt-4 sm:p-5"
        }
      >
        <div
          className={`flex flex-wrap items-end justify-between gap-x-2 ${carousel ? "gap-y-0.5" : "gap-y-1"}`}
        >
          <div className="min-w-0">
            <p
              className={
                carousel
                  ? "text-[9px] font-medium uppercase tracking-wider text-slate-500"
                  : "text-[11px] font-medium uppercase tracking-wider text-slate-500"
              }
            >
              {isRent ? "Monthly rental" : "Listed price"}
            </p>
            <p
              className={
                carousel
                  ? "price text-lg tracking-tight text-slate-900 sm:text-xl"
                  : "price text-2xl tracking-tight text-slate-900 sm:text-[1.4rem]"
              }
            >
              {formatInr(card.price ?? 0)}
              {isRent && (
                <span
                  className={
                    carousel
                      ? "ml-1 text-xs font-medium text-slate-500"
                      : "ml-1 text-base font-medium text-slate-500"
                  }
                >
                  per month
                </span>
              )}
            </p>
          </div>
          <div
            className={`flex flex-col items-end ${carousel ? "gap-0.5" : "gap-1"}`}
          >
            {card.propertyCategory && (
              <span
                className={
                  carousel
                    ? "max-w-[9rem] truncate rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-center text-[10px] font-medium text-slate-700"
                    : "max-w-44 truncate rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-center text-[11px] font-medium text-slate-700"
                }
              >
                {card.propertyCategory}
              </span>
            )}
            {areaValue != null && areaValue !== "" && Number(areaValue) > 0 && (
              <span
                className={
                  carousel
                    ? "text-[10px] font-medium tabular-nums text-slate-600"
                    : "text-xs font-medium tabular-nums text-slate-600"
                }
              >
                {areaValue}{" "}
                <span className="font-normal uppercase text-slate-500">
                  {areaUnit}
                </span>
              </span>
            )}
          </div>
        </div>

        <div className={`min-h-0 ${carousel ? "space-y-1" : "space-y-2"}`}>
          <h3
            className={
              carousel
                ? "truncate text-sm font-semibold leading-snug text-slate-900 transition-colors group-hover:text-[#4161df]"
                : "truncate text-base font-semibold leading-snug text-slate-900 transition-colors group-hover:text-[#4161df] sm:text-[1.02rem]"
            }
          >
            {card.title}
          </h3>
          <div
            className={
              carousel
                ? "flex items-center gap-1.5 rounded-md border border-slate-100 bg-slate-50/80 px-2 py-1.5"
                : "flex items-center gap-2 rounded-lg border border-slate-100 bg-slate-50/80 px-2 py-1.5"
            }
          >
            <FaMapMarkerAlt
              className={
                carousel
                  ? "size-3 shrink-0 text-slate-500"
                  : "shrink-0 text-slate-500"
              }
              aria-hidden
            />
            <p
              className={
                carousel
                  ? "min-w-0 truncate whitespace-nowrap text-[10px] font-normal leading-relaxed text-slate-600"
                  : "min-w-0 truncate whitespace-nowrap text-xs font-normal leading-relaxed text-slate-600"
              }
            >
              {locationLine}
              {statePart}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <ListingPostedByTag
            postedBy={card.postedBy}
            userRole={card.user?.role}
          />
          <PropertyTrustBadges property={card} compact />
        </div>
        {statItems.length > 0 && (
          <div
            className={
              carousel
                ? "mt-auto flex flex-nowrap gap-1 overflow-hidden border-t border-slate-100 pt-2"
                : "mt-auto flex flex-nowrap gap-2 overflow-hidden border-t border-slate-100 pt-4"
            }
          >
            {statItems.map((s) => (
              <span
                key={s.key}
                className={
                  carousel
                    ? "inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[9px] font-medium text-slate-700"
                    : "inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-md border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-medium text-slate-700"
                }
              >
                {s.icon}
                <span className="truncate">{s.label}</span>
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
};

export default memo(PropertyCard);

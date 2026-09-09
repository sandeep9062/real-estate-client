"use client";

import React, { memo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BedDouble,
  Sofa,
  CalendarDays,
  MapPin,
  ShieldCheck,
  Sparkles,
  Users,
  Home,
  ImageIcon,
} from "lucide-react";
import type { RoomFlat } from "@/services/roommatesApi";

const BRAND = "#4161df";

interface PropertyListing {
  _id?: string;
  id?: string;
  title?: string;
  price?: number;
  image?: string[];
  location?: { address?: string; city?: string; state?: string; [key: string]: any };
  [key: string]: any;
}

interface ListingCardProps {
  source: "room_flat" | "property";
  // room_flat cards receive a RoomFlat; "property" cards receive a plain
  // property listing with a different shape.
  listing: RoomFlat | PropertyListing;
}

const formatInr = (n?: number) =>
  `₹${(Number(n) || 0).toLocaleString("en-IN")}`;

function humanize(str: string) {
  return str.replace(/_/g, " ").replace(/^./, (c) => c.toUpperCase());
}

function isVideoUrl(url: string) {
  const lower = String(url).toLowerCase();
  return (
    lower.endsWith(".mp4") ||
    lower.endsWith(".webm") ||
    lower.endsWith(".ogg") ||
    lower.startsWith("data:video/")
  );
}

function locationLineOf(location?: {
  address?: string;
  sector?: string;
  city?: string;
}) {
  return [location?.address, location?.sector, location?.city]
    .filter(Boolean)
    .join(", ");
}

function CardShellTop({
  topLeftBadges,
  typePill,
  mediaCount,
}: {
  topLeftBadges: React.ReactNode;
  typePill?: string;
  mediaCount: number;
}) {
  return (
    <div className="absolute inset-x-0 top-0 z-10 flex items-start justify-between p-3 sm:p-4">
      <div className="flex flex-wrap items-center gap-2">
        {topLeftBadges}
        {typePill && (
          <span className="hidden rounded-md bg-white/15 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-white ring-1 ring-white/25 backdrop-blur-sm sm:inline-flex">
            {typePill}
          </span>
        )}
      </div>
      {mediaCount > 1 && (
        <span className="inline-flex items-center gap-1 rounded-full bg-black/60 px-2 py-0.5 text-xs font-medium text-white backdrop-blur-sm">
          <ImageIcon className="h-3 w-3" />
          {mediaCount}
        </span>
      )}
    </div>
  );
}

function CardShellBody({
  priceLabel,
  price,
  priceSuffix,
  sideBadge,
  title,
  locationLine,
  statePart,
  statPills,
  footer,
}: {
  priceLabel: string;
  price: string;
  priceSuffix?: string;
  sideBadge?: string;
  title?: string;
  locationLine: string;
  statePart: string;
  statPills: { key: string; icon: React.ReactNode; label: string }[];
  footer: React.ReactNode;
}) {
  return (
    <div className="flex shrink-0 flex-col gap-3 p-4 pt-4 sm:p-5">
      <div className="flex flex-wrap items-end justify-between gap-x-2 gap-y-1">
        <div className="min-w-0">
          <p className="text-[11px] font-medium uppercase tracking-wider text-slate-500">
            {priceLabel}
          </p>
          <p className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-[1.4rem]">
            {price}
            {priceSuffix && (
              <span className="ml-1 text-base font-medium text-slate-500">
                {priceSuffix}
              </span>
            )}
          </p>
        </div>
        {sideBadge && (
          <div className="flex flex-col items-end gap-1">
            <span className="max-w-44 truncate rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-center text-[11px] font-medium text-slate-700">
              {sideBadge}
            </span>
          </div>
        )}
      </div>

      <div className="min-h-0 space-y-2">
        <h3 className="truncate text-base font-semibold leading-snug text-slate-900 transition-colors group-hover:text-[#4161df] sm:text-[1.02rem]">
          {title || "Untitled listing"}
        </h3>
        <div className="flex items-center gap-2 rounded-lg border border-slate-100 bg-slate-50/80 px-2 py-1.5">
          <MapPin className="shrink-0 text-slate-500" aria-hidden />
          <p className="min-w-0 truncate whitespace-nowrap text-xs font-normal leading-relaxed text-slate-600">
            {locationLine}
            {statePart}
          </p>
        </div>
      </div>

      {statPills.length > 0 && (
        <div className="mt-auto flex flex-nowrap gap-2 overflow-hidden border-t border-slate-100 pt-4">
          {statPills.map((s) => (
            <span
              key={s.key}
              className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-md border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-medium text-slate-700"
            >
              {React.cloneElement(s.icon as React.ReactElement, {
                className: "size-3.5 text-slate-600",
              })}
              <span className="truncate">{s.label}</span>
            </span>
          ))}
        </div>
      )}

      {footer}
    </div>
  );
}

function CardMedia({
  media,
  mediaAlt,
  bottomBadge,
}: {
  media?: string;
  mediaAlt: string;
  bottomBadge?: React.ReactNode;
}) {
  const showVideo = !!media && isVideoUrl(media);
  const hasMedia = !!media && String(media).trim() !== "";
  return (
    <div className="relative min-h-[12.5rem] w-full flex-1 basis-0 overflow-hidden sm:min-h-[14rem]">
      {hasMedia ? (
        showVideo ? (
          <video
            src={media}
            autoPlay
            muted
            loop
            playsInline
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
          />
        ) : (
          <Image
            src={media as string}
            alt={mediaAlt}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
          />
        )
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center gap-1.5 bg-slate-100">
          <Home className="size-10 text-slate-300" aria-hidden />
          <span className="text-xs font-medium text-slate-500">
            Image not available
          </span>
        </div>
      )}
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/40 via-slate-950/5 to-transparent transition-opacity duration-300 group-hover:from-slate-950/50"
        aria-hidden
      />
      {bottomBadge && (
        <div className="absolute bottom-0 left-0 right-0 z-10 flex flex-wrap items-end justify-between gap-2 p-3 sm:p-4">
          <div className="ml-auto flex flex-col items-end gap-1.5">
            {bottomBadge}
          </div>
        </div>
      )}
    </div>
  );
}

function FlatmateFooter({
  profile,
  profileHref,
}: {
  profile?: RoomFlat["roommateProfile"];
  profileHref: string;
}) {
  const p =
    profile && typeof profile === "object"
      ? (profile as {
          occupation?: string;
          habits?: { foodPreference?: string };
          idVerified?: boolean;
        })
      : undefined;
  const traits = [
    p?.occupation && humanize(p.occupation),
    p?.habits?.foodPreference && humanize(p.habits.foodPreference),
    typeof p?.idVerified === "boolean" &&
      (p.idVerified ? "ID verified" : null),
  ].filter(Boolean) as string[];

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {traits.map((t) => (
        <span
          key={t}
          className="inline-flex items-center gap-1 whitespace-nowrap rounded-md border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-medium text-slate-700"
        >
          {t === "ID verified" ? (
            <ShieldCheck className="size-3.5 text-emerald-600" aria-hidden />
          ) : (
            <Sparkles className="size-3.5 text-slate-500" aria-hidden />
          )}
          <span className="truncate">{t}</span>
        </span>
      ))}
      <Link
        href={profileHref}
        onClick={(e) => e.stopPropagation()}
        className="ml-auto inline-flex items-center gap-1 text-sm font-semibold transition-colors hover:opacity-80"
        style={{ color: BRAND }}
      >
        View profile
        <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}

function RoomFlatCard({ listing }: { listing: RoomFlat }) {
  const profile = listing.roommateProfile;
  const profileId =
    typeof profile === "object" && profile && "_id" in profile
      ? String((profile as { _id: string })._id)
      : typeof listing.roommateProfile === "string"
        ? listing.roommateProfile
        : "";
  const profileHref = `/flatmates/profile/${profileId || listing._id}`;
  const line = locationLineOf(listing.location) || "Location on request";
  const statePart = listing.location?.state ? `, ${listing.location.state}` : "";

  const pills: { key: string; icon: React.ReactNode; label: string }[] = [];
  if (listing.roomType) {
    pills.push({
      key: "room",
      icon: <BedDouble aria-hidden />,
      label: humanize(listing.roomType),
    });
  }
  if (listing.furnishing) {
    pills.push({
      key: "furn",
      icon: <Sofa aria-hidden />,
      label: humanize(listing.furnishing),
    });
  }
  if (listing.availableFrom) {
    const d = new Date(listing.availableFrom);
    pills.push({
      key: "avail",
      icon: <CalendarDays aria-hidden />,
      label: Number.isNaN(d.getTime())
        ? "Available soon"
        : `From ${d.toLocaleDateString("en-IN", { day: "numeric", month: "short" })}`,
    });
  }
  const pObj =
    typeof profile === "object" && profile
      ? (profile as { occupation?: string })
      : undefined;
  if (pObj?.occupation) {
    pills.push({
      key: "who",
      icon: <Users aria-hidden />,
      label: humanize(pObj.occupation),
    });
  }

  const media = (listing.photos || [])[0];
  const mediaCount = (listing.photos || []).length;
  const intentBadge =
    listing.intent === "swap"
      ? "Open to swap"
      : listing.intent === "temporary_offer"
        ? "Temporary stay"
        : "Flatmate wanted";

  return (
    <article className="group relative flex h-full min-h-[460px] w-full max-w-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow duration-300 hover:border-slate-300 hover:shadow-md">
      <Link
        href={profileHref}
        aria-label={listing.title || "Listing photo"}
        className="flex h-full min-h-0 flex-1 flex-col"
      >
        <CardMedia
          media={media}
          mediaAlt={listing.title || "Listing photo"}
          bottomBadge={
            <span className="inline-flex rounded-md border border-white/25 bg-black/50 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-white backdrop-blur-sm">
              {intentBadge}
            </span>
          }
        />
        <CardShellTop
          topLeftBadges={
            <span className="inline-flex items-center rounded-md bg-slate-800 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-white shadow-sm">
              For sharing
            </span>
          }
          typePill={listing.roomType ? humanize(listing.roomType) : undefined}
          mediaCount={mediaCount}
        />
        <CardShellBody
          priceLabel="Monthly rental"
          price={formatInr(listing.rentAmount)}
          priceSuffix="per month"
          sideBadge={listing.location?.city}
          title={listing.title}
          locationLine={line}
          statePart={statePart}
          statPills={pills}
          footer={
            <FlatmateFooter
              profile={listing.roommateProfile}
              profileHref={profileHref}
            />
          }
        />
      </Link>
    </article>
  );
}

function SharingPropertyCard({ listing }: { listing: PropertyListing }) {
  const id = String(listing._id || listing.id || "");
  const href = `/properties/${id}`;
  const media = (listing.image || [])[0];
  const mediaCount = (listing.image || []).length;
  const line =
    [listing.location?.address, listing.location?.city]
      .filter(Boolean)
      .join(", ") || "Location on request";
  const statePart =
    listing.location?.state && line !== "Location on request"
      ? `, ${listing.location.state}`
      : listing.location?.state || "";

  return (
    <article className="group relative flex h-full min-h-[460px] w-full max-w-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow duration-300 hover:border-slate-300 hover:shadow-md">
      <Link
        href={href}
        aria-label={listing.title || "Listing photo"}
        className="flex h-full min-h-0 flex-1 flex-col"
      >
        <CardMedia
          media={media}
          mediaAlt={listing.title || "Listing photo"}
          bottomBadge={
            <span className="inline-flex rounded-md border border-white/25 bg-black/50 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-white backdrop-blur-sm">
              Contact owner directly
            </span>
          }
        />
        <CardShellTop
          topLeftBadges={
            <>
              <span className="inline-flex items-center rounded-md bg-slate-800 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-white shadow-sm">
                For rent
              </span>
              <span className="inline-flex items-center rounded-md bg-amber-500/95 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-white shadow-sm">
                Owner allows sharing
              </span>
            </>
          }
          mediaCount={mediaCount}
        />
        <CardShellBody
          priceLabel="Monthly rental"
          price={formatInr(listing.price)}
          priceSuffix="per month"
          sideBadge={listing.location?.city}
          title={listing.title}
          locationLine={line}
          statePart={statePart}
          statPills={[]}
          footer={
            <div className="flex items-center">
              <span
                className="ml-auto inline-flex items-center gap-1 text-sm font-semibold transition-colors group-hover:opacity-80"
                style={{ color: BRAND }}
              >
                View listing
                <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </div>
          }
        />
      </Link>
    </article>
  );
}

export default function ListingCardFlat({
  source,
  listing,
}: ListingCardProps) {
  if (source === "room_flat") {
    return <RoomFlatCard listing={listing as RoomFlat} />;
  }
  return <SharingPropertyCard listing={listing as PropertyListing} />;
}

export const MemoListingCardFlat = memo(ListingCardFlat);
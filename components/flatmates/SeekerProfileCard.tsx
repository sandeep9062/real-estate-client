"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Briefcase,
  CalendarDays,
  Clock,
  IndianRupee,
  MapPin,
  Moon,
  ShieldCheck,
  Sparkles,
  User,
  Utensils,
} from "lucide-react";
import type { RoommateProfile } from "@/services/roommatesApi";

const BRAND = "#4161df";
const INK = "#161A2E";
const INK_SOFT = "#5C5F73";
const BORDER = "#E5E7F2";
const TINT_BG = "#EEF1FC";

/** snake_case / camelCase → "Title Case" (same rules as the profile page). */
export function humanizeLabel(str?: string) {
  if (!str) return "";
  return str
    .replace(/_/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/^./, (c) => c.toUpperCase());
}

const formatInr = (n?: number) => `₹${(Number(n) || 0).toLocaleString("en-IN")}`;

export interface SeekerProfileCardProps {
  profile: RoommateProfile;
  /** Compatibility vs the viewer's profile, from GET /roommates/seekers. */
  matchScore?: number | null;
}

/**
 * SeekerProfileCard — card for a roommate profile of type "no_room": a person
 * searching for a room (no property attached). Rendered on /flatmates/browse
 * below the room listings so posters can discover compatible seekers.
 *
 * Photos are public Cloudinary URLs rendered with a plain <img>, matching
 * /flatmates/profile/[id], so cards never break on a non-whitelisted host.
 */
export default function SeekerProfileCard({
  profile,
  matchScore,
}: SeekerProfileCardProps) {
  // Profiles have no display name; the profile page falls back to gender.
  const displayName = profile.gender
    ? humanizeLabel(profile.gender)
    : "Roommate";
  const href = `/flatmates/profile/${profile._id}`;
  const photo = profile.photos?.[0];

  const locationLine =
    [profile.searchArea?.locality, profile.searchArea?.city]
      .filter(Boolean)
      .join(", ") || "Area flexible";

  const { min, max } = profile.budgetRange || {};
  const budgetLabel =
    min && max
      ? `${formatInr(min)} – ${formatInr(max)}`
      : max
        ? `Up to ${formatInr(max)}`
        : min
          ? `From ${formatInr(min)}`
          : "Flexible";

  let moveInLabel: string | null = null;
  if (profile.moveInDate) {
    const d = new Date(profile.moveInDate);
    if (!Number.isNaN(d.getTime())) {
      moveInLabel = `Move-in ${d.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
      })}`;
    }
  }

  const pills = [
    profile.occupation && {
      key: "occupation",
      icon: <Briefcase className="h-3.5 w-3.5" aria-hidden />,
      label: humanizeLabel(profile.occupation),
    },
    profile.habits?.foodPreference && {
      key: "food",
      icon: <Utensils className="h-3.5 w-3.5" aria-hidden />,
      label: humanizeLabel(profile.habits.foodPreference),
    },
    profile.sleepSchedule && {
      key: "sleep",
      icon: <Moon className="h-3.5 w-3.5" aria-hidden />,
      label: humanizeLabel(profile.sleepSchedule),
    },
    profile.workSchedule && {
      key: "work",
      icon: <Clock className="h-3.5 w-3.5" aria-hidden />,
      label: humanizeLabel(profile.workSchedule),
    },
  ].filter(Boolean) as { key: string; icon: ReactNode; label: string }[];

  return (
    <article
      className="group relative flex h-full w-full flex-col overflow-hidden rounded-2xl border bg-white shadow-sm transition-shadow duration-300 hover:shadow-md"
      style={{ borderColor: BORDER }}
    >
      <Link
        href={href}
        aria-label={`${displayName} — roommate profile`}
        className="flex h-full flex-col p-4 sm:p-5"
      >
        {/* Identity row */}
        <div className="flex items-start gap-3.5">
          <div
            className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border"
            style={{ borderColor: BORDER, background: TINT_BG }}
          >
            {photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={photo}
                alt={`${displayName} photo`}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            ) : (
              <User className="h-6 w-6" style={{ color: BRAND }} aria-hidden />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h3
              className="truncate text-base font-semibold leading-snug transition-colors group-hover:text-[#4161df]"
              style={{ color: INK }}
            >
              {displayName}
            </h3>
            {profile.occupation && (
              <p
                className="mt-0.5 truncate text-xs"
                style={{ color: INK_SOFT }}
              >
                {humanizeLabel(profile.occupation)}
              </p>
            )}
            <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
              {profile.idVerified && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
                  <ShieldCheck className="h-3 w-3" aria-hidden />
                  ID verified
                </span>
              )}
              {typeof matchScore === "number" && (
                <span
                  className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold"
                  style={{ background: TINT_BG, color: BRAND }}
                >
                  <Sparkles className="h-3 w-3" aria-hidden />
                  {Math.round(matchScore)}% match
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Search criteria */}
        <div
          className="mt-3.5 space-y-1.5 border-t pt-3"
          style={{ borderColor: "#F3F4F8" }}
        >
          <div className="flex items-center gap-2">
            <MapPin
              className="h-3.5 w-3.5 shrink-0"
              style={{ color: BRAND }}
              aria-hidden
            />
            <p
              className="min-w-0 truncate text-xs"
              style={{ color: INK_SOFT }}
              title={locationLine}
            >
              {locationLine}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <IndianRupee
              className="h-3.5 w-3.5 shrink-0"
              style={{ color: BRAND }}
              aria-hidden
            />
            <p className="min-w-0 truncate text-xs" style={{ color: INK_SOFT }}>
              <span className="font-semibold" style={{ color: INK }}>
                {budgetLabel}
              </span>{" "}
              / month
            </p>
          </div>
          {moveInLabel && (
            <div className="flex items-center gap-2">
              <CalendarDays
                className="h-3.5 w-3.5 shrink-0"
                style={{ color: BRAND }}
                aria-hidden
              />
              <p
                className="min-w-0 truncate text-xs"
                style={{ color: INK_SOFT }}
              >
                {moveInLabel}
              </p>
            </div>
          )}
        </div>

        {profile.bio && (
          <p
            className="mt-3 line-clamp-2 text-xs leading-relaxed"
            style={{ color: INK_SOFT }}
          >
            {profile.bio}
          </p>
        )}

        {pills.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {pills.map((pill) => (
              <span
                key={pill.key}
                className="inline-flex max-w-full items-center gap-1.5 whitespace-nowrap rounded-md border px-2 py-1 text-[11px] font-medium"
                style={{ borderColor: BORDER, color: INK }}
              >
                <span style={{ color: BRAND }}>{pill.icon}</span>
                <span className="truncate">{pill.label}</span>
              </span>
            ))}
          </div>
        )}

        <div
          className="mt-auto flex items-center border-t pt-3"
          style={{ borderColor: "#F3F4F8" }}
        >
          <span
            className="ml-auto inline-flex items-center gap-1 text-sm font-semibold transition-opacity group-hover:opacity-80"
            style={{ color: BRAND }}
          >
            View profile
            <ArrowRight className="h-3.5 w-3.5" aria-hidden />
          </span>
        </div>
      </Link>
    </article>
  );
}
"use client";

import { useState } from "react";
import type { RoomFlat } from "@/services/roommatesApi";

/**
 * RoommateProfileCard
 *
 * One tile in a flatmate browse grid — e.g. the seekers list on
 * /flatmates/browse. Field shapes here are kept in lockstep with the real
 * `RoommateProfile` / `RoomFlat` types in services/roommatesApi.ts (nesting
 * included), so no `as any` casts are needed to plot a pin or read a city.
 *
 * Note on `user`: the roommatesApi `RoommateProfile.user` is typed as a
 * plain string id (like `roomFlat` before it's populated). This card needs
 * a display name and photo, so it expects the browse/seekers endpoint to
 * populate `user` down to at least { _id, name, avatarUrl } — same
 * convention already used for `roomFlat`. If the backend doesn't populate
 * it yet, that's the thing to fix upstream rather than in this card.
 *
 * `dateOfBirth` isn't exposed on RoommateProfile at all (unlike the Mongo
 * schema it's derived from), so this card doesn't show age.
 *
 * Deliberately does not render `documents` — that field is select:false
 * on the backend and typed as write-only (`RoommateDocument`) precisely so
 * it never ends up in a browse payload in the first place.
 */

type YesNo = "yes" | "no";
type FoodPreference = "veg" | "non_veg" | "eggetarian" | "vegan";
type CleanlinessLevel = "very_tidy" | "moderately_tidy" | "relaxed";
type Occupation =
  | "student"
  | "working_professional"
  | "self_employed"
  | "other";

export interface RoommateProfileCardUser {
  _id: string;
  name: string;
  avatarUrl?: string;
}

export interface RoommateProfileCardData {
  _id: string;
  type: "have_room" | "no_room";
  user: RoommateProfileCardUser;
  photos?: string[];
  bio?: string;
  occupation?: Occupation;
  workSchedule?: string;
  habits?: {
    smoking?: YesNo;
    drinking?: YesNo;
    foodPreference?: FoodPreference;
    cleanlinessLevel?: CleanlinessLevel;
  };
  // Mirrors SearchArea from roommatesApi.ts — set on no_room profiles.
  searchArea?: {
    locality?: string;
    city?: string;
    location?: { coordinates?: [number, number] };
  };
  budgetRange?: {
    min?: number;
    max?: number;
  };
  // Populated RoomFlat — set on have_room profiles. Note the extra nesting
  // vs searchArea: coordinates live at roomFlat.location.coordinates.coordinates.
  roomFlat?: Pick<RoomFlat, "rentAmount" | "location">;
  idVerified?: boolean;
  isComplete?: boolean;
  matchScore?: number | null;
}

interface RoommateProfileCardProps {
  profile: RoommateProfileCardData;
  onView?: (id: string) => void;
  onSave?: (id: string) => void;
  onConnect?: (id: string) => void;
  onCancel?: (id: string) => void;
  saved?: boolean;
  connected?: boolean;
}

const OCCUPATION_LABEL: Record<Occupation, string> = {
  student: "Student",
  working_professional: "Working professional",
  self_employed: "Self-employed",
  other: "Occupation not set",
};

const SCHEDULE_LABEL: Record<string, string> = {
  wfh: "Works from home",
  office: "Works from office",
  hybrid: "Hybrid schedule",
  flexible: "Flexible hours",
  irregular: "Irregular hours",
};

const FOOD_LABEL: Record<FoodPreference, string> = {
  veg: "Veg",
  non_veg: "Non-veg",
  eggetarian: "Eggetarian",
  vegan: "Vegan",
};

const CLEAN_LABEL: Record<CleanlinessLevel, string> = {
  very_tidy: "Very tidy",
  moderately_tidy: "Moderately tidy",
  relaxed: "Relaxed about mess",
};

function formatINR(amount?: number): string | null {
  if (amount === undefined || amount === null) return null;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function locationLine(profile: RoommateProfileCardData): string | null {
  if (profile.type === "have_room") {
    const loc = profile.roomFlat?.location;
    return [loc?.sector, loc?.city].filter(Boolean).join(", ") || null;
  }
  const area = profile.searchArea;
  return [area?.locality, area?.city].filter(Boolean).join(", ") || null;
}

function priceLine(profile: RoommateProfileCardData): string | null {
  if (profile.type === "have_room") {
    const rent = formatINR(profile.roomFlat?.rentAmount);
    return rent ? `${rent}/mo` : null;
  }
  const { min, max } = profile.budgetRange || {};
  if (min && max) return `${formatINR(min)}–${formatINR(max)}/mo`;
  if (max) return `Up to ${formatINR(max)}/mo`;
  return null;
}

function VerifiedBadge() {
  return (
    <span
      title="ID verified"
      className="inline-flex items-center gap-1 rounded-full bg-[#F3F4F1] px-2 py-0.5 text-[11px] text-[#2B4C3F]"
    >
      <svg width="11" height="11" viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="10" r="9" fill="#2B4C3F" />
        <path
          d="M6 10.2l2.4 2.4L14.2 7"
          stroke="#F3F4F1"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      Verified
    </span>
  );
}

function MatchRing({ score }: { score: number }) {
  const angle = Math.max(0, Math.min(100, score)) * 3.6;
  return (
    <div
      className="relative flex h-11 w-11 items-center justify-center rounded-full"
      style={{
        background: `conic-gradient(#B4772A ${angle}deg, #E7E4DC ${angle}deg)`,
      }}
    >
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[11px] font-medium text-[#1C1B19]">
        {score}%
      </div>
    </div>
  );
}

export default function RoommateProfileCard({
  profile,
  onView,
  onSave,
  onConnect,
  onCancel,
  saved = false,
  connected = false,
}: RoommateProfileCardProps) {
  const [imgError, setImgError] = useState(false);
  const photo = !imgError ? profile.photos?.[0] : undefined;
  const location = locationLine(profile);
  const price = priceLine(profile);

  const chips = [
    profile.habits?.foodPreference && FOOD_LABEL[profile.habits.foodPreference],
    profile.habits?.smoking === "yes"
      ? "Smokes"
      : profile.habits?.smoking === "no"
        ? "Non-smoker"
        : null,
    profile.habits?.drinking === "yes"
      ? "Drinks"
      : profile.habits?.drinking === "no"
        ? "Doesn't drink"
        : null,
    profile.habits?.cleanlinessLevel &&
      CLEAN_LABEL[profile.habits.cleanlinessLevel],
  ].filter(Boolean) as string[];

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-[#E7E4DC] bg-white transition-shadow hover:shadow-[0_8px_24px_-12px_rgba(28,27,25,0.25)]">
      <button
        type="button"
        onClick={() => onView?.(`/${profile._id}`)}
        className="relative aspect-[3/2] w-full overflow-hidden bg-[#EDEAE3] text-left"
      >
        {photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={photo}
            alt={profile.user.name}
            onError={() => setImgError(true)}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center font-serif text-3xl text-[#B7B2A6]">
            {profile.user.name.charAt(0).toUpperCase()}
          </div>
        )}

        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent px-3 pb-2 pt-6 text-white">
          <span className="font-serif text-base leading-none">
            {profile.user.name}
          </span>
          {location && (
            <p className="mt-0.5 text-[11px] text-white/75">{location}</p>
          )}
        </div>

        <span
          className={`absolute left-2 top-2 rounded-full px-2 py-0.5 text-[10px] text-white ${
            profile.type === "have_room" ? "bg-[#B4772A]" : "bg-[#2B4C3F]"
          }`}
        >
          {profile.type === "have_room" ? "Has a room" : "Looking for a room"}
        </span>

        {profile.idVerified && (
          <span className="absolute right-2 top-2">
            <VerifiedBadge />
          </span>
        )}
      </button>

      <div className="flex flex-1 flex-col gap-2.5 p-3">
        {profile.bio && (
          <p className="line-clamp-2 text-xs leading-snug text-[#4A4740]">
            {profile.bio}
          </p>
        )}

        <p className="text-[11px] text-[#7A766C]">
          {profile.occupation && OCCUPATION_LABEL[profile.occupation]}
          {profile.occupation && profile.workSchedule && " · "}
          {profile.workSchedule &&
            (SCHEDULE_LABEL[profile.workSchedule] || profile.workSchedule)}
        </p>

        {chips.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {chips.map((chip) => (
              <span
                key={chip}
                className="rounded-full border border-[#E7E4DC] bg-[#FAFAF8] px-2 py-0.5 text-[10px] font-medium text-[#5C5F73]"
              >
                {chip}
              </span>
            ))}
          </div>
        )}

        {/* Price and Match Score Row */}
        <div className="flex items-center justify-between">
          <div>
            {price && (
              <p className="text-sm font-semibold text-[#1C1B19]">{price}</p>
            )}
            {!profile.isComplete && (
              <p className="text-[10px] text-[#B4772A]">
                Profile still being filled in
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            {typeof profile.matchScore === "number" && (
              <MatchRing score={profile.matchScore} />
            )}
            <button
              type="button"
              onClick={() => onSave?.(profile._id)}
              aria-pressed={saved}
              aria-label={saved ? "Remove from saved" : "Save profile"}
              className={`flex h-8 w-8 items-center justify-center rounded-full border transition-all ${
                saved
                  ? "border-[#B4772A] bg-[#B4772A]/10 text-[#B4772A]"
                  : "border-[#E7E4DC] text-[#4A4740] hover:border-[#B4772A] hover:text-[#B4772A]"
              }`}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 20 20"
                fill={saved ? "#B4772A" : "none"}
              >
                <path
                  d="M5 3.5h10a1 1 0 011 1V17l-6-3.4L4 17V4.5a1 1 0 011-1z"
                  stroke={saved ? "#B4772A" : "#4A4740"}
                  strokeWidth="1.4"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Let's Connect Button - Primary CTA at bottom */}
        <div className="mt-auto pt-1">
          <button
            type="button"
            onClick={() => onConnect?.(profile._id)}
            disabled={connected}
            className={`flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold uppercase tracking-wide transition-all duration-200 ${
              connected
                ? "bg-emerald-50 text-emerald-700 border-2 border-emerald-200 cursor-default"
                : "bg-gradient-to-r from-[#4161df] to-[#5a7af0] text-white shadow-md shadow-[#4161df]/20 hover:shadow-lg hover:shadow-[#4161df]/30 hover:from-[#3451c9] hover:to-[#4161df] active:scale-[0.98]"
            }`}
          >
            {connected ? (
              <>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Connection Request Sent
              </>
            ) : (
              <>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
                Let's Connect
              </>
            )}
          </button>

          {/* Cancel Request Link */}
          {connected && (
            <button
              type="button"
              onClick={() => onCancel?.(profile._id)}
              className="mt-1.5 w-full text-center text-[11px] font-medium text-rose-500 underline decoration-rose-300 underline-offset-2 hover:text-rose-600 hover:decoration-rose-400 transition-colors"
            >
              Cancel Request
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

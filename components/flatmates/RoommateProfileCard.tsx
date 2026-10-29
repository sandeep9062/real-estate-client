"use client";

import { useState } from "react";
import type { RoomFlat } from "@/services/roommatesApi";

/**
 * RoommateProfileCard
 *
 * One tile in the flatmate browse grid (/flatmates).
 *
 * Data contract is unchanged from the previous version:
 *  - `user` must be populated down to { _id, name, avatarUrl } by the
 *    seekers endpoint.
 *  - `roomFlat` is populated for have_room profiles (coordinates live at
 *    roomFlat.location.coordinates.coordinates).
 *  - `documents` is never rendered (select:false on the backend).
 *  - `dateOfBirth` isn't exposed, so no age is shown.
 *
 * Layout (top to bottom):
 *   photo (type pill left, like button right, name + place over the photo)
 *   -> identity row (occupation, schedule, verified)
 *   -> bio
 *   -> lifestyle chips
 *   -> divider
 *   -> price + match score
 *   -> connect action
 *
 * Note: `onView` now receives the bare profile id. The previous version
 * passed `/${id}`, which produced `/flatmates/profile//<id>` in the page's
 * router.push call.
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
  name?: string;
  avatarUrl?: string;
}

export interface RoommateProfileCardData {
  _id: string;
  type: "have_room" | "no_room";
  user?: RoommateProfileCardUser | null;
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
  // Populated RoomFlat — set on have_room profiles.
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
  liked?: boolean;
  onLike?: (id: string) => void;
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

const BRAND = "#4161df";
const INK = "#161A2E";
const INK_SOFT = "#5C5F73";

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

function priceLine(profile: RoommateProfileCardData): {
  label: string;
  value: string;
} | null {
  if (profile.type === "have_room") {
    const rent = formatINR(profile.roomFlat?.rentAmount);
    return rent ? { label: "Rent", value: `${rent}/mo` } : null;
  }
  const { min, max } = profile.budgetRange || {};
  if (min && max)
    return {
      label: "Budget",
      value: `${formatINR(min)} – ${formatINR(max)}/mo`,
    };
  if (max) return { label: "Budget", value: `Up to ${formatINR(max)}/mo` };
  return null;
}

function VerifiedBadge() {
  return (
    <span
      title="ID verified"
      className="inline-flex shrink-0 items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700 ring-1 ring-inset ring-emerald-200"
    >
      <svg width="11" height="11" viewBox="0 0 20 20" fill="none" aria-hidden>
        <circle cx="10" cy="10" r="9" fill="currentColor" />
        <path
          d="M6 10.2l2.4 2.4L14.2 7"
          stroke="#ECFDF5"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      ID verified
    </span>
  );
}

function MatchRing({ score }: { score: number }) {
  const clamped = Math.max(0, Math.min(100, score));
  const angle = clamped * 3.6;
  return (
    <div
      className="flex items-center gap-2"
      title={`${clamped}% compatibility`}
    >
      <div
        className="flex h-10 w-10 items-center justify-center rounded-full"
        style={{
          background: `conic-gradient(${BRAND} ${angle}deg, #E5E7F2 ${angle}deg)`,
        }}
        role="img"
        aria-label={`${clamped} percent match`}
      >
        <div
          className="flex h-[32px] w-[32px] items-center justify-center rounded-full bg-white text-[11px] font-semibold"
          style={{ color: INK }}
        >
          {clamped}
        </div>
      </div>
      <span className="text-[11px] leading-tight" style={{ color: INK_SOFT }}>
        Match
      </span>
    </div>
  );
}

export default function RoommateProfileCard({
  profile,
  onView,
  onConnect,
  onCancel,
  connected = false,
  liked = false,
  onLike,
}: RoommateProfileCardProps) {
  const [imgError, setImgError] = useState(false);
  const displayName = profile?.user?.name?.trim() || "Flatmate";
  const displayInitial = (displayName.charAt(0) || "F").toUpperCase();
  const photo = !imgError ? profile.photos?.[0] : undefined;
  const location = locationLine(profile);
  const price = priceLine(profile);
  const hasRoom = profile.type === "have_room";

  const identity = [
    profile.occupation && OCCUPATION_LABEL[profile.occupation],
    profile.workSchedule &&
      (SCHEDULE_LABEL[profile.workSchedule] || profile.workSchedule),
  ].filter(Boolean) as string[];

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
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#E5E7F2] bg-white shadow-[0_1px_2px_rgba(22,26,46,0.04)] transition-shadow duration-200 hover:shadow-[0_12px_32px_-16px_rgba(22,26,46,0.28)]">
      {/* Photo */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#EEF0F8]">
        <button
          type="button"
          onClick={() => onView?.(profile._id)}
          aria-label={`View ${displayName}'s profile`}
          className="absolute inset-0 block h-full w-full text-left focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#4161df]"
        >
          {photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={photo}
              alt={displayName}
              loading="lazy"
              onError={() => setImgError(true)}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#EEF0F8] to-[#DDE2F5]">
              <span
                className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-2xl font-semibold shadow-sm"
                style={{ color: BRAND }}
              >
                {displayInitial}
              </span>
            </div>
          )}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/65 to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 px-3.5 pb-3 text-white">
            <h3 className="truncate text-base font-semibold leading-tight">
              {displayName}
            </h3>
            {location && (
              <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-white/85">
                <svg
                  width="11"
                  height="11"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                {location}
              </p>
            )}
          </div>
        </button>

        {/* Type pill */}
        <span
          className={`pointer-events-none absolute left-2.5 top-2.5 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-medium shadow-sm backdrop-blur ${
            hasRoom ? "text-[#92400E]" : "text-[#3451c9]"
          }`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              hasRoom ? "bg-amber-500" : "bg-[#4161df]"
            }`}
          />
          {hasRoom ? "Has a room" : "Looking for a room"}
        </span>

        {/* Like */}
        <button
          type="button"
          onClick={() => onLike?.(profile._id)}
          aria-pressed={liked}
          aria-label={liked ? "Unlike this profile" : "Like this profile"}
          className={`absolute right-2.5 top-2.5 flex h-9 w-9 items-center justify-center rounded-full shadow-sm backdrop-blur transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4161df] ${
            liked
              ? "bg-rose-50 text-rose-500 ring-1 ring-rose-200"
              : "bg-white/95 text-gray-500 hover:bg-white hover:text-rose-500"
          }`}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill={liked ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-3 p-4">
        {(identity.length > 0 || profile.idVerified) && (
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              {identity[0] && (
                <p
                  className="truncate text-sm font-medium"
                  style={{ color: INK }}
                >
                  {identity[0]}
                </p>
              )}
              {identity[1] && (
                <p
                  className="mt-0.5 truncate text-xs"
                  style={{ color: INK_SOFT }}
                >
                  {identity[1]}
                </p>
              )}
            </div>
            {profile.idVerified && <VerifiedBadge />}
          </div>
        )}

        {profile.bio && (
          <p
            className="line-clamp-2 text-[13px] leading-relaxed"
            style={{ color: INK_SOFT }}
          >
            {profile.bio}
          </p>
        )}

        {chips.length > 0 && (
          <ul className="flex flex-wrap gap-1.5">
            {chips.map((chip) => (
              <li
                key={chip}
                className="rounded-md bg-[#F4F5FB] px-2 py-1 text-[11px] font-medium"
                style={{ color: INK_SOFT }}
              >
                {chip}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-auto space-y-3 pt-1">
          <div className="flex items-end justify-between gap-3 border-t border-[#EEF0F8] pt-3">
            <div className="min-w-0">
              {price ? (
                <>
                  <p className="text-[11px]" style={{ color: INK_SOFT }}>
                    {price.label}
                  </p>
                  <p
                    className="truncate text-base font-semibold leading-tight"
                    style={{ color: INK }}
                  >
                    {price.value}
                  </p>
                </>
              ) : (
                <p className="text-xs" style={{ color: INK_SOFT }}>
                  Price not shared
                </p>
              )}
              {!profile.isComplete && (
                <p className="mt-1 text-[11px] text-amber-700">
                  Profile still being filled in
                </p>
              )}
            </div>
            {typeof profile.matchScore === "number" && (
              <MatchRing score={profile.matchScore} />
            )}
          </div>

          <div>
            <button
              type="button"
              onClick={() => onConnect?.(profile._id)}
              disabled={connected}
              className={`flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4161df] ${
                connected
                  ? "cursor-default border border-emerald-200 bg-emerald-50 text-emerald-700"
                  : "bg-[#4161df] text-white hover:bg-[#3451c9] active:bg-[#2c45b3]"
              }`}
            >
              {connected ? (
                <>
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Request sent
                </>
              ) : (
                "Send connection request"
              )}
            </button>

            {connected && (
              <button
                type="button"
                onClick={() => onCancel?.(profile._id)}
                className="mt-1.5 w-full rounded-md py-1 text-center text-xs font-medium text-gray-500 transition-colors hover:text-rose-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#4161df]"
              >
                Cancel request
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

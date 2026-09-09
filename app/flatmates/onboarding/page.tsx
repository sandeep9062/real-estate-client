"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, Loader2 } from "lucide-react";
import {
  useCreateProfileMutation,
  useCreateRoomFlatMutation,
} from "@/services/roommatesApi";
import PhotosLocationFlat from "@/components/flatmates/PhotosLocationFlat";

const BRAND = "#4161df";
const INK = "#161A2E";
const INK_SOFT = "#5C5F73";
const TINT_BG = "#EEF1FC";

const NEEDS_PROPERTY = ["has_room", "swap", "temporary_offer"];
const NEEDS_SEARCH_AREA = ["seeking_room", "temporary_seek"];

const INPUT_CLS =
  "w-full rounded-lg border p-2.5 text-sm outline-none transition-shadow focus:ring-2";
const INPUT_STYLE = { borderColor: "#D8DCEC" };

const INTENT_LABELS: Record<string, string> = {
  has_room: "Have a room, need a flatmate",
  seeking_room: "Looking for a room",
  swap: "Want to swap flats",
  temporary_offer: "Offering a temporary stay",
  temporary_seek: "Need a temporary stay",
};

// Nicer option labels for enum values that humanize() can't turn into English.
const LABELS: Record<string, string> = {
  wfh: "Work from home",
  prefer_not_to_say: "Prefer not to say",
  no_preference: "No preference",
  working_professional: "Working professional",
  very_tidy: "Very tidy",
  moderately_tidy: "Moderately tidy",
  semi_furnished: "Semi-furnished",
  allowed_with_notice: "Allowed with notice",
  not_allowed: "Not allowed",
};

// Enum option lists mirroring backend/models/RoommateProfile.js and RoomFlat.js.
const OPTIONS = {
  gender: ["male", "female", "other", "prefer_not_to_say"],
  occupation: ["student", "working_professional", "self_employed", "other"],
  workSchedule: ["wfh", "office", "hybrid", "flexible", "irregular"],
  sleepSchedule: ["early_bird", "night_owl", "flexible"],
  habitYesNo: ["yes", "no"],
  foodPreference: ["veg", "non_veg", "eggetarian", "vegan"],
  cleanlinessLevel: ["very_tidy", "moderately_tidy", "relaxed"],
  guestsFrequency: ["rarely", "sometimes", "often"],
  genderPreference: ["male", "female", "any"],
  prefYesNo: ["yes", "no", "no_preference"],
  foodPrefAny: ["veg", "non_veg", "any"],
  occupationAny: ["student", "working", "any"],
  roomType: ["private_room", "shared_room", "entire_flat"],
  furnishing: ["furnished", "semi_furnished", "unfurnished"],
  guestsAllowed: ["allowed", "allowed_with_notice", "not_allowed"],
};

// Same conversion the add-property flow uses: Map reports {lat,lng}, while the
// backend stores GeoJSON {type:"Point", coordinates:[lng,lat]}.
function convertLatLngToGeoJSON(coords: { lat: number; lng: number }) {
  if (
    coords &&
    typeof coords.lat === "number" &&
    typeof coords.lng === "number"
  ) {
    return { type: "Point", coordinates: [coords.lng, coords.lat] };
  }
  return { type: "Point", coordinates: [0, 0] };
}

function normalizeCoordinates(coordinates: any) {
  if (
    coordinates &&
    Array.isArray(coordinates.coordinates) &&
    coordinates.coordinates.length >= 2
  ) {
    return {
      type: "Point",
      coordinates: [
        Number(coordinates.coordinates[0]) || 0,
        Number(coordinates.coordinates[1]) || 0,
      ],
    };
  }
  return convertLatLngToGeoJSON(coordinates || {});
}
type RoomFlatDraft = {
  title: string;
  rentAmount: string;
  roomType: string;
  photos?: (string | File)[];
  location?: Record<string, any>;
  description?: string;
  securityDeposit?: string;
  furnishing?: string;
  availableFrom?: string;
  minStayMonths?: string;
  openToSwap?: boolean;
  petsAllowed?: boolean;
  houseRules?: Record<string, any>;
  swapDetails?: Record<string, any>;
  temporaryDetails?: Record<string, any>;
};

/**
 * The room-flat endpoint accepts both JSON and multipart. When newly-picked
 * File objects are present we send FormData with the JSON body stringified in
 * `payload` and the files attached as `photos` (uploaded to Cloudinary by the
 * multer middleware on the backend).
 */
function buildRoomFlatRequestBody(draft: RoomFlatDraft) {
  const photos = draft.photos || [];
  const keptUrls = photos.filter((p): p is string => typeof p === "string");
  const files = photos.filter((p): p is File => p instanceof File);

  const jsonPayload = {
    title: draft.title,
    description: draft.description || undefined,
    rentAmount: Number(draft.rentAmount),
    securityDeposit: draft.securityDeposit
      ? Number(draft.securityDeposit)
      : undefined,
    roomType: draft.roomType,
    furnishing: draft.furnishing || undefined,
    availableFrom: draft.availableFrom || undefined,
    minStayMonths: draft.minStayMonths
      ? Number(draft.minStayMonths)
      : undefined,
    openToSwap: draft.openToSwap,
    petsAllowed: draft.petsAllowed,
    location: draft.location,
    photos: keptUrls,
    ...(draft.houseRules ? { houseRules: draft.houseRules } : {}),
    ...(draft.swapDetails ? { swapDetails: draft.swapDetails } : {}),
    ...(draft.temporaryDetails
      ? { temporaryDetails: draft.temporaryDetails }
      : {}),
  };

  if (!files.length) return jsonPayload;

  const formData = new FormData();
  formData.append("payload", JSON.stringify(jsonPayload));
  files.forEach((file) => formData.append("photos", file));
  return formData;
}
function OnboardingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const intent = searchParams.get("intent");

  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [createProfile] = useCreateProfileMutation();
  const [createRoomFlat] = useCreateRoomFlatMutation();

  // Every user-editable field from RoommateProfile (backend model).
  const [profile, setProfile] = useState({
    bio: "",
    gender: "",
    dateOfBirth: "",
    occupation: "",
    workSchedule: "",
    sleepSchedule: "",
    languages: "",
    habits: {
      smoking: "",
      drinking: "",
      nightlifeFriendly: "",
      foodPreference: "",
      ownsPets: false,
      okayWithPets: false,
      cleanlinessLevel: "",
      guestsFrequency: "",
    },
    lookingFor: {
      genderPreference: "any",
      ageRange: { min: "", max: "" },
      smoking: "no_preference",
      drinking: "no_preference",
      nightlifeFriendly: "no_preference",
      foodPreference: "any",
      occupation: "any",
    },
    searchArea: { city: "", locality: "", radiusKm: "5", lat: "", lng: "" },
    budgetRange: { min: "", max: "" },
    moveInDate: "",
    stayDurationMonths: "",
  });// Every user-editable field from RoomFlat (backend model).
  const [roomFlat, setRoomFlat] = useState({
    title: "",
    description: "",
    rentAmount: "",
    securityDeposit: "",
    roomType: "private_room",
    furnishing: "",
    availableFrom: "",
    minStayMonths: "",
    openToSwap: false,
    petsAllowed: false,
    location: { sector: "", state: "", pincode: "", landmark: "" },
    houseRules: {
      ownerLivesOnPremises: false,
      curfew: { hasCurfew: false, time: "" },
      oppositeGenderGuestsAllowed: "",
      overnightGuestsAllowed: "",
      smokingAllowedOnPremises: false,
      drinkingAllowedOnPremises: false,
    },
    swapDetails: {
      desiredCity: "",
      desiredLocality: "",
      desiredRentRange: { min: "", max: "" },
    },
    temporaryDetails: { startDate: "", endDate: "" },
  });

  // Draft consumed by PhotosLocationFlat (same shape as the add-property
  // flow's propertyDetails): `image` holds kept URLs or newly-picked Files,
  // `location.coordinates` becomes GeoJSON once the map is used.
  const [roomFlatDetails, setRoomFlatDetails] = useState<{
    image: (string | File)[];
    location: {
      country?: string;
      city?: string;
      address?: string;
      coordinates?: any;
    };
  }>({
    image: [],
    location: { country: "", city: "", address: "", coordinates: null },
  });

  // ---- Update helpers (pure setters for nested pieces of state) ----
  const updateProfileField = (key: string, value: any) =>
    setProfile((p) => ({ ...p, [key]: value }));

  const updateHabit = (key: string, value: any) =>
    setProfile((p) => ({ ...p, habits: { ...p.habits, [key]: value } }));

  const updateLookingFor = (key: string, value: any) =>
    setProfile((p) => ({
      ...p,
      lookingFor: { ...p.lookingFor, [key]: value },
    }));

  const updateAgeRange = (key: string, value: string) =>
    setProfile((p) => ({
      ...p,
      lookingFor: {
        ...p.lookingFor,
        ageRange: { ...p.lookingFor.ageRange, [key]: value },
      },
    }));

  const updateSearchArea = (key: string, value: any) =>
    setProfile((p) => ({ ...p, searchArea: { ...p.searchArea, [key]: value } }));

  const updateBudget = (key: string, value: string) =>
    setProfile((p) => ({
      ...p,
      budgetRange: { ...p.budgetRange, [key]: value },
    }));

  const updateRoomFlatField = (key: string, value: any) =>
    setRoomFlat((r) => ({ ...r, [key]: value }));

  const updateHouseRule = (key: string, value: any) =>
    setRoomFlat((r) => ({
      ...r,
      houseRules: { ...r.houseRules, [key]: value },
    }));

  const updateCurfew = (key: string, value: any) =>
    setRoomFlat((r) => ({
      ...r,
      houseRules: {
        ...r.houseRules,
        curfew: { ...r.houseRules.curfew, [key]: value },
      },
    }));

  const updateSwapDetail = (key: string, value: any) =>
    setRoomFlat((r) => ({
      ...r,
      swapDetails: { ...r.swapDetails, [key]: value },
    }));

  const updateSwapRentRange = (key: string, value: string) =>
    setRoomFlat((r) => ({
      ...r,
      swapDetails: {
        ...r.swapDetails,
        desiredRentRange: { ...r.swapDetails.desiredRentRange, [key]: value },
      },
    }));

  const updateTemporaryDetail = (key: string, value: string) =>
    setRoomFlat((r) => ({
      ...r,
      temporaryDetails: { ...r.temporaryDetails, [key]: value },
    }));

  const updateLocationExtra = (key: string, value: string) =>
    setRoomFlat((r) => ({ ...r, location: { ...r.location, [key]: value } }));

  if (!intent) {
    return (
      <main className="mx-auto max-w-xl px-6 py-24 text-center">
        <p className="text-[15px]" style={{ color: INK_SOFT }}>
          Pick what you're here for first —{" "}
          <a
            href="/flatmates"
            className="font-semibold underline"
            style={{ color: BRAND }}
          >
            go back
          </a>
          .
        </p>
      </main>
    );
  }

  const needsProperty = NEEDS_PROPERTY.includes(intent);
  const needsSearchArea = NEEDS_SEARCH_AREA.includes(intent);
  const totalSteps = needsProperty ? 4 : 2;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await doSubmit();
  }

  async function doSubmit(roomFlatOverride?: RoomFlatDraft) {
    if (submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      const payload = {
        intent,
        bio: profile.bio,
        gender: profile.gender,
        dateOfBirth: profile.dateOfBirth || undefined,
        occupation: profile.occupation,
        workSchedule: profile.workSchedule || undefined,
        sleepSchedule: profile.sleepSchedule || undefined,
        languages: profile.languages
          .split(",")
          .map((s) => s.trim())
          .filter((s) => s.length > 0),
        habits: profile.habits,
        lookingFor: {
          ...profile.lookingFor,
          ageRange: {
            min: profile.lookingFor.ageRange.min
              ? Number(profile.lookingFor.ageRange.min)
              : undefined,
            max: profile.lookingFor.ageRange.max
              ? Number(profile.lookingFor.ageRange.max)
              : undefined,
          },
        },
        moveInDate: profile.moveInDate || undefined,
        stayDurationMonths: profile.stayDurationMonths
          ? Number(profile.stayDurationMonths)
          : undefined,
        ...(needsSearchArea && {
          searchArea: {
            city: profile.searchArea.city,
            locality: profile.searchArea.locality || undefined,
            radiusKm: Number(profile.searchArea.radiusKm) || 5,
            location:
              profile.searchArea.lat && profile.searchArea.lng
                ? convertLatLngToGeoJSON({
                    lat: Number(profile.searchArea.lat),
                    lng: Number(profile.searchArea.lng),
                  })
                : undefined,
          },
          budgetRange: {
            min: profile.budgetRange.min
              ? Number(profile.budgetRange.min)
              : undefined,
            max: profile.budgetRange.max
              ? Number(profile.budgetRange.max)
              : undefined,
          },
        }),
      };

      await createProfile(payload as any).unwrap();

      if (needsProperty) {
        const draft = roomFlatOverride ?? roomFlat;
        await createRoomFlat(buildRoomFlatRequestBody(draft) as any).unwrap();
      }

      router.push("/flatmates/profile/me");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }/**
   * "Next step" from PhotosLocationFlat — validate the listing basics, merge
   * the resolved photos + location (handed over by the component before its
   * own state update flushes) and submit everything in one go.
   */
  async function handlePlaceNext(
    resolved?: { image?: (string | File)[]; location?: Record<string, any> },
  ) {
    if (!roomFlat.title.trim()) {
      setError("Please add a listing title.");
      return;
    }
    if (!roomFlat.rentAmount || Number(roomFlat.rentAmount) <= 0) {
      setError("Please enter a valid monthly rent.");
      return;
    }
    setError(null);

    const location = {
      ...roomFlat.location,
      ...(resolved?.location || {}),
      coordinates: normalizeCoordinates(roomFlatDetails.location.coordinates),
    };

    const draft: RoomFlatDraft = {
      ...roomFlat,
      photos: resolved?.image ?? roomFlatDetails.image,
      location,
    };

    if (intent === "swap") {
      draft.swapDetails = {
        desiredCity: roomFlat.swapDetails.desiredCity || undefined,
        desiredLocality: roomFlat.swapDetails.desiredLocality || undefined,
        desiredRentRange: {
          min: roomFlat.swapDetails.desiredRentRange.min
            ? Number(roomFlat.swapDetails.desiredRentRange.min)
            : undefined,
          max: roomFlat.swapDetails.desiredRentRange.max
            ? Number(roomFlat.swapDetails.desiredRentRange.max)
            : undefined,
        },
      };
    }

    if (intent === "temporary_offer") {
      draft.temporaryDetails = {
        startDate: roomFlat.temporaryDetails.startDate || undefined,
        endDate: roomFlat.temporaryDetails.endDate || undefined,
      };
    }

    await doSubmit(draft);
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-14 sm:py-20">
      {INTENT_LABELS[intent] && (
        <span
          className="inline-block text-xs font-semibold px-3 py-1 rounded-full mb-4"
          style={{ background: TINT_BG, color: BRAND }}
        >
          {INTENT_LABELS[intent]}
        </span>
      )}

      <h1
        className="text-2xl sm:text-3xl font-bold tracking-tight"
        style={{ color: INK }}
      >
        Set up your profile
      </h1>

      {/* Step indicator */}
      <div className="mt-5 flex items-center gap-2">
        {Array.from({ length: totalSteps }).map((_, i) => {
          const n = i + 1;
          const isDone = n < step;
          const isActive = n === step;
          return (
            <div key={n} className="flex items-center gap-2 flex-1">
              <div
                className="flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold shrink-0 transition-colors"
                style={{
                  background: isDone || isActive ? BRAND : "#E5E7F2",
                  color: isDone || isActive ? "white" : INK_SOFT,
                }}
              >
                {isDone ? <Check className="w-3.5 h-3.5" /> : n}
              </div>
              {n < totalSteps && (
                <div
                  className="h-[2px] flex-1 rounded-full"
                  style={{ background: isDone ? BRAND : "#E5E7F2" }}
                />
              )}
            </div>
          );
        })}
      </div>

      {error && (
        <div
          className="mt-6 rounded-lg border-l-[3px] bg-rose-50/70 px-3.5 py-2.5 text-sm text-rose-700"
          style={{ borderLeftColor: "#e11d48" }}
        >
          {error}
        </div>
      )}

      {/* ── Step 1 · About you (every RoommateProfile field) ─────────────── */}
      {step === 1 && (
        <form onSubmit={handleSubmit} className="mt-8">
          <div
            className="rounded-2xl border bg-white p-6 sm:p-7 space-y-6"
            style={{ borderColor: "#E5E7F2" }}
          >
            <SectionTitle>Identity &amp; work</SectionTitle>

            <SelectField
              label="Gender"
              value={profile.gender}
              onValue={(v) => updateProfileField("gender", v)}
              options={OPTIONS.gender}
            />
            <TextInputField
              label="Date of birth"
              type="date"
              value={profile.dateOfBirth}
              onValue={(v) => updateProfileField("dateOfBirth", v)}
            />
            <SelectField
              label="Occupation"
              value={profile.occupation}
              onValue={(v) => updateProfileField("occupation", v)}
              options={OPTIONS.occupation}
            />
            <SelectField
              label="Work schedule"
              value={profile.workSchedule}
              onValue={(v) => updateProfileField("workSchedule", v)}
              options={OPTIONS.workSchedule}
            />
            <SelectField
              label="Sleep schedule"
              value={profile.sleepSchedule}
              onValue={(v) => updateProfileField("sleepSchedule", v)}
              options={OPTIONS.sleepSchedule}
            />
            <TextInputField
              label="Languages"
              value={profile.languages}
              onValue={(v) => updateProfileField("languages", v)}
              placeholder="English, Hindi, Punjabi"
              hint="Comma-separated list"
            /><SectionTitle>About you</SectionTitle>

            <TextAreaField
              label="Bio"
              value={profile.bio}
              onValue={(v) => updateProfileField("bio", v)}
              placeholder="A couple of lines about you"
              rows={3}
            />

            <SectionTitle>Habits</SectionTitle>

            <SelectField
              label="Smoking"
              value={profile.habits.smoking}
              onValue={(v) => updateHabit("smoking", v)}
              options={OPTIONS.habitYesNo}
            />
            <SelectField
              label="Drinking"
              value={profile.habits.drinking}
              onValue={(v) => updateHabit("drinking", v)}
              options={OPTIONS.habitYesNo}
            />
            <SelectField
              label="Nightlife-friendly"
              value={profile.habits.nightlifeFriendly}
              onValue={(v) => updateHabit("nightlifeFriendly", v)}
              options={OPTIONS.habitYesNo}
            />
            <SelectField
              label="Food preference"
              value={profile.habits.foodPreference}
              onValue={(v) => updateHabit("foodPreference", v)}
              options={OPTIONS.foodPreference}
            />
            <SelectField
              label="Cleanliness"
              value={profile.habits.cleanlinessLevel}
              onValue={(v) => updateHabit("cleanlinessLevel", v)}
              options={OPTIONS.cleanlinessLevel}
            />
            <SelectField
              label="Guests frequency"
              value={profile.habits.guestsFrequency}
              onValue={(v) => updateHabit("guestsFrequency", v)}
              options={OPTIONS.guestsFrequency}
            />
            <CheckboxRow>
              <CheckboxField
                label="I own pets"
                checked={profile.habits.ownsPets}
                onChecked={(v) => updateHabit("ownsPets", v)}
              />
              <CheckboxField
                label="I'm okay with flatmates having pets"
                checked={profile.habits.okayWithPets}
                onChecked={(v) => updateHabit("okayWithPets", v)}
              />
            </CheckboxRow>

            <SectionTitle>What you&apos;re looking for in a flatmate</SectionTitle>

            <SelectField
              label="Gender preference"
              value={profile.lookingFor.genderPreference}
              onValue={(v) => updateLookingFor("genderPreference", v)}
              options={OPTIONS.genderPreference}
            />
            <Field label="Age range">
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  placeholder="Min"
                  value={profile.lookingFor.ageRange.min}
                  onChange={(e) => updateAgeRange("min", e.target.value)}
                  className={INPUT_CLS}
                  style={INPUT_STYLE}
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={profile.lookingFor.ageRange.max}
                  onChange={(e) => updateAgeRange("max", e.target.value)}
                  className={INPUT_CLS}
                  style={INPUT_STYLE}
                />
              </div>
            </Field>
            <SelectField
              label="Smoking"
              value={profile.lookingFor.smoking}
              onValue={(v) => updateLookingFor("smoking", v)}
              options={OPTIONS.prefYesNo}
            />
            <SelectField
              label="Drinking"
              value={profile.lookingFor.drinking}
              onValue={(v) => updateLookingFor("drinking", v)}
              options={OPTIONS.prefYesNo}
            />
            <SelectField
              label="Nightlife-friendly"
              value={profile.lookingFor.nightlifeFriendly}
              onValue={(v) => updateLookingFor("nightlifeFriendly", v)}
              options={OPTIONS.prefYesNo}
            />
            <SelectField
              label="Food preference"
              value={profile.lookingFor.foodPreference}
              onValue={(v) => updateLookingFor("foodPreference", v)}
              options={OPTIONS.foodPrefAny}
            />
            <SelectField
              label="Occupation"
              value={profile.lookingFor.occupation}
              onValue={(v) => updateLookingFor("occupation", v)}
              options={OPTIONS.occupationAny}
            />

            <SectionTitle>Timing</SectionTitle>

            <TextInputField
              label="Move-in date"
              type="date"
              value={profile.moveInDate}
              onValue={(v) => updateProfileField("moveInDate", v)}
            />
            <TextInputField
              label="Stay duration (months)"
              type="number"
              value={profile.stayDurationMonths}
              onValue={(v) => updateProfileField("stayDurationMonths", v)}
              placeholder="e.g. 3"
              hint="Relevant if you're looking for a temporary stay"
            />
          </div>

          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="ml-auto inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors"
              style={{ background: BRAND }}
            >
              Next:{" "}
              {needsProperty ? "describe your place" : "where & budget"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      )}{/* ── Step 2a · Seeker: where & budget (searchArea + budgetRange) ── */}
      {step === 2 && needsSearchArea && (
        <form onSubmit={handleSubmit} className="mt-8">
          <div
            className="rounded-2xl border bg-white p-6 sm:p-7 space-y-6"
            style={{ borderColor: "#E5E7F2" }}
          >
            <SectionTitle>Where are you looking?</SectionTitle>

            <TextInputField
              label="City"
              required
              value={profile.searchArea.city}
              onValue={(v) => updateSearchArea("city", v)}
              placeholder="e.g. Chandigarh"
            />
            <TextInputField
              label="Locality"
              value={profile.searchArea.locality}
              onValue={(v) => updateSearchArea("locality", v)}
              placeholder="e.g. Sector 17"
            />
            <TextInputField
              label="Search radius (km)"
              type="number"
              value={profile.searchArea.radiusKm}
              onValue={(v) => updateSearchArea("radiusKm", v)}
            />
            <Field label="Location (lat / lng)">
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  step="any"
                  placeholder="Latitude"
                  value={profile.searchArea.lat}
                  onChange={(e) => updateSearchArea("lat", e.target.value)}
                  className={INPUT_CLS}
                  style={INPUT_STYLE}
                />
                <input
                  type="number"
                  step="any"
                  placeholder="Longitude"
                  value={profile.searchArea.lng}
                  onChange={(e) => updateSearchArea("lng", e.target.value)}
                  className={INPUT_CLS}
                  style={INPUT_STYLE}
                />
              </div>
            </Field>

            <SectionTitle>Budget</SectionTitle>

            <TextInputField
              label="Min rent (₹/month)"
              type="number"
              value={profile.budgetRange.min}
              onValue={(v) => updateBudget("min", v)}
            />
            <TextInputField
              label="Max rent (₹/month)"
              type="number"
              value={profile.budgetRange.max}
              onValue={(v) => updateBudget("max", v)}
            />
          </div>

          <div className="mt-6 flex gap-3">
            <BackButton onClick={() => setStep(1)} />
            <button
              type="submit"
              disabled={submitting}
              className="ml-auto inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors disabled:opacity-60"
              style={{ background: BRAND }}
            >
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {submitting ? "Saving…" : "Create profile"}
            </button>
          </div>
        </form>
      )}{/* ── Step 2b · Property: describe your place (RoomFlat basics) ──── */}
      {step === 2 && needsProperty && (
        <form className="mt-8" onSubmit={(e) => e.preventDefault()}>
          <div
            className="rounded-2xl border bg-white p-6 sm:p-7 space-y-6"
            style={{ borderColor: "#E5E7F2" }}
          >
            <SectionTitle>Listing basics</SectionTitle>

            <TextInputField
              label="Listing title"
              required
              value={roomFlat.title}
              onValue={(v) => updateRoomFlatField("title", v)}
              placeholder="e.g. Sunny private room in Sector 21"
            />
            <TextInputField
              label="Rent (₹/month)"
              required
              type="number"
              value={roomFlat.rentAmount}
              onValue={(v) => updateRoomFlatField("rentAmount", v)}
            />
            <TextInputField
              label="Security deposit (₹)"
              type="number"
              value={roomFlat.securityDeposit}
              onValue={(v) => updateRoomFlatField("securityDeposit", v)}
            />
            <SelectField
              label="Room type"
              required
              value={roomFlat.roomType}
              onValue={(v) => updateRoomFlatField("roomType", v)}
              options={OPTIONS.roomType}
            />
            <SelectField
              label="Furnishing"
              value={roomFlat.furnishing}
              onValue={(v) => updateRoomFlatField("furnishing", v)}
              options={OPTIONS.furnishing}
            />
            <TextInputField
              label="Available from"
              type="date"
              value={roomFlat.availableFrom}
              onValue={(v) => updateRoomFlatField("availableFrom", v)}
            />
            <TextInputField
              label="Minimum stay (months)"
              type="number"
              value={roomFlat.minStayMonths}
              onValue={(v) => updateRoomFlatField("minStayMonths", v)}
            />

            <SectionTitle>Description</SectionTitle>

            <TextAreaField
              label="Description"
              value={roomFlat.description}
              onValue={(v) => updateRoomFlatField("description", v)}
              placeholder="What's the place like? Locality, nearby landmarks, vibe…"
              rows={4}
            />

            <SectionTitle>Location extras (optional)</SectionTitle>

            <TextInputField
              label="Sector"
              value={roomFlat.location.sector}
              onValue={(v) => updateLocationExtra("sector", v)}
              placeholder="e.g. Sector 21"
            />
            <TextInputField
              label="State"
              value={roomFlat.location.state}
              onValue={(v) => updateLocationExtra("state", v)}
            />
            <TextInputField
              label="Pincode"
              value={roomFlat.location.pincode}
              onValue={(v) => updateLocationExtra("pincode", v)}
            />
            <TextInputField
              label="Landmark"
              value={roomFlat.location.landmark}
              onValue={(v) => updateLocationExtra("landmark", v)}
            />

            <SectionTitle>Sharing preferences</SectionTitle>

            <CheckboxRow>
              <CheckboxField
                label="Open to swapping this room/flat later"
                checked={roomFlat.openToSwap}
                onChecked={(v) => updateRoomFlatField("openToSwap", v)}
              />
              <CheckboxField
                label="Pets allowed"
                checked={roomFlat.petsAllowed}
                onChecked={(v) => updateRoomFlatField("petsAllowed", v)}
              />
            </CheckboxRow>
          </div>

          <div className="mt-6 flex gap-3">
            <BackButton onClick={() => setStep(1)} />
            <button
              type="button"
              onClick={() => setStep(3)}
              className="ml-auto inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors"
              style={{ background: BRAND }}
            >
              Next: house rules
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      )}{/* ── Step 3 · House rules (+ swap / temporary details) ─────────────── */}
      {step === 3 && needsProperty && (
        <form className="mt-8" onSubmit={(e) => e.preventDefault()}>
          <div
            className="rounded-2xl border bg-white p-6 sm:p-7 space-y-6"
            style={{ borderColor: "#E5E7F2" }}
          >
            <SectionTitle>House rules</SectionTitle>

            <CheckboxRow>
              <CheckboxField
                label="Owner lives on premises"
                checked={roomFlat.houseRules.ownerLivesOnPremises}
                onChecked={(v) => updateHouseRule("ownerLivesOnPremises", v)}
              />
              <CheckboxField
                label="Has a curfew"
                checked={roomFlat.houseRules.curfew.hasCurfew}
                onChecked={(v) => updateCurfew("hasCurfew", v)}
              />
              <CheckboxField
                label="Smoking allowed on premises"
                checked={roomFlat.houseRules.smokingAllowedOnPremises}
                onChecked={(v) => updateHouseRule("smokingAllowedOnPremises", v)}
              />
              <CheckboxField
                label="Drinking allowed on premises"
                checked={roomFlat.houseRules.drinkingAllowedOnPremises}
                onChecked={(v) => updateHouseRule("drinkingAllowedOnPremises", v)}
              />
            </CheckboxRow>

            {roomFlat.houseRules.curfew.hasCurfew && (
              <TextInputField
                label="Curfew time"
                type="time"
                value={roomFlat.houseRules.curfew.time}
                onValue={(v) => updateCurfew("time", v)}
              />
            )}

            <SelectField
              label="Opposite-gender guests"
              value={roomFlat.houseRules.oppositeGenderGuestsAllowed}
              onValue={(v) => updateHouseRule("oppositeGenderGuestsAllowed", v)}
              options={OPTIONS.guestsAllowed}
            />
            <SelectField
              label="Overnight guests"
              value={roomFlat.houseRules.overnightGuestsAllowed}
              onValue={(v) => updateHouseRule("overnightGuestsAllowed", v)}
              options={OPTIONS.guestsAllowed}
            />

            {intent === "swap" && (
              <>
                <SectionTitle>Swap details</SectionTitle>

                <TextInputField
                  label="Desired city"
                  value={roomFlat.swapDetails.desiredCity}
                  onValue={(v) => updateSwapDetail("desiredCity", v)}
                />
                <TextInputField
                  label="Desired locality"
                  value={roomFlat.swapDetails.desiredLocality}
                  onValue={(v) => updateSwapDetail("desiredLocality", v)}
                />
                <TextInputField
                  label="Desired rent — min (₹)"
                  type="number"
                  value={roomFlat.swapDetails.desiredRentRange.min}
                  onValue={(v) => updateSwapRentRange("min", v)}
                />
                <TextInputField
                  label="Desired rent — max (₹)"
                  type="number"
                  value={roomFlat.swapDetails.desiredRentRange.max}
                  onValue={(v) => updateSwapRentRange("max", v)}
                />
              </>
            )}

            {intent === "temporary_offer" && (
              <>
                <SectionTitle>Temporary stay</SectionTitle>

                <TextInputField
                  label="Start date"
                  type="date"
                  value={roomFlat.temporaryDetails.startDate}
                  onValue={(v) => updateTemporaryDetail("startDate", v)}
                />
                <TextInputField
                  label="End date"
                  type="date"
                  value={roomFlat.temporaryDetails.endDate}
                  onValue={(v) => updateTemporaryDetail("endDate", v)}
                />
              </>
            )}
          </div>

          <div className="mt-6 flex gap-3">
            <BackButton onClick={() => setStep(2)} />
            <button
              type="button"
              onClick={() => setStep(4)}
              className="ml-auto inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors"
              style={{ background: BRAND }}
            >
              Next: photos &amp; location
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      )}

      {/* ── Step 4 · Photos & Location (submits everything) ─────────────────── */}
      {step === 4 && needsProperty && (
        <PhotosLocationFlat
          propertyDetails={roomFlatDetails}
          setPropertyDetails={setRoomFlatDetails}
          nextStep={handlePlaceNext}
          prevStep={() => setStep(3)}
          convertLatLngToGeoJSON={convertLatLngToGeoJSON}
        />
      )}
    </main>
  );
}
function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        className="mb-1.5 block text-sm font-semibold"
        style={{ color: "#161A2E" }}
      >
        {label}
      </label>
      {children}
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-lg font-bold" style={{ color: INK }}>
      {children}
    </h3>
  );
}

function TextInputField({
  label,
  value,
  onValue,
  type = "text",
  placeholder,
  hint,
  required,
}: {
  label: string;
  value: string;
  onValue: (value: string) => void;
  type?: string;
  placeholder?: string;
  hint?: string;
  required?: boolean;
}) {
  return (
    <Field label={required ? label : `${label} (optional)`}>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onValue(e.target.value)}
        className={INPUT_CLS}
        style={INPUT_STYLE}
      />
      {hint && (
        <p className="mt-1 text-xs" style={{ color: INK_SOFT }}>
          {hint}
        </p>
      )}
    </Field>
  );
}

function SelectField({
  label,
  value,
  onValue,
  options,
  required,
}: {
  label: string;
  value: string;
  onValue: (value: string) => void;
  options: string[];
  required?: boolean;
}) {
  return (
    <Field label={required ? label : `${label} (optional)`}>
      <select
        value={value}
        onChange={(e) => onValue(e.target.value)}
        className={INPUT_CLS}
        style={INPUT_STYLE}
      >
        <option value="">Select…</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {humanize(opt)}
          </option>
        ))}
      </select>
    </Field>
  );
}

function TextAreaField({
  label,
  value,
  onValue,
  placeholder,
  rows = 3,
}: {
  label: string;
  value: string;
  onValue: (value: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <Field label={label}>
      <textarea
        value={value}
        onChange={(e) => onValue(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className={INPUT_CLS}
        style={INPUT_STYLE}
      />
    </Field>
  );
}

function CheckboxField({
  label,
  checked,
  onChecked,
}: {
  label: string;
  checked: boolean;
  onChecked: (checked: boolean) => void;
}) {
  return (
    <label
      className="flex items-center gap-2.5 text-sm font-medium cursor-pointer"
      style={{ color: INK }}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChecked(e.target.checked)}
        className="w-4 h-4 rounded accent-[#4161df]"
      />
      {label}
    </label>
  );
}

function CheckboxRow({ children }: { children: React.ReactNode }) {
  return <div className="space-y-2.5">{children}</div>;
}

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1.5 rounded-full border px-5 py-2.5 text-sm font-semibold transition-colors hover:bg-[#EEF1FC]"
      style={{ borderColor: "#D8DCEC", color: INK }}
    >
      <ArrowLeft className="w-4 h-4" />
      Back
    </button>
  );
}
function humanize(str: string) {
  if (LABELS[str]) return LABELS[str];
  return str
    .replace(/_/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/^./, (c) => c.toUpperCase());
}

function getErrorMessage(error: unknown): string {
  if (!error) return "";
  const e = error as {
    data?: { message?: string };
    error?: string;
    message?: string;
  };
  return (
    e.data?.message ||
    e.error ||
    e.message ||
    "Something went wrong. Please try again."
  );
}

export default function OnboardingPage() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto max-w-xl px-6 py-24 flex justify-center">
          <Loader2
            className="w-5 h-5 animate-spin"
            style={{ color: "#4161df" }}
          />
        </main>
      }
    >
      <OnboardingContent />
    </Suspense>
  );
}
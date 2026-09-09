"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, Loader2 } from "lucide-react";
import { Button, Card, Group, Stepper } from "@mantine/core";
import {
  useCreateProfileMutation,
  useCreateRoomFlatMutation,
} from "@/services/roommatesApi";
import PhotosLocationFlat from "@/components/flatmates/PhotosLocationFlat";
import AboutYouStep from "@/components/flatmates/onboarding/AboutYouStep";
import SeekerStep from "@/components/flatmates/onboarding/SeekerStep";
import PropertyStep from "@/components/flatmates/onboarding/PropertyStep";
import HouseRulesStep from "@/components/flatmates/onboarding/HouseRulesStep";
import type {
  ProfileDraft,
  RoomFlatDraft,
  RoomFlatMediaDraft,
} from "@/components/flatmates/onboarding/types";

const BRAND = "#4161df";
const INK = "#161A2E";
const INK_SOFT = "#5C5F73";
const TINT_BG = "#EEF1FC";

const NEEDS_PROPERTY = ["has_room", "swap", "temporary_offer"];
const NEEDS_SEARCH_AREA = ["seeking_room", "temporary_seek"];

const INTENT_LABELS: Record<string, string> = {
  has_room: "Have a room, need a flatmate",
  seeking_room: "Looking for a room",
  swap: "Want to swap flats",
  temporary_offer: "Offering a temporary stay",
  temporary_seek: "Need a temporary stay",
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

/**
 * Recursively drops empty strings/undefined so optional nested objects
 * (houseRules, swapDetails, temporaryDetails) aren't persisted as blank
 * values when the user skipped them.
 */
function cleanObject(
  obj: Record<string, any> | undefined,
): Record<string, any> | undefined {
  if (!obj || typeof obj !== "object") return undefined;
  const out: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value === undefined || value === null || value === "") continue;
    if (typeof value === "object" && !Array.isArray(value)) {
      const nested = cleanObject(value);
      if (nested && Object.keys(nested).length) out[key] = nested;
    } else {
      out[key] = value;
    }
  }
  return Object.keys(out).length ? out : undefined;
}

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
    houseRules: cleanObject(draft.houseRules),
    swapDetails: cleanObject(draft.swapDetails),
    temporaryDetails: cleanObject(draft.temporaryDetails),
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
  const [profile, setProfile] = useState<ProfileDraft>({
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
  });

  // Every user-editable field from RoomFlat (backend model).
  const [roomFlat, setRoomFlat] = useState<RoomFlatDraft>({
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
  const [roomFlatDetails, setRoomFlatDetails] = useState<RoomFlatMediaDraft>({
    image: [],
    location: { country: "", city: "", address: "", coordinates: null },
  });// ---- Update helpers (pure setters for nested pieces of state) ----
  const updateProfileField = (key: string, value: any) =>
    setProfile((p) => ({ ...p, [key]: value }));

  const updateHabit = (key: string, value: any) =>
    setProfile((p) => ({ ...p, habits: { ...p.habits, [key]: value } }));

  const updateLookingFor = (key: string, value: any) =>
    setProfile((p) => ({
      ...p,
      lookingFor: { ...p.lookingFor, [key]: value },
    }));

  const updateAgeRange = (key: "min" | "max", value: string) =>
    setProfile((p) => ({
      ...p,
      lookingFor: {
        ...p.lookingFor,
        ageRange: { ...p.lookingFor.ageRange, [key]: value },
      },
    }));

  const updateSearchArea = (key: string, value: any) =>
    setProfile((p) => ({ ...p, searchArea: { ...p.searchArea, [key]: value } }));

  const updateBudget = (key: "min" | "max", value: string) =>
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

  const updateSwapRentRange = (key: "min" | "max", value: string) =>
    setRoomFlat((r) => ({
      ...r,
      swapDetails: {
        ...r.swapDetails,
        desiredRentRange: { ...r.swapDetails.desiredRentRange, [key]: value },
      },
    }));

  const updateTemporaryDetail = (
    key: "startDate" | "endDate",
    value: string,
  ) =>
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
          Pick what you&apos;re here for first —{" "}
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
  }

  /**
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
          min: roomFlat.swapDetails.desiredRentRange?.min || undefined,
          max: roomFlat.swapDetails.desiredRentRange?.max || undefined,
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

  return (<main className="mx-auto max-w-4xl px-6 py-12 sm:py-16">
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

      <Stepper active={step - 1} size="sm" color="blue" mt="xl" mb="lg">
        <Stepper.Step label="About you" />
        {needsSearchArea && <Stepper.Step label="Where & budget" />}
        {needsProperty && (
          <>
            <Stepper.Step label="Your place" />
            <Stepper.Step label="House rules" />
            <Stepper.Step label="Photos & location" />
          </>
        )}
      </Stepper>

      {error && (
        <div
          className="rounded-lg border-l-[3px] bg-rose-50/70 px-3.5 py-2.5 mb-5 text-sm text-rose-700"
          style={{ borderLeftColor: "#e11d48" }}
        >
          {error}
        </div>
      )}

      {/* ── Step 1 · About you (every RoommateProfile field) ─────────────── */}
      {step === 1 && (
        <Card p="lg" radius="md" withBorder shadow="sm">
          <AboutYouStep
            profile={profile}
            onField={updateProfileField}
            onHabit={updateHabit}
            onLookingFor={updateLookingFor}
            onAgeRange={updateAgeRange}
          />
          <Group justify="flex-end" mt={32}>
            <Button
              style={{ background: BRAND }}
              rightSection={<ArrowRight className="w-4 h-4" />}
              onClick={() => setStep(2)}
            >
              Next: {needsProperty ? "your place" : "where & budget"}
            </Button>
          </Group>
        </Card>
      )}

      {/* ── Step 2 · Seeker: where & budget (searchArea + budgetRange) ─── */}
      {step === 2 && needsSearchArea && (
        <form onSubmit={handleSubmit}>
          <Card p="lg" radius="md" withBorder shadow="sm">
            <SeekerStep
              searchArea={profile.searchArea}
              budgetRange={profile.budgetRange}
              onSearchArea={updateSearchArea}
              onBudget={updateBudget}
            />
          </Card>
          <Group justify="space-between" mt={32}>
            <Button variant="default" onClick={() => setStep(1)}>
              Back
            </Button>
            <Button
              type="submit"
              style={{ background: BRAND }}
              disabled={submitting}
            >
              {submitting ? "Saving…" : "Create profile"}
            </Button>
          </Group>
        </form>
      )}

      {/* ── Step 2 · Property: describe your place (RoomFlat basics) ────── */}
      {step === 2 && needsProperty && (
        <Card p="lg" radius="md" withBorder shadow="sm">
          <PropertyStep
            roomFlat={roomFlat}
            onField={updateRoomFlatField}
            onLocationExtra={updateLocationExtra}
          />
          <Group justify="space-between" mt={32}>
            <Button variant="default" onClick={() => setStep(1)}>
              Back
            </Button>
            <Button
              style={{ background: BRAND }}
              rightSection={<ArrowRight className="w-4 h-4" />}
              onClick={() => setStep(3)}
            >
              Next: house rules
            </Button>
          </Group>
        </Card>
      )}

      {/* ── Step 3 · House rules (+ swap / temporary details) ───────────── */}
      {step === 3 && needsProperty && (
        <Card p="lg" radius="md" withBorder shadow="sm">
          <HouseRulesStep
            roomFlat={roomFlat}
            intent={intent}
            onHouseRule={updateHouseRule}
            onCurfew={updateCurfew}
            onSwapDetail={updateSwapDetail}
            onSwapRentRange={updateSwapRentRange}
            onTemporaryDetail={updateTemporaryDetail}
          />
          <Group justify="space-between" mt={32}>
            <Button variant="default" onClick={() => setStep(2)}>
              Back
            </Button>
            <Button
              style={{ background: BRAND }}
              rightSection={<ArrowRight className="w-4 h-4" />}
              onClick={() => setStep(4)}
            >
              Next: photos &amp; location
            </Button>
          </Group>
        </Card>
      )}

      {/* ── Step 4 · Photos & Location (submits everything) ─────────────── */}
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
"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, Loader2 } from "lucide-react";
import { Button, Card, Group, Stepper } from "@mantine/core";
import { useSelector } from "react-redux";
import { selectIsAuthenticated } from "@/store/authSlice";
import {
  useCreateProfileMutation,
  useCreateRoomFlatMutation,
  useGetOwnProfileQuery,
  useLazyGetOwnProfileQuery,
  useUpdateProfileMutation,
  useUpdateRoomFlatMutation,
  type RoomFlat,
  type RoommateProfile,
} from "@/services/roommatesApi";
import { toast } from "@/hooks/use-toast";
import PhotosLocationFlat from "@/components/flatmates/PhotosLocationFlat";
import AboutYouStep, {
  INTENT_OPTIONS,
} from "@/components/flatmates/onboarding/AboutYouStep";
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

const INTENT_LABELS: Record<string, string> = Object.fromEntries(
  INTENT_OPTIONS.map((option) => [option.key, option.title]),
);

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

/** Backend sends ISO date-times; date <input>s need plain YYYY-MM-DD. */
function toDateInput(value?: string): string {
  if (!value) return "";
  return String(value).slice(0, 10);
}

function numToString(value?: number): string {
  return value === undefined || value === null || Number.isNaN(value)
    ? ""
    : String(value);
}

/**
 * Edit mode: convert the saved RoommateProfile into the same shape the step
 * components read/write (ProfileDraft), so "Edit profile" reopens the same
 * wizard with every field pre-filled.
 */
function profileToDraft(p: RoommateProfile): ProfileDraft {
  const coords = p.searchArea?.location?.coordinates;
  return {
    bio: p.bio ?? "",
    type: (p as { type?: string }).type ?? "",
    gender: p.gender ?? "",
    dateOfBirth: toDateInput((p as { dateOfBirth?: string }).dateOfBirth),
    occupation: p.occupation ?? "",
    workSchedule: p.workSchedule ?? "",
    sleepSchedule: p.sleepSchedule ?? "",
    languages: Array.isArray(p.languages) ? [...p.languages] : [],
    habits: {
      smoking: p.habits?.smoking ?? "",
      drinking: p.habits?.drinking ?? "",
      nightlifeFriendly: p.habits?.nightlifeFriendly ?? "",
      foodPreference: p.habits?.foodPreference ?? "",
      ownsPets: p.habits?.ownsPets ?? false,
      okayWithPets: p.habits?.okayWithPets ?? false,
      cleanlinessLevel: p.habits?.cleanlinessLevel ?? "",
      guestsFrequency: p.habits?.guestsFrequency ?? "",
    },
    lookingFor: {
      genderPreference: p.lookingFor?.genderPreference ?? "any",
      ageRange: {
        min: numToString(p.lookingFor?.ageRange?.min),
        max: numToString(p.lookingFor?.ageRange?.max),
      },
      smoking: p.lookingFor?.smoking ?? "no_preference",
      drinking: p.lookingFor?.drinking ?? "no_preference",
      nightlifeFriendly: p.lookingFor?.nightlifeFriendly ?? "no_preference",
      foodPreference: p.lookingFor?.foodPreference ?? "any",
      occupation: p.lookingFor?.occupation ?? "any",
    },
    searchArea: {
      city: p.searchArea?.city ?? "",
      locality: p.searchArea?.locality ?? "",
      radiusKm: numToString(p.searchArea?.radiusKm) || "5",
      lat: Array.isArray(coords) && coords.length >= 2 ? String(coords[1]) : "",
      lng: Array.isArray(coords) && coords.length >= 2 ? String(coords[0]) : "",
    },
    budgetRange: {
      min: numToString(p.budgetRange?.min),
      max: numToString(p.budgetRange?.max),
    },
    moveInDate: toDateInput(p.moveInDate),
    stayDurationMonths: numToString(p.stayDurationMonths),
  };
}

/**
 * Edit mode: convert the saved RoomFlat into the wizard's RoomFlatDraft.
 * The photos/location live in the PhotosLocationFlat step, whose
 * `image`/`location` state is pre-filled alongside (see useEffect below).
 */
function roomFlatToDraft(rf: RoomFlat): RoomFlatDraft {
  return {
    title: rf.title ?? "",
    description: rf.description ?? "",
    rentAmount: numToString(rf.rentAmount),
    securityDeposit: numToString(rf.securityDeposit),
    roomType: rf.roomType ?? "private_room",
    furnishing: rf.furnishing ?? "",
    availableFrom: toDateInput(rf.availableFrom),
    minStayMonths: numToString(rf.minStayMonths),
    openToSwap: rf.openToSwap ?? false,
    petsAllowed: rf.petsAllowed ?? false,
    location: rf.location
      ? {
          address: rf.location.address,
          city: rf.location.city,
          sector: rf.location.sector,
          state: rf.location.state,
          country: rf.location.country,
          pincode: rf.location.pincode,
          landmark: rf.location.landmark,
          coordinates: rf.location.coordinates,
        }
      : {},
    houseRules: {
      ownerLivesOnPremises: rf.houseRules?.ownerLivesOnPremises ?? false,
      curfew: {
        hasCurfew: rf.houseRules?.curfew?.hasCurfew ?? false,
        time: rf.houseRules?.curfew?.time ?? "",
      },
      oppositeGenderGuestsAllowed:
        rf.houseRules?.oppositeGenderGuestsAllowed ?? "",
      overnightGuestsAllowed: rf.houseRules?.overnightGuestsAllowed ?? "",
      smokingAllowedOnPremises:
        rf.houseRules?.smokingAllowedOnPremises ?? false,
      drinkingAllowedOnPremises:
        rf.houseRules?.drinkingAllowedOnPremises ?? false,
    },
    swapDetails: {
      desiredCity: rf.swapDetails?.desiredCity ?? "",
      desiredLocality: rf.swapDetails?.desiredLocality ?? "",
      desiredRentRange: {
        min: numToString(rf.swapDetails?.desiredRentRange?.min),
        max: numToString(rf.swapDetails?.desiredRentRange?.max),
      },
    },
    temporaryDetails: {
      startDate: toDateInput(rf.temporaryDetails?.startDate),
      endDate: toDateInput(rf.temporaryDetails?.endDate),
    },
    photos: Array.isArray(rf.photos) ? [...rf.photos] : [],
  };
}

function OnboardingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlIntent = searchParams.get("intent");
  // /flatmates/profile/me links here with ?edit=1 — same wizard, but it
  // loads the saved profile + listing, pre-fills every step, and PATCHes on
  // save instead of POSTing a new record (which would 409).
  const isEditMode = searchParams.get("edit") === "1";

  const isAuthenticated = useSelector(selectIsAuthenticated);

  // The StoreProvider restores the session from localStorage inside a parent
  // useEffect, which runs AFTER this component's effects on hydration. So we
  // wait for `mounted` before trusting `isAuthenticated` — otherwise a
  // signed-in user visiting /flatmates/onboarding directly would be falsely
  // redirected to /login for one frame.
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // Auth guard: signed-out users are sent to /login and never see the form.
  useEffect(() => {
    if (!mounted) return;
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [mounted, isAuthenticated, router]);

  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  // Same-tick double-submit guard: two calls in the same tick (e.g. a double
  // click before React flushes state) both see the stale `submitting === false`
  // closure value — the ref catches what the state cannot.
  const submittingRef = useRef(false);
  const [error, setError] = useState<string | null>(null);
  // Create mode: the intent picked via the Step-1 radio or a ?intent=
  // deep-link. Edit mode ignores this — it uses the saved profile's intent.
  const [chosenIntent, setChosenIntent] = useState<string | null>(urlIntent);
  // Guards the edit-mode prefill below so typing into the form is never
  // clobbered by refetches of the saved profile.
  const [prefilled, setPrefilled] = useState(false);

  const [createProfile] = useCreateProfileMutation();
  const [createRoomFlat] = useCreateRoomFlatMutation();
  const [updateProfile] = useUpdateProfileMutation();
  const [updateRoomFlat] = useUpdateRoomFlatMutation();
  // Fallback fetch used only when the backend 409s without attaching the
  // existing listing (e.g. older deployed backend) — lets us PATCH it anyway.
  const [fetchOwnProfile] = useLazyGetOwnProfileQuery();

  // Edit mode loads the saved profile (now with its roomFlat populated, see
  // getOwnProfile) so every step can be pre-filled.
  const {
    data: existingProfile,
    isLoading: isLoadingExisting,
    error: existingProfileError,
  } = useGetOwnProfileQuery(undefined, { skip: !isEditMode });

  // Locked at creation — changing it would orphan the listing type, so edit
  // mode reuses the saved intent instead of the Step-1/deep-link choice.
  const intent: string | null = isEditMode
    ? (existingProfile?.intent ?? null)
    : chosenIntent;

  // Every user-editable field from RoommateProfile (backend model).
  const [profile, setProfile] = useState<ProfileDraft>({
    bio: "",
    type: "",
    gender: "",
    dateOfBirth: "",
    occupation: "",
    workSchedule: "",
    sleepSchedule: "",
    languages: [],
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
    location: {},
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
  });

  // Edit mode: once the saved profile (+ populated roomFlat) arrives, seed
  // every draft with it — one shot only (`prefilled`), so user edits win.
  useEffect(() => {
    if (!isEditMode || prefilled || !existingProfile) return;
    setProfile(profileToDraft(existingProfile));
    const savedFlat =
      existingProfile.roomFlat && typeof existingProfile.roomFlat === "object"
        ? (existingProfile.roomFlat as RoomFlat)
        : null;
    if (savedFlat) {
      setRoomFlat(roomFlatToDraft(savedFlat));
      setRoomFlatDetails({
        image: Array.isArray(savedFlat.photos) ? [...savedFlat.photos] : [],
        location: {
          country: savedFlat.location?.country ?? "",
          city: savedFlat.location?.city ?? "",
          address: savedFlat.location?.address ?? "",
          coordinates: savedFlat.location?.coordinates ?? null,
        },
      });
    }
    setPrefilled(true);
  }, [isEditMode, existingProfile, prefilled]);

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

  const updateAgeRange = (key: "min" | "max", value: string) =>
    setProfile((p) => ({
      ...p,
      lookingFor: {
        ...p.lookingFor,
        ageRange: { ...p.lookingFor.ageRange, [key]: value },
      },
    }));

  const updateSearchArea = (key: string, value: any) =>
    setProfile((p) => ({
      ...p,
      searchArea: { ...p.searchArea, [key]: value },
    }));

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

  const updateTemporaryDetail = (key: "startDate" | "endDate", value: string) =>
    setRoomFlat((r) => ({
      ...r,
      temporaryDetails: { ...r.temporaryDetails, [key]: value },
    }));

  // Edit mode: while the saved profile (+ populated roomFlat) is still
  // loading, `intent` is null — show the loader rather than Step 1 (edit mode
  // locks the intent to the saved profile). If the fetch failed (e.g. no
  // profile yet), surface that instead.
  if (!mounted || !isAuthenticated || (isEditMode && !prefilled)) {
    if (isEditMode && existingProfileError) {
      return (
        <main className="mx-auto max-w-xl px-6 pb-8 text-center">
          <p className="text-[15px]" style={{ color: INK_SOFT }}>
            Couldn&apos;t load your profile —{" "}
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
    return (
      <main className="mx-auto max-w-xl px-6 pb-8 flex justify-center">
        <Loader2 className="w-5 h-5 animate-spin" style={{ color: BRAND }} />
      </main>
    );
  }

  // Step 1 (AboutYouStep) always renders — the intent radio lives inside it,
  // and the rest of the wizard below only unlocks once an intent is chosen
  // (guarded per-step, so a direct visit doesn't hit a dead-end).
  const needsProperty = !!intent && NEEDS_PROPERTY.includes(intent);
  const needsSearchArea = !!intent && NEEDS_SEARCH_AREA.includes(intent);

  const goToStep2 = () => {
    // Intent gates the rest of the wizard — don't advance without it.
    if (!intent) {
      toast.error("Please pick what brings you here to continue");
      return;
    }
    setStep(2);
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await doSubmit();
  }

  /**
   * Validates the profile before submission. Returns an array of human-readable
   * error messages for any missing/invalid fields. Shows a toast for each error
   * so the user knows exactly what to fix on Step 1 (AboutYou).
   */
  function validateProfile(): string[] {
    const errors: string[] = [];

    // ---- Habits: every enum field must be a non-empty valid value ----
    const habitFields: { key: keyof ProfileDraft["habits"]; label: string }[] =
      [
        { key: "smoking", label: "Smoking" },
        { key: "drinking", label: "Drinking" },
        { key: "nightlifeFriendly", label: "Nightlife-friendly" },
        { key: "foodPreference", label: "Food preference" },
        { key: "cleanlinessLevel", label: "Cleanliness level" },
        { key: "guestsFrequency", label: "Guests frequency" },
      ];
    for (const { key, label } of habitFields) {
      const val = profile.habits[key];
      if (typeof val === "string" && (!val || val.trim() === "")) {
        errors.push(
          `Please select ${label.toLowerCase()} in the Habits section`,
        );
      }
    }

    // ---- Looking-for age range: must be >= 16 and min <= max ----
    const minRaw = profile.lookingFor.ageRange.min;
    const maxRaw = profile.lookingFor.ageRange.max;
    const min = minRaw ? Number(minRaw) : NaN;
    const max = maxRaw ? Number(maxRaw) : NaN;

    if (minRaw && Number.isNaN(min)) {
      errors.push("Minimum age must be a valid number");
    } else if (minRaw && min < 16) {
      errors.push("Minimum age must be at least 16");
    }

    if (maxRaw && Number.isNaN(max)) {
      errors.push("Maximum age must be a valid number");
    } else if (maxRaw && max < 16) {
      errors.push("Maximum age must be at least 16");
    }

    if (
      minRaw &&
      maxRaw &&
      !Number.isNaN(min) &&
      !Number.isNaN(max) &&
      min > max
    ) {
      errors.push("Minimum age cannot be greater than maximum age");
    }

    return errors;
  }

  async function doSubmit(roomFlatOverride?: RoomFlatDraft) {
    if (submitting || submittingRef.current) return;
    submittingRef.current = true;
    setSubmitting(true);
    setError(null);

    // Client-side validation: surface every issue as a toast instead of letting
    // the request reach the backend and fail with a generic 400.
    const validationErrors = validateProfile();
    if (validationErrors.length > 0) {
      validationErrors.forEach((msg) => toast.error(msg));
      submittingRef.current = false;
      setSubmitting(false);
      return;
    }

    // Intent gates the rest of the wizard — the radio lives inside Step 1, so
    // the final submit can't fire without a choice.
    if (!intent) {
      toast.error("Please pick what brings you here to continue");
      submittingRef.current = false;
      setSubmitting(false);
      return;
    }

    try {
      // Edit mode PATCHes the existing records; create mode POSTs fresh ones
      // (intent is create-only — it stays out of the update payload).
      const profileBody = {
        bio: profile.bio,
        type: profile.type || undefined,
        gender: profile.gender,
        dateOfBirth: profile.dateOfBirth || undefined,
        occupation: profile.occupation,
        workSchedule: profile.workSchedule || undefined,
        sleepSchedule: profile.sleepSchedule || undefined,
        languages: Array.isArray(profile.languages)
          ? profile.languages
              .map((s) => String(s).trim())
              .filter((s) => s.length > 0)
          : typeof (profile as any).languages === "string" &&
              (profile as any).languages
            ? String((profile as any).languages)
                .split(",")
                .map((s: string) => s.trim())
                .filter((s: string) => s.length > 0)
            : [],
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

      if (isEditMode && existingProfile) {
        await updateProfile(profileBody as any).unwrap();

        if (needsProperty) {
          const draft = roomFlatOverride ?? roomFlat;
          // roomFlat can arrive as a populated document OR a raw ObjectId
          // string (unpopulated/stale cache) — both identify the saved
          // listing. Only POST when there is genuinely none, otherwise the
          // backend correctly 409s ("already has a room/flat listed").
          const raw = existingProfile.roomFlat;
          const savedFlatId =
            raw && typeof raw === "object"
              ? ((raw as RoomFlat)._id ?? null)
              : typeof raw === "string"
                ? raw
                : null;
          if (savedFlatId) {
            await updateRoomFlat({
              id: savedFlatId,
              update: buildRoomFlatRequestBody(draft) as any,
            }).unwrap();
          } else {
            await createRoomFlat(
              buildRoomFlatRequestBody(draft) as any,
            ).unwrap();
          }
        }

        toast.success("Profile updated");
        router.push("/flatmates/profile/me");
        return;
      }

      try {
        await createProfile({ intent, ...profileBody } as any).unwrap();
      } catch (err) {
        // 409 = the user already has a profile (re-entering onboarding
        // without ?edit=1). Intent is locked at creation, so update the
        // profile without it — same rule as edit mode.
        const e = err as { status?: number };
        if (e.status !== 409) throw err;
        await updateProfile(profileBody as any).unwrap();
      }

      if (needsProperty) {
        const draft = roomFlatOverride ?? roomFlat;
        const body = buildRoomFlatRequestBody(draft) as any;
        try {
          await createRoomFlat(body).unwrap();
        } catch (err) {
          // 409 = the profile already has a listing. Happens when a previous
          // attempt actually created it (lost response, retry, double
          // submit). Newer backends attach the existing listing to the 409 —
          // PATCH it with the draft so the submitted data is still saved
          // instead of dead-ending on the conflict. Unknown older servers
          // don't attach it, so refetch the profile as a fallback.
          const e = err as {
            status?: number;
            data?: {
              existingRoomFlat?: { _id?: string } | null;
              existingRoomFlatId?: string;
            };
          };
          let existingId =
            e.data?.existingRoomFlat?._id ?? e.data?.existingRoomFlatId;
          if (e.status === 409 && !existingId) {
            try {
              const own = await fetchOwnProfile(undefined).unwrap();
              const raw = own?.roomFlat;
              existingId =
                (raw && typeof raw === "object"
                  ? ((raw as RoomFlat)._id ?? undefined)
                  : typeof raw === "string"
                    ? raw
                    : undefined) ?? existingId;
            } catch {
              // Fallback fetch failed — fall through to rethrowing the 409.
            }
          }
          if (e.status === 409 && existingId) {
            await updateRoomFlat({ id: existingId, update: body }).unwrap();
          } else {
            throw err;
          }
        }
      }

      router.push("/flatmates/profile/me");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      submittingRef.current = false;
      setSubmitting(false);
    }
  }

  /**
   * "Next step" from PhotosLocationFlat — validate the listing basics, merge
   * the resolved photos + location (handed over by the component before its
   * own state update flushes) and submit everything in one go.
   */
  async function handlePlaceNext(resolved?: {
    image?: (string | File)[];
    location?: Record<string, any>;
  }) {
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

  return (
    <main className="mx-auto max-w-7xl px-6 pb-12 sm:pb-16">
      {isEditMode ? (
        <span
          className="inline-block text-xs font-semibold px-3 py-1 rounded-full mb-4"
          style={{ background: TINT_BG, color: BRAND }}
        >
          {INTENT_LABELS[intent as string] ?? "Edit profile"}
        </span>
      ) : (
        INTENT_LABELS[intent as string] && (
          <span
            className="inline-block text-xs font-semibold px-3 py-1 rounded-full mb-4"
            style={{ background: TINT_BG, color: BRAND }}
          >
            {INTENT_LABELS[intent as string]}
          </span>
        )
      )}

      <h1
        className="text-2xl sm:text-3xl font-bold tracking-tight"
        style={{ color: INK }}
      >
        {isEditMode ? "Edit your profile" : "Set up your profile"}
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
              onClick={goToStep2}
            >
              Next:{" "}
              {!intent
                ? "continue"
                : needsProperty
                  ? "your place"
                  : "where & budget"}
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
              {submitting
                ? "Saving…"
                : isEditMode
                  ? "Save changes"
                  : "Create profile"}
            </Button>
          </Group>
        </form>
      )}

      {/* ── Step 2 · Property: describe your place (RoomFlat basics) ────── */}
      {step === 2 && needsProperty && (
        <Card p="lg" radius="md" withBorder shadow="sm">
          <PropertyStep roomFlat={roomFlat} onField={updateRoomFlatField} />
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
            intent={intent ?? ""}
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
          // Re-mount when the saved photos/location arrive in edit mode so the
          // dropzone previews + map pin actually reflect the saved listing
          // (the component snapshots `propertyDetails` on first render).
          key={
            isEditMode
              ? `edit-${roomFlatDetails.image.length}-${roomFlatDetails.location?.country ?? ""}-${roomFlatDetails.location?.city ?? ""}-${roomFlatDetails.location?.address ?? ""}`
              : "create"
          }
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
        <main className="mx-auto max-w-xl px-6 pb-8 flex justify-center">
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

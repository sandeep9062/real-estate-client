"use client";

import { useEffect, useMemo, useState, Suspense } from "react";
import type { ReactNode } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import {
  Search,
  AlertCircle,
  MapPin,
  Map as MapIcon,
  List as ListIcon,
  RotateCcw,
  SlidersHorizontal,
  ChevronDown,
  X,
  IndianRupee,
  BadgeCheck,
  Users,
  Home,
  Briefcase,
  Cigarette,
  Wine,
  UtensilsCrossed,
  Sparkles,
  UserRound,
} from "lucide-react";
import { toast } from "sonner";
import {
  useSearchSeekersQuery,
  useSendConnectionRequestMutation,
  useRespondToConnectionRequestMutation,
  useListMyConnectionsQuery,
  useToggleFavRoommateProfileMutation,
  type RoommateProfile,
} from "@/services/roommatesApi";
import { useSelector } from "react-redux";
import { selectUser } from "@/store/authSlice";
import type { MapMarker } from "@/components/Map";
import RoommateProfileCard, {
  type RoommateProfileCardData,
  type RoommateProfileCardUser,
} from "@/components/flatmates/RoommateProfileCard";

// Named MapView so it doesn't shadow the global JS `Map`.
const MapView = dynamic(() => import("@/components/Map"), { ssr: false });

const BRAND = "#4161df";
const INK = "#161A2E";
const INK_SOFT = "#5C5F73";
const BORDER = "#E5E7F2";

const BUDGET_PRESETS = [
  { label: "Under ₹5k", min: "", max: "5000" },
  { label: "₹5k – ₹10k", min: "5000", max: "10000" },
  { label: "₹10k – ₹20k", min: "10000", max: "20000" },
  { label: "₹20k – ₹30k", min: "20000", max: "30000" },
  { label: "₹30k+", min: "30000", max: "" },
];

const PROFILE_TYPES = [
  { value: "", label: "All profiles", icon: Users },
  { value: "have_room", label: "Has a room", icon: Home },
  { value: "no_room", label: "Looking for a room", icon: Search },
];

const GENDERS = [
  { value: "", label: "Any gender" },
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
];

const OCCUPATIONS = [
  { value: "", label: "Any occupation" },
  { value: "student", label: "Student" },
  { value: "working_professional", label: "Working professional" },
  { value: "self_employed", label: "Self-employed" },
];

const FOOD_PREFS = [
  { value: "", label: "Any food habit" },
  { value: "veg", label: "Veg" },
  { value: "non_veg", label: "Non-veg" },
  { value: "eggetarian", label: "Eggetarian" },
  { value: "vegan", label: "Vegan" },
];

const CLEAN_LEVELS = [
  { value: "", label: "Any cleanliness" },
  { value: "very_tidy", label: "Very tidy" },
  { value: "moderately_tidy", label: "Moderately tidy" },
  { value: "relaxed", label: "Relaxed" },
];

const SMOKING_OPTIONS = [
  { value: "", label: "Any" },
  { value: "yes", label: "Smoker" },
  { value: "no", label: "Non-smoker" },
];

const DRINKING_OPTIONS = [
  { value: "", label: "Any" },
  { value: "yes", label: "Drinks" },
  { value: "no", label: "Non-drinker" },
];

export interface FlatmatesFilters {
  city: string;
  type: string;
  gender: string;
  occupation: string;
  smoking: string;
  drinking: string;
  foodPreference: string;
  cleanliness: string;
  idVerified: boolean;
  minBudget: string;
  maxBudget: string;
}

const EMPTY_FILTERS: FlatmatesFilters = {
  city: "",
  type: "",
  gender: "",
  occupation: "",
  smoking: "",
  drinking: "",
  foodPreference: "",
  cleanliness: "",
  idVerified: false,
  minBudget: "",
  maxBudget: "",
};

// Counts filters, treating min + max budget as a single filter so the
// number matches the chips shown to the user.
function countFilters(f: FlatmatesFilters): number {
  let n = 0;
  (Object.keys(f) as (keyof FlatmatesFilters)[]).forEach((key) => {
    if (key === "maxBudget") return;
    if (key === "minBudget") {
      if (f.minBudget || f.maxBudget) n++;
      return;
    }
    const v = f[key];
    if (v !== "" && v !== false) n++;
  });
  return n;
}

// useSearchSeekersQuery hits /v1/roommates/seekers, which returns all active
// roommate profiles — both have_room and no_room. The endpoint populates
// `user` (at least _id/name/avatarUrl) and `roomFlat` (for have_room profiles'
// location and rent) so the cards have everything they need to render.
interface SeekerResult {
  profile: Omit<RoommateProfile, "user" | "roomFlat"> & {
    user: RoommateProfileCardUser;
    roomFlat?: RoommateProfileCardData["roomFlat"];
  };
  matchScore: number | null;
}

function getRefId(ref: unknown): string | undefined {
  if (!ref) return undefined;
  if (typeof ref === "string") return ref;
  return (ref as { _id?: string })._id;
}

/* ------------------------------------------------------------------ */
/* Small presentational helpers                                        */
/* ------------------------------------------------------------------ */

const FIELD_CLASS =
  "h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 hover:border-gray-300 focus:border-[#4161df] focus:ring-2 focus:ring-[#4161df]/15";

function FieldLabel({
  icon,
  children,
}: {
  icon?: ReactNode;
  children: ReactNode;
}) {
  return (
    <span className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-gray-600">
      {icon}
      {children}
    </span>
  );
}

function SelectField({
  label,
  icon,
  value,
  onChange,
  options,
}: {
  label: string;
  icon?: ReactNode;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="block">
      <FieldLabel icon={icon}>{label}</FieldLabel>
      <span className="relative block">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`${FIELD_CLASS} appearance-none pr-9`}
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
      </span>
    </label>
  );
}

function CardSkeleton() {
  return (
    <div
      className="overflow-hidden rounded-2xl border bg-white"
      style={{ borderColor: BORDER }}
    >
      <div className="aspect-[4/3] animate-pulse bg-gray-100" />
      <div className="space-y-3 p-4">
        <div className="h-4 w-2/3 animate-pulse rounded bg-gray-100" />
        <div className="h-3 w-full animate-pulse rounded bg-gray-100" />
        <div className="h-3 w-4/5 animate-pulse rounded bg-gray-100" />
        <div className="flex gap-2 pt-1">
          <div className="h-5 w-14 animate-pulse rounded bg-gray-100" />
          <div className="h-5 w-16 animate-pulse rounded bg-gray-100" />
          <div className="h-5 w-12 animate-pulse rounded bg-gray-100" />
        </div>
        <div className="h-10 w-full animate-pulse rounded-xl bg-gray-100" />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page content                                                        */
/* ------------------------------------------------------------------ */

function FlatmatesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlCity = searchParams.get("city") || "";

  // Seed the city filter from the ?city= URL param so links like
  // /flatmates?city=Mohali (home page chips) pre-apply the city.
  const [filters, setFilters] = useState<FlatmatesFilters>({
    ...EMPTY_FILTERS,
    city: urlCity,
  });
  const [applied, setApplied] = useState<FlatmatesFilters>({
    ...EMPTY_FILTERS,
    city: urlCity,
  });
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"list" | "map">("list");
  const [laptopMapOpen, setLaptopMapOpen] = useState(false);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());
  // Optimistic "request sent" ids, shown until the connections list refetches.
  const [optimisticSentIds, setOptimisticSentIds] = useState<Set<string>>(
    new Set(),
  );

  const [sendConnectionRequest] = useSendConnectionRequestMutation();
  const [respondToConnectionRequest] = useRespondToConnectionRequestMutation();
  const { data: connectionsData } = useListMyConnectionsQuery();
  const [toggleFavRoommateProfile] = useToggleFavRoommateProfileMutation();
  const currentUser = useSelector(selectUser);

  // Keep the city filter in sync with the ?city= URL param.
  useEffect(() => {
    setFilters((f) => (f.city === urlCity ? f : { ...f, city: urlCity }));
    setApplied((a) => (a.city === urlCity ? a : { ...a, city: urlCity }));
  }, [urlCity]);

  const activeFiltersCount = useMemo(() => countFilters(filters), [filters]);
  const appliedCount = useMemo(() => countFilters(applied), [applied]);

  // Advanced filters = everything except city, budget and profile type, which
  // are always visible. Used for the badge on the "More filters" button.
  const advancedCount = useMemo(() => {
    const keys: (keyof FlatmatesFilters)[] = [
      "gender",
      "occupation",
      "smoking",
      "drinking",
      "foodPreference",
      "cleanliness",
      "idVerified",
    ];
    return keys.filter((k) => filters[k] !== "" && filters[k] !== false).length;
  }, [filters]);

  // Profile ids with a pending outgoing request, derived straight from the
  // live connections list.
  const pendingIds = useMemo(() => {
    const ids = new Set<string>();
    (connectionsData ?? []).forEach((c) => {
      if (c.status !== "pending") return;
      const id = getRefId(c.toProfile);
      if (id) ids.add(id);
    });
    return ids;
  }, [connectionsData]);

  const hasPendingRequest = (id: string): boolean =>
    pendingIds.has(id) || optimisticSentIds.has(id);

  const params = {
    city: applied.city || undefined,
    type: applied.type || undefined,
    gender: applied.gender || undefined,
    occupation: applied.occupation || undefined,
    smoking: applied.smoking || undefined,
    drinking: applied.drinking || undefined,
    foodPreference: applied.foodPreference || undefined,
    cleanliness: applied.cleanliness || undefined,
    idVerified: applied.idVerified ? "true" : undefined,
    minBudget: applied.minBudget || undefined,
    maxBudget: applied.maxBudget || undefined,
  };

  const {
    data: rawResults,
    isLoading: loading,
    error,
  } = useSearchSeekersQuery(params);

  // See SeekerResult note above: this assumes `user` arrives populated.
  const seekers = (rawResults ?? []) as unknown as SeekerResult[];

  function runSearch(e?: React.FormEvent) {
    e?.preventDefault();
    setApplied(filters);
    setFiltersOpen(false);
  }

  function clearFilters() {
    setFilters({ ...EMPTY_FILTERS });
    setApplied({ ...EMPTY_FILTERS });
  }

  function updateFilter<K extends keyof FlatmatesFilters>(
    key: K,
    value: FlatmatesFilters[K],
  ) {
    setFilters((f) => ({ ...f, [key]: value }));
  }

  // Profile type tabs apply immediately — no need to press Search.
  function selectType(value: string) {
    setFilters((f) => ({ ...f, type: value }));
    setApplied((a) => ({ ...a, type: value }));
  }

  function removeAppliedChip(key: keyof FlatmatesFilters) {
    const reset = (f: FlatmatesFilters): FlatmatesFilters => {
      // The budget chip represents both min and max, so clear both.
      if (key === "minBudget" || key === "maxBudget") {
        return { ...f, minBudget: "", maxBudget: "" };
      }
      return { ...f, [key]: typeof f[key] === "boolean" ? false : "" };
    };
    setApplied(reset);
    setFilters(reset);
  }

  function toggleSaved(id: string) {
    setSavedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function toggleLiked(id: string) {
    if (!currentUser) {
      toast.error("You must be logged in to like a profile");
      router.push("/login");
      return;
    }
    try {
      await toggleFavRoommateProfile({ profileId: id }).unwrap();
      setLikedIds((prev) => {
        const next = new Set(prev);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        return next;
      });
    } catch (err) {
      toast.error(getErrorMessage(err) || "Failed to toggle like");
    }
  }

  async function handleConnect(id: string) {
    if (hasPendingRequest(id)) return;
    if (!currentUser) {
      toast.error("Please log in to send a connection request");
      router.push("/login");
      return;
    }
    try {
      await sendConnectionRequest({ toProfileId: id }).unwrap();
      setOptimisticSentIds((prev) => new Set(prev).add(id));
      toast.success("Connection request sent!", {
        description: "They'll be notified about your request.",
      });
    } catch (err) {
      toast.error("Failed to send request", {
        description: getErrorMessage(err),
      });
    }
  }

  async function handleCancelConnection(id: string) {
    if (!hasPendingRequest(id)) return;
    try {
      const connection = connectionsData?.find(
        (c) => c.status === "pending" && getRefId(c.toProfile) === id,
      );
      if (!connection) {
        // Nothing to withdraw on the server; just clear the optimistic flag.
        setOptimisticSentIds((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
        return;
      }
      await respondToConnectionRequest({
        id: connection._id,
        status: "withdrawn",
      }).unwrap();
      setOptimisticSentIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      toast.success("Connection request cancelled");
    } catch (err) {
      toast.error("Failed to cancel request", {
        description: getErrorMessage(err),
      });
    }
  }

  const profiles: RoommateProfileCardData[] = useMemo(
    () =>
      seekers
        .filter(({ profile }) => profile != null && profile._id != null)
        .map(({ profile, matchScore }) => ({
          _id: profile._id,
          type: profile.type,
          user:
            profile.user != null
              ? profile.user
              : { _id: profile._id, name: "Flatmate" },
          photos: profile.photos,
          bio: profile.bio,
          occupation: profile.occupation,
          workSchedule: profile.workSchedule,
          habits: profile.habits,
          searchArea: profile.searchArea,
          budgetRange: profile.budgetRange,
          roomFlat: profile.roomFlat,
          idVerified: profile.idVerified,
          isComplete: profile.isComplete,
          matchScore,
        })),
    [seekers],
  );

  // no_room profiles carry searchArea; have_room profiles carry roomFlat.
  const markers: MapMarker[] = useMemo(() => {
    const pins: MapMarker[] = [];
    for (const p of profiles) {
      const coords =
        p.type === "have_room"
          ? // RoomFlat stores GeoJSON — the array is nested one level deeper:
            // location.coordinates.coordinates. (searchArea keeps a plain array.)
            p.roomFlat?.location?.coordinates?.coordinates
          : p.searchArea?.location?.coordinates;
      if (!Array.isArray(coords) || coords.length < 2) continue;
      const lng = Number(coords[0]);
      const lat = Number(coords[1]);
      // Skip missing/default [0,0] pins.
      if (!Number.isFinite(lat) || !Number.isFinite(lng)) continue;
      if (Math.abs(lat) < 1e-6 && Math.abs(lng) < 1e-6) continue;

      const rent =
        p.type === "have_room" ? p.roomFlat?.rentAmount : p.budgetRange?.max;
      const city =
        p.type === "have_room"
          ? p.roomFlat?.location?.city
          : p.searchArea?.city;
      pins.push({
        lat,
        lng,
        id: p._id,
        title: p.user?.name ?? "Flatmate",
        subtitle: [
          typeof rent === "number" ? `₹${rent.toLocaleString("en-IN")}/mo` : "",
          city || "",
        ]
          .filter(Boolean)
          .join(" · "),
      });
    }
    return pins;
  }, [profiles]);

  const mapColumnVisible = laptopMapOpen;

  return (
    <div className="relative min-h-screen w-full bg-[#F7F8FC]">
      {/* ---------------------------------------------------------------- */}
      {/* Header                                                            */}
      {/* ---------------------------------------------------------------- */}
      <header className="border-b bg-white" style={{ borderColor: BORDER }}>
        <div className="mx-auto w-full max-w-[1400px] px-4 pb-6 pt-12 sm:px-6 md:px-10 md:pb-8 md:pt-22">
          <h1
            className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl"
            style={{ color: INK }}
          >
            Find a flatmate in the Tricity
          </h1>
          <p
            className="mt-2 max-w-2xl text-sm leading-relaxed sm:text-base"
            style={{ color: INK_SOFT }}
          >
            Browse people with a spare room or looking for one in Chandigarh,
            Panchkula, Mohali and nearby. Filter by budget, lifestyle and ID
            verification to find a good fit.
          </p>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1400px] px-4 pb-24 pt-6 sm:px-6 md:px-10 md:pt-8 lg:pb-12">
        {/* -------------------------------------------------------------- */}
        {/* Search panel                                                    */}
        {/* -------------------------------------------------------------- */}
        <form
          onSubmit={runSearch}
          className="rounded-2xl border bg-white shadow-[0_1px_2px_rgba(22,26,46,0.04)]"
          style={{ borderColor: BORDER }}
        >
          {/* Profile type segmented control */}
          <div
            className="flex flex-wrap items-center justify-between gap-3 border-b px-4 py-3 sm:px-5"
            style={{ borderColor: BORDER }}
          >
            <div
              role="tablist"
              aria-label="Profile type"
              className="inline-flex max-w-full overflow-x-auto rounded-xl bg-[#F1F3FA] p-1"
            >
              {PROFILE_TYPES.map((t) => {
                const Icon = t.icon;
                const active = filters.type === t.value;
                return (
                  <button
                    key={t.value || "all"}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => selectType(t.value)}
                    className={`inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium transition-colors sm:text-sm ${
                      active
                        ? "bg-white text-[#4161df] shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {t.label}
                  </button>
                );
              })}
            </div>

            {activeFiltersCount > 0 && (
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Clear all
              </button>
            )}
          </div>

          {/* Primary row */}
          <div className="p-4 sm:p-5">
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-[1.6fr_1fr_1fr_auto]">
              <label className="col-span-2 block lg:col-span-1">
                <FieldLabel icon={<MapPin className="h-3.5 w-3.5" />}>
                  City
                </FieldLabel>
                <span className="relative block">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    placeholder="e.g. Mohali, Chandigarh"
                    value={filters.city}
                    onChange={(e) => updateFilter("city", e.target.value)}
                    className={`${FIELD_CLASS} pl-9`}
                  />
                </span>
              </label>
              <label className="block">
                <FieldLabel icon={<IndianRupee className="h-3.5 w-3.5" />}>
                  Min budget
                </FieldLabel>
                <input
                  type="number"
                  min={0}
                  inputMode="numeric"
                  placeholder="₹ min"
                  value={filters.minBudget}
                  onChange={(e) => updateFilter("minBudget", e.target.value)}
                  className={FIELD_CLASS}
                />
              </label>
              <label className="block">
                <FieldLabel icon={<IndianRupee className="h-3.5 w-3.5" />}>
                  Max budget
                </FieldLabel>
                <input
                  type="number"
                  min={0}
                  inputMode="numeric"
                  placeholder="₹ max"
                  value={filters.maxBudget}
                  onChange={(e) => updateFilter("maxBudget", e.target.value)}
                  className={FIELD_CLASS}
                />
              </label>
              <div className="col-span-2 flex items-end gap-2 lg:col-span-1">
                <button
                  type="button"
                  onClick={() => setFiltersOpen((o) => !o)}
                  aria-expanded={filtersOpen}
                  aria-controls="advanced-filters"
                  className="relative inline-flex h-10 flex-1 items-center justify-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3.5 text-sm font-medium text-gray-700 transition-colors hover:border-gray-300 hover:bg-gray-50 lg:flex-none"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  More filters
                  {advancedCount > 0 && (
                    <span className="rounded-full bg-[#4161df] px-1.5 py-0.5 text-[10px] font-semibold leading-none text-white">
                      {advancedCount}
                    </span>
                  )}
                  <ChevronDown
                    className={`h-4 w-4 text-gray-400 transition-transform ${
                      filtersOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <button
                  type="submit"
                  className="inline-flex h-10 flex-1 items-center justify-center gap-1.5 rounded-lg bg-[#4161df] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#3451c9] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4161df] lg:flex-none"
                >
                  <Search className="h-4 w-4" />
                  Search
                </button>
              </div>
            </div>

            {/* Budget presets */}
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="mr-1 text-xs font-medium text-gray-500">
                Quick budget
              </span>
              {BUDGET_PRESETS.map((p) => {
                const isActive =
                  filters.minBudget === p.min && filters.maxBudget === p.max;
                return (
                  <button
                    key={p.label}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() =>
                      setFilters((f) => ({
                        ...f,
                        minBudget: isActive ? "" : p.min,
                        maxBudget: isActive ? "" : p.max,
                      }))
                    }
                    className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                      isActive
                        ? "border-[#4161df] bg-[#4161df]/10 text-[#4161df]"
                        : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {p.label}
                  </button>
                );
              })}
            </div>

            {/* Advanced filters */}
            <div
              id="advanced-filters"
              className={`${filtersOpen ? "block" : "hidden"} mt-4 border-t pt-4`}
              style={{ borderColor: BORDER }}
            >
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <SelectField
                  label="Gender"
                  icon={<UserRound className="h-3.5 w-3.5" />}
                  value={filters.gender}
                  onChange={(v) => updateFilter("gender", v)}
                  options={GENDERS}
                />
                <SelectField
                  label="Occupation"
                  icon={<Briefcase className="h-3.5 w-3.5" />}
                  value={filters.occupation}
                  onChange={(v) => updateFilter("occupation", v)}
                  options={OCCUPATIONS}
                />
                <SelectField
                  label="Food habit"
                  icon={<UtensilsCrossed className="h-3.5 w-3.5" />}
                  value={filters.foodPreference}
                  onChange={(v) => updateFilter("foodPreference", v)}
                  options={FOOD_PREFS}
                />
                <SelectField
                  label="Cleanliness"
                  icon={<Sparkles className="h-3.5 w-3.5" />}
                  value={filters.cleanliness}
                  onChange={(v) => updateFilter("cleanliness", v)}
                  options={CLEAN_LEVELS}
                />
                <SelectField
                  label="Smoking"
                  icon={<Cigarette className="h-3.5 w-3.5" />}
                  value={filters.smoking}
                  onChange={(v) => updateFilter("smoking", v)}
                  options={SMOKING_OPTIONS}
                />
                <SelectField
                  label="Drinking"
                  icon={<Wine className="h-3.5 w-3.5" />}
                  value={filters.drinking}
                  onChange={(v) => updateFilter("drinking", v)}
                  options={DRINKING_OPTIONS}
                />
                <div className="flex items-end sm:col-span-2">
                  <label className="flex h-10 w-full cursor-pointer items-center gap-2.5 rounded-lg border border-gray-200 bg-white px-3 transition-colors hover:border-[#4161df]/40">
                    <input
                      type="checkbox"
                      checked={filters.idVerified}
                      onChange={(e) =>
                        updateFilter("idVerified", e.target.checked)
                      }
                      className="h-4 w-4 rounded border-gray-300 accent-[#4161df]"
                    />
                    <BadgeCheck className="h-4 w-4 text-[#4161df]" />
                    <span className="text-sm font-medium text-gray-700">
                      Show ID-verified profiles only
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Applied filter chips */}
          {appliedCount > 0 && (
            <div
              className="flex flex-wrap items-center gap-2 border-t bg-[#FAFBFE] px-4 py-3 sm:px-5"
              style={{ borderColor: BORDER }}
            >
              <span className="text-xs font-medium text-gray-500">
                Showing results for
              </span>
              <ActiveFilterChips
                applied={applied}
                onRemoveChip={removeAppliedChip}
              />
            </div>
          )}
        </form>

        {/* -------------------------------------------------------------- */}
        {/* Error                                                           */}
        {/* -------------------------------------------------------------- */}
        {error && (
          <div
            role="alert"
            className="mt-6 flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-600" />
            <div>
              <p className="text-sm font-medium text-rose-800">
                We couldn&apos;t load profiles
              </p>
              <p className="text-sm text-rose-700">{getErrorMessage(error)}</p>
            </div>
          </div>
        )}

        {/* -------------------------------------------------------------- */}
        {/* Results                                                         */}
        {/* -------------------------------------------------------------- */}
        <section className="mt-8" aria-live="polite">
          {/* Loading skeletons */}
          {loading && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <CardSkeleton key={i} />
              ))}
            </div>
          )}

          {/* Empty state */}
          {!loading && !error && profiles.length === 0 && (
            <div
              className="flex flex-col items-center gap-3 rounded-2xl border border-dashed bg-white px-6 py-16 text-center"
              style={{ borderColor: BORDER }}
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#4161df]/10">
                <Search className="h-5 w-5 text-[#4161df]" />
              </span>
              <div>
                <p className="text-base font-semibold" style={{ color: INK }}>
                  No profiles match these filters
                </p>
                <p className="mt-1 text-sm" style={{ color: INK_SOFT }}>
                  Try a nearby city, a wider budget range, or remove a lifestyle
                  filter.
                </p>
              </div>
              {appliedCount > 0 && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-1 inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Clear all filters
                </button>
              )}
            </div>
          )}

          {!loading && profiles.length > 0 && (
            <>
              {/* Results header */}
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2
                    className="text-base font-semibold sm:text-lg"
                    style={{ color: INK }}
                  >
                    {profiles.length} profile{profiles.length !== 1 ? "s" : ""}
                    {applied.city ? ` in ${applied.city}` : ""}
                  </h2>
                  <p className="mt-0.5 text-xs" style={{ color: INK_SOFT }}>
                    {markers.length > 0
                      ? `${markers.length} with a map location`
                      : "None have a map location saved yet"}
                  </p>
                </div>

                {/* Desktop map toggle */}
                <button
                  type="button"
                  onClick={() => setLaptopMapOpen((o) => !o)}
                  aria-pressed={laptopMapOpen}
                  className="hidden items-center gap-2 rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 lg:inline-flex"
                >
                  {laptopMapOpen ? (
                    <>
                      <ListIcon className="h-4 w-4" />
                      Hide map
                    </>
                  ) : (
                    <>
                      <MapIcon className="h-4 w-4" />
                      Show map
                    </>
                  )}
                </button>
              </div>

              <div
                className={`grid grid-cols-1 items-start gap-6 ${
                  mapColumnVisible
                    ? "lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]"
                    : "lg:grid-cols-1"
                }`}
              >
                {/* List */}
                <div
                  className={`${activeTab === "list" ? "block" : "hidden"} min-w-0 lg:order-1 lg:block`}
                >
                  <div
                    className={`grid grid-cols-1 gap-4 sm:grid-cols-2 ${
                      mapColumnVisible
                        ? "2xl:grid-cols-3"
                        : "lg:grid-cols-3 xl:grid-cols-4"
                    }`}
                  >
                    {profiles.map((p) => (
                      <RoommateProfileCard
                        key={p._id}
                        profile={p}
                        saved={savedIds.has(p._id)}
                        liked={likedIds.has(p._id)}
                        connected={hasPendingRequest(p._id)}
                        onView={(id) => router.push(`/flatmates/profile/${id}`)}
                        onSave={toggleSaved}
                        onLike={toggleLiked}
                        onConnect={handleConnect}
                        onCancel={handleCancelConnection}
                      />
                    ))}
                  </div>
                </div>

                {/* Map — sticky on desktop */}
                <div
                  className={`${activeTab === "map" ? "block" : "hidden"} ${
                    mapColumnVisible ? "lg:block" : "lg:hidden"
                  } z-10 w-full min-w-0 self-start lg:sticky lg:top-24 lg:order-2`}
                >
                  {markers.length > 0 ? (
                    <div
                      className="overflow-hidden rounded-2xl border bg-white"
                      style={{ borderColor: BORDER }}
                    >
                      <div className="flex items-center justify-between gap-2 px-4 py-3">
                        <p
                          className="inline-flex items-center gap-1.5 text-sm font-semibold"
                          style={{ color: INK }}
                        >
                          <MapPin
                            className="h-4 w-4"
                            style={{ color: BRAND }}
                          />
                          {markers.length}{" "}
                          {markers.length === 1 ? "profile" : "profiles"} on map
                        </p>
                        <p className="text-xs" style={{ color: INK_SOFT }}>
                          Select a pin for budget and area
                        </p>
                      </div>
                      <div className="px-3 pb-3">
                        <div className="w-full overflow-hidden rounded-xl border border-gray-200">
                          <MapView markers={markers} />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div
                      className="flex flex-col items-center gap-2 rounded-2xl border border-dashed bg-white py-14 text-center"
                      style={{ borderColor: BORDER }}
                    >
                      <MapPin className="h-6 w-6 text-gray-400" />
                      <p className="text-sm" style={{ color: INK_SOFT }}>
                        None of these profiles have a map location yet.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </section>
      </main>

      {/* Mobile / tablet: floating list-map switch */}
      {!loading && profiles.length > 0 && (
        <div className="fixed inset-x-0 bottom-5 z-[1000] flex justify-center lg:hidden">
          <button
            type="button"
            onClick={() => setActiveTab(activeTab === "list" ? "map" : "list")}
            className="inline-flex items-center gap-2 rounded-full bg-[#161A2E] px-5 py-3 text-sm font-semibold text-white shadow-xl transition-transform active:scale-95"
            aria-label={
              activeTab === "list" ? "Open map view" : "Open list view"
            }
          >
            {activeTab === "list" ? (
              <>
                <MapIcon className="h-4 w-4" />
                Map
                {markers.length > 0 && (
                  <span className="rounded-full bg-white/20 px-1.5 py-0.5 text-[11px] leading-none">
                    {markers.length}
                  </span>
                )}
              </>
            ) : (
              <>
                <ListIcon className="h-4 w-4" />
                List
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Active filter chips                                                 */
/* ------------------------------------------------------------------ */

const FILTER_LABELS: Record<string, string> = {
  city: "City",
  type: "Type",
  gender: "Gender",
  occupation: "Occupation",
  smoking: "Smoking",
  drinking: "Drinking",
  foodPreference: "Food",
  cleanliness: "Cleanliness",
  idVerified: "Verified",
  minBudget: "Min budget",
  maxBudget: "Max budget",
};

const FILTER_VALUE_LABELS: Record<string, Record<string, string>> = {
  type: { have_room: "Has room", no_room: "Looking" },
  gender: { male: "Male", female: "Female", other: "Other" },
  occupation: {
    student: "Student",
    working_professional: "Working",
    self_employed: "Self-employed",
  },
  smoking: { yes: "Smoker", no: "Non-smoker" },
  drinking: { yes: "Drinks", no: "Non-drinker" },
  foodPreference: {
    veg: "Veg",
    non_veg: "Non-veg",
    eggetarian: "Eggetarian",
    vegan: "Vegan",
  },
  cleanliness: {
    very_tidy: "Very tidy",
    moderately_tidy: "Moderate",
    relaxed: "Relaxed",
  },
};

function ActiveFilterChips({
  applied,
  onRemoveChip,
}: {
  applied: FlatmatesFilters;
  onRemoveChip: (key: keyof FlatmatesFilters) => void;
}) {
  const chips: { key: keyof FlatmatesFilters; label: string }[] = [];

  (Object.keys(applied) as (keyof FlatmatesFilters)[]).forEach((key) => {
    const value = applied[key];
    if (value === "" || value === false) return;

    if (key === "idVerified") {
      chips.push({ key, label: "Verified only" });
      return;
    }

    if (key === "minBudget" || key === "maxBudget") {
      // Min and max are shown as one budget chip, emitted once when the
      // first of the two keys is reached.
      if (key === "maxBudget" && applied.minBudget) return;
      const min = applied.minBudget;
      const max = applied.maxBudget;
      const label = `Budget: ${min ? `₹${Number(min).toLocaleString("en-IN")}` : "₹0"} – ${max ? `₹${Number(max).toLocaleString("en-IN")}` : "Any"}`;
      chips.push({ key: "minBudget", label });
      return;
    }

    const label = FILTER_VALUE_LABELS[key]?.[value as string] || value;
    chips.push({ key, label: `${FILTER_LABELS[key]}: ${label}` });
  });

  if (chips.length === 0) return null;

  return (
    <>
      {chips.map((chip) => (
        <span
          key={chip.key}
          className="inline-flex items-center gap-1 rounded-full border border-[#4161df]/20 bg-[#4161df]/5 py-1 pl-3 pr-1.5 text-xs font-medium text-[#3451c9]"
        >
          {chip.label}
          <button
            type="button"
            onClick={() => onRemoveChip(chip.key)}
            aria-label={`Remove ${chip.label} filter`}
            className="flex h-4 w-4 items-center justify-center rounded-full transition-colors hover:bg-[#4161df]/15"
          >
            <X className="h-3 w-3" />
          </button>
        </span>
      ))}
    </>
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

/**
 * `useSearchParams` in `FlatmatesContent` needs a Suspense boundary or the page
 * cannot be statically prerendered (build fails with a CSR bailout).
 */
export default function FlatmatesPage() {
  return (
    <Suspense fallback={null}>
      <FlatmatesContent />
    </Suspense>
  );
}

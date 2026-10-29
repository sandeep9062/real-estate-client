"use client";

import { useEffect, useMemo, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import {
  Search,
  AlertCircle,
  Loader2,
  MapPin,
  Map as MapIcon,
  List as ListIcon,
  RotateCcw,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
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
// roommate profiles — both have_room (people with a room to share) and
// no_room (people looking for a room). It's the people-side counterpart to
// useBrowseRoomsAndFlatsQuery (which browses RoomFlat listings).
//
// The endpoint populates `user` (at least _id/name/avatarUrl) and `roomFlat`
// (for have_room profiles' location and rent) so the cards have everything
// they need to render.
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

  // Keep the city filter in sync with the ?city= URL param. This covers
  // in-app navigation between city chips (the page component stays mounted),
  // so the applied city always matches the URL.
  useEffect(() => {
    setFilters((f) => (f.city === urlCity ? f : { ...f, city: urlCity }));
    setApplied((a) => (a.city === urlCity ? a : { ...a, city: urlCity }));
  }, [urlCity]);

  const activeFiltersCount = useMemo(() => countFilters(filters), [filters]);
  const appliedCount = useMemo(() => countFilters(applied), [applied]);

  // Profile ids with a pending outgoing request, derived straight from the
  // live connections list (no effect/state sync needed, and it clears itself
  // when a request is accepted, declined or withdrawn).
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

  return (
    <div className="relative min-h-screen w-full bg-gray-50">
      {/* Mobile: list / map toggle — right-center, same as /properties */}
      <div className="fixed right-4 top-1/2 z-[1000] -translate-y-1/2 lg:hidden">
        <button
          type="button"
          onClick={() => setActiveTab(activeTab === "list" ? "map" : "list")}
          className="flex transform flex-col items-center gap-1 rounded-2xl bg-[#4161df] px-2 py-3 text-white shadow-2xl transition-all hover:bg-[#3451c9] active:scale-95"
          aria-label={activeTab === "list" ? "Open map view" : "Open list view"}
        >
          {activeTab === "list" ? (
            <>
              <MapIcon className="h-4 w-4" />
              <span className="max-w-16 text-center text-[10px] font-semibold leading-tight">
                Map
              </span>
            </>
          ) : (
            <>
              <ListIcon className="h-4 w-4" />
              <span className="max-w-16 text-center text-[10px] font-semibold leading-tight">
                List
              </span>
            </>
          )}
        </button>
      </div>

      {/* Laptop: show / hide map column — right-center, same as /properties */}
      <div className="fixed right-4 top-1/2 z-[1000] hidden -translate-y-1/2 lg:flex">
        <button
          type="button"
          onClick={() => setLaptopMapOpen((o) => !o)}
          className="flex transform flex-col items-center gap-1 rounded-2xl bg-[#4161df] px-3 py-4 text-white shadow-2xl transition-all hover:bg-[#3451c9] active:scale-95"
          aria-label={
            laptopMapOpen
              ? "Hide map, expand listings"
              : "Show map beside listings"
          }
        >
          {laptopMapOpen ? (
            <>
              <ListIcon className="h-5 w-5" />
              <span className="max-w-16 text-center text-[10px] font-semibold leading-tight">
                Hide
              </span>
            </>
          ) : (
            <>
              <MapIcon className="h-5 w-5" />
              <span className="max-w-16 text-center text-[10px] font-semibold leading-tight">
                Map
              </span>
            </>
          )}
        </button>
      </div>

      <main className="mx-auto w-full max-w-full flex flex-col items-center gap-4 sm:gap-6 md:gap-8 px-4 sm:px-6 md:px-10 py-6 sm:py-8 md:py-12">
        <div className="w-full text-center">
          <h1 className="mb-2 text-xl font-bold text-gray-900 sm:mb-3 sm:text-2xl md:mb-4 md:text-3xl">
            Find a Flatmate in Tricity
          </h1>
          <p className="px-2 text-sm text-gray-600 sm:text-base md:text-lg">
            Browse verified flatmates in Chandigarh, Panchkula, Mohali &amp;
            more.
          </p>
        </div>

        <form
          onSubmit={runSearch}
          className="mt-6 w-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
        >
          <div className="border-b border-gray-100 bg-gray-50/50 px-4 py-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#4161df]">
                  <Search className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-gray-900">
                    Search flatmates
                  </h2>
                  <p className="hidden text-[11px] text-gray-500 sm:block">
                    {appliedCount > 0
                      ? `${appliedCount} filter${appliedCount > 1 ? "s" : ""} applied`
                      : "Apply filters to refine your search"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {activeFiltersCount > 0 && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
                  >
                    <RotateCcw className="h-3 w-3" />
                    <span className="hidden sm:inline">Clear</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setFiltersOpen((o) => !o)}
                  aria-expanded={filtersOpen}
                  className="flex items-center gap-1 rounded-md bg-[#4161df] px-3 py-1.5 text-xs font-medium text-white transition-colors md:hidden"
                >
                  <SlidersHorizontal className="h-3.5 w-3.5" />
                  Filters
                  {activeFiltersCount > 0 && (
                    <span className="ml-1 rounded-full bg-white/20 px-1.5 py-0.5 text-[10px]">
                      {activeFiltersCount}
                    </span>
                  )}
                  {filtersOpen ? (
                    <ChevronUp className="ml-1 h-3.5 w-3.5" />
                  ) : (
                    <ChevronDown className="ml-1 h-3.5 w-3.5" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className={`${filtersOpen ? "block" : "hidden"} p-4 md:block`}>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_auto]">
              <label className="block">
                <span className="mb-1 flex items-center gap-1 text-xs font-medium text-gray-600">
                  <MapPin className="h-3.5 w-3.5" />
                  City
                </span>
                <span className="relative block">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    placeholder="e.g. Mohali, Chandigarh…"
                    value={filters.city}
                    onChange={(e) => updateFilter("city", e.target.value)}
                    className="h-10 w-full rounded-lg border border-gray-200 bg-white pl-9 pr-3 text-sm outline-none focus:border-[#4161df] focus:ring-1 focus:ring-[#4161df]/20"
                  />
                </span>
              </label>
              <label className="block">
                <span className="mb-1 flex items-center gap-1 text-xs font-medium text-gray-600">
                  <IndianRupee className="h-3.5 w-3.5" />
                  Min budget
                </span>
                <input
                  type="number"
                  min={0}
                  placeholder="₹ min"
                  value={filters.minBudget}
                  onChange={(e) => updateFilter("minBudget", e.target.value)}
                  className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm outline-none focus:border-[#4161df] focus:ring-1 focus:ring-[#4161df]/20"
                />
              </label>
              <label className="block">
                <span className="mb-1 flex items-center gap-1 text-xs font-medium text-gray-600">
                  <IndianRupee className="h-3.5 w-3.5" />
                  Max budget
                </span>
                <input
                  type="number"
                  min={0}
                  placeholder="₹ max"
                  value={filters.maxBudget}
                  onChange={(e) => updateFilter("maxBudget", e.target.value)}
                  className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm outline-none focus:border-[#4161df] focus:ring-1 focus:ring-[#4161df]/20"
                />
              </label>
              <div className="flex items-end">
                <button
                  type="submit"
                  className="inline-flex h-10 w-full items-center justify-center gap-1.5 rounded-lg bg-[#4161df] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#3451c9] sm:w-auto"
                >
                  <Search className="h-3.5 w-3.5" />
                  Search
                </button>
              </div>
            </div>

            {/* Row 2: Profile type + Gender + Occupation */}
            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <label className="block">
                <span className="mb-1 flex items-center gap-1 text-xs font-medium text-gray-600">
                  <Users className="h-3.5 w-3.5" />
                  Profile type
                </span>
                <select
                  value={filters.type}
                  onChange={(e) => updateFilter("type", e.target.value)}
                  className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm outline-none focus:border-[#4161df] focus:ring-1 focus:ring-[#4161df]/20"
                >
                  {PROFILE_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="mb-1 flex items-center gap-1 text-xs font-medium text-gray-600">
                  Gender
                </span>
                <select
                  value={filters.gender}
                  onChange={(e) => updateFilter("gender", e.target.value)}
                  className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm outline-none focus:border-[#4161df] focus:ring-1 focus:ring-[#4161df]/20"
                >
                  {GENDERS.map((g) => (
                    <option key={g.value} value={g.value}>
                      {g.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="mb-1 flex items-center gap-1 text-xs font-medium text-gray-600">
                  <Briefcase className="h-3.5 w-3.5" />
                  Occupation
                </span>
                <select
                  value={filters.occupation}
                  onChange={(e) => updateFilter("occupation", e.target.value)}
                  className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm outline-none focus:border-[#4161df] focus:ring-1 focus:ring-[#4161df]/20"
                >
                  {OCCUPATIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            {/* Row 3: Lifestyle */}
            <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <label className="block">
                <span className="mb-1 flex items-center gap-1 text-xs font-medium text-gray-600">
                  <Cigarette className="h-3.5 w-3.5" />
                  Smoking
                </span>
                <select
                  value={filters.smoking}
                  onChange={(e) => updateFilter("smoking", e.target.value)}
                  className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm outline-none focus:border-[#4161df] focus:ring-1 focus:ring-[#4161df]/20"
                >
                  <option value="">Any</option>
                  <option value="yes">Smoker</option>
                  <option value="no">Non-smoker</option>
                </select>
              </label>
              <label className="block">
                <span className="mb-1 flex items-center gap-1 text-xs font-medium text-gray-600">
                  <Wine className="h-3.5 w-3.5" />
                  Drinking
                </span>
                <select
                  value={filters.drinking}
                  onChange={(e) => updateFilter("drinking", e.target.value)}
                  className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm outline-none focus:border-[#4161df] focus:ring-1 focus:ring-[#4161df]/20"
                >
                  <option value="">Any</option>
                  <option value="yes">Drinks</option>
                  <option value="no">Non-drinker</option>
                </select>
              </label>
              <label className="block">
                <span className="mb-1 flex items-center gap-1 text-xs font-medium text-gray-600">
                  <UtensilsCrossed className="h-3.5 w-3.5" />
                  Food habit
                </span>
                <select
                  value={filters.foodPreference}
                  onChange={(e) =>
                    updateFilter("foodPreference", e.target.value)
                  }
                  className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm outline-none focus:border-[#4161df] focus:ring-1 focus:ring-[#4161df]/20"
                >
                  {FOOD_PREFS.map((f) => (
                    <option key={f.value} value={f.value}>
                      {f.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="mb-1 flex items-center gap-1 text-xs font-medium text-gray-600">
                  <Sparkles className="h-3.5 w-3.5" />
                  Cleanliness
                </span>
                <select
                  value={filters.cleanliness}
                  onChange={(e) => updateFilter("cleanliness", e.target.value)}
                  className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm outline-none focus:border-[#4161df] focus:ring-1 focus:ring-[#4161df]/20"
                >
                  {CLEAN_LEVELS.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            {/* Row 4: Verified + Budget presets */}
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <label className="flex h-10 cursor-pointer items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 transition-colors hover:border-[#4161df]/30">
                <input
                  type="checkbox"
                  checked={filters.idVerified}
                  onChange={(e) => updateFilter("idVerified", e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 accent-[#4161df]"
                />
                <BadgeCheck className="h-3.5 w-3.5 text-[#4161df]" />
                <span className="text-sm font-medium text-gray-700">
                  Verified only
                </span>
              </label>
              <div className="hidden h-6 w-px bg-gray-200 sm:block" />
              <span className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
                Budget:
              </span>
              {BUDGET_PRESETS.map((p) => {
                const isActive =
                  filters.minBudget === p.min && filters.maxBudget === p.max;
                return (
                  <button
                    key={p.label}
                    type="button"
                    onClick={() =>
                      setFilters((f) => ({
                        ...f,
                        minBudget: p.min,
                        maxBudget: p.max,
                      }))
                    }
                    className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                      isActive
                        ? "border-[#4161df] bg-[#4161df]/5 text-[#4161df]"
                        : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {p.label}
                  </button>
                );
              })}
            </div>

            {/* Active filter chips */}
            {appliedCount > 0 && (
              <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-gray-100 pt-3">
                <span className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
                  Active:
                </span>
                <ActiveFilterChips
                  applied={applied}
                  onRemoveChip={removeAppliedChip}
                  onClearAll={clearFilters}
                />
              </div>
            )}
          </div>
        </form>

        {error && (
          <div
            className="mt-4 flex items-center gap-2.5 rounded-xl border-l-[3px] bg-rose-50/70 px-4 py-3"
            style={{ borderLeftColor: "#e11d48" }}
          >
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
            <p className="text-sm text-rose-700">{getErrorMessage(error)}</p>
          </div>
        )}

        <div className="mt-8">
          {loading && (
            <div className="flex items-center justify-center gap-2.5 py-10">
              <Loader2
                className="h-5 w-5 animate-spin"
                style={{ color: BRAND }}
              />
              <p className="text-sm" style={{ color: INK_SOFT }}>
                Searching…
              </p>
            </div>
          )}

          {!loading &&
            markers.length > 0 &&
            activeTab === "list" &&
            !laptopMapOpen && (
              <div
                className="mb-6 flex items-center gap-2.5 rounded-xl border bg-slate-50/70 px-4 py-3 lg:hidden"
                style={{ borderColor: BORDER }}
              >
                <MapPin className="h-4 w-4 shrink-0" style={{ color: BRAND }} />
                <p className="text-xs" style={{ color: INK_SOFT }}>
                  {markers.length}{" "}
                  {markers.length === 1 ? "profile has" : "profiles have"} a map
                  location — tap the Map button on the right to view.
                </p>
              </div>
            )}

          {!loading && markers.length === 0 && profiles.length > 0 && (
            <div
              className="mb-6 flex items-center gap-2.5 rounded-xl border bg-slate-50/70 px-4 py-3"
              style={{ borderColor: BORDER }}
            >
              <MapPin
                className="h-4 w-4 shrink-0"
                style={{ color: "#9CA3AF" }}
              />
              <p className="text-xs" style={{ color: INK_SOFT }}>
                These profiles don&apos;t have a map location saved yet — ask
                them to add one during onboarding.
              </p>
            </div>
          )}

          {!loading && !error && profiles.length === 0 && (
            <div
              className="flex flex-col items-center gap-2 rounded-2xl border border-dashed py-14 text-center"
              style={{ borderColor: BORDER }}
            >
              <MapPin className="h-6 w-6" style={{ color: "#9CA3AF" }} />
              <p className="text-sm" style={{ color: INK_SOFT }}>
                No profiles match yet — try widening the city or budget range.
              </p>
            </div>
          )}

          {!loading && profiles.length > 0 && (
            <div
              className={`grid grid-cols-1 items-start gap-6 ${laptopMapOpen ? "lg:grid-cols-2" : "lg:grid-cols-1"}`}
            >
              {/* List Section */}
              <div
                className={`${activeTab === "list" ? "block" : "hidden"} order-2 min-w-0 space-y-3 lg:order-1 lg:block`}
              >
                <div className="flex items-baseline justify-between gap-2">
                  <p className="text-sm font-medium text-gray-700">
                    {profiles.length} profile
                    {profiles.length !== 1 ? "s" : ""}
                  </p>
                  <span className="text-xs text-gray-500 sm:text-sm">
                    {markers.length > 0
                      ? `${markers.length} with map location`
                      : "No map locations yet"}
                  </span>
                </div>
                {/* Fewer columns when the map column is open so cards don't get cramped */}
                <div
                  className={`grid gap-3 sm:grid-cols-2 ${
                    laptopMapOpen
                      ? "xl:grid-cols-2"
                      : "sm:grid-cols-3 xl:grid-cols-4"
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

              {/* Map Section — sticky on desktop, toggled by right-center button */}
              <div
                className={`${activeTab === "map" ? "block" : "hidden"} ${laptopMapOpen ? "lg:block" : "lg:hidden"} z-10 order-1 w-full min-w-0 self-start lg:sticky lg:top-24 lg:order-2`}
              >
                {markers.length > 0 ? (
                  <div
                    className="overflow-hidden rounded-2xl border bg-white"
                    style={{ borderColor: BORDER }}
                  >
                    <div className="flex items-center justify-between px-4 pt-3">
                      <p
                        className="inline-flex items-center gap-1.5 text-sm font-semibold"
                        style={{ color: INK }}
                      >
                        <MapPin className="h-4 w-4" style={{ color: BRAND }} />
                        {markers.length}{" "}
                        {markers.length === 1 ? "profile" : "profiles"} on map
                      </p>
                      <p className="text-xs" style={{ color: INK_SOFT }}>
                        Click a pin for budget &amp; area
                      </p>
                    </div>
                    <div className="p-3">
                      <div className="w-full overflow-hidden rounded-xl border border-gray-200">
                        <MapView markers={markers} />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div
                    className="flex flex-col items-center gap-2 rounded-2xl border border-dashed py-14 text-center"
                    style={{ borderColor: BORDER }}
                  >
                    <MapPin className="h-6 w-6" style={{ color: "#9CA3AF" }} />
                    <p className="text-sm" style={{ color: INK_SOFT }}>
                      No map locations for these results yet.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

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
  onClearAll,
}: {
  applied: FlatmatesFilters;
  onRemoveChip: (key: keyof FlatmatesFilters) => void;
  onClearAll: () => void;
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
          className="inline-flex items-center gap-1.5 rounded-full border border-[#4161df]/20 bg-[#4161df]/5 py-1 pl-3 pr-1.5 text-xs font-medium text-[#4161df]"
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
      <button
        type="button"
        onClick={onClearAll}
        className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-gray-500 transition-colors hover:border-rose-300 hover:bg-rose-50 hover:text-rose-600"
      >
        <RotateCcw className="h-3 w-3" />
        Clear all
      </button>
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

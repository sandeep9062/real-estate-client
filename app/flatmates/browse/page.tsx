"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import {
  Search,
  ArrowLeftRight,
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

const Map = dynamic(() => import("@/components/Map"), { ssr: false });

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

export interface BrowseFilters {
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

const EMPTY_FILTERS: BrowseFilters = {
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

export default function BrowsePage() {
  const searchParams = useSearchParams();
  const urlCity = searchParams.get("city") || "";

  // Seed the city filter from the ?city= URL param so links like
  // /flatmates/browse?city=Mohali (home page chips) pre-apply the city.
  const [filters, setFilters] = useState<BrowseFilters>({
    ...EMPTY_FILTERS,
    city: urlCity,
  });
  const [applied, setApplied] = useState<BrowseFilters>({
    ...EMPTY_FILTERS,
    city: urlCity,
  });
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"list" | "map">("list");
  const [laptopMapOpen, setLaptopMapOpen] = useState(false);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());
  const [connectedIds, setConnectedIds] = useState<Set<string>>(new Set());
  const [connectError, setConnectError] = useState<string | null>(null);

  const [sendConnectionRequest] = useSendConnectionRequestMutation();
  const [respondToConnectionRequest] = useRespondToConnectionRequestMutation();
  const { data: connectionsData, isFetching: connectionsFetching } =
    useListMyConnectionsQuery();
  const [toggleFavRoommateProfile] = useToggleFavRoommateProfileMutation();
  const currentUser = useSelector(selectUser);

  // Sync connectedIds with existing connections (sent requests)
  useEffect(() => {
    if (connectionsData && connectionsData.length > 0) {
      const sentProfileIds = new Set<string>();
      connectionsData.forEach((connection) => {
        // Only show as "sent" if the request is still pending (not accepted/declined)
        if (connection.status === "pending") {
          const toProfileId =
            typeof connection.toProfile === "string"
              ? connection.toProfile
              : (connection.toProfile as { _id: string })?._id;
          if (toProfileId) sentProfileIds.add(toProfileId);
        }
      });
      setConnectedIds(sentProfileIds);
    }
  }, [connectionsData]);

  // Keep the city filter in sync with the ?city= URL param. This covers
  // in-app navigation between city chips (the page component stays mounted),
  // so the applied city always matches the URL.
  useEffect(() => {
    setFilters((f) => (f.city === urlCity ? f : { ...f, city: urlCity }));
    setApplied((a) => (a.city === urlCity ? a : { ...a, city: urlCity }));
  }, [urlCity]);

  const activeFiltersCount = useMemo(
    () =>
      Object.values(filters).filter(
        (v) => v !== "" && v !== false,
      ).length,
    [filters],
  );

  const appliedCount = useMemo(
    () =>
      Object.values(applied).filter(
        (v) => v !== "" && v !== false,
      ).length,
    [applied],
  );
  // Check if a profile has a pending outgoing request using fresh connection data
  // The backend (flatmateConnectionController.js) now serializes all populated
  // references as plain objects with string `_id` values, so direct === comparison
  // against the string ID works reliably here.
  const hasPendingRequest = (id: string): boolean => {
    if (connectedIds.has(id)) return true;
    // Fall back to scanning the live connection list for any pending outgoing
    // request to this profile. This covers the window between sendConnectionRequest
    // succeeding and the sync useEffect re-running with the updated response.
    if (!connectionsData || connectionsData.length === 0) return false;
    return connectionsData.some((c) => {
      if (c.status !== "pending") return false;
      // toProfile is guaranteed to be a plain object with string _id when populated
      return c.toProfile?._id === id;
    });
  };

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

  function updateFilter<K extends keyof BrowseFilters>(
    key: K,
    value: BrowseFilters[K],
  ) {
    setFilters((f) => ({ ...f, [key]: value }));
  }

  function removeAppliedChip(key: keyof BrowseFilters) {
    const resetValue = typeof filters[key] === "boolean" ? false : "";
    setApplied((a) => ({ ...a, [key]: resetValue }));
    setFilters((f) => ({ ...f, [key]: resetValue }));
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
      window.location.href = "/login";
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
    } catch (error: any) {
      toast.error(error?.data?.message || error?.error || "Failed to toggle like");
    }
  }

  async function handleConnect(id: string) {
    if (hasPendingRequest(id)) return;
    setConnectError(null);
    try {
      await sendConnectionRequest({ toProfileId: id }).unwrap();
      setConnectedIds((prev) => new Set(prev).add(id));
      toast.success("Connection request sent!", {
        description: "They'll be notified about your request.",
      });
    } catch (err) {
      const errorMsg = getErrorMessage(err);
      setConnectError(errorMsg);
      toast.error("Failed to send request", {
        description: errorMsg,
      });
    }
  }

  async function handleCancelConnection(id: string) {
    if (!hasPendingRequest(id)) return;
    try {
      // Find the connection ID for this profile
      const connection = connectionsData?.find((c) => {
        // toProfile is guaranteed to be a plain object with string _id when populated
        return c.toProfile?._id === id;
      });
      if (connection) {
        await respondToConnectionRequest({
          id: connection._id,
          status: "withdrawn",
        }).unwrap();
        setConnectedIds((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
        toast.success("Connection request cancelled");
      }
    } catch (err) {
      const errorMsg = getErrorMessage(err);
      toast.error("Failed to cancel request", {
        description: errorMsg,
      });
    }
  }

  const profiles: RoommateProfileCardData[] = useMemo(
    () =>
      seekers.map(({ profile, matchScore }) => ({
        _id: profile._id,
        type: profile.type,
        user: profile.user,
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
          // RoomFlat stores GeoJSON — the array is nested one level deeper:
          // location.coordinates.coordinates. (searchArea keeps a plain array.)
          ? p.roomFlat?.location?.coordinates?.coordinates
          : p.searchArea?.location?.coordinates;
      if (!Array.isArray(coords) || coords.length < 2) continue;
      const lng = Number(coords[0]);
      const lat = Number(coords[1]);
      // Skip missing/default [0,0] pins.
      if (!Number.isFinite(lat) || !Number.isFinite(lng)) continue;
      if (Math.abs(lat) < 1e-6 && Math.abs(lng) < 1e-6) continue;

      const rent =
        p.type === "have_room"
          ? p.roomFlat?.rentAmount
          : p.budgetRange?.max;
      const city =
        p.type === "have_room"
          ? p.roomFlat?.location?.city
          : p.searchArea?.city;
      pins.push({
        lat,
        lng,
        id: p._id,
        title: p.user.name,
        subtitle: [
          typeof rent === "number"
            ? `₹${rent.toLocaleString("en-IN")}/mo`
            : "",
          city || "",
        ]
          .filter(Boolean)
          .join(" · "),
      });
    }
    return pins;
  }, [profiles]);

  return (
    <div className="w-full bg-gray-50 min-h-screen relative">
      {/* Mobile: list / map toggle — right-center, same as /properties */}
      <div className="lg:hidden fixed right-4 top-1/2 -translate-y-1/2 z-[1000]">
        <button
          type="button"
          onClick={() => setActiveTab(activeTab === "list" ? "map" : "list")}
          className="flex flex-col items-center gap-1 bg-[#4161df] text-white px-2 py-3 rounded-2xl shadow-2xl hover:bg-[#4161df]/10 transition-all transform active:scale-95"
          aria-label={activeTab === "list" ? "Open map view" : "Open list view"}
        >
          {activeTab === "list" ? (
            <>
              <MapIcon className="w-4 h-4" />
              <span className="text-[10px] font-semibold leading-tight text-center max-w-16">
                Map
              </span>
            </>
          ) : (
            <>
              <ListIcon className="w-4 h-4" />
              <span className="text-[10px] font-semibold leading-tight text-center max-w-16">
                List
              </span>
            </>
          )}
        </button>
      </div>

      {/* Laptop: show / hide map column — right-center, same as /properties */}
      <div className="hidden lg:flex fixed right-4 top-1/2 -translate-y-1/2 z-[1000]">
        <button
          type="button"
          onClick={() => setLaptopMapOpen((o) => !o)}
          className="flex flex-col items-center gap-1 bg-[#4161df] text-white px-3 py-4 rounded-2xl shadow-2xl hover:bg-[#4161df]/10 transition-all transform active:scale-95"
          aria-label={
            laptopMapOpen
              ? "Hide map, expand listings"
              : "Show map beside listings"
          }
        >
          {laptopMapOpen ? (
            <>
              <ListIcon className="w-5 h-5" />
              <span className="text-[10px] font-semibold leading-tight text-center max-w-16">
                Hide
              </span>
            </>
          ) : (
            <>
              <MapIcon className="w-5 h-5" />
              <span className="text-[10px] font-semibold leading-tight text-center max-w-16">
                Map
              </span>
            </>
          )}
        </button>
      </div>

      <main className="mx-auto w-full max-w-7xl px-4 sm:px-6 md:px-10 pb-12">
        <div className="w-full text-center">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2 sm:mb-3 md:mb-4">
            Find a Flatmate in Tricity
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 px-2">
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
                    Search seekers
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
              <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 h-10 transition-colors hover:border-[#4161df]/30">
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
            <div className="flex items-center gap-2.5 py-10 justify-center">
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

          {!loading && profiles.length === 0 && (
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
              className={`grid grid-cols-1 gap-6 items-start ${laptopMapOpen ? "lg:grid-cols-2" : "lg:grid-cols-1"}`}
            >
              {/* List Section */}
              <div
                className={`${activeTab === "list" ? "block" : "hidden"} lg:block order-2 lg:order-1 space-y-3 min-w-0`}
              >
                <div className="flex items-baseline justify-between gap-2">
                  <p className="text-sm font-medium text-gray-700">
                    {profiles.length} profile
                    {profiles.length !== 1 ? "s" : ""}
                  </p>
                  <span className="text-xs sm:text-sm text-gray-500">
                    {markers.length > 0
                      ? `${markers.length} with map location`
                      : "No map locations yet"}
                  </span>
                </div>
                <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-4">
                  {profiles.map((p) => (
                    <RoommateProfileCard
                      key={p._id}
                      profile={p}
                      saved={savedIds.has(p._id)}
                      liked={likedIds.has(p._id)}
                      connected={hasPendingRequest(p._id)}
                      onView={(id) => {
                        window.location.href = `/flatmates/profile/${id}`;
                      }}
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
                className={`${activeTab === "map" ? "block" : "hidden"} ${laptopMapOpen ? "lg:block" : "lg:hidden"} order-1 lg:order-2 lg:sticky lg:top-24 z-10 w-full min-w-0 self-start`}
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
                        <Map markers={markers} />
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
  applied: BrowseFilters;
  onRemoveChip: (key: keyof BrowseFilters) => void;
  onClearAll: () => void;
}) {
  const chips: { key: keyof BrowseFilters; label: string }[] = [];

  (Object.keys(applied) as (keyof BrowseFilters)[]).forEach((key) => {
    const value = applied[key];
    if (value === "" || value === false) return;

    if (key === "idVerified") {
      chips.push({ key, label: "Verified only" });
      return;
    }

    if (key === "minBudget" || key === "maxBudget") {
      // Handle budget as a single chip
      if (key === "maxBudget" && applied.minBudget) return; // Already handled with minBudget
      const min = applied.minBudget;
      const max = applied.maxBudget;
      if (min || max) {
        const label = `Budget: ${min ? `₹${Number(min).toLocaleString("en-IN")}` : "₹0"} – ${max ? `₹${Number(max).toLocaleString("en-IN")}` : "Any"}`;
        chips.push({ key: "minBudget", label });
      }
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
            aria-label={`Remove ${chip.key} filter`}
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

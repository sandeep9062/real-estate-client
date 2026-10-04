"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Search,
  SlidersHorizontal,
  MapPin,
  CheckCircle2,
  MessageSquare,
  Briefcase,
  Home,
  UserPlus,
  PlusCircle,
  ArrowLeft,
  Sparkles,
  Filter,
  X,
  ChevronDown,
  Flame,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// Polymorphic Dataset matching unified single schema strategy with rich metrics
const unifiedListings = [
  {
    id: "listing-1",
    slug: "rohit-verma-sector-62",
    name: "Rohit Verma",
    age: 26,
    gender: "Male",
    type: "HAVE_ROOM",
    profession: "Software Engineer",
    location: "Sector 62, Mohali",
    roomDetails: "1 Private Room in 3BHK Builder Floor",
    budget: "₹7,500/mo",
    isOnline: true,
    isVerified: true,
    diet: "Non-Veg",
    smoke: "No",
    tags: ["No-Smoking", "Quiet Life", "Gym Goer"],
    imageUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
  },
  {
    id: "listing-2",
    slug: "ananya-sharma-aerocity",
    name: "Ananya Sharma",
    age: 24,
    gender: "Female",
    type: "NEED_ROOM",
    profession: "UI/UX Designer",
    location: "Aerocity, Mohali",
    roomDetails: "Looking for flat-share or independent room",
    budget: "₹9,000/mo",
    isOnline: true,
    isVerified: true,
    diet: "Veg",
    smoke: "No",
    tags: ["Clean Freak", "Easygoing", "Early Riser"],
    imageUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80",
  },
  {
    id: "listing-3",
    slug: "karan-mehta-sector-45",
    name: "Karan Mehta",
    age: 25,
    gender: "Male",
    type: "HAVE_ROOM",
    profession: "Data Analyst",
    location: "Sector 45, Chandigarh",
    roomDetails: "Shared Master Bedroom Available",
    budget: "₹5,000/mo",
    isOnline: false,
    isVerified: true,
    diet: "Veg",
    smoke: "No",
    tags: ["Night Owl", "Foodie", "WFH"],
    imageUrl:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80",
  },
  {
    id: "listing-4",
    slug: "priya-singh-phase-7",
    name: "Priya Singh",
    age: 23,
    gender: "Female",
    type: "NEED_ROOM",
    profession: "Marketing Lead",
    location: "Phase 7, Mohali",
    roomDetails: "Looking for independent room in girls flat",
    budget: "₹8,000/mo",
    isOnline: true,
    isVerified: false,
    diet: "Veg",
    smoke: "No",
    tags: ["Pet Lover", "Vegan", "Books"],
    imageUrl:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80",
  },
];

function MarketplaceContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Tab State Linkage
  const activeTab =
    (searchParams.get("view") as "have-room" | "need-room") || "have-room";
  const targetType = activeTab === "have-room" ? "HAVE_ROOM" : "NEED_ROOM";

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGender, setSelectedGender] = useState<string>("All");
  const [selectedDiet, setSelectedDiet] = useState<string>("All");
  const [showFiltersModal, setShowFiltersModal] = useState(false);

  const handleTabChange = (viewType: "have-room" | "need-room") => {
    router.push(`/find-roommate?view=${viewType}`);
  };

  // Advanced Filtering Engine Logic
  const filteredDataset = unifiedListings.filter((item) => {
    if (item.type !== targetType) return false;

    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.profession.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some((t) =>
        t.toLowerCase().includes(searchQuery.toLowerCase()),
      );

    const matchesGender =
      selectedGender === "All" || item.gender === selectedGender;
    const matchesDiet = selectedDiet === "All" || item.diet === selectedDiet;

    return matchesSearch && matchesGender && matchesDiet;
  });

  return (
    <main className="w-full mt-20 min-h-screen bg-[#F8FAFC] pb-24 font-sans selection:bg-[#4161DF]/10">
      {/* ─── PREMIUM STICKY HEADER ─── */}
      <header className="w-full bg-white border-b border-slate-100 sticky top-0 z-30 px-4 py-3 sm:px-6 lg:px-8 shadow-[0_2px_15px_-5px_rgba(0,0,0,0.02)]">
        <div className="max-w-7xl mx-auto flex flex-col gap-4">
          {/* Top Title & Primary CTA Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="flex items-center gap-2 group"
                aria-label="Go to homepage"
              >
                <Image
                  src="/bulbul-icon.png"
                  alt="Property bulbul logo"
                  width={36}
                  height={36}
                  priority
                  className="w-8 h-8 transition-transform duration-300 group-hover:scale-[1.03]"
                />
                <div className="hidden sm:flex flex-col leading-tight">
                  <span className="text-[18px] font-extrabold tracking-tight text-[#0F172A]">
                    Property
                  </span>
                  <span className="text-[16px] font-extrabold text-[#4161df] tracking-tight">
                    Bulbul
                  </span>
                </div>
              </Link>
              <div className="h-6 w-px bg-slate-200 mx-1" />
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg sm:text-xl font-black text-[#0F172A] tracking-tight">
                    Flatmate Marketplace
                  </h1>
                  <span className="bg-[#4161DF]/10 text-[#4161DF] text-[10px] font-extrabold px-2 py-0.5 rounded-md flex items-center gap-0.5">
                    <Sparkles className="w-2.5 h-2.5" /> Direct C2C
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Connect directly, split bills, and bypass brokers across
                  Tricity
                </p>
              </div>
            </div>

            {/* Smart Post Button */}
            <Link
              href={`/find-roommate/post?type=${activeTab}`}
              className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-[#4161DF] hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-100 hover:shadow-blue-200 active:scale-[0.98] self-stretch sm:self-auto"
            >
              <PlusCircle className="w-4 h-4" />
              {activeTab === "have-room"
                ? "Share Your Room"
                : "Create Roommate Profile"}
            </Link>
          </div>

          {/* ─── SEGMENTED USER ROLES CONTROLLER ─── */}
          <div className="p-1 bg-slate-100/80 rounded-xl w-full max-w-xl mx-auto grid grid-cols-2 border border-slate-200/30">
            <button
              onClick={() => handleTabChange("have-room")}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all duration-300 ${
                activeTab === "have-room"
                  ? "bg-white text-[#4161DF] shadow-[0_2px_10px_rgba(0,0,0,0.04)]"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              <span>
                I Have a Room{" "}
                <span className="text-[10px] opacity-60 font-medium">
                  (Need Flatmate)
                </span>
              </span>
            </button>
            <button
              onClick={() => handleTabChange("need-room")}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all duration-300 ${
                activeTab === "need-room"
                  ? "bg-white text-[#4161DF] shadow-[0_2px_10px_rgba(0,0,0,0.04)]"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>
                I Need a Room{" "}
                <span className="text-[10px] opacity-60 font-medium">
                  (Have No Flat)
                </span>
              </span>
            </button>
          </div>

          {/* ─── FILTER BAR & SEARCH INFRASTRUCTURE ─── */}
          <div className="flex flex-col md:flex-row gap-2 items-center w-full pt-1 border-t border-slate-50">
            {/* Live Search Inputs */}
            <div className="relative w-full md:flex-1">
              <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                placeholder={
                  activeTab === "have-room"
                    ? "Search sectors with flat vacancies (e.g., Sector 66, VIP Road)..."
                    : "Search budget, tech professions, or tags..."
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200/80 rounded-xl text-xs focus:outline-none focus:border-[#4161DF] focus:bg-white transition-all text-slate-900 placeholder:text-slate-400"
              />
            </div>

            {/* Quick Interactive Filtering Pills */}
            <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto no-scrollbar py-0.5">
              {/* Gender Dropdown Pill */}
              <div className="relative shrink-0">
                <select
                  value={selectedGender}
                  onChange={(e) => setSelectedGender(e.target.value)}
                  className="appearance-none pl-3 pr-7 py-2 bg-white border border-slate-200 rounded-xl text-[11px] font-bold text-slate-600 focus:outline-none focus:border-[#4161DF] cursor-pointer shadow-2xs hover:bg-slate-50 transition-all"
                >
                  <option value="All">Gender: All</option>
                  <option value="Male">Male Only</option>
                  <option value="Female">Female Only</option>
                </select>
                <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2.5 top-1/2 transform -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Diet Dropdown Pill */}
              <div className="relative shrink-0">
                <select
                  value={selectedDiet}
                  onChange={(e) => setSelectedDiet(e.target.value)}
                  className="appearance-none pl-3 pr-7 py-2 bg-white border border-slate-200 rounded-xl text-[11px] font-bold text-slate-600 focus:outline-none focus:border-[#4161DF] cursor-pointer shadow-2xs hover:bg-slate-50 transition-all"
                >
                  <option value="All">Diet: All</option>
                  <option value="Veg">Pure Veg</option>
                  <option value="Non-Veg">Non-Veg Allowed</option>
                </select>
                <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2.5 top-1/2 transform -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Advanced Filter Modal Launcher */}
              <button
                onClick={() => setShowFiltersModal(true)}
                className="p-2 bg-white border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 shadow-2xs flex items-center gap-1 text-[11px] font-extrabold shrink-0 active:scale-95 transition-all"
              >
                <SlidersHorizontal className="w-3 h-3 text-[#4161DF]" />
                More Filters
              </button>

              {/* Active Filters Clear Badge indicator */}
              {(selectedGender !== "All" ||
                selectedDiet !== "All" ||
                searchQuery !== "") && (
                <button
                  onClick={() => {
                    setSelectedGender("All");
                    setSelectedDiet("All");
                    setSearchQuery("");
                  }}
                  className="text-[10px] font-bold text-rose-500 hover:text-rose-700 px-2 py-1 bg-rose-50 rounded-lg shrink-0 transition-colors"
                >
                  Reset
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ─── MAIN MARKETPLACE GRIDS MATRIX ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-5">
        <div className="flex items-center justify-between mb-4 px-0.5">
          <p className="text-xs font-bold text-slate-400">
            Showing{" "}
            <span className="text-[#0F172A] font-black">
              {filteredDataset.length}
            </span>{" "}
            active allocations in Tricity grid
          </p>
        </div>

        {/* Empty States Handling */}
        {filteredDataset.length === 0 && (
          <div className="w-full bg-white rounded-2xl border p-12 text-center max-w-md mx-auto mt-10">
            <Filter className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-slate-800">
              No matching roommates found
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Try resetting the selection filters or look in a nearby sector.
            </p>
          </div>
        )}

        {/* Improved Compact Fluid Grid Layout */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredDataset.map((user) => (
            <Link
              href={`/find-roommate/${user.slug}`}
              key={user.id}
              className="bg-white rounded-xl border border-slate-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.01)] hover:shadow-[0_8px_24px_-6px_rgba(0,0,0,0.06)] transition-all duration-300 flex flex-col overflow-hidden group hover:translate-y-[-2px]"
            >
              {/* Profile Top Layer Segment */}
              <div className="bg-gradient-to-b from-[#EEF2FF]/40 to-white p-3 pt-4 flex flex-col items-center relative text-center">
                {/* Real-time Status Light */}
                <div className="absolute top-2.5 left-2.5 flex items-center gap-1 bg-white/80 backdrop-blur-xs px-1.5 py-0.5 rounded-md border border-slate-100">
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${user.isOnline ? "bg-emerald-500 animate-pulse" : "bg-slate-300"}`}
                  />
                  <span className="text-[8px] font-black tracking-wide text-slate-500 uppercase">
                    {user.isOnline ? "Live" : "Away"}
                  </span>
                </div>

                {/* Verified Core Badge Tag */}
                {user.isVerified && (
                  <div className="absolute top-2.5 right-2.5 bg-blue-50 p-1 rounded-md border border-blue-100/50">
                    <CheckCircle2 className="w-3 h-3 text-[#4161DF] fill-[#4161DF] stroke-white" />
                  </div>
                )}

                {/* Rounded Avatar Shell */}
                <div className="w-13 h-13 rounded-full ring-2 ring-blue-50/60 overflow-hidden mb-2 shadow-inner bg-slate-50">
                  <img
                    src={user.imageUrl}
                    alt={user.name}
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                  />
                </div>

                <h2 className="text-xs+ font-black text-[#0F172A] tracking-tight group-hover:text-[#4161DF] transition-colors line-clamp-1">
                  {user.name}, {user.age}{" "}
                  <span className="text-[10px] font-bold text-slate-400">
                    ({user.gender[0]})
                  </span>
                </h2>

                <p className="text-[10px] font-semibold text-slate-400 flex items-center gap-0.5 mt-0.5 max-w-full">
                  <Briefcase className="w-2.5 h-2.5 text-slate-300" />{" "}
                  <span className="line-clamp-1">{user.profession}</span>
                </p>
              </div>

              {/* Data payload summary box */}
              <div className="p-3 pt-0 flex-1 flex flex-col justify-between bg-white">
                <div className="space-y-2.5">
                  <div className="bg-slate-50/80 border border-slate-100/60 p-2 rounded-lg">
                    <span className="block text-[8px] font-extrabold uppercase text-slate-400 tracking-wider">
                      {activeTab === "have-room"
                        ? "Shared Inventory"
                        : "Tenant Requirement"}
                    </span>
                    <p className="text-[10px] font-bold text-slate-700 mt-0.5 line-clamp-1 leading-snug tracking-tight">
                      {user.roomDetails}
                    </p>
                  </div>

                  {/* Pricing and Location Alignment */}
                  <div className="flex items-center justify-between text-[10px] px-0.5">
                    <span className="text-slate-500 font-bold flex items-center gap-0.5 truncate max-w-[65%]">
                      <MapPin className="w-3 h-3 text-[#4161DF] shrink-0" />{" "}
                      <span className="truncate">{user.location}</span>
                    </span>
                    <span className="price text-[#4161DF] bg-blue-50/80 px-1.5 py-0.5 rounded border border-blue-100/30 shrink-0">
                      {user.budget}
                    </span>
                  </div>

                  {/* Micro Chips Tag Array Layer */}
                  <div className="flex flex-wrap gap-1 pt-0.5">
                    {user.tags.slice(0, 2).map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-[8px] font-extrabold px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded border border-slate-200/30"
                      >
                        {tag}
                      </span>
                    ))}
                    {user.tags.length > 2 && (
                      <span className="text-[8px] font-bold px-1 bg-slate-50 text-slate-400 rounded">
                        +{user.tags.length - 2}
                      </span>
                    )}
                  </div>
                </div>

                {/* Micro Action Integration - Let's Talk CTA */}
                <div className="mt-3">
                  <div className="w-full py-1.5 border border-slate-100 hover:border-[#4161DF] text-slate-600 group-hover:bg-[#4161DF] group-hover:text-white group-hover:border-[#4161DF] transition-all duration-300 rounded-lg text-[10px] font-black flex items-center justify-center gap-1 shadow-2xs active:scale-[0.98]">
                    <MessageSquare className="w-3 h-3 group-hover:rotate-6 transition-transform" />
                    <span>Let's Talk</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── DYNAMIC EXTRA FILTERS SLIDEOUT OVERLAY MODAL ─── */}
      {showFiltersModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex justify-end transition-opacity animate-fade-in">
          <div className="bg-white w-full max-w-xs h-full p-5 flex flex-col justify-between shadow-2xl animate-slide-left">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-sm font-black text-[#0F172A] flex items-center gap-1.5">
                  <Filter className="w-3.5 h-3.5 text-[#4161DF]" /> Filter
                  Parameters
                </h3>
                <button
                  onClick={() => setShowFiltersModal(false)}
                  className="p-1 hover:bg-slate-50 rounded-lg border text-slate-400"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Extended Filter Groups */}
              <div className="mt-4 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Lifestyle Choice
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {["All", "Veg", "Non-Veg"].map((d) => (
                      <button
                        key={d}
                        onClick={() => setSelectedDiet(d)}
                        className={`py-1.5 rounded-lg text-xs font-bold border transition-all ${selectedDiet === d ? "border-[#4161DF] bg-blue-50 text-[#4161DF]" : "border-slate-100 text-slate-600 bg-slate-50/50"}`}
                      >
                        {d === "All" ? "Any Diet" : d}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Tricity Regional Hotspots
                  </label>
                  <div className="flex flex-wrap gap-1">
                    {["Mohali", "Chandigarh", "Zirakpur", "Panchkula"].map(
                      (loc) => (
                        <button
                          key={loc}
                          onClick={() => setSearchQuery(loc)}
                          className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border transition-all ${searchQuery.toLowerCase() === loc.toLowerCase() ? "bg-slate-950 text-white border-slate-950" : "bg-white text-slate-600 border-slate-200"}`}
                        >
                          {loc}
                        </button>
                      ),
                    )}
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowFiltersModal(false)}
              className="w-full py-2 bg-[#4161DF] hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm shadow-blue-100"
            >
              Apply Filter Adjustments
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

export default function FindRoommatePage() {
  return (
    <Suspense
      fallback={
        <div className="p-12 text-center text-xs font-bold text-slate-400 tracking-wide">
          Assembling Marketplace Node Elements...
        </div>
      }
    >
      <MarketplaceContent />
    </Suspense>
  );
}

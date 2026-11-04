"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  BadgeIndianRupee,
  BedDouble,
  Building2,
  ChevronDown,
  MapPin,
  Search,
  ShieldCheck,
  Sparkles,
  Wallet,
} from "lucide-react";

import { SearchFilters, parseSearchQuery } from "./SearchBar";
import { getApiUrl } from "../services/propertiesApi";
import { selectIsAuthenticated } from "@/store/authSlice";

/* ───────────────────────── Types ───────────────────────── */

interface HeroProps {
  setFilter: React.Dispatch<React.SetStateAction<SearchFilters>>;
}

interface HeroStats {
  properties: number;
  projects: number;
  cities: number;
}

type Mode = "Sale" | "Rent" | "Sell";

interface Option<T = string> {
  label: string;
  value: T;
}

interface BudgetOption {
  label: string;
  min?: number;
  max?: number;
}

/* ───────────────────────── Static data ───────────────────────── */

const CITIES = ["Chandigarh", "Panchkula", "Mohali", "Kharar", "Zirakpur"];

const PROPERTY_TYPES: Option[] = [
  { label: "All types", value: "" },
  { label: "Apartment / Flat", value: "Apartment/Flat" },
  { label: "House / Villa", value: "House/Villa" },
  { label: "PG / Hostel", value: "PG/Hostel" },
  { label: "Office", value: "Office" },
  { label: "Shop / Showroom", value: "Shop/Showroom" },
];

const COMMERCIAL = ["Office", "Shop/Showroom"];

const BEDROOMS: Option<number | undefined>[] = [
  { label: "Any BHK", value: undefined },
  { label: "1 BHK", value: 1 },
  { label: "2 BHK", value: 2 },
  { label: "3 BHK", value: 3 },
  { label: "4+ BHK", value: 4 },
];

const BUDGETS: Record<"Sale" | "Rent", BudgetOption[]> = {
  Sale: [
    { label: "Any budget" },
    { label: "Under ₹25 Lakh", max: 2_500_000 },
    { label: "₹25L – ₹50L", min: 2_500_000, max: 5_000_000 },
    { label: "₹50L – ₹1 Cr", min: 5_000_000, max: 10_000_000 },
    { label: "₹1 Cr – ₹2 Cr", min: 10_000_000, max: 20_000_000 },
    { label: "₹2 Cr+", min: 20_000_000 },
  ],
  Rent: [
    { label: "Any budget" },
    { label: "Under ₹10,000", max: 10_000 },
    { label: "₹10K – ₹20K", min: 10_000, max: 20_000 },
    { label: "₹20K – ₹40K", min: 20_000, max: 40_000 },
    { label: "₹40K – ₹75K", min: 40_000, max: 75_000 },
    { label: "₹75K+", min: 75_000 },
  ],
};

const QUICK_SEARCHES: { label: string; query: string }[] = [
  { label: "2 BHK for rent in Mohali", query: "2bhk rent mohali" },
  { label: "3 BHK flats in Chandigarh", query: "3bhk flat sale chandigarh" },
  { label: "PG in Kharar", query: "pg rent kharar" },
  { label: "Villas in Panchkula", query: "villa sale panchkula" },
  { label: "Office space in Zirakpur", query: "office rent zirakpur" },
];

const TRUST_POINTS = [
  { icon: ShieldCheck, text: "Verified listings" },
  { icon: BadgeIndianRupee, text: "Zero hidden fees" },
  { icon: Sparkles, text: "Fresh, active properties" },
];

const FALLBACK_STATS: HeroStats = { properties: 181, projects: 3, cities: 5 };

/* ───────────────────────── Helpers ───────────────────────── */

async function fetchHeroStats(): Promise<HeroStats> {
  const response = await fetch(`${getApiUrl()}/properties/stats/hero`, {
    cache: "no-store",
  });
  if (!response.ok) throw new Error("Failed to fetch hero stats");
  const result = await response.json();
  return result.data;
}

/**
 * Filter cell. Cells sit inside one joined bar (1px gaps act as dividers),
 * so focus is drawn as an inset ring to avoid being clipped.
 * Native <select> keeps mobile UX great.
 */
const Field: React.FC<{
  label: string;
  icon: React.ReactNode;
  disabled?: boolean;
  children: React.ReactNode;
}> = ({ label, icon, disabled, children }) => (
  <label
    className={`group relative flex min-w-0 flex-col gap-0.5 px-3 py-2.5 transition-colors focus-within:z-10 focus-within:ring-2 focus-within:ring-inset focus-within:ring-[#4161df]/50 sm:px-4 ${
      disabled ? "bg-slate-50" : "bg-white hover:bg-slate-50"
    }`}
  >
    <span className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
      <span className="text-[#4161df]">{icon}</span>
      {label}
    </span>
    {children}
    <ChevronDown className="pointer-events-none absolute bottom-3.5 right-3 h-4 w-4 text-slate-400 transition-colors group-focus-within:text-[#4161df]" />
  </label>
);

// text-base on mobile prevents iOS Safari from zooming the page on focus
const selectClass =
  "w-full truncate appearance-none bg-transparent pr-6 text-base font-semibold text-slate-900 focus:outline-none cursor-pointer sm:text-sm";

const chipBase =
  "shrink-0 rounded-full border border-white/30 bg-black/30 px-4 py-1.5 text-xs font-medium text-white backdrop-blur-md transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 sm:text-sm";

/* ───────────────────────── Component ───────────────────────── */

const Hero: React.FC<HeroProps> = ({ setFilter }) => {
  const router = useRouter();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const reduceMotion = useReducedMotion();

  // live stats
  const [stats, setStats] = useState<HeroStats | null>(null);
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const data = await fetchHeroStats();
        if (mounted) setStats(data);
      } catch {
        /* keep fallback */
      }
    };
    load();
    const id = setInterval(load, 60_000);
    return () => {
      mounted = false;
      clearInterval(id);
    };
  }, []);
  const display = stats || FALLBACK_STATS;

  // search state
  const [mode, setMode] = useState<Mode>("Sale");
  const [city, setCity] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [bedrooms, setBedrooms] = useState<number | undefined>(undefined);
  const [budgetIdx, setBudgetIdx] = useState(0);
  const [smartQuery, setSmartQuery] = useState("");

  const activeDeal: "Sale" | "Rent" = mode === "Rent" ? "Rent" : "Sale";
  const budgets = BUDGETS[activeDeal];
  const showBedrooms =
    !COMMERCIAL.includes(propertyType) && propertyType !== "PG/Hostel";

  const handleModeChange = (next: Mode) => {
    if (next === "Sell") {
      router.push(isAuthenticated ? "/add-property" : "/login");
      return;
    }
    setMode(next);
    setBudgetIdx(0); // budget ranges differ between buy & rent
  };

  const runSearch = useCallback(
    (e?: React.FormEvent) => {
      e?.preventDefault();

      // Free-text takes the natural-language parser, dropdowns refine on top.
      const parsed: SearchFilters = smartQuery.trim()
        ? parseSearchQuery(smartQuery)
        : { query: "" };

      const budget = budgets[budgetIdx];
      const filters: SearchFilters = {
        ...parsed,
        deal: activeDeal,
        ...(city ? { city: city.toLowerCase() } : {}),
        ...(propertyType
          ? {
              propertyCategory: propertyType,
              type: COMMERCIAL.includes(propertyType)
                ? "Commercial"
                : "Residential",
            }
          : {}),
        ...(showBedrooms && bedrooms ? { bedrooms } : {}),
        ...(budget?.min !== undefined ? { minPrice: budget.min } : {}),
        ...(budget?.max !== undefined ? { maxPrice: budget.max } : {}),
      };

      // human readable query so the results header / API text search still works
      if (!filters.query) {
        filters.query = [
          bedrooms && showBedrooms ? `${bedrooms}BHK` : "",
          propertyType.replace("/", " "),
          activeDeal === "Rent" ? "rent" : "sale",
          city,
        ]
          .filter(Boolean)
          .join(" ");
      }

      setFilter(filters);

      // bring results into view on mobile / short screens
      requestAnimationFrame(() => {
        document
          .getElementById("search-results")
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    },
    [
      smartQuery,
      budgets,
      budgetIdx,
      activeDeal,
      city,
      propertyType,
      bedrooms,
      showBedrooms,
      setFilter,
    ],
  );

  const applyQuickSearch = (q: string) => {
    setSmartQuery(q);
    // Sync the Buy/Rent tab so the search button uses the same deal type.
    const lower = q.toLowerCase();
    if (/\b(rent|kiraya|rental|lease)\b/i.test(lower) || lower.includes("pg")) {
      setMode("Rent");
    } else if (/\b(sale|buy|purchase|sell|ownership)\b/i.test(lower)) {
      setMode("Sale");
    }
    setFilter(parseSearchQuery(q));
  };

  const tabs = useMemo(
    () => [
      { id: "Sale" as Mode, label: "Buy" },
      { id: "Rent" as Mode, label: "Rent" },
      { id: "Sell" as Mode, label: "Sell / List" },
    ],
    [],
  );

  const SEARCH_PLACEHOLDER: Record<Mode, string> = {
    Sale: 'Try "3BHK flat in Sector 70 Mohali under ₹1.2 Cr"',
    Rent: 'Try "3BHK near IT Park Chandigarh under ₹40,000"',
    Sell: 'Try "Sell your property in Tricity"',
  };
  const searchPlaceholder = SEARCH_PLACEHOLDER[mode];

  const statItems = [
    { value: display.properties, label: "Verified listings" },
    { value: display.projects, label: "Major projects" },
    { value: display.cities, label: "Cities covered" },
  ];

  return (
    <section className="relative isolate overflow-hidden bg-slate-900">
      {/* ───────── Background image + overlay (content sits ON TOP of it) ───────── */}
      <Image
        src="/hero-image.jpg"
        alt=""
        fill
        sizes="100vw"
        priority
        className="-z-20 object-cover object-center"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />

      {/* ───────── Content ───────── */}
      <div className="mx-auto flex min-h-[520px] max-w-7xl flex-col items-center px-4 pb-8 pt-10 text-center sm:px-6 sm:pb-10 sm:pt-14 lg:min-h-[640px] lg:justify-center lg:px-8 lg:pb-14 lg:pt-18">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full"
        >
          {/* Headline */}

          {/* <h1 className="mx-auto max-w-5xl text-balance font-heading text-3xl font-extrabold leading-[1.1] tracking-tight text-white drop-shadow-sm sm:text-4xl md:text-5xl lg:text-6xl">
     Tricity's
Most Helpful
Real Estate Partner
          </h1> */}

          <h1 className="mx-auto max-w-5xl text-balance font-heading text-3xl font-extrabold leading-[1.1] tracking-tight text-white drop-shadow-sm sm:text-4xl md:text-5xl lg:text-6xl">
            Find your dream home in Chandigarh, Mohali &amp; Panchkula
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-white/90 drop-shadow-sm sm:mt-5 sm:text-lg">
            Buy, rent or list verified properties across the Tricity. Fresh
            listings daily, no spam, zero hidden fees.
          </p>

          {/* Trust points */}
          <ul className="mt-6 flex flex-wrap justify-center gap-x-2 gap-y-2 sm:gap-x-5 sm:gap-y-3">
            {TRUST_POINTS.map((tp) => (
              <li
                key={tp.text}
                className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 backdrop-blur-sm text-xs font-semibold text-white sm:gap-2.5 sm:px-4 sm:text-sm"
              >
                <tp.icon className="h-4 w-4 text-white" aria-hidden="true" />
                {tp.text}
              </li>
            ))}
          </ul>

          {/* ───────── Search card ───────── */}
          <form
            onSubmit={runSearch}
            className="mx-auto mt-8 w-full max-w-4xl rounded-2xl bg-white p-4 text-left shadow-2xl shadow-slate-900/30 sm:mt-10 sm:p-5"
          >
            {/* tabs */}
            <div
              role="tablist"
              aria-label="What are you looking for"
              className="mb-4 flex w-full gap-1 rounded-xl bg-slate-100 p-1 sm:inline-flex sm:w-auto"
            >
              {tabs.map((t) => {
                const active = mode === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => handleModeChange(t.id)}
                    className={`flex-1 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4161df]/60 sm:flex-none sm:px-5 ${
                      active
                        ? "bg-white text-[#4161df] shadow-sm ring-1 ring-slate-200"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {t.label}
                  </button>
                );
              })}
            </div>

            {/* smart search input */}
            <div className="relative mb-3">
              <Search
                className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#4161df]"
                aria-hidden="true"
              />
              <input
                type="search"
                inputMode="search"
                enterKeyHint="search"
                autoComplete="off"
                autoCorrect="off"
                value={smartQuery}
                onChange={(e) => setSmartQuery(e.target.value)}
                placeholder={searchPlaceholder}
                aria-label="Search properties"
                className="w-full text-ellipsis rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-12 pr-16 text-base text-slate-900 transition-colors placeholder:text-slate-400 hover:border-slate-300 focus:border-[#4161df] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#4161df]/15 [&::-webkit-search-cancel-button]:hidden"
              />
              {smartQuery && (
                <button
                  type="button"
                  onClick={() => setSmartQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md px-2 py-1 text-xs font-medium text-slate-500 transition-colors hover:bg-slate-200/70 hover:text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4161df]/50"
                  aria-label="Clear search"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Filters + CTA */}
            <div className="flex flex-col gap-3 lg:flex-row lg:items-stretch">
              <div className="grid flex-1 grid-cols-2 gap-px overflow-hidden rounded-xl border border-slate-200 bg-slate-200 lg:grid-cols-4">
                <Field label="City" icon={<MapPin className="h-3.5 w-3.5" />}>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className={selectClass}
                    aria-label="City"
                  >
                    <option value="">All Tricity</option>
                    {CITIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field
                  label="Property type"
                  icon={<Building2 className="h-3.5 w-3.5" />}
                >
                  <select
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value)}
                    className={selectClass}
                    aria-label="Property type"
                  >
                    {PROPERTY_TYPES.map((p) => (
                      <option key={p.value} value={p.value}>
                        {p.label}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field
                  label="Bedrooms"
                  icon={<BedDouble className="h-3.5 w-3.5" />}
                  disabled={!showBedrooms}
                >
                  <select
                    value={showBedrooms ? (bedrooms ?? "") : ""}
                    onChange={(e) =>
                      setBedrooms(
                        e.target.value ? Number(e.target.value) : undefined,
                      )
                    }
                    disabled={!showBedrooms}
                    className={`${selectClass} disabled:cursor-not-allowed disabled:opacity-50`}
                    aria-label="Bedrooms"
                  >
                    {BEDROOMS.map((b) => (
                      <option key={b.label} value={b.value ?? ""}>
                        {b.label}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="Budget" icon={<Wallet className="h-3.5 w-3.5" />}>
                  <select
                    value={budgetIdx}
                    onChange={(e) => setBudgetIdx(Number(e.target.value))}
                    className={selectClass}
                    aria-label="Budget"
                  >
                    {budgets.map((b, i) => (
                      <option key={b.label} value={i}>
                        {b.label}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>

              <button
                type="submit"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#4161df] px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-[#4161df]/30 transition-colors hover:bg-[#3654cc] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4161df] focus-visible:ring-offset-2 active:bg-[#3654cc] lg:w-auto"
              >
                <Search className="h-5 w-5" aria-hidden="true" />
                {mode === "Rent" ? "Search rentals" : "Search properties"}
              </button>
            </div>
          </form>

          {/* Quick searches: one scrolling row on mobile, wrapped on desktop */}
          <div className="-mx-4 mt-6 flex items-center gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:justify-center sm:overflow-visible sm:px-0 [&::-webkit-scrollbar]:hidden">
            <span className="shrink-0 text-xs font-medium text-white/90 sm:text-sm">
              Popular:
            </span>
            {QUICK_SEARCHES.map((q) => (
              <button
                key={q.query}
                type="button"
                onClick={() => applyQuickSearch(q.query)}
                className={`${chipBase} whitespace-nowrap`}
              >
                {q.label}
              </button>
            ))}
          </div>

          {/* City quick links: scrollable row on mobile, wrapped on desktop */}
          <nav
            aria-label="Browse by city"
            className="-mx-4 mt-6 flex items-center gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:mt-8 sm:flex-wrap sm:justify-center sm:overflow-visible sm:px-0"
          >
            <span className="mr-1 shrink-0 whitespace-nowrap text-xs font-medium text-white/90 sm:text-sm">
              Browse by city:
            </span>
            {CITIES.map((c) => (
              <Link
                key={c}
                href={`/properties/${c.toLowerCase()}`}
                className={`${chipBase} inline-flex items-center gap-1.5 whitespace-nowrap`}
              >
                <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                {c}
              </Link>
            ))}
            <Link
              href="/properties"
              className="group inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold text-white underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 sm:text-sm"
            >
              View all
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </nav>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { HiLocationMarker } from "react-icons/hi";

// ── Type definitions matching the advanced search payload ──
export interface SearchFilters {
  query: string;
  bedrooms?: number;
  deal?: string;
  type?: string;
  propertyCategory?: string;
  maxPrice?: number;
  minPrice?: number;
  city?: string;
  state?: string;
  country?: string;
  landmark?: string;
}

interface SearchBarProps {
  onSearch: (filters: SearchFilters) => void;
}

// ── Levenshtein Distance (edit-distance) ──
function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  // Use two-row optimization for O(n) space
  let prev = new Array(n + 1).fill(0);
  let curr = new Array(n + 1).fill(0);

  for (let j = 0; j <= n; j++) prev[j] = j;

  for (let i = 1; i <= m; i++) {
    curr[0] = i;
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      curr[j] = Math.min(
        prev[j] + 1, // deletion
        curr[j - 1] + 1, // insertion
        prev[j - 1] + cost, // substitution
      );
    }
    [prev, curr] = [curr, prev];
  }
  return prev[n];
}

// ── Fuzzy city auto-correct ──
const TRICITY_CITIES = [
  "chandigarh",
  "mohali",
  "panchkula",
  "zirakpur",
  "kharar",
];
const MAX_CITY_TYPO_DISTANCE = 2;

function autoCorrectCity(words: string[]): {
  correctedWords: string[];
  detectedCity: string | undefined;
} {
  let detectedCity: string | undefined;
  const correctedWords = words.map((word) => {
    const lower = word.toLowerCase();
    // If it's already an exact match, capture immediately
    if (TRICITY_CITIES.includes(lower)) {
      detectedCity = lower;
      return word; // keep as-is (preserve casing preference)
    }
    // Fuzzy match
    for (const city of TRICITY_CITIES) {
      if (levenshtein(lower, city) <= MAX_CITY_TYPO_DISTANCE) {
        detectedCity = city;
        return city; // auto-correct to canonical name
      }
    }
    return word;
  });
  return { correctedWords, detectedCity };
}

// ── Price scale factor parser ──
const SCALE_MAP: Record<string, number> = {
  k: 1000,
  thousand: 1000,
  lakh: 100000,
  lacs: 100000,
  lac: 100000,
  crore: 10000000,
  cr: 10000000,
};

// ── Main natural-language parse function (exported for reuse in TopSearchBar) ──
export const parseSearchQuery = (rawQuery: string): SearchFilters => {
  // 1. Strip ₹ symbols and commas from the entire query for price parsing
  const cleaned = rawQuery.replace(/[₹,]/g, "");
  const words = cleaned.split(/\s+/).filter(Boolean);

  // 2. Fuzzy city auto-correct
  const { correctedWords, detectedCity } = autoCorrectCity(words);
  const correctedQuery = correctedWords.join(" ");
  const lowerQuery = correctedQuery.toLowerCase();

  const filters: SearchFilters = { query: correctedQuery };

  // ── 3. Bedrooms: match "2bhk", "3 bhk", "1 bedroom", "2 bed", etc. ──
  const bedroomMatch = lowerQuery.match(
    /(\d+)\s*(bhk|bedroom|bed|bed room|br)\b/i,
  );
  if (bedroomMatch) {
    filters.bedrooms = parseInt(bedroomMatch[1], 10);
  }

  // ── 4. Deal type ──
  if (
    /\b(rent|kiraya|rental|lease)\b/i.test(lowerQuery) ||
    lowerQuery.includes("pg")
  ) {
    filters.deal = "Rent";
  } else if (/\b(sale|buy|purchase|sell|ownership)\b/i.test(lowerQuery)) {
    filters.deal = "Sale";
  }

  // ── 5. Property type (Residential / Commercial) ──
  if (/\b(residential|house|flat|apartment|villa|pg)\b/i.test(lowerQuery)) {
    filters.type = "Residential";
  } else if (
    /\b(commercial|office|shop|showroom|godown|warehouse)\b/i.test(lowerQuery)
  ) {
    filters.type = "Commercial";
  }

  // ── 6. Property Category ──
  if (
    /\b(apartment|flat)\b/i.test(lowerQuery) &&
    !/\b(pg|hostel)\b/i.test(lowerQuery)
  ) {
    filters.propertyCategory = "Apartment/Flat";
  } else if (/\b(house|villa|bungalow|duplex|row house)\b/i.test(lowerQuery)) {
    filters.propertyCategory = "House/Villa";
  } else if (/\b(pg|hostel|paying guest)\b/i.test(lowerQuery)) {
    filters.propertyCategory = "PG/Hostel";
  } else if (
    /(?:office|commercial\s*space|co-working|workspace)\b/i.test(lowerQuery)
  ) {
    filters.propertyCategory = "Office";
  } else if (/\b(shop|showroom|retail|store|outlet)\b/i.test(lowerQuery)) {
    filters.propertyCategory = "Shop/Showroom";
  }

  // ── 7. Price extraction ──
  // Match: (under|below|upto|less than|within|budget)? <number> (scale)?
  const pricePattern =
    /(?:under|below|upto|up to|less than|within|budget|max|maximum)\s*(\d+(?:\.\d+)?)\s*(k|thousand|lakh|lacs|lac|crore|cr)?/i;
  const priceMatch = lowerQuery.match(pricePattern);
  if (priceMatch) {
    let price = parseFloat(priceMatch[1]);
    const scale = priceMatch[2]?.toLowerCase();
    const multiplier = SCALE_MAP[scale] ?? 1;
    price *= multiplier;
    filters.maxPrice = price;
  }

  // ── 8. Landmark extraction ──
  // Capture substrings following contextual prepositions, but exclude validated city tokens
  const landmarkPrepositions =
    /(?:near|around|close\s*to|in\s*|at\s*|opposite|behind|beside|next\s*to|adjacent\s*to|nearby|off)\s+(.+)/i;
  const landmarkMatch = lowerQuery.match(landmarkPrepositions);
  if (landmarkMatch) {
    let raw = landmarkMatch[1].trim();
    // Remove trailing junk like "under 40000", "rent", etc.
    raw = raw
      .replace(/(?:under|below|upto|rent|sale|buy|kiraya).*$/i, "")
      .trim();
    // Filter out city names + common filler words so they don't duplicate into landmark
    const landmarkWords = raw
      .split(/\s+/)
      .filter(
        (w) =>
          w.length > 2 &&
          !TRICITY_CITIES.includes(w) &&
          ![
            "near",
            "around",
            "under",
            "below",
            "for",
            "in",
            "at",
            "the",
            "a",
            "an",
          ].includes(w),
      );
    if (landmarkWords.length > 0) {
      filters.landmark = landmarkWords.join(" ");
    }
  }

  // ── 9. City assignment ──
  if (detectedCity) {
    filters.city = detectedCity;
  } else {
    // Fallback: try exact matching from corrected query
    for (const city of TRICITY_CITIES) {
      if (lowerQuery.includes(city)) {
        filters.city = city;
        break;
      }
    }
  }

  // ── 10. State / Country ──
  const STATES = ["punjab", "haryana", "himachal", "uttarakhand"];
  const COUNTRIES = ["india"];
  for (const s of STATES) {
    if (lowerQuery.includes(s)) {
      filters.state = s;
      break;
    }
  }
  for (const c of COUNTRIES) {
    if (lowerQuery.includes(c)) {
      filters.country = c;
      break;
    }
  }

  return filters;
};

// ── Component ──
const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [value, setValue] = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  }, []);

  const handleClear = useCallback(() => {
    setValue("");
    onSearch({ query: "" });
  }, [onSearch]);

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => {
      const filters = parseSearchQuery(value);
      onSearch(filters);
    }, 400);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [value, onSearch]);

  // Mobile "Search" key on the virtual keyboard should search immediately
  // instead of waiting on the debounce timer.
  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (debounceRef.current) clearTimeout(debounceRef.current);
      onSearch(parseSearchQuery(value));
      // Blur so the mobile keyboard dismisses after search
      (document.activeElement as HTMLElement | null)?.blur();
    },
    [value, onSearch],
  );

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full items-center justify-center px-2 sm:px-0"
    >
      <div className="flex w-full max-w-2xl items-center gap-1.5 xs:gap-2 sm:gap-3 rounded-full border border-border bg-white/70 px-3 py-2 xs:px-3.5 xs:py-2.5 sm:px-4 sm:py-3 md:px-5 md:py-4 shadow-sm backdrop-blur-sm ring-1 ring-transparent focus-within:ring-blue-200 transition-all duration-200">
        <HiLocationMarker className="text-[#4161df] w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 flex-shrink-0" />
        <input
          placeholder="3BHK near IT Park Chandigarh under ₹40,000..."
          type="search"
          inputMode="search"
          enterKeyHint="search"
          autoComplete="off"
          autoCorrect="off"
          value={value}
          onChange={handleChange}
          className="flex-grow bg-transparent text-sm sm:text-base text-foreground focus:outline-none placeholder:text-gray-400 placeholder:truncate min-w-0 [&::-webkit-search-cancel-button]:hidden"
          aria-label="Search properties"
        />
        {value && (
          <button
            type="button"
            aria-label="Clear search"
            className="text-xs text-gray-500 hover:text-gray-700 px-2 sm:px-3 py-2 -my-2 flex-shrink-0 transition-colors"
            onClick={handleClear}
          >
            Clear
          </button>
        )}
      </div>
    </form>
  );
};

export default SearchBar;

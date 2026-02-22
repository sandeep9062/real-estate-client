"use client";

import React, {
  useEffect,
  useState,
  useCallback,
  useRef,
  useMemo,
} from "react";
import { HiLocationMarker } from "react-icons/hi";

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
}

interface SearchBarProps {
  onSearch: (filters: SearchFilters) => void;
}

// Memoized parse function for better performance
const parseSearchQuery = (query: string): SearchFilters => {
  const filters: SearchFilters = { query: query.toLowerCase() };
  const lowerQuery = query.toLowerCase();

  // Parse bedrooms (e.g., "2bhk", "3 bedroom")
  const bedroomMatch = lowerQuery.match(/(\d+)\s*(bhk|bedroom|bed)/i);
  if (bedroomMatch) {
    filters.bedrooms = parseInt(bedroomMatch[1]);
  }

  // Parse deal type (rent/sale)
  if (lowerQuery.includes("rent")) {
    filters.deal = "Rent";
  } else if (lowerQuery.includes("sale") || lowerQuery.includes("buy")) {
    filters.deal = "Sale";
  }

  // Parse property type
  if (lowerQuery.includes("residential")) {
    filters.type = "Residential";
  } else if (lowerQuery.includes("commercial")) {
    filters.type = "Commercial";
  }

  // Parse property category
  if (lowerQuery.includes("apartment") || lowerQuery.includes("flat")) {
    filters.propertyCategory = "Apartment/Flat";
  } else if (lowerQuery.includes("house") || lowerQuery.includes("villa")) {
    filters.propertyCategory = "House/Villa";
  } else if (lowerQuery.includes("land") || lowerQuery.includes("plot")) {
    filters.propertyCategory = "Land/Plot";
  } else if (lowerQuery.includes("office")) {
    filters.propertyCategory = "Office";
  } else if (lowerQuery.includes("shop") || lowerQuery.includes("showroom")) {
    filters.propertyCategory = "Shop/Showroom";
  }

  // Parse price (e.g., "under 50000", "below 1 lakh")
  const priceMatch = lowerQuery.match(
    /(under|below|upto)\s*(\d+(?:\.\d+)?)\s*(lakh|lacs|k|thousand)?/i,
  );
  if (priceMatch) {
    let price = parseFloat(priceMatch[2]);
    const unit = priceMatch[3]?.toLowerCase();
    if (unit === "lakh" || unit === "lacs") {
      price *= 100000;
    } else if (unit === "k" || unit === "thousand") {
      price *= 1000;
    }
    filters.maxPrice = price;
  }

  // Extract location keywords (cities, states)
  const cities = ["chandigarh", "mohali", "panchkula", "zirakpur", "kharar"];
  const states = ["punjab", "haryana"];
  const countries = ["india"];

  for (const city of cities) {
    if (lowerQuery.includes(city)) {
      filters.city = city;
      break;
    }
  }

  for (const state of states) {
    if (lowerQuery.includes(state)) {
      filters.state = state;
      break;
    }
  }

  for (const country of countries) {
    if (lowerQuery.includes(country)) {
      filters.country = country;
      break;
    }
  }

  return filters;
};

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [value, setValue] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      const filters = parseSearchQuery(value);
      onSearch(filters);
    }, 300); // 300ms debounce delay

    return () => {
      clearTimeout(timer);
    };
  }, [value, onSearch]);

  return (
    <div className="flex w-full items-center justify-center">
      <div className="flex w-full max-w-2xl py-4 items-center gap-2 rounded-full border border-border bg-white/70 p-2 shadow-sm backdrop-blur-sm ring-1 ring-transparent focus-within:ring-blue-200">
        <HiLocationMarker className="text-[#4161df]" size={25} />
        <input
          placeholder="Try: '2bhk rent chandigarh under 50000' or '3 bedroom apartment sale'..."
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="flex-grow bg-transparent text-foreground focus:outline-none placeholder:text-gray-400"
        />
        {value && (
          <button
            aria-label="Clear search"
            className="text-xs text-gray-500 hover:text-gray-700 px-2"
            onClick={() => {
              setValue("");
            }}
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;

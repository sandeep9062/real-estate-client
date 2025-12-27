"use client";

import React, { useEffect, useState } from "react";
import { HiLocationMarker } from "react-icons/hi";

interface SearchBarProps {
  onSearch: (searchTerm: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [value, setValue] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(value);
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
          placeholder="Search by title, city, or country..."
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

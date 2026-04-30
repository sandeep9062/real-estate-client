"use client";

import React, { useMemo, useState, useEffect } from "react";
import SearchBar, { SearchFilters } from "../../components/SearchBar";
import { PuffLoader } from "react-spinners";
import PropertyCard from "../../components/PropertyCard";
import { useSelector } from "react-redux";
import { selectIsAuthenticated } from "@/store/authSlice";
import { useGetFavouritesQuery } from "@/services/userApi";
import Link from "next/link";

const Favourites = () => {
  const [filter, setFilter] = useState<SearchFilters>({ query: "" });
  const [mounted, setMounted] = useState(false);

  // Auth State
  const isAuthenticated = useSelector(selectIsAuthenticated);

  // Fetch favourites
  const { data: favourites = [], isLoading, isError } = useGetFavouritesQuery();

  // Filtered favourites
  const filtered = useMemo(() => {
    const q = filter.query.toLowerCase();
    return (favourites || []).filter((property: any) => {
      return (
        property.title?.toLowerCase().includes(q) ||
        property.city?.toLowerCase().includes(q) ||
        property.country?.toLowerCase().includes(q)
      );
    });
  }, [favourites, filter]);

  // Wait for client mount to avoid hydration error
  useEffect(() => {
    setMounted(true);
  }, []);

  // Avoid rendering ANYTHING before hydration completes
  if (!mounted) {
    return (
      <div className="w-full flex justify-center items-center h-[60vh]">
        <PuffLoader size={80} />
      </div>
    );
  }

  // Handle loading
  if (isLoading) {
    return (
      <div className="w-full flex justify-center items-center h-[60vh]">
        <PuffLoader size={80} />
      </div>
    );
  }

  // Handle auth guard
  if (!isAuthenticated) {
    return (
      <div className="w-full flex flex-col items-center justify-center h-[60vh] gap-4">
        <p className="text-gray-700">Please login to view your favourites.</p>
        <Link
          href="/auth"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          Login
        </Link>
      </div>
    );
  }

  // Handle API error
  if (isError) {
    return (
      <div className="w-full flex justify-center items-center py-20">
        <span className="text-red-500 font-medium">
          Failed to load favourite properties.
        </span>
      </div>
    );
  }

  return (
    <div className="w-full pt-20">
      <div className="flex flex-col items-center gap-8 max-w-7xl mx-auto px-4 py-12">
        {/* Heading */}
        <div className="w-full flex flex-col items-center gap-2">
          <h1 className="text-2xl font-semibold">Your Favourite Properties</h1>
          <p className="text-gray-600 text-sm">
            Manage and review properties you have liked.
          </p>
        </div>

        {/* Search */}
        <div className="w-full max-w-[28rem] border border-gray-300 rounded-full flex items-center px-4 gap-3 py-2">
          <SearchBar onSearch={setFilter} />
        </div>

        {/* Empty State */}
        {filtered.length === 0 ? (
          <div className="w-full flex flex-col items-center justify-center py-16 gap-3 bg-gray-50 rounded-xl border">
            <span className="text-gray-700">
              No favourite properties found.
            </span>
            <Link
              href="/properties"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              Browse Properties
            </Link>
          </div>
        ) : (
          <div className="grid w-full grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
            {filtered.map((card: any) => (
              <PropertyCard card={card} key={card._id} isFavourite={true} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Favourites;

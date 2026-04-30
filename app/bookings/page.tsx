"use client";
import React, { useMemo, useState } from "react";
import SearchBar, { SearchFilters } from "../../components/SearchBar";
import { PuffLoader } from "react-spinners";
import PropertyCard from "../../components/PropertyCard";
import { useSelector } from "react-redux";
import { selectIsAuthenticated } from "@/store/authSlice";
import { useGetBookingsQuery } from "@/services/userApi";
import Link from "next/link";

const Bookings = () => {
  const [filter, setFilter] = useState<SearchFilters>({ query: "" });

  const isAuthenticated = useSelector(selectIsAuthenticated);
  const {
    data: bookings,
    isError,
    isLoading: fetchingUser,
  } = useGetBookingsQuery();

  if (isError) {
    return (
      <div className="w-full flex justify-center items-center py-20">
        <span className="text-red-500 font-medium">
          Error while fetching data
        </span>
      </div>
    );
  }

  const filtered = useMemo(() => {
    if (!bookings) {
      return [];
    }
    return bookings.filter(
      (booking: any) =>
        (booking.property.title?.toLowerCase() ?? "").includes(
          filter.query.toLowerCase(),
        ) ||
        (booking.property.city?.toLowerCase() ?? "").includes(
          filter.query.toLowerCase(),
        ) ||
        (booking.property.country?.toLowerCase() ?? "").includes(
          filter.query.toLowerCase(),
        ),
    );
  }, [bookings, filter]);

  if (fetchingUser) {
    return (
      <div className="w-full flex justify-center items-center h-[60vh]">
        <PuffLoader size={80} aria-label="puff-loading" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="w-full flex flex-col items-center justify-center h-[60vh] gap-4">
        <p className="text-gray-700">Please login to view your bookings.</p>
        <Link
          href="/auth"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          Login
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full pt-20">
      <div className="flex flex-col items-center gap-8 max-w-7xl mx-auto px-4 py-12">
        <div className="w-full flex flex-col items-center gap-2">
          <h1 className="text-2xl font-semibold">Your Booked Visits</h1>
          <p className="text-gray-600 text-sm">
            Manage and review properties you have scheduled to visit.
          </p>
        </div>

        <div className="w-full max-w-[28rem] border border-gray-300 rounded-full flex items-center px-4 gap-3 py-2">
          <SearchBar onSearch={setFilter} />
        </div>

        {filtered.length === 0 ? (
          <div className="w-full flex flex-col items-center justify-center py-16 gap-3 bg-gray-50 rounded-xl border">
            <span className="text-gray-700">No bookings found.</span>
            <Link
              href="/properties"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              Browse Properties
            </Link>
          </div>
        ) : (
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
            {filtered.map((booking: any) => (
              <div key={booking._id} className="flex flex-col">
                <PropertyCard card={booking.property} />
                {booking?.date && (
                  <div className="mt-2 text-xl  text-green-600">
                    Visit Date:{" "}
                    <span className="font-bold">{booking.date}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Bookings;

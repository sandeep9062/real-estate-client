"use client";

import React, { useMemo, useState } from "react";
import SearchBar, { SearchFilters } from "@/components/SearchBar";
import { PuffLoader } from "react-spinners";
import Image from "next/image";

import { useSelector } from "react-redux";
import { selectIsAuthenticated, selectUser } from "@/store/authSlice";

import {
  useGetOwnedPropertiesQuery,
  useUpdatePropertyMutation,
} from "@/services/propertiesApi";
import { useGetUserByIdQuery } from "@/services/userApi";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pencil } from "lucide-react";
import { firstImageUrl } from "@/services/leadsApi";
import { toast } from "@/hooks/use-toast";

// Mirrors the listingAvailability enum in backend/models/Property.js
const LISTING_AVAILABILITY_OPTIONS = [
  "Available",
  "Fresh",
  "Under offer",
  "Booked",
  "Sold",
  "Rented",
  "Review Required",
  "Non Available",
];

const ListingsPage = () => {
  const router = useRouter();

  const [filter, setFilter] = useState<SearchFilters>({ query: "" });

  const [editingProperty, setEditingProperty] = useState<any>(null);

  const handleAddPropertyClick = () => {
    if (isAuthenticated) {
      router.push("/add-property");
      setEditingProperty(null);
    } else {
      router.push("/auth");
    }
  };

  const handleEditProperty = (property: any) => {
    if (isAuthenticated) {
      setEditingProperty(property);
      router.push("/add-property?id=" + property._id);
    }
  };

  const handleAvailabilityChange = async (
    propertyId: string,
    newAvailability: string
  ) => {
    try {
      await updateProperty({
        id: propertyId,
        listingAvailability: newAvailability,
      }).unwrap();
      toast.success(`Listing availability updated to "${newAvailability}"`);
    } catch (error) {
      console.error("Failed to update listing availability:", error);
      toast.error("Could not update listing availability. Please try again.");
    }
  };

  const handleToggleActive = async (
    propertyId: string,
    isActive: boolean,
    image: string[]
  ) => {
    try {
      await updateProperty({
        id: propertyId,
        isActive: !isActive,
        image: image || [],
      }).unwrap();
      toast.success(!isActive ? "Listing activated" : "Listing deactivated");
    } catch (error) {
      console.error("Failed to toggle active status:", error);
      toast.error("Could not update listing status. Please try again.");
    }
  };

  // Auth state
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);

  // Fetch user (used for permissions sometimes)
  const { data: userData, isFetching: fetchingUser } = useGetUserByIdQuery(
    user?._id as string,
    { skip: !user?._id },
  );

  // Fetch properties user owns
  const { data, isLoading, isError } = useGetOwnedPropertiesQuery(undefined);

  // Mutation for updating listing availability
  const [updateProperty] = useUpdatePropertyMutation();

  const properties = data || [];

  // Filter logic
  const filtered = useMemo(() => {
    return properties.filter((property: any) => {
      const q = filter.query.toLowerCase();

      return (
        (property.title?.toLowerCase() ?? "").includes(q) ||
        (property.description?.toLowerCase() ?? "").includes(q) ||
        (property.location?.city?.toLowerCase() ?? "").includes(q) ||
        (property.location?.country?.toLowerCase() ?? "").includes(q) ||
        (property.location?.address?.toLowerCase() ?? "").includes(q)
      );
    });
  }, [properties, filter]);

  // Loading
  if (isLoading || fetchingUser) {
    return (
      <div className="w-full flex justify-center items-center h-[60vh]">
        <PuffLoader size={80} aria-label="puff-loading" />
      </div>
    );
  }

  // Error
  if (isError) {
    return (
      <div className="w-full flex justify-center items-center py-20">
        <span className="text-red-500 font-medium">
          Failed to load your properties
        </span>
      </div>
    );
  }

  // Not logged in
  if (!isAuthenticated) {
    return (
      <div className="w-full flex flex-col items-center justify-center h-[60vh] gap-4">
        <p className="text-gray-700">Please login to view your properties.</p>
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
    <div className="w-full pt-6">
      <div className="flex flex-col items-center gap-8 max-w-7xl mx-auto px-4 py-4">
        {/* Header with Logo */}
        <div className="w-full flex flex-col items-center gap-2">
          <div className="h-6 w-px bg-slate-200 mx-1" />
          <h1 className="text-2xl font-semibold text-[#0F172A]">
            My Properties
          </h1>
          <p className="text-gray-600 text-sm">
            Manage and review properties you have listed.
          </p>
        </div>

        {/* Search + Add button row */}
        <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="w-full max-w-[28rem] border border-gray-300 rounded-full flex items-center px-4 gap-3 py-2">
            <SearchBar onSearch={setFilter} />
          </div>
          <button
            onClick={handleAddPropertyClick}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg whitespace-nowrap"
          >
            Add Property
          </button>
        </div>

        {/* Empty */}
        {filtered.length === 0 ? (
          <div className="w-full flex flex-col items-center justify-center py-16 gap-3 bg-gray-50 rounded-xl border">
            <span className="text-gray-700">No properties found.</span>

            <button
              onClick={handleAddPropertyClick}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              Add Property
            </button>
          </div>
        ) : (
          // Property Table
          <div className="w-full overflow-x-auto rounded-xl border border-gray-200">
            <table className="w-full text-sm text-left border-collapse">
              <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                <tr>
                  <th className="px-4 py-3">Image</th>
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3">Location</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3">Listing Availability</th>
                  <th className="px-4 py-3">Active</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((card: any) => (
                  <tr
                    key={card._id}
                    className="border-t border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      {(() => {
                        const img = firstImageUrl(card.image);
                        return (
                          <Link
                            href={`/property/${card.slug}`}
                            className="block relative w-14 h-14 rounded-lg overflow-hidden bg-gray-100 hover:opacity-80 transition-opacity"
                          >
                            {img ? (
                              <Image
                                src={img}
                                alt={card.title || "Property image"}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                                No img
                              </div>
                            )}
                          </Link>
                        );
                      })()}
                    </td>
                    <td className="px-4 py-3 font-medium text-[#0F172A] max-w-[220px] truncate">
                      {card.title}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {[card.location?.city, card.location?.country]
                        .filter(Boolean)
                        .join(", ")}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {card.price ? `Rs.${card.price}` : "-"}
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={card.listingAvailability || "Available"}
                        onChange={(e) =>
                          handleAvailabilityChange(card._id, e.target.value)
                        }
                        className="px-2 py-1.5 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
                      >
                        {LISTING_AVAILABILITY_OPTIONS.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() =>
                          handleToggleActive(card._id, card.isActive, card.image)
                        }
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                          card.isActive ? "bg-green-500" : "bg-gray-300"
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm ${
                            card.isActive ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleEditProperty(card)}
                        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListingsPage;

"use client";

import React, { useMemo, useState } from "react";
import SearchBar, { SearchFilters } from "@/components/SearchBar";
import { PuffLoader } from "react-spinners";
import Image from "next/image";

import { useSelector } from "react-redux";
import { selectIsAuthenticated, selectUser } from "@/store/authSlice";

import AddPropertyModal from "@/components/AddPropertyModal";
import { useGetOwnedPropertiesQuery } from "@/services/propertiesApi";
import { useGetUserByIdQuery } from "@/services/userApi";
import Link from "next/link";
import { useRouter } from "next/navigation";

const MyPropertiesPage = () => {
  const router = useRouter();

  const [filter, setFilter] = useState<SearchFilters>({ query: "" });
  const [modalOpened, setModalOpened] = useState(false);
  const [editingProperty, setEditingProperty] = useState<any>(null);

  const handleAddPropertyClick = () => {
    if (isAuthenticated) {
      setModalOpened(true);
      setEditingProperty(null);
    } else {
      router.push("/auth");
    }
  };

  const handleEditProperty = (property: any) => {
    if (isAuthenticated) {
      setEditingProperty(property);
      setModalOpened(true);
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
                  <th className="px-4 py-3">Status</th>
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
                      <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-gray-100">
                        {card.images?.[0] && (
                          <Image
                            src={card.images[0]}
                            alt={card.title || "Property image"}
                            fill
                            className="object-cover"
                          />
                        )}
                      </div>
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
                      {card.price ? `$${card.price}` : "-"}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          card.status === "available"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {card.status || "N/A"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleEditProperty(card)}
                        className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <AddPropertyModal
        opened={modalOpened}
        setOpened={setModalOpened}
        editingProperty={editingProperty}
      />
    </div>
  );
};

export default MyPropertiesPage;

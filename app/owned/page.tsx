"use client";

import React, { useMemo, useState } from "react";
import SearchBar, { SearchFilters } from "../../components/SearchBar";
import { PuffLoader } from "react-spinners";
import PropertyCard from "@/components/PropertyCard";

import { useSelector } from "react-redux";
import { selectIsAuthenticated, selectUser } from "@/store/authSlice";

import AddPropertyModal from "../../components/AddPropertyModal";
import { useGetOwnedPropertiesQuery } from "@/services/propertiesApi";
import { useGetUserByIdQuery } from "@/services/userApi";
import Link from "next/link";
import { useRouter } from "next/navigation";
const OwnedPropertiesPage = () => {
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

  // console.log(properties,"owned-properties-data")

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
    <div className="w-full">
      <div className="flex flex-col items-center gap-8 max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="w-full flex flex-col items-center gap-2">
          <h1 className="text-2xl font-semibold">Your Owned Properties</h1>
          <p className="text-gray-600 text-sm">
            Manage and review properties you have listed.
          </p>
        </div>

        {/* Search */}
        <div className="w-full max-w-[28rem] border border-gray-300 rounded-full flex items-center px-4 gap-3 py-2">
          <SearchBar onSearch={setFilter} />
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
          // Property Grid
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((card: any) => (
              <PropertyCard
                key={card._id}
                card={card}
                editable={true}
                onEdit={handleEditProperty}
              />
            ))}
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

export default OwnedPropertiesPage;

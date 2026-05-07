"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useSelector } from "react-redux";
import { selectIsAuthenticated } from "@/store/authSlice";
import { useGetRecentlyViewedQuery } from "@/services/userApi";
import PropertyGridSkeleton from "@/components/PropertyGridSkeleton";

const PropertyGrid = dynamic(() => import("@/components/PropertyGrid"), {
  ssr: false,
});

export default function BecauseYouViewedSection() {
  const isAuth = useSelector(selectIsAuthenticated);
  const { data: recent = [], isLoading } = useGetRecentlyViewedQuery(
    undefined,
    {
      skip: !isAuth,
    },
  );

  if (!isAuth) return null;

  if (isLoading) {
    return (
      <section
        className="container mx-auto px-4 py-6"
        aria-busy="true"
        aria-label="Loading your recently viewed listings"
      >
        <PropertyGridSkeleton count={6} columns="three" variant="carousel" />
      </section>
    );
  }

  if (recent.length === 0) return null;

  const first = recent[0];
  const pid = String(first._id || first.id);
  const slug = first.slug || pid;
  const label =
    first.title?.trim() ||
    [first.location?.address, first.location?.city]
      .filter(Boolean)
      .join(", ") ||
    "this listing";

  return (
    <section
      className="container mx-auto px-4 py-6"
      aria-labelledby="because-viewed-heading"
    >
      <h2
        id="because-viewed-heading"
        className="mb-1 text-lg font-semibold text-gray-900"
      >
        Because you viewed{" "}
        <Link
          href={`/property/${slug}`}
          className="text-blue-600 hover:underline"
        >
          {label}
        </Link>
      </h2>
      <p className="mb-4 text-sm text-gray-500">
        Listings you recently opened — continue browsing from here.
      </p>
      <PropertyGrid
        properties={recent.slice(0, 6)}
        columns="three"
        variant="carousel"
      />
    </section>
  );
}

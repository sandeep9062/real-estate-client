"use client";

import Link from "next/link";
import { ArrowRight, Home, PlusCircle } from "lucide-react";

import { PageHeader } from "@/components/agent-dashboard/ui";

export default function AgentDashboardListingsPage() {
  return (
    <div className="max-w-5xl min-w-0">
      <PageHeader
        eyebrow="Listings"
        title="Your properties"
        description="Owned listings live in the main PropertyBulbul workspace. Open it to add a property, edit copy and photos, or pause availability."
      />

      <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
        <Link
          href="/owned"
          className="group flex touch-manipulation flex-col rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#4161df]/30 hover:shadow-md active:scale-[0.99] sm:p-6"
        >
          <span className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-[#4161df]">
            <Home className="h-5 w-5" aria-hidden />
          </span>
          <h2 className="text-lg font-semibold text-gray-900">
            Owned properties
          </h2>
          <p className="mt-2 flex-1 text-sm text-gray-600">
            Search, edit, or remove listings you have already published.
          </p>
          <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[#4161df]">
            Go to owned listings
            <ArrowRight
              className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
              aria-hidden
            />
          </span>
        </Link>

        <Link
          href="/properties"
          className="group flex touch-manipulation flex-col rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#4161df]/30 hover:shadow-md active:scale-[0.99] sm:p-6"
        >
          <span className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <PlusCircle className="h-5 w-5" aria-hidden />
          </span>
          <h2 className="text-lg font-semibold text-gray-900">
            Browse inventory
          </h2>
          <p className="mt-2 flex-1 text-sm text-gray-600">
            Compare pricing and positioning across Tricity before you publish.
          </p>
          <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[#4161df]">
            View all properties
            <ArrowRight
              className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
              aria-hidden
            />
          </span>
        </Link>
      </div>

      <p className="mt-6 rounded-2xl border border-gray-200/80 bg-white p-4 text-sm text-gray-600 shadow-sm sm:mt-8 sm:p-5">
        <strong className="font-semibold text-gray-900">Tip:</strong> use{" "}
        <strong className="font-semibold text-gray-900">Add Property</strong> in
        the site header while logged in to create a new listing quickly.
      </p>
    </div>
  );
}

"use client";

import Link from "next/link";
import { Home, PlusCircle, ArrowRight } from "lucide-react";

export default function AgentDashboardListingsPage() {
  return (
    <div className="max-w-4xl min-w-0">
      <header className="mb-6 sm:mb-8">
        <p className="text-xs font-medium uppercase tracking-wide text-[#4161df] sm:text-sm">
          Listings
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
          Your properties
        </h1>
        <p className="mt-2 max-w-2xl text-pretty text-sm text-gray-600 sm:text-base">
          Owned listings live in the main PropertyBulbul workspace. Open it to
          add a property, edit copy and photos, or pause availability.
        </p>
      </header>

      <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
        <Link
          href="/owned"
          className="flex touch-manipulation flex-col rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-[#4161df]/40 hover:shadow-md active:scale-[0.99] sm:p-6"
        >
          <span className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-lg bg-indigo-50 text-[#4161df]">
            <Home className="h-5 w-5" aria-hidden />
          </span>
          <h2 className="text-lg font-semibold text-gray-900">
            Owned properties
          </h2>
          <p className="mt-2 flex-1 text-sm text-gray-600">
            Search, edit, or remove listings you have already published.
          </p>
          <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-[#4161df]">
            Go to owned listings
            <ArrowRight className="h-4 w-4" aria-hidden />
          </span>
        </Link>

        <Link
          href="/properties"
          className="flex touch-manipulation flex-col rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-[#4161df]/40 hover:shadow-md active:scale-[0.99] sm:p-6"
        >
          <span className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-lg bg-gray-50 text-gray-700">
            <PlusCircle className="h-5 w-5" aria-hidden />
          </span>
          <h2 className="text-lg font-semibold text-gray-900">
            Browse inventory
          </h2>
          <p className="mt-2 flex-1 text-sm text-gray-600">
            Compare pricing and positioning across Tricity before you publish.
          </p>
          <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-[#4161df]">
            View all properties
            <ArrowRight className="h-4 w-4" aria-hidden />
          </span>
        </Link>
      </div>

      <p className="mt-6 text-pretty text-sm text-gray-500 sm:mt-8">
        Tip: use{" "}
        <strong className="font-medium text-gray-700">Add Property</strong> in
        the site header while logged in to create a new listing quickly.
      </p>
    </div>
  );
}

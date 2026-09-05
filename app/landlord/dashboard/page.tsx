"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { ArrowRight, Building2, LifeBuoy, Plus } from "lucide-react";

import { selectIsAuthenticated, selectUser } from "@/store/authSlice";
import { useGetMyLandlordProfileQuery } from "@/services/landlordApi";
import ProfileCompletenessBanner from "@/components/profile/ProfileCompletenessBanner";

export default function LandlordDashboardPage() {
  const router = useRouter();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);
  const canAccess = user?.role === "landlord" || user?.role === "admin";

  // Skip until gated in — avoids a 401 (and its auto-logout) when a signed-out
  // visitor lands here.
  const { data: profileData } = useGetMyLandlordProfileQuery(undefined, {
    skip: !isAuthenticated || !canAccess,
  });

  if (!isAuthenticated || !user) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center gap-4 px-4 pt-[calc(6rem+env(safe-area-inset-top))] text-center sm:pt-24">
        <Building2 className="h-12 w-12 text-[#4161df]" aria-hidden />
        <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl">
          Landlord dashboard
        </h1>
        <p className="max-w-[28ch] text-pretty text-sm text-gray-600 sm:text-base">
          Sign in to manage your properties and landlord profile.
        </p>
        <Link
          href="/login"
          className="inline-flex min-h-[44px] min-w-[120px] items-center justify-center rounded-lg bg-[#4161df] px-6 py-3 text-base font-medium text-white transition hover:bg-[#3759dd]"
        >
          Log in
        </Link>
      </div>
    );
  }

  if (!canAccess) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center gap-4 px-4 pt-[calc(6rem+env(safe-area-inset-top))] text-center sm:pt-24">
        <Building2 className="h-12 w-12 text-gray-400" aria-hidden />
        <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl">
          Landlord dashboard
        </h1>
        <p className="max-w-[34ch] text-pretty text-sm text-gray-600 sm:text-base">
          This area is for registered landlords. If you should have access,
          contact support.
        </p>
        <button
          type="button"
          onClick={() => router.push("/")}
          className="inline-flex min-h-[44px] items-center justify-center rounded-lg border border-gray-300 px-6 py-3 text-base font-medium text-gray-800 transition hover:bg-gray-50"
        >
          Back to home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-[#f6f8fb]">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:py-14">
        {/* Hero */}
        <section className="relative mb-6 overflow-hidden rounded-2xl bg-gradient-to-br from-[#4161df] via-[#4f6ee6] to-[#7c93f2] p-6 text-white shadow-lg shadow-[#4161df]/20 sm:p-8">
          <div
            className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full bg-white/10 blur-2xl"
            aria-hidden
          />
          <span className="inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest backdrop-blur">
            Landlord workspace
          </span>
          <h1 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
            Welcome{user?.name ? `, ${user.name.split(" ")[0]}` : ""} 👋
          </h1>
          <p className="mt-1 text-sm text-white/80 sm:text-base">
            List and manage your rental properties, track interest and grow your
            portfolio on PropertyBulbul.
          </p>
        </section>

        {/* Profile completeness banner (dismissible, non-blocking) */}
        {profileData?.data && (
          <ProfileCompletenessBanner
            role="landlord"
            percentage={profileData.data.profileCompleteness ?? 0}
            editHref="/landlord/dashboard/profile"
          />
        )}

        {/* First property CTA */}
        <section className="grid gap-3 sm:grid-cols-2 sm:gap-4">
          <Link
            href="/owned"
            className="group flex touch-manipulation items-start gap-4 rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#4161df]/40 hover:shadow-md active:scale-[0.99]"
          >
            <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-[#4161df]">
              <Plus className="h-5 w-5" aria-hidden />
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-gray-900">List your first property</p>
              <p className="mt-0.5 text-sm text-gray-600">
                Add and manage the properties you own to start renting or selling.
              </p>
              <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-[#4161df]">
                Go to my properties
                <ArrowRight
                  className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                  aria-hidden
                />
              </span>
            </div>
          </Link>

          <Link
            href="/contact"
            className="group flex touch-manipulation items-start gap-4 rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#4161df]/30 hover:shadow-md active:scale-[0.99]"
          >
            <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-700">
              <LifeBuoy className="h-5 w-5" aria-hidden />
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-gray-900">Help & support</p>
              <p className="mt-0.5 text-sm text-gray-600">
                Questions about listings, documents or payments? Our team can help.
              </p>
              <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-[#4161df]">
                Contact us
                <ArrowRight
                  className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                  aria-hidden
                />
              </span>
            </div>
          </Link>
        </section>
      </div>
    </div>
  );
}
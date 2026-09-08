"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import {
  ArrowRight,
  Building2,
  CalendarDays,
  Eye,
  FileCheck2,
  IndianRupee,
  KeyRound,
  LifeBuoy,
  Plus,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from "lucide-react";

import { selectIsAuthenticated, selectUser } from "@/store/authSlice";
import { useGetMyLandlordProfileQuery } from "@/services/landlordApi";
import { useGetOwnedPropertiesQuery } from "@/services/propertiesApi";
import ProfileCompletenessBanner from "@/components/profile/ProfileCompletenessBanner";

// ──────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────

/** Pick the first usable image URL from a property image field. */
function firstImageUrl(
  image: string | string[] | null | undefined,
): string | null {
  const candidates =
    typeof image === "string"
      ? image.split(",")
      : Array.isArray(image)
        ? image
        : [];
  for (const candidate of candidates) {
    const url = typeof candidate === "string" ? candidate.trim() : "";
    if (url) return url;
  }
  return null;
}

const formatInr = (n: number) => `₹${(Number(n) || 0).toLocaleString("en-IN")}`;

function formatPrice(property: { deal?: string; price?: number }): string {
  const base = formatInr(property.price ?? 0);
  return property.deal === "Rent" ? `${base}/mo` : base;
}

const STATUS_DOT: Record<string, string> = {
  Active: "bg-emerald-500",
  Rented: "bg-sky-500",
  Sold: "bg-violet-500",
  Inactive: "bg-gray-400",
  "Review Required": "bg-amber-500",
};

function StatusBadge({ status }: { status?: string }) {
  if (!status) return null;
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-600">
      <span
        className={`h-1.5 w-1.5 shrink-0 rounded-full ${STATUS_DOT[status] ?? "bg-gray-400"}`}
        aria-hidden
      />
      {status}
    </span>
  );
}

function DealBadge({ deal }: { deal?: string }) {
  if (!deal) return null;
  return (
    <span className="inline-flex items-center gap-1 text-xs font-medium text-[#4161df]">
      {deal === "Rent" ? (
        <KeyRound className="h-3 w-3" aria-hidden />
      ) : (
        <IndianRupee className="h-3 w-3" aria-hidden />
      )}
      {deal === "Rent" ? "For rent" : "For sale"}
    </span>
  );
}

function StatCard({
  icon,
  label,
  value,
  hint,
  dot,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  hint?: string;
  dot: string;
  href?: string;
}) {
  const inner = (
    <div className="flex h-full flex-col justify-between rounded-xl border border-gray-200 bg-white p-4 transition-colors hover:border-gray-300 sm:p-5">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-gray-500">{label}</p>
        <span
          className={`h-1.5 w-1.5 shrink-0 rounded-full ${dot}`}
          aria-hidden
        />
      </div>
      <div className="mt-4 flex items-end justify-between gap-2">
        <p className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-[28px]">
          {value}
        </p>
        <span className="text-gray-300">{icon}</span>
      </div>
      {hint && <p className="mt-1.5 truncate text-xs text-gray-500">{hint}</p>}
    </div>
  );
  return href ? (
    <Link href={href} className="block touch-manipulation">
      {inner}
    </Link>
  ) : (
    inner
  );
}

function DashboardSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading dashboard">
      <div className="mx-auto max-w-6xl">
        <div className="h-44 animate-pulse rounded-2xl bg-gray-100 sm:h-48" />
        <div className="mt-4 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-24 animate-pulse rounded-xl border border-gray-200 bg-white"
            />
          ))}
        </div>
        <div className="mt-4 grid gap-4 lg:grid-cols-3">
          <div className="h-72 animate-pulse rounded-2xl border border-gray-200 bg-white lg:col-span-2" />
          <div className="h-72 animate-pulse rounded-2xl border border-gray-200 bg-white" />
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────
// Page
// ──────────────────────────────────────────────

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
  const { data: ownedData, isFetching: fetchingProperties } =
    useGetOwnedPropertiesQuery(undefined, {
      skip: !isAuthenticated || !canAccess,
    });

  const profile = profileData?.data;
  const properties = useMemo(() => ownedData ?? [], [ownedData]);

  const stats = useMemo(() => {
    const total = properties.length;
    const active = properties.filter((p: any) => p.status === "Active").length;
    const closed = properties.filter(
      (p: any) => p.status === "Sold" || p.status === "Rented",
    ).length;
    return { total, active, closed };
  }, [properties]);

  const memberSince = useMemo(() => {
    const raw = profile?.memberSince || profile?.createdAt;
    if (!raw) return null;
    try {
      return new Date(raw).toLocaleDateString("en-IN", {
        month: "short",
        year: "numeric",
      });
    } catch {
      return null;
    }
  }, [profile?.memberSince, profile?.createdAt]);

  const initials = (user?.name ?? "L")
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const recentProperties = useMemo(
    () =>
      [...properties]
        .sort(
          (a: any, b: any) =>
            new Date(b.createdAt ?? 0).getTime() -
            new Date(a.createdAt ?? 0).getTime(),
        )
        .slice(0, 4),
    [properties],
  );

  const completeness = profile?.profileCompleteness ?? 0;

  // ── Signed-out gate ──
  if (!isAuthenticated || !user) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center gap-4 px-4 pt-[calc(6rem+env(safe-area-inset-top))] text-center sm:pt-24">
        <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[#4161df]/10">
          <Building2 className="h-7 w-7 text-[#4161df]" aria-hidden />
        </span>
        <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl">
          Landlord dashboard
        </h1>
        <p className="max-w-[28ch] text-pretty text-sm text-gray-600 sm:text-base">
          Sign in to manage your properties and landlord profile.
        </p>
        <Link
          href="/login"
          className="inline-flex min-h-[44px] min-w-[120px] items-center justify-center rounded-xl bg-[#4161df] px-6 py-3 text-base font-semibold text-white transition hover:bg-[#3654cc] active:scale-[0.98]"
        >
          Log in
        </Link>
      </div>
    );
  }

  // ── Wrong-role gate ──
  if (!canAccess) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center gap-4 px-4 pt-[calc(6rem+env(safe-area-inset-top))] text-center sm:pt-24">
        <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100">
          <ShieldCheck className="h-7 w-7 text-gray-400" aria-hidden />
        </span>
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
          className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-gray-300 bg-white px-6 py-3 text-base font-medium text-gray-800 transition hover:bg-gray-50 active:scale-[0.98]"
        >
          Back to home
        </button>
      </div>
    );
  }

  // ── Loading (first visit, nothing cached yet) ──
  if (!profileData && fetchingProperties && properties.length === 0) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="mx-auto max-w-7xl">
      {/* ── Hero ── */}
      <section className="relative mb-8 overflow-hidden rounded-2xl bg-[#2c3f8f] p-6 text-white sm:p-8">
        {/* faint blueprint grid — the one deliberate decorative moment */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
          aria-hidden
        />
        <svg
          className="pointer-events-none absolute -right-10 -top-10 h-44 w-44 text-white/10 sm:h-52 sm:w-52"
          viewBox="0 0 100 100"
          fill="none"
          aria-hidden
        >
          <circle
            cx="50"
            cy="50"
            r="46"
            stroke="currentColor"
            strokeWidth="1"
          />
          <circle
            cx="50"
            cy="50"
            r="28"
            stroke="currentColor"
            strokeWidth="1"
          />
          <line
            x1="50"
            y1="2"
            x2="50"
            y2="98"
            stroke="currentColor"
            strokeWidth="1"
          />
          <line
            x1="2"
            y1="50"
            x2="98"
            y2="50"
            stroke="currentColor"
            strokeWidth="1"
          />
        </svg>

        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            {user?.image ? (
              <Image
                src={user.image}
                alt={user.name ?? "Your Image"}
                width={60}
                height={60}
                className="h-14 w-14 rounded-2xl object-cover ring-1 ring-white/25 sm:h-[60px] sm:w-[60px]"
              />
            ) : (
              <span className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-lg font-semibold ring-1 ring-white/20 sm:h-[60px] sm:w-[60px]">
                {initials}
              </span>
            )}
            <div className="min-w-0">
              <h1 className="truncate text-2xl font-semibold tracking-tight sm:text-3xl">
                Welcome{user?.name ? `, ${user.name.split(" ")[0]}` : ""}
              </h1>
              <p className="mt-1 text-sm text-white/70">
                Here's how your portfolio is doing.
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-white/75 sm:text-sm">
                {(profile?.isVerified || profile?.identityVerified) && (
                  <span className="inline-flex items-center gap-1.5">
                    <ShieldCheck
                      className="h-3.5 w-3.5 text-emerald-300"
                      aria-hidden
                    />
                    Verified landlord
                  </span>
                )}
                {memberSince && (
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarDays className="h-3.5 w-3.5" aria-hidden />
                    Member since {memberSince}
                  </span>
                )}
                {profile?.rating ? (
                  <span className="inline-flex items-center gap-1">
                    ★ {profile.rating.toFixed(1)}
                    {profile.totalReviews
                      ? ` (${profile.totalReviews} reviews)`
                      : ""}
                  </span>
                ) : null}
              </div>
            </div>
          </div>

          <div className="flex shrink-0 flex-wrap gap-2.5">
            <button
              type="button"
              onClick={() => router.push("/landlord/dashboard/add-property")}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-[#2c3f8f] transition hover:bg-white/90 active:scale-[0.98]"
            >
              <Plus className="h-4 w-4" aria-hidden />
              Add property
            </button>
            <Link
              href="/landlord/dashboard/profile"
              className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-white/25 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10 active:scale-[0.98]"
            >
              Edit profile
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="mb-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <StatCard
          icon={<Building2 className="h-5 w-5" aria-hidden />}
          label="Properties"
          value={stats.total}
          hint={stats.total === 0 ? "Add your first one" : "In your portfolio"}
          dot="bg-[#4161df]"
          href="/owned"
        />
        <StatCard
          icon={<Eye className="h-5 w-5" aria-hidden />}
          label="Active listings"
          value={stats.active}
          hint="Visible to renters & buyers"
          dot="bg-emerald-500"
          href="/owned"
        />
        <StatCard
          icon={<KeyRound className="h-5 w-5" aria-hidden />}
          label="Rented / sold"
          value={stats.closed}
          hint="Closed deals"
          dot="bg-violet-500"
          href="/owned"
        />
        <StatCard
          icon={<TrendingUp className="h-5 w-5" aria-hidden />}
          label="Profile strength"
          value={`${completeness}%`}
          hint={completeness >= 100 ? "Complete" : "Keep going"}
          dot="bg-amber-500"
          href="/landlord/dashboard/profile"
        />
      </section>

      {/* ── Profile completeness banner (dismissible, non-blocking) ── */}
      {profile && (
        <ProfileCompletenessBanner
          role="landlord"
          percentage={completeness}
          editHref="/landlord/dashboard/profile"
        />
      )}

      {/* ── Main grid ── */}
      <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
        {/* ── Recent listings ── */}
        <section
          className="rounded-2xl border border-gray-200 bg-white lg:col-span-2"
          aria-label="Your recent listings"
        >
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
            <div>
              <h2 className="text-base font-semibold text-gray-900">
                Your listings
              </h2>
              <p className="text-xs text-gray-500">
                {stats.total === 0
                  ? "Nothing here yet"
                  : `Latest ${recentProperties.length} of ${stats.total}`}
              </p>
            </div>
            <Link
              href="/owned"
              className="inline-flex items-center gap-1 text-[13px] font-medium text-gray-500 transition hover:text-[#4161df]"
            >
              View all
              <ArrowRight className="h-3.5 w-3.5" aria-hidden />
            </Link>
          </div>

          {recentProperties.length === 0 ? (
            <div className="flex flex-col items-center gap-3 px-6 py-12 text-center">
              <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[#4161df]/10">
                <Building2 className="h-7 w-7 text-[#4161df]" aria-hidden />
              </span>
              <p className="font-semibold text-gray-900">
                No properties listed yet
              </p>
              <p className="max-w-[36ch] text-sm text-gray-600">
                List your first property to start receiving enquiries from
                renters and buyers.
              </p>
              <button
                type="button"
                onClick={() => router.push("/landlord/dashboard/add-property")}
                className="mt-1 inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-[#4161df] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#3654cc] active:scale-[0.98]"
              >
                <Plus className="h-4 w-4" aria-hidden />
                Add your first property
              </button>
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {recentProperties.map((property: any) => {
                const img = firstImageUrl(property.image);
                return (
                  <li key={property._id ?? property.slug}>
                    <Link
                      href={
                        property.slug ? `/property/${property.slug}` : "/owned"
                      }
                      className="group flex items-center gap-4 px-5 py-4 transition-colors hover:bg-gray-50"
                    >
                      {img ? (
                        <Image
                          src={img}
                          alt={property.title ?? "Property"}
                          width={60}
                          height={60}
                          loading="lazy"
                          className="h-[60px] w-[60px] shrink-0 rounded-lg object-cover ring-1 ring-gray-200"
                        />
                      ) : (
                        <span className="inline-flex h-[60px] w-[60px] shrink-0 items-center justify-center rounded-lg bg-[#4161df]/10">
                          <Building2
                            className="h-6 w-6 text-[#4161df]"
                            aria-hidden
                          />
                        </span>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-semibold text-gray-900 group-hover:text-[#4161df]">
                          {property.title ?? "Untitled property"}
                        </p>
                        <p className="mt-0.5 truncate text-xs text-gray-500">
                          {[
                            property.location?.address,
                            property.location?.city,
                            property.location?.country,
                          ]
                            .filter(Boolean)
                            .join(", ") || "Location not set"}
                        </p>
                        <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1">
                          <DealBadge deal={property.deal} />
                          <StatusBadge status={property.status} />
                        </div>
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="font-semibold tracking-tight text-gray-900">
                          {formatPrice(property)}
                        </p>
                        <span className="mt-1 inline-flex items-center gap-0.5 text-[11px] font-medium text-gray-400 group-hover:text-[#4161df]">
                          View
                          <ArrowRight className="h-3 w-3" aria-hidden />
                        </span>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        {/* ── Sidebar ── */}
        <div className="flex flex-col gap-4 sm:gap-6">
          {/* Quick actions */}
          <section
            className="rounded-2xl border border-gray-200 bg-white p-5"
            aria-label="Quick actions"
          >
            <h2 className="text-base font-semibold text-gray-900">
              Quick actions
            </h2>
            <div className="mt-2">
              {[
                {
                  href: "/landlord/dashboard/profile",
                  icon: (
                    <FileCheck2 className="h-[18px] w-[18px]" aria-hidden />
                  ),
                  title: "Complete your profile",
                  subtitle: "Build trust with tenants",
                },
                {
                  href: "/owned",
                  icon: <Building2 className="h-[18px] w-[18px]" aria-hidden />,
                  title: "Manage properties",
                  subtitle: "Edit, update or remove listings",
                },
                {
                  href: "/landlord/dashboard/visits",
                  icon: (
                    <CalendarDays className="h-[18px] w-[18px]" aria-hidden />
                  ),
                  title: "Visit requests",
                  subtitle: "Confirm or decline site visits",
                },
                {
                  href: "/post-requirement",
                  icon: <Sparkles className="h-[18px] w-[18px]" aria-hidden />,
                  title: "Post a requirement",
                  subtitle: "Tell us what you're looking for",
                },
              ].map((action) => (
                <Link
                  key={action.href}
                  href={action.href}
                  className="group -mx-2 flex items-center gap-3 rounded-lg px-2 py-2.5 transition-colors hover:bg-gray-50"
                >
                  <span className="shrink-0 text-gray-400 group-hover:text-[#4161df]">
                    {action.icon}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-gray-900">
                      {action.title}
                    </span>
                    <span className="block truncate text-xs text-gray-500">
                      {action.subtitle}
                    </span>
                  </span>
                  <ArrowRight
                    className="h-4 w-4 shrink-0 text-gray-300 group-hover:text-[#4161df]"
                    aria-hidden
                  />
                </Link>
              ))}
            </div>
          </section>

          {/* Growth tips */}
          <section
            className="rounded-2xl border border-gray-200 bg-white p-5"
            aria-label="Tips to grow your enquiries"
          >
            <h2 className="text-base font-semibold text-gray-900">
              Grow your enquiries
            </h2>
            <ul className="mt-3 space-y-3 text-sm text-gray-600">
              <li className="border-l-2 border-[#4161df]/30 py-0.5 pl-3">
                Add clear, well-lit photos — listings with 5+ photos get more
                views.
              </li>
              <li className="border-l-2 border-[#4161df]/30 py-0.5 pl-3">
                Keep your phone and WhatsApp updated so tenants can reach you
                faster.
              </li>
              <li className="border-l-2 border-[#4161df]/30 py-0.5 pl-3">
                Verify your identity to earn a trust badge on your listings.
              </li>
            </ul>
          </section>
        </div>
      </div>

      {/* ── Support strip ── */}
      <Link
        href="/contact"
        className="mt-4 flex touch-manipulation items-center gap-4 rounded-2xl border border-gray-200 bg-white p-5 transition-colors hover:bg-gray-50 sm:mt-6"
      >
        <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-700">
          <LifeBuoy className="h-5 w-5" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-gray-900">Help & support</p>
          <p className="mt-0.5 text-sm text-gray-600">
            Questions about listings, documents or payments? Our team can help.
          </p>
        </div>
        <span className="hidden shrink-0 items-center gap-1 text-sm font-semibold text-[#4161df] sm:inline-flex">
          Contact us
          <ArrowRight className="h-4 w-4" aria-hidden />
        </span>
      </Link>
    </div>
  );
}

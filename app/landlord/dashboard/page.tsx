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
import AddPropertyModal from "@/components/AddPropertyModal";

// ──────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────

/** Pick the first usable image URL from a property image field. */
function firstImageUrl(image: string | string[] | null | undefined): string | null {
  const candidates =
    typeof image === "string" ? image.split(",") : Array.isArray(image) ? image : [];
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

const STATUS_STYLES: Record<string, string> = {
  Active: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  Rented: "bg-sky-50 text-sky-700 ring-sky-600/20",
  Sold: "bg-violet-50 text-violet-700 ring-violet-600/20",
  Inactive: "bg-gray-100 text-gray-600 ring-gray-500/20",
  "Review Required": "bg-amber-50 text-amber-700 ring-amber-600/20",
};

function StatusBadge({ status }: { status?: string }) {
  if (!status) return null;
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10.5px] font-semibold uppercase tracking-wide ring-1 ring-inset ${
        STATUS_STYLES[status] ?? "bg-gray-100 text-gray-600 ring-gray-500/20"
      }`}
    >
      {status}
    </span>
  );
}

function DealBadge({ deal }: { deal?: string }) {
  if (!deal) return null;
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10.5px] font-semibold uppercase tracking-wide ring-1 ring-inset ${
        deal === "Rent"
          ? "bg-indigo-50 text-[#4161df] ring-[#4161df]/20"
          : "bg-teal-50 text-teal-700 ring-teal-600/20"
      }`}
    >
      {deal === "Rent" ? <KeyRound className="h-3 w-3" aria-hidden /> : <IndianRupee className="h-3 w-3" aria-hidden />}
      {deal}
    </span>
  );
}

function StatCard({
  icon,
  label,
  value,
  hint,
  accent,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  hint?: string;
  accent: string;
  href?: string;
}) {
  const inner = (
    <div className="group flex h-full items-center gap-3.5 rounded-2xl border border-gray-200/80 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#4161df]/30 hover:shadow-md sm:p-5">
      <span
        className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ring-1 ring-inset ${accent}`}
      >
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-[11.5px] font-semibold uppercase tracking-wide text-gray-500">
          {label}
        </p>
        <p className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">{value}</p>
        {hint && <p className="mt-0.5 truncate text-xs text-gray-500">{hint}</p>}
      </div>
    </div>
  );
  return href ? (
    <Link href={href} className="block touch-manipulation active:scale-[0.99]">
      {inner}
    </Link>
  ) : (
    inner
  );
}

function DashboardSkeleton() {
  return (
    <div className="min-h-[100dvh] bg-[#f6f8fb]" aria-busy="true" aria-label="Loading dashboard">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:py-12">
        <div className="h-44 animate-pulse rounded-2xl bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 sm:h-48" />
        <div className="mt-4 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-24 animate-pulse rounded-2xl bg-white shadow-sm" />
          ))}
        </div>
        <div className="mt-4 grid gap-4 lg:grid-cols-3">
          <div className="h-72 animate-pulse rounded-2xl bg-white shadow-sm lg:col-span-2" />
          <div className="h-72 animate-pulse rounded-2xl bg-white shadow-sm" />
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

  const [modalOpened, setModalOpened] = useState(false);

  // Skip until gated in — avoids a 401 (and its auto-logout) when a signed-out
  // visitor lands here.
  const { data: profileData } = useGetMyLandlordProfileQuery(undefined, {
    skip: !isAuthenticated || !canAccess,
  });
  const { data: ownedData, isFetching: fetchingProperties } = useGetOwnedPropertiesQuery(
    undefined,
    { skip: !isAuthenticated || !canAccess },
  );

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
            new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime(),
        )
        .slice(0, 4),
    [properties],
  );

  const completeness = profile?.profileCompleteness ?? 0;

  // ── Signed-out gate ──
  if (!isAuthenticated || !user) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center gap-4 px-4 pt-[calc(6rem+env(safe-area-inset-top))] text-center sm:pt-24">
        <span className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#4161df]/10 to-[#7c93f2]/20 ring-1 ring-[#4161df]/10">
          <Building2 className="h-8 w-8 text-[#4161df]" aria-hidden />
        </span>
        <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl">
          Landlord dashboard
        </h1>
        <p className="max-w-[28ch] text-pretty text-sm text-gray-600 sm:text-base">
          Sign in to manage your properties and landlord profile.
        </p>
        <Link
          href="/login"
          className="inline-flex min-h-[44px] min-w-[120px] items-center justify-center rounded-xl bg-gradient-to-r from-[#4161df] to-[#5570e8] px-6 py-3 text-base font-semibold text-white shadow-md shadow-[#4161df]/25 transition hover:from-[#3759dd] hover:to-[#4161df] active:scale-[0.98]"
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
        <span className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 ring-1 ring-gray-200">
          <ShieldCheck className="h-8 w-8 text-gray-400" aria-hidden />
        </span>
        <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl">
          Landlord dashboard
        </h1>
        <p className="max-w-[34ch] text-pretty text-sm text-gray-600 sm:text-base">
          This area is for registered landlords. If you should have access, contact
          support.
        </p>
        <button
          type="button"
          onClick={() => router.push("/")}
          className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-gray-300 bg-white px-6 py-3 text-base font-medium text-gray-800 shadow-sm transition hover:bg-gray-50 active:scale-[0.98]"
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
    <div className="min-h-[100dvh] bg-[#f6f8fb]">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:py-12">
        {/* ── Hero ── */}
        <section className="relative mb-6 overflow-hidden rounded-2xl bg-gradient-to-br from-[#4161df] via-[#4f6ee6] to-[#7c93f2] p-6 text-white shadow-lg shadow-[#4161df]/20 sm:p-8">
          <div
            className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full bg-white/10 blur-2xl"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -bottom-28 left-1/3 h-56 w-56 rounded-full bg-white/10 blur-3xl"
            aria-hidden
          />
          <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              {profile?.avatar ? (
                <Image
                  src={profile.avatar}
                  alt={user.name ?? "Your avatar"}
                  width={64}
                  height={64}
                  className="h-14 w-14 rounded-2xl object-cover ring-2 ring-white/40 sm:h-16 sm:w-16"
                />
              ) : (
                <span className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-lg font-bold ring-2 ring-white/30 backdrop-blur sm:h-16 sm:w-16">
                  {initials}
                </span>
              )}
              <div className="min-w-0">
                <span className="inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest backdrop-blur">
                  Landlord workspace
                </span>
                <h1 className="mt-2 truncate text-2xl font-bold tracking-tight sm:text-3xl">
                  Welcome{user?.name ? `, ${user.name.split(" ")[0]}` : ""} 👋
                </h1>
                <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-white/85 sm:text-sm">
                  {(profile?.isVerified || profile?.identityVerified) && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-400/20 px-2.5 py-0.5 font-semibold text-emerald-100 ring-1 ring-inset ring-emerald-300/30">
                      <ShieldCheck className="h-3.5 w-3.5" aria-hidden />
                      Verified
                    </span>
                  )}
                  {memberSince && (
                    <span className="inline-flex items-center gap-1">
                      <CalendarDays className="h-3.5 w-3.5" aria-hidden />
                      Member since {memberSince}
                    </span>
                  )}
                  {profile?.rating ? (
                    <span className="inline-flex items-center gap-1">
                      ★ {profile.rating.toFixed(1)}
                      {profile.totalReviews ? ` (${profile.totalReviews})` : ""}
                    </span>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="flex shrink-0 flex-wrap gap-2.5">
              <button
                type="button"
                onClick={() => setModalOpened(true)}
                className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-[#4161df] shadow-md transition hover:bg-blue-50 active:scale-[0.98]"
              >
                <Plus className="h-4 w-4" aria-hidden />
                Add property
              </button>
              <Link
                href="/landlord/dashboard/profile"
                className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-white/15 px-5 py-2.5 text-sm font-semibold text-white ring-1 ring-inset ring-white/30 backdrop-blur transition hover:bg-white/25 active:scale-[0.98]"
              >
                Edit profile
              </Link>
            </div>
          </div>
        </section>

        {/* ── Stats ── */}
        <section className="mb-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          <StatCard
            icon={<Building2 className="h-5 w-5 text-[#4161df]" aria-hidden />}
            label="Properties"
            value={stats.total}
            hint={stats.total === 0 ? "Add your first one" : "In your portfolio"}
            accent="bg-[#4161df]/10 ring-[#4161df]/15"
            href="/owned"
          />
          <StatCard
            icon={<Eye className="h-5 w-5 text-emerald-600" aria-hidden />}
            label="Active listings"
            value={stats.active}
            hint="Visible to renters & buyers"
            accent="bg-emerald-50 ring-emerald-600/15"
            href="/owned"
          />
          <StatCard
            icon={<KeyRound className="h-5 w-5 text-violet-600" aria-hidden />}
            label="Rented / Sold"
            value={stats.closed}
            hint="Closed deals"
            accent="bg-violet-50 ring-violet-600/15"
            href="/owned"
          />
          <StatCard
            icon={<TrendingUp className="h-5 w-5 text-amber-600" aria-hidden />}
            label="Profile strength"
            value={`${completeness}%`}
            hint={completeness >= 100 ? "Complete 🎉" : "Keep going"}
            accent="bg-amber-50 ring-amber-600/15"
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
            className="rounded-2xl border border-gray-200/80 bg-white shadow-sm lg:col-span-2"
            aria-label="Your recent listings"
          >
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
              <div>
                <h2 className="text-base font-semibold text-gray-900">Your listings</h2>
                <p className="text-xs text-gray-500">
                  {stats.total === 0
                    ? "Nothing here yet"
                    : `Latest ${recentProperties.length} of ${stats.total}`}
                </p>
              </div>
              <Link
                href="/owned"
                className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-[13px] font-medium text-gray-600 shadow-sm transition hover:border-[#4161df]/40 hover:text-[#4161df] active:scale-[0.98]"
              >
                View all
                <ArrowRight className="h-3.5 w-3.5" aria-hidden />
              </Link>
            </div>

            {recentProperties.length === 0 ? (
              <div className="flex flex-col items-center gap-3 px-6 py-12 text-center">
                <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[#4161df]/10 ring-1 ring-[#4161df]/15">
                  <Building2 className="h-7 w-7 text-[#4161df]" aria-hidden />
                </span>
                <p className="font-semibold text-gray-900">No properties listed yet</p>
                <p className="max-w-[36ch] text-sm text-gray-600">
                  List your first property to start receiving enquiries from renters and
                  buyers.
                </p>
                <button
                  type="button"
                  onClick={() => setModalOpened(true)}
                  className="mt-1 inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-gradient-to-r from-[#4161df] to-[#5570e8] px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-[#4161df]/25 transition hover:from-[#3759dd] hover:to-[#4161df] active:scale-[0.98]"
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
                        href={property.slug ? `/property/${property.slug}` : "/owned"}
                        className="group flex items-center gap-4 px-5 py-4 transition hover:bg-gray-50/80"
                      >
                        {img ? (
                          <Image
                            src={img}
                            alt={property.title ?? "Property"}
                            width={64}
                            height={64}
                            loading="lazy"
                            className="h-16 w-16 shrink-0 rounded-xl object-cover ring-1 ring-gray-200"
                          />
                        ) : (
                          <span className="inline-flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#4161df]/10 to-[#7c93f2]/20 ring-1 ring-[#4161df]/10">
                            <Building2 className="h-6 w-6 text-[#4161df]" aria-hidden />
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
                          <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                            <DealBadge deal={property.deal} />
                            <StatusBadge status={property.status} />
                          </div>
                        </div>
                        <div className="shrink-0 text-right">
                          <p className="font-bold tracking-tight text-gray-900">
                            {formatPrice(property)}
                          </p>
                          <span className="mt-1 inline-flex items-center gap-0.5 text-[11px] font-medium text-gray-400 transition group-hover:text-[#4161df]">
                            View
                            <ArrowRight
                              className="h-3 w-3 transition-transform group-hover:translate-x-0.5"
                              aria-hidden
                            />
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
              className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm"
              aria-label="Quick actions"
            >
              <h2 className="text-base font-semibold text-gray-900">Quick actions</h2>
              <div className="mt-3 grid gap-2">
                {[
                  {
                    href: "/landlord/dashboard/profile",
                    icon: (
                      <FileCheck2 className="h-[18px] w-[18px] text-[#4161df]" aria-hidden />
                    ),
                    title: "Complete your profile",
                    subtitle: "Build trust with tenants",
                  },
                  {
                    href: "/owned",
                    icon: <Building2 className="h-[18px] w-[18px] text-emerald-600" aria-hidden />,
                    title: "Manage properties",
                    subtitle: "Edit, update or remove listings",
                  },
                  {
                    href: "/post-requirement",
                    icon: <Sparkles className="h-[18px] w-[18px] text-amber-600" aria-hidden />,
                    title: "Post a requirement",
                    subtitle: "Tell us what you're looking for",
                  },
                ].map((action) => (
                  <Link
                    key={action.href}
                    href={action.href}
                    className="group flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50/60 px-3.5 py-3 transition hover:border-[#4161df]/30 hover:bg-white hover:shadow-sm active:scale-[0.99]"
                  >
                    <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white ring-1 ring-gray-200">
                      {action.icon}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold text-gray-900">
                        {action.title}
                      </span>
                      <span className="block truncate text-xs text-gray-500">
                        {action.subtitle}
                      </span>
                    </span>
                    <ArrowRight
                      className="h-4 w-4 shrink-0 text-gray-300 transition group-hover:translate-x-0.5 group-hover:text-[#4161df]"
                      aria-hidden
                    />
                  </Link>
                ))}
              </div>
            </section>

            {/* Growth tips */}
            <section
              className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 p-5 text-white shadow-sm"
              aria-label="Tips to grow your enquiries"
            >
              <div
                className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[#4161df]/40 blur-2xl"
                aria-hidden
              />
              <h2 className="relative text-base font-semibold">Grow your enquiries</h2>
              <ul className="relative mt-3 space-y-2.5 text-sm text-gray-300">
                <li className="flex gap-2">
                  <span className="mt-0.5 text-[#7c93f2]">◆</span>
                  Add clear, well-lit photos — listings with 5+ photos get more views.
                </li>
                <li className="flex gap-2">
                  <span className="mt-0.5 text-[#7c93f2]">◆</span>
                  Keep your phone & WhatsApp updated so tenants can reach you faster.
                </li>
                <li className="flex gap-2">
                  <span className="mt-0.5 text-[#7c93f2]">◆</span>
                  Verify your identity to earn a trust badge on your listings.
                </li>
              </ul>
            </section>
          </div>
        </div>

        {/* ── Support strip ── */}
        <Link
          href="/contact"
          className="group mt-4 flex touch-manipulation items-center gap-4 rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#4161df]/30 hover:shadow-md active:scale-[0.99] sm:mt-6"
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
            <ArrowRight
              className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
              aria-hidden
            />
          </span>
        </Link>
      </div>

      <AddPropertyModal
        opened={modalOpened}
        setOpened={setModalOpened}
        editingProperty={null}
      />
    </div>
  );
}

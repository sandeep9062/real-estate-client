"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import {
  Building2,
  CalendarDays,
  CalendarX2,
  CheckCircle2,
  Clock,
  Layers,
  LogIn,
  Mail,
  Phone,
  Search,
  ShieldCheck,
  User as UserIcon,
  XCircle,
} from "lucide-react";

import { firstImageUrl } from "@/services/leadsApi";
import {
  useGetOwnerBookingsQuery,
  useUpdateOwnerBookingStatusMutation,
} from "@/services/userApi";
import { selectIsAuthenticated, selectUser } from "@/store/authSlice";
import { PageHeader } from "@/components/agent-dashboard/ui";

type BookingStatus = "Pending" | "Confirmed" | "Completed" | "Cancelled";

const STATUS_ICON: Record<BookingStatus, React.ElementType> = {
  Pending: Clock,
  Confirmed: CheckCircle2,
  Completed: CheckCircle2,
  Cancelled: XCircle,
};

// Same pill-badge language as the leads table, so status reads consistently
// across the agent dashboard.
const STATUS_BADGE: Record<BookingStatus, string> = {
  Pending: "border-amber-200 bg-amber-50 text-amber-700",
  Confirmed: "border-emerald-200 bg-emerald-50 text-emerald-700",
  Completed: "border-sky-200 bg-sky-50 text-sky-700",
  Cancelled: "border-gray-200 bg-gray-100 text-gray-600",
};

function StatusBadge({ status }: { status: BookingStatus }) {
  const Icon = STATUS_ICON[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${STATUS_BADGE[status]}`}
    >
      <Icon className="h-3.5 w-3.5" aria-hidden />
      {status}
    </span>
  );
}

function formatVisitDate(raw: string | undefined): string {
  if (!raw) return "Date not set";
  try {
    const parsed = new Date(raw);
    if (Number.isNaN(parsed.getTime())) return raw;
    return parsed.toLocaleDateString("en-IN", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return raw;
  }
}

function formatPropertyLocation(
  location:
    | { address?: string; city?: string; sector?: string }
    | null
    | undefined,
): string {
  if (!location) return "Location not available";
  const parts = [location.sector, location.city].filter(Boolean);
  if (parts.length === 0) return location.address || "Location not available";
  return parts.join(", ");
}

function VisitSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading visits">
      <div className="mb-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-24 animate-pulse rounded-xl border border-gray-200 bg-white"
          />
        ))}
      </div>
      <div className="h-64 animate-pulse rounded-2xl border border-gray-200 bg-white" />
    </div>
  );
}

// ──────────────────────────────────────────────
// Page
// ──────────────────────────────────────────────

export default function AgentDashboardVisitsPage() {
  const router = useRouter();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);
  const canAccess = user?.role === "agent" || user?.role === "admin";

  // Search state — admins can search by userID to view other agents' visits
  const [searchUserId, setSearchUserId] = useState("");
  const [activeUserId, setActiveUserId] = useState<string | undefined>(
    undefined,
  );

  // Skip until gated in — avoids a 401 (and its auto-logout) when a signed-out
  // visitor lands here.
  const {
    data: bookings,
    isLoading,
    isFetching,
  } = useGetOwnerBookingsQuery(
    activeUserId ? { userID: activeUserId } : undefined,
    { skip: !isAuthenticated || !canAccess },
  );
  const [updateStatus, { isLoading: updating }] =
    useUpdateOwnerBookingStatusMutation();
  const [pendingId, setPendingId] = useState<string | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = searchUserId.trim();
    setActiveUserId(trimmed || undefined);
  };

  const clearSearch = () => {
    setSearchUserId("");
    setActiveUserId(undefined);
  };

  const stats = useMemo(() => {
    const list = bookings ?? [];
    return {
      total: list.length,
      pending: list.filter((b: any) => b.status === "Pending").length,
      confirmed: list.filter((b: any) => b.status === "Confirmed").length,
      closed: list.filter(
        (b: any) => b.status === "Completed" || b.status === "Cancelled",
      ).length,
    };
  }, [bookings]);

  const upcoming = useMemo(
    () =>
      (bookings ?? [])
        .filter((b: any) => b.status === "Pending" || b.status === "Confirmed")
        .sort(
          (a: any, b: any) =>
            (new Date(a.date).getTime() || 0) -
            (new Date(b.date).getTime() || 0),
        ),
    [bookings],
  );

  const history = useMemo(
    () =>
      (bookings ?? [])
        .filter(
          (b: any) => b.status === "Completed" || b.status === "Cancelled",
        )
        .sort(
          (a: any, b: any) =>
            (new Date(b.updatedAt ?? b.createdAt ?? 0).getTime() || 0) -
            (new Date(a.updatedAt ?? a.createdAt ?? 0).getTime() || 0),
        ),
    [bookings],
  );

  const handleStatusChange = async (id: string, status: BookingStatus) => {
    setPendingId(id);
    try {
      await updateStatus({ id, status }).unwrap();
    } catch (err) {
      console.error("Failed to update visit status:", err);
    } finally {
      setPendingId(null);
    }
  };

  // ── Signed-out gate ──
  if (!isAuthenticated || !user) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center gap-4 px-4 pt-[calc(6rem+env(safe-area-inset-top))] text-center sm:pt-24">
        <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[#4161df]/10">
          <CalendarDays className="h-7 w-7 text-[#4161df]" aria-hidden />
        </span>
        <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl">
          Agent visits
        </h1>
        <p className="max-w-[28ch] text-pretty text-sm text-gray-600 sm:text-base">
          Sign in to see and manage visit requests on your listings.
        </p>
        <Link
          href="/login"
          className="inline-flex min-h-[44px] min-w-[120px] items-center justify-center gap-2 rounded-xl bg-[#4161df] px-6 py-3 text-base font-semibold text-white transition hover:bg-[#3654cc] active:scale-[0.98]"
        >
          <LogIn className="h-4 w-4" aria-hidden />
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
          Agent visits
        </h1>
        <p className="max-w-[34ch] text-pretty text-sm text-gray-600 sm:text-base">
          This area is for registered agents. If you should have access,
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

  if (isLoading) {
    return (
      <div className="max-w-4xl min-w-0">
        <PageHeader
          eyebrow="Visits"
          title="Site visits"
          description="Requests booked on your property listings."
        />
        <VisitSkeleton />
      </div>
    );
  }

  return (
    <div className="max-w-7xl min-w-0">
      <PageHeader
        eyebrow="Visits"
        title="Site visits"
        description="Requests booked on your property listings. Confirm, complete or decline them — visitors are notified automatically."
        actions={
          <Link
            href="/agent-dashboard/listings"
            className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:border-[#4161df]/40 hover:text-[#4161df] active:scale-[0.98]"
          >
            <Building2 className="h-4 w-4" aria-hidden />
            My listings
          </Link>
        }
      />

      {/* ── Search by UserID (admin only) ── */}
      {user?.role === "admin" && (
        <section className="mb-6 rounded-xl border border-gray-200 bg-white p-4">
          <form
            onSubmit={handleSearch}
            className="flex flex-col gap-3 sm:flex-row sm:items-end"
          >
            <div className="flex-1">
              <label
                htmlFor="search-userid"
                className="mb-1.5 block text-xs font-medium text-gray-500"
              >
                Search agent by user ID
              </label>
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
                  aria-hidden
                />
                <input
                  id="search-userid"
                  type="text"
                  value={searchUserId}
                  onChange={(e) => setSearchUserId(e.target.value)}
                  placeholder="Enter agent's user ID..."
                  className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#4161df] focus:outline-none focus:ring-2 focus:ring-[#4161df]/20"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={isFetching}
                className="inline-flex min-h-[42px] items-center gap-1.5 rounded-lg bg-[#4161df] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#3654cc] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isFetching ? "Searching..." : "Search"}
              </button>
              {activeUserId && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="inline-flex min-h-[42px] items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 active:scale-[0.98]"
                >
                  Clear
                </button>
              )}
            </div>
          </form>
          {activeUserId && (
            <p className="mt-2 flex items-center gap-1.5 text-xs text-gray-500">
              <UserIcon className="h-3.5 w-3.5" aria-hidden />
              Showing visits for agent:{" "}
              <span className="font-mono font-medium text-gray-700">
                {activeUserId}
              </span>
            </p>
          )}
        </section>
      )}

      {/* ── Stats ── */}
      <section className="mb-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {[
          {
            label: "Total requests",
            value: stats.total,
            icon: Layers,
            border: "border-l-gray-300",
            iconTone: "bg-gray-100 text-gray-500",
          },
          {
            label: "Pending",
            value: stats.pending,
            icon: Clock,
            border: "border-l-amber-400",
            iconTone: "bg-amber-50 text-amber-600",
          },
          {
            label: "Confirmed",
            value: stats.confirmed,
            icon: CheckCircle2,
            border: "border-l-emerald-400",
            iconTone: "bg-emerald-50 text-emerald-600",
          },
          {
            label: "Completed / declined",
            value: stats.closed,
            icon: Building2,
            border: "border-l-sky-400",
            iconTone: "bg-sky-50 text-sky-600",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className={`rounded-xl border border-gray-200 border-l-4 bg-white p-4 ${stat.border}`}
          >
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-gray-500">{stat.label}</p>
              <span
                className={`inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md ${stat.iconTone}`}
              >
                <stat.icon className="h-3.5 w-3.5" aria-hidden />
              </span>
            </div>
            <p className="mt-2 text-2xl font-semibold tracking-tight text-gray-900">
              {stat.value}
            </p>
          </div>
        ))}
      </section>

      {/* ── Upcoming visits ── */}
      <section
        className="rounded-2xl border border-gray-200 bg-white"
        aria-label="Upcoming visits"
      >
        <div className="border-b border-gray-100 px-5 py-4">
          <h2 className="text-base font-semibold text-gray-900">
            Upcoming visits
          </h2>
          <p className="text-xs text-gray-500">
            Pending and confirmed requests, soonest first
          </p>
        </div>

        {upcoming.length === 0 ? (
          <div className="flex flex-col items-center gap-3 px-6 py-12 text-center">
            <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[#4161df]/10">
              <CalendarX2 className="h-7 w-7 text-[#4161df]" aria-hidden />
            </span>
            <p className="font-semibold text-gray-900">No upcoming visits</p>
            <p className="max-w-[40ch] text-sm text-gray-600">
              When someone books a visit from one of your listings, the request
              will show up here for you to confirm.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {upcoming.map((booking: any) => {
              const img = firstImageUrl(booking.property?.image);
              const busy = updating && pendingId === booking._id;
              return (
                <li
                  key={booking._id}
                  className="px-5 py-4 transition-colors hover:bg-gray-50/60"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    {img ? (
                      <Image
                        src={img}
                        alt={booking.property?.title ?? "Property"}
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
                      <div className="flex flex-wrap items-center gap-3">
                        <StatusBadge status={booking.status} />
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-500">
                          <CalendarDays
                            className="h-3.5 w-3.5 text-gray-400"
                            aria-hidden
                          />
                          {formatVisitDate(booking.date)}
                        </span>
                      </div>
                      <Link
                        href={
                          booking.property?.slug
                            ? `/property/${booking.property.slug}`
                            : "/agent-dashboard/listings"
                        }
                        className="mt-1.5 block truncate font-semibold text-gray-900 transition hover:text-[#4161df]"
                      >
                        {booking.property?.title ?? "Property listing"}
                      </Link>
                      <p className="mt-0.5 truncate text-xs text-gray-500">
                        {formatPropertyLocation(booking.property?.location)}
                      </p>
                      <p className="mt-1 truncate text-sm text-gray-700">
                        {booking.user?.name ?? "Visitor"}
                      </p>
                      <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-gray-500">
                        {booking.user?.email && (
                          <span className="inline-flex items-center gap-1">
                            <Mail className="h-3 w-3" aria-hidden />
                            {booking.user.email}
                          </span>
                        )}
                        {booking.user?.phone && (
                          <span className="inline-flex items-center gap-1">
                            <Phone className="h-3 w-3" aria-hidden />
                            {booking.user.phone}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex shrink-0 flex-wrap gap-2">
                      {booking.status === "Pending" && (
                        <>
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() =>
                              handleStatusChange(booking._id, "Confirmed")
                            }
                            className="inline-flex min-h-[38px] items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            <CheckCircle2 className="h-4 w-4" aria-hidden />
                            Confirm
                          </button>
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() =>
                              handleStatusChange(booking._id, "Cancelled")
                            }
                            className="inline-flex min-h-[38px] items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            <XCircle className="h-4 w-4" aria-hidden />
                            Decline
                          </button>
                        </>
                      )}
                      {booking.status === "Confirmed" && (
                        <>
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() =>
                              handleStatusChange(booking._id, "Completed")
                            }
                            className="inline-flex min-h-[38px] items-center gap-1.5 rounded-lg bg-[#4161df] px-3.5 py-2 text-sm font-semibold text-white transition hover:bg-[#3654cc] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            <CheckCircle2 className="h-4 w-4" aria-hidden />
                            Mark completed
                          </button>
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() =>
                              handleStatusChange(booking._id, "Cancelled")
                            }
                            className="inline-flex min-h-[38px] items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            <XCircle className="h-4 w-4" aria-hidden />
                            Cancel
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {/* ── Visit history ── */}
      {history.length > 0 && (
        <section
          className="mt-6 rounded-2xl border border-gray-200 bg-white"
          aria-label="Visit history"
        >
          <div className="border-b border-gray-100 px-5 py-4">
            <h2 className="text-base font-semibold text-gray-900">History</h2>
            <p className="text-xs text-gray-500">
              Completed and declined visits
            </p>
          </div>
          <ul className="divide-y divide-gray-100">
            {history.map((booking: any) => (
              <li
                key={booking._id}
                className="flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-gray-50/60"
              >
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-100">
                  <Building2 className="h-5 w-5 text-gray-400" aria-hidden />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-gray-900">
                    {booking.property?.title ?? "Property listing"}
                  </p>
                  <p className="truncate text-xs text-gray-500">
                    {booking.user?.name ?? "Visitor"} ·{" "}
                    {formatVisitDate(booking.date)}
                  </p>
                </div>
                <StatusBadge status={booking.status} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

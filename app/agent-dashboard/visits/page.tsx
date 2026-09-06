"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import {
  CalendarDays,
  CalendarX2,
  CheckCircle2,
  Clock,
  XCircle,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

import { firstImageUrl } from "@/services/leadsApi";
import {
  useGetBookingsQuery,
  useCancelBookingMutation,
} from "@/services/userApi";
import { selectIsAuthenticated, selectUser } from "@/store/authSlice";
import { PageHeader } from "@/components/agent-dashboard/ui";

type BookingStatus = "Pending" | "Confirmed" | "Completed" | "Cancelled";

const STATUS_STYLES: Record<BookingStatus, string> = {
  Pending: "bg-amber-50 text-amber-700 ring-amber-600/20",
  Confirmed: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  Completed: "bg-sky-50 text-sky-700 ring-sky-600/20",
  Cancelled: "bg-gray-100 text-gray-600 ring-gray-500/20",
};

function StatusBadge({ status }: { status: BookingStatus }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10.5px] font-semibold uppercase tracking-wide ring-1 ring-inset ${STATUS_STYLES[status]}`}
    >
      {status === "Pending" ? (
        <Clock className="h-3 w-3" aria-hidden />
      ) : status === "Confirmed" ? (
        <CheckCircle2 className="h-3 w-3" aria-hidden />
      ) : status === "Completed" ? (
        <CheckCircle2 className="h-3 w-3" aria-hidden />
      ) : (
        <XCircle className="h-3 w-3" aria-hidden />
      )}
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
            className="h-20 animate-pulse rounded-2xl bg-white shadow-sm"
          />
        ))}
      </div>
      <div className="h-64 animate-pulse rounded-2xl bg-white shadow-sm" />
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

  // Skip until gated in — avoids a 401 (and its auto-logout) when a signed-out
  // visitor lands here.
  const { data: bookings, isLoading } = useGetBookingsQuery(undefined, {
    skip: !isAuthenticated || !canAccess,
  });
  const [cancelBooking, { isLoading: cancelling }] = useCancelBookingMutation();
  const [pendingId, setPendingId] = useState<string | null>(null);

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

  const handleCancel = async (bookingId: string) => {
    setPendingId(bookingId);
    try {
      await cancelBooking(bookingId).unwrap();
      toast.success("Visit cancelled.");
    } catch (err: any) {
      toast.error(err?.data?.message || "Couldn't cancel. Please try again.");
    } finally {
      setPendingId(null);
    }
  };

  // ── Signed-out gate ──
  if (!isAuthenticated || !user) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center gap-4 px-4 pt-[calc(6rem+env(safe-area-inset-top))] text-center sm:pt-24">
        <span className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#4161df]/10 to-[#7c93f2]/20 ring-1 ring-[#4161df]/10">
          <CalendarDays className="h-8 w-8 text-[#4161df]" aria-hidden />
        </span>
        <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl">
          My visits
        </h1>
        <p className="max-w-[28ch] text-pretty text-sm text-gray-600 sm:text-base">
          Sign in to track the property visits you've booked.
        </p>
        <Link
          href="/login"
          className="inline-flex min-h-[44px] min-w-[120px] items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#4161df] to-[#5570e8] px-6 py-3 text-base font-semibold text-white shadow-md shadow-[#4161df]/25 transition hover:from-[#3759dd] hover:to-[#4161df] active:scale-[0.98]"
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
          <CalendarDays className="h-8 w-8 text-gray-400" aria-hidden />
        </span>
        <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl">
          My visits
        </h1>
        <p className="max-w-[34ch] text-pretty text-sm text-gray-600 sm:text-base">
          This area is for registered agents. If you should have access, contact
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

  if (isLoading) {
    return (
      <div className="max-w-4xl min-w-0">
        <PageHeader
          eyebrow="Visits"
          title="My visits"
          description="Track the property visits you've booked."
        />
        <VisitSkeleton />
      </div>
    );
  }

  return (
    <div className="max-w-7xl min-w-0">
      <PageHeader
        eyebrow="Visits"
        title="My visits"
        description="Track the property visits you've booked and their status."
        actions={
          <Link
            href="/"
            className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:border-[#4161df]/40 hover:text-[#4161df] active:scale-[0.98]"
          >
            Browse properties
          </Link>
        }
      />

      {/* ── Stats ── */}
      <section className="mb-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {[
          {
            label: "Total visits",
            value: stats.total,
            accent: "text-gray-900",
          },
          { label: "Pending", value: stats.pending, accent: "text-amber-600" },
          {
            label: "Confirmed",
            value: stats.confirmed,
            accent: "text-emerald-600",
          },
          {
            label: "Completed / Cancelled",
            value: stats.closed,
            accent: "text-gray-500",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-gray-200/80 bg-white p-4 shadow-sm"
          >
            <p className="text-[11.5px] font-semibold uppercase tracking-wide text-gray-500">
              {stat.label}
            </p>
            <p
              className={`mt-1 text-2xl font-bold tracking-tight ${stat.accent}`}
            >
              {stat.value}
            </p>
          </div>
        ))}
      </section>

      {/* ── Upcoming visits ── */}
      <section
        className="rounded-2xl border border-gray-200/80 bg-white shadow-sm"
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
            <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[#4161df]/10 ring-1 ring-[#4161df]/15">
              <CalendarX2 className="h-7 w-7 text-[#4161df]" aria-hidden />
            </span>
            <p className="font-semibold text-gray-900">No upcoming visits</p>
            <p className="max-w-[40ch] text-sm text-gray-600">
              When you book a visit to a property, it'll show up here to track.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {upcoming.map((booking: any) => {
              const img = firstImageUrl(booking.property?.image);
              const busy = cancelling && pendingId === booking._id;
              return (
                <li key={booking._id} className="px-5 py-4">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    {img ? (
                      <Image
                        src={img}
                        alt={booking.property?.title ?? "Property"}
                        width={64}
                        height={64}
                        loading="lazy"
                        className="h-16 w-16 shrink-0 rounded-xl object-cover ring-1 ring-gray-200"
                      />
                    ) : (
                      <span className="inline-flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#4161df]/10 to-[#7c93f2]/20 ring-1 ring-[#4161df]/10">
                        <CalendarDays
                          className="h-6 w-6 text-[#4161df]"
                          aria-hidden
                        />
                      </span>
                    )}

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <StatusBadge status={booking.status} />
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-600">
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
                            : "/"
                        }
                        className="mt-1 block truncate font-semibold text-gray-900 transition hover:text-[#4161df]"
                      >
                        {booking.property?.title ?? "Property listing"}
                      </Link>
                      <p className="mt-0.5 truncate text-sm text-gray-500">
                        {formatPropertyLocation(booking.property?.location)}
                      </p>
                    </div>

                    <div className="flex shrink-0 flex-wrap gap-2">
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => handleCancel(booking._id)}
                        className="inline-flex min-h-[38px] items-center gap-1.5 rounded-xl border border-gray-300 bg-white px-3.5 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <XCircle className="h-4 w-4" aria-hidden />
                        Cancel
                      </button>
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
          className="mt-6 rounded-2xl border border-gray-200/80 bg-white shadow-sm"
          aria-label="Visit history"
        >
          <div className="border-b border-gray-100 px-5 py-4">
            <h2 className="text-base font-semibold text-gray-900">
              Visit history
            </h2>
            <p className="text-xs text-gray-500">
              Completed and cancelled visits
            </p>
          </div>
          <ul className="divide-y divide-gray-100">
            {history.map((booking: any) => (
              <li
                key={booking._id}
                className="flex items-center gap-4 px-5 py-3.5"
              >
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100 ring-1 ring-gray-200">
                  <CalendarDays className="h-5 w-5 text-gray-400" aria-hidden />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-gray-900">
                    {booking.property?.title ?? "Property listing"}
                  </p>
                  <p className="truncate text-xs text-gray-500">
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

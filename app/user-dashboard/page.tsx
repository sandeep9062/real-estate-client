"use client";

import Link from "next/link";
import { useSelector } from "react-redux";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Heart,
  LayoutDashboard,
  MapPin,
  MessageCircle,
  MoreVertical,
  UserPen,
} from "lucide-react";

import { selectUser } from "@/store/authSlice";
import { PageHeader, StatCard } from "@/components/user-dashboard/ui";
import { USER_DASHBOARD_NAV } from "@/components/user-dashboard/user-dashboard-nav";
import { useGetBookingsQuery, useGetFavouritesQuery } from "@/services/userApi";
import { useGetRecentlyViewedQuery } from "@/services/userApi";
import { toast } from "@/hooks/use-toast";

function toBookingRow(booking: any): {
  id: string;
  propertyTitle: string;
  propertyImage?: string;
  date: string;
  status: string;
  statusTone: "brand" | "emerald" | "amber" | "violet" | "blue";
} {
  const mapStatus = (s: string) => {
    switch (s?.toLowerCase()) {
      case "confirmed":
        return { tone: "emerald" as const, label: "Confirmed" };
      case "pending":
        return { tone: "amber" as const, label: "Pending" };
      case "cancelled":
        return { tone: "violet" as const, label: "Cancelled" };
      case "completed":
        return { tone: "blue" as const, label: "Completed" };
      default:
        return {
          tone: "brand" as const,
          label: (s?.charAt(0).toUpperCase() || "") + (s?.slice(1) || ""),
        };
    }
  };
  const { tone, label } = mapStatus(booking?.status ?? "pending");
  return {
    id: booking?._id ?? String(booking?.id ?? "n/a"),
    propertyTitle: booking?.property?.title ?? "Booked property",
    propertyImage: booking?.property?.image,
    date: booking?.date ?? "—",
    status: label,
    statusTone: tone,
  };
}

function toPropertyCard(prop: any): {
  id: string;
  title: string;
  image?: string;
  price?: number | string;
  location?: string;
  type?: string;
} {
  return {
    id: prop?._id ?? String(prop?.id ?? "n/a"),
    title: prop?.title ?? "Property",
    image: prop?.image,
    price: prop?.price,
    location: prop?.location,
    type: prop?.propertyType,
  };
}

const QUICK_ACTIONS = [
  {
    href: "/user-dashboard/favourites",
    icon: Heart,
    title: "View favourites",
    description: "See all the properties you have saved.",
    cta: "View favourites",
  },
  {
    href: "/user-dashboard/booking-history",
    icon: CalendarDays,
    title: "Booking history",
    description: "Review your past and upcoming site visits.",
    cta: "View history",
  },
  {
    href: "/search",
    icon: MapPin,
    title: "Search more",
    description: "Find your next home with guided search.",
    cta: "Search",
  },
  {
    href: "/user-dashboard/profile",
    icon: UserPen,
    title: "Edit profile",
    description: "Update your details and contact info.",
    cta: "Edit profile",
  },
];

export default function UserDashboardPage() {
  const user = useSelector(selectUser);
  const { data: bookings = [], isLoading: bookingsLoading } =
    useGetBookingsQuery();
  const { data: favourites = [], isLoading: favouritesLoading } =
    useGetFavouritesQuery();
  const { data: recentlyViewed = [], isLoading: recentlyViewedLoading } =
    useGetRecentlyViewedQuery();

  const ownedPropertyCount = user?.ownedProperties?.length ?? 0;
  const upcomingBookings =
    bookings.filter(
      (b) =>
        b?.status?.toLowerCase() !== "cancelled" &&
        b?.status?.toLowerCase() !== "completed",
    ).length ?? 0;
  const favouriteCount = favourites.length ?? user?.favProperties?.length ?? 0;
  const recentVisitCount =
    bookings.filter((b) => b?.status?.toLowerCase() === "completed").length ??
    0;

  if (bookingsLoading || favouritesLoading || recentlyViewedLoading) {
    return (
      <div className="flex min-h-[50vh] w-full items-center justify-center px-4 pt-[calc(6rem+env(safe-area-inset-top))]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#4161df] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-w-0">
      <section className="relative mb-6 overflow-hidden rounded-2xl bg-gradient-to-br from-[#4161df] via-[#4f6ee6] to-[#7c93f2] p-6 text-white shadow-lg shadow-[#4161df]/20 sm:mb-8 sm:p-8">
        <div
          className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full bg-white/10 blur-2xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-20 right-20 h-40 w-40 rounded-full bg-white/5 blur-xl"
          aria-hidden
        />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-white/70">
              Welcome back
            </p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-white sm:text-3xl">
              {user?.name ?? "User"} 👋
            </h1>
            <p className="mt-1 text-sm text-white/80">
              Here is what is happening with your properties and bookings today.
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm text-white">
              <UserPen className="h-5 w-5" aria-hidden />
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}

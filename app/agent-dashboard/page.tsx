"use client";

import Link from "next/link";
import {
  LayoutDashboard,
  Home,
  MessageCircleHeart,
  ExternalLink,
  Megaphone,
  CalendarDays,
} from "lucide-react";
import { useSelector } from "react-redux";

import { selectUser } from "@/store/authSlice";

export default function AgentDashboardOverviewPage() {
  const user = useSelector(selectUser);

  return (
    <div className="max-w-4xl min-w-0">
      <header className="mb-6 sm:mb-8">
        <p className="text-xs font-medium uppercase tracking-wide text-[#4161df] sm:text-sm">
          Overview
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
          Dashboard
        </h1>
        <p className="mt-2 max-w-2xl text-pretty text-sm text-gray-600 sm:text-base">
          Welcome back{user?.name ? `, ${user.name}` : ""}. Use the navigation
          (menu on mobile, sidebar on larger screens) to manage listings,
          marketing, and visits.
        </p>
      </header>

      <section className="mb-8 grid gap-3 sm:mb-10 sm:grid-cols-2 sm:gap-4">
        <Link
          href="/agent-dashboard/marketing"
          className="flex touch-manipulation items-start gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:border-[#4161df]/40 hover:shadow-md active:scale-[0.99] sm:gap-4 sm:p-5"
        >
          <span className="rounded-lg bg-indigo-50 p-2.5 text-[#4161df]">
            <Megaphone className="h-5 w-5" aria-hidden />
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-gray-900">Marketing</p>
            <p className="mt-0.5 text-sm text-gray-600">
              Connect LinkedIn and Meta for automated property posts.
            </p>
            <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-[#4161df]">
              Open marketing
              <ExternalLink className="h-3.5 w-3.5 opacity-70" aria-hidden />
            </span>
          </div>
        </Link>

        <Link
          href="/agent-dashboard/listings"
          className="flex touch-manipulation items-start gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:border-[#4161df]/40 hover:shadow-md active:scale-[0.99] sm:gap-4 sm:p-5"
        >
          <span className="rounded-lg bg-indigo-50 p-2.5 text-[#4161df]">
            <Home className="h-5 w-5" aria-hidden />
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-gray-900">Listings</p>
            <p className="mt-0.5 text-sm text-gray-600">
              Jump to your owned properties and update availability.
            </p>
            <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-[#4161df]">
              Manage listings
              <ExternalLink className="h-3.5 w-3.5 opacity-70" aria-hidden />
            </span>
          </div>
        </Link>

        <Link
          href="/agent-dashboard/visits"
          className="flex touch-manipulation items-start gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:border-[#4161df]/40 hover:shadow-md active:scale-[0.99] sm:gap-4 sm:p-5"
        >
          <span className="rounded-lg bg-indigo-50 p-2.5 text-[#4161df]">
            <CalendarDays className="h-5 w-5" aria-hidden />
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-gray-900">Visits</p>
            <p className="mt-0.5 text-sm text-gray-600">
              Review scheduled site visits tied to your activity.
            </p>
            <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-[#4161df]">
              View visits
              <ExternalLink className="h-3.5 w-3.5 opacity-70" aria-hidden />
            </span>
          </div>
        </Link>

        <Link
          href="/contact"
          className="flex touch-manipulation items-start gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:border-[#4161df]/40 hover:shadow-md active:scale-[0.99] sm:gap-4 sm:p-5"
        >
          <span className="rounded-lg bg-indigo-50 p-2.5 text-[#4161df]">
            <MessageCircleHeart className="h-5 w-5" aria-hidden />
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-gray-900">Support</p>
            <p className="mt-0.5 text-sm text-gray-600">
              Platform or lead questions — reach our team.
            </p>
            <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-[#4161df]">
              Contact us
              <ExternalLink className="h-3.5 w-3.5 opacity-70" aria-hidden />
            </span>
          </div>
        </Link>
      </section>

      <section className="rounded-xl border border-dashed border-gray-200 bg-gray-50/80 p-4 text-sm text-gray-600 sm:p-5">
        <p className="flex flex-col gap-2 sm:flex-row sm:items-start">
          <LayoutDashboard className="mt-0.5 h-4 w-4 shrink-0 text-[#4161df] sm:mt-1" />
          <span className="min-w-0 text-pretty">
            OAuth callbacks from the social engine should use your site’s{" "}
            <code className="break-all rounded bg-white px-1.5 py-0.5 text-xs text-gray-800 sm:text-[0.8125rem]">
              FRONTEND_URL
            </code>{" "}
            pointing at this app; you will land on{" "}
            <strong className="font-medium text-gray-800">Marketing</strong>{" "}
            after linking completes.
          </span>
        </p>
      </section>
    </div>
  );
}

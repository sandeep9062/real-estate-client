"use client";

import Link from "next/link";
import { CalendarDays, ArrowRight } from "lucide-react";

export default function AgentDashboardVisitsPage() {
  return (
    <div className="max-w-4xl min-w-0">
      <header className="mb-6 sm:mb-8">
        <p className="text-xs font-medium uppercase tracking-wide text-[#4161df] sm:text-sm">
          Visits
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
          Site visits & bookings
        </h1>
        <p className="mt-2 max-w-2xl text-pretty text-sm text-gray-600 sm:text-base">
          Buyers schedule visits through listing pages. Open your bookings hub to
          see upcoming slots, history, and messages tied to visit requests.
        </p>
      </header>

      <Link
        href="/bookings"
        className="flex touch-manipulation min-h-[56px] flex-col rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-[#4161df]/40 hover:shadow-md active:scale-[0.99] sm:min-h-0 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:p-6"
      >
        <div className="flex items-start gap-4">
          <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-[#4161df]">
            <CalendarDays className="h-5 w-5" aria-hidden />
          </span>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Your bookings
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              Manage confirmed visits and stay aligned with buyer expectations.
            </p>
          </div>
        </div>
        <span className="mt-4 inline-flex shrink-0 items-center gap-1 text-sm font-medium text-[#4161df] sm:mt-0">
          Open bookings
          <ArrowRight className="h-4 w-4" aria-hidden />
        </span>
      </Link>

      <section className="mt-8 rounded-xl border border-dashed border-gray-200 bg-gray-50/80 p-4 sm:mt-10 sm:p-5">
        <h3 className="text-sm font-semibold text-gray-900">
          Coming later in this workspace
        </h3>
        <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-gray-600">
          <li>Lead inbox tied to listing inquiries</li>
          <li>Visit reminders and calendar export</li>
        </ul>
      </section>
    </div>
  );
}

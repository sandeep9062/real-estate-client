"use client";

import Link from "next/link";
import { ArrowRight, CalendarDays, Clock } from "lucide-react";

import { PageHeader } from "@/components/agent-dashboard/ui";

const UPCOMING_FEATURES = [
  "Lead inbox tied to listing inquiries",
  "Visit reminders and calendar export",
];

export default function AgentDashboardVisitsPage() {
  return (
    <div className="max-w-4xl min-w-0">
      <PageHeader
        eyebrow="Visits"
        title="Site visits & bookings"
        description="Buyers schedule visits through listing pages. Open your bookings hub to see upcoming slots, history, and messages tied to visit requests."
      />

      <Link
        href="/bookings"
        className="group flex touch-manipulation min-h-[56px] flex-col rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#4161df]/30 hover:shadow-md active:scale-[0.99] sm:min-h-0 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:p-6"
      >
        <div className="flex items-start gap-4">
          <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-[#4161df]">
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
        <span className="mt-4 inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-[#4161df] sm:mt-0">
          Open bookings
          <ArrowRight
            className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
            aria-hidden
          />
        </span>
      </Link>

      <section className="mt-8 rounded-2xl border border-dashed border-gray-300 bg-white/60 p-5 sm:mt-10 sm:p-6">
        <h3 className="text-sm font-semibold text-gray-900">
          Coming later in this workspace
        </h3>
        <ul className="mt-3 space-y-2 text-sm text-gray-600">
          {UPCOMING_FEATURES.map((feature) => (
            <li key={feature} className="flex items-center gap-2">
              <Clock
                className="h-4 w-4 shrink-0 text-gray-400"
                aria-hidden
              />
              {feature}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

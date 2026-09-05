"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { X, TrendingUp } from "lucide-react";

/**
 * Profile completeness banner for Agent / Landlord dashboards.
 *
 * - Non-blocking: purely informational, never gates dashboard features.
 * - Dismissible: the dismissal is remembered per role via localStorage, so
 *   dismissing the agent banner doesn't hide the landlord one (or vice versa).
 * - Shows a progress bar and links to the profile-edit page.
 */

const DISMISS_KEY_PREFIX = "pb_profile_banner_dismissed_";

function isDismissed(role: string): boolean {
  try {
    return localStorage.getItem(`${DISMISS_KEY_PREFIX}${role}`) === "true";
  } catch {
    return false;
  }
}

function dismiss(role: string) {
  try {
    localStorage.setItem(`${DISMISS_KEY_PREFIX}${role}`, "true");
  } catch {
    // ignore storage errors
  }
}

export default function ProfileCompletenessBanner({
  role,
  percentage,
  editHref,
}: {
  role: "agent" | "landlord";
  percentage: number;
  editHref: string;
}) {
  const [hidden, setHidden] = useState(true); // true until we know (avoids flash)

  useEffect(() => {
    setHidden(isDismissed(role));
  }, [role]);

  // Don't render when complete or dismissed
  if (hidden || percentage >= 100) return null;

  const handleDismiss = () => {
    dismiss(role);
    setHidden(true);
  };

  const clamped = Math.max(0, Math.min(100, percentage));

  return (
    <section
      className="mb-6 overflow-hidden rounded-2xl border border-[#4161df]/15 bg-white shadow-sm"
      aria-label="Profile completeness"
    >
      <div className="flex items-start gap-4 p-5">
        <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#4161df]/10 to-[#7c93f2]/20 text-[#4161df] ring-1 ring-[#4161df]/10">
          <TrendingUp className="h-5 w-5" aria-hidden />
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-semibold text-gray-900">
              Your profile is {clamped}% complete
            </p>
            <span
              className={`rounded-full px-2 py-0.5 text-[10.5px] font-bold uppercase tracking-wide ${
                clamped >= 80
                  ? "bg-emerald-50 text-emerald-600"
                  : clamped >= 50
                    ? "bg-amber-50 text-amber-600"
                    : "bg-rose-50 text-rose-500"
              }`}
            >
              {clamped >= 80 ? "Almost there" : clamped >= 50 ? "Good start" : "Just began"}
            </span>
          </div>
          <p className="mt-0.5 text-sm text-gray-600">
            {role === "agent"
              ? "Agents with complete profiles get more leads."
              : "Landlords with complete profiles get more tenant interest."}
          </p>

          <div
            className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-gray-100"
            role="progressbar"
            aria-valuenow={clamped}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#4161df] to-[#7c93f2] shadow-sm shadow-[#4161df]/30 transition-all duration-700 ease-out"
              style={{ width: `${clamped}%` }}
            />
          </div>

          <Link
            href={editHref}
            className="mt-3.5 inline-flex min-h-[36px] items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#4161df] to-[#5570e8] px-4 py-2 text-sm font-semibold text-white shadow-md shadow-[#4161df]/25 transition hover:from-[#3759dd] hover:to-[#4161df] active:scale-[0.98]"
          >
            Complete your profile
          </Link>
        </div>

        <button
          type="button"
          onClick={handleDismiss}
          aria-label="Dismiss profile completeness banner"
          className="shrink-0 rounded-full p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
        >
          <X className="h-4 w-4" aria-hidden />
        </button>
      </div>
    </section>
  );
}
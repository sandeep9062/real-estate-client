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

function statusFor(percentage: number) {
  if (percentage >= 80)
    return { label: "Almost there", tone: "bg-emerald-50 text-emerald-600" };
  if (percentage >= 50)
    return { label: "Good start", tone: "bg-amber-50 text-amber-600" };
  return { label: "Just began", tone: "bg-rose-50 text-rose-500" };
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
  const status = statusFor(clamped);

  return (
    <section
      className="mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-white"
      aria-label="Profile completeness"
    >
      <div className="flex items-start gap-4 p-5">
        <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#4161df]/8 text-[#4161df]">
          <TrendingUp className="h-5 w-5" aria-hidden />
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-semibold text-slate-900">
              Your profile is {clamped}% complete
            </p>
            <span
              className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${status.tone}`}
            >
              {status.label}
            </span>
          </div>
          <p className="mt-0.5 text-sm text-slate-500">
            {role === "agent"
              ? "Agents with complete profiles get more leads."
              : "Landlords with complete profiles get more tenant interest."}
          </p>

          <div
            className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-100"
            role="progressbar"
            aria-valuenow={clamped}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className="h-full rounded-full bg-[#4161df] transition-all duration-700 ease-out"
              style={{ width: `${clamped}%` }}
            />
          </div>

          <Link
            href={editHref}
            className="mt-3.5 inline-flex min-h-[36px] items-center gap-1.5 rounded-lg bg-[#4161df] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#3151c9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4161df]/40 active:scale-[0.98]"
          >
            Complete your profile
          </Link>
        </div>

        <button
          type="button"
          onClick={handleDismiss}
          aria-label="Dismiss profile completeness banner"
          className="shrink-0 rounded-full p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4161df]/30"
        >
          <X className="h-4 w-4" aria-hidden />
        </button>
      </div>
    </section>
  );
}

"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import {
  AlertTriangle,
  Briefcase,
  Phone,
  Trophy,
  UserRound,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

import { selectIsAuthenticated, selectUser } from "@/store/authSlice";
import ProfileEditor, {
  type ProfileSection,
} from "@/components/profile/ProfileEditor";
import ProfileCompletenessBanner from "@/components/profile/ProfileCompletenessBanner";
import {
  useGetMyAgentProfileQuery,
  useUpdateMyAgentProfileMutation,
} from "@/services/agentsApi";

// Same option lists as the signup wizard — one source of truth for values.
const LOCATIONS = [
  "Chandigarh",
  "Mohali",
  "Panchkula",
  "Zirakpur",
  "Kharar",
  "Derabassi",
  "New Chandigarh",
];
const SPECIALISATIONS = [
  "Residential Sale",
  "Residential Rent",
  "Commercial",
  "Plots & Land",
  "Luxury Villas",
  "PG / Co-living",
  "Investment Advisory",
];
const LANGUAGES = ["Hindi", "English", "Punjabi"];

const SECTIONS: ProfileSection[] = [
  {
    id: "about",
    title: "About you",
    description: "Shown on your public agent profile.",
    icon: UserRound,
    fields: [
      {
        kind: "text",
        key: "name",
        label: "Full name",
        placeholder: "e.g. Rajesh Kumar",
        maxLength: 80,
      },
      {
        kind: "text",
        key: "title",
        label: "Title",
        placeholder: "e.g. Senior Property Advisor",
        maxLength: 60,
      },
      {
        kind: "text",
        key: "bio",
        label: "Short bio",
        textarea: true,
        maxLength: 400,
        placeholder:
          "Tell buyers a little about your experience, focus areas, and what makes you trustworthy...",
      },
      {
        kind: "text",
        key: "longBio",
        label: "Detailed bio",
        textarea: true,
        maxLength: 2000,
        placeholder:
          "A longer description for your profile page — experience, approach, services...",
      },
    ],
  },
  {
    id: "contact",
    title: "Contact details",
    description: "How buyers can reach you.",
    icon: Phone,
    fields: [
      {
        kind: "text",
        key: "phone",
        label: "Phone",
        placeholder: "e.g. +91 98765 43210",
      },
      {
        kind: "text",
        key: "whatsapp",
        label: "WhatsApp number",
        placeholder: "Leave empty to use your phone number",
      },
    ],
  },
  {
    id: "expertise",
    title: "Expertise",
    description: "Your registrations, experience and focus areas.",
    icon: Briefcase,
    fields: [
      {
        kind: "text",
        key: "agencyName",
        label: "Agency name",
        placeholder: "e.g. Bulbul Realty",
        maxLength: 80,
      },
      {
        kind: "text",
        key: "rera",
        label: "RERA registration number",
        placeholder: "Optional, helps verification",
      },
      {
        kind: "text",
        key: "experience",
        label: "Years of experience",
        type: "number",
        placeholder: "e.g. 5",
      },
      {
        kind: "toggles",
        key: "locations",
        label: "Areas you operate in",
        options: LOCATIONS,
      },
      {
        kind: "toggles",
        key: "specialisations",
        label: "Specialisations",
        options: SPECIALISATIONS,
      },
      {
        kind: "toggles",
        key: "languages",
        label: "Languages",
        options: LANGUAGES,
      },
    ],
  },
  {
    id: "achievements",
    title: "Achievements",
    description: "Awards and recognitions worth showing off.",
    icon: Trophy,
    fields: [
      {
        kind: "list",
        key: "achievements",
        label: "Achievements",
        placeholder: "e.g. Top performer 2024 — press Enter to add",
        maxLength: 120,
      },
    ],
  },
];

export default function AgentProfilePage() {
  const router = useRouter();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);
  const canAccess = user?.role === "agent" || user?.role === "admin";

  // Skip until gated in — avoids a 401 (and its auto-logout) when a signed-out
  // visitor lands here.
  const { data, isLoading, isError } = useGetMyAgentProfileQuery(undefined, {
    skip: !isAuthenticated || !canAccess,
  });
  const [updateProfile, { isLoading: saving }] =
    useUpdateMyAgentProfileMutation();

  // The agent profile doc — data is the full API response ({ success, data }),
  // so data.data is the actual Agent object (no transformResponse on this query).
  const profile = data?.data;

  // Expose only the fields the editor renders (SECTIONS) to the form draft —
  // mirrors the landlord profile page and keeps read-only/stale keys out.
  const editorProfile = useMemo(() => {
    if (!profile) return {};
    const p = profile as unknown as Record<string, unknown>;
    const editable: Record<string, unknown> = {};
    for (const section of SECTIONS) {
      for (const field of section.fields) {
        editable[field.key] = p[field.key];
      }
    }
    return editable;
  }, [profile]);

  // Resolve the display name — agent profile name, falling back to auth user name.
  const displayName = profile?.name || user?.name || "";

  // One save for the whole form. A picked photo switches the payload to
  // multipart (non-string fields are JSON-encoded — the backend parses them).
  const handleSave = async (
    draft: Record<string, unknown>,
    photo: File | null,
  ) => {
    let payload: Record<string, unknown> | FormData;
    if (photo) {
      const fd = new FormData();
      fd.append("photo", photo);
      for (const [key, value] of Object.entries(draft)) {
        fd.append(
          key,
          typeof value === "string" ? value : JSON.stringify(value),
        );
      }
      payload = fd;
    } else {
      payload = { ...draft };
    }

    try {
      await updateProfile(payload).unwrap();
      toast.success("Profile saved.");
    } catch (err) {
      toast.error(
        (err as any)?.data?.message || "Couldn't save. Please try again.",
      );
      throw err; // keeps the form in "dirty" state
    }
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center gap-4 px-4 pt-[calc(6rem+env(safe-area-inset-top))] text-center sm:pt-24">
        <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[#4161df]/8 text-[#4161df]">
          <Briefcase className="h-7 w-7" aria-hidden />
        </span>
        <h1 className="font-serif text-2xl font-medium text-stone-900 sm:text-[28px]">
          Agent profile
        </h1>
        <p className="text-sm text-stone-500">
          Log in to manage your listings and profile details.
        </p>
        <Link
          href="/login"
          className="inline-flex min-h-[44px] min-w-[120px] items-center justify-center rounded-xl bg-[#4161df] px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-[#3151c9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4161df]/40 active:scale-[0.98]"
        >
          Log in
        </Link>
      </div>
    );
  }

  if (!canAccess) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center gap-4 px-4 pt-[calc(6rem+env(safe-area-inset-top))] text-center sm:pt-24">
        <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-stone-100 text-stone-400">
          <Briefcase className="h-7 w-7" aria-hidden />
        </span>
        <h1 className="font-serif text-2xl font-medium text-stone-900 sm:text-[28px]">
          Agent profile
        </h1>
        <p className="text-sm text-stone-500">
          This page is only available to agent accounts.
        </p>
        <button
          type="button"
          onClick={() => router.push("/")}
          className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-stone-300 px-6 py-3 text-base font-medium text-stone-800 transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4161df]/30"
        >
          Back to home
        </button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-7xl min-w-0">
        <div className="mb-4 h-4 w-40 animate-pulse rounded-full bg-stone-200/70" />
        <div className="mb-6 h-40 animate-pulse rounded-3xl bg-stone-200/70" />
        <div className="mb-6 h-32 animate-pulse rounded-2xl bg-white" />
        <div className="space-y-4">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-64 animate-pulse rounded-2xl bg-white"
              style={{ animationDelay: `${i * 120}ms` }}
            />
          ))}
        </div>
      </div>
    );
  }

  if (isError || !data?.data) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center gap-4 px-4 pt-[calc(6rem+env(safe-area-inset-top))] text-center sm:pt-24">
        <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-500">
          <AlertTriangle className="h-7 w-7" aria-hidden />
        </span>
        <h1 className="font-serif text-2xl font-medium text-stone-900 sm:text-[28px]">
          Something went wrong
        </h1>
        <p className="text-sm text-stone-500">
          We couldn&apos;t load your agent profile. Please refresh the page or
          contact support if the problem persists.
        </p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-[#4161df] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#3151c9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4161df]/40 active:scale-[0.98]"
        >
          Refresh page
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl">
      <section className="relative mb-6 overflow-hidden rounded-3xl bg-gradient-to-br from-[#37509c] via-[#4161df] to-[#5570e8] p-6 text-white sm:p-8">
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.10]"
          aria-hidden
        >
          <defs>
            <pattern
              id="plan-grid"
              width="28"
              height="28"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 28 0 L 0 0 0 28"
                fill="none"
                stroke="white"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#plan-grid)" />
        </svg>

        <div className="relative max-w-md">
          <p className="text-[13px] font-medium text-white/70">Agent profile</p>
          <h1 className="mt-1.5 font-serif text-[28px] font-medium leading-tight tracking-tight sm:text-4xl">
            {displayName ? `Hello, ${displayName}` : "Edit your profile"}
          </h1>
          <p className="mt-2.5 text-sm leading-relaxed text-white/80 sm:text-base">
            Complete profiles win more buyer trust — and more leads.
          </p>
        </div>
      </section>

      <ProfileCompletenessBanner
        role="agent"
        percentage={profile?.profileCompleteness ?? 0}
        editHref="/agent-dashboard/profile"
      />

      <ProfileEditor
        sections={SECTIONS}
        profile={editorProfile}
        name={displayName || undefined}
        avatar={profile?.avatar}
        saving={saving}
        onSave={handleSave}
      />
    </div>
  );
}

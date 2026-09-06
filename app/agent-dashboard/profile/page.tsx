"use client";

import { useMemo } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowLeft,
  Briefcase,
  Phone,
  Trophy,
  UserRound,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

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
  const { data, isLoading, isError } = useGetMyAgentProfileQuery();
  const [updateProfile, { isLoading: saving }] =
    useUpdateMyAgentProfileMutation();

  // Memoised so ProfileEditor's form draft isn't reset on every render.
  const profile = useMemo(
    () => (data?.data ?? {}) as Record<string, unknown>,
    [data],
  );

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

  if (isLoading) {
    return (
      <div className="min-w-0">
        <div className="mb-4 h-4 w-32 animate-pulse rounded-full bg-slate-200" />
        <div className="mb-6 h-36 animate-pulse rounded-2xl bg-slate-200" />
        <div className="mb-6 h-28 animate-pulse rounded-2xl bg-slate-100" />
        <div className="space-y-4">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-56 animate-pulse rounded-2xl bg-slate-100"
              style={{ animationDelay: `${i * 120}ms` }}
            />
          ))}
        </div>
      </div>
    );
  }

  if (isError || !data?.data) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white px-6 py-14 text-center">
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-500">
          <AlertTriangle className="h-6 w-6" aria-hidden />
        </span>
        <h2 className="text-base font-semibold text-slate-900">
          Something went wrong
        </h2>
        <p className="max-w-sm text-sm text-slate-500">
          We couldn&apos;t load your agent profile. Please refresh the page or
          contact support.
        </p>
      </div>
    );
  }

  return (
    <div className="min-w-0">
      <section className="relative mb-6 overflow-hidden rounded-2xl bg-gradient-to-br from-[#37509c] via-[#4161df] to-[#5570e8] p-6 text-white sm:p-8">
        <Briefcase
          className="pointer-events-none absolute -right-4 -top-4 h-32 w-32 text-white/[0.08]"
          strokeWidth={1}
          aria-hidden
        />
        <div className="relative max-w-md">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Edit your profile
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-white/80 sm:text-base">
            Complete profiles win more buyer trust — and more leads.
          </p>
        </div>
      </section>

      <ProfileCompletenessBanner
        role="agent"
        percentage={data.data.profileCompleteness ?? 0}
        editHref="/agent-dashboard/profile"
      />

      <ProfileEditor
        sections={SECTIONS}
        profile={profile}
        name={profile.name as string}
        avatar={data.data.avatar}
        saving={saving}
        onSave={handleSave}
      />
    </div>
  );
}

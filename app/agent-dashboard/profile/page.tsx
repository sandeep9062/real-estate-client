"use client";

import { useMemo } from "react";
import Link from "next/link";
import {
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
      { kind: "toggles", key: "locations", label: "Areas you operate in", options: LOCATIONS },
      {
        kind: "toggles",
        key: "specialisations",
        label: "Specialisations",
        options: SPECIALISATIONS,
      },
      { kind: "toggles", key: "languages", label: "Languages", options: LANGUAGES },
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
      <div className="py-10 text-center text-sm text-gray-500">
        Loading your profile…
      </div>
    );
  }

  if (isError || !data?.data) {
    return (
      <div className="py-10 text-center text-sm text-gray-600">
        We couldn&apos;t load your agent profile. Please refresh the page or
        contact support.
      </div>
    );
  }

  return (
    <div className="min-w-0">
      <Link
        href="/agent-dashboard"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 transition hover:text-gray-800"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        Back to dashboard
      </Link>

      <section className="relative mb-6 overflow-hidden rounded-2xl bg-gradient-to-br from-[#4161df] via-[#4f6ee6] to-[#7c93f2] p-6 text-white shadow-lg shadow-[#4161df]/20 sm:p-8">
        <div
          className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full bg-white/10 blur-2xl"
          aria-hidden
        />
        <span className="inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest backdrop-blur">
          Agent workspace
        </span>
        <h1 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
          Edit your profile
        </h1>
        <p className="mt-1 text-sm text-white/80 sm:text-base">
          Complete profiles win more buyer trust — and more leads.
        </p>
      </section>

      <ProfileCompletenessBanner
        role="agent"
        percentage={data.data.profileCompleteness ?? 0}
        editHref="/agent-dashboard/profile"
      />

      <ProfileEditor
        sections={SECTIONS}
        profile={profile}
        name={data.data.name}
        avatar={data.data.avatar}
        saving={saving}
        onSave={handleSave}
      />
    </div>
  );
}
"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { toast } from "@/hooks/use-toast";

import ProfileEditor, {
  type ProfileFieldSpec,
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

const FIELDS: ProfileFieldSpec[] = [
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
    key: "rera",
    label: "RERA registration number",
    placeholder: "Optional, helps verification",
  },
  { kind: "toggles", key: "locations", label: "Areas you operate in", options: LOCATIONS },
  {
    kind: "toggles",
    key: "specialisations",
    label: "Specialisations",
    options: SPECIALISATIONS,
  },
  { kind: "toggles", key: "languages", label: "Languages", options: LANGUAGES },
];

export default function AgentProfilePage() {
  const { data, isLoading, isError } = useGetMyAgentProfileQuery();
  const [updateProfile] = useUpdateMyAgentProfileMutation();
  const [savingPhoto, setSavingPhoto] = useState(false);

  const profile = (data?.data ?? {}) as Record<string, unknown>;

  const handleSaveField = async (key: string, value: unknown) => {
    try {
      await updateProfile({ [key]: value }).unwrap();
      toast.success("Saved.");
    } catch (err) {
      toast.error(
        (err as any)?.data?.message || "Couldn't save. Please try again.",
      );
      throw err; // keeps the card in "dirty" state
    }
  };

  const handleSavePhoto = async (file: File) => {
    setSavingPhoto(true);
    try {
      const fd = new FormData();
      fd.append("photo", file);
      await updateProfile(fd).unwrap();
      toast.success("Photo updated.");
    } catch (err) {
      toast.error(
        (err as any)?.data?.message || "Couldn't upload photo. Please try again.",
      );
      throw err;
    } finally {
      setSavingPhoto(false);
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

      <header className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#4161df]">
          Agent workspace
        </p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
          Edit your profile
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-gray-600 sm:text-base">
          Update anything anytime — each field saves independently. No steps, no
          sequence.
        </p>
      </header>

      <ProfileCompletenessBanner
        role="agent"
        percentage={data.data.profileCompleteness ?? 0}
        editHref="/agent-dashboard/profile"
      />

      <ProfileEditor
        fields={FIELDS}
        profile={profile}
        name={data.data.name}
        avatar={data.data.avatar}
        onSaveField={handleSaveField}
        onSavePhoto={handleSavePhoto}
      />

      {savingPhoto && (
        <p className="mt-3 text-xs text-gray-400">Uploading photo…</p>
      )}
    </div>
  );
}
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { ArrowLeft, Building2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

import { selectIsAuthenticated, selectUser } from "@/store/authSlice";
import ProfileEditor, {
  type ProfileFieldSpec,
} from "@/components/profile/ProfileEditor";
import ProfileCompletenessBanner from "@/components/profile/ProfileCompletenessBanner";
import {
  useGetMyLandlordProfileQuery,
  useUpdateMyLandlordProfileMutation,
} from "@/services/landlordApi";

const LOCATIONS = [
  "Chandigarh",
  "Mohali",
  "Panchkula",
  "Zirakpur",
  "Kharar",
  "Derabassi",
  "New Chandigarh",
];
const PROPERTY_TYPES = ["Residential", "Commercial", "Plot"];
const LANGUAGES = ["Hindi", "English", "Punjabi"];

const FIELDS: ProfileFieldSpec[] = [
  {
    kind: "text",
    key: "bio",
    label: "Short bio",
    textarea: true,
    maxLength: 400,
    placeholder: "Tell tenants a little about you and the properties you offer...",
  },
  {
    kind: "text",
    key: "address",
    label: "Address",
    placeholder: "e.g. 42 Palm Avenue, Sector 9",
  },
  { kind: "toggles", key: "locations", label: "Areas you operate in", options: LOCATIONS },
  {
    kind: "toggles",
    key: "propertyTypes",
    label: "Property types you offer",
    options: PROPERTY_TYPES,
  },
  { kind: "toggles", key: "languages", label: "Languages", options: LANGUAGES },
];

export default function LandlordProfilePage() {
  const router = useRouter();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);
  const canAccess = user?.role === "landlord" || user?.role === "admin";

  // Skip until gated in — avoids a 401 (and its auto-logout) when a signed-out
  // visitor lands here.
  const { data, isLoading, isError } = useGetMyLandlordProfileQuery(undefined, {
    skip: !isAuthenticated || !canAccess,
  });
  const [updateProfile] = useUpdateMyLandlordProfileMutation();
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
      throw err;
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

  if (!isAuthenticated || !user) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center gap-4 px-4 pt-[calc(6rem+env(safe-area-inset-top))] text-center sm:pt-24">
        <Building2 className="h-12 w-12 text-[#4161df]" aria-hidden />
        <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl">
          Landlord profile
        </h1>
        <Link
          href="/login"
          className="inline-flex min-h-[44px] min-w-[120px] items-center justify-center rounded-lg bg-[#4161df] px-6 py-3 text-base font-medium text-white transition hover:bg-[#3759dd]"
        >
          Log in
        </Link>
      </div>
    );
  }

  if (!canAccess) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center gap-4 px-4 pt-[calc(6rem+env(safe-area-inset-top))] text-center sm:pt-24">
        <Building2 className="h-12 w-12 text-gray-400" aria-hidden />
        <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl">
          Landlord profile
        </h1>
        <button
          type="button"
          onClick={() => router.push("/")}
          className="inline-flex min-h-[44px] items-center justify-center rounded-lg border border-gray-300 px-6 py-3 text-base font-medium text-gray-800 transition hover:bg-gray-50"
        >
          Back to home
        </button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 text-center text-sm text-gray-500">
        Loading your profile…
      </div>
    );
  }

  if (isError || !data?.data) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 text-center text-sm text-gray-600">
        We couldn&apos;t load your landlord profile. Please refresh the page or
        contact support.
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-[#f6f8fb]">
      <div className="mx-auto max-w-3xl px-4 py-10 sm:py-14">
        <Link
          href="/landlord/dashboard"
          className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 transition hover:text-gray-800"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Back to dashboard
        </Link>

        <header className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#4161df]">
            Landlord workspace
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            Edit your profile
          </h1>
          <p className="mt-2 text-sm text-gray-600 sm:text-base">
            Update anything anytime — each field saves independently. No steps,
            no sequence.
          </p>
        </header>

        <ProfileCompletenessBanner
          role="landlord"
          percentage={data.data.profileCompleteness ?? 0}
          editHref="/landlord/dashboard/profile"
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
    </div>
  );
}
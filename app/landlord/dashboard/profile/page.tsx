"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import {
  ArrowLeft,
  Building2,
  MapPin,
  Phone,
  SlidersHorizontal,
  UserRound,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

import { selectIsAuthenticated, selectUser } from "@/store/authSlice";
import ProfileEditor, {
  type ProfileSection,
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
const CONTACT_METHODS = ["phone", "email", "whatsapp"];
const CONTACT_METHOD_LABELS: Record<string, string> = {
  phone: "Phone",
  email: "Email",
  whatsapp: "WhatsApp",
};

// Preference keys live in the nested `preferences` sub-doc on the Landlord
// model — flattened into the editor and re-wrapped on save.
const PREFERENCE_KEYS = new Set([
  "contactMethod",
  "availableTimings",
  "acceptsVisits",
]);

const SECTIONS: ProfileSection[] = [
  {
    id: "about",
    title: "About you",
    description: "Introduce yourself — tenants see this on your listings.",
    icon: UserRound,
    fields: [
      {
        kind: "text",
        key: "title",
        label: "Title",
        placeholder: "e.g. Property Owner, Landlord",
        maxLength: 60,
      },
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
        key: "longBio",
        label: "Detailed bio",
        textarea: true,
        maxLength: 2000,
        placeholder:
          "A longer description — your properties, policies, tenant expectations...",
      },
    ],
  },
  {
    id: "contact",
    title: "Contact details",
    description: "How tenants can reach you.",
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
    id: "location",
    title: "Location",
    icon: MapPin,
    fields: [
      {
        kind: "text",
        key: "address",
        label: "Address",
        placeholder: "e.g. 42 Palm Avenue, Sector 9",
      },
      {
        kind: "text",
        key: "city",
        label: "City",
        placeholder: "e.g. Chandigarh",
      },
      {
        kind: "text",
        key: "state",
        label: "State",
        placeholder: "e.g. Punjab",
      },
      {
        kind: "text",
        key: "pincode",
        label: "Pincode",
        placeholder: "e.g. 160009",
        maxLength: 10,
      },
    ],
  },
  {
    id: "coverage",
    title: "Coverage & services",
    description: "Where you operate and what you offer.",
    icon: Building2,
    fields: [
      { kind: "toggles", key: "locations", label: "Areas you operate in", options: LOCATIONS },
      {
        kind: "toggles",
        key: "propertyTypes",
        label: "Property types you offer",
        options: PROPERTY_TYPES,
      },
      { kind: "toggles", key: "languages", label: "Languages", options: LANGUAGES },
    ],
  },
  {
    id: "preferences",
    title: "Contact preferences",
    description: "Tell tenants when and how you prefer to be contacted.",
    icon: SlidersHorizontal,
    fields: [
      {
        kind: "select",
        key: "contactMethod",
        label: "Preferred contact method",
        options: CONTACT_METHODS,
        labels: CONTACT_METHOD_LABELS,
      },
      {
        kind: "boolean",
        key: "acceptsVisits",
        label: "Accepts property visits",
      },
      {
        kind: "text",
        key: "availableTimings",
        label: "Available timings",
        placeholder: "e.g. 10:00 AM - 6:00 PM",
        maxLength: 60,
      },
    ],
  },
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
  const [updateProfile, { isLoading: saving }] =
    useUpdateMyLandlordProfileMutation();

  // Memoised so ProfileEditor's form draft isn't reset on every render.
  const profile = useMemo(
    () => (data?.data ?? {}) as Record<string, unknown>,
    [data],
  );

  // Flatten the nested `preferences` sub-doc so ProfileEditor (which reads
  // `profile[key]`) can bind to contactMethod / availableTimings / acceptsVisits.
  const editorProfile = useMemo(() => {
    const preferences = (profile.preferences ?? {}) as Record<string, unknown>;
    return {
      ...profile,
      contactMethod: preferences.contactMethod,
      availableTimings: preferences.availableTimings,
      acceptsVisits: preferences.acceptsVisits,
    };
  }, [profile]);

  // One save for the whole form. Preference keys are re-wrapped into the
  // nested `preferences` object; a picked photo switches the payload to
  // multipart (non-string fields are JSON-encoded — the backend parses them).
  const handleSave = async (
    draft: Record<string, unknown>,
    photo: File | null,
  ) => {
    const body: Record<string, unknown> = {};
    const preferences: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(draft)) {
      if (PREFERENCE_KEYS.has(key)) preferences[key] = value;
      else body[key] = value;
    }
    if (Object.keys(preferences).length > 0) body.preferences = preferences;

    let payload: Record<string, unknown> | FormData = body;
    if (photo) {
      const fd = new FormData();
      fd.append("photo", photo);
      for (const [key, value] of Object.entries(body)) {
        fd.append(
          key,
          typeof value === "string" ? value : JSON.stringify(value),
        );
      }
      payload = fd;
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

        <section className="relative mb-6 overflow-hidden rounded-2xl bg-gradient-to-br from-[#4161df] via-[#4f6ee6] to-[#7c93f2] p-6 text-white shadow-lg shadow-[#4161df]/20 sm:p-8">
          <div
            className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full bg-white/10 blur-2xl"
            aria-hidden
          />
          <span className="inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest backdrop-blur">
            Landlord workspace
          </span>
          <h1 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
            Edit your profile
          </h1>
          <p className="mt-1 text-sm text-white/80 sm:text-base">
            Keep your details up to date — tenants see this on your listings.
          </p>
        </section>

        <ProfileCompletenessBanner
          role="landlord"
          percentage={data.data.profileCompleteness ?? 0}
          editHref="/landlord/dashboard/profile"
        />

        <ProfileEditor
          sections={SECTIONS}
          profile={editorProfile}
          name={data.data.name}
          avatar={data.data.avatar}
          saving={saving}
          onSave={handleSave}
        />
      </div>
    </div>
  );
}
"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import {
  AlertTriangle,
  ArrowLeft,
  Building2,
  MapPin,
  Phone,
  SlidersHorizontal,
  Sparkles,
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
  // data is the full API response ({ success, data }) — no transformResponse.
  const profile = useMemo(
    () => (data?.data ?? {}) as Record<string, unknown>,
    [data],
  );

  // Flatten the nested `preferences` sub-doc so ProfileEditor (which reads
  // `profile[key]`) can bind to contactMethod / availableTimings / acceptsVisits.
  // Only expose the keys that the editor actually renders (SECTIONS) — avoids
  // carrying stale nested `preferences` or read-only fields into the draft.
  const editorProfile = useMemo(() => {
    const preferences = (profile.preferences ?? {}) as Record<string, unknown>;
    const editable: Record<string, unknown> = {};
    for (const section of SECTIONS) {
      for (const field of section.fields) {
        editable[field.key] = profile[field.key];
      }
    }
    // Preference keys live in the nested sub-doc but render at root level.
    editable.contactMethod = preferences.contactMethod;
    editable.availableTimings = preferences.availableTimings;
    editable.acceptsVisits = preferences.acceptsVisits;
    return editable;
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
          className="inline-flex min-h-[44px] min-w-[120px] items-center justify-center rounded-xl bg-gradient-to-r from-[#4161df] to-[#5570e8] px-6 py-3 text-base font-semibold text-white shadow-md shadow-[#4161df]/25 transition hover:from-[#3759dd] hover:to-[#4161df] active:scale-[0.98]"
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
      <div className="min-h-[100dvh] bg-[#f6f8fb]">
        <div className="mx-auto max-w-3xl px-4 py-10 sm:py-14">
          <div className="mb-4 h-4 w-40 animate-pulse rounded-full bg-gray-200" />
          <div className="mb-6 h-44 animate-pulse rounded-3xl bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200" />
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
      </div>
    );
  }

  if (isError || !data?.data) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center gap-4 px-4 pt-[calc(6rem+env(safe-area-inset-top))] text-center sm:pt-24">
        <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-500 ring-1 ring-amber-100">
          <AlertTriangle className="h-7 w-7" aria-hidden />
        </span>
        <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl">
          Something went wrong
        </h1>
        <p className="text-sm text-gray-500">
          We couldn&apos;t load your landlord profile. Please refresh the page or
          contact support if the problem persists.
        </p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-[#4161df] px-6 py-3 text-sm font-semibold text-white shadow-md shadow-[#4161df]/25 transition hover:bg-[#3759dd] active:scale-[0.98]"
        >
          Refresh page
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-[#f6f8fb]">
      <div className="mx-auto max-w-3xl px-4 py-10 sm:py-14">
        <Link
          href="/landlord/dashboard"
          className="mb-5 inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3.5 py-2 text-[13px] font-medium text-gray-600 shadow-sm transition hover:border-gray-300 hover:text-gray-900 active:scale-[0.98]"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Back to dashboard
        </Link>

        <section className="relative mb-6 overflow-hidden rounded-3xl bg-gradient-to-br from-[#3b56d4] via-[#4161df] to-[#7c93f2] p-6 text-white shadow-xl shadow-[#4161df]/25 sm:p-8">
          <div
            className="pointer-events-none absolute -right-20 -top-28 h-72 w-72 rounded-full bg-white/10 blur-3xl"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -bottom-28 -left-16 h-64 w-64 rounded-full bg-[#a5b4fc]/40 blur-3xl"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.08]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
              backgroundSize: "22px 22px",
            }}
            aria-hidden
          />
          <div className="relative">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest backdrop-blur">
              <Sparkles className="h-3 w-3" aria-hidden />
              Landlord workspace
            </span>
            <h1 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
              {profile.name ? `Hello, ${String(profile.name)}` : "Edit your profile"}
            </h1>
            <p className="mt-1.5 max-w-md text-sm text-white/80 sm:text-base">
              Keep your details up to date — tenants see this on your listings.
            </p>
          </div>
        </section>

        <ProfileCompletenessBanner
          role="landlord"
          percentage={Number(profile.profileCompleteness) || 0}
          editHref="/landlord/dashboard/profile"
        />

        <ProfileEditor
          sections={SECTIONS}
          profile={editorProfile}
          name={profile.name ? String(profile.name) : undefined}
          avatar={profile.avatar ? String(profile.avatar) : undefined}
          saving={saving}
          onSave={handleSave}
        />
      </div>
    </div>
  );
}
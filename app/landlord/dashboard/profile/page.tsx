"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import {
  AlertTriangle,
  ArrowLeft,
  Building2,
  Landmark,
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
    description: "Tenants see this on your listings.",
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
        placeholder: "e.g. Property Owner, Landlord",
        maxLength: 60,
      },
      {
        kind: "text",
        key: "bio",
        label: "Short bio",
        textarea: true,
        maxLength: 400,
        placeholder:
          "Tell tenants a little about you and the properties you offer...",
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
      {
        kind: "text",
        key: "email",
        label: "Email",
        placeholder: "e.g. rajesh@example.com",
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
      {
        kind: "toggles",
        key: "locations",
        label: "Areas you operate in",
        options: LOCATIONS,
      },
      {
        kind: "toggles",
        key: "propertyTypes",
        label: "Property types you offer",
        options: PROPERTY_TYPES,
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
    id: "company",
    title: "Company info",
    description: "For corporate landlords — enable to show company details.",
    icon: Landmark,
    fields: [
      {
        kind: "boolean",
        key: "isCompany",
        label: "This is a company/corporate profile",
      },
      {
        kind: "text",
        key: "companyName",
        label: "Company name",
        placeholder: "e.g. ABC Properties Pvt. Ltd.",
        maxLength: 120,
      },
      {
        kind: "text",
        key: "gstin",
        label: "GSTIN",
        placeholder: "e.g. 09AABCU9603R1ZM",
        maxLength: 20,
      },
      {
        kind: "text",
        key: "pan",
        label: "PAN",
        placeholder: "e.g. AABCU9603R",
        maxLength: 12,
      },
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

  // The landlord profile doc — data is the full API response ({ success, data }),
  // so data.data is the actual Landlord object (no transformResponse on this query).
  const profile = data?.data;

  // Flatten the nested `preferences` sub-doc so ProfileEditor (which reads
  // `profile[key]`) can bind to contactMethod / availableTimings / acceptsVisits.
  // Only expose the keys that the editor actually renders (SECTIONS) — avoids
  // carrying stale nested `preferences` or read-only fields into the draft.
  const editorProfile = useMemo(() => {
    if (!profile) return {};
    const preferences = (profile.preferences ?? {}) as Record<string, unknown>;
    const editable: Record<string, unknown> = {};
    const p = profile as unknown as Record<string, unknown>;
    for (const section of SECTIONS) {
      for (const field of section.fields) {
        editable[field.key] = p[field.key];
      }
    }
    // Preference keys live in the nested sub-doc but render at root level.
    editable.contactMethod = preferences.contactMethod;
    editable.availableTimings = preferences.availableTimings;
    editable.acceptsVisits = preferences.acceptsVisits;
    return editable;
  }, [profile]);

  // Resolve the display name — landlord profile name, falling back to auth user name
  const displayName = profile?.name || user?.name || "";

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
      <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center gap-4 bg-[#FAF7F1] px-4 pt-[calc(6rem+env(safe-area-inset-top))] text-center sm:pt-24">
        <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[#4161df]/8 text-[#4161df]">
          <Building2 className="h-7 w-7" aria-hidden />
        </span>
        <h1 className="font-serif text-2xl font-medium text-stone-900 sm:text-[28px]">
          Landlord profile
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
      <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center gap-4 bg-[#FAF7F1] px-4 pt-[calc(6rem+env(safe-area-inset-top))] text-center sm:pt-24">
        <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-stone-100 text-stone-400">
          <Building2 className="h-7 w-7" aria-hidden />
        </span>
        <h1 className="font-serif text-2xl font-medium text-stone-900 sm:text-[28px]">
          Landlord profile
        </h1>
        <p className="text-sm text-stone-500">
          This page is only available to landlord accounts.
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
      <div className="min-h-[100dvh] bg-[#FAF7F1]">
        <div className="mx-auto max-w-5xl px-4 py-10 sm:py-14">
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
      </div>
    );
  }

  if (isError || !data?.data) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center gap-4 bg-[#FAF7F1] px-4 pt-[calc(6rem+env(safe-area-inset-top))] text-center sm:pt-24">
        <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-500">
          <AlertTriangle className="h-7 w-7" aria-hidden />
        </span>
        <h1 className="font-serif text-2xl font-medium text-stone-900 sm:text-[28px]">
          Something went wrong
        </h1>
        <p className="text-sm text-stone-500">
          We couldn&apos;t load your landlord profile. Please refresh the page
          or contact support if the problem persists.
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
    <div className="min-h-[100dvh] bg-white">
      <div className="mx-auto max-w-5xl py-6 sm:py-8">
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
            <p className="text-[13px] font-medium text-white/70">
              Landlord profile
            </p>
            <h1 className="mt-1.5 font-serif text-[28px] font-medium leading-tight tracking-tight sm:text-4xl">
              {displayName ? `Hello, ${displayName}` : "Edit your profile"}
            </h1>
            <p className="mt-2.5 text-sm leading-relaxed text-white/80 sm:text-base">
              Keep your details up to date — tenants see this on your listings.
            </p>
          </div>
        </section>

        <ProfileCompletenessBanner
          role="landlord"
          percentage={profile?.profileCompleteness ?? 0}
          editHref="/landlord/dashboard/profile"
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
    </div>
  );
}

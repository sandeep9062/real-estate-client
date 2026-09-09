"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  useCreateProfileMutation,
  useCreateRoomFlatMutation,
} from "@/services/roommatesApi";

const NEEDS_PROPERTY = ["has_room", "swap", "temporary_offer"];
const NEEDS_SEARCH_AREA = ["seeking_room", "temporary_seek"];

const HABIT_ENUMS = {
  smoking: ["yes", "no"],
  drinking: ["yes", "no"],
  nightlifeFriendly: ["yes", "no"],
  foodPreference: ["veg", "non_veg", "eggetarian", "vegan"],
  cleanlinessLevel: ["very_tidy", "moderately_tidy", "relaxed"],
};

function OnboardingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const intent = searchParams.get("intent");

  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [createProfile] = useCreateProfileMutation();
  const [createRoomFlat] = useCreateRoomFlatMutation();

  const [profile, setProfile] = useState<{
    bio: string;
    gender: string;
    occupation: string;
    habits: Record<string, string>;
    searchArea: { city: string; locality: string };
    budgetRange: { min: string; max: string };
  }>({
    bio: "",
    gender: "",
    occupation: "",
    habits: {
      smoking: "",
      drinking: "",
      nightlifeFriendly: "",
      foodPreference: "",
      cleanlinessLevel: "",
    },
    searchArea: { city: "", locality: "" },
    budgetRange: { min: "", max: "" },
  });

  const [roomFlat, setRoomFlat] = useState({
    title: "",
    rentAmount: "",
    roomType: "private_room",
    location: { city: "", locality: "" },
  });

  if (!intent) {
    return (
      <main className="mx-auto max-w-xl px-6 py-16">
        <p className="text-slate-700">
          Pick what you're here for first —{" "}
          <a href="/flatmates" className="underline">
            go back
          </a>
          .
        </p>
      </main>
    );
  }

  const needsProperty = NEEDS_PROPERTY.includes(intent);
  const needsSearchArea = NEEDS_SEARCH_AREA.includes(intent);

  function updateHabit(key: string, value: string) {
    setProfile((p) => ({ ...p, habits: { ...p.habits, [key]: value } }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const payload = {
        intent,
        bio: profile.bio,
        gender: profile.gender,
        occupation: profile.occupation,
        habits: profile.habits,
        ...(needsSearchArea && {
          searchArea: profile.searchArea,
          budgetRange: {
            min: Number(profile.budgetRange.min) || undefined,
            max: Number(profile.budgetRange.max) || undefined,
          },
        }),
      };

      // RoomFlat form fields are plain strings here; the API slice accepts
      // Partial<RoomFlat>, so cast once for the optional/looser client shape.
      await createProfile(payload as any).unwrap();

      if (needsProperty) {
        await createRoomFlat({
          ...roomFlat,
          rentAmount: Number(roomFlat.rentAmount),
        } as any).unwrap();
      }

      router.push("/flatmates/profile/me");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="mx-auto max-w-xl px-6 py-16">
      <h1 className="text-2xl font-semibold text-slate-900">
        Set up your profile
      </h1>
      <p className="mt-1 text-sm text-slate-600">Step {step} of 2</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        {step === 1 && (
          <>
            <Field label="About you">
              <textarea
                value={profile.bio}
                onChange={(e) => setProfile((p) => ({ ...p, bio: e.target.value }))}
                placeholder="A couple of lines about you"
                className="w-full rounded-md border border-slate-300 p-2 text-sm"
                rows={3}
              />
            </Field>

            <Field label="Occupation">
              <select
                value={profile.occupation}
                onChange={(e) =>
                  setProfile((p) => ({ ...p, occupation: e.target.value }))
                }
                className="w-full rounded-md border border-slate-300 p-2 text-sm"
              >
                <option value="">Select</option>
                <option value="student">Student</option>
                <option value="working_professional">Working professional</option>
                <option value="self_employed">Self-employed</option>
                <option value="other">Other</option>
              </select>
            </Field>

            {Object.entries(HABIT_ENUMS).map(([key, options]) => (
              <Field key={key} label={humanize(key)}>
                <div className="flex flex-wrap gap-2">
                  {options.map((opt) => (
                    <button
                      type="button"
                      key={opt}
                      onClick={() => updateHabit(key, opt)}
                      className={`rounded-full border px-3 py-1 text-sm ${
                        profile.habits[key] === opt
                          ? "border-slate-900 bg-slate-900 text-white"
                          : "border-slate-300 text-slate-700"
                      }`}
                    >
                      {humanize(opt)}
                    </button>
                  ))}
                </div>
              </Field>
            ))}

            {needsSearchArea && (
              <>
                <Field label="City you're searching in">
                  <input
                    value={profile.searchArea.city}
                    onChange={(e) =>
                      setProfile((p) => ({
                        ...p,
                        searchArea: { ...p.searchArea, city: e.target.value },
                      }))
                    }
                    className="w-full rounded-md border border-slate-300 p-2 text-sm"
                  />
                </Field>
                <Field label="Budget range (₹/month)">
                  <div className="flex gap-3">
                    <input
                      type="number"
                      placeholder="Min"
                      value={profile.budgetRange.min}
                      onChange={(e) =>
                        setProfile((p) => ({
                          ...p,
                          budgetRange: { ...p.budgetRange, min: e.target.value },
                        }))
                      }
                      className="w-full rounded-md border border-slate-300 p-2 text-sm"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={profile.budgetRange.max}
                      onChange={(e) =>
                        setProfile((p) => ({
                          ...p,
                          budgetRange: { ...p.budgetRange, max: e.target.value },
                        }))
                      }
                      className="w-full rounded-md border border-slate-300 p-2 text-sm"
                    />
                  </div>
                </Field>
              </>
            )}

            {needsProperty ? (
              <button
                type="button"
                onClick={() => setStep(2)}
                className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white"
              >
                Next: describe your place
              </button>
            ) : (
              <SubmitButton submitting={submitting} />
            )}
          </>
        )}

        {step === 2 && needsProperty && (
          <>
            <Field label="Listing title">
              <input
                value={roomFlat.title}
                onChange={(e) =>
                  setRoomFlat((r) => ({ ...r, title: e.target.value }))
                }
                placeholder="e.g. Sunny private room in Sector 21"
                className="w-full rounded-md border border-slate-300 p-2 text-sm"
              />
            </Field>

            <Field label="Rent (₹/month)">
              <input
                type="number"
                value={roomFlat.rentAmount}
                onChange={(e) =>
                  setRoomFlat((r) => ({ ...r, rentAmount: e.target.value }))
                }
                className="w-full rounded-md border border-slate-300 p-2 text-sm"
              />
            </Field>

            <Field label="Room type">
              <select
                value={roomFlat.roomType}
                onChange={(e) =>
                  setRoomFlat((r) => ({ ...r, roomType: e.target.value }))
                }
                className="w-full rounded-md border border-slate-300 p-2 text-sm"
              >
                <option value="private_room">Private room</option>
                <option value="shared_room">Shared room</option>
                <option value="entire_flat">Entire flat</option>
              </select>
            </Field>

            <Field label="City">
              <input
                value={roomFlat.location.city}
                onChange={(e) =>
                  setRoomFlat((r) => ({
                    ...r,
                    location: { ...r.location, city: e.target.value },
                  }))
                }
                className="w-full rounded-md border border-slate-300 p-2 text-sm"
              />
            </Field>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="rounded-md border border-slate-300 px-4 py-2 text-sm"
              >
                Back
              </button>
              <SubmitButton submitting={submitting} />
            </div>
          </>
        )}

        {error && <p className="text-sm text-red-600">{error}</p>}
      </form>
    </main>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-slate-800">
        {label}
      </label>
      {children}
    </div>
  );
}

function SubmitButton({ submitting }: { submitting: boolean }) {
  return (
    <button
      type="submit"
      disabled={submitting}
      className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
    >
      {submitting ? "Saving…" : "Create profile"}
    </button>
  );
}

function humanize(str: string) {
  return str
    .replace(/_/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/^./, (c) => c.toUpperCase());
}

function getErrorMessage(error: unknown): string {
  if (!error) return "";
  const e = error as {
    data?: { message?: string };
    error?: string;
    message?: string;
  };
  return (
    e.data?.message || e.error || e.message || "Something went wrong. Please try again."
  );
}

// useSearchParams() requires a Suspense boundary during static prerendering.
export default function OnboardingPage() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto max-w-xl px-6 py-16">
          <p className="text-sm text-slate-500">Loading…</p>
        </main>
      }
    >
      <OnboardingContent />
    </Suspense>
  );
}
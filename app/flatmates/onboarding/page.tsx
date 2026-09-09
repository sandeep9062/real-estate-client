"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, Loader2 } from "lucide-react";
import {
  useCreateProfileMutation,
  useCreateRoomFlatMutation,
} from "@/services/roommatesApi";

const BRAND = "#4161df";
const INK = "#161A2E";
const INK_SOFT = "#5C5F73";
const TINT_BG = "#EEF1FC";

const NEEDS_PROPERTY = ["has_room", "swap", "temporary_offer"];
const NEEDS_SEARCH_AREA = ["seeking_room", "temporary_seek"];

const HABIT_ENUMS = {
  smoking: ["yes", "no"],
  drinking: ["yes", "no"],
  nightlifeFriendly: ["yes", "no"],
  foodPreference: ["veg", "non_veg", "eggetarian", "vegan"],
  cleanlinessLevel: ["very_tidy", "moderately_tidy", "relaxed"],
};

const INTENT_LABELS: Record<string, string> = {
  has_room: "Have a room, need a flatmate",
  seeking_room: "Looking for a room",
  swap: "Want to swap flats",
  temporary_offer: "Offering a temporary stay",
  temporary_seek: "Need a temporary stay",
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
      <main className="mx-auto max-w-xl px-6 py-24 text-center">
        <p className="text-[15px]" style={{ color: INK_SOFT }}>
          Pick what you're here for first —{" "}
          <a
            href="/flatmates"
            className="font-semibold underline"
            style={{ color: BRAND }}
          >
            go back
          </a>
          .
        </p>
      </main>
    );
  }

  const needsProperty = NEEDS_PROPERTY.includes(intent);
  const needsSearchArea = NEEDS_SEARCH_AREA.includes(intent);
  const totalSteps = needsProperty ? 2 : 1;

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
    <main className="mx-auto max-w-xl px-6 py-14 sm:py-20">
      {INTENT_LABELS[intent] && (
        <span
          className="inline-block text-xs font-semibold px-3 py-1 rounded-full mb-4"
          style={{ background: TINT_BG, color: BRAND }}
        >
          {INTENT_LABELS[intent]}
        </span>
      )}

      <h1
        className="text-2xl sm:text-3xl font-bold tracking-tight"
        style={{ color: INK }}
      >
        Set up your profile
      </h1>

      {/* Step indicator */}
      <div className="mt-5 flex items-center gap-2">
        {Array.from({ length: totalSteps }).map((_, i) => {
          const n = i + 1;
          const isDone = n < step;
          const isActive = n === step;
          return (
            <div key={n} className="flex items-center gap-2 flex-1">
              <div
                className="flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold shrink-0 transition-colors"
                style={{
                  background: isDone || isActive ? BRAND : "#E5E7F2",
                  color: isDone || isActive ? "white" : INK_SOFT,
                }}
              >
                {isDone ? <Check className="w-3.5 h-3.5" /> : n}
              </div>
              {n < totalSteps && (
                <div
                  className="h-[2px] flex-1 rounded-full"
                  style={{ background: isDone ? BRAND : "#E5E7F2" }}
                />
              )}
            </div>
          );
        })}
      </div>

      <form onSubmit={handleSubmit} className="mt-8">
        <div
          className="rounded-2xl border bg-white p-6 sm:p-7 space-y-6"
          style={{ borderColor: "#E5E7F2" }}
        >
          {step === 1 && (
            <>
              <Field label="About you">
                <textarea
                  value={profile.bio}
                  onChange={(e) =>
                    setProfile((p) => ({ ...p, bio: e.target.value }))
                  }
                  placeholder="A couple of lines about you"
                  className="w-full rounded-lg border p-2.5 text-sm outline-none transition-shadow focus:ring-2"
                  style={{ borderColor: "#D8DCEC" }}
                  rows={3}
                />
              </Field>

              <Field label="Occupation">
                <select
                  value={profile.occupation}
                  onChange={(e) =>
                    setProfile((p) => ({ ...p, occupation: e.target.value }))
                  }
                  className="w-full rounded-lg border p-2.5 text-sm outline-none transition-shadow focus:ring-2"
                  style={{ borderColor: "#D8DCEC" }}
                >
                  <option value="">Select</option>
                  <option value="student">Student</option>
                  <option value="working_professional">
                    Working professional
                  </option>
                  <option value="self_employed">Self-employed</option>
                  <option value="other">Other</option>
                </select>
              </Field>

              {Object.entries(HABIT_ENUMS).map(([key, options]) => (
                <Field key={key} label={humanize(key)}>
                  <div className="flex flex-wrap gap-2">
                    {options.map((opt) => {
                      const selected = profile.habits[key] === opt;
                      return (
                        <button
                          type="button"
                          key={opt}
                          onClick={() => updateHabit(key, opt)}
                          className="rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors"
                          style={
                            selected
                              ? {
                                  background: BRAND,
                                  borderColor: BRAND,
                                  color: "white",
                                }
                              : { borderColor: "#D8DCEC", color: INK_SOFT }
                          }
                        >
                          {humanize(opt)}
                        </button>
                      );
                    })}
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
                      className="w-full rounded-lg border p-2.5 text-sm outline-none transition-shadow focus:ring-2"
                      style={{ borderColor: "#D8DCEC" }}
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
                            budgetRange: {
                              ...p.budgetRange,
                              min: e.target.value,
                            },
                          }))
                        }
                        className="w-full rounded-lg border p-2.5 text-sm outline-none transition-shadow focus:ring-2"
                        style={{ borderColor: "#D8DCEC" }}
                      />
                      <input
                        type="number"
                        placeholder="Max"
                        value={profile.budgetRange.max}
                        onChange={(e) =>
                          setProfile((p) => ({
                            ...p,
                            budgetRange: {
                              ...p.budgetRange,
                              max: e.target.value,
                            },
                          }))
                        }
                        className="w-full rounded-lg border p-2.5 text-sm outline-none transition-shadow focus:ring-2"
                        style={{ borderColor: "#D8DCEC" }}
                      />
                    </div>
                  </Field>
                </>
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
                  className="w-full rounded-lg border p-2.5 text-sm outline-none transition-shadow focus:ring-2"
                  style={{ borderColor: "#D8DCEC" }}
                />
              </Field>

              <Field label="Rent (₹/month)">
                <input
                  type="number"
                  value={roomFlat.rentAmount}
                  onChange={(e) =>
                    setRoomFlat((r) => ({ ...r, rentAmount: e.target.value }))
                  }
                  className="w-full rounded-lg border p-2.5 text-sm outline-none transition-shadow focus:ring-2"
                  style={{ borderColor: "#D8DCEC" }}
                />
              </Field>

              <Field label="Room type">
                <select
                  value={roomFlat.roomType}
                  onChange={(e) =>
                    setRoomFlat((r) => ({ ...r, roomType: e.target.value }))
                  }
                  className="w-full rounded-lg border p-2.5 text-sm outline-none transition-shadow focus:ring-2"
                  style={{ borderColor: "#D8DCEC" }}
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
                  className="w-full rounded-lg border p-2.5 text-sm outline-none transition-shadow focus:ring-2"
                  style={{ borderColor: "#D8DCEC" }}
                />
              </Field>
            </>
          )}

          {error && (
            <div
              className="rounded-lg border-l-[3px] bg-rose-50/70 px-3.5 py-2.5 text-sm text-rose-700"
              style={{ borderLeftColor: "#e11d48" }}
            >
              {error}
            </div>
          )}
        </div>

        <div className="mt-6 flex gap-3">
          {step === 2 && (
            <button
              type="button"
              onClick={() => setStep(1)}
              className="inline-flex items-center gap-1.5 rounded-full border px-5 py-2.5 text-sm font-semibold transition-colors hover:bg-[#EEF1FC]"
              style={{ borderColor: "#D8DCEC", color: INK }}
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          )}

          {step === 1 && needsProperty ? (
            <button
              type="button"
              onClick={() => setStep(2)}
              className="ml-auto inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors"
              style={{ background: BRAND }}
            >
              Next: describe your place
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={submitting}
              className="ml-auto inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors disabled:opacity-60"
              style={{ background: BRAND }}
            >
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {submitting ? "Saving…" : "Create profile"}
            </button>
          )}
        </div>
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
      <label
        className="mb-1.5 block text-sm font-semibold"
        style={{ color: "#161A2E" }}
      >
        {label}
      </label>
      {children}
    </div>
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
    e.data?.message ||
    e.error ||
    e.message ||
    "Something went wrong. Please try again."
  );
}

export default function OnboardingPage() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto max-w-xl px-6 py-24 flex justify-center">
          <Loader2
            className="w-5 h-5 animate-spin"
            style={{ color: "#4161df" }}
          />
        </main>
      }
    >
      <OnboardingContent />
    </Suspense>
  );
}

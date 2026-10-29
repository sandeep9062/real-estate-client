"use client";

import { useState } from "react";
import { useSelector } from "react-redux";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { selectUser } from "@/store/authSlice";
import {
  useGetOwnProfileQuery,
  useGetPublicProfileQuery,
  useSendConnectionRequestMutation,
} from "@/services/roommatesApi";
import {
  User,
  MapPin,
  Calendar,
  Briefcase,
  Moon,
  Languages,
  Heart,
  ShieldCheck,
  Cigarette,
  Wine,
  Music,
  Utensils,
  Sparkles,
  Users,
  Home,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowLeft,
  Link2,
  Check,
  Search,
  type LucideIcon,
} from "lucide-react";

const BRAND = "#4161df";
const INK = "#161A2E";
const INK_SOFT = "#5C5F73";
const TINT_BG = "#EEF1FC";
const BORDER = "#E5E7F2";

// Labels + accent colors for the profile-type badge (have_room vs no_room).
const TYPE_STYLES: Record<
  string,
  { label: string; icon: LucideIcon; accent: string; accentBg: string }
> = {
  have_room: {
    label: "Has a room",
    icon: Users,
    accent: "#059669",
    accentBg: "#ECFDF5",
  },
  no_room: {
    label: "Looking for a room",
    icon: Search,
    accent: BRAND,
    accentBg: TINT_BG,
  },
};

function TypeBadge({ type }: { type?: string }) {
  if (!type) return null;
  const cfg = TYPE_STYLES[type];
  if (!cfg) return null;
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold"
      style={{ background: cfg.accentBg, color: cfg.accent }}
    >
      <cfg.icon className="h-3 w-3" />
      {cfg.label}
    </span>
  );
}

export default function PublicProfilePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const currentUser = useSelector(selectUser);
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const isOwnProfile = id === "me";

  const {
    data: ownProfile,
    isLoading: isLoadingOwn,
    error: ownProfileError,
  } = useGetOwnProfileQuery(undefined, { skip: !isOwnProfile });

  const {
    data: publicProfile,
    isLoading: isLoadingPublic,
    error: publicProfileError,
  } = useGetPublicProfileQuery(id, { skip: isOwnProfile || !id });

  const profile = isOwnProfile ? ownProfile : publicProfile;
  const isLoading = isOwnProfile ? isLoadingOwn : isLoadingPublic;
  const profileError = isOwnProfile ? ownProfileError : publicProfileError;

  const [sendConnectionRequest, { isLoading: sending }] =
    useSendConnectionRequestMutation();

  const error = submitError || getErrorMessage(profileError);

  async function handleConnect(e: React.FormEvent) {
    e.preventDefault();
    if (isOwnProfile) return;
    if (!currentUser) {
      router.push("/login");
      return;
    }
    setSubmitError(null);
    try {
      await sendConnectionRequest({ toProfileId: id, message }).unwrap();
      setSent(true);
    } catch (err) {
      setSubmitError(getErrorMessage(err));
    }
  }

  function handleCopyLink() {
    if (typeof window === "undefined") return;
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (error && !profile) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-lg items-center justify-center px-6 py-16">
        <div
          className="flex items-center gap-2.5 rounded-xl border-l-[3px] bg-rose-50/70 px-4 py-3"
          style={{ borderLeftColor: "#e11d48" }}
        >
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
          <p className="text-sm text-rose-700">{error}</p>
        </div>
      </div>
    );
  }

  if (isLoading || !profile) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-lg items-center justify-center px-6 py-16">
        <Loader2 className="h-6 w-6 animate-spin" style={{ color: BRAND }} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 sm:pb-12">
      {/* Utility bar */}
      <div className="mb-4 flex items-center justify-between">
        <Link
          href="/flatmates/browse"
          className="inline-flex items-center gap-1.5 text-sm font-semibold transition-colors hover:opacity-75"
          style={{ color: INK_SOFT }}
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to browse
        </Link>
        <button
          onClick={handleCopyLink}
          className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors hover:bg-[#EEF1FC]"
          style={{ borderColor: BORDER, color: copied ? "#059669" : INK_SOFT }}
        >
          {copied ? (
            <Check className="h-3.5 w-3.5" />
          ) : (
            <Link2 className="h-3.5 w-3.5" />
          )}
          {copied ? "Copied" : "Copy link"}
        </button>
      </div>

      {/* Header card */}
      <div
        className="overflow-hidden rounded-2xl border bg-white"
        style={{ borderColor: BORDER }}
      >
        <div
          className="h-28 sm:h-32"
          style={{
            background: "linear-gradient(135deg, #4161df 0%, #2b3f9e 100%)",
          }}
        />
        <div className="px-5 pb-5 sm:px-7 sm:pb-7">
          <div className="-mt-12 flex items-end gap-4 sm:-mt-14">
            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl border-4 border-white bg-white shadow-md sm:h-28 sm:w-28">
              <User
                className="h-11 w-11 sm:h-12 sm:w-12"
                style={{ color: BRAND }}
              />
            </div>
            <div className="min-w-0 flex-1 pb-1">
              <h1
                className="truncate text-xl font-bold sm:text-[26px]"
                style={{ color: INK }}
              >
                {profile.gender ? humanize(profile.gender) : "Roommate"}
              </h1>
              {profile.occupation && (
                <p className="mt-0.5 text-sm" style={{ color: INK_SOFT }}>
                  {humanize(profile.occupation)}
                </p>
              )}
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <TypeBadge type={profile.type} />
            {profile.idVerified && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                <ShieldCheck className="h-3 w-3" />
                ID verified
              </span>
            )}
            <StatusBadge status={profile.status} />
            {isOwnProfile && (
              <span
                className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold"
                style={{ background: TINT_BG, color: "#2b3f9e" }}
              >
                You
              </span>
            )}
          </div>

          {profile.bio && (
            <p
              className="mt-4 border-t pt-4 text-sm leading-relaxed"
              style={{ borderColor: BORDER, color: INK_SOFT }}
            >
              {profile.bio}
            </p>
          )}

          {profile.photos?.length ? (
            <div className="mt-4 flex flex-wrap gap-2.5">
              {profile.photos.map((photo, index) => (
                <img
                  key={`${photo.slice(0, 48)}-${index}`}
                  src={photo}
                  alt={`${profile.gender ? humanize(profile.gender) : "Roommate"} photo ${index + 1}`}
                  className="h-20 w-20 shrink-0 cursor-pointer rounded-xl border object-cover transition-transform hover:scale-105"
                  style={{ borderColor: BORDER }}
                  loading="lazy"
                  onClick={() => window.open(photo, "_blank")}
                />
              ))}
            </div>
          ) : null}
        </div>
      </div>

      {/* Details grid */}
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <SectionCard icon={<Sparkles className="h-4 w-4" />} title="Lifestyle">
          <DetailRows
            items={[
              {
                icon: <Cigarette className="h-3.5 w-3.5" />,
                label: "Smoking",
                value: profile.habits?.smoking,
              },
              {
                icon: <Wine className="h-3.5 w-3.5" />,
                label: "Drinking",
                value: profile.habits?.drinking,
              },
              {
                icon: <Music className="h-3.5 w-3.5" />,
                label: "Nightlife",
                value: profile.habits?.nightlifeFriendly,
              },
              {
                icon: <Utensils className="h-3.5 w-3.5" />,
                label: "Food",
                value: profile.habits?.foodPreference,
              },
              {
                icon: <Sparkles className="h-3.5 w-3.5" />,
                label: "Cleanliness",
                value: profile.habits?.cleanlinessLevel,
              },
              {
                icon: <Users className="h-3.5 w-3.5" />,
                label: "Guests",
                value: profile.habits?.guestsFrequency,
              },
            ]}
          />
        </SectionCard>
        <SectionCard icon={<Clock className="h-4 w-4" />} title="Routine">
          <DetailRows
            items={[
              {
                icon: <Briefcase className="h-3.5 w-3.5" />,
                label: "Work schedule",
                value: profile.workSchedule,
              },
              {
                icon: <Moon className="h-3.5 w-3.5" />,
                label: "Sleep schedule",
                value: profile.sleepSchedule,
              },
              {
                icon: <Languages className="h-3.5 w-3.5" />,
                label: "Languages",
                value: profile.languages?.length
                  ? profile.languages.join(", ")
                  : undefined,
              },
            ]}
          />
        </SectionCard>
        <SectionCard icon={<Heart className="h-4 w-4" />} title="Looking for">
          <DetailRows
            items={[
              {
                icon: <User className="h-3.5 w-3.5" />,
                label: "Gender preference",
                value: profile.lookingFor?.genderPreference,
              },
              {
                icon: <Calendar className="h-3.5 w-3.5" />,
                label: "Age range",
                value:
                  profile.lookingFor?.ageRange?.min ||
                  profile.lookingFor?.ageRange?.max
                    ? `${profile.lookingFor?.ageRange?.min ?? "?"} – ${profile.lookingFor?.ageRange?.max ?? "?"}`
                    : undefined,
              },
              {
                icon: <Briefcase className="h-3.5 w-3.5" />,
                label: "Occupation",
                value: profile.lookingFor?.occupation,
              },
            ]}
          />
        </SectionCard>
        {profile.searchArea?.city && (
          <SectionCard
            icon={<MapPin className="h-4 w-4" />}
            title="Searching in"
          >
            <DetailRows
              items={[
                {
                  icon: <Home className="h-3.5 w-3.5" />,
                  label: "City",
                  value: profile.searchArea.city,
                },
                {
                  icon: <MapPin className="h-3.5 w-3.5" />,
                  label: "Locality",
                  value: profile.searchArea.locality,
                },
                {
                  icon: <Clock className="h-3.5 w-3.5" />,
                  label: "Radius",
                  value: profile.searchArea.radiusKm
                    ? `${profile.searchArea.radiusKm} km`
                    : undefined,
                },
              ]}
            />
            {profile.budgetRange?.min || profile.budgetRange?.max ? (
              <p
                className="mt-3 border-t pt-3 text-sm font-semibold"
                style={{ borderColor: BORDER, color: INK }}
              >
                Budget: ₹{profile.budgetRange?.min?.toLocaleString() ?? "0"} – ₹
                {profile.budgetRange?.max?.toLocaleString() ?? "∞"}
              </p>
            ) : null}
          </SectionCard>
        )}
      </div>

      {/* Action area */}
      <div className="mt-6">
        {isOwnProfile ? (
          <div
            className="rounded-2xl border bg-white p-5 sm:p-6"
            style={{ borderColor: BORDER }}
          >
            <div className="flex items-start gap-3.5">
              <span
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
                style={{ background: TINT_BG, color: BRAND }}
              >
                <User className="h-4 w-4" />
              </span>
              <div>
                <h3 className="text-sm font-semibold" style={{ color: INK }}>
                  This is your profile
                </h3>
                <p className="mt-1 text-sm" style={{ color: INK_SOFT }}>
                  {profile.isComplete
                    ? "Your profile is complete and visible to other users."
                    : "Finish setting up your profile so others can find you."}
                </p>
                <Link
                  href="/flatmates/onboarding?edit=1"
                  className="mt-3 inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                  style={{ background: BRAND }}
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  {profile.isComplete ? "Edit profile" : "Complete profile"}
                </Link>
              </div>
            </div>
          </div>
        ) : sent ? (
          <div
            className="flex items-center gap-2.5 rounded-2xl border-l-[3px] bg-emerald-50/70 px-5 py-4"
            style={{ borderLeftColor: "#059669" }}
          >
            <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
            <p className="text-sm font-semibold text-emerald-700">
              Connection request sent!
            </p>
          </div>
        ) : (
          <div
            className="rounded-2xl border bg-white p-5 sm:p-6"
            style={{ borderColor: BORDER }}
          >
            <h3
              className="flex items-center gap-2 text-sm font-semibold"
              style={{ color: INK }}
            >
              <Heart className="h-4 w-4" style={{ color: BRAND }} />
              Send a connection request
            </h3>
            <form onSubmit={handleConnect} className="mt-3 space-y-3">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Say a bit about why you'd be a good fit (optional)"
                className="w-full rounded-xl border p-3 text-sm outline-none transition-shadow focus:ring-2"
                style={{
                  borderColor: BORDER,
                  background: "#FAFBFF",
                  color: INK,
                }}
                rows={3}
              />
              {error && (
                <p className="flex items-center gap-1.5 text-sm text-rose-600">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  {error}
                </p>
              )}
              <button
                type="submit"
                disabled={sending}
                className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
                style={{ background: BRAND }}
              >
                {sending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                {sending ? "Sending…" : "Connect"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

function SectionCard({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="rounded-2xl border bg-white p-5"
      style={{ borderColor: BORDER }}
    >
      <h2
        className="flex items-center gap-2.5 text-sm font-semibold"
        style={{ color: INK }}
      >
        <span
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full"
          style={{ border: `1.5px solid ${BRAND}`, color: BRAND }}
        >
          {icon}
        </span>
        {title}
      </h2>
      <div className="mt-3.5">{children}</div>
    </div>
  );
}

function DetailRows({
  items,
}: {
  items: { icon: React.ReactNode; label: string; value?: string }[];
}) {
  const filled = items.filter((i) => i.value);
  if (filled.length === 0)
    return (
      <div
        className="rounded-lg border border-dashed px-3 py-3 text-center text-xs"
        style={{ borderColor: BORDER, color: "#9CA3AF" }}
      >
        Not shared yet
      </div>
    );
  return (
    <dl className="divide-y" style={{ borderColor: "#F3F4F8" }}>
      {filled.map((item) => (
        <div
          key={item.label}
          className="flex items-center gap-2.5 py-2 first:pt-0 last:pb-0"
          style={{ borderColor: "#F3F4F8" }}
        >
          <span style={{ color: "#9CA3AF" }}>{item.icon}</span>
          <dt className="text-xs" style={{ color: INK_SOFT }}>
            {item.label}
          </dt>
          <dd className="ml-auto text-xs font-semibold" style={{ color: INK }}>
            {humanize(item.value!)}
          </dd>
        </div>
      ))}
    </dl>
  );
}

function StatusBadge({ status }: { status?: string }) {
  if (!status || status === "active") return null;
  const map: Record<string, { label: string; cls: string }> = {
    paused: { label: "Paused", cls: "bg-amber-50 text-amber-700" },
    matched: { label: "Matched", cls: "bg-violet-50 text-violet-700" },
    closed: { label: "Closed", cls: "bg-slate-100 text-slate-500" },
  };
  const cfg = map[status];
  if (!cfg) return null;
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${cfg.cls}`}
    >
      {cfg.label}
    </span>
  );
}

function humanize(str: string) {
  if (!str) return "";
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

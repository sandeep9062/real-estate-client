"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
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
} from "lucide-react";

const BRAND = "#4161df";

export default function PublicProfilePage() {
  const { id } = useParams<{ id: string }>();
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

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
    setSubmitError(null);
    try {
      await sendConnectionRequest({ toProfileId: id, message }).unwrap();
      setSent(true);
    } catch (err) {
      setSubmitError(getErrorMessage(err));
    }
  }

  if (error && !profile) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-lg items-center justify-center px-6 py-16">
        <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <p className="text-sm text-red-700">{error}</p>
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
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-12">
      {/* Header card */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div
          className="h-24 sm:h-28"
          style={{ background: "linear-gradient(135deg, #4161df 0%, #2b3f9e 100%)" }}
        />
        <div className="px-5 pb-5 sm:px-6 sm:pb-6">
          <div className="-mt-10 flex items-end gap-4">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border-4 border-white bg-white shadow-md">
              <User className="h-10 w-10" style={{ color: BRAND }} />
            </div>
            <div className="min-w-0 flex-1 pb-1">
              <h1 className="truncate text-xl font-bold text-slate-900 sm:text-2xl">
                {profile.gender ? humanize(profile.gender) : "Roommate"}
                {profile.occupation && (
                  <span className="font-normal text-slate-500">
                    {" · "}{humanize(profile.occupation)}
                  </span>
                )}
              </h1>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                {profile.idVerified && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
                    <ShieldCheck className="h-3 w-3" />
                    ID verified
                  </span>
                )}
                <StatusBadge status={profile.status} />
                {isOwnProfile && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                    You
                  </span>
                )}
              </div>
            </div>
          </div>
          {profile.bio && (
            <p className="mt-4 text-sm leading-relaxed text-slate-600">{profile.bio}</p>
          )}
        </div>
      </div>

      {/* Details grid */}
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <SectionCard icon={<Sparkles className="h-4 w-4" />} title="Lifestyle">
          <DetailRows
            items={[
              { icon: <Cigarette className="h-3.5 w-3.5" />, label: "Smoking", value: profile.habits?.smoking },
              { icon: <Wine className="h-3.5 w-3.5" />, label: "Drinking", value: profile.habits?.drinking },
              { icon: <Music className="h-3.5 w-3.5" />, label: "Nightlife", value: profile.habits?.nightlifeFriendly },
              { icon: <Utensils className="h-3.5 w-3.5" />, label: "Food", value: profile.habits?.foodPreference },
              { icon: <Sparkles className="h-3.5 w-3.5" />, label: "Cleanliness", value: profile.habits?.cleanlinessLevel },
              { icon: <Users className="h-3.5 w-3.5" />, label: "Guests", value: profile.habits?.guestsFrequency },
            ]}
          />
        </SectionCard>
        <SectionCard icon={<Clock className="h-4 w-4" />} title="Routine">
          <DetailRows
            items={[
              { icon: <Briefcase className="h-3.5 w-3.5" />, label: "Work schedule", value: profile.workSchedule },
              { icon: <Moon className="h-3.5 w-3.5" />, label: "Sleep schedule", value: profile.sleepSchedule },
              { icon: <Languages className="h-3.5 w-3.5" />, label: "Languages", value: profile.languages?.length ? profile.languages.join(", ") : undefined },
            ]}
          />
        </SectionCard>
        <SectionCard icon={<Heart className="h-4 w-4" />} title="Looking for">
          <DetailRows
            items={[
              { icon: <User className="h-3.5 w-3.5" />, label: "Gender preference", value: profile.lookingFor?.genderPreference },
              { icon: <Calendar className="h-3.5 w-3.5" />, label: "Age range", value: profile.lookingFor?.ageRange?.min || profile.lookingFor?.ageRange?.max ? `${profile.lookingFor?.ageRange?.min ?? "?"} – ${profile.lookingFor?.ageRange?.max ?? "?"}` : undefined },
              { icon: <Briefcase className="h-3.5 w-3.5" />, label: "Occupation", value: profile.lookingFor?.occupation },
            ]}
          />
        </SectionCard>
        {profile.searchArea?.city && (
          <SectionCard icon={<MapPin className="h-4 w-4" />} title="Searching in">
            <DetailRows
              items={[
                { icon: <Home className="h-3.5 w-3.5" />, label: "City", value: profile.searchArea.city },
                { icon: <MapPin className="h-3.5 w-3.5" />, label: "Locality", value: profile.searchArea.locality },
                { icon: <Clock className="h-3.5 w-3.5" />, label: "Radius", value: profile.searchArea.radiusKm ? `${profile.searchArea.radiusKm} km` : undefined },
              ]}
            />
            {profile.budgetRange?.min || profile.budgetRange?.max ? (
              <p className="mt-3 border-t border-slate-100 pt-3 text-sm font-medium text-slate-700">
                Budget: ₹{profile.budgetRange?.min?.toLocaleString() ?? "0"} – ₹{profile.budgetRange?.max?.toLocaleString() ?? "∞"}
              </p>
            ) : null}
          </SectionCard>
        )}
      </div>

      {/* Action area */}
      <div className="mt-6">
        {isOwnProfile ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl" style={{ background: "#4161df15" }}>
                <User className="h-4 w-4" style={{ color: BRAND }} />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-900">This is your profile</h3>
                <p className="mt-1 text-sm text-slate-500">
                  {profile.isComplete ? "Your profile is complete and visible to other users." : "Finish setting up your profile so others can find you."}
                </p>
                <Link href="/flatmates/onboarding" className="mt-3 inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90" style={{ background: BRAND }}>
                  <Sparkles className="h-3.5 w-3.5" />
                  {profile.isComplete ? "Edit profile" : "Complete profile"}
                </Link>
              </div>
            </div>
          </div>
        ) : sent ? (
          <div className="flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4">
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            <p className="text-sm font-medium text-emerald-700">Connection request sent!</p>
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-900">
              <Heart className="h-4 w-4" style={{ color: BRAND }} />
              Send a connection request
            </h3>
            <form onSubmit={handleConnect} className="mt-3 space-y-3">
              <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Say a bit about why you'd be a good fit (optional)" className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700 placeholder:text-slate-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#4161df]/30" rows={3} />
              {error && <p className="flex items-center gap-1.5 text-sm text-red-600"><AlertCircle className="h-3.5 w-3.5" />{error}</p>}
              <button type="submit" disabled={sending} className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60" style={{ background: BRAND }}>
                {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                {sending ? "Sending…" : "Connect"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

function SectionCard({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-900">
        <span style={{ color: BRAND }}>{icon}</span>
        {title}
      </h2>
      <div className="mt-3">{children}</div>
    </div>
  );
}

function DetailRows({ items }: { items: { icon: React.ReactNode; label: string; value?: string }[] }) {
  const filled = items.filter((i) => i.value);
  if (filled.length === 0) return <p className="text-sm text-slate-400">No info yet</p>;
  return (
    <dl className="space-y-2.5">
      {filled.map((item) => (
        <div key={item.label} className="flex items-center gap-2.5">
          <span className="text-slate-400">{item.icon}</span>
          <dt className="text-xs text-slate-500">{item.label}</dt>
          <dd className="ml-auto text-xs font-medium text-slate-800">{humanize(item.value!)}</dd>
        </div>
      ))}
    </dl>
  );
}

function StatusBadge({ status }: { status?: string }) {
  if (!status || status === "active") return null;
  const map: Record<string, { label: string; cls: string }> = {
    paused: { label: "Paused", cls: "bg-amber-50 text-amber-700" },
    matched: { label: "Matched", cls: "bg-purple-50 text-purple-700" },
    closed: { label: "Closed", cls: "bg-slate-100 text-slate-500" },
  };
  const cfg = map[status];
  if (!cfg) return null;
  return <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${cfg.cls}`}>{cfg.label}</span>;
}

function humanize(str: string) {
  if (!str) return "";
  return str.replace(/_/g, " ").replace(/([a-z])([A-Z])/g, "$1 $2").replace(/^./, (c) => c.toUpperCase());
}

function getErrorMessage(error: unknown): string {
  if (!error) return "";
  const e = error as { data?: { message?: string }; error?: string; message?: string };
  return e.data?.message || e.error || e.message || "Something went wrong. Please try again.";
}
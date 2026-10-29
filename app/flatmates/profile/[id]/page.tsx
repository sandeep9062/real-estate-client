"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { useSelector } from "react-redux";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { selectUser } from "@/store/authSlice";
import {
  useGetOwnProfileQuery,
  useGetPublicProfileQuery,
  useSendConnectionRequestMutation,
  useRespondToConnectionRequestMutation,
  useListMyConnectionsQuery,
  type RoomFlat,
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
  IndianRupee,
  ChevronLeft,
  ChevronRight,
  X,
  type LucideIcon,
} from "lucide-react";

const BRAND = "#4161df";
const INK = "#161A2E";
const INK_SOFT = "#5C5F73";
const TINT_BG = "#EEF1FC";
const BORDER = "#E5E7F2";

// Soft limit for the optional note sent with a request. Adjust to match the
// backend validation if it enforces a different length.
const MAX_MESSAGE = 500;

// Where "Back" goes. The browse page lives at /flatmates (it reads ?city=).
const BROWSE_HREF = "/flatmates";

const TYPE_STYLES: Record<
  string,
  { label: string; icon: LucideIcon; accent: string; accentBg: string }
> = {
  have_room: {
    label: "Has a room",
    icon: Home,
    accent: "#92400E",
    accentBg: "#FEF3C7",
  },
  no_room: {
    label: "Looking for a room",
    icon: Search,
    accent: "#3451c9",
    accentBg: TINT_BG,
  },
};

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

function humanize(str?: string) {
  if (!str) return "";
  return str
    .replace(/_/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/^./, (c) => c.toUpperCase());
}

// Friendlier wording for yes/no fields; anything unmapped falls back to
// humanize().
const VALUE_LABELS: Record<string, Record<string, string>> = {
  smoking: { yes: "Smokes", no: "Non-smoker" },
  drinking: { yes: "Drinks", no: "Doesn't drink" },
  nightlife: { yes: "Enjoys nightlife", no: "Prefers quiet nights" },
};

function fmt(value: string | undefined, field?: string): string | undefined {
  if (!value) return undefined;
  return (field && VALUE_LABELS[field]?.[value]) || humanize(value);
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

function getRefId(ref: unknown): string | undefined {
  if (!ref) return undefined;
  if (typeof ref === "string") return ref;
  return (ref as { _id?: string })._id;
}

// `user` is typed as a string id in roommatesApi but is populated by the
// profile endpoints; read it defensively either way.
function getPopulatedUser(profile: unknown): {
  name?: string;
  avatarUrl?: string;
} {
  const u = (profile as { user?: unknown } | null)?.user;
  if (u && typeof u === "object") {
    return u as { name?: string; avatarUrl?: string };
  }
  return {};
}

function getPopulatedRoom(
  profile: unknown,
): Partial<Pick<RoomFlat, "rentAmount" | "location">> | undefined {
  const r = (profile as { roomFlat?: unknown } | null)?.roomFlat;
  if (r && typeof r === "object") {
    return r as Partial<Pick<RoomFlat, "rentAmount" | "location">>;
  }
  return undefined;
}

function inr(n?: number) {
  return typeof n === "number" ? `₹${n.toLocaleString("en-IN")}` : undefined;
}

/* ------------------------------------------------------------------ */
/* Small components                                                    */
/* ------------------------------------------------------------------ */

function TypeBadge({ type }: { type?: string }) {
  const cfg = type ? TYPE_STYLES[type] : undefined;
  if (!cfg) return null;
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
      style={{ background: cfg.accentBg, color: cfg.accent }}
    >
      <cfg.icon className="h-3.5 w-3.5" />
      {cfg.label}
    </span>
  );
}

function StatusBadge({ status }: { status?: string }) {
  if (!status || status === "active") return null;
  const map: Record<string, { label: string; cls: string }> = {
    paused: { label: "Paused", cls: "bg-amber-50 text-amber-700" },
    matched: { label: "Matched", cls: "bg-violet-50 text-violet-700" },
    closed: { label: "Closed", cls: "bg-slate-100 text-slate-600" },
  };
  const cfg = map[status];
  if (!cfg) return null;
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${cfg.cls}`}
    >
      {cfg.label}
    </span>
  );
}

function SectionCard({
  icon,
  title,
  children,
}: {
  icon: ReactNode;
  title: string;
  children: ReactNode;
}) {
  return (
    <section
      className="rounded-2xl border bg-white p-5"
      style={{ borderColor: BORDER }}
    >
      <h2
        className="flex items-center gap-2.5 text-sm font-semibold"
        style={{ color: INK }}
      >
        <span
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
          style={{ background: TINT_BG, color: BRAND }}
        >
          {icon}
        </span>
        {title}
      </h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function DetailRows({
  items,
}: {
  items: { icon: ReactNode; label: string; value?: string }[];
}) {
  const filled = items.filter((i) => i.value);
  if (filled.length === 0) {
    return (
      <p
        className="rounded-lg bg-[#F7F8FC] px-3 py-3 text-center text-xs"
        style={{ color: INK_SOFT }}
      >
        Nothing shared here yet.
      </p>
    );
  }
  return (
    <dl className="divide-y divide-[#F0F1F7]">
      {filled.map((item) => (
        <div
          key={item.label}
          className="flex items-center gap-2.5 py-2.5 first:pt-0 last:pb-0"
        >
          <span className="text-gray-400">{item.icon}</span>
          <dt className="text-[13px]" style={{ color: INK_SOFT }}>
            {item.label}
          </dt>
          <dd
            className="ml-auto text-right text-[13px] font-medium"
            style={{ color: INK }}
          >
            {item.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

function ProfileSkeleton() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
      <div className="mb-4 h-5 w-32 animate-pulse rounded bg-gray-100" />
      <div
        className="overflow-hidden rounded-2xl border bg-white"
        style={{ borderColor: BORDER }}
      >
        <div className="h-24 animate-pulse bg-gray-100 sm:h-28" />
        <div className="space-y-3 p-6">
          <div className="h-6 w-48 animate-pulse rounded bg-gray-100" />
          <div className="h-4 w-32 animate-pulse rounded bg-gray-100" />
          <div className="h-4 w-full animate-pulse rounded bg-gray-100" />
        </div>
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-44 animate-pulse rounded-2xl border bg-white"
            style={{ borderColor: BORDER }}
          />
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Photo gallery + lightbox                                            */
/* ------------------------------------------------------------------ */

function Lightbox({
  photos,
  index,
  alt,
  onClose,
  onChange,
}: {
  photos: string[];
  index: number;
  alt: string;
  onClose: () => void;
  onChange: (i: number) => void;
}) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft")
        onChange((index - 1 + photos.length) % photos.length);
      if (e.key === "ArrowRight") onChange((index + 1) % photos.length);
    }
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [index, photos.length, onClose, onChange]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Photo viewer"
      className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/85 p-4"
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close photo viewer"
        className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
      >
        <X className="h-5 w-5" />
      </button>
      {photos.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous photo"
            onClick={(e) => {
              e.stopPropagation();
              onChange((index - 1 + photos.length) % photos.length);
            }}
            className="absolute left-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:left-6"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            aria-label="Next photo"
            onClick={(e) => {
              e.stopPropagation();
              onChange((index + 1) % photos.length);
            }}
            className="absolute right-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:right-6"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      )}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={photos[index]}
        alt={`${alt} photo ${index + 1}`}
        className="max-h-[85vh] max-w-full rounded-lg object-contain"
        onClick={(e) => e.stopPropagation()}
      />
      {photos.length > 1 && (
        <p className="absolute bottom-4 text-xs text-white/80">
          {index + 1} / {photos.length}
        </p>
      )}
    </div>
  );
}

function PhotoGallery({
  photos,
  alt,
  onOpen,
}: {
  photos: string[];
  alt: string;
  onOpen: (i: number) => void;
}) {
  const shown = photos.slice(0, 5);
  const extra = photos.length - shown.length;

  function cellClass(i: number): string {
    if (shown.length === 1) return "col-span-4 row-span-2";
    if (shown.length === 2) return "col-span-2 row-span-2";
    if (shown.length === 3)
      return i === 0 ? "col-span-2 row-span-2" : "col-span-2 row-span-1";
    return i === 0 ? "col-span-2 row-span-2" : "col-span-1 row-span-1";
  }

  return (
    <div className="grid h-60 grid-cols-4 grid-rows-2 gap-2 sm:h-80">
      {shown.map((photo, i) => (
        <button
          key={`${i}-${photo.slice(0, 40)}`}
          type="button"
          onClick={() => onOpen(i)}
          aria-label={`Open photo ${i + 1} of ${photos.length}`}
          className={`group relative overflow-hidden rounded-xl bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4161df] ${cellClass(i)}`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={photo}
            alt={`${alt} photo ${i + 1}`}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {extra > 0 && i === shown.length - 1 && (
            <span className="absolute inset-0 flex items-center justify-center bg-black/50 text-sm font-semibold text-white">
              +{extra} more
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function PublicProfilePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const currentUser = useSelector(selectUser);
  const [message, setMessage] = useState("");
  const [sentLocal, setSentLocal] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  const { data: connectionsData } = useListMyConnectionsQuery(undefined, {
    skip: !currentUser || isOwnProfile,
  });

  const [sendConnectionRequest, { isLoading: sending }] =
    useSendConnectionRequestMutation();
  const [respondToConnectionRequest, { isLoading: withdrawing }] =
    useRespondToConnectionRequestMutation();

  const profile = isOwnProfile ? ownProfile : publicProfile;
  const isLoading = isOwnProfile ? isLoadingOwn : isLoadingPublic;
  const profileError = getErrorMessage(
    isOwnProfile ? ownProfileError : publicProfileError,
  );

  // A pending outgoing request to this profile, from the live connections list.
  const pendingConnection = useMemo(
    () =>
      (connectionsData ?? []).find(
        (c) => c.status === "pending" && getRefId(c.toProfile) === id,
      ),
    [connectionsData, id],
  );
  const requestPending = !!pendingConnection || sentLocal;

  // Clean up the "Copied" timer on unmount.
  useEffect(
    () => () => {
      if (copyTimer.current) clearTimeout(copyTimer.current);
    },
    [],
  );

  async function handleConnect(e: React.FormEvent) {
    e.preventDefault();
    if (isOwnProfile || requestPending) return;
    if (!currentUser) {
      router.push("/login");
      return;
    }
    setSubmitError(null);
    try {
      await sendConnectionRequest({
        toProfileId: id,
        message: message.trim() || undefined,
      }).unwrap();
      setSentLocal(true);
      setMessage("");
    } catch (err) {
      setSubmitError(getErrorMessage(err));
    }
  }

  async function handleWithdraw() {
    setSubmitError(null);
    try {
      if (pendingConnection) {
        await respondToConnectionRequest({
          id: pendingConnection._id,
          status: "withdrawn",
        }).unwrap();
      }
      setSentLocal(false);
    } catch (err) {
      setSubmitError(getErrorMessage(err));
    }
  }

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      if (copyTimer.current) clearTimeout(copyTimer.current);
      copyTimer.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      setSubmitError("Couldn't copy the link. Copy it from the address bar.");
    }
  }

  /* ---------------- states ---------------- */

  if (isLoading) return <ProfileSkeleton />;

  if (!profile) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center gap-4 px-6 py-16 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-50">
          <AlertCircle className="h-5 w-5 text-rose-600" />
        </span>
        <div>
          <h1 className="text-lg font-semibold" style={{ color: INK }}>
            {profileError
              ? "We couldn't load this profile"
              : "Profile not found"}
          </h1>
          <p className="mt-1 text-sm" style={{ color: INK_SOFT }}>
            {profileError ||
              (isOwnProfile
                ? "You haven't created a flatmate profile yet."
                : "It may have been removed or is no longer available.")}
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          <Link
            href={BROWSE_HREF}
            className="inline-flex items-center gap-1.5 rounded-lg border bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-50"
            style={{ borderColor: BORDER, color: INK }}
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to flatmates
          </Link>
          {isOwnProfile && (
            <Link
              href="/flatmates/onboarding"
              className="inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#3451c9]"
              style={{ background: BRAND }}
            >
              Create your profile
            </Link>
          )}
        </div>
      </div>
    );
  }

  /* ---------------- derived display data ---------------- */

  const populatedUser = getPopulatedUser(profile);
  const displayName = populatedUser.name?.trim() || "Flatmate";
  const initial = (displayName.charAt(0) || "F").toUpperCase();
  const subtitle = [fmt(profile.gender), fmt(profile.occupation)]
    .filter(Boolean)
    .join(" · ");

  const room = getPopulatedRoom(profile);
  const roomPlace = [room?.location?.sector, room?.location?.city]
    .filter(Boolean)
    .join(", ");

  const budgetMin = profile.budgetRange?.min;
  const budgetMax = profile.budgetRange?.max;
  const budgetText =
    budgetMin || budgetMax
      ? `${inr(budgetMin ?? 0)} – ${budgetMax ? inr(budgetMax) : "No limit"}`
      : undefined;

  const photos = (profile.photos ?? []).filter(Boolean);
  const canConnect = !profile.status || profile.status === "active";

  /* ---------------- connect panel ---------------- */

  const connectPanel = isOwnProfile ? (
    <div
      className="rounded-2xl border bg-white p-5"
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
          <h2 className="text-sm font-semibold" style={{ color: INK }}>
            This is how others see you
          </h2>
          <p className="mt-1 text-sm" style={{ color: INK_SOFT }}>
            {profile.isComplete
              ? "Your profile is complete and visible to other users."
              : "Finish setting up your profile so others can find you."}
          </p>
          <Link
            href="/flatmates/onboarding?edit=1"
            className="mt-3 inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#3451c9]"
            style={{ background: BRAND }}
          >
            <Sparkles className="h-3.5 w-3.5" />
            {profile.isComplete ? "Edit profile" : "Complete profile"}
          </Link>
        </div>
      </div>
    </div>
  ) : requestPending ? (
    <div
      className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5"
      role="status"
    >
      <div className="flex items-start gap-3">
        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
        <div>
          <h2 className="text-sm font-semibold text-emerald-800">
            Request sent
          </h2>
          <p className="mt-1 text-sm text-emerald-700">
            {displayName} has been notified. You&apos;ll hear back once they
            respond.
          </p>
          <button
            type="button"
            onClick={handleWithdraw}
            disabled={withdrawing}
            className="mt-3 text-sm font-medium text-emerald-800 underline underline-offset-2 transition-colors hover:text-rose-600 disabled:opacity-60"
          >
            {withdrawing ? "Withdrawing…" : "Withdraw request"}
          </button>
          {submitError && (
            <p className="mt-2 text-sm text-rose-600">{submitError}</p>
          )}
        </div>
      </div>
    </div>
  ) : !canConnect ? (
    <div
      className="rounded-2xl border bg-white p-5"
      style={{ borderColor: BORDER }}
    >
      <h2 className="text-sm font-semibold" style={{ color: INK }}>
        Not accepting requests
      </h2>
      <p className="mt-1 text-sm" style={{ color: INK_SOFT }}>
        This profile is {profile.status}, so new connection requests are turned
        off for now.
      </p>
    </div>
  ) : (
    <div
      id="connect"
      className="scroll-mt-24 rounded-2xl border bg-white p-5"
      style={{ borderColor: BORDER }}
    >
      <h2
        className="flex items-center gap-2 text-sm font-semibold"
        style={{ color: INK }}
      >
        <Heart className="h-4 w-4" style={{ color: BRAND }} />
        Connect with {displayName}
      </h2>
      <p className="mt-1 text-xs" style={{ color: INK_SOFT }}>
        A short note helps them decide. Mention your move-in date, budget or
        daily routine.
      </p>
      <form onSubmit={handleConnect} className="mt-3 space-y-3">
        <div>
          <label htmlFor="connect-message" className="sr-only">
            Message (optional)
          </label>
          <textarea
            id="connect-message"
            value={message}
            maxLength={MAX_MESSAGE}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Hi! I think we could be a good fit because…"
            rows={4}
            className="w-full resize-none rounded-xl border bg-[#FAFBFF] p-3 text-sm outline-none transition-colors placeholder:text-gray-400 focus:border-[#4161df] focus:ring-2 focus:ring-[#4161df]/15"
            style={{ borderColor: BORDER, color: INK }}
          />
          <p className="mt-1 text-right text-[11px] text-gray-400">
            {message.length}/{MAX_MESSAGE}
          </p>
        </div>
        {submitError && (
          <p
            role="alert"
            className="flex items-start gap-1.5 text-sm text-rose-600"
          >
            <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            {submitError}
          </p>
        )}
        <button
          type="submit"
          disabled={sending}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#3451c9] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4161df] disabled:opacity-60"
          style={{ background: BRAND }}
        >
          {sending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
          {sending
            ? "Sending…"
            : currentUser
              ? "Send connection request"
              : "Log in to connect"}
        </button>
      </form>
    </div>
  );

  /* ---------------- render ---------------- */

  return (
    <div className="mx-auto max-w-6xl px-4 pb-24 pt-6 sm:px-6 lg:pb-12">
      {/* Utility bar */}
      <div className="mb-4 flex items-center justify-between">
        <Link
          href={BROWSE_HREF}
          className="inline-flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-[#4161df]"
          style={{ color: INK_SOFT }}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to flatmates
        </Link>
        <button
          type="button"
          onClick={handleCopyLink}
          className="inline-flex items-center gap-1.5 rounded-lg border bg-white px-3 py-1.5 text-xs font-medium transition-colors hover:bg-gray-50"
          style={{ borderColor: BORDER, color: copied ? "#059669" : INK_SOFT }}
        >
          {copied ? (
            <Check className="h-3.5 w-3.5" />
          ) : (
            <Link2 className="h-3.5 w-3.5" />
          )}
          <span aria-live="polite">{copied ? "Link copied" : "Copy link"}</span>
        </button>
      </div>

      {/* Header card */}
      <div
        className="overflow-hidden rounded-2xl border bg-white"
        style={{ borderColor: BORDER }}
      >
        <div
          className="h-24 sm:h-28"
          style={{ background: `linear-gradient(120deg, ${TINT_BG}, #DCE3FA)` }}
        />
        <div className="px-5 pb-6 sm:px-7">
          <div className="-mt-12 flex items-end gap-4 sm:-mt-14">
            <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-4 border-white bg-white shadow-md sm:h-28 sm:w-28">
              {populatedUser.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={populatedUser.avatarUrl}
                  alt={displayName}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span
                  className="flex h-full w-full items-center justify-center text-3xl font-semibold"
                  style={{ background: TINT_BG, color: BRAND }}
                >
                  {initial}
                </span>
              )}
            </div>
            <div className="min-w-0 flex-1 pb-1">
              <h1
                className="truncate text-xl font-bold sm:text-2xl"
                style={{ color: INK }}
              >
                {displayName}
              </h1>
              {subtitle && (
                <p className="mt-0.5 text-sm" style={{ color: INK_SOFT }}>
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <TypeBadge type={profile.type} />
            {profile.idVerified && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                <ShieldCheck className="h-3.5 w-3.5" />
                ID verified
              </span>
            )}
            <StatusBadge status={profile.status} />
            {isOwnProfile && (
              <span
                className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium"
                style={{ background: TINT_BG, color: "#2b3f9e" }}
              >
                Your profile
              </span>
            )}
          </div>

          {profile.bio && (
            <div className="mt-5 border-t pt-5" style={{ borderColor: BORDER }}>
              <h2 className="text-sm font-semibold" style={{ color: INK }}>
                About
              </h2>
              <p
                className="mt-1.5 max-w-3xl whitespace-pre-line text-sm leading-relaxed"
                style={{ color: INK_SOFT }}
              >
                {profile.bio}
              </p>
            </div>
          )}

          {photos.length > 0 && (
            <div className="mt-5">
              <PhotoGallery
                photos={photos}
                alt={displayName}
                onOpen={setLightbox}
              />
            </div>
          )}
        </div>
      </div>

      {/* Body: details + sticky connect panel */}
      <div className="mt-4 grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="grid gap-4 sm:grid-cols-2">
          {room && (room.rentAmount || roomPlace) && (
            <div className="sm:col-span-2">
              <SectionCard icon={<Home className="h-4 w-4" />} title="The room">
                <DetailRows
                  items={[
                    {
                      icon: <IndianRupee className="h-3.5 w-3.5" />,
                      label: "Rent",
                      value: room.rentAmount
                        ? `${inr(room.rentAmount)}/mo`
                        : undefined,
                    },
                    {
                      icon: <MapPin className="h-3.5 w-3.5" />,
                      label: "Location",
                      value: roomPlace || undefined,
                    },
                  ]}
                />
              </SectionCard>
            </div>
          )}

          <SectionCard
            icon={<Sparkles className="h-4 w-4" />}
            title="Lifestyle"
          >
            <DetailRows
              items={[
                {
                  icon: <Cigarette className="h-3.5 w-3.5" />,
                  label: "Smoking",
                  value: fmt(profile.habits?.smoking, "smoking"),
                },
                {
                  icon: <Wine className="h-3.5 w-3.5" />,
                  label: "Drinking",
                  value: fmt(profile.habits?.drinking, "drinking"),
                },
                {
                  icon: <Music className="h-3.5 w-3.5" />,
                  label: "Nightlife",
                  value: fmt(profile.habits?.nightlifeFriendly, "nightlife"),
                },
                {
                  icon: <Utensils className="h-3.5 w-3.5" />,
                  label: "Food",
                  value: fmt(profile.habits?.foodPreference),
                },
                {
                  icon: <Sparkles className="h-3.5 w-3.5" />,
                  label: "Cleanliness",
                  value: fmt(profile.habits?.cleanlinessLevel),
                },
                {
                  icon: <Users className="h-3.5 w-3.5" />,
                  label: "Guests",
                  value: fmt(profile.habits?.guestsFrequency),
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
                  value: fmt(profile.workSchedule),
                },
                {
                  icon: <Moon className="h-3.5 w-3.5" />,
                  label: "Sleep schedule",
                  value: fmt(profile.sleepSchedule),
                },
                {
                  icon: <Languages className="h-3.5 w-3.5" />,
                  label: "Languages",
                  value: profile.languages?.length
                    ? profile.languages.map((l) => humanize(l)).join(", ")
                    : undefined,
                },
              ]}
            />
          </SectionCard>

          <SectionCard
            icon={<Heart className="h-4 w-4" />}
            title="Looking for in a flatmate"
          >
            <DetailRows
              items={[
                {
                  icon: <User className="h-3.5 w-3.5" />,
                  label: "Gender",
                  value: fmt(profile.lookingFor?.genderPreference),
                },
                {
                  icon: <Calendar className="h-3.5 w-3.5" />,
                  label: "Age range",
                  value:
                    profile.lookingFor?.ageRange?.min ||
                    profile.lookingFor?.ageRange?.max
                      ? `${profile.lookingFor?.ageRange?.min ?? "Any"} – ${profile.lookingFor?.ageRange?.max ?? "Any"}`
                      : undefined,
                },
                {
                  icon: <Briefcase className="h-3.5 w-3.5" />,
                  label: "Occupation",
                  value: fmt(profile.lookingFor?.occupation),
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
                    icon: <MapPin className="h-3.5 w-3.5" />,
                    label: "Within",
                    value: profile.searchArea.radiusKm
                      ? `${profile.searchArea.radiusKm} km`
                      : undefined,
                  },
                  {
                    icon: <IndianRupee className="h-3.5 w-3.5" />,
                    label: "Budget",
                    value: budgetText ? `${budgetText}/mo` : undefined,
                  },
                ]}
              />
            </SectionCard>
          )}
        </div>

        {/* Connect panel: sticky on desktop */}
        <aside className="lg:sticky lg:top-24">{connectPanel}</aside>
      </div>

      {/* Mobile quick action */}
      {!isOwnProfile && !requestPending && canConnect && (
        <div
          className="fixed inset-x-0 bottom-0 z-40 border-t bg-white/95 p-3 backdrop-blur lg:hidden"
          style={{ borderColor: BORDER }}
        >
          <a
            href="#connect"
            className="flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-white"
            style={{ background: BRAND }}
          >
            <Send className="h-4 w-4" />
            Connect with {displayName}
          </a>
        </div>
      )}

      {lightbox !== null && photos.length > 0 && (
        <Lightbox
          photos={photos}
          index={Math.min(lightbox, photos.length - 1)}
          alt={displayName}
          onClose={() => setLightbox(null)}
          onChange={setLightbox}
        />
      )}
    </div>
  );
}

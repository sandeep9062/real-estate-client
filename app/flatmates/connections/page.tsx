"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  ArrowDownLeft,
  ArrowRight,
  ArrowUpRight,
  Briefcase,
  Check,
  Clock,
  Heart,
  Loader2,
  MessagesSquare,
  ShieldCheck,
  Sparkles,
  UserRound,
  X,
} from "lucide-react";
import {
  useGetOwnProfileQuery,
  useListMyConnectionsQuery,
  useRespondToConnectionRequestMutation,
  type FlatmateConnection,
  type RoommateProfile,
} from "@/services/roommatesApi";
import { toast } from "@/hooks/use-toast";

const BRAND = "#4161df";
const INK = "#161A2E";
const INK_SOFT = "#5C5F73";
const TINT_BG = "#EEF1FC";
const BORDER = "#E5E7F2";

type Tab = "received" | "sent" | "all";

const STATUS_STYLES: Record<
  string,
  { label: string; bg: string; color: string }
> = {
  pending: { label: "Pending", bg: "#FFFBEB", color: "#B45309" },
  accepted: { label: "Connected", bg: "#ECFDF5", color: "#047857" },
  declined: { label: "Declined", bg: "#FFF1F2", color: "#BE123C" },
  withdrawn: { label: "Withdrawn", bg: "#F1F5F9", color: "#64748B" },
};

const INTENT_LABELS: Record<string, string> = {
  has_room: "Has a room",
  seeking_room: "Looking for a room",
  swap: "Wants to swap",
  temporary_offer: "Offering short stay",
  temporary_seek: "Needs short stay",
  subletting_out: "Subletting",
};

function humanize(str: string) {
  return str.replace(/_/g, " ").replace(/^./, (c) => c.toUpperCase());
}

function timeAgo(iso: string) {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "";
  const diff = Date.now() - then;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
}

function asProfile(value: string | RoommateProfile | undefined) {
  return typeof value === "object" ? value : undefined;
}

function initialsOf(profile?: RoommateProfile) {
  const occupation = profile?.occupation;
  if (!occupation) return "R";
  const parts = occupation.split("_");
  return (
    (parts[0]?.[0] || "R").toUpperCase() + (parts[1]?.[0] || "").toUpperCase()
  );
}

export default function ConnectionsPage() {
  const {
    data: connections = [],
    isLoading: loading,
    error,
    refetch,
  } = useListMyConnectionsQuery();
  const [respondToConnectionRequest] = useRespondToConnectionRequestMutation();
  const [actionError, setActionError] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>("received");
  const [busyId, setBusyId] = useState<string | null>(null);

  // listMyConnections returns connections in both directions with both
  // profiles populated. To know which side is "mine" we fetch my own profile
  // id and compare. Skipped when there's nothing to classify.
  const { data: myProfile } = useGetOwnProfileQuery(undefined, {
    skip: loading || (!!error && !connections.length),
  });
  const myProfileId = myProfile?._id ?? null;

  const { received, sent, pendingReceivedCount } = useMemo(() => {
    const r: FlatmateConnection[] = [];
    const s: FlatmateConnection[] = [];
    if (!myProfileId) return { received: r, sent: s, pendingReceivedCount: 0 };

    for (const c of connections) {
      const fromId = asProfile(c.fromProfile)?._id;
      const toId = asProfile(c.toProfile)?._id;
      // Fall back to string form if either side isn't populated.
      const isFromMe = fromId
        ? fromId === myProfileId
        : c.fromProfile === myProfileId;
      if (isFromMe) s.push(c);
      else r.push(c);
    }
    return {
      received: r,
      sent: s,
      pendingReceivedCount: r.filter((c) => c.status === "pending").length,
    };
  }, [connections, myProfileId]);

  const visible =
    tab === "received" ? received : tab === "sent" ? sent : connections;

  const errorMessage = actionError || getErrorMessage(error);

  async function respond(
    id: string,
    status: "accepted" | "declined" | "withdrawn",
  ) {
    setActionError(null);
    setBusyId(id);
    try {
      await respondToConnectionRequest({ id, status }).unwrap();
      refetch();
      if (status === "accepted") toast.success("Connection accepted!");
      else if (status === "declined") toast("Request declined");
      else toast("Request withdrawn");
    } catch (err) {
      const message = getErrorMessage(err);
      setActionError(message);
      toast.error(message);
    } finally {
      setBusyId(null);
    }
  }

  const TABS: { key: Tab; label: string; count: number }[] = [
    { key: "received", label: "Received", count: received.length },
    { key: "sent", label: "Sent", count: sent.length },
    { key: "all", label: "All", count: connections.length },
  ];

  return (
    <main className="mx-auto w-full max-w-7xl px-4 pb-20 sm:px-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <span
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl"
          style={{ background: TINT_BG, color: BRAND }}
        >
          <MessagesSquare className="h-6 w-6" strokeWidth={1.9} />
        </span>
        <div>
          <h1
            className="text-2xl font-bold tracking-tight"
            style={{ color: INK }}
          >
            Connection requests
          </h1>
          <p className="mt-1 text-sm" style={{ color: INK_SOFT }}>
            People who want to share a place with you — and requests you&apos;ve
            sent.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div
        className="mt-6 inline-flex rounded-full border bg-white p-1"
        style={{ borderColor: BORDER }}
        role="tablist"
        aria-label="Connection request filters"
      >
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            role="tab"
            aria-selected={tab === t.key}
            onClick={() => setTab(t.key)}
            className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-[13px] font-semibold transition-colors ${
              tab === t.key ? "text-white" : "hover:bg-[#EEF1FC]"
            }`}
            style={tab === t.key ? { background: BRAND } : { color: INK_SOFT }}
          >
            {t.label}
            {t.key === "received" && pendingReceivedCount > 0 && (
              <span
                className={`rounded-full px-1.5 text-[10px] font-bold ${
                  tab === "received" ? "bg-white/25" : ""
                }`}
                style={
                  tab === "received"
                    ? undefined
                    : { background: "#FFFBEB", color: "#B45309" }
                }
              >
                {pendingReceivedCount}
              </span>
            )}
            {t.key !== "received" && t.count > 0 && tab !== t.key && (
              <span className="text-[11px] font-medium opacity-70">
                {t.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {errorMessage && (
        <div
          className="mt-4 flex items-center gap-2.5 rounded-xl border-l-[3px] bg-rose-50/70 px-4 py-3"
          style={{ borderLeftColor: "#e11d48" }}
        >
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
          <p className="text-sm text-rose-700">{errorMessage}</p>
        </div>
      )}

      {loading && (
        <div className="mt-6 space-y-3">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="animate-pulse rounded-2xl border bg-white p-5"
              style={{ borderColor: BORDER }}
            >
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-full bg-slate-100" />
                <div className="flex-1 space-y-2">
                  <div className="h-3.5 w-40 rounded bg-slate-100" />
                  <div className="h-3 w-24 rounded bg-slate-100" />
                </div>
                <div className="h-6 w-16 rounded-full bg-slate-100" />
              </div>
              <div className="mt-4 h-3 w-full rounded bg-slate-100" />
              <div className="mt-2 h-3 w-2/3 rounded bg-slate-100" />
            </div>
          ))}
        </div>
      )}

      {!loading && !errorMessage && visible.length === 0 && (
        <div
          className="mt-6 flex flex-col items-center gap-3 rounded-2xl border border-dashed px-6 py-14 text-center"
          style={{ borderColor: BORDER }}
        >
          <span
            className="flex h-12 w-12 items-center justify-center rounded-full"
            style={{ background: TINT_BG, color: BRAND }}
          >
            <Heart className="h-5 w-5" />
          </span>
          <p className="text-sm font-semibold" style={{ color: INK }}>
            {tab === "received"
              ? "No requests received yet"
              : tab === "sent"
                ? "You haven't sent any requests"
                : "No connection requests yet"}
          </p>
          <p
            className="max-w-sm text-[13px] leading-relaxed"
            style={{ color: INK_SOFT }}
          >
            {tab === "sent"
              ? "When you find a room or flatmate you like, send them a connection request from their profile."
              : "Once you connect with someone (or they connect with you), it'll show up here."}
          </p>
          <Link
            href="/flatmates/browse"
            className="mt-2 inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 text-[13px] font-semibold text-white transition-opacity hover:opacity-90"
            style={{ background: BRAND }}
          >
            Browse rooms &amp; flatmates
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      )}

      {!loading && visible.length > 0 && (
        <div className="mt-6 space-y-3">
          {visible.map((c) => (
            <ConnectionCard
              key={c._id}
              connection={c}
              myProfileId={myProfileId}
              busy={busyId === c._id}
              onRespond={respond}
            />
          ))}
        </div>
      )}
    </main>
  );
}

function ConnectionCard({
  connection,
  myProfileId,
  busy,
  onRespond,
}: {
  connection: FlatmateConnection;
  myProfileId: string | null;
  busy: boolean;
  onRespond: (
    id: string,
    status: "accepted" | "declined" | "withdrawn",
  ) => void;
}) {
  // listMyConnections returns both directions with both sides populated.
  // Determine which side is "mine" so we can show the other person and the
  // right actions (accept/decline for incoming, withdraw for outgoing).
  const fromId = asProfile(connection.fromProfile)?._id;
  const isFromMe = fromId
    ? fromId === myProfileId
    : connection.fromProfile === myProfileId;
  const isReceived = !isFromMe;

  const otherValue = isFromMe ? connection.toProfile : connection.fromProfile;
  const other = asProfile(otherValue);
  const otherId =
    typeof otherValue === "object"
      ? otherValue._id
      : typeof otherValue === "string"
        ? otherValue
        : null;
  const profileHref = otherId ? `/flatmates/profile/${otherId}` : null;

  const statusCfg = STATUS_STYLES[connection.status] ?? STATUS_STYLES.pending;
  const intent = other?.intent
    ? (INTENT_LABELS[other.intent] ?? humanize(other.intent))
    : "";
  const areaLine = other?.searchArea
    ? [other.searchArea.city, other.searchArea.locality]
        .filter(Boolean)
        .join(", ")
    : "";
  const name = other?.occupation
    ? humanize(other.occupation)
    : other?.gender
      ? humanize(other.gender)
      : "Roommate";
  const pending = connection.status === "pending";

  return (
    <article
      className="rounded-2xl border bg-white p-5"
      style={{ borderColor: BORDER }}
    >
      {/* Header row */}
      <div className="flex flex-wrap items-center gap-3">
        <div
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full"
          style={{ background: TINT_BG, color: BRAND }}
        >
          {other ? (
            <span className="text-sm font-bold">{initialsOf(other)}</span>
          ) : (
            <UserRound className="h-5 w-5" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold" style={{ color: INK }}>
            {other ? (
              profileHref && connection.status !== "pending" ? (
                <Link
                  href={profileHref}
                  className="transition-opacity hover:opacity-75"
                >
                  {name}
                </Link>
              ) : (
                name
              )
            ) : (
              "Profile unavailable"
            )}
          </p>
          <p className="truncate text-xs" style={{ color: INK_SOFT }}>
            {[intent, areaLine].filter(Boolean).join(" · ") ||
              "No details shared yet"}
          </p>
        </div>
        <span
          className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold"
          style={{ background: statusCfg.bg, color: statusCfg.color }}
        >
          {pending && isReceived && <ArrowDownLeft className="h-3 w-3" />}
          {pending && isFromMe && <ArrowUpRight className="h-3 w-3" />}
          {connection.status === "accepted" && <Check className="h-3 w-3" />}
          {statusCfg.label}
        </span>
      </div>

      {/* Meta chips */}
      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
        {typeof connection.matchScore === "number" && (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 font-medium text-emerald-700">
            <Sparkles className="h-3 w-3" />
            {Math.round(connection.matchScore)}% match
          </span>
        )}
        {other?.idVerified && (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 font-medium text-emerald-700">
            <ShieldCheck className="h-3 w-3" />
            ID verified
          </span>
        )}
        <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 font-medium text-slate-500">
          <Clock className="h-3 w-3" />
          {timeAgo(connection.createdAt) || "recently"}
        </span>
      </div>

      {/* Message */}
      {connection.message && (
        <p
          className="mt-3 rounded-r-lg border-l-[3px] bg-slate-50 px-3 py-2 text-[13px] leading-relaxed"
          style={{ borderLeftColor: "#CBD5E1", color: INK_SOFT }}
        >
          &ldquo;{connection.message}&rdquo;
        </p>
      )}

      {/* Actions */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        {isReceived && pending && (
          <>
            <button
              type="button"
              disabled={busy}
              onClick={() => onRespond(connection._id, "accepted")}
              className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-[13px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
              style={{ background: BRAND }}
            >
              {busy ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Check className="h-3.5 w-3.5" />
              )}
              {busy ? "Updating…" : "Accept"}
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => onRespond(connection._id, "declined")}
              className="inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-[13px] font-semibold transition-colors hover:bg-rose-50 disabled:opacity-60"
              style={{ borderColor: BORDER, color: "#BE123C" }}
            >
              <X className="h-3.5 w-3.5" />
              Decline
            </button>
          </>
        )}

        {isFromMe && pending && (
          <button
            type="button"
            disabled={busy}
            onClick={() => onRespond(connection._id, "withdrawn")}
            className="inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-[13px] font-semibold transition-colors hover:bg-[#EEF1FC] disabled:opacity-60"
            style={{ borderColor: BORDER, color: INK_SOFT }}
          >
            {busy && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            {busy ? "Withdrawing…" : "Withdraw request"}
          </button>
        )}

        {connection.status === "accepted" && (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
            <Heart className="h-3 w-3" />
            You&apos;re connected
          </span>
        )}
        {connection.status === "declined" && (
          <span className="text-xs" style={{ color: INK_SOFT }}>
            This request was declined.
          </span>
        )}
        {connection.status === "withdrawn" && (
          <span className="text-xs" style={{ color: INK_SOFT }}>
            This request was withdrawn.
          </span>
        )}

        {profileHref && connection.status !== "pending" && (
          <Link
            href={profileHref}
            className="ml-auto inline-flex items-center gap-1.5 text-[13px] font-semibold transition-colors hover:opacity-75"
            style={{ color: BRAND }}
          >
            View profile
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        )}
      </div>
    </article>
  );
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

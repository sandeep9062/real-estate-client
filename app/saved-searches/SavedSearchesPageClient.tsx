"use client";

import { useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  Bell,
  BellRing,
  LogIn,
  Mail,
  Plus,
  RefreshCw,
  Search,
  Trash2,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import {
  useListSavedSearchesQuery,
  useDeleteSavedSearchMutation,
  useUpdateSavedSearchMutation,
} from "@/services/savedSearchesApi";
import { buildSavedSearchHref } from "@/lib/cityRouteUtils";

type SavedSearchItem = NonNullable<
  ReturnType<typeof useListSavedSearchesQuery>["data"]
>[number];

/* ───────────────────────── filter → readable chips ───────────────────────── */

const cap = (v: string) => v.charAt(0).toUpperCase() + v.slice(1);

const prettyKey = (k: string) =>
  k.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase());

function toNumber(v: unknown): number | null {
  const n =
    typeof v === "number"
      ? v
      : typeof v === "string" && v.trim() !== ""
        ? Number(v)
        : NaN;
  return Number.isFinite(n) ? n : null;
}

function formatPrice(n: number): string {
  if (n >= 1e7) return `₹${Number((n / 1e7).toFixed(2))} Cr`;
  if (n >= 1e5) return `₹${Number((n / 1e5).toFixed(2))} Lakh`;
  return `₹${n.toLocaleString("en-IN")}`;
}

/**
 * Turns a saved-search `filters` object into short human-readable chips.
 * Known keys get friendly formatting; anything unrecognised falls back to a
 * generic "Key: value" chip so nothing is silently dropped.
 */
function filterChips(filters: Record<string, unknown> | null | undefined) {
  if (!filters) return [];
  const chips: string[] = [];
  const used = new Set<string>();
  const take = (k: string) => {
    used.add(k);
    return filters[k];
  };
  const str = (v: unknown) =>
    typeof v === "string" && v.trim() ? v.trim() : null;

  const query = str(take("query"));
  if (query) chips.push(`“${query}”`);

  const city = str(take("city"));
  if (city) chips.push(cap(city));

  const landmark = str(take("landmark"));
  if (landmark) chips.push(`Near ${cap(landmark)}`);

  const beds = toNumber(take("bedrooms"));
  if (beds) chips.push(`${beds} BHK`);

  const deal = str(take("deal"));
  if (deal) chips.push(cap(deal));

  const type = str(take("type"));
  if (type) chips.push(type);

  const category = str(take("propertyCategory"));
  if (category) chips.push(category);

  const min = toNumber(take("minPrice"));
  const max = toNumber(take("maxPrice"));
  if (min && max) chips.push(`${formatPrice(min)} – ${formatPrice(max)}`);
  else if (max) chips.push(`Under ${formatPrice(max)}`);
  else if (min) chips.push(`Above ${formatPrice(min)}`);

  const state = str(take("state"));
  if (state) chips.push(cap(state));

  take("country"); // always India — no need to show

  for (const [k, v] of Object.entries(filters)) {
    if (used.has(k)) continue;
    if (v === undefined || v === null || v === "" || v === false) continue;
    if (v === true) chips.push(prettyKey(k));
    else if (typeof v === "string" || typeof v === "number")
      chips.push(`${prettyKey(k)}: ${v}`);
    else if (
      Array.isArray(v) &&
      v.length > 0 &&
      v.every((x) => typeof x === "string" || typeof x === "number")
    )
      chips.push(`${prettyKey(k)}: ${v.join(", ")}`);
  }

  return chips;
}

/* ───────────────────────────── shared layout bits ───────────────────────── */

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#EEF1FC] via-gray-50 to-gray-50 px-4 pb-20 pt-28 sm:px-6 md:pt-32">
      <div className="mx-auto max-w-4xl">{children}</div>
    </div>
  );
}

/**
 * Heading + intro copy, rendered in every state (loading / error / list) so the
 * route always ships a server-rendered <h1> and descriptive text instead of
 * only the transient loading placeholder.
 */
function SavedSearchesHeader({
  count,
  showNewSearch = true,
}: {
  count?: number;
  showNewSearch?: boolean;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#EEF1FC] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#4161df]">
          <BellRing className="h-3.5 w-3.5" />
          Alerts
        </span>
        <h1 className="mt-3 flex items-center gap-2.5 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Saved searches
          {count ? (
            <span className="rounded-full bg-[#EEF1FC] px-2.5 py-0.5 text-xs font-bold text-[#4161df]">
              {count}
            </span>
          ) : null}
        </h1>
        <p className="mt-1.5 max-w-xl text-sm text-slate-500">
          Get email and in-app alerts when new listings match your filters. We
          check for new matches every 15 minutes.
        </p>
      </div>

      {showNewSearch && (
        <Link
          href="/properties"
          className="inline-flex items-center gap-1.5 rounded-full bg-[#4161df] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-[#3451c7] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4161df] focus-visible:ring-offset-2"
        >
          <Plus className="h-4 w-4" />
          New search
        </Link>
      )}
    </div>
  );
}

function MessageCard({
  icon,
  title,
  children,
  tone = "brand",
}: {
  icon: React.ReactNode;
  title: string;
  children?: React.ReactNode;
  tone?: "brand" | "danger";
}) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
      <span
        className={`mx-auto flex size-14 items-center justify-center rounded-2xl ${
          tone === "danger"
            ? "bg-rose-50 text-rose-600"
            : "bg-[#EEF1FC] text-[#4161df]"
        }`}
      >
        {icon}
      </span>
      <h2 className="mt-4 text-lg font-bold text-slate-900">{title}</h2>
      <div className="mx-auto mt-1.5 max-w-md text-sm text-slate-500">
        {children}
      </div>
    </div>
  );
}

const primaryBtn =
  "inline-flex items-center justify-center gap-1.5 rounded-full bg-[#4161df] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-[#3451c7] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4161df] focus-visible:ring-offset-2";
const secondaryBtn =
  "inline-flex items-center justify-center gap-1.5 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#4161df]/40 hover:bg-[#EEF1FC] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4161df] focus-visible:ring-offset-2";

/* ─────────────────────────────── list card ──────────────────────────────── */

function SavedSearchCard({
  s,
  busy,
  confirming,
  onToggle,
  onAskDelete,
  onCancelDelete,
  onConfirmDelete,
}: {
  s: SavedSearchItem;
  busy: boolean;
  confirming: boolean;
  onToggle: () => void;
  onAskDelete: () => void;
  onCancelDelete: () => void;
  onConfirmDelete: () => void;
}) {
  const filters = s.filters as Record<string, unknown>;
  const chips = filterChips(filters);

  return (
    <li
      className={`rounded-2xl border p-4 shadow-sm transition-all sm:p-5 ${
        s.isActive
          ? "border-slate-200 bg-white hover:shadow-md"
          : "border-slate-200 bg-slate-50/70"
      }`}
    >
      <div className="flex flex-wrap items-center gap-2">
        <h2
          className={`min-w-0 truncate text-base font-semibold ${
            s.isActive ? "text-slate-900" : "text-slate-500"
          }`}
        >
          {s.name}
        </h2>
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${
            s.isActive
              ? "bg-emerald-50 text-emerald-700"
              : "bg-amber-50 text-amber-700"
          }`}
        >
          <span
            className={`size-1.5 rounded-full ${
              s.isActive ? "bg-emerald-500" : "bg-amber-500"
            }`}
          />
          {s.isActive ? "Active" : "Paused"}
        </span>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {chips.length > 0 ? (
          chips.map((chip, i) => (
            <span
              key={`${chip}-${i}`}
              className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700"
            >
              {chip}
            </span>
          ))
        ) : (
          <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-500">
            All properties
          </span>
        )}
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
        {/* delivery channels */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-medium">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 ${
              s.notifyEmail
                ? "bg-[#EEF1FC] text-[#4161df]"
                : "bg-slate-100 text-slate-400"
            }`}
          >
            <Mail className="h-3.5 w-3.5" />
            Email {s.notifyEmail ? "on" : "off"}
          </span>
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 ${
              s.notifyInApp
                ? "bg-[#EEF1FC] text-[#4161df]"
                : "bg-slate-100 text-slate-400"
            }`}
          >
            <Bell className="h-3.5 w-3.5" />
            In-app {s.notifyInApp ? "on" : "off"}
          </span>
        </div>

        {/* actions */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <button
            type="button"
            role="switch"
            aria-checked={s.isActive}
            aria-label={`${s.isActive ? "Pause" : "Resume"} alerts for ${s.name}`}
            disabled={busy}
            onClick={onToggle}
            className="inline-flex items-center gap-2 rounded-full py-1 pr-2 text-xs font-medium text-slate-600 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4161df] disabled:opacity-50"
          >
            <span
              className={`relative h-5 w-9 shrink-0 rounded-full transition-colors ${
                s.isActive ? "bg-[#4161df]" : "bg-slate-300"
              }`}
            >
              <span
                className={`absolute left-0.5 top-0.5 size-4 rounded-full bg-white shadow transition-transform ${
                  s.isActive ? "translate-x-4" : ""
                }`}
              />
            </span>
            {s.isActive ? "Alerts on" : "Alerts paused"}
          </button>

          {confirming ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 py-1 pl-3 pr-1 text-xs font-medium text-rose-700">
              Delete?
              <button
                type="button"
                disabled={busy}
                onClick={onConfirmDelete}
                className="rounded-full bg-rose-600 px-2.5 py-1 font-semibold text-white transition-colors hover:bg-rose-700 disabled:opacity-50"
              >
                {busy ? "Deleting…" : "Yes"}
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={onCancelDelete}
                className="rounded-full px-2.5 py-1 font-semibold text-slate-600 transition-colors hover:bg-white disabled:opacity-50"
              >
                No
              </button>
            </span>
          ) : (
            <button
              type="button"
              aria-label={`Delete saved search ${s.name}`}
              disabled={busy}
              onClick={onAskDelete}
              className="rounded-full p-2.5 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 disabled:opacity-50"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}

          <Link
            href={buildSavedSearchHref(filters)}
            className="inline-flex items-center gap-1.5 rounded-full bg-[#4161df] px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-[#3451c7] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4161df] focus-visible:ring-offset-2"
          >
            <Search className="h-4 w-4" />
            Run search
          </Link>
        </div>
      </div>
    </li>
  );
}

function SkeletonCard() {
  return (
    <li className="animate-pulse rounded-2xl border border-slate-200 bg-white p-5">
      <div className="h-4 w-1/3 rounded bg-slate-200" />
      <div className="mt-3 flex gap-2">
        <div className="h-6 w-20 rounded-full bg-slate-100" />
        <div className="h-6 w-16 rounded-full bg-slate-100" />
        <div className="h-6 w-24 rounded-full bg-slate-100" />
      </div>
      <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
        <div className="h-7 w-40 rounded-full bg-slate-100" />
        <div className="h-9 w-28 rounded-full bg-slate-200" />
      </div>
    </li>
  );
}

/* ──────────────────────────────── page ──────────────────────────────────── */

export default function SavedSearchesPageClient() {
  const { data, isLoading, isError, error, refetch } =
    useListSavedSearchesQuery();
  const [remove] = useDeleteSavedSearchMutation();
  const [update] = useUpdateSavedSearchMutation();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  const handleToggle = async (s: SavedSearchItem) => {
    setBusyId(s._id);
    try {
      await update({ id: s._id, patch: { isActive: !s.isActive } }).unwrap();
      toast.success(
        s.isActive ? "Alerts paused for this search" : "Alerts resumed",
      );
    } catch {
      toast.error("Could not update alerts. Try again.");
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (s: SavedSearchItem) => {
    setBusyId(s._id);
    try {
      await remove(s._id).unwrap();
      toast.success("Saved search deleted");
      setConfirmingId(null);
    } catch {
      toast.error("Could not delete saved search.");
    } finally {
      setBusyId(null);
    }
  };

  if (isLoading) {
    return (
      <Shell>
        <SavedSearchesHeader showNewSearch={false} />
        <ul className="space-y-4" role="status" aria-busy="true">
          <span className="sr-only">Loading saved searches…</span>
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </ul>
      </Shell>
    );
  }

  if (isError) {
    const status = (error as { status?: number | string } | undefined)?.status;
    const isAuthError = status === 401 || status === 403;

    return (
      <Shell>
        <SavedSearchesHeader showNewSearch={false} />
        {isAuthError ? (
          <MessageCard
            icon={<LogIn className="h-6 w-6" />}
            title="Sign in to manage saved searches"
          >
            <p>Your saved searches and alerts live in your account.</p>
            <Link href="/login" className={`${primaryBtn} mt-5`}>
              <LogIn className="h-4 w-4" />
              Sign in
            </Link>
          </MessageCard>
        ) : (
          <MessageCard
            tone="danger"
            icon={<AlertCircle className="h-6 w-6" />}
            title="We couldn't load your saved searches"
          >
            <p>
              Check your connection and try again. If you&apos;re not signed in,
              sign in to see your alerts.
            </p>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => refetch()}
                className={primaryBtn}
              >
                <RefreshCw className="h-4 w-4" />
                Try again
              </button>
              <Link href="/login" className={secondaryBtn}>
                Sign in
              </Link>
            </div>
          </MessageCard>
        )}
      </Shell>
    );
  }

  const items = data || [];

  return (
    <Shell>
      <SavedSearchesHeader count={items.length} />
      {items.length === 0 ? (
        <MessageCard
          icon={<BellRing className="h-6 w-6" />}
          title="No saved searches yet"
        >
          <p>
            Use &quot;Save search &amp; alerts&quot; on the properties page and
            we&apos;ll notify you when new listings match.
          </p>
          <Link href="/properties" className={`${primaryBtn} mt-5`}>
            <Search className="h-4 w-4" />
            Browse properties
          </Link>
        </MessageCard>
      ) : (
        <ul className="space-y-4">
          {items.map((s) => (
            <SavedSearchCard
              key={s._id}
              s={s}
              busy={busyId === s._id}
              confirming={confirmingId === s._id}
              onToggle={() => handleToggle(s)}
              onAskDelete={() => setConfirmingId(s._id)}
              onCancelDelete={() => setConfirmingId(null)}
              onConfirmDelete={() => handleDelete(s)}
            />
          ))}
        </ul>
      )}
    </Shell>
  );
}

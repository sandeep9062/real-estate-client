"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  MessageCircle,
  Inbox,
  TrendingUp,
  Users,
  CalendarClock,
  ChevronDown,
  SlidersHorizontal,
} from "lucide-react";
import {
  LEAD_STATUSES,
  firstImageUrl,
  useGetLeadsQuery,
  useGetLeadStatsQuery,
  useUpdateLeadMutation,
  type Lead,
  type LeadStatus,
} from "@/services/leadsApi";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { PageHeader, StatCard } from "@/components/agent-dashboard/ui";

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

const STALE_THRESHOLD_MS = 3 * 24 * 60 * 60 * 1000; // 3 days
const STALE_ELIGIBLE_STATUSES: LeadStatus[] = ["New", "Contacted"];

function isStaleLead(lead: Lead): boolean {
  if (!STALE_ELIGIBLE_STATUSES.includes(lead.status)) return false;
  return (
    Date.now() - new Date(lead.lastActivityAt).getTime() > STALE_THRESHOLD_MS
  );
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} day${days === 1 ? "" : "s"} ago`;
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const STATUS_STYLES: Record<LeadStatus, string> = {
  New: "border-blue-200 bg-blue-50 text-blue-700",
  Contacted: "border-amber-200 bg-amber-50 text-amber-700",
  Negotiating: "border-purple-200 bg-purple-50 text-purple-700",
  Closed: "border-emerald-200 bg-emerald-50 text-emerald-700",
  Lost: "border-gray-200 bg-gray-100 text-gray-600",
};

const formatPrice = (price?: number) =>
  typeof price === "number" ? `Rs ${price.toLocaleString("en-IN")}` : null;

/* ------------------------------------------------------------------ */
/* Small building blocks                                               */
/* ------------------------------------------------------------------ */

function StatusSelect({ lead }: { lead: Lead }) {
  const [updateLead, { isLoading }] = useUpdateLeadMutation();

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const status = event.target.value as LeadStatus;
    if (status === lead.status) return;
    updateLead({ id: lead.id, status })
      .unwrap()
      .then(() => toast.success(`Lead marked ${status}`))
      .catch(() => toast.error("Could not update lead. Try again."));
  };

  return (
    <span className="relative inline-flex items-center">
      <select
        value={lead.status}
        onChange={handleChange}
        disabled={isLoading}
        aria-label={`Lead status for ${lead.property?.title ?? "listing"}`}
        className={cn(
          "appearance-none rounded-full border py-1 pl-2.5 pr-7 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#4161df] disabled:opacity-60",
          STATUS_STYLES[lead.status],
        )}
      >
        {LEAD_STATUSES.map((status) => (
          <option key={status} value={status}>
            {status}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2 h-3.5 w-3.5 opacity-60" />
    </span>
  );
}

function NotesCell({ lead }: { lead: Lead }) {
  const [updateLead] = useUpdateLeadMutation();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(lead.notes ?? "");

  const current = lead.notes ?? "";

  const save = () => {
    const value = draft.trim();
    if (value === current) return;
    updateLead({ id: lead.id, notes: value })
      .unwrap()
      .then(() => toast.success("Notes saved"))
      .catch(() => toast.error("Could not save notes. Try again."));
  };

  if (!editing) {
    return (
      <button
        type="button"
        onClick={() => {
          setDraft(current);
          setEditing(true);
        }}
        className="max-w-[220px] cursor-pointer truncate text-left text-gray-600 hover:text-[#4161df] hover:underline"
        title={current || "Add a note"}
      >
        {current || <span className="italic text-gray-400">Add note…</span>}
      </button>
    );
  }

  return (
    <div className="min-w-[200px]">
      <textarea
        autoFocus
        rows={3}
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        onBlur={save}
        onKeyDown={(event) => {
          if (event.key === "Escape") setEditing(false);
          if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
            save();
            setEditing(false);
          }
        }}
        className="w-full rounded-lg border border-gray-300 p-2 text-sm focus:border-[#4161df] focus:outline-none focus:ring-1 focus:ring-[#4161df]"
        placeholder="e.g. Called buyer, wants a site visit this weekend"
      />
      <div className="mt-1 flex gap-2">
        <button
          type="button"
          onClick={() => {
            save();
            setEditing(false);
          }}
          className="rounded-md bg-[#4161df] px-2.5 py-1 text-xs font-medium text-white hover:bg-[#3759dd]"
        >
          Save
        </button>
        <button
          type="button"
          onClick={() => setEditing(false)}
          className="rounded-md border border-gray-200 px-2.5 py-1 text-xs font-medium text-gray-600 hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Table row                                                           */
/* ------------------------------------------------------------------ */

function PropertyCell({ lead }: { lead: Lead }) {
  const property = lead.property;
  const href = property?.slug ? `/property/${property.slug}` : null;
  const price = formatPrice(property?.price);
  // `image` is an array of URLs (or comma-joined) — render only the first one.
  const imageUrl = firstImageUrl(property?.image);

  const content = (
    <div className="flex items-center gap-3">
      {imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imageUrl}
          alt={property?.title ?? ""}
          className="h-10 w-14 shrink-0 rounded-lg border border-gray-100 object-cover"
          loading="lazy"
        />
      ) : (
        <span className="flex h-10 w-14 shrink-0 items-center justify-center rounded-lg border border-gray-100 bg-gray-50 text-gray-400">
          <Inbox className="h-4 w-4" aria-hidden />
        </span>
      )}
      <div className="min-w-0">
        <p className="max-w-[220px] truncate font-medium text-gray-900">
          {property?.title ?? "Listing unavailable"}
        </p>
        <p className="text-xs text-gray-500">
          {[property?.deal, price].filter(Boolean).join(" · ") || "—"}
        </p>
      </div>
    </div>
  );

  if (!href) return content;
  return (
    <Link href={href} className="group">
      <div className="transition group-hover:opacity-80">{content}</div>
    </Link>
  );
}

function LeadRow({ lead }: { lead: Lead }) {
  const stale = isStaleLead(lead);

  return (
    <tr
      className={cn(
        "align-top transition-colors hover:bg-gray-50/60",
        stale && "bg-red-50/50 hover:bg-red-50/70",
      )}
    >
      <td className={cn("px-4 py-3.5", stale && "border-l-4 border-l-red-500")}>
        <PropertyCell lead={lead} />
      </td>
      <td className="px-4 py-3.5">
        <p className="font-medium text-gray-900">
          {lead.buyerName || "Anonymous buyer"}
        </p>
        <p className="text-xs text-gray-500">
          {lead.buyerPhone || "No phone captured"}
        </p>
      </td>
      <td className="px-4 py-3.5">
        <span className="inline-flex items-center gap-1 rounded-full border border-green-200 bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700">
          <MessageCircle className="h-3 w-3" aria-hidden />
          WhatsApp click
        </span>
      </td>
      <td className="px-4 py-3.5">
        <StatusSelect lead={lead} />
      </td>
      <td className="px-4 py-3.5">
        <p className="whitespace-nowrap text-gray-700">
          {timeAgo(lead.lastActivityAt)}
        </p>
        {stale && (
          <span className="mt-1 inline-flex items-center gap-1 rounded-full border border-red-200 bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-700">
            <AlertTriangle className="h-3 w-3" aria-hidden />
            Stale
          </span>
        )}
      </td>
      <td className="px-4 py-3.5">
        <NotesCell lead={lead} />
      </td>
    </tr>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function AgentDashboardLeadsPage() {
  // Unfiltered list only to derive the property filter options.
  const { data: allLeads = [] } = useGetLeadsQuery();

  const [statusFilter, setStatusFilter] = useState("");
  const [propertyFilter, setPropertyFilter] = useState("");

  const filters = useMemo(
    () => ({
      ...(statusFilter ? { status: statusFilter } : {}),
      ...(propertyFilter ? { propertyId: propertyFilter } : {}),
    }),
    [statusFilter, propertyFilter],
  );

  const { data: leads = [], isLoading, isError } = useGetLeadsQuery(filters);
  const { data: stats } = useGetLeadStatsQuery();

  const propertyOptions = useMemo(() => {
    const map = new Map<string, string>();
    for (const lead of allLeads) {
      const id = lead.property?._id || lead.property?.id;
      if (id && lead.property?.title) map.set(id, lead.property.title);
    }
    return Array.from(map.entries());
  }, [allLeads]);

  const hasActiveFilters = Boolean(statusFilter || propertyFilter);

  return (
    <div className="max-w-5xl min-w-0">
      <PageHeader
        eyebrow="Leads"
        title="WhatsApp leads"
        description="Every “Chat on WhatsApp” click on your listings is captured here automatically. Follow up before leads go cold."
      />

      {/* Stats bar */}
      <div className="grid gap-3 sm:grid-cols-3 sm:gap-4">
        <StatCard
          label="Leads this week"
          value={
            typeof stats?.totalThisWeek === "number" ? stats.totalThisWeek : "—"
          }
          hint="Since Monday"
          icon={CalendarClock}
        />
        <StatCard
          label="Total leads"
          value={typeof stats?.total === "number" ? stats.total : "—"}
          hint={
            typeof stats?.closed === "number"
              ? `${stats.closed} closed`
              : undefined
          }
          icon={Users}
        />
        <StatCard
          label="Conversion rate"
          value={
            typeof stats?.conversionRate === "number"
              ? `${Math.round(stats.conversionRate * 10) / 10}%`
              : "—"
          }
          hint="Closed ÷ total leads"
          icon={TrendingUp}
        />
      </div>

      {/* Filters */}
      <div className="mt-6 flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4 sm:flex-row sm:items-center">
        <span className="hidden shrink-0 items-center gap-1.5 text-xs font-medium text-gray-500 sm:flex">
          <SlidersHorizontal className="h-3.5 w-3.5" aria-hidden />
          Filter
        </span>
        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          aria-label="Filter by status"
          className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 focus:border-[#4161df] focus:outline-none focus:ring-1 focus:ring-[#4161df]"
        >
          <option value="">All statuses</option>
          {LEAD_STATUSES.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>

        <select
          value={propertyFilter}
          onChange={(event) => setPropertyFilter(event.target.value)}
          aria-label="Filter by property"
          className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 focus:border-[#4161df] focus:outline-none focus:ring-1 focus:ring-[#4161df]"
        >
          <option value="">All properties</option>
          {propertyOptions.map(([id, title]) => (
            <option key={id} value={id}>
              {title}
            </option>
          ))}
        </select>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={() => {
              setStatusFilter("");
              setPropertyFilter("");
            }}
            className="text-sm font-medium text-[#4161df] hover:underline sm:ml-auto"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Content */}
      {isError ? (
        <div className="mt-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
          Couldn’t load your leads. Please refresh the page and try again.
        </div>
      ) : isLoading ? (
        <div className="mt-6 space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-16 animate-pulse rounded-xl border border-gray-100 bg-gray-50"
            />
          ))}
        </div>
      ) : leads.length === 0 ? (
        hasActiveFilters ? (
          <div className="mt-6 rounded-xl border border-dashed border-gray-200 bg-gray-50/80 p-8 text-center">
            <p className="text-sm font-medium text-gray-900">
              No leads match your filters
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Try clearing the status or property filter.
            </p>
          </div>
        ) : (
          <div className="mt-6 rounded-xl border border-dashed border-gray-200 bg-gray-50/80 p-8 text-center sm:p-10">
            <span className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-[#4161df]">
              <Inbox className="h-6 w-6" aria-hidden />
            </span>
            <h2 className="text-lg font-semibold text-gray-900">
              No leads yet
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-gray-600">
              When buyers tap “Chat on WhatsApp” on your listings, they’ll show
              up here automatically. Make sure your listings are live so buyers
              can reach you.
            </p>
            <Link
              href="/owned"
              className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-[#4161df] hover:underline"
            >
              Check your listings
            </Link>
          </div>
        )
      ) : (
        <div className="mt-6 overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
          <table className="w-full min-w-[860px] text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/70 text-xs uppercase tracking-wide text-gray-500">
                <th className="px-4 py-3 font-medium">Property</th>
                <th className="px-4 py-3 font-medium">Buyer</th>
                <th className="px-4 py-3 font-medium">Source</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Last activity</th>
                <th className="px-4 py-3 font-medium">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {leads.map((lead) => (
                <LeadRow key={lead.id} lead={lead} />
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="mt-6 text-pretty text-sm text-gray-500 sm:mt-8">
        Leads with <strong className="font-medium text-gray-700">New</strong> or{" "}
        <strong className="font-medium text-gray-700">Contacted</strong> status
        and no activity for 3+ days are flagged as stale — follow up before they
        cool off.
      </p>
    </div>
  );
}

"use client";

import Link from "next/link";
import {
  ArrowRight,
  CalendarClock,
  CalendarDays,
  CheckCircle2,
  Home,
  LifeBuoy,
  Megaphone,
  MessageCircleHeart,
  TrendingUp,
  Users,
} from "lucide-react";
import { useSelector } from "react-redux";
import { useEffect } from "react";

import { selectUser } from "@/store/authSlice";
import { useGetLeadStatsQuery } from "@/services/leadsApi";
import { useGetMyAgentProfileQuery } from "@/services/agentsApi";
import { useGetOwnedPropertiesQuery } from "@/services/propertiesApi";
import ProfileCompletenessBanner from "@/components/profile/ProfileCompletenessBanner";
import { PageHeader, StatCard } from "@/components/agent-dashboard/ui";
import { toast } from "@/hooks/use-toast";

const QUICK_ACTIONS = [
  {
    href: "/agent-dashboard/marketing",
    icon: Megaphone,
    tile: "bg-indigo-50 text-[#4161df]",
    title: "Marketing",
    description: "Connect LinkedIn and Meta for automated property posts.",
    cta: "Open marketing",
  },
  {
    href: "/agent-dashboard/listings",
    icon: Home,
    tile: "bg-emerald-50 text-emerald-600",
    title: "Listings",
    description: "Jump to your owned properties and update availability.",
    cta: "Manage listings",
  },
  {
    href: "/agent-dashboard/visits",
    icon: CalendarDays,
    tile: "bg-amber-50 text-amber-600",
    title: "Visits",
    description: "Review scheduled site visits tied to your activity.",
    cta: "View visits",
  },
  {
    href: "/contact",
    icon: MessageCircleHeart,
    tile: "bg-rose-50 text-rose-500",
    title: "Support",
    description: "Platform or lead questions — reach our team.",
    cta: "Contact us",
  },
];

export default function AgentDashboardOverviewPage() {
  const user = useSelector(selectUser);
  const { data: stats, error: statsError } = useGetLeadStatsQuery();
  const { data: profileData, error: profileError } = useGetMyAgentProfileQuery();
  const { data: ownedProperties, error: propertiesError } = useGetOwnedPropertiesQuery(undefined);

  useEffect(() => {
    if (statsError) {
      toast.error("Failed to load lead statistics. Please refresh the page.");
    }
  }, [statsError]);

  useEffect(() => {
    if (profileError) {
      toast.error("Failed to load your profile data. Please refresh the page.");
    }
  }, [profileError]);

  useEffect(() => {
    if (propertiesError) {
      toast.error("Failed to load your properties. Please refresh the page.");
    }
  }, [propertiesError]);

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <div className="min-w-0">
      {/* Profile completeness banner (dismissible, non-blocking) */}
      {profileData?.data && (
        <ProfileCompletenessBanner
          role="agent"
          percentage={profileData.data.profileCompleteness ?? 0}
          editHref="/agent-dashboard/profile"
        />
      )}

      {/* Hero */}
      <section className="relative mb-6 overflow-hidden rounded-2xl bg-gradient-to-br from-[#4161df] via-[#4f6ee6] to-[#7c93f2] p-6 text-white shadow-lg shadow-[#4161df]/20 sm:mb-8 sm:p-8">
        <div
          className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full bg-white/10 blur-2xl"
          aria-hidden
        />
        <span className="inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest backdrop-blur">
          Agent workspace
        </span>
        <h1 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
          Welcome back{user?.name ? `, ${user.name.split(" ")[0]}` : ""}
        </h1>
        <p
          suppressHydrationWarning
          className="mt-1 text-sm text-white/80 sm:text-base"
        >
          {today} · Here is what is happening with your business.
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <Link
            href="/agent-dashboard/leads"
            className="inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-[#4161df] shadow-sm transition hover:bg-indigo-50 active:scale-[0.98]"
          >
            View leads
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
          <Link
            href="/agent-dashboard/marketing"
            className="inline-flex min-h-[44px] items-center rounded-lg px-4 py-2.5 text-sm font-semibold text-white ring-1 ring-white/40 transition hover:bg-white/10 active:scale-[0.98]"
          >
            Connect socials
          </Link>
        </div>
      </section>

      {/* Snapshot */}
      <PageHeader
        eyebrow="Snapshot"
        title="Your numbers"
        description="Live lead activity captured from WhatsApp clicks across your listings."
      />
      <section className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-5">
        <StatCard
          label="Total leads"
          value={typeof stats?.total === "number" ? stats.total : "—"}
          hint={
            typeof stats?.closed === "number"
              ? `${stats.closed} closed all-time`
              : "All time"
          }
          icon={Users}
        />
        <StatCard
          label="New this week"
          value={
            typeof stats?.totalThisWeek === "number" ? stats.totalThisWeek : "—"
          }
          hint="Since Monday"
          icon={CalendarClock}
          tone="amber"
        />
        <StatCard
          label="Closed"
          value={typeof stats?.closed === "number" ? stats.closed : "—"}
          hint="Deals won"
          icon={CheckCircle2}
          tone="emerald"
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
          tone="violet"
        />
        <StatCard
          label="Total listings"
          value={
            Array.isArray(ownedProperties) ? ownedProperties.length : "—"
          }
          hint="Properties listed by you"
          icon={Home}
          tone="blue"
        />
      </section>

      {/* Quick actions */}
      <PageHeader eyebrow="Shortcuts" title="Quick actions" />
      <section className="grid gap-3 sm:grid-cols-2 sm:gap-4">
        {QUICK_ACTIONS.map(
          ({ href, icon: Icon, tile, title, description, cta }) => (
            <Link
              key={href}
              href={href}
              className="group flex touch-manipulation items-start gap-4 rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#4161df]/30 hover:shadow-md active:scale-[0.99]"
            >
              <span
                className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${tile}`}
              >
                <Icon className="h-5 w-5" aria-hidden />
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-gray-900">{title}</p>
                <p className="mt-0.5 text-sm text-gray-600">{description}</p>
                <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-[#4161df]">
                  {cta}
                  <ArrowRight
                    className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                    aria-hidden
                  />
                </span>
              </div>
            </Link>
          ),
        )}
      </section>

      {/* Support strip */}
      <section className="mt-8 flex flex-col gap-4 rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="flex items-start gap-4">
          <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-[#4161df]">
            <LifeBuoy className="h-5 w-5" aria-hidden />
          </span>
          <div>
            <p className="font-semibold text-gray-900">Need a hand?</p>
            <p className="mt-0.5 text-sm text-gray-600">
              Questions about leads, visits, or your account — our team is one
              message away.
            </p>
          </div>
        </div>
        <Link
          href="/contact"
          className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-[#4161df] hover:underline"
        >
          Contact support
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      </section>
    </div>
  );
}

"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import {
  ArrowRight,
  CalendarClock,
  CalendarDays,
  CheckCircle2,
  Home,
  LifeBuoy,
  Megaphone,
  MessageCircleHeart,
  ShieldCheck,
  TrendingUp,
  Users,
} from "lucide-react";

import { selectIsAuthenticated, selectUser } from "@/store/authSlice";
import { useGetLeadStatsQuery } from "@/services/leadsApi";
import { useGetMyAgentProfileQuery } from "@/services/agentsApi";
import ProfileCompletenessBanner from "@/components/profile/ProfileCompletenessBanner";
import { PageHeader, StatCard } from "@/components/agent-dashboard/ui";

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

function DashboardSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading dashboard">
      <div className="mx-auto max-w-7xl">
        <div className="h-44 animate-pulse rounded-2xl bg-gray-100 sm:h-48" />
        <div className="mt-4 grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-24 animate-pulse rounded-xl border border-gray-200 bg-white"
            />
          ))}
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 sm:gap-4">
          {[0, 1].map((i) => (
            <div
              key={i}
              className="h-28 animate-pulse rounded-2xl border border-gray-200/80 bg-white"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function AgentDashboardOverviewPage() {
  const router = useRouter();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);
  const canAccess = user?.role === "agent" || user?.role === "admin";

  // Skip until gated in — avoids a 401 (and its auto-logout) when a signed-out
  // visitor lands here.
  const { data: stats, isFetching: fetchingStats } = useGetLeadStatsQuery(
    undefined,
    { skip: !isAuthenticated || !canAccess },
  );
  const { data: profileData } = useGetMyAgentProfileQuery(undefined, {
    skip: !isAuthenticated || !canAccess,
  });

  const profile = profileData?.data;

  const memberSince = useMemo(() => {
    const raw = profile?.memberSince || profile?.createdAt;
    if (!raw) return null;
    try {
      return new Date(raw).toLocaleDateString("en-IN", {
        month: "short",
        year: "numeric",
      });
    } catch {
      return null;
    }
  }, [profile?.memberSince, profile?.createdAt]);

  const initials = (user?.name ?? "A")
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  // ── Signed-out gate ──
  if (!isAuthenticated || !user) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center gap-4 px-4 pt-[calc(6rem+env(safe-area-inset-top))] text-center sm:pt-24">
        <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[#4161df]/10">
          <Users className="h-7 w-7 text-[#4161df]" aria-hidden />
        </span>
        <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl">
          Agent dashboard
        </h1>
        <p className="max-w-[28ch] text-pretty text-sm text-gray-600 sm:text-base">
          Sign in to manage your leads and agent profile.
        </p>
        <Link
          href="/login"
          className="inline-flex min-h-[44px] min-w-[120px] items-center justify-center rounded-xl bg-[#4161df] px-6 py-3 text-base font-semibold text-white transition hover:bg-[#3654cc] active:scale-[0.98]"
        >
          Log in
        </Link>
      </div>
    );
  }

  // ── Wrong-role gate ──
  if (!canAccess) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center gap-4 px-4 pt-[calc(6rem+env(safe-area-inset-top))] text-center sm:pt-24">
        <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100">
          <ShieldCheck className="h-7 w-7 text-gray-400" aria-hidden />
        </span>
        <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl">
          Agent dashboard
        </h1>
        <p className="max-w-[34ch] text-pretty text-sm text-gray-600 sm:text-base">
          This area is for registered agents. If you should have access, contact
          support.
        </p>
        <button
          type="button"
          onClick={() => router.push("/")}
          className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-gray-300 bg-white px-6 py-3 text-base font-medium text-gray-800 transition hover:bg-gray-50 active:scale-[0.98]"
        >
          Back to home
        </button>
      </div>
    );
  }

  // ── Loading (first visit, nothing cached yet) ──
  if (!profileData && fetchingStats && !stats) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="mx-auto max-w-7xl">
      {/* ── Profile completeness banner (dismissible, non-blocking) ── */}
      {profile && (
        <ProfileCompletenessBanner
          role="agent"
          percentage={profile.profileCompleteness ?? 0}
          editHref="/agent-dashboard/profile"
        />
      )}

      {/* ── Hero ── */}
      <section className="relative mb-6 overflow-hidden rounded-2xl bg-gradient-to-br from-[#4161df] via-[#4f6ee6] to-[#7c93f2] p-6 text-white shadow-lg shadow-[#4161df]/20 sm:mb-8 sm:p-8">
        <div
          className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full bg-white/10 blur-2xl"
          aria-hidden
        />

        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            {user?.image ? (
              <Image
                src={user.image}
                alt={user.name ?? "Your Image"}
                width={60}
                height={60}
                className="h-14 w-14 rounded-2xl object-cover ring-1 ring-white/25 sm:h-[60px] sm:w-[60px]"
              />
            ) : (
              <span className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-lg font-semibold ring-1 ring-white/20 backdrop-blur sm:h-[60px] sm:w-[60px]">
                {initials}
              </span>
            )}
            <div className="min-w-0">
              <span className="inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest backdrop-blur">
                Agent workspace
              </span>
              <h1 className="mt-2 truncate text-2xl font-bold tracking-tight sm:text-3xl">
                Welcome back{user?.name ? `, ${user.name.split(" ")[0]}` : ""}
              </h1>
              <p
                suppressHydrationWarning
                className="mt-1 text-sm text-white/80 sm:text-base"
              >
                {today} · Here is what is happening with your business.
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-white/75 sm:text-sm">
                {(profile?.isVerified || profile?.identityVerified) && (
                  <span className="inline-flex items-center gap-1.5">
                    <ShieldCheck
                      className="h-3.5 w-3.5 text-emerald-300"
                      aria-hidden
                    />
                    Verified agent
                  </span>
                )}
                {memberSince && (
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarDays className="h-3.5 w-3.5" aria-hidden />
                    Member since {memberSince}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex shrink-0 flex-wrap gap-2.5">
            <Link
              href="/agent-dashboard/leads"
              className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-[#4161df] shadow-sm transition hover:bg-indigo-50 active:scale-[0.98]"
            >
              View leads
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link
              href="/agent-dashboard/marketing"
              className="inline-flex min-h-[44px] items-center rounded-xl border border-white/25 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10 active:scale-[0.98]"
            >
              Connect socials
            </Link>
          </div>
        </div>
      </section>

      {/* Snapshot */}
      <PageHeader
        eyebrow="Snapshot"
        title="Your numbers"
        description="Live lead activity captured from WhatsApp clicks across your listings."
      />
      <section className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
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

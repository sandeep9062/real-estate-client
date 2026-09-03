"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { Building2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { selectUser } from "@/store/authSlice";
import { AGENT_DASHBOARD_NAV } from "./agent-dashboard-nav";

function getInitials(name?: string | null): string {
  if (!name) return "A";
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((part) => part.charAt(0).toUpperCase()).join("") || "A";
}

export default function AgentDashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const user = useSelector(selectUser);

  return (
    <div className="min-h-[100dvh] w-full bg-[#f6f8fb]">
      {/* Full-width shell: intentionally NOT using the site-wide centered
          max-w container (left-right gutters) that other pages use. */}
      <div className="flex w-full min-w-0 gap-6 pb-[max(4rem,env(safe-area-inset-bottom))] pt-[calc(5.5rem+env(safe-area-inset-top))] sm:gap-8 sm:pt-24 md:pb-16">
        {/* Sidebar (desktop) */}
        <aside className="hidden w-60 shrink-0 md:block">
          <div className="sticky top-28 space-y-7">
            {/* Brand */}
            <div className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#4161df] to-[#7c93f2] text-white shadow-md shadow-[#4161df]/25">
                <Building2 className="h-5 w-5" aria-hidden />
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-bold tracking-tight text-gray-900">
                  PropertyBulbul
                </p>
                <p className="text-[11px] font-medium uppercase tracking-widest text-gray-400">
                  Agent workspace
                </p>
              </div>
            </div>

            {/* Primary nav */}
            <nav className="flex flex-col gap-1" aria-label="Agent dashboard">
              {AGENT_DASHBOARD_NAV.map(({ href, label, icon: Icon }) => {
                const active =
                  href === "/agent-dashboard"
                    ? pathname === "/agent-dashboard"
                    : pathname === href || pathname.startsWith(`${href}/`);
                return (
                  <Link
                    key={href}
                    href={href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex min-h-10 items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-all",
                      active
                        ? "bg-white text-[#4161df] shadow-sm ring-1 ring-gray-200/80"
                        : "text-gray-600 hover:bg-white/80 hover:text-gray-900 hover:shadow-sm hover:ring-1 hover:ring-gray-200/60",
                    )}
                  >
                    <Icon
                      className={cn(
                        "h-[18px] w-[18px] shrink-0",
                        active ? "text-[#4161df]" : "text-gray-400",
                      )}
                      aria-hidden
                    />
                    {label}
                  </Link>
                );
              })}
            </nav>

            {/* User card */}
            <div className="rounded-2xl border border-gray-200/80 bg-white p-3 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-xs font-bold text-[#4161df]">
                  {getInitials(user?.name)}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-gray-900">
                    {user?.name ?? "Agent"}
                  </p>
                  <p className="truncate text-xs capitalize text-gray-500">
                    {user?.role ?? "agent"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Content */}
        <div className="min-w-0 flex-1">
          {/* Section nav (mobile) */}
          <div className="sticky top-[calc(3.5rem+env(safe-area-inset-top))] z-[1140] mb-5 rounded-2xl border border-gray-200/70 bg-white/90 p-1.5 shadow-sm shadow-gray-200/60 backdrop-blur-md md:hidden">
            <nav
              className="flex gap-2 overflow-x-auto [-webkit-overflow-scrolling:touch] [scrollbar-width:none] snap-x snap-mandatory [&::-webkit-scrollbar]:hidden"
              aria-label="Agent dashboard sections"
            >
              {AGENT_DASHBOARD_NAV.map(({ href, label }) => {
                const active =
                  href === "/agent-dashboard"
                    ? pathname === "/agent-dashboard"
                    : pathname === href || pathname.startsWith(`${href}/`);
                return (
                  <Link
                    key={href}
                    href={href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "inline-flex min-h-[44px] shrink-0 snap-start items-center justify-center rounded-xl px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4161df]",
                      active
                        ? "bg-[#4161df] text-white shadow-sm"
                        : "text-gray-700 hover:bg-gray-100",
                    )}
                  >
                    {label}
                  </Link>
                );
              })}
            </nav>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}

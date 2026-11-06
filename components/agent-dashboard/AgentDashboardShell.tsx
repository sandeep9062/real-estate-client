"use client";

import { useEffect, useState } from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { Building2, ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { selectUser } from "@/store/authSlice";
import { AGENT_DASHBOARD_NAV } from "./agent-dashboard-nav";

const SIDEBAR_EXPANDED_WIDTH = "w-60";
const SIDEBAR_COLLAPSED_WIDTH = "w-16";
const SIDEBAR_STORAGE_KEY = "agent-dashboard:sidebar:collapsed";

function getInitials(name?: string | null): string {
  if (!name) return "A";
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((part) => part.charAt(0).toUpperCase()).join("") || "A";
}

// Same API-origin detection as ProfileMenu (getApiBaseUrl isn't exported).
function getApiBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }

  if (typeof window !== "undefined") {
    const hostname = window.location.hostname;

    if (
      hostname === "www.propertybulbul.com" ||
      hostname === "propertybulbul.com"
    ) {
      return "https://api.propertybulbul.com/api";
    }
  }

  return "http://localhost:9000/api";
}

// Resolve the auth user's profile pic: absolute http(s) URLs pass through,
// relative paths (e.g. uploads/...) are served from the API origin.
function getUserImageUrl(imagePath?: string | null): string | undefined {
  if (!imagePath) return undefined;
  if (imagePath.startsWith("http")) return imagePath;
  const baseUrl = getApiBaseUrl().replace("/api", "");
  return `${baseUrl}/${imagePath.replace(/\\/g, "/")}`;
}

export default function AgentDashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const user = useSelector(selectUser);
  const avatarUrl = getUserImageUrl(user?.image);

  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window === "undefined") return false;
    try {
      return localStorage.getItem(SIDEBAR_STORAGE_KEY) === "true";
    } catch {
      return false;
    }
  });

  // Persist the collapsed state so it survives reloads.
  useEffect(() => {
    try {
      localStorage.setItem(SIDEBAR_STORAGE_KEY, String(collapsed));
    } catch {
      // Ignore storage errors (e.g. private browsing).
    }
  }, [collapsed]);

  return (
    <div className="min-h-[100dvh] w-full bg-[#f6f8fb]">
      {/* Full-width shell: intentionally NOT using the site-wide centered
          max-w container that other pages use — only a small gutter (px-2/px-3). */}
      <div className="flex w-full min-w-0 gap-6 px-2 pb-[max(4rem,env(safe-area-inset-bottom))] pt-[calc(5.5rem+env(safe-area-inset-top))] sm:gap-8 sm:px-3 sm:pt-24 md:pb-16">
        {/* Sidebar (desktop) */}
        <aside
          className={cn(
            "hidden shrink-0 md:block transition-all duration-300 ease-in-out",
            collapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_EXPANDED_WIDTH,
          )}
          data-collapsed={collapsed}
        >
          <div className="sticky top-28 space-y-7">
            {/* Brand */}
            <div className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#4161df] to-[#7c93f2] text-white shadow-md shadow-[#4161df]/25">
                <Building2 className="h-5 w-5" aria-hidden />
              </span>
              {!collapsed && (
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold tracking-tight text-gray-900">
                    PropertyBulbul
                  </p>
                  <p className="text-[11px] font-medium uppercase tracking-widest text-gray-400">
                    Agent workspace
                  </p>
                </div>
              )}
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
                    {!collapsed && label}
                  </Link>
                );
              })}
            </nav>

            {/* User card */}
            <div className="rounded-2xl border border-gray-200/80 bg-white p-3 shadow-sm">
              <div className="flex items-center gap-3">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={`${user?.name ?? "Agent"} profile picture`}
                    className="h-9 w-9 shrink-0 rounded-full object-cover ring-2 ring-white/80"
                  />
                ) : (
                  <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-xs font-bold text-[#4161df]">
                    {getInitials(user?.name)}
                  </span>
                )}
                <div className="min-w-0">
                  {!collapsed && (
                    <>
                      <p className="truncate text-sm font-semibold text-gray-900">
                        {user?.name ?? "Agent"}
                      </p>
                      <p className="truncate text-xs capitalize text-gray-500">
                        {user?.role ?? "agent"}
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Collapse toggle */}
            <button
              onClick={() => setCollapsed((prev) => !prev)}
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              className="flex shrink-0 items-center justify-center rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-900 transition-colors"
            >
              {collapsed ? (
                <ChevronRight className="h-4 w-4" aria-hidden />
              ) : (
                <ChevronLeft className="h-4 w-4" aria-hidden />
              )}
            </button>
          </div>
        </aside>

        {/* Sidebar rail: shown only when collapsed so the sidebar can be re-expanded */}
        {collapsed && (
          <button
            onClick={() => setCollapsed(false)}
            aria-label="Expand sidebar"
            className="fixed left-2 top-[calc(5.5rem+env(safe-area-inset-top)+1rem)] z-50 flex shrink-0 items-center justify-center rounded-md p-1.5 bg-white border border-gray-200/80 text-gray-400 shadow-sm hover:bg-gray-50 hover:text-gray-900 transition-colors"
          >
            <ChevronRight className="h-4 w-4" aria-hidden />
          </button>
        )}

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

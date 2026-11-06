"use client";

import { useEffect, useState } from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { Building2, PanelLeftClose, PanelLeftOpen } from "lucide-react";

import { cn } from "@/lib/utils";
import { selectIsAuthenticated, selectUser } from "@/store/authSlice";
import { LANDLORD_DASHBOARD_NAV } from "./landlord-dashboard-nav";

const SIDEBAR_EXPANDED_WIDTH = "w-64";
const SIDEBAR_COLLAPSED_WIDTH = "w-[4.5rem]";
const SIDEBAR_STORAGE_KEY = "landlord-dashboard:sidebar:collapsed";

function getInitials(name?: string | null): string {
  if (!name) return "L";
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((part) => part.charAt(0).toUpperCase()).join("") || "L";
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
  const baseUrl = getApiBaseUrl().replace(/\/api\/?$/, "");
  return `${baseUrl}/${imagePath.replace(/\\/g, "/").replace(/^\/+/, "")}`;
}

function canAccessLandlordDashboard(role: string | undefined) {
  return role === "landlord" || role === "admin";
}

function isActivePath(pathname: string, href: string): boolean {
  if (href === "/landlord/dashboard") return pathname === "/landlord/dashboard";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function Avatar({
  url,
  name,
  className,
}: {
  url?: string;
  name?: string | null;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);

  // Reset the error state if the image URL changes.
  useEffect(() => setFailed(false), [url]);

  if (url && !failed) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={url}
        alt={`${name ?? "Landlord"} profile picture`}
        onError={() => setFailed(true)}
        className={cn(
          "shrink-0 rounded-full object-cover ring-2 ring-white shadow-sm",
          className,
        )}
      />
    );
  }

  return (
    <span
      aria-hidden
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#4161df]/15 to-[#7c93f2]/25 text-xs font-bold text-[#4161df] ring-2 ring-white shadow-sm",
        className,
      )}
    >
      {getInitials(name)}
    </span>
  );
}

export default function LandlordDashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);
  const avatarUrl = getUserImageUrl(user?.image);

  const [collapsed, setCollapsed] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Read the saved state after mount (avoids SSR/client hydration mismatch).
  useEffect(() => {
    try {
      setCollapsed(localStorage.getItem(SIDEBAR_STORAGE_KEY) === "true");
    } catch {
      // Ignore storage errors (e.g. private browsing).
    }
    setHydrated(true);
  }, []);

  // Persist the collapsed state so it survives reloads.
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(SIDEBAR_STORAGE_KEY, String(collapsed));
    } catch {
      // Ignore storage errors.
    }
  }, [collapsed, hydrated]);

  // Signed-out visitors (and non-landlord roles) get no dashboard chrome —
  // the pages themselves render their own sign-in / access gates.
  const showChrome = isAuthenticated && canAccessLandlordDashboard(user?.role);
  if (!showChrome) return <>{children}</>;

  return (
    <div className="min-h-[100dvh] w-full bg-[#f6f8fb] bg-[radial-gradient(60rem_30rem_at_0%_0%,rgba(65,97,223,0.06),transparent_60%),radial-gradient(50rem_30rem_at_100%_100%,rgba(124,147,242,0.06),transparent_60%)]">
      {/* Full-width shell: intentionally NOT using the site-wide centered
          max-w container that other pages use — only a small gutter. */}
      <div className="flex w-full min-w-0 items-start gap-5 px-2 pb-[max(4rem,env(safe-area-inset-bottom))] pt-[calc(5.5rem+env(safe-area-inset-top))] sm:gap-6 sm:px-3 sm:pt-24 md:pb-16">
        {/* Sidebar (desktop) */}
        <aside
          data-collapsed={collapsed}
          className={cn(
            "sticky top-24 hidden shrink-0 md:flex md:flex-col",
            "max-h-[calc(100dvh-7rem)] overflow-y-auto overflow-x-hidden",
            "rounded-3xl border border-gray-200/70 bg-white/90 backdrop-blur-sm",
            "shadow-[0_8px_30px_-12px_rgba(20,30,70,0.12)]",
            "transition-[width] duration-300 ease-in-out motion-reduce:transition-none",
            "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
            collapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_EXPANDED_WIDTH,
          )}
        >
          {/* Brand */}
          <div
            className={cn(
              "flex items-center gap-3 border-b border-gray-100 px-4 py-4",
              collapsed && "justify-center px-0",
            )}
          >
            <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#4161df] to-[#7c93f2] text-white shadow-lg shadow-[#4161df]/30">
              <Building2 className="h-5 w-5" aria-hidden />
            </span>
            {!collapsed && (
              <div className="min-w-0">
                <p className="truncate text-sm font-bold tracking-tight text-gray-900">
                  PropertyBulbul
                </p>
                <p className="text-[11px] font-medium uppercase tracking-widest text-gray-400">
                  Landlord workspace
                </p>
              </div>
            )}
          </div>

          {/* Primary nav */}
          <nav
            className="flex flex-1 flex-col gap-1 p-3"
            aria-label="Landlord dashboard"
          >
            {!collapsed && (
              <p className="px-3 pb-1 pt-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-gray-400">
                Menu
              </p>
            )}
            {LANDLORD_DASHBOARD_NAV.map(({ href, label, icon: Icon }) => {
              const active = isActivePath(pathname, href);
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={active ? "page" : undefined}
                  aria-label={collapsed ? label : undefined}
                  className={cn(
                    "group relative flex min-h-11 items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4161df]/60",
                    collapsed && "justify-center px-0",
                    active
                      ? "bg-[#4161df]/10 text-[#4161df]"
                      : "text-gray-500 hover:bg-gray-100/80 hover:text-gray-900",
                  )}
                >
                  {/* Active indicator bar */}
                  <span
                    aria-hidden
                    className={cn(
                      "absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-[#4161df] transition-all",
                      active ? "opacity-100" : "h-0 opacity-0",
                    )}
                  />
                  <Icon
                    className={cn(
                      "h-[18px] w-[18px] shrink-0 transition-colors",
                      active
                        ? "text-[#4161df]"
                        : "text-gray-400 group-hover:text-gray-700",
                    )}
                    aria-hidden
                  />
                  {!collapsed && (
                    <span className="min-w-0 flex-1 truncate">{label}</span>
                  )}

                  {/* Tooltip (collapsed only) */}
                  {collapsed && (
                    <span
                      role="tooltip"
                      className="pointer-events-none absolute left-full top-1/2 z-50 ml-3 -translate-y-1/2 whitespace-nowrap rounded-lg bg-gray-900 px-2.5 py-1.5 text-xs font-medium text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
                    >
                      {label}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Footer: user card + collapse toggle */}
          <div className="space-y-2 border-t border-gray-100 p-3">
            <div
              className={cn(
                "flex items-center gap-3 rounded-2xl bg-gray-50/80 p-2.5",
                collapsed && "justify-center bg-transparent p-0",
              )}
              title={collapsed ? (user?.name ?? "Landlord") : undefined}
            >
              <Avatar url={avatarUrl} name={user?.name} className="h-9 w-9" />
              {!collapsed && (
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-gray-900">
                    {user?.name ?? "Landlord"}
                  </p>
                  <p className="truncate text-xs capitalize text-gray-500">
                    {user?.role ?? "landlord"}
                  </p>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => setCollapsed((prev) => !prev)}
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              aria-expanded={!collapsed}
              className={cn(
                "flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-gray-500 transition-colors",
                "hover:bg-gray-100 hover:text-gray-900",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4161df]/60",
                collapsed && "justify-center px-0",
              )}
            >
              {collapsed ? (
                <PanelLeftOpen className="h-4 w-4" aria-hidden />
              ) : (
                <>
                  <PanelLeftClose className="h-4 w-4" aria-hidden />
                  Collapse
                </>
              )}
            </button>
          </div>
        </aside>

        {/* Content */}
        <div className="min-w-0 flex-1">
          {/* Section nav (mobile) */}
          <div className="sticky top-[calc(3.5rem+env(safe-area-inset-top))] z-[1140] mb-5 rounded-2xl border border-gray-200/70 bg-white/90 p-1.5 shadow-sm shadow-gray-200/60 backdrop-blur-md md:hidden">
            <nav
              className="flex gap-1.5 overflow-x-auto [-webkit-overflow-scrolling:touch] [scrollbar-width:none] snap-x snap-mandatory [&::-webkit-scrollbar]:hidden"
              aria-label="Landlord dashboard sections"
            >
              {LANDLORD_DASHBOARD_NAV.map(({ href, label, icon: Icon }) => {
                const active = isActivePath(pathname, href);
                return (
                  <Link
                    key={href}
                    href={href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "inline-flex min-h-[44px] shrink-0 snap-start items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-colors",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4161df]",
                      active
                        ? "bg-[#4161df] text-white shadow-sm shadow-[#4161df]/30"
                        : "text-gray-600 hover:bg-gray-100",
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0" aria-hidden />
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

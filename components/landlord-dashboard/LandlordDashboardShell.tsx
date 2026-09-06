"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { Building2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { selectIsAuthenticated, selectUser } from "@/store/authSlice";
import { LANDLORD_DASHBOARD_NAV } from "./landlord-dashboard-nav";

function getInitials(name?: string | null): string {
  if (!name) return "L";
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((part) => part.charAt(0).toUpperCase()).join("") || "L";
}

function canAccessLandlordDashboard(role: string | undefined) {
  return role === "landlord" || role === "admin";
}

export default function LandlordDashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);

  // Signed-out visitors (and non-landlord roles) get no dashboard chrome —
  // the pages themselves render their own sign-in / access gates.
  const showChrome = isAuthenticated && canAccessLandlordDashboard(user?.role);
  if (!showChrome) return <>{children}</>;

  return (
    <div className="min-h-[100dvh] w-full bg-[#f6f8fb]">
      {/* Full-width shell: intentionally NOT using the site-wide centered
          max-w container that other pages use — only a small gutter (px-2/px-3). */}
      <div className="flex w-full min-w-0 gap-6 px-2 pb-[max(4rem,env(safe-area-inset-bottom))] pt-[calc(5.5rem+env(safe-area-inset-top))] sm:gap-8 sm:px-3 sm:pt-24 md:pb-16">
        {/* Sidebar (desktop) */}
        <aside className="hidden w-60 shrink-0 md:block">
          <div className="sticky top-28 space-y-6">
            {/* Brand */}
            <div className="flex items-center gap-3 px-1">
              <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#4161df] text-white">
                <Building2 className="h-[18px] w-[18px]" aria-hidden />
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold tracking-tight text-gray-900">
                  PropertyBulbul
                </p>
                <p className="text-xs text-gray-400">Landlord workspace</p>
              </div>
            </div>

            {/* Primary nav */}
            <nav
              className="flex flex-col gap-0.5"
              aria-label="Landlord dashboard"
            >
              {LANDLORD_DASHBOARD_NAV.map(({ href, label, icon: Icon }) => {
                const active =
                  href === "/landlord/dashboard"
                    ? pathname === "/landlord/dashboard"
                    : pathname === href || pathname.startsWith(`${href}/`);
                return (
                  <Link
                    key={href}
                    href={href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex min-h-10 items-center gap-3 rounded-lg border-l-2 px-3 py-2 text-sm font-medium transition-colors",
                      active
                        ? "border-[#4161df] bg-[#4161df]/[0.06] text-[#4161df]"
                        : "border-transparent text-gray-600 hover:bg-gray-100/70 hover:text-gray-900",
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
            <div className="rounded-xl border border-gray-200 bg-white p-3">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#4161df]/10 text-xs font-semibold text-[#4161df]">
                  {getInitials(user?.name)}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-gray-900">
                    {user?.name ?? "Landlord"}
                  </p>
                  <p className="truncate text-xs capitalize text-gray-500">
                    {user?.role ?? "landlord"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Content */}
        <div className="min-w-0 flex-1">
          {/* Section nav (mobile) */}
          <div className="sticky top-[calc(3.5rem+env(safe-area-inset-top))] z-[1140] mb-5 rounded-xl border border-gray-200 bg-white/95 p-1.5 backdrop-blur-md md:hidden">
            <nav
              className="flex gap-2 overflow-x-auto [-webkit-overflow-scrolling:touch] [scrollbar-width:none] snap-x snap-mandatory [&::-webkit-scrollbar]:hidden"
              aria-label="Landlord dashboard sections"
            >
              {LANDLORD_DASHBOARD_NAV.map(({ href, label }) => {
                const active =
                  href === "/landlord/dashboard"
                    ? pathname === "/landlord/dashboard"
                    : pathname === href || pathname.startsWith(`${href}/`);
                return (
                  <Link
                    key={href}
                    href={href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "inline-flex min-h-[44px] shrink-0 snap-start items-center justify-center rounded-lg px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4161df]",
                      active
                        ? "bg-[#4161df] text-white"
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

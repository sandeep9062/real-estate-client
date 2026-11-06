"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { ChevronRight, LayoutDashboard, List, MapPin, UserPen } from "lucide-react";

import { cn } from "@/lib/utils";
import { selectUser } from "@/store/authSlice";
import { USER_DASHBOARD_NAV } from "./user-dashboard-nav";

function getInitials(name?: string | null): string {
  if (!name) return "U";
  const parts = name.trim().split(/\\s+/).slice(0, 2);
  return parts.map((part) => part.charAt(0).toUpperCase()).join("") || "U";
}

// Resolve the auth user's profile pic: absolute http(s) URLs pass through,
// relative paths (e.g. uploads/...) are served from the API origin.
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

function getUserImageUrl(imagePath?: string | null): string | undefined {
  if (!imagePath) return undefined;
  if (imagePath.startsWith("http")) return imagePath;
  const baseUrl = getApiBaseUrl().replace("/api", "");
  return `${baseUrl}/${imagePath.replace(/\\/g, "/")}`;
}

export default function UserDashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const user = useSelector(selectUser);
  const avatarUrl = getUserImageUrl(user?.image);

  return (
    <div className="min-h-[100dvh] w-full bg-[#f6f8fb]">
      {/* Full-width shell with side rail; same pattern as agent/landlord dashboards */}
      <div className="flex w-full min-w-0 gap-6 px-2 pb-[max(4rem,env(safe-area-inset-bottom))] pt-[calc(5.5rem+env(safe-area-inset-top))] sm:gap-8 sm:px-3 sm:pt-24 md:pb-16">
        {/* Sidebar (desktop) */}
        <aside className="hidden w-60 shrink-0 md:block">
          <div className="sticky top-28 space-y-7">
            {/* Brand */}
            <div className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#4161df] to-[#7c93f2] text-white shadow-md shadow-[#4161df]/25">
                <LayoutDashboard className="h-5 w-5" aria-hidden />
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-bold tracking-tight text-gray-900">
                  PropertyBulbul
                </p>
                <p className="text-[11px] font-medium uppercase tracking-widest text-gray-400">
                  User workspace
                </p>
              </div>
            </div>

            {/* Primary nav */}
            <nav className="flex flex-col gap-1" aria-label="User dashboard">
              {USER_DASHBOARD_NAV.map(({ href, label, icon: Icon }) => {
                const active =
                  href === "/user-dashboard"
                    ? pathname === "/user-dashboard"
                    : pathname === href || pathname.startsWith(`${href}/`);
                return (
                  <Link
                    key={href}
                    href={href}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4161df] focus-visible:ring-offset-2",
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
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={`${user?.name ?? "User"} profile picture`}
                    className="h-9 w-9 shrink-0 rounded-full object-cover ring-2 ring-white/80"
                  />
                ) : (
                  <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#4161df]/10 text-xs font-semibold text-[#4161df]">
                    {getInitials(user?.name)}
                  </span>
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-gray-900">
                    {user?.name ?? "User"}
                  </p>
                  <p className="truncate text-xs capitalize text-gray-500">
                    {user?.role ?? "user"}
                  </p>
                </div>
                <ChevronRight
                  className="h-4 w-4 shrink-0 text-gray-300"
                  aria-hidden
                />
              </div>
            </div>
          </div>
        </aside>

        {/* Content */}
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}

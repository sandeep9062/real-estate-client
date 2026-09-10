"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Plus, ChevronRight, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { FLATMATES_NAV } from "./flatmates-nav";

const BRAND = "#4161df";
const TINT_BG = "#EEF1FC";
const BORDER = "#E5E7F2";

export default function FlatmatesSidebar({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(true);

  const isActive = (href: string) =>
    href === "/flatmates"
      ? pathname === "/flatmates"
      : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <div className="min-h-[100dvh] w-full bg-[#f6f8fb]">
      <div className="flex w-full min-w-0 gap-6 px-2 pb-[max(4rem,env(safe-area-inset-bottom))] pt-[calc(5.5rem+env(safe-area-inset-top))] sm:gap-8 sm:px-3 sm:pt-24 md:pb-16">
        {/* Sidebar (desktop) */}
        <aside
          className={cn(
            "hidden shrink-0 transition-[width] duration-200 ease-in-out md:block",
            collapsed ? "w-16" : "w-64",
          )}
        >
          <div className="sticky top-28 space-y-5">
            <div
              className={cn(
                "flex items-center gap-3 px-1",
                collapsed && "justify-center px-0",
              )}
            >
              <span
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-white shadow-sm"
                style={{
                  background: BRAND,
                  boxShadow: `0 4px 14px -4px ${BRAND}55`,
                }}
              >
                <Home className="h-[18px] w-[18px]" aria-hidden />
              </span>
              {!collapsed && (
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold tracking-tight text-gray-900">
                    PropertyBulbul
                  </p>
                  <p className="text-xs text-gray-400">Flatmates</p>
                </div>
              )}
            </div>

            <nav
              className="flex flex-col gap-0.5 rounded-2xl border border-gray-200 bg-white p-2"
              aria-label="Flatmates"
            >
              {FLATMATES_NAV.map(({ href, label, icon: Icon }) => {
                const active = isActive(href);
                return (
                  <Link
                    key={href}
                    href={href}
                    aria-current={active ? "page" : undefined}
                    title={collapsed ? label : undefined}
                    className={cn(
                      "group flex min-h-10 items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors",
                      collapsed && "justify-center px-0",
                      active
                        ? "text-white"
                        : "text-gray-600 hover:bg-gray-100/80 hover:text-gray-900",
                    )}
                    style={active ? { background: BRAND } : undefined}
                  >
                    <Icon
                      className={cn(
                        "h-[18px] w-[18px] shrink-0",
                        active
                          ? "text-white"
                          : "text-gray-400 group-hover:text-gray-600",
                      )}
                      aria-hidden
                    />
                    {!collapsed && (
                      <span className="min-w-0 flex-1 truncate">{label}</span>
                    )}
                    {!collapsed && active && (
                      <ChevronRight
                        className="h-3.5 w-3.5 shrink-0 text-white/70"
                        aria-hidden
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            <Link
              href="/flatmates/onboarding"
              title={collapsed ? "List your room" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-xl border bg-white p-3 transition-colors hover:border-[#4161df]/30",
                collapsed && "justify-center",
              )}
              style={{ borderColor: BORDER }}
            >
              <span
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                style={{ background: TINT_BG, color: BRAND }}
              >
                <Plus className="h-[18px] w-[18px]" aria-hidden />
              </span>
              {!collapsed && (
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-gray-900">
                    List your room
                  </p>
                  <p className="truncate text-xs text-gray-500">
                    Find a flatmate fast
                  </p>
                </div>
              )}
            </Link>

            {/* Collapse toggle */}
            <button
              type="button"
              onClick={() => setCollapsed((v) => !v)}
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              aria-pressed={collapsed}
              className={cn(
                "flex min-h-9 w-full items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-500 transition-colors hover:bg-gray-100/80 hover:text-gray-900",
                collapsed && "justify-center px-0",
              )}
            >
              <ChevronLeft
                className={cn(
                  "h-4 w-4 shrink-0 transition-transform duration-200",
                  collapsed && "rotate-180",
                )}
                aria-hidden
              />
              {!collapsed && <span>Collapse</span>}
            </button>
          </div>
        </aside>

        {/* Content */}
        <div className="min-w-0 flex-1">
          {/* Section nav (mobile) */}
          <div className="sticky top-[calc(3.5rem+env(safe-area-inset-top))] z-[1140] mb-5 rounded-xl border border-gray-200 bg-white/95 p-1.5 backdrop-blur-md md:hidden">
            <nav
              className="flex gap-2 overflow-x-auto [-webkit-overflow-scrolling:touch] [scrollbar-width:none] snap-x snap-mandatory [&::-webkit-scrollbar]:hidden"
              aria-label="Flatmates sections"
            >
              {FLATMATES_NAV.map(({ href, label, icon: Icon }) => {
                const active = isActive(href);
                return (
                  <Link
                    key={href}
                    href={href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "inline-flex min-h-[44px] shrink-0 snap-start items-center justify-center gap-1.5 rounded-lg px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4161df]",
                      active ? "text-white" : "text-gray-700 hover:bg-gray-100",
                    )}
                    style={active ? { background: BRAND } : undefined}
                  >
                    <Icon
                      className={cn(
                        "h-4 w-4 shrink-0",
                        active ? "text-white" : "text-gray-400",
                      )}
                      aria-hidden
                    />
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

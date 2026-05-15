"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { AGENT_DASHBOARD_NAV } from "./agent-dashboard-nav";

export default function AgentDashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="mx-auto flex w-full max-w-6xl min-w-0 gap-6 px-3 pb-[max(4rem,env(safe-area-inset-bottom))] pt-[calc(5.5rem+env(safe-area-inset-top))] sm:gap-8 sm:px-4 sm:pt-24 md:pb-16">
      <aside className="hidden w-52 shrink-0 md:block">
        <div className="sticky top-28 space-y-1">
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
            Agent workspace
          </p>
          <nav className="flex flex-col gap-0.5" aria-label="Agent dashboard">
            {AGENT_DASHBOARD_NAV.map(({ href, label, icon: Icon }) => {
              const active =
                href === "/agent-dashboard"
                  ? pathname === "/agent-dashboard"
                  : pathname === href || pathname.startsWith(`${href}/`);
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "flex min-h-10 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors active:bg-gray-100",
                    active
                      ? "bg-indigo-50 text-[#4161df]"
                      : "text-gray-700 hover:bg-gray-100",
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0 opacity-90" aria-hidden />
                  {label}
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <div className="sticky top-[calc(3.75rem+env(safe-area-inset-top))] z-[1140] -mx-3 mb-5 border-b border-gray-100 bg-white/95 px-3 py-3 backdrop-blur-md sm:-mx-4 sm:px-4 md:static md:z-auto md:mx-0 md:mb-6 md:border-0 md:bg-transparent md:p-0 md:backdrop-blur-none">
          <nav
            className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 [-webkit-overflow-scrolling:touch] [scrollbar-width:none] md:hidden [&::-webkit-scrollbar]:hidden snap-x snap-mandatory"
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
                  className={cn(
                    "inline-flex min-h-[44px] shrink-0 snap-start items-center justify-center rounded-full px-4 py-2.5 text-sm font-medium whitespace-nowrap ring-offset-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4161df]",
                    active
                      ? "bg-[#4161df] text-white shadow-sm"
                      : "border border-gray-200 bg-white text-gray-800 active:bg-gray-50",
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
  );
}

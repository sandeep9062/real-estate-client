import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Megaphone,
  Home,
  CalendarDays,
} from "lucide-react";

export type AgentDashboardNavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

export const AGENT_DASHBOARD_NAV: AgentDashboardNavItem[] = [
  { href: "/agent-dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/agent-dashboard/marketing", label: "Marketing", icon: Megaphone },
  { href: "/agent-dashboard/listings", label: "Listings", icon: Home },
  { href: "/agent-dashboard/visits", label: "Visits", icon: CalendarDays },
];

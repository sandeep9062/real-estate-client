import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Building2,
  Users,
  CalendarDays,
  UserPen,
  LifeBuoy,
} from "lucide-react";

export type BuilderDashboardNavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

export const BUILDER_DASHBOARD_NAV: BuilderDashboardNavItem[] = [
  { href: "/builder-dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/builder-dashboard/projects", label: "Projects", icon: Building2 },
  { href: "/builder-dashboard/leads", label: "Leads", icon: Users },
  { href: "/builder-dashboard/visits", label: "Visits", icon: CalendarDays },
  { href: "/builder-dashboard/profile", label: "Profile", icon: UserPen },
  { href: "/contact", label: "Help & support", icon: LifeBuoy },
];

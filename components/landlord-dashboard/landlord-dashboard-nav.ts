import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Building2,
  CalendarDays,
  UserPen,
  LifeBuoy,
} from "lucide-react";

export type LandlordDashboardNavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

export const LANDLORD_DASHBOARD_NAV: LandlordDashboardNavItem[] = [
  { href: "/landlord/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/landlord/dashboard/visits", label: "Visits", icon: CalendarDays },
  { href: "/owned", label: "My properties", icon: Building2 },
  { href: "/landlord/dashboard/profile", label: "Profile", icon: UserPen },
  { href: "/contact", label: "Help & support", icon: LifeBuoy },
];

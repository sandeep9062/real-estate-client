import type { LucideIcon } from "lucide-react";
import { LayoutDashboard, Heart, CalendarDays, UserPen } from "lucide-react";

export type UserDashboardNavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

export const USER_DASHBOARD_NAV: UserDashboardNavItem[] = [
  { href: "/user-dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/user-dashboard/favourites", label: "Favourites", icon: Heart },
  { href: "/user-dashboard/booking-history", label: "Bookings", icon: CalendarDays },
  { href: "/user-dashboard/profile", label: "Profile", icon: UserPen },
];

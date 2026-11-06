import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Heart,
  CalendarDays,
  UserPen,
  Bell,
  UserRound,
  MessageSquare,
} from "lucide-react";

export type UserDashboardNavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

export const USER_DASHBOARD_NAV: UserDashboardNavItem[] = [
  { href: "/user-dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/favourites", label: "Favourites", icon: Heart },
  {
    href: "/bookings",
    label: "Bookings",
    icon: CalendarDays,
  },

  { href: "/user-dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/saved-searches", label: "Saved", icon: Heart },

  {
    href: "/user-dashboard/enquiries",
    label: "Enquiries",
    icon: MessageSquare,
  },
  { href: "/account/profile", label: "Profile", icon: UserPen },
];

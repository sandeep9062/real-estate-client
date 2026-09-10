import type { LucideIcon } from "lucide-react";
import {
  Home,
  Search,
  ArrowLeftRight,
  MessagesSquare,
  User,
  UserPlus,
} from "lucide-react";

export type FlatmatesNavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

export const FLATMATES_NAV: FlatmatesNavItem[] = [
  { href: "/flatmates", label: "Overview", icon: Home },
  { href: "/flatmates/browse", label: "Browse rooms", icon: Search },
  { href: "/flatmates/swap", label: "Swap matches", icon: ArrowLeftRight },
  { href: "/flatmates/connections", label: "Connections", icon: MessagesSquare },
  { href: "/flatmates/profile/me", label: "My profile", icon: User },
  { href: "/flatmates/onboarding", label: "Create listing", icon: UserPlus },
];

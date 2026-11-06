import type { Metadata } from "next";
import UserDashboardRoot from "@/components/user-dashboard/UserDashboardRoot";

export const metadata: Metadata = {
  title: "User dashboard | PropertyBulbul",
  description: "Your personal workspace on PropertyBulbul — view favourites, bookings, and profile.",
  robots: { index: false, follow: false },
};

export default function UserDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <UserDashboardRoot>{children}</UserDashboardRoot>;
}

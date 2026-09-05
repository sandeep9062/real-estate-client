import type { Metadata } from "next";
import LandlordDashboardShell from "@/components/landlord-dashboard/LandlordDashboardShell";

export const metadata: Metadata = {
  title: "Landlord dashboard | PropertyBulbul",
  description:
    "Landlord workspace for managing property listings, profile and support on PropertyBulbul.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function LandlordDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <LandlordDashboardShell>{children}</LandlordDashboardShell>;
}

import type { Metadata } from "next";
import BuilderDashboardShell from "@/components/builder-dashboard/BuilderDashboardShell";

export const metadata: Metadata = {
  title: "Builder dashboard | PropertyBulbul",
  description:
    "Builder workspace for managing projects, leads, visits, and profile on PropertyBulbul.",
  robots: { index: false, follow: false },
};

export default function BuilderDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <BuilderDashboardShell>{children}</BuilderDashboardShell>;
}

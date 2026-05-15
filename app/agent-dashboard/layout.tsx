import type { Metadata } from "next";
import AgentDashboardRoot from "@/components/agent-dashboard/AgentDashboardRoot";

export const metadata: Metadata = {
  title: "Agent dashboard | PropertyBulbul",
  description:
    "Agent workspace for listings, marketing connections, and visits on PropertyBulbul.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AgentDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AgentDashboardRoot>{children}</AgentDashboardRoot>;
}

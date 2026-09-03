import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Leads | Agent dashboard",
};

export default function AgentLeadsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
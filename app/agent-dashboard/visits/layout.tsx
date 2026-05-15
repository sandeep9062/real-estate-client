import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Visits | Agent dashboard",
};

export default function AgentVisitsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

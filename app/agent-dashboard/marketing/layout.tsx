import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Marketing | Agent dashboard",
};

export default function AgentMarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

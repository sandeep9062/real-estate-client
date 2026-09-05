import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Listings | Agent dashboard",
};

export default function AgentListingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

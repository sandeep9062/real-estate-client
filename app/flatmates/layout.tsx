import type { Metadata } from "next";
import FlatmatesSidebar from "@/components/flatmates/FlatmatesSidebar";

export const metadata: Metadata = {
  title: "Flatmates & shared rooms | PropertyBulbul",
  description:
    "Find a flatmate or list your spare room in Chandigarh, Mohali, Panchkula and Zirakpur. Compatibility matching, verified profiles, swaps and short-term stays.",
};

export default function FlatmatesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <FlatmatesSidebar>{children}</FlatmatesSidebar>;
}

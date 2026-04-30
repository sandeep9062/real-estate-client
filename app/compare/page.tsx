import type { Metadata } from "next";
import ComparePageClient from "./ComparePageClient";

export const metadata: Metadata = {
  title: "Compare properties | PropertyBulbul",
  description: "Compare real estate listings side by side.",
};

export default function ComparePage() {
  return <ComparePageClient />;
}

import type { Metadata } from "next";
import GuidesPageClient from "./GuidesPageClient";

export const metadata: Metadata = {
  title: "Area guides — localities & neighborhoods",
  description:
    "Neighborhood and sector guides for the Tricity: schools, commute, lifestyle, and property context. Editorial journals grouped by locality.",
  openGraph: {
    title: "Area guides | PropertyBulbul",
    description:
      "Locality-focused guides across Chandigarh, Mohali, Zirakpur, and nearby sectors.",
  },
};

export default function GuidesPage() {
  return <GuidesPageClient />;
}

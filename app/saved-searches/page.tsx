import type { Metadata } from "next";
import SavedSearchesPageClient from "./SavedSearchesPageClient";

export const metadata: Metadata = {
  title: "Saved searches | PropertyBulbul",
  description: "Manage property alerts and saved filters.",
};

export default function SavedSearchesPage() {
  return <SavedSearchesPageClient />;
}

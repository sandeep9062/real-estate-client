import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your Saved Searches",
  description:
    "Save property searches on PropertyBulbul and get email and in-app alerts when new listings match your filters in Chandigarh, Mohali, Panchkula, and Zirakpur.",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
  alternates: {
    canonical: "/saved-searches",
  },
};

export default function SavedSearchesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

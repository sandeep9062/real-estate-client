import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Top Real Estate Agents in Tricity | Verified Agent Directory",
  description:
    "Find verified real estate agents in Chandigarh, Mohali, Panchkula, Zirakpur & Kharar. Browse agent profiles, ratings, reviews, and book a free consultation on PropertyBulbul.",
  alternates: {
    canonical: "https://www.propertybulbul.com/agents",
  },
  openGraph: {
    title: "Top Real Estate Agents in Tricity | Verified Agent Directory",
    description:
      "Find verified real estate agents in Chandigarh, Mohali, Panchkula, Zirakpur & Kharar. Browse agent profiles, ratings, reviews, and book a free consultation.",
    url: "https://www.propertybulbul.com/agents",
    type: "website",
    images: [
      {
        url: "https://www.propertybulbul.com/property-tricity.jpg",
        width: 1200,
        height: 630,
        alt: "Top Real Estate Agents in Tricity - PropertyBulbul",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Top Real Estate Agents in Tricity | Verified Agent Directory",
    description:
      "Find verified real estate agents in Chandigarh, Mohali, Panchkula, Zirakpur & Kharar. Browse agent profiles, ratings, reviews, and book a free consultation.",
    images: ["https://www.propertybulbul.com/property-tricity.jpg"],
  },
};

export default function AgentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

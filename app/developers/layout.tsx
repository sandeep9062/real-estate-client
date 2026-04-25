import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Top Real Estate Developers in Tricity | Propertybulbul",
  description:
    "Discover verified real estate developers in Chandigarh, Mohali, Panchkula, and Zirakpur. Explore their projects, track records, and available properties on Propertybulbul.",
  keywords: [
    "real estate developers",
    "property developers chandigarh",
    "builders mohali",
    "developers panchkula",
    "verified developers tricity",
    "top builders zirakpur",
    "propertybulbul developers",
  ],
  alternates: {
    canonical: "https://propertybulbul.com/developers",
  },
  openGraph: {
    title: "Top Real Estate Developers in Tricity | Propertybulbul",
    description:
      "Discover verified real estate developers in Chandigarh, Mohali, Panchkula, and Zirakpur.",
    url: "https://propertybulbul.com/developers",
    type: "website",
    images: [
      {
        url: "https://propertybulbul.com/property-tricity.jpg",
        width: 1200,
        height: 630,
        alt: "Top Real Estate Developers in Tricity",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Top Real Estate Developers in Tricity | Propertybulbul",
    description:
      "Discover verified real estate developers in Chandigarh, Mohali, Panchkula, and Zirakpur.",
    images: ["https://propertybulbul.com/property-tricity.jpg"],
  },
};

export default function DevelopersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

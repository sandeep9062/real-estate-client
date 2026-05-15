import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Top Real Estate Developers in Tricity | PropertyBulbul",
  description:
    "Discover verified real estate developers in Chandigarh, Mohali, Panchkula, and Zirakpur. Explore their projects, track records, and available properties on PropertyBulbul.",
  alternates: {
    canonical: "https://www.propertybulbul.com/developers",
  },
  openGraph: {
    title: "Top Real Estate Developers in Tricity | PropertyBulbul",
    description:
      "Discover verified real estate developers in Chandigarh, Mohali, Panchkula, and Zirakpur.",
    url: "https://www.propertybulbul.com/developers",
    type: "website",
    images: [
      {
        url: "https://www.propertybulbul.com/property-tricity.jpg",
        width: 1200,
        height: 630,
        alt: "Top Real Estate Developers in Tricity",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Top Real Estate Developers in Tricity | PropertyBulbul",
    description:
      "Discover verified real estate developers in Chandigarh, Mohali, Panchkula, and Zirakpur.",
    images: ["https://www.propertybulbul.com/property-tricity.jpg"],
  },
};

export default function DevelopersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

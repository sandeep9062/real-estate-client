import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Disclaimer | PropertyBulbul",
  description:
    "Read the legal disclaimer for PropertyBulbul. Understand the limitations of liability, accuracy of information, and third-party content on our real estate platform.",
  keywords: [
    "disclaimer",
    "legal disclaimer",
    "propertybulbul disclaimer",
    "real estate liability",
    "platform disclaimer",
  ],
  alternates: {
    canonical: "https://www.propertybulbul.com/disclaimer",
  },
  openGraph: {
    title: "Disclaimer | PropertyBulbul",
    description: "Legal disclaimer for PropertyBulbul's real estate platform.",
    url: "https://www.propertybulbul.com/disclaimer",
    type: "website",
    images: [
      {
        url: "https://www.propertybulbul.com/property-tricity.jpg",
        width: 1200,
        height: 630,
        alt: "PropertyBulbul Disclaimer",
      },
    ],
  },
};

export default function DisclaimerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

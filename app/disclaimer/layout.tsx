import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Disclaimer | Propertybulbul",
  description:
    "Read the legal disclaimer for Propertybulbul. Understand the limitations of liability, accuracy of information, and third-party content on our real estate platform.",
  keywords: [
    "disclaimer",
    "legal disclaimer",
    "propertybulbul disclaimer",
    "real estate liability",
    "platform disclaimer",
  ],
  alternates: {
    canonical: "https://propertybulbul.com/disclaimer",
  },
  openGraph: {
    title: "Disclaimer | Propertybulbul",
    description: "Legal disclaimer for Propertybulbul's real estate platform.",
    url: "https://propertybulbul.com/disclaimer",
    type: "website",
    images: [
      {
        url: "https://propertybulbul.com/property-tricity.jpg",
        width: 1200,
        height: 630,
        alt: "Propertybulbul Disclaimer",
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

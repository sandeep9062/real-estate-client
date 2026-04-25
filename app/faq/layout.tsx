import { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ | Propertybulbul - Frequently Asked Questions",
  description:
    "Find answers to frequently asked questions about buying, selling, and renting properties in Tricity (Chandigarh, Panchkula, Mohali). Learn how to list your property, schedule visits, and more.",
  keywords: [
    "property faq",
    "real estate questions",
    "property listing faq",
    "buy property chandigarh",
    "sell property tricity",
    "rent house mohali",
    "property visits",
    "propertybulbul help",
    "real estate support",
  ],
  alternates: {
    canonical: "https://propertybulbul.com/faq",
  },
  openGraph: {
    title: "FAQ | Propertybulbul - Frequently Asked Questions",
    description:
      "Find answers to frequently asked questions about buying, selling, and renting properties in Tricity.",
    url: "https://propertybulbul.com/faq",
    type: "website",
    images: [
      {
        url: "https://propertybulbul.com/property-tricity.jpg",
        width: 1200,
        height: 630,
        alt: "Propertybulbul FAQ",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FAQ | Propertybulbul",
    description: "Frequently asked questions about real estate in Tricity.",
    images: ["https://propertybulbul.com/property-tricity.jpg"],
  },
};

export default function FAQLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

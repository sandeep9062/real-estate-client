import { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ | PropertyBulbul - Frequently Asked Questions",
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
    "real estate inquiries",
    "propertybulbul help",
    "real estate support",
  ],
  alternates: {
    canonical: "https://www.propertybulbul.com/faq",
  },
  openGraph: {
    title: "FAQ | PropertyBulbul - Frequently Asked Questions",
    description:
      "Find answers to frequently asked questions about buying, selling, and renting properties in Tricity.",
    url: "https://www.propertybulbul.com/faq",
    type: "website",
    images: [
      {
        url: "https://www.propertybulbul.com/property-tricity.jpg",
        width: 1200,
        height: 630,
        alt: "PropertyBulbul FAQ",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FAQ | PropertyBulbul",
    description: "Frequently asked questions about real estate in Tricity.",
    images: ["https://www.propertybulbul.com/property-tricity.jpg"],
  },
};

export default function FAQLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

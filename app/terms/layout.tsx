import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions | PropertyBulbul",
  description:
    "Read the Terms & Conditions for using Propertybulbul's real estate platform. Understand your rights and responsibilities when buying, selling, or renting properties in Tricity.",
  alternates: {
    canonical: "https://www.propertybulbul.com/terms",
  },
  openGraph: {
    title: "Terms & Conditions | PropertyBulbul",
    description:
      "Terms & Conditions for using PropertyBulbul's real estate platform.",
    url: "https://www.propertybulbul.com/terms",
    type: "website",
    images: [
      {
        url: "https://www.propertybulbul.com/property-tricity.jpg",
        width: 1200,
        height: 630,
        alt: "PropertyBulbul Terms & Conditions",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Terms & Conditions | PropertyBulbul",
    description:
      "Terms & Conditions for using PropertyBulbul's real estate platform.",
    images: ["https://www.propertybulbul.com/property-tricity.jpg"],
  },
};

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

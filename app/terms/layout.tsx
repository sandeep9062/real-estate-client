import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions | Propertybulbul",
  description:
    "Read the Terms & Conditions for using Propertybulbul's real estate platform. Understand your rights and responsibilities when buying, selling, or renting properties in Tricity.",
  keywords: [
    "terms and conditions",
    "propertybulbul terms",
    "real estate terms",
    "property platform terms",
    "user agreement",
  ],
  alternates: {
    canonical: "https://propertybulbul.com/terms",
  },
  openGraph: {
    title: "Terms & Conditions | Propertybulbul",
    description:
      "Terms & Conditions for using Propertybulbul's real estate platform.",
    url: "https://propertybulbul.com/terms",
    type: "website",
    images: [
      {
        url: "https://propertybulbul.com/property-tricity.jpg",
        width: 1200,
        height: 630,
        alt: "Propertybulbul Terms & Conditions",
      },
    ],
  },
};

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

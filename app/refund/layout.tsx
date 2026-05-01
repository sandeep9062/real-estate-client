import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refund Policy | PropertyBulbul",
  description:
    "Learn about PropertyBulbul's refund policy, cancellation terms, and conditions for subscription refunds. Understand processing fees and refund timelines.",
  keywords: [
    "refund policy",
    "propertybulbul refund",
    "cancellation policy",
    "subscription refund",
    "real estate refund",
  ],
  alternates: {
    canonical: "https://www.propertybulbul.com/refund",
  },
  openGraph: {
    title: "Refund Policy | PropertyBulbul",
    description:
      "Learn about PropertyBulbul's refund policy and cancellation terms.",
    url: "https://www.propertybulbul.com/refund",
    type: "website",
    images: [
      {
        url: "https://www.propertybulbul.com/property-tricity.jpg",
        width: 1200,
        height: 630,
        alt: "PropertyBulbul Refund Policy",
      },
    ],
  },
};

export default function RefundLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

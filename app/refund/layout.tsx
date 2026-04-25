import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refund Policy | Propertybulbul",
  description:
    "Learn about Propertybulbul's refund policy, cancellation terms, and conditions for subscription refunds. Understand processing fees and refund timelines.",
  keywords: [
    "refund policy",
    "propertybulbul refund",
    "cancellation policy",
    "subscription refund",
    "real estate refund",
  ],
  alternates: {
    canonical: "https://propertybulbul.com/refund",
  },
  openGraph: {
    title: "Refund Policy | Propertybulbul",
    description:
      "Learn about Propertybulbul's refund policy and cancellation terms.",
    url: "https://propertybulbul.com/refund",
    type: "website",
    images: [
      {
        url: "https://propertybulbul.com/property-tricity.jpg",
        width: 1200,
        height: 630,
        alt: "Propertybulbul Refund Policy",
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

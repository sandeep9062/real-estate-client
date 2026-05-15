import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | PropertyBulbul",
  description:
    "Read the privacy policy of PropertyBulbul. We are committed to protecting your personal information and being transparent about how we handle it.",
  openGraph: {
    title: "Privacy Policy | PropertyBulbul",
    description:
      "Learn about how we protect your data and respect your privacy at PropertyBulbul.",
    url: "https://www.propertybulbul.com/privacy-policy",
    type: "website",
    images: [
      {
        url: "https://www.propertybulbul.com/property-tricity.jpg",
        width: 1200,
        height: 630,
        alt: "Privacy Policy",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy | PropertyBulbul",
    description:
      "Our commitment to your privacy. Read our policy to understand how we handle your data.",
    images: ["https://www.propertybulbul.com/property-tricity.jpg"],
  },
  alternates: {
    canonical: "https://www.propertybulbul.com/privacy-policy",
  },
};

export default function PrivacyPolicyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

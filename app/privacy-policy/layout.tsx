import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Propertybulbul",
  description:
    "Read the privacy policy of Propertybulbul. We are committed to protecting your personal information and being transparent about how we handle it.",
  keywords: [
    "privacy policy",
    "data protection",
    "user privacy",
    "terms of service",
  ],
  openGraph: {
    title: "Privacy Policy | Propertybulbul",
    description:
      "Learn about how we protect your data and respect your privacy at Propertybulbul.",
    url: "https://propertybulbul.com/privacy-policy",
    type: "website",
    images: [
      {
        url: "https://propertybulbul.com/og-privacy.jpg",
        width: 1200,
        height: 630,
        alt: "Privacy Policy",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy | Propertybulbul",
    description:
      "Our commitment to your privacy. Read our policy to understand how we handle your data.",
    images: ["https://propertybulbul.com/twitter-privacy.jpg"],
  },
};

export default function PrivacyPolicyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

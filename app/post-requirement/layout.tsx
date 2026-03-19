import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Post Your Property Requirement | Propertybulbul",
  description:
    "Looking for a property? Post your requirements on Propertybulbul and get matched with the best properties that meet your needs. It's fast, easy, and free.",
  keywords: [
    "post property requirement",
    "find property",
    "real estate requirements",
    "buy property",
    "rent property",
    "property match",
  ],
  openGraph: {
    title: "Post Your Property Requirement | Propertybulbul",
    description:
      "Tell us what you're looking for and let us find your dream property. Post your requirements now on Propertybulbul.",
    url: "https://propertybulbul.com/post-requirement",
    type: "website",
    images: [
      {
        url: "https://propertybulbul.com/og-post-requirement.jpg",
        width: 1200,
        height: 630,
        alt: "Post Your Property Requirement",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Post Your Property Requirement | Propertybulbul",
    description:
      "Looking for a new property? Post your needs on Propertybulbul and find the perfect match.",
    images: ["https://propertybulbul.com/twitter-post-requirement.jpg"],
  },
};

export default function PostRequirementLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Post Your Property Requirement | PropertyBulbul",
  description:
    "Looking for a property? Post your requirements on PropertyBulbul and get matched with the best properties that meet your needs. It's fast, easy, and free.",
  keywords: [
    "post property requirement",
    "find property",
    "real estate requirements",
    "buy property",
    "rent property",
    "property match",
  ],
  openGraph: {
    title: "Post Your Property Requirement | PropertyBulbul",
    description:
      "Tell us what you're looking for and let us find your dream property. Post your requirements now on PropertyBulbul.",
    url: "https://www.propertybulbul.com/post-requirement",
    type: "website",
    images: [
      {
        url: "https://www.propertybulbul.com/property-tricity.jpg",
        width: 1200,
        height: 630,
        alt: "Post Your Property Requirement",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Post Your Property Requirement | PropertyBulbul",
    description:
      "Looking for a new property? Post your needs on PropertyBulbul and find the perfect match.",
    images: ["https://www.propertybulbul.com/property-tricity.jpg"],
  },
};

export default function PostRequirementLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

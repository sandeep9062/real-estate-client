import { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Properties for Sale & Rent in Tricity (Chandigarh, Panchkula, Mohali) | Propertybulbul",
  description:
    "Discover premium properties for sale and rent in Tricity including Chandigarh, Panchkula, Mohali, and Kharar. Explore apartments, houses, villas, commercial spaces, and plots. Find your dream home with Propertybulbul's verified listings.",
  keywords: [
    "real estate Tricity",
    "properties for sale Chandigarh",
    "rent house Panchkula",
    "apartments Mohali",
    "commercial property Kharar",
    "flats for rent Tricity",
    "buy property India",
    "real estate listings",
    "property search",
    "dream home",
    "verified properties",
    "land plots",
    "office space",
    " ware house",
    "retail shops"
  ],
  alternates: {
    canonical: "https://propertybulbul.com/properties",
  },
  openGraph: {
    title: "Properties for Sale & Rent in Tricity | Propertybulbul",
    description:
      "Discover premium properties for sale and rent in Chandigarh, Panchkula, Mohali, and Kharar. Find your dream home with Propertybulbul.",
    url: "https://propertybulbul.com/properties",
    type: "website",
    images: [
      {
        url: "https://propertybulbul.com/og-properties.jpg",
        width: 1200,
        height: 630,
        alt: "Find Your Dream Home in Tricity Properties",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Properties for Sale & Rent in Tricity | Propertybulbul",
    description:
      "Explore premium properties for sale and rent in Chandigarh, Panchkula, Mohali. Find your perfect home with Propertybulbul.",
    images: ["https://propertybulbul.com/twitter-properties.jpg"],
  },
};

export default function PropertiesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Script
        id="breadcrumb-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://propertybulbul.com"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Properties",
                "item": "https://propertybulbul.com/properties"
              }
            ]
          }),
        }}
      />
      <Script
        id="collectionpage-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "@id": "https://propertybulbul.com/properties",
            "name": "Properties for Sale & Rent in Tricity",
            "description": "Discover premium properties for sale and rent in Tricity including Chandigarh, Panchkula, Mohali, and Kharar.",
            "url": "https://propertybulbul.com/properties",
            "publisher": {
              "@type": "Organization",
              "name": "Propertybulbul",
              "url": "https://propertybulbul.com",
              "logo": {
                "@type": "ImageObject",
                "url": "https://propertybulbul.com/logo.png"
              }
            },
            "about": {
              "@type": "Place",
              "name": "Tricity (Chandigarh, Panchkula, Mohali)"
            }
          }),
        }}
      />
      {children}
    </>
  );
}

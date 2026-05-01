import { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  title:
    "Properties for Sale & Rent in Tricity (Chandigarh, Panchkula, Mohali) | Propertybulbul",
  description:
    "Discover premium properties for sale and rent in Tricity including Chandigarh, Panchkula, Mohali, and Kharar. Explore apartments, houses, villas, commercial spaces, and plots. Find your dream home with Propertybulbul's verified listings.",
  keywords: [
    // High-Intent Search Terms
    "buy property in Chandigarh",
    "flats for sale in Mohali",
    "house for rent in Panchkula",
    "ready to move flats in Zirakpur",
    "commercial SCO for sale in Tricity",

    // Location Specific Listing Terms
    "plots for sale in New Chandigarh",
    "luxury apartments Mohali",
    "independent floors in Panchkula",
    "industrial plots for lease Mohali",
    "SCO for sale in Peer Muchalla",

    // Category Based
    "real estate listings Tricity",
    "verified property dealers in Chandigarh",
    "PropertyBulbul listings",
    "residential properties in Kharar",
    "investment plots near Morni Hills",
  ],
  alternates: {
    canonical: "https://www.propertybulbul.com/properties",
  },
  openGraph: {
    title: "Properties for Sale & Rent in Tricity | PropertyBulbul",
    description:
      "Discover premium properties for sale and rent in Chandigarh, Panchkula, Mohali, and Kharar. Find your dream home with PropertyBulbul.",
    url: "https://www.propertybulbul.com/properties",
    type: "website",
    images: [
      {
        url: "https://www.propertybulbul.com/property-tricity.jpg",
        width: 1200,
        height: 630,
        alt: "Find Your Dream Home in Tricity Properties",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Properties for Sale & Rent in Tricity | PropertyBulbul",
    description:
      "Explore premium properties for sale and rent in Chandigarh, Panchkula, Mohali. Find your perfect home with PropertyBulbul.",
    images: ["https://www.propertybulbul.com/property-tricity.jpg"],
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
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: "https://www.propertybulbul.com",
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "Properties",
                item: "https://www.propertybulbul.com/properties",
              },
            ],
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
            "@id": "https://www.propertybulbul.com/properties",
            name: "Properties for Sale & Rent in Tricity",
            description:
              "Discover premium properties for sale and rent in Tricity including Chandigarh, Panchkula, Mohali, and Kharar.",
            url: "https://www.propertybulbul.com/properties",
            publisher: {
              "@type": "Organization",
              name: "PropertyBulbul",
              url: "https://www.propertybulbul.com",
              logo: {
                "@type": "ImageObject",
                url: "https://www.propertybulbul.com/propertybulbul.png",
              },
            },
            about: {
              "@type": "Place",
              name: "Tricity (Chandigarh, Panchkula, Mohali)",
            },
          }),
        }}
      />
      {children}
    </>
  );
}

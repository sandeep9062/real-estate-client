// app/properties/layout.tsx
// SERVER COMPONENT — no "use client".
// Handles structured data (JSON-LD) injected once per page load.

import Script from "next/script";

const SITE_URL = "https://www.propertybulbul.com";

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    {
      "@type": "ListItem",
      position: 2,
      name: "Properties",
      item: `${SITE_URL}/properties`,
    },
  ],
};

const collectionPageSchema = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "@id": `${SITE_URL}/properties`,
  name: "Properties for Sale & Rent in Tricity",
  description:
    "Premium verified properties for sale and rent in Chandigarh, Panchkula, Mohali, Zirakpur and Kharar.",
  url: `${SITE_URL}/properties`,
  inLanguage: "en-IN",
  publisher: {
    "@type": "Organization",
    name: "PropertyBulbul",
    url: SITE_URL,
    logo: { "@type": "ImageObject", url: `${SITE_URL}/propertybulbul.png` },
  },
  about: {
    "@type": "Place",
    name: "Tricity",
    containsPlace: [
      { "@type": "City", name: "Chandigarh" },
      { "@type": "City", name: "Mohali" },
      { "@type": "City", name: "Panchkula" },
      { "@type": "City", name: "Zirakpur" },
      { "@type": "City", name: "Kharar" },
    ],
  },
};

const realEstateAgentSchema = {
  "@context": "https://schema.org",
  "@type": "RealEstateAgent",
  name: "PropertyBulbul",
  url: SITE_URL,
  logo: `${SITE_URL}/propertybulbul.png`,
  description:
    "Tricity's most helpful real estate partner. Verified properties with direct WhatsApp connect.",
  areaServed: [
    { "@type": "City", name: "Chandigarh" },
    { "@type": "City", name: "Mohali" },
    { "@type": "City", name: "Panchkula" },
    { "@type": "City", name: "Zirakpur" },
    { "@type": "City", name: "Kharar" },
  ],
  sameAs: [
    "https://facebook.com/propertybulbul",
    "https://www.instagram.com/property_bulbul",
    "https://www.linkedin.com/in/property-bulbul",
  ],
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Script
        id="collectionpage-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionPageSchema) }}
      />
      <Script
        id="realestateagent-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(realEstateAgentSchema) }}
      />
      {children}
    </>
  );
}

import type { Metadata } from "next";

const SITE = "https://www.propertybulbul.com";
const PAGE_URL = `${SITE}/flatmates`;
const OG_IMAGE = `${SITE}/property-tricity.jpg`;

export const metadata: Metadata = {
  title:
    "Find a Flatmate in Tricity | Roommates in Chandigarh, Mohali & Panchkula",
  description:
    "Browse verified flatmate profiles in Chandigarh, Mohali, Panchkula and Zirakpur. Filter by budget, occupation and lifestyle, find a room or someone to share yours.",
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    title: "Find a Flatmate in Tricity | PropertyBulbul",
    description:
      "Verified flatmate profiles across Chandigarh, Mohali, Panchkula and Zirakpur. Filter by budget, lifestyle and more.",
    url: PAGE_URL,
    siteName: "PropertyBulbul",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Find a flatmate in Tricity on PropertyBulbul",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Find a Flatmate in Tricity | PropertyBulbul",
    description:
      "Verified flatmate profiles across Chandigarh, Mohali, Panchkula and Zirakpur.",
    images: [OG_IMAGE],
  },
};

// Structured data for the flatmates listing page
function FlatmatesStructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Find a Flatmate in Tricity",
    description:
      "Browse verified flatmate profiles in Chandigarh, Mohali, Panchkula and Zirakpur.",
    url: PAGE_URL,
    inLanguage: "en-IN",
    isPartOf: {
      "@type": "WebSite",
      name: "PropertyBulbul",
      url: SITE,
    },
    publisher: {
      "@type": "Organization",
      name: "PropertyBulbul",
      url: SITE,
      logo: {
        "@type": "ImageObject",
        url: `${SITE}/propertybulbul.png`,
      },
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: SITE,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Flatmates",
          item: PAGE_URL,
        },
      ],
    },
  };

  return (
    <script
      id="flatmates-jsonld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        // Escape "<" so the JSON can never close the script tag early.
        __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
      }}
    />
  );
}

export default function FlatmatesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <FlatmatesStructuredData />
      {children}
    </>
  );
}

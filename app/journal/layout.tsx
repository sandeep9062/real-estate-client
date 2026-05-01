import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Real Estate Journal | Market Insights for Tricity",
  description:
    "Expert analysis, market trends, and property investment guides for Chandigarh, Mohali, Panchkula, and Zirakpur. Read the PropertyBulbul Journal for data-driven real estate insights.",
  keywords: [
    "real estate journal",
    "property market insights",
    "tricity real estate news",
    "chandigarh property guide",
    "mohali investment tips",
    "panchkula property trends",
    "zirakpur real estate",
    "property investment india",
    "real estate blog",
    "property buying guide",
  ],
  alternates: {
    canonical: "https://www.propertybulbul.com/journal",
  },
  openGraph: {
    title: "Real Estate Journal | Market Insights for Tricity",
    description:
      "Expert analysis and property investment guides for Chandigarh, Mohali, Panchkula, and Zirakpur.",
    url: "https://www.propertybulbul.com/journal",
    siteName: "PropertyBulbul",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "https://www.propertybulbul.com/property-tricity.jpg",
        width: 1200,
        height: 630,
        alt: "PropertyBulbul Real Estate Journal",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Real Estate Journal | Market Insights for Tricity",
    description:
      "Expert analysis and property investment guides for Chandigarh, Mohali, Panchkula, and Zirakpur.",
    images: ["https://www.propertybulbul.com/property-tricity.jpg"],
  },
};

// Structured Data for Blog Listing Page
function JournalStructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "PropertyBulbul Journal",
    description:
      "Expert analysis, market trends, and property investment guides for Tricity.",
    url: "https://www.propertybulbul.com/journal",
    publisher: {
      "@type": "Organization",
      name: "PropertyBulbul",
      url: "https://www.propertybulbul.com",
      logo: {
        "@type": "ImageObject",
        url: "https://www.propertybulbul.com/propertybulbul.png",
      },
    },
    breadcrumb: {
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
          name: "Journal",
          item: "https://www.propertybulbul.com/journal",
        },
      ],
    },
  };

  return (
    <script
      id="journal-jsonld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

export default function JournalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <JournalStructuredData />
      {children}
    </>
  );
}

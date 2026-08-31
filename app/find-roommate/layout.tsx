import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Find a Flatmate or Roommate in Tricity | Rooms & Flat-Shares - PropertyBulbul",
  description:
    "Looking for a flatmate or need a room on rent? Browse verified roommate listings and flat-share options across Chandigarh, Mohali, Panchkula and Zirakpur. Find compatible flatmates by profession, budget, diet and lifestyle with PropertyBulbul.",
  openGraph: {
    title:
      "Find a Flatmate or Roommate in Tricity | Rooms & Flat-Shares - PropertyBulbul",
    description:
      "Browse verified roommate listings and flat-share rooms across Tricity. Match by profession, budget, diet and lifestyle preferences with PropertyBulbul.",
    url: "https://www.propertybulbul.com/find-roommate",
    siteName: "PropertyBulbul",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "https://www.propertybulbul.com/property-tricity.jpg",
        width: 1200,
        height: 630,
        alt: "PropertyBulbul - Find a Flatmate or Roommate in Tricity",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Find a Flatmate or Roommate in Tricity - PropertyBulbul",
    description:
      "Verified roommate and flat-share listings across Chandigarh, Mohali, Panchkula & Zirakpur. Match by budget, profession and lifestyle.",
    images: ["https://www.propertybulbul.com/property-tricity.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://www.propertybulbul.com/find-roommate",
  },
};

// Find Roommate Page Structured Data Component
function FindRoommateStructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Find a Flatmate or Roommate in Tricity - PropertyBulbul",
    description:
      "Browse verified roommate listings and flat-share options across Chandigarh, Mohali, Panchkula and Zirakpur. Find compatible flatmates by profession, budget, diet and lifestyle.",
    url: "https://www.propertybulbul.com/find-roommate",
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
          name: "Find Roommate",
          item: "https://www.propertybulbul.com/find-roommate",
        },
      ],
    },
  };

  return (
    <script
      id="find-roommate-jsonld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

export default function FindRoommateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <FindRoommateStructuredData />
      {children}
    </>
  );
}

import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "About PropertyBulbul - Tricity's Most Helpful Real Estate Partner in Chandigarh",
  description:
    "Know the story behind PropertyBulbul, Tricity's most trusted real estate partner. Established with a mission to simplify property buying, selling, and investment in Chandigarh, Panchkula, Mohali. Meet our expert team and discover why thousands trust us for their property needs.",
  keywords: [
    "about propertybulbul",
    "real estate company chandigarh",
    "propertybulbul team",
    "tricity real estate",
    "chandigarh property consultants",
    "real estate experts panchkula",
    "property brokers mohali",
    "propertybulbul mission",
    "real estate company profile",
    "chandigarh property services",
    "trusted real estate chandigarh",
    "propertybulbul history",
    "real estate team tricity",
    "property consultants chandigarh panchkula mohali",
    "about real estate company",
    "propertybulbul company profile",
  ],
  openGraph: {
    title: "About PropertyBulbul - Tricity's Most Helpful Real Estate Partner",
    description:
      "Know the story behind PropertyBulbul, Tricity's most trusted real estate partner. Meet our expert team serving Chandigarh, Panchkula, and Mohali.",
    url: "https://www.propertybulbul.com/about-us",
    siteName: "PropertyBulbul",
    type: "website",
    images: [
      {
        url: "https://www.propertybulbul.com/about-image.jpg",
        width: 1200,
        height: 630,
        alt: "About PropertyBulbul - Real Estate Experts in Tricity",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About PropertyBulbul - Tricity Real Estate Experts",
    description:
      "Discover PropertyBulbul's story and mission in Tricity. Expert real estate services in Chandigarh, Panchkula, and Mohali.",
    images: ["https://www.propertybulbul.com/about-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://www.propertybulbul.com/about-us",
  },
};

// About Page Structured Data Component
function AboutStructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "About PropertyBulbul - Tricity Real Estate Experts",
    description:
      "Learn about PropertyBulbul, Tricity's most trusted real estate partner. Meet our team of experts serving Chandigarh, Panchkula, and Mohali.",
    url: "https://www.propertybulbul.com/about-us",
    mainEntity: {
      "@type": "RealEstateAgent",
      name: "PropertyBulbul",
      description:
        "Tricity's most helpful real estate partner with expert guidance in buying, selling, and investing in properties across Chandigarh, Panchkula, and Mohali.",
      foundingDate: "2024",
      founder: {
        "@type": "Person",
        name: "Mohit Sharma",
        jobTitle: "Founder & CEO",
      },
      address: {
        "@type": "PostalAddress",
        streetAddress: "145, Sector-15",
        addressLocality: "Chandigarh",
        addressRegion: "Chandigarh",
        postalCode: "160015",
        addressCountry: "IN",
      },
      contactPoint: [
        {
          "@type": "ContactPoint",
          telephone: "+91-97299-07448",
          contactType: "customer service",
          availableLanguage: "English",
          hoursAvailable: {
            "@type": "OpeningHoursSpecification",
            opens: "09:00",
            closes: "19:00",
            dayOfWeek: [
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
            ],
          },
        },
      ],
      areaServed: [
        {
          "@type": "Place",
          name: "Chandigarh",
        },
        {
          "@type": "Place",
          name: "Mohali",
        },
        {
          "@type": "Place",
          name: "Panchkula",
        },
        {
          "@type": "Place",
          name: "Zirakpur",
        },
      ],
      knowsAbout: [
        "Real Estate in Tricity",
        "Property Buying Chandigarh",
        "Property Selling Mohali",
        "Investment Properties Panchkula",
        "Legal Assistance Real Estate",
        "Student Accommodation",
        "Commercial Properties",
      ],
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Real Estate Services",
        itemListElement: [
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Property Buying Services",
              description:
                "Expert assistance in buying residential and commercial properties.",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Property Selling Services",
              description:
                "Premium marketing and sales support for property sellers.",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Investment Consulting",
              description:
                "Market analysis and guidance for property investments.",
            },
          },
        ],
      },
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.8",
        bestRating: "5",
        ratingCount: "500",
      },
      priceRange: "$$",
      sameAs: [
        "https://www.facebook.com/propertybulbul",
        "https://www.instagram.com/propertybulbul",
      ],
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

export default function AboutUsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AboutStructuredData />
      {children}
    </>
  );
}

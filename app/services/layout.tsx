import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Real Estate Services - PropertyBulbul | Property Buying, Selling & Investment in Tricity",
  description:
    "Leading real estate services in Tricity (Chandigarh, Panchkula, Mohali). Expert property buying, selling, investment consulting, legal assistance, and student accommodation. Get personalized real estate solutions from PropertyBulbul today!",
  keywords: [
    "real estate services",
    "property services in chandigarh",
    "propertybulbul services",
    "buy property chandigarh",
    "sell property tricity",
    "property investment panchkula",
    "real estate consultation mohali",
    "legal assistance real estate",
    "student accommodation chandigarh",
    "property buying services",
    "property selling agents",
    "real estate investment consultants",
    "commercial property services",
    "residential property chandigarh",
    "apartment hunting mohali",
    "home selling service panchkula",
    "real estate advisors tricity",
    "property transaction assistance",
    "student housing zirakpur",
  ],
  openGraph: {
    title:
      "Real Estate Services - PropertyBulbul | Property Buying & Selling in Tricity",
    description:
      "Expert real estate services in Tricity. Property buying, selling, investment, legal assistance, student accommodation. Personalized solutions from PropertyBulbul.",
    url: "https://propertybulbul.com/services",
    siteName: "Propertybulbul",
    type: "website",
    images: [
      {
        url: "https://propertybulbul.com/og-services.jpg",
        width: 1200,
        height: 630,
        alt: "Our Real Estate Services",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Real Estate Services - PropertyBulbul | Tricity Property Experts",
    description:
      "Comprehensive real estate services in Tricity. Expert property buying, selling, investment consulting, legal assistance & student accommodation.",
    images: ["https://propertybulbul.com/twitter-services.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://propertybulbul.com/services",
  },
};

// Services Page Structured Data Component
function ServicesStructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ServicePage",
    name: "Real Estate Services - PropertyBulbul Tricity",
    description:
      "Comprehensive real estate services in Tricity including property buying, selling, investment, legal assistance, and student accommodation.",
    url: "https://propertybulbul.com/services",
    mainEntity: {
      "@type": "RealEstateAgent",
      name: "PropertyBulbul",
      description:
        "Leading real estate services provider in Tricity (Chandigarh, Panchkula, Mohali, Zirakpur)",
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
        {
          "@type": "ContactPoint",
          email: "bulbulproperty@gmail.com",
          contactType: "customer service",
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
        {
          "@type": "Place",
          name: "Kharar",
        },
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
                "Expert guidance for buying residential and commercial properties in Tricity with verified listings.",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Property Selling Services",
              description:
                "Premium marketing and sales support for selling properties with maximum value realization.",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Property Investment Consulting",
              description:
                "Market expertise and analysis for high-return property investments in Tricity area.",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Legal Assistance",
              description:
                "Complete legal support for property transactions, documentation, and compliance.",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Student Accommodation",
              description:
                "Verified PGs, rooms, and flats for students near educational institutions in Chandigarh.",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Consultation & Advisory",
              description:
                "Personalized real estate consultation and market trend analysis for informed decisions.",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Project Marketing",
              description:
                "Comprehensive marketing solutions for real estate developers and project marketers.",
            },
          },
        ],
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

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ServicesStructuredData />
      {children}
    </>
  );
}

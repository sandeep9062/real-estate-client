import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Contact Us - PropertyBulbul | Tricity Real Estate Experts in Chandigarh, Panchkula & Mohali",
  description:
    "Get in touch with PropertyBulbul, your trusted real estate partner in Tricity (Chandigarh, Panchkula, Mohali). Contact us for property buying, selling, or renting. Experienced agents ready to help with your real estate needs. Call +91 97299 07448 now!",
  keywords: [
    "contact real estate",
    "contact propertybulbul",
    "real estate support",
    "property inquiries",
    "buy property",
    "sell property",
    "rent property",
    "chandigarh real estate contact",
    "panchkula property contact",
    "mohali real estate agents",
    "tricity property experts",
    "contact property consultants",
    "real estate chandigarh",
    "property chandigarh",
    "homes for sale chandigarh",
    "apartments panchkula",
    "commercial property mohali",
  ],
  openGraph: {
    title: "Contact Us - PropertyBulbul | Tricity Real Estate Experts",
    description:
      "Get in touch with PropertyBulbul, your trusted real estate partner in Tricity. Contact us for property buying, selling, or renting assistance.",
    url: "https://www.propertybulbul.com/contact",
    siteName: "PropertyBulbul",
    type: "website",
    images: [
      {
        url: "https://www.propertybulbul.com/contact-image.png",
        width: 1200,
        height: 630,
        alt: "Contact Our Real Estate Team",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Us - PropertyBulbul | Tricity Real Estate Experts",
    description:
      "Get in touch with PropertyBulbul for all your real estate needs in Tricity. Expert assistance for buying, selling, and renting properties.",
    images: ["https://www.propertybulbul.com/contact-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://www.propertybulbul.com/contact",
  },
};

// Structured Data Component
function ContactStructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contact PropertyBulbul - Tricity Real Estate Experts",
    description:
      "Get in touch with PropertyBulbul, your trusted real estate partner in Tricity for property buying, selling, and renting services.",
    url: "https://www.propertybulbul.com/contact",
    mainEntity: {
      "@type": "RealEstateAgent",
      name: "PropertyBulbul",
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
      ],
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

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ContactStructuredData />
      {children}
    </>
  );
}

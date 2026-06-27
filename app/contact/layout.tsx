import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Contact Us - PropertyBulbul | Tricity Real Estate Experts in Chandigarh, Panchkula & Mohali",
  description:
    "Connect with PropertyBulbul — your Tricity property intelligence platform serving Chandigarh, Mohali, Panchkula, Zirakpur, Kharar, and New Chandigarh. Get personalized guidance, verified listings, and local market insights for smarter real estate decisions. Call +91 97299 07448.",
  openGraph: {
    title: "Contact Us - PropertyBulbul | Tricity Property Intelligence Platform",
    description:
      "Connect with PropertyBulbul for trusted property insights across Chandigarh, Mohali, Panchkula, Zirakpur, Kharar, and New Chandigarh. Get personalized guidance, verified listings, and expert local market knowledge.",
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
    title: "Contact Us - PropertyBulbul | Tricity Property Intelligence Platform",
    description:
      "Connect with PropertyBulbul for trusted property insights across Tricity. Get personalized guidance, verified listings, and expert local market knowledge for smarter real estate decisions.",
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
    name: "Contact PropertyBulbul - Tricity Property Intelligence Platform",
    description:
      "Connect with PropertyBulbul for trusted property insights across Chandigarh, Mohali, Panchkula, Zirakpur, Kharar, and New Chandigarh. Get personalized guidance, verified listings, and expert local market knowledge.",
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

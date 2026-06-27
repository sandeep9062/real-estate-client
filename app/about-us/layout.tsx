import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "About PropertyBulbul - Tricity's Property Intelligence Platform",
  description:
    "PropertyBulbul is a technology-driven property intelligence platform serving Chandigarh, Mohali, Panchkula, Zirakpur, Kharar & New Chandigarh. We combine hyperlocal data, verified listings, and smart tools to help buyers, sellers, investors & NRIs make confident property decisions.",
  openGraph: {
    title: "About PropertyBulbul - Tricity's Property Intelligence Platform",
    description:
      "Discover how PropertyBulbul is transforming property decisions in Tricity with data, transparency, and hyperlocal intelligence — not brokerage.",
    url: "https://www.propertybulbul.com/about-us",
    siteName: "PropertyBulbul",
    type: "website",
    images: [
      {
        url: "https://www.propertybulbul.com/about-image.jpg",
        width: 1200,
        height: 630,
        alt: "About PropertyBulbul - Property Intelligence Platform for Tricity",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About PropertyBulbul - Tricity Property Intelligence Platform",
    description:
      "PropertyBulbul combines hyperlocal expertise, verified data, and technology to help you make smarter property decisions across Tricity.",
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

function AboutStructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "About PropertyBulbul - Property Intelligence Platform",
    description:
      "Learn about PropertyBulbul, Tricity's property intelligence platform. Technology-driven property decisions for Chandigarh, Mohali, Panchkula, and more.",
    url: "https://www.propertybulbul.com/about-us",
    mainEntity: {
      "@type": "SoftwareApplication",
      name: "PropertyBulbul",
      applicationCategory: "RealEstateApplication",
      operatingSystem: "Web",
      description:
        "Tricity's Property Intelligence Platform — combining hyperlocal data, verified listings, and smart tools to help buyers, sellers, investors, and NRIs make transparent and confident property decisions in Chandigarh, Mohali, Panchkula, Zirakpur, Kharar, and New Chandigarh.",
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
            dayOfWeek: ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
          },
        },
      ],
      areaServed: [
        { "@type": "Place", name: "Chandigarh" },
        { "@type": "Place", name: "Mohali" },
        { "@type": "Place", name: "Panchkula" },
        { "@type": "Place", name: "Zirakpur" },
        { "@type": "Place", name: "Kharar" },
        { "@type": "Place", name: "New Chandigarh" },
      ],
      knowsAbout: [
        "Property Intelligence Tricity",
        "Real Estate Data Chandigarh",
        "Verified Property Listings Mohali",
        "Property Market Insights Panchkula",
        "Hyperlocal Property Analytics",
        "NRI Property Investment Tricity",
        "Property Price Trends Chandigarh Tricity",
      ],
      offers: {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Property Intelligence Platform",
          description: "Data-driven property discovery, market intelligence, and verified listings platform for Tricity.",
        },
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

export default function AboutUsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AboutStructuredData />
      {children}
    </>
  );
}

import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Other Services - PropertyBulbul | Contractors, Architects, Interior Designers & More",
  description:
    "Find verified contractors, architects, interior designers, vastu consultants, structural consultants, furniture providers, loan agents, legal consultants and documentation services for your property. Connect with trusted home service professionals across Tricity and India with PropertyBulbul.",
  openGraph: {
    title:
      "Other Services - PropertyBulbul | Trusted Home & Property Professionals",
    description:
      "Hire verified contractors, architects, interior designers, loan agents, legal consultants and more for your property — all in one place with PropertyBulbul.",
    url: "https://www.propertybulbul.com/other-services",
    siteName: "PropertyBulbul",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "https://www.propertybulbul.com/property-tricity.jpg",
        width: 1200,
        height: 630,
        alt: "PropertyBulbul Other Services - Trusted Property Professionals",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Other Services - PropertyBulbul | Trusted Property Professionals",
    description:
      "Verified contractors, architects, interior designers, loan agents, legal consultants & documentation services for your property.",
    images: ["https://www.propertybulbul.com/property-tricity.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://www.propertybulbul.com/other-services",
  },
};

// Other Services Page Structured Data Component
function OtherServicesStructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ServicePage",
    name: "Other Services - PropertyBulbul",
    description:
      "Find verified contractors, architects, interior designers, vastu consultants, structural consultants, furniture providers, loan agents, legal consultants and documentation services for your property with PropertyBulbul.",
    url: "https://www.propertybulbul.com/other-services",
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
          name: "Other Services",
          item: "https://www.propertybulbul.com/other-services",
        },
      ],
    },
  };

  return (
    <script
      id="other-services-jsonld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

export default function OtherServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <OtherServicesStructuredData />
      {children}
    </>
  );
}

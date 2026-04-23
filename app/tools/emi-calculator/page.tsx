import { Metadata } from "next";
import Script from "next/script";
import EMICalculatorClient from "./EMICalculatorClient";

export const metadata: Metadata = {
  title: "Home Loan EMI Calculator | PropertyBulbul",
  description:
    "Calculate your home loan EMI instantly. Free mortgage calculator for properties in Chandigarh, Mohali, Panchkula & Tricity. Plan your property investment with accurate EMI, interest & tenure breakdowns.",
  keywords: [
    "home loan emi calculator",
    "mortgage calculator india",
    "property emi calculator",
    "home loan calculator tricity",
    "emi calculator chandigarh",
    "emi calculator mohali",
    "emi calculator panchkula",
    "home loan interest calculator",
    "property investment calculator",
    "mortgage repayment calculator",
    "housing loan emi",
    "real estate emi",
    "propertybulbul emi",
    "buy property emi",
    "calculate home loan",
  ],
  alternates: {
    canonical: "https://propertybulbul.com/tools/emi-calculator",
  },
  openGraph: {
    title: "Free Home Loan EMI Calculator | PropertyBulbul",
    description:
      "Calculate your property EMI instantly. Plan your dream home in Tricity with our free mortgage calculator.",
    url: "https://propertybulbul.com/tools/emi-calculator",
    type: "website",
    images: [
      {
        url: "https://propertybulbul.com/property-tricity.jpg",
        width: 1200,
        height: 630,
        alt: "PropertyBulbul Home Loan EMI Calculator",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Home Loan EMI Calculator | PropertyBulbul",
    description:
      "Calculate your property EMI instantly. Plan your dream home in Tricity.",
    images: ["https://propertybulbul.com/property-tricity.jpg"],
  },
};

export default function EMICalculatorPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  return (
    <>
      {/* Structured Data for Tool Page */}
      <Script
        id="emi-calculator-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "PropertyBulbul Home Loan EMI Calculator",
            description:
              "Free home loan EMI calculator for properties in Chandigarh, Mohali, Panchkula and Tricity region.",
            url: "https://propertybulbul.com/tools/emi-calculator",
            applicationCategory: "FinanceApplication",
            operatingSystem: "Any",
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "INR",
            },
            publisher: {
              "@type": "Organization",
              name: "PropertyBulbul",
              url: "https://propertybulbul.com",
            },
          }),
        }}
      />
      <EMICalculatorClient searchParams={searchParams} />
    </>
  );
}

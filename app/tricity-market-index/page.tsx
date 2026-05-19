// app/tricity-market-index/page.tsx
// Server component — handles SSG metadata + JSON-LD
// Client UI is in TricityMarketIndexPage.tsx

import { Metadata } from "next";
import { getMarketIndexServer } from "@/services/marketIndexApi";
import TricityMarketIndexPage from "./TricityMarketIndexPage";

// ─── SEO Metadata (dynamic, ISR-powered) ──────────────────────────────────────

export async function generateMetadata(): Promise<Metadata> {
  const report = await getMarketIndexServer();

  const quarter = report?.quarter ?? "Latest";
  const totalListings = report?.totalListings ?? 0;

  const title = `Tricity Market Index ${quarter} — Rent & Property Prices | PropertyBulbul`;
  const description =
    `Sector-wise rental prices, property sale prices, and investment yield ` +
    `across Chandigarh, Mohali, Panchkula, Zirakpur, New Chandigarh and Kharar. ` +
    `Based on ${totalListings.toLocaleString("en-IN")} active listings.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: "https://www.propertybulbul.com/tricity-market-index",
      images: [
        {
          url: "https://www.propertybulbul.com/og/market-index",
          width: 1200,
          height: 630,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["https://www.propertybulbul.com/og/market-index"],
    },
    alternates: {
      canonical: "https://www.propertybulbul.com/tricity-market-index",
    },
  };
}

// ─── JSON-LD structured data ──────────────────────────────────────────────────

function JsonLd({
  quarter,
  totalListings,
}: {
  quarter: string;
  totalListings: number;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: `PropertyBulbul Tricity Market Index ${quarter}`,
    description: `Rental and property sale price data for Tricity. ${totalListings} listings analysed.`,
    url: "https://www.propertybulbul.com/tricity-market-index",
    creator: {
      "@type": "Organization",
      name: "PropertyBulbul",
      url: "https://www.propertybulbul.com",
    },
    temporalCoverage: quarter,
    spatialCoverage:
      "Tricity — Chandigarh, Mohali, Panchkula, Zirakpur, New Chandigarh, Kharar",
    keywords:
      "Tricity rent, Mohali property price, Chandigarh real estate, Zirakpur rental, investment yield",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function Page() {
  const report = await getMarketIndexServer();

  return (
    <>
      <JsonLd
        quarter={report?.quarter ?? ""}
        totalListings={report?.totalListings ?? 0}
      />
      {/*
        TricityMarketIndexPage uses useGetMarketIndexQuery internally.
        The server fetch above is only for metadata + JSON-LD.
        RTK Query handles all client-side data fetching and caching.
      */}
      <TricityMarketIndexPage />
    </>
  );
}

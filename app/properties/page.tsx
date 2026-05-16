// app/properties/page.tsx
// ─────────────────────────────────────────────────────────────────────────────
// SERVER COMPONENT — intentionally no "use client".
//
// Why this matters for SEO:
//   Before: page.tsx was "use client" → Google crawled a blank page.
//   Now:    Next.js renders real HTML on the server → Google indexes
//           actual property listings, headings, prices, and cities.
// ─────────────────────────────────────────────────────────────────────────────

import { Suspense } from "react";
import type { Metadata } from "next";
import PropertiesClient from "@/components/PropertiesClient";
import PropertiesLoadingSkeleton from "@/components/PropertiesLoadingSkeleton";

// ── Types ────────────────────────────────────────────────────────────────────

interface PageProps {
  searchParams: Record<string, string | string[] | undefined>;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Flatten Next.js searchParams (which can be string | string[]) to a plain
 *  Record<string, string> — safe to pass to URLSearchParams and child components. */
function flattenParams(
  raw: Record<string, string | string[] | undefined>,
): Record<string, string> {
  const out: Record<string, string> = {};
  Object.entries(raw).forEach(([k, v]) => {
    if (Array.isArray(v)) {
      if (v[0]) out[k] = v[0];
    } else if (v != null && v !== "") {
      out[k] = v;
    }
  });
  return out;
}

// ── Server-side data fetch ───────────────────────────────────────────────────
// Runs on the server before any HTML is sent. Google gets real listings.

interface FetchResult {
  properties: Property[];
  total: number;
}

// Minimal shape — extend to match your actual API response
interface Property {
  id: string;
  [key: string]: unknown;
}

async function fetchInitialProperties(
  query: Record<string, string>,
): Promise<FetchResult> {
  const qs = new URLSearchParams({ ...query, limit: "12" });

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/properties?${qs.toString()}`,
      {
        // ISR: re-validate every 60 s. Change to `cache: "no-store"` if you
        // need always-live results (e.g. flash sales, real-time availability).
        next: { revalidate: 60 },
      },
    );

    if (!res.ok) {
      console.error(`[properties] API responded ${res.status}`);
      return { properties: [], total: 0 };
    }

    const data = await res.json();
    return {
      // Handle common API shapes: { properties }, { results }, { data }
      properties: data.properties ?? data.results ?? data.data ?? [],
      total: data.total ?? data.count ?? 0,
    };
  } catch (err) {
    // Fail silently on the server — the client component will re-fetch
    console.error("[properties] fetch error:", err);
    return { properties: [], total: 0 };
  }
}

// ── Page (Server Component) ──────────────────────────────────────────────────

export default async function PropertiesPage({ searchParams }: PageProps) {
  const query = flattenParams(searchParams);
  const { properties, total } = await fetchInitialProperties(query);

  return (
    // Suspense lets the server stream the shell instantly while the client
    // component finishes hydration
    <Suspense fallback={<PropertiesLoadingSkeleton />}>
      <PropertiesClient
        initialProperties={properties}
        initialTotal={total}
        initialQuery={query}
      />
    </Suspense>
  );
}

// ── Dynamic metadata ─────────────────────────────────────────────────────────
// Runs on the server per-request. Title reflects active filters so that
// Google indexes "2BHK Flats in Mohali | PropertyBulbul" style pages.

export async function generateMetadata({
  searchParams,
}: PageProps): Promise<Metadata> {
  const q = flattenParams(searchParams);
  const city = q.city ?? null;
  const type = q.type ?? null;
  const purpose = q.purpose === "rent" ? "for Rent" : "for Sale";

  // Build a descriptive, filter-aware title
  let titleBase = "Properties for Sale & Rent in Tricity";
  if (city && type) titleBase = `${type} ${purpose} in ${city}`;
  else if (city) titleBase = `Properties ${purpose} in ${city}`;
  else if (type) titleBase = `${type} for Sale & Rent in Tricity`;

  const title = `${titleBase} | PropertyBulbul`;

  const description =
    city || type
      ? `Find verified ${type ?? "properties"} ${purpose} in ${city ?? "Tricity"}. Direct WhatsApp connect, no spam. Browse on PropertyBulbul.`
      : "Discover premium verified properties for sale and rent across Chandigarh, Mohali, Panchkula, Zirakpur & Kharar. Direct WhatsApp connect, no spam.";

  return {
    title,
    description,
    keywords: [
      "buy property in Chandigarh",
      "flats for sale in Mohali",
      "house for rent in Panchkula",
      "ready to move flats in Zirakpur",
      "commercial SCO for sale in Tricity",
      "luxury apartments Mohali",
      "independent floors in Panchkula",
      "verified property dealers Chandigarh",
      ...(city ? [`property in ${city}`, `${city} real estate`] : []),
      ...(type ? [type.toLowerCase()] : []),
    ],
    alternates: {
      canonical: "https://www.propertybulbul.com/properties",
    },
    openGraph: {
      title,
      description,
      url: "https://www.propertybulbul.com/properties",
      type: "website",
      siteName: "PropertyBulbul",
      locale: "en_IN",
      images: [
        {
          url: "https://www.propertybulbul.com/property-tricity.jpg",
          width: 1200,
          height: 630,
          alt: "Find Your Dream Home in Tricity — PropertyBulbul",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["https://www.propertybulbul.com/property-tricity.jpg"],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

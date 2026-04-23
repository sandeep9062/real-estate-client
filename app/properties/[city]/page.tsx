import type { Metadata } from "next";
import React, { Suspense } from "react";
import CityPropertiesContent from "./CityPropertiesContent";

const cityMap: Record<string, string> = {
  chandigarh: "Chandigarh",
  mohali: "Mohali",
  panchkula: "Panchkula",
  kharar: "Kharar",
  zirakpur: "Zirakpur",
};

export async function generateStaticParams() {
  return Object.keys(cityMap).map((city) => ({
    city,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string }>;
}): Promise<Metadata> {
  const { city: urlCity } = await params;
  const city = cityMap[urlCity] || "Tricity";

  const title = `Property in ${city} | Buy & Rent Real Estate`;
  const description = `Buy, sell & rent properties in ${city}. Flats, houses, shops & plots on PropertyBulbul.`;
  const canonicalUrl = `https://propertybulbul.com/properties/${urlCity}`;

  return {
    title,
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: `Property in ${city} - PropertyBulbul`,
      description: `Find verified properties in ${city}.`,
      url: canonicalUrl,
      locale: "en_IN",
      type: "website",
    },
  };
}

const CityProperties = async ({
  params,
}: {
  params: Promise<{ city: string }>;
}) => {
  const { city } = await params;
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CityPropertiesContent city={city} />
    </Suspense>
  );
};

export default CityProperties;

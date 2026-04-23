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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string }>;
}): Promise<Metadata> {
  const { city: urlCity } = await params;
  const city = cityMap[urlCity] || "Tricity";

  return {
    title: `Property in ${city} | Buy & Rent Real Estate`,
    description: `Buy, sell & rent properties in ${city}. Flats, houses, shops & plots on PropertyBulbul.`,
    openGraph: {
      title: `Property in ${city} - PropertyBulbul`,
      description: `Find verified properties in ${city}.`,
      locale: "en_IN",
      type: "website",
    },
  };
}

const CityProperties = async ({ params }: { params: Promise<{ city: string }> }) => {
  const { city } = await params;
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CityPropertiesContent city={city} />
    </Suspense>
  );
};

export default CityProperties;

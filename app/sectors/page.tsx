import type { Metadata } from "next";
import SectorDirectory from "@/components/sector-directory/SectorDirectory";
import {
  getSectorDirectoryData,
  getSectorMapData,
} from "@/components/sector-directory/sectorDirectoryData";

const CANONICAL_URL = "https://www.propertybulbul.com/sectors";

export const metadata: Metadata = {
  title:
    "Sector Directory — Browse Tricity Properties by Sector | PropertyBulbul",
  description:
    "Browse verified properties across every sector of Chandigarh, Mohali and Panchkula, and by locality in Zirakpur and Kharar.",
  openGraph: {
    title: "Sector Directory — Browse Tricity Properties by Sector",
    description:
      "Browse verified properties across every sector of Chandigarh, Mohali and Panchkula, and by locality in Zirakpur and Kharar.",
    url: CANONICAL_URL,
    siteName: "PropertyBulbul",
    type: "website",
  },
  alternates: {
    canonical: CANONICAL_URL,
  },
};

export default async function SectorsPage() {
  const cities = await getSectorDirectoryData();
  const { points, listingCounts } = await getSectorMapData(cities);
  return (
    <main>
      <SectorDirectory
        cities={cities}
        mapPoints={points}
        listingCounts={listingCounts}
      />
    </main>
  );
}

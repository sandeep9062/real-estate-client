import { Metadata } from "next";
import { notFound } from "next/navigation";
import PropertyDetails from "./PropertyDetails";
import { getPropertyServer } from "../../../services/propertiesApi";
import {
  generateRealEstateSchema,
  generateFAQSchema,
  generateBreadcrumbSchema,
  renderSchemaScript,
} from "@/lib/schemaUtils";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

function sanitizeMetaText(text: string): string {
  // Replace "0 BHK" (with optional space or no space) with "Studio/1BHK"
  return text.replace(/0\s*BHK/gi, "Studio/1BHK");
}

function getBedroomLabel(bedrooms: number | undefined): string {
  if (!bedrooms || bedrooms === 0) return "Studio/1BHK";
  return `${bedrooms} Bedroom${bedrooms > 1 ? "s" : ""}`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const data = await getPropertyServer(id);

  if (!data) {
    return {
      title: "Property Not Found | PropertyBulbul",
      description: "The property you're looking for could not be found.",
    };
  }

  const rawTitle = `${data?.title} in ${data?.location?.city} | Propertybulbul`;
  const title = sanitizeMetaText(rawTitle);

  const bedroomLabel = getBedroomLabel(data?.facilities?.bedrooms);
  const rawDescription = `${data.description} Located at ${
    data?.location?.address
  }, ${data?.location?.city}. ₹${data?.price.toLocaleString()}. ${
    bedroomLabel
  }, ${data?.facilities?.bathrooms || 0} Bathroom${
    data?.facilities?.bathrooms !== 1 ? "s" : ""
  }.`;
  const description = sanitizeMetaText(rawDescription);
  const keywords = [
    `${data?.type} for ${data?.deal} ${data?.location?.city}`,
    `${data?.propertyCategory} ${data?.location?.city}`,
    `property ${data?.location?.city}`,
    `real estate ${data?.location?.city}`,
    "buy property",
    "tricity real estate",
    "tricity property",
    "sell property",
    "rent property",
    "properties for sale in chandigarh",
    "properties for rent in mohali",
    data?.furnishing,
    data?.availability,
  ].filter(Boolean);
  const canonicalUrl = `https://www.propertybulbul.com/property/${id}`;

  // Filter out video URLs from images
  const imageUrls = (data?.image || []).filter((img: string) => {
    const lower = img.toLowerCase();
    return !(
      lower.endsWith(".mp4") ||
      lower.endsWith(".webm") ||
      lower.endsWith(".ogg")
    );
  });

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: "website",
      images:
        imageUrls.slice(0, 5)?.map((img: string) => ({
          url: img,
          alt: sanitizeMetaText(`${data?.title} - ${data?.location?.city}`),
        })) || [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: imageUrls[0] ? [imageUrls[0]] : [],
    },
  };
}

const PropertyPage = async ({ params }: Props) => {
  const { id } = await params;
  const data = await getPropertyServer(id);
  if (!data) notFound();

  // Generate all schemas for property page
  const realEstateSchema = generateRealEstateSchema(data, id);
  const faqSchema = generateFAQSchema(
    data.description,
    data?.location?.sector || data?.location?.city,
  );
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", item: "https://www.propertybulbul.com" },
    { name: "Properties", item: "https://www.propertybulbul.com/properties" },
    {
      name: data?.location?.city,
      item: `https://www.propertybulbul.com/properties?city=${data?.location?.city}`,
    },
    {
      name: sanitizeMetaText(data?.title || ""),
      item: `https://www.propertybulbul.com/property/${id}`,
    },
  ]);

  return (
    <>
      {renderSchemaScript("property-jsonld", realEstateSchema)}
      {renderSchemaScript("property-faq-jsonld", faqSchema)}
      {renderSchemaScript("property-breadcrumb-jsonld", breadcrumbSchema)}
      <PropertyDetails data={data} />
    </>
  );
};

export default PropertyPage;

import { Metadata } from "next";
import { notFound } from "next/navigation";
import PropertyStaticContent from "./PropertyStaticContent";
import {
  PropertyHeaderButtons,
  PropertySidebar,
  PropertyReviews,
  PropertyRecentlyViewed,
  PropertyViewRecorder,
  PropertyMap,
} from "./PropertyInteractions";
import {
  getPropertyBySlugServer,
  getSimilarPropertiesServer,
} from "../../../services/propertiesApi";
import {
  generateRealEstateSchema,
  generateFAQSchema,
  generateBreadcrumbSchema,
  renderSchemaScript,
} from "@/lib/schemaUtils";
import { slugify } from "@/lib/slugify";

type Props = {
  params: Promise<{
    slug: string;
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
  const { slug } = await params;
  const data = await getPropertyBySlugServer(slug);

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
  const canonicalUrl = `https://www.propertybulbul.com/property/${data.slug}`;

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
  const { slug } = await params;
  const data = await getPropertyBySlugServer(slug);
  if (!data) notFound();

  // Fetch similar properties on server for SEO internal linking
  const similarProperties = await getSimilarPropertiesServer(data._id, 8);

  const urlIdentifier = data.slug || data._id;
  const canonicalSlug = data.slug || slugify(data.title) || data._id;

  // Generate all schemas for property page
  const realEstateSchema = generateRealEstateSchema(data, canonicalSlug);
  // FAQ schema now only renders when the article body contains a visible
  // FAQ section; location-based common questions are no longer emitted.
  const faqSchema = generateFAQSchema(data.description);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", item: "https://www.propertybulbul.com" },
    { name: "Properties", item: "https://www.propertybulbul.com/properties" },
    {
      name: data?.location?.city,
      item: `https://www.propertybulbul.com/properties?city=${data?.location?.city}`,
    },
    {
      name: sanitizeMetaText(data?.title || ""),
      item: `https://www.propertybulbul.com/property/${urlIdentifier}`,
    },
  ]);

  return (
    <>
      {renderSchemaScript("property-jsonld", realEstateSchema)}
      {renderSchemaScript("property-faq-jsonld", faqSchema)}
      {renderSchemaScript("property-breadcrumb-jsonld", breadcrumbSchema)}

      {/*
        `pb-28` reserves room for the fixed mobile action bar so it can never
        cover the last section; `lg:pb-20` removes it on desktop where the
        contact panel is sticky instead.
      */}
      <div className="min-h-screen bg-slate-50 pt-20 pb-28 lg:pb-20">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <PropertyStaticContent
            data={data}
            similarProperties={similarProperties}
            headerButtons={<PropertyHeaderButtons data={data} />}
            reviews={<PropertyReviews data={data} />}
            recentlyViewed={<PropertyRecentlyViewed data={data} />}
            viewRecorder={<PropertyViewRecorder data={data} />}
            sidebar={<PropertySidebar data={data} />}
            map={<PropertyMap data={data} />}
          />
        </div>
      </div>
    </>
  );
};

export default PropertyPage;

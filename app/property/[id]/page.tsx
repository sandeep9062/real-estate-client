import { Metadata } from "next";
import Script from "next/script";
import { notFound } from "next/navigation";
import PropertyDetails from "./PropertyDetails";
import { getPropertyServer } from "../../../lib/api";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export async function generateStaticParams() {
  // Pre-render the most important property pages at build time.
  // During build, we may not have the backend available, so we
  // fall back to ISR (revalidate below) for dynamic discovery.
  return [];
}

export const revalidate = 3600; // ISR: revalidate every 1 hour

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const data = await getPropertyServer(id);

  if (!data) {
    return {
      title: "Property Not Found | Propertybulbul",
      description: "The property you're looking for could not be found.",
    };
  }

  const title = `${data?.title} in ${data?.location?.city} | Propertybulbul`;
  const description = `${data.description} Located at ${
    data?.location?.address
  }, ${data?.location?.city}. ₹${data?.price.toLocaleString()}. ${
    data?.facilities?.bedrooms
  } Bedrooms, ${data?.facilities?.bathrooms} Bathrooms.`;
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
  const canonicalUrl = `https://propertybulbul.com/property/${id}`;

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
          alt: `${data?.title} - ${data?.location?.city}`,
        })) || [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: imageUrls[0],
    },
  };
}

const PropertyPage = async ({ params }: Props) => {
  const { id } = await params;
  const data = await getPropertyServer(id);
  if (!data) notFound();

  // Structured data for individual property
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: data?.title,
    description: data?.description,
    address: {
      "@type": "PostalAddress",
      streetAddress: data?.location?.address,
      addressLocality: data?.location?.city,
      addressRegion: data?.location?.city,
      addressCountry: data?.location?.country,
    },
    price: data?.price,
    priceCurrency: "INR",
    offerType: data?.deal,
    numberOfRooms: data?.facilities?.bedrooms,
    numberOfBathrooms: data?.facilities?.bathrooms,
    floorSize: {
      "@type": "QuantitativeValue",
      value: data?.area?.value,
      unitCode: data?.area?.unit,
    },
    image: data?.image,
    url: `https://propertybulbul.com/property/${id}`,
    provider: {
      "@type": "Organization",
      name: "Propertybulbul",
      url: "https://propertybulbul.com",
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://propertybulbul.com",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Properties",
          item: "https://propertybulbul.com/properties",
        },
        {
          "@type": "ListItem",
          position: 3,
          name: data?.title,
          item: `https://propertybulbul.com/property/${id}`,
        },
      ],
    },
  };

  return (
    <>
      <Script
        id="property-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      <PropertyDetails data={data} />
    </>
  );
};

export default PropertyPage;

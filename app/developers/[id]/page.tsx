import { Metadata } from "next";
import { notFound } from "next/navigation";
import Script from "next/script";
import DeveloperDetailClient from "./DeveloperDetailClient";
import { getDeveloperByIdServer } from "@/services/developersApi";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const data = await getDeveloperByIdServer(id);

  if (!data?.developer) {
    return {
      title: "Developer Not Found | PropertyBulbul",
      description: "The developer you're looking for could not be found.",
    };
  }

  const developer = data.developer;
  const title = `${developer.name} | Verified Developer on PropertyBulbul`;
  const description =
    developer.description?.substring(0, 160) ||
    `Explore ${developer.name}'s projects and listings on PropertyBulbul. Verified developer in Tricity.`;
  const canonicalUrl = `https://www.propertybulbul.com/developers/${id}`;
  const imageUrl =
    developer.logo || "https://www.propertybulbul.com/property-tricity.jpg";

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
      type: "profile",
      images: [
        {
          url: imageUrl,
          width: 400,
          height: 400,
          alt: developer.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

export default async function DeveloperDetailPage({ params }: Props) {
  const { id } = await params;
  const data = await getDeveloperByIdServer(id);

  if (!data?.developer) {
    notFound();
  }

  const developer = data.developer;
  const canonicalUrl = `https://www.propertybulbul.com/developers/${id}`;

  // Developer / Organization structured data
  const developerSchema = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: developer.name,
    description: developer.description,
    url: canonicalUrl,
    logo: developer.logo,
    ...(developer.website && { sameAs: [developer.website] }),
    areaServed: ["Chandigarh", "Mohali", "Panchkula", "Zirakpur"],
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
          name: "Developers",
          item: "https://www.propertybulbul.com/developers",
        },
        {
          "@type": "ListItem",
          position: 3,
          name: developer.name,
          item: canonicalUrl,
        },
      ],
    },
  };

  return (
    <>
      <Script
        id="developer-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(developerSchema),
        }}
      />
      <DeveloperDetailClient id={id} />
    </>
  );
}

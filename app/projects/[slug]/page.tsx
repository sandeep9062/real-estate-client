import { Metadata } from "next";
import { notFound } from "next/navigation";
import Script from "next/script";
import ProjectDetailClient from "./ProjectDetailClient";
import { getProjectBySlugServer } from "@/services/projectsApi";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlugServer(slug);

  if (!project) {
    return {
      title: "Project Not Found | PropertyBulbul",
      description: "The project you're looking for could not be found.",
    };
  }

  const title = `${project.name} in ${project.location?.city} | PropertyBulbul Projects`;
  const description =
    project.description?.substring(0, 160) ||
    `Explore ${project.name}, a ${project.projectType} project in ${project.location?.city}. Find verified units, amenities, and pricing on PropertyBulbul.`;
  const canonicalUrl = `https://www.propertybulbul.com/projects/${slug}`;
  const imageUrl =
    project.media?.images?.[0] ||
    "https://www.propertybulbul.com/property-tricity.jpg";

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
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: project.name,
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

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const project = await getProjectBySlugServer(slug);

  if (!project) {
    notFound();
  }

  const canonicalUrl = `https://www.propertybulbul.com/projects/${slug}`;
  const imageUrl =
    project.media?.images?.[0] ||
    "https://www.propertybulbul.com/property-tricity.jpg";

  // Project / RealEstateListing structured data
  const projectSchema = {
    "@context": "https://schema.org",
    "@type": "Residence",
    name: project.name,
    description:
      project.description || `${project.name} in ${project.location?.city}`,
    url: canonicalUrl,
    image: imageUrl,
    address: {
      "@type": "PostalAddress",
      streetAddress: project.location?.address,
      addressLocality: project.location?.city,
      addressRegion: project.location?.city,
      addressCountry: project.location?.country || "IN",
    },
    ...(project.developer?.name && {
      developer: {
        "@type": "Organization",
        name: project.developer.name,
        url: project.developer.website,
      },
    }),
    amenityFeature:
      project.amenities?.map((amenity: string) => ({
        "@type": "LocationFeatureSpecification",
        name: amenity,
        value: true,
      })) || [],
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
          name: "Projects",
          item: "https://www.propertybulbul.com/projects",
        },
        {
          "@type": "ListItem",
          position: 3,
          name: project.name,
          item: canonicalUrl,
        },
      ],
    },
  };

  return (
    <>
      <Script
        id="project-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(projectSchema),
        }}
      />
      <ProjectDetailClient slug={slug} />
    </>
  );
}

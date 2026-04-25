import { Metadata } from "next";
import { notFound } from "next/navigation";
import Script from "next/script";
import JournalDetailClient from "./JournalDetailClient";
import { getJournalBySlugServer } from "@/services/journalApi";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const journal = await getJournalBySlugServer(slug);

  if (!journal) {
    return {
      title: "Article Not Found | Propertybulbul Journal",
      description: "The article you're looking for could not be found.",
    };
  }

  const title = `${journal.title} | Propertybulbul Journal`;
  const description =
    journal.content?.replace(/<[^>]*>/g, "").substring(0, 160) ||
    `Read ${journal.title} on Propertybulbul Journal - expert real estate insights for Tricity.`;
  const canonicalUrl = `https://propertybulbul.com/journal/${slug}`;
  const imageUrl =
    journal.coverImage || "https://propertybulbul.com/property-tricity.jpg";

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
      type: "article",
      publishedTime: journal.createdAt,
      authors: [journal.author || "PropertyBulbul Editorial"],
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: journal.title,
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

export default async function JournalDetailPage({ params }: Props) {
  const { slug } = await params;
  const journal = await getJournalBySlugServer(slug);

  if (!journal) {
    notFound();
  }

  const canonicalUrl = `https://propertybulbul.com/journal/${slug}`;
  const imageUrl =
    journal.coverImage || "https://propertybulbul.com/property-tricity.jpg";

  // Article structured data
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: journal.title,
    description:
      journal.content?.replace(/<[^>]*>/g, "").substring(0, 200) ||
      journal.title,
    image: imageUrl,
    datePublished: journal.createdAt,
    dateModified: journal.createdAt,
    author: {
      "@type": "Organization",
      name: journal.author || "PropertyBulbul Editorial",
      url: "https://propertybulbul.com",
    },
    publisher: {
      "@type": "Organization",
      name: "Propertybulbul",
      logo: {
        "@type": "ImageObject",
        url: "https://propertybulbul.com/propertybulbul.png",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonicalUrl,
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
          name: "Journal",
          item: "https://propertybulbul.com/journal",
        },
        {
          "@type": "ListItem",
          position: 3,
          name: journal.title,
          item: canonicalUrl,
        },
      ],
    },
  };

  return (
    <>
      <Script
        id="article-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleSchema),
        }}
      />
      <JournalDetailClient slug={slug} />
    </>
  );
}

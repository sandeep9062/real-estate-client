import { Metadata } from "next";
import { notFound } from "next/navigation";
import JournalDetailClient from "./JournalDetailClient";
import { getJournalBySlugServer } from "@/services/journalApi";
import {
  generateArticleSchema,
  generateFAQSchema,
  generateBreadcrumbSchema,
  renderSchemaScript,
} from "@/lib/schemaUtils";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

// Default fallback image constant
const DEFAULT_IMAGE = "https://www.propertybulbul.com/property-tricity.jpg";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const journal = await getJournalBySlugServer(slug);

  if (!journal) {
    return {
      title: "Article Not Found | PropertyBulbul Journal",
      description: "The article you're looking for could not be found.",
    };
  }

  const title = journal.metaTitle
    ? `${journal.metaTitle} | PropertyBulbul Journal`
    : `${journal.title} | PropertyBulbul Journal`;

  const description =
    journal.excerpt?.substring(0, 160) ||
    journal.content?.replace(/<[^>]*>/g, "").substring(0, 160) ||
    `Read ${journal.title} on PropertyBulbul Journal - expert real estate insights for Tricity.`;

  const canonicalUrl = `https://www.propertybulbul.com/journal/${slug}`;

  // Logic to handle coverImage (assuming it might be a string or array)
  const imageUrl = Array.isArray(journal.coverImage)
    ? journal.coverImage[0]
    : journal.coverImage || DEFAULT_IMAGE;

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

  const canonicalUrl = `https://www.propertybulbul.com/journal/${slug}`;

  // Generate all schemas
  const articleSchema = generateArticleSchema(journal, slug);
  const faqSchema = generateFAQSchema(journal.content, journal.location);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", item: "https://www.propertybulbul.com" },
    { name: "Journal", item: "https://www.propertybulbul.com/journal" },
    { name: journal.title, item: canonicalUrl },
  ]);

  return (
    <>
      {/* JSON-LD Schemas */}
      {renderSchemaScript("article-jsonld", articleSchema)}
      {renderSchemaScript("faq-jsonld", faqSchema)}
      {renderSchemaScript("breadcrumb-jsonld", breadcrumbSchema)}

      {/* Client Component for interactivity */}
      <JournalDetailClient slug={slug} initialData={journal} />
    </>
  );
}

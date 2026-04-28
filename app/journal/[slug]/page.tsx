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

  // Generate all schemas
  const articleSchema = generateArticleSchema(journal, slug);
  const faqSchema = generateFAQSchema(journal.content, journal.location);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", item: "https://propertybulbul.com" },
    { name: "Journal", item: "https://propertybulbul.com/journal" },
    { name: journal.title, item: canonicalUrl },
  ]);

  return (
    <>
      {renderSchemaScript("article-jsonld", articleSchema)}
      {renderSchemaScript("faq-jsonld", faqSchema)}
      {renderSchemaScript("breadcrumb-jsonld", breadcrumbSchema)}
      <JournalDetailClient slug={slug} />
    </>
  );
}

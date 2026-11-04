import { Metadata } from "next";
import { notFound } from "next/navigation";
import JournalDetailClient from "./JournalDetailClient";
import { getJournalBySlugServer } from "@/services/journalApi";
import { stripMarkdownToText } from "@/components/journal/JournalContent";
import {
  generateArticleSchema,
  generateBreadcrumbSchema,
  renderSchemaScript,
} from "@/lib/schemaUtils";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

const BRAND_SUFFIX = "PropertyBulbul Journal";

function withBrandSuffix(title: string): string {
  if (!title) return BRAND_SUFFIX;
  const trimmed = title.trim();
  if (
    trimmed.endsWith("PropertyBulbul") ||
    trimmed.endsWith("PropertyBulbul Journal") ||
    trimmed.endsWith("| PropertyBulbul Journal")
  ) {
    return trimmed;
  }
  return `${trimmed} | ${BRAND_SUFFIX}`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  const journal = await getJournalBySlugServer(slug);

  //console.log(journal, "journalaa-data");

  if (!journal) {
    return {
      title: "Article Not Found | PropertyBulbul Journal",
      description: "The article you're looking for could not be found.",
    };
  }

  const author = journal.author?.name || "PropertyBulbul Editorial";
  const title = withBrandSuffix(journal.metaTitle || journal.title);
  const description =
    journal.excerpt?.substring(0, 160) ||
    stripMarkdownToText(journal.content).substring(0, 160) ||
    `Read ${journal.title} on PropertyBulbul Journal - expert real estate insights for Tricity.`;
  const canonicalUrl = `https://www.propertybulbul.com/journal/${slug}`;
  const imageUrl =
    journal.coverImage || "https://www.propertybulbul.com/property-tricity.jpg";

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
      modifiedTime: journal.updatedAt,
      authors: [author],
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: journal.altText || journal.title,
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
  const imageUrl =
    journal.coverImage || "https://www.propertybulbul.com/property-tricity.jpg";

  // Generate all schemas (FAQ only when the article itself shows Q&A pairs)
  const articleSchema = generateArticleSchema(journal, slug);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", item: "https://www.propertybulbul.com" },
    { name: "Journal", item: "https://www.propertybulbul.com/journal" },
    { name: journal.title, item: canonicalUrl },
  ]);

  return (
    <>
      {renderSchemaScript("article-jsonld", articleSchema)}
      {renderSchemaScript("breadcrumb-jsonld", breadcrumbSchema)}
      <JournalDetailClient slug={slug} initialJournal={journal} />
    </>
  );
}

/**
 * Schema Markup (JSON-LD) Utilities for PropertyBulbul
 * Server-side only implementation with safety checks
 */

import React from "react";

// Check if we're running on server (safety check)
export const isServer = typeof window === "undefined";

/**
 * Generate RealEstateListing Schema
 */
export function generateRealEstateSchema(property: any, id: string) {
  if (!isServer) return null;

  const imageUrls = (property?.image || []).filter((img: string) => {
    const lower = img.toLowerCase();
    return !(
      lower.endsWith(".mp4") ||
      lower.endsWith(".webm") ||
      lower.endsWith(".ogg")
    );
  });

  return {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: sanitizeText(property?.title || ""),
    description: sanitizeText(property?.description || ""),
    address: {
      "@type": "PostalAddress",
      streetAddress: property?.location?.address,
      addressLocality: property?.location?.sector || property?.location?.city,
      addressRegion: property?.location?.city,
      addressCountry: "IN",
    },
    offers: {
      "@type": "Offer",
      price: property?.price,
      priceCurrency: "INR",
      availability:
        property?.availability === "Available"
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
    },
    offerType: property?.deal,
    numberOfRooms: property?.facilities?.bedrooms || 0,
    numberOfBathrooms: property?.facilities?.bathrooms || 0,
    floorSize: {
      "@type": "QuantitativeValue",
      value: property?.area?.superBuiltUpArea?.value || property?.area?.value,
      unitCode:
        (property?.area?.superBuiltUpArea?.unit || property?.area?.unit) ===
        "sqft"
          ? "FTK"
          : "MTK",
    },
    image: imageUrls,
    url: `https://propertybulbul.com/property/${id}`,
    provider: {
      "@type": "Organization",
      name: "Propertybulbul",
      url: "https://propertybulbul.com",
    },
  };
}

/**
 * Generate Article Schema for Journal/Blog posts
 */
export function generateArticleSchema(journal: any, slug: string) {
  if (!isServer) return null;

  const canonicalUrl = `https://propertybulbul.com/journal/${slug}`;
  const imageUrl =
    journal.coverImage || "https://propertybulbul.com/property-tricity.jpg";
  const authorName = journal.author?.name || "PropertyBulbul Editorial";

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: journal.title,
    description: sanitizeText(
      stripHtml(journal.content)?.substring(0, 250) || journal.title,
    ),
    image: imageUrl,
    datePublished: journal.createdAt,
    dateModified: journal.updatedAt || journal.createdAt,
    author: {
      "@type": "Organization",
      name: authorName,
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
    wordCount: journal.content?.split(/\s+/).length || 0,
  };
}

/**
 * Generate FAQPage Schema.
 *
 * Only emits output when the article markdown itself contains a visible
 * "Frequently Asked Questions" section whose question headings are paired
 * with their answers. Otherwise returns null (no invented FAQs -- emitting
 * schema for questions that are not visible on the page is an SEO risk).
 */
export function generateFAQSchema(content: string) {
  if (!isServer) return null;

  const faqs = extractFAQsFromVisibleSection(content);
  if (faqs.length === 0) return null;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

/**
 * Generate BreadcrumbList Schema
 */
export function generateBreadcrumbSchema(
  items: Array<{ name: string; item: string }>,
) {
  if (!isServer) return null;

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.item,
    })),
  };
}

/**
 * Helper: Strip HTML tags from text
 */
function stripHtml(html: string): string {
  if (!html) return "";
  return html.replace(/<[^>]*>/g, "");
}

/**
 * Helper: Sanitize text for schema
 */
function sanitizeText(text: string): string {
  if (!text) return "";
  return text
    .replace(/0\s*BHK/gi, "Studio/1BHK")
    .replace(/[\n\r\t]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Helper: Extract FAQ items only from a visible "Frequently Asked Questions"
 * markdown section. Question headings (### / #### / bold lines ending with ?)
 * are paired with the paragraph(s) that follow them. Returns [] when there
 * is no such section, so callers emit no FAQ schema.
 */
function extractFAQsFromVisibleSection(
  content: string,
): Array<{ question: string; answer: string }> {
  const faqs: Array<{ question: string; answer: string }> = [];
  if (!content) return faqs;

  const lines = content.split("\n");
  let inFaq = false;
  let currentQuestion: string | null = null;
  let currentAnswer: string[] = [];

  const flush = () => {
    if (currentQuestion) {
      const answer = currentAnswer.join(" ").trim();
      if (answer) {
        faqs.push({ question: currentQuestion, answer });
      }
    }
    currentQuestion = null;
    currentAnswer = [];
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();
    // A new top-level section ends the FAQ block.
    if (inFaq && /^#{1,2}\s+/.test(line)) break;
    if (!inFaq) {
      if (/^#{2,3}\s+frequently asked questions\s*$/i.test(line)) inFaq = true;
      continue;
    }
    if (!line) continue;
    // Question: ### / #### heading, or a bold line ending with ?.
    const headingMatch = line.match(/^#{3,4}\s+(.*)$/);
    const boldMatch = line.match(/^\*\*(.+)\*\*$/);
    const candidate = headingMatch
      ? headingMatch[1].trim()
      : boldMatch
        ? boldMatch[1].trim()
        : null;
    if (candidate && candidate.endsWith("?")) {
      flush();
      currentQuestion = stripHtml(candidate);
      continue;
    }
    if (currentQuestion) {
      if (/^#{3,4}\s+/.test(line)) {
        // Non-question sub-heading ends the current pair.
        flush();
        continue;
      }
      currentAnswer.push(stripHtml(line));
    }
  }
  flush();

  return faqs;
}

/**
 * Render Schema Script Tag safely
 */
export function renderSchemaScript(id: string, schema: unknown) {
  if (!schema || !isServer) return null;

  return (
    <script
      id={id}
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema).split("<").join("\\u003c"),
      }}
    />
  );
}

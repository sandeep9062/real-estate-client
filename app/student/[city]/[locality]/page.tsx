import ReactMarkdown from "react-markdown";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string; locality: string }>;
}): Promise<Metadata> {
  const { city, locality } = await params;
  return {
    title: `Rent Guide for Students in ${locality}, ${city}`,
    description: `Student-friendly rental guide for ${locality}, ${city}. Rent, safety, colleges & transport.`,
  };
}

export default async function LocalityGuidePage({
  params,
}: {
  params: Promise<{ city: string; locality: string }>;
}) {
  const { city, locality } = await params;
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/ai/locality-guide`,
    {
      method: "POST",
      body: JSON.stringify({ city, locality }),
      headers: { "Content-Type": "application/json" },
      next: { revalidate: 86400 }, // 🔥 Discover freshness
    },
  );

  const { content } = await res.json();

  return (
    <article className="max-w-4xl pt-20 mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">
        Student Rental Guide – {locality}, {city}
      </h1>

      <div className="prose prose-lg">
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    </article>
  );
}

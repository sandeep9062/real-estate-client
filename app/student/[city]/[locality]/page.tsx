import { Metadata } from "next";

export async function generateMetadata({ params }): Promise<Metadata> {
  return {
    title: `Rent Guide for Students in ${params.locality}, ${params.city}`,
    description: `Student-friendly rental guide for ${params.locality}, ${params.city}. Rent, safety, colleges & transport.`,
  };
}

export default async function LocalityGuidePage({ params }) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/ai/locality-guide`,
    {
      method: "POST",
      body: JSON.stringify(params),
      headers: { "Content-Type": "application/json" },
      next: { revalidate: 86400 }, // 🔥 Discover freshness
    }
  );

  const { content } = await res.json();

  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">
        Student Rental Guide – {params.locality}, {params.city}
      </h1>

      <div
        className="prose prose-lg"
        dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, "<br/>") }}
      />
    </article>
  );
}

import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDeveloperByIdServer } from "../../../lib/api";
import DeveloperDetailsClient from "./DeveloperDetailsClient";

export async function generateStaticParams() {
  return [];
}

export const revalidate = 3600; // ISR: revalidate every 1 hour

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const data = await getDeveloperByIdServer(id);

  if (!data || !data.developer) {
    return {
      title: "Developer Not Found | Propertybulbul",
      description: "The developer you're looking for could not be found.",
    };
  }

  const developer = data.developer;
  const title = `${developer.name} | Top Real Estate Developer in Tricity`;
  const description = `${developer.description?.slice(0, 160)}`;
  const canonicalUrl = `https://propertybulbul.com/developers/${id}`;

  return {
    title,
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: "website",
      images: developer.logo
        ? [{ url: developer.logo, alt: developer.name }]
        : [],
    },
  };
}

export default async function DeveloperProfilePage({ params }: Props) {
  const { id } = await params;
  const data = await getDeveloperByIdServer(id);

  if (!data || !data.developer) notFound();

  return (
    <DeveloperDetailsClient
      developer={data.developer}
      projects={data.projects || []}
    />
  );
}

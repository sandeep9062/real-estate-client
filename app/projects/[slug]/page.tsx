import { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getProjectBySlugServer,
  getAllPropertiesServer,
} from "../../../lib/api";
import ProjectDetailsClient from "./ProjectDetailsClient";

export async function generateStaticParams() {
  return [];
}

export const revalidate = 3600; // ISR: revalidate every 1 hour

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlugServer(slug);

  if (!project) {
    return {
      title: "Project Not Found | Propertybulbul",
      description: "The project you're looking for could not be found.",
    };
  }

  const title = `${project.name} in ${project.location?.city} | Propertybulbul`;
  const description = `${project.description?.slice(0, 160)}`;
  const canonicalUrl = `https://propertybulbul.com/projects/${slug}`;

  return {
    title,
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: "website",
      images: project.media?.images?.[0]
        ? [{ url: project.media.images[0], alt: project.name }]
        : [],
    },
  };
}

export default async function ProjectDetailsPage({ params }: Props) {
  const { slug } = await params;
  const project = await getProjectBySlugServer(slug);

  if (!project) notFound();

  const properties = await getAllPropertiesServer(
    project._id ? { projectId: project._id } : undefined,
  );

  return <ProjectDetailsClient project={project} properties={properties} />;
}

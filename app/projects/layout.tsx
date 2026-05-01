import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Projects | PropertyBulbul",
  description:
    "Discover the latest projects by PropertyBulbul. We are committed to building the future of real estate with our innovative and sustainable projects.",
  keywords: [
    "real estate projects",
    "new developments",
    "property development",
    "upcoming projects",
  ],
  openGraph: {
    title: "Our Projects | PropertyBulbul",
    description:
      "Discover the latest projects by PropertyBulbul. We are committed to building the future of real estate.",
    url: "https://www.propertybulbul.com/projects",
    type: "website",
    images: [
      {
        url: "https://www.propertybulbul.com/property-tricity.jpg",
        width: 1200,
        height: 630,
        alt: "Our Real Estate Projects",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Our Projects | PropertyBulbul",
    description:
      "Discover the latest projects by PropertyBulbul. We are committed to building the future of real estate.",
    images: ["https://www.propertybulbul.com/property-tricity.jpg"],
  },
  alternates: {
    canonical: "https://www.propertybulbul.com/projects",
  },
};

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

import type { ReactNode } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

const SITE_URL = "https://www.propertybulbul.com";

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    {
      "@type": "ListItem",
      position: 2,
      name: "Sector Directory",
      item: `${SITE_URL}/sectors`,
    },
  ],
};

/**
 * Shared shell for /sectors and any nested sector pages.
 * Metadata stays in each page.tsx; this adds breadcrumbs + structured data.
 * Navbar offset lives here, so page.tsx's <main> needs no top padding.
 */
export default function SectorsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen overflow-x-clip bg-gray-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <nav
        aria-label="Breadcrumb"
        className="mx-auto w-full max-w-full px-4 pt-24 text-sm text-slate-500 sm:px-6 md:pt-28 lg:px-8"
      >
        <ol className="flex items-center gap-1.5">
          <li>
            <Link href="/" className="hover:text-[#4161df]">
              Home
            </Link>
          </li>
          <li aria-hidden>
            <ChevronRight className="h-3.5 w-3.5" />
          </li>
          <li aria-current="page" className="font-medium text-slate-700">
            Sector Directory
          </li>
        </ol>
      </nav>
      {children}
    </div>
  );
}

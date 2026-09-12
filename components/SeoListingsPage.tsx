/**
 * Shared server component body for the programmatic local-intent landing
 * pages (`/properties/[city]/[filter]` and
 * `/properties/[city]/[sector]/[filter]`).
 *
 * Enforces the thin-content guardrail (`MIN_LISTINGS_FOR_SEO_PAGE`) by
 * calling `notFound()` when too few real listings match.
 */
import Link from "next/link";
import { notFound } from "next/navigation";
import PropertyGrid from "./PropertyGrid";
import { renderSchemaScript } from "@/lib/schemaUtils";
import {
  MIN_LISTINGS_FOR_SEO_PAGE,
  SeoCity,
  SeoFilterSpec,
} from "@/lib/filterSlug";
import { pageH1, seoIntroParagraph } from "@/lib/seoCopy";
import { getListingsForFilter, getRelatedPages } from "@/lib/seoListings";

/* LOCAL_COLOR_SLOT
 * Hand-written 1–2 sentence local descriptions can be injected per sector
 * later, e.g. keyed by `${city}/${sectorSlug}`:
 *   { "chandigarh/sector-40": "Sector 40 sits along the V2 ring road, a few
 *     minutes from Sector 34's market." }
 * Populate this map (or swap it for a CMS field) — nothing fake is rendered
 * while it stays empty. */
const LOCAL_SECTOR_DESCRIPTIONS: Record<string, string> = {};

const isVideo = (url: string) =>
  /\.(mp4|webm|ogg)(\?|$)/i.test(String(url || ""));

const primaryImage = (p: any): string | null => {
  const first = (p?.image || []).find((u: string) => !isVideo(u));
  return first || null;
};

/** ItemList JSON-LD wrapping one Residence/Apartment entry per listing. */
export function buildItemListSchema(
  listings: any[],
  h1: string,
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: h1,
    numberOfItems: listings.length,
    itemListElement: listings.map((p: any, index: number) => {
      const city = p?.location?.city || "";
      const sector = p?.location?.sector || city;
      const category = String(p?.propertyCategory || "");
      const image = primaryImage(p);
      return {
        "@type": "ListItem",
        position: index + 1,
        url: `https://www.propertybulbul.com/property/${p?.slug}`,
        item: {
          "@type": category === "Apartment/Flat" ? "Apartment" : "Residence",
          name: p?.title || "",
          ...(image ? { image } : {}),
          ...(Number.isFinite(Number(p?.facilities?.bedrooms))
            ? { numberOfRooms: Number(p.facilities.bedrooms) }
            : {}),
          ...(Number.isFinite(Number(p?.facilities?.bathrooms))
            ? { numberOfBathroomsTotal: Number(p.facilities.bathrooms) }
            : {}),
          address: {
            "@type": "PostalAddress",
            streetAddress: p?.location?.address || sector,
            addressLocality: sector,
            addressRegion: city,
            addressCountry: "IN",
          },
          offers: {
            "@type": "Offer",
            price: p?.price ?? p?.expectedPrice ?? undefined,
            priceCurrency: "INR",
            availability:
              p?.availability === "Available"
                ? "https://schema.org/InStock"
                : "https://schema.org/OutOfStock",
          },
        },
      };
    }),
  };
}

interface SeoListingsPageProps {
  city: SeoCity;
  sectorSlug: string | null;
  spec: SeoFilterSpec;
}

export default async function SeoListingsPage({
  city,
  sectorSlug,
  spec,
}: SeoListingsPageProps) {
  /* ── Thin-content guardrail ────────────────────────────────────────── */
  const listings = await getListingsForFilter(city, sectorSlug, spec);
  if (listings.length < MIN_LISTINGS_FOR_SEO_PAGE) {
    notFound();
  }

  const h1 = pageH1(city, sectorSlug, spec);
  const intro = seoIntroParagraph(city, sectorSlug, spec, listings.length);
  const related = await getRelatedPages(city, sectorSlug, spec);

  const localColor =
    (sectorSlug && LOCAL_SECTOR_DESCRIPTIONS[`${city}/${sectorSlug}`]) ||
    (sectorSlug && LOCAL_SECTOR_DESCRIPTIONS[sectorSlug]) ||
    null;

  return (
    <div className="mx-auto w-full pt-24 max-w-7xl px-4 py-8">
      {renderSchemaScript(
        "seo-listings-itemlist",
        buildItemListSchema(listings, h1),
      )}
      <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">{h1}</h1>
      <p className="mt-3 max-w-3xl text-gray-600">{intro}</p>
      {localColor && (
        <p className="mt-2 max-w-3xl text-gray-600">{localColor}</p>
      )}

      {/* LOCAL_COLOR_SLOT — see LOCAL_SECTOR_DESCRIPTIONS above */}

      <div className="mt-6">
        <PropertyGrid properties={listings} columns="four" />
      </div>

      {related.length > 0 && (
        <section className="mt-10">
          <h2 className="text-lg font-semibold text-gray-900">
            Explore more in {sectorSlug ? "this area" : ""}
          </h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {related.map((r) => (
              <li key={r.href}>
                <Link
                  href={r.href}
                  className="inline-block rounded-full border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 transition-colors hover:border-blue-500 hover:text-blue-600"
                >
                  {r.label} <span className="text-gray-400">({r.count})</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

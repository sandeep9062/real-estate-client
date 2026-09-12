import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SeoListingsPage from "@/components/SeoListingsPage";
import { buildSeoMetadata } from "@/lib/seoCopy";
import { parseFilterSlug, normalizeCity } from "@/lib/filterSlug";

/*
 * Programmatic SEO pages: /properties/[city]/[...params]
 *   /properties/chandigarh/for-rent-2bhk              (city + filter)
 *   /properties/chandigarh/sector-40/for-rent-2bhk    (city + sector + filter)
 *
 * Why a catch-all instead of two sibling dynamic routes: Next.js requires
 * every dynamic segment at the same path level to share one slug name, so
 * `[filter]` and `[sector]` cannot coexist under `[city]`. A *required*
 * catch-all handles both depths and still leaves the existing
 * /properties/[city] page untouched (an *optional* catch-all would match
 * that path too and conflict with it).
 *
 * Plain SSR (dynamic rendering) for v1 — listings change without a rebuild.
 * If build-time generation is wanted later for performance, add:
 *   export async function generateStaticParams() {
 *     return (await getEligibleStaticParams());
 *   }
 * deriving params from `eligibleSeoCombos` (the same function the sitemap
 * uses), optionally combined with ISR (`export const revalidate = 3600`).
 */

type Props = { params: Promise<{ city: string; params: string[] }> };

/** [filter] | [sector, filter] → { sectorSlug, filterSlug }, else null. */
function decodeSegments(segments: string[]): {
  sectorSlug: string | null;
  filterSlug: string;
} | null {
  if (segments.length === 1) {
    return { sectorSlug: null, filterSlug: segments[0] };
  }
  if (segments.length === 2) {
    return { sectorSlug: segments[0], filterSlug: segments[1] };
  }
  return null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city: citySlug, params: segments } = await params;
  const decoded = decodeSegments(segments);
  if (!decoded) return {};
  const meta = buildSeoMetadata(
    citySlug,
    decoded.sectorSlug,
    decoded.filterSlug,
  );
  // Unknown patterns → let the page 404 (no metadata needed).
  return meta ?? {};
}

export default async function SeoListingsRoute({ params }: Props) {
  const { city: citySlug, params: segments } = await params;
  const decoded = decodeSegments(segments);
  if (!decoded) notFound();

  const city = normalizeCity(citySlug);
  const spec = parseFilterSlug(decoded.filterSlug);
  // Canonical-only: reject capitalized / "new-chandigarh" style variants so
  // duplicate URLs never render the same content.
  if (!city || !spec || city !== String(citySlug).toLowerCase()) {
    notFound();
  }
  return (
    <SeoListingsPage
      city={city}
      sectorSlug={decoded.sectorSlug}
      spec={spec}
    />
  );
}
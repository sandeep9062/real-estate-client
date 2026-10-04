import { FiMapPin, FiCheck, FiMaximize2 } from "react-icons/fi";
import { FaShower, FaCar } from "react-icons/fa";
import {
  MdLocationPin,
  MdMeetingRoom,
  MdBalcony,
  MdSquareFoot,
} from "react-icons/md";
import { RiServiceLine } from "react-icons/ri";
import Link from "next/link";
import PropertyCard from "@/components/PropertyCard";
import MediaGallery from "@/components/MediaGallery";
import PropertySectionNav from "./PropertySectionNav";
import {
  PropertyTrustBadges,
  ListingAvailabilityPill,
  ListingPostedByTag,
} from "@/components/PropertyTrustBadges";
import {
  formatINR,
  formatPriceWithShort,
  formatPricePerSqft,
} from "@/lib/formatPrice";
import { slugify } from "@/lib/slugify";

interface PropertyStaticContentProps {
  data: any;
  similarProperties: any[];
  headerButtons?: React.ReactNode;
  reviews?: React.ReactNode;
  recentlyViewed?: React.ReactNode;
  viewRecorder?: React.ReactNode;
  sidebar?: React.ReactNode;
  map?: React.ReactNode;
}

const AVAILABILITY_LABEL: Record<string, string> = {
  Available: "Available to enquire",
  Fresh: "Fresh listing",
  "Under offer": "Under offer — enquire quickly",
  Booked: "Booked / on hold",
};

/** Beyond this length the description is clamped and needs a "read more". */
const CLAMP_THRESHOLD = 600;
/** Amenities shown before the "show all" toggle kicks in. */
const AMENITIES_PREVIEW = 12;

/** Section heading: one style used everywhere, so hierarchy is consistent. */
function SectionTitle({
  children,
  icon,
}: {
  children: React.ReactNode;
  icon?: React.ReactNode;
}) {
  return (
    <h2 className="mb-5 flex items-center gap-2 font-heading text-xl font-bold tracking-tight text-slate-900 md:text-2xl">
      {icon}
      {children}
    </h2>
  );
}

/**
 * Breadcrumb mirroring the breadcrumbSchema emitted in page.tsx:
 * Home / Properties / City / Title. Rendered server-side as real links.
 */
function Breadcrumb({
  city,
  title,
  citySlug,
}: {
  city?: string;
  title?: string;
  citySlug: string;
}) {
  const items = [
    { label: "Home", href: "/" },
    { label: "Properties", href: "/properties" },
    ...(city ? [{ label: city, href: `/properties/${citySlug}` }] : []),
    { label: title || "Property", href: null as string | null },
  ];

  return (
    <nav aria-label="Breadcrumb" className="mb-5">
      <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-sm text-slate-500">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li
              key={`${item.label}-${i}`}
              className="flex min-w-0 items-center gap-1.5"
            >
              {item.href ? (
                <Link
                  href={item.href}
                  className="rounded-sm underline-offset-4 transition hover:text-slate-900 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4161df]"
                >
                  {item.label}
                </Link>
              ) : (
                // The current page is not a link; it is labelled for AT.
                <span
                  aria-current="page"
                  className={`truncate font-medium text-slate-700 ${
                    isLast ? "max-w-[45vw] sm:max-w-md" : ""
                  }`}
                >
                  {item.label}
                </span>
              )}
              {!isLast && (
                <span aria-hidden className="text-slate-300">
                  /
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default function PropertyStaticContent({
  data,
  similarProperties,
  headerButtons,
  reviews,
  recentlyViewed,
  viewRecorder,
  sidebar,
  map,
}: PropertyStaticContentProps) {
  const f = data?.facilities ?? {};
  const isRent = data?.deal === "Rent";
  const isSale = data?.deal === "Sale";
  const underConstruction = data?.availability === "Under Construction";
  const city = data?.location?.city as string | undefined;
  const citySlug = slugify(city || "") || "chandigarh";
  const description = (data?.description || "").trim();
  const isLongDescription = description.length > CLAMP_THRESHOLD;
  const { full: priceFull, short: priceShort } = formatPriceWithShort(
    data?.price,
  );
  const coords = data?.location?.coordinates;
  const hasCoords =
    coords &&
    Number.isFinite(Number(coords.lat)) &&
    Number.isFinite(Number(coords.lng));

  // ---- Key facts strip (only shows what exists) ----
  const stats = [
    {
      icon: MdMeetingRoom,
      value: f.bedrooms > 0 ? f.bedrooms : "Studio",
      label: f.bedrooms > 0 ? "Bedrooms" : "Layout",
      show: f.bedrooms !== undefined && f.bedrooms !== null,
    },
    {
      icon: FaShower,
      value: f.bathrooms,
      label: "Bathrooms",
      show: f.bathrooms > 0,
    },
    {
      icon: MdBalcony,
      value: f.balconies,
      label: "Balconies",
      show: f.balconies > 0,
    },
    { icon: FaCar, value: f.parkings, label: "Parking", show: f.parkings > 0 },
    {
      icon: RiServiceLine,
      value: f.servantRooms,
      label: "Servant room",
      show: f.servantRooms > 0,
    },
    {
      // Every tile in the strip carries an icon — a missing one made the
      // Area cell sit lower than its neighbours.
      icon: MdSquareFoot,
      value: data?.area?.value
        ? `${data.area.value} ${data.area.unit ?? ""}`.trim()
        : "",
      label: "Area",
      show: !!data?.area?.value,
    },
  ].filter((s) => s.show);

  // ---- Specifications: flat list, empty values dropped ----
  const money = (v: any) => (typeof v === "number" ? formatINR(v) : null);
  const specs: { label: string; value: React.ReactNode }[] = [
    { label: "Deal", value: data?.deal },
    {
      label: "Listing status",
      value:
        AVAILABILITY_LABEL[String(data?.listingAvailability || "Available")] ||
        data?.listingAvailability,
    },
    { label: "Category", value: data?.propertyCategory },
    { label: "Availability", value: data?.availability },
    { label: "Furnishing", value: data?.furnishing },
    { label: "Facing", value: data?.facing },
    {
      label: "Carpet area (RERA)",
      value: data?.area?.carpetArea?.value
        ? `${data.area.carpetArea.value} ${data.area.carpetArea.unit || data.area.unit}`
        : null,
    },
    {
      label: "Super built-up area",
      value: data?.area?.superBuiltUpArea?.value
        ? `${data.area.superBuiltUpArea.value} ${data.area.superBuiltUpArea.unit || data.area.unit}`
        : null,
    },
    {
      label: "Construction progress",
      value:
        underConstruction &&
        data?.constructionStatus?.percentageComplete != null
          ? `${data.constructionStatus.percentageComplete}%`
          : null,
    },
    {
      label: "Current phase",
      value: underConstruction ? data?.constructionStatus?.currentPhase : null,
    },
    {
      label: "Expected OC date",
      value:
        underConstruction && data?.constructionStatus?.expectedOCDate
          ? new Date(data.constructionStatus.expectedOCDate).toLocaleDateString(
              "en-IN",
              { year: "numeric", month: "long", day: "numeric" },
            )
          : null,
    },
    {
      label: "Tenant preference",
      value: isRent ? data?.tenantPreference : null,
    },
    {
      label: "Maintenance",
      value:
        isRent && money(data?.maintenanceCharge)
          ? `${money(data.maintenanceCharge)} / month`
          : null,
    },
    {
      label: "Security deposit",
      value: isRent ? money(data?.securityDeposit) : null,
    },
    {
      label: "Lock-in",
      value:
        isRent && typeof data?.lockInMonths === "number"
          ? `${data.lockInMonths} months`
          : null,
    },
    {
      label: "Notice period",
      value:
        isRent && typeof data?.noticePeriodDays === "number"
          ? `${data.noticePeriodDays} days`
          : null,
    },
    {
      label: "Subletting / sharing",
      value:
        isRent && typeof data?.allowsSubletting === "boolean"
          ? data.allowsSubletting
            ? data.maxPersonsSharing > 0
              ? `Allowed, up to ${data.maxPersonsSharing} ${data.maxPersonsSharing === 1 ? "person" : "people"}`
              : "Allowed"
            : "Not allowed"
          : null,
    },
    {
      label: "Price per sq ft",
      value: isSale ? money(data?.pricePerSqft) : null,
    },
    { label: "Occupancy certificate", value: isSale ? data?.ocStatus : null },
    {
      label: "Age of property",
      value:
        typeof data?.ageOfProperty === "number"
          ? `${data.ageOfProperty} years`
          : null,
    },
    {
      label: "Price negotiable",
      value:
        data?.negotiable !== undefined
          ? data.negotiable
            ? "Yes"
            : "No"
          : null,
    },
    { label: "Parking type", value: f.parkingType },
  ].filter((s) => s.value !== null && s.value !== undefined && s.value !== "");

  /*
   * Long spec lists get quiet subheadings so the eye can scan them; short
   * ones stay a single flat list. Labels are listed explicitly (rather than
   * matched by index) so reordering the specs above can't silently regroup
   * the wrong rows.
   */
  const GROUP_MEMBERS: { title: string; labels: string[] }[] = [
    {
      title: "Pricing",
      labels: [
        "Deal",
        "Listing status",
        "Price per sq ft",
        "Price negotiable",
        "Occupancy certificate",
      ],
    },
    {
      title: "Area",
      labels: ["Carpet area (RERA)", "Super built-up area"],
    },
    {
      title: "Construction",
      labels: [
        "Availability",
        "Construction progress",
        "Current phase",
        "Expected OC date",
        "Age of property",
      ],
    },
    {
      title: "Rental terms",
      labels: [
        "Tenant preference",
        "Maintenance",
        "Security deposit",
        "Lock-in",
        "Notice period",
        "Subletting / sharing",
      ],
    },
  ];

  const groupLabelFor = (label: string) =>
    GROUP_MEMBERS.find((g) => g.labels.includes(label))?.title ?? null;

  const specGroups = GROUP_MEMBERS.map((g) => ({
    title: g.title,
    rows: specs.filter((s) => groupLabelFor(s.label) === g.title),
  })).filter((g) => g.rows.length > 0);

  // Anything the groups don't claim still has to render — never silently drop.
  const groupedLabels = new Set(
    specGroups.flatMap((g) => g.rows.map((r) => r.label)),
  );
  const ungrouped = specs.filter((s) => !groupedLabels.has(s.label));
  const showSpecGroupHeadings = specs.length > 12;

  const amenities: string[] = [...new Set((data?.amenities ?? []) as string[])];

  const n = data?.nearbyPlaces;
  const nearby = [
    { title: "Metro / transit", items: n?.metroStations },
    { title: "Schools", items: n?.schools },
    { title: "Hospitals", items: n?.hospitals },
    { title: "Malls & shopping", items: n?.malls },
  ].filter((g) => g.items?.length);

  return (
    <>
      <Breadcrumb city={city} title={data?.title} citySlug={citySlug} />

      {/* ───────── Header ───────── */}
      <header className="mb-6 flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between lg:gap-8">
        <div className="min-w-0 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <ListingAvailabilityPill
              listingAvailability={data?.listingAvailability}
            />
            <ListingPostedByTag
              postedBy={data?.postedBy}
              userRole={data?.user?.role}
            />
            <PropertyTrustBadges property={data} />
            {data?.type && (
              <span className="rounded-full bg-[#4161df]/10 px-3 py-1 text-xs font-semibold text-[#3049b8]">
                {data.type}
              </span>
            )}
          </div>

          <h1 className="text-balance font-heading text-3xl leading-tight font-bold tracking-tight text-slate-900 md:text-4xl">
            {data?.title}
          </h1>

          <p className="flex items-start gap-1.5 text-slate-600">
            <MdLocationPin
              className="mt-0.5 shrink-0 text-[#4161df]"
              size={20}
              aria-hidden
            />
            <span className="text-base md:text-lg">
              {[data?.location?.address, city].filter(Boolean).join(", ")}
            </span>
          </p>
        </div>

        {/* Price sits under the title on mobile, on the right on desktop. */}
        <div className="flex items-end justify-between gap-4 lg:flex-col lg:items-end lg:gap-3">
          <div className="lg:text-right">
            {priceFull && (
              <p className="price text-3xl tracking-tight text-slate-900 md:text-4xl">
                {priceFull}
                {isRent && (
                  <span className="ml-1 text-base font-medium text-slate-500">
                    / month
                  </span>
                )}
              </p>
            )}
            {priceShort && (
              <p className="mt-0.5 text-sm text-slate-500">
                {priceShort}
                {isRent ? " a month" : ""}
              </p>
            )}
            {isSale && typeof data?.pricePerSqft === "number" && (
              <p className="mt-0.5 text-sm text-slate-500">
                {formatPricePerSqft(data.pricePerSqft)}
              </p>
            )}
          </div>
          {headerButtons}
        </div>
      </header>

      {/* PLACEHOLDER_GALLERY */}
      {/* ───────── Gallery ───────── */}
      <div className="mb-6 overflow-hidden rounded-2xl bg-slate-100 ring-1 ring-slate-900/5">
        <MediaGallery
          sources={data?.image as any}
          alt={data?.title}
          virtualTourUrl={data?.virtualTourUrl}
          floorPlans={data?.floorPlanImages}
          priority={true}
        />
      </div>

      <PropertySectionNav
        sections={[
          // Only anchor to a section that will actually render, otherwise a
          // tab can point at a target that does not exist in the DOM.
          ...(stats.length > 0 ? [{ id: "overview", label: "Overview" }] : []),
          ...(description ? [{ id: "about", label: "About" }] : []),
          ...(specs.length > 0 ? [{ id: "details", label: "Details" }] : []),
          ...(amenities.length > 0
            ? [{ id: "amenities", label: "Amenities" }]
            : []),
          { id: "location", label: "Location" },
          { id: "reviews", label: "Reviews" },
        ]}
      />

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-3 lg:gap-12">
        <div className="min-w-0 space-y-12 lg:col-span-2">
          {/* Key facts: one connected strip instead of many separate cards */}
          {stats.length > 0 && (
            <section
              aria-label="Key facts"
              id="overview"
              className="scroll-mt-32"
            >
              <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-slate-200 ring-1 ring-slate-900/10 sm:grid-cols-3 lg:grid-cols-6">
                {stats.map(({ icon: Icon, value, label }) => (
                  <div
                    key={label}
                    className="flex flex-col items-center gap-1 bg-white px-3 py-5 text-center"
                  >
                    {Icon && (
                      <Icon
                        className="mb-1 text-[#4161df]"
                        size={22}
                        aria-hidden
                      />
                    )}
                    <dd className="stat-number text-lg text-slate-900">
                      {value}
                    </dd>
                    <dt className="text-xs text-slate-500">{label}</dt>
                  </div>
                ))}
              </dl>
            </section>
          )}

          {/* About */}
          {description && (
            <section id="about" className="scroll-mt-32">
              <SectionTitle>About this property</SectionTitle>
              {/*
                The full description ships exactly once, in the server HTML,
                inside the <summary>. `<details>` is used purely as a CSS-only
                disclosure: closed, it is clamped to 8 lines; open, the clamp is
                dropped. No JS, nothing hidden from crawlers, no duplicate copy.
              */}
              {isLongDescription ? (
                <details className="group max-w-[70ch]">
                  <summary className="cursor-pointer list-none">
                    <span className="line-clamp-8 whitespace-pre-line text-base leading-8 text-slate-700 group-open:line-clamp-none">
                      {description}
                    </span>
                    <span className="mt-2 inline-block text-sm font-semibold text-[#3049b8] underline-offset-4 group-hover:underline group-open:hidden">
                      Read more
                    </span>
                    <span className="mt-2 hidden text-sm font-semibold text-[#3049b8] group-open:inline-block">
                      Show less
                    </span>
                  </summary>
                </details>
              ) : (
                <p className="max-w-[70ch] whitespace-pre-line text-base leading-8 text-slate-700">
                  {description}
                </p>
              )}
            </section>
          )}

          {/* Specifications */}
          {specs.length > 0 && (
            <section id="details" className="scroll-mt-32">
              <SectionTitle>Property details</SectionTitle>
              {showSpecGroupHeadings ? (
                <div className="space-y-8">
                  {[
                    ...specGroups.map((g) => ({
                      title: g.title,
                      rows: g.rows,
                    })),
                    ...(ungrouped.length
                      ? [{ title: null, rows: ungrouped }]
                      : []),
                  ].map((group) => (
                    <div key={group.title ?? "other"}>
                      {group.title && (
                        <h3 className="mb-2 text-sm font-semibold text-slate-500">
                          {group.title}
                        </h3>
                      )}
                      <dl className="grid grid-cols-1 gap-x-10 sm:grid-cols-2">
                        {group.rows.map((s) => (
                          <div
                            key={s.label}
                            className="flex items-baseline justify-between gap-4 border-b border-slate-200 py-3"
                          >
                            <dt className="text-sm text-slate-500">
                              {s.label}
                            </dt>
                            <dd className="text-right text-sm font-semibold text-slate-900">
                              {s.value}
                            </dd>
                          </div>
                        ))}
                      </dl>
                    </div>
                  ))}
                </div>
              ) : (
                <dl className="grid grid-cols-1 gap-x-10 sm:grid-cols-2">
                  {specs.map((s) => (
                    <div
                      key={s.label}
                      className="flex items-baseline justify-between gap-4 border-b border-slate-200 py-3"
                    >
                      <dt className="text-sm text-slate-500">{s.label}</dt>
                      <dd className="text-right text-sm font-semibold text-slate-900">
                        {s.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              )}

              {data?.updatedAt && (
                <p className="mt-4 text-sm text-slate-500">
                  Updated{" "}
                  {new Date(data.updatedAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              )}

              {data?.videoUrl && (
                <a
                  href={data.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-block text-sm font-semibold text-[#3049b8] underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4161df]"
                >
                  Watch the property video
                </a>
              )}
            </section>
          )}

          {/* Amenities */}
          {amenities.length > 0 && (
            <section id="amenities" className="scroll-mt-32">
              <SectionTitle>Amenities</SectionTitle>
              {/*
                CSS-only disclosure: every amenity stays in the DOM (and in the
                server HTML) — only the overflow is hidden until toggled. The
                first 12 are always visible; the rest need the toggle.
              */}
              <details
                className="group"
                open={amenities.length <= AMENITIES_PREVIEW}
              >
                <summary
                  className={
                    amenities.length > AMENITIES_PREVIEW
                      ? "cursor-pointer list-none"
                      : "hidden"
                  }
                >
                  <span className="text-sm font-semibold text-[#3049b8] underline-offset-4 group-hover:underline group-open:hidden">
                    Show all {amenities.length} amenities
                  </span>
                  <span className="hidden text-sm font-semibold text-[#3049b8] group-open:inline">
                    Show fewer amenities
                  </span>
                </summary>
                <ul className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2 md:grid-cols-3">
                  {amenities.map((a, i) => (
                    <li
                      key={`${a}-${i}`}
                      className={`flex items-center gap-2.5 text-slate-700 ${
                        i >= AMENITIES_PREVIEW ? "hidden group-open:flex" : ""
                      }`}
                    >
                      <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#4161df]/10 text-[#3049b8]">
                        <FiCheck size={12} aria-hidden />
                      </span>
                      <span className="text-sm">{a}</span>
                    </li>
                  ))}
                </ul>
              </details>
            </section>
          )}

          {/* Neighbourhood */}
          {nearby.length > 0 && (
            <section id="neighbourhood" className="scroll-mt-32">
              <SectionTitle>Neighbourhood</SectionTitle>
              <div className="grid gap-x-10 gap-y-6 sm:grid-cols-2">
                {nearby.map((g) => (
                  <div key={g.title}>
                    <h3 className="mb-2 text-sm font-semibold text-slate-900">
                      {g.title}
                    </h3>
                    <ul className="space-y-1.5 border-l-2 border-[#4161df] pl-4 text-sm text-slate-600">
                      {g.items.map((x: string, i: number) => (
                        <li key={i}>{x}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Reviews (client-loaded) */}
          <section id="reviews" className="scroll-mt-32">
            {reviews}
          </section>

          {/* Map */}
          <section id="location" className="scroll-mt-32">
            <SectionTitle icon={<FiMapPin className="text-[#4161df]" />}>
              Location
            </SectionTitle>
            {/*
              Fixed height so the client-only map never shifts the layout as
              it hydrates; the skeleton inside reserves the same box.
            */}
            <div className="h-[320px] overflow-hidden rounded-2xl bg-slate-100 ring-1 ring-slate-900/10 md:h-[400px]">
              {map}
            </div>
            {hasCoords && (
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${coords.lat},${coords.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-[#3049b8] underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4161df]"
              >
                <FiMaximize2 size={15} aria-hidden />
                Open in Google Maps
              </a>
            )}
          </section>

          {/* Similar properties (kept server-rendered for SEO internal links) */}
          {similarProperties.length > 0 && (
            <section id="similar">
              <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
                <h2 className="font-heading text-xl font-bold tracking-tight text-slate-900 md:text-2xl">
                  Similar properties
                </h2>
                {city && (
                  <Link
                    href={`/properties/${citySlug}?deal=${encodeURIComponent(data?.deal || "")}`}
                    className="shrink-0 text-sm font-semibold text-[#3049b8] underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4161df]"
                  >
                    See more in {city}
                  </Link>
                )}
              </div>
              <div className="grid grid-cols-1 items-stretch gap-5 sm:grid-cols-2">
                {similarProperties.slice(0, 4).map((p: any) => (
                  <PropertyCard key={p._id || p.id} card={p} />
                ))}
              </div>
            </section>
          )}

          {/* Recently viewed (client-loaded) */}
          {recentlyViewed}

          {/* Records the view client-side; renders nothing. */}
          {viewRecorder}
        </div>

        {sidebar}
      </div>
    </>
  );
}

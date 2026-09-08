import { FiMapPin, FiCheck } from "react-icons/fi";
import { FaShower, FaCar } from "react-icons/fa";
import { MdLocationPin, MdMeetingRoom } from "react-icons/md";
import { RiServiceLine } from "react-icons/ri";
import Link from "next/link";
import PropertyCard from "@/components/PropertyCard";
import MediaGallery from "@/components/MediaGallery";
import {
  PropertyTrustBadges,
  ListingAvailabilityPill,
} from "@/components/PropertyTrustBadges";

interface PropertyStaticContentProps {
  data: any;
  similarProperties: any[];
  headerButtons?: React.ReactNode;
  mainInteractions?: React.ReactNode;
  sidebar?: React.ReactNode;
  map?: React.ReactNode;
}

export default function PropertyStaticContent({
  data,
  similarProperties,
  headerButtons,
  mainInteractions,
  sidebar,
  map,
}: PropertyStaticContentProps) {
  const id = data?._id;
  return (
    <>
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <ListingAvailabilityPill
              listingAvailability={data?.listingAvailability}
            />
            <PropertyTrustBadges property={data} />
            <span className="bg-orange-50 text-orange-700 text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
              {data?.type}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            {data?.title}
          </h1>
          <div className="flex items-center gap-1 text-slate-500">
            <MdLocationPin className="text-[#4161df]" size={20} />
            <span className="text-lg">
              {data?.location?.address}, {data?.location?.city}
            </span>
          </div>
        </div>

        {headerButtons}
      </div>

      {/* Gallery */}
      <div className="rounded-3xl overflow-hidden shadow-2xl mb-10">
        <MediaGallery
          sources={data?.image as any}
          alt={data?.title}
          virtualTourUrl={data?.virtualTourUrl}
          floorPlans={data?.floorPlanImages}
          priority={true}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          {/* Quick Stats */}
          <section className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {data?.facilities?.bedrooms > 0 && (
              <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center">
                <MdMeetingRoom className="text-[#4161df] mb-2" size={24} />
                <span className="text-slate-900 font-bold">
                  {data?.facilities?.bedrooms}
                </span>
                <span className="text-slate-500 text-xs uppercase font-medium">
                  Bedrooms
                </span>
              </div>
            )}

            {data?.facilities?.bathrooms > 0 && (
              <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center">
                <FaShower className="text-[#4161df] mb-2" size={24} />
                <span className="text-slate-900 font-bold">
                  {data?.facilities?.bathrooms}
                </span>
                <span className="text-slate-500 text-xs uppercase font-medium">
                  Bathrooms
                </span>
              </div>
            )}

            {data?.facilities?.parkings > 0 && (
              <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center">
                <FaCar className="text-[#4161df] mb-2" size={24} />
                <span className="text-slate-900 font-bold">
                  {data?.facilities?.parkings || 0}
                </span>
                <span className="text-slate-500 text-xs uppercase font-medium">
                  Parking
                </span>
              </div>
            )}

            {data?.facilities?.servantRooms > 0 && (
              <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center">
                <RiServiceLine className="text-[#4161df] mb-2" size={24} />
                <span className="text-slate-900 font-bold">
                  {data?.facilities?.servantRooms || 0}
                </span>
                <span className="text-slate-500 text-xs uppercase font-medium">
                  Servant R.
                </span>
              </div>
            )}

            {data?.facilities?.balconies > 0 && (
              <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center">
                <MdMeetingRoom className="text-[#4161df] mb-2" size={24} />
                <span className="text-slate-900 font-bold">
                  {data?.facilities?.balconies}
                </span>
                <span className="text-slate-500 text-xs uppercase font-medium">
                  Balconies
                </span>
              </div>
            )}
          </section>
          {/* Description */}
          <section>
            <h3 className="text-2xl font-bold text-slate-900 mb-4 border-b pb-2">
              About this property
            </h3>
            <p className="text-slate-600 leading-relaxed text-lg whitespace-pre-line">
              {data?.description}
            </p>
          </section>
          {/* Details Grid */}
          <section className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 mb-6">
              Property Specifications
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-y-6 gap-x-4">
              {[
                { label: "Deal", value: data?.deal },
                {
                  label: "Listing status",
                  value:
                    (
                      {
                        Available: "Available to enquire",
                        Fresh: "Fresh listing",
                        "Under offer": "Under offer — enquire quickly",
                        Booked: "Booked / on hold",
                      } as any
                    )[String(data?.listingAvailability || "Available")] ||
                    data?.listingAvailability,
                },
                { label: "Category", value: data?.propertyCategory },
                ...(data?.area?.value
                  ? [
                      {
                        label: "Area",
                        value: `${data?.area?.value} ${data?.area?.unit}`,
                      },
                    ]
                  : []),
                ...(data?.area?.carpetArea?.value
                  ? [
                      {
                        label: "Carpet Area (RERA)",
                        value: `${data?.area?.carpetArea?.value} ${data?.area?.carpetArea?.unit || data?.area?.unit}`,
                      },
                    ]
                  : []),
                ...(data?.area?.superBuiltUpArea?.value
                  ? [
                      {
                        label: "Super Built-up Area",
                        value: `${data?.area?.superBuiltUpArea?.value} ${data?.area?.superBuiltUpArea?.unit || data?.area?.unit}`,
                      },
                    ]
                  : []),
                ...(data?.availability === "Under Construction" &&
                data?.constructionStatus?.percentageComplete != null
                  ? [
                      {
                        label: "Construction Progress",
                        value: `${data?.constructionStatus?.percentageComplete}%`,
                      },
                    ]
                  : []),
                ...(data?.availability === "Under Construction" &&
                data?.constructionStatus?.currentPhase
                  ? [
                      {
                        label: "Current Phase",
                        value: data?.constructionStatus?.currentPhase,
                      },
                    ]
                  : []),
                ...(data?.availability === "Under Construction" &&
                data?.constructionStatus?.expectedOCDate
                  ? [
                      {
                        label: "Expected OC Date",
                        value: new Date(
                          data?.constructionStatus?.expectedOCDate,
                        ).toLocaleDateString("en-IN", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }),
                      },
                    ]
                  : []),
                { label: "Availability", value: data?.availability },
                { label: "Furnishing", value: data?.furnishing },
                ...(data?.facing
                  ? [{ label: "Facing", value: data.facing }]
                  : []),
                ...(data?.deal === "Rent" && data?.tenantPreference
                  ? [
                      {
                        label: "Tenant Preference",
                        value: data.tenantPreference,
                      },
                    ]
                  : []),
                ...(data?.deal === "Rent" &&
                typeof data?.maintenanceCharge === "number"
                  ? [
                      {
                        label: "Maintenance (₹/month)",
                        value: data.maintenanceCharge,
                      },
                    ]
                  : []),
                ...(data?.deal === "Rent" &&
                typeof data?.securityDeposit === "number"
                  ? [
                      {
                        label: "Security deposit (₹)",
                        value: data.securityDeposit,
                      },
                    ]
                  : []),
                ...(data?.deal === "Rent" &&
                typeof data?.lockInMonths === "number"
                  ? [{ label: "Lock-in (months)", value: data.lockInMonths }]
                  : []),
                ...(data?.deal === "Rent" &&
                typeof data?.noticePeriodDays === "number"
                  ? [
                      {
                        label: "Notice period (days)",
                        value: data.noticePeriodDays,
                      },
                    ]
                  : []),
                ...(data?.deal === "Sale" &&
                typeof data?.pricePerSqft === "number"
                  ? [
                      {
                        label: "Price per sqft (₹)",
                        value: data.pricePerSqft,
                      },
                    ]
                  : []),
                ...(data?.deal === "Sale" && data?.ocStatus
                  ? [
                      {
                        label: "Occupancy certificate (OC)",
                        value: data.ocStatus,
                      },
                    ]
                  : []),
                ...(typeof data?.ageOfProperty === "number"
                  ? [
                      {
                        label: "Age of property (years)",
                        value: data.ageOfProperty,
                      },
                    ]
                  : []),
                ...(data?.negotiable !== undefined
                  ? [
                      {
                        label: "Price negotiable",
                        value: data.negotiable ? "Yes" : "No",
                      },
                    ]
                  : []),
                ...(Array.isArray(data?.amenities) && data.amenities.length > 0
                  ? [{ label: "Amenities", value: data.amenities.join(", ") }]
                  : []),
                ...(data?.facilities?.parkingType
                  ? [
                      {
                        label: "Parking type",
                        value: data.facilities.parkingType,
                      },
                    ]
                  : []),
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col">
                  <span className="text-slate-400 text-sm">{item.label}</span>
                  <span className="text-slate-900 font-semibold">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
            {data?.videoUrl ? (
              <p className="mt-4 text-sm">
                <span className="text-slate-400">Video — </span>
                <a
                  href={data.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#4161df] font-semibold hover:underline"
                >
                  Open link
                </a>
              </p>
            ) : null}
          </section>
          {mainInteractions}

          {/* Amenities Section */}
          {(() => {
            const amenities = data?.amenities ?? [];
            const societyAmenities = data?.societyAmenities ?? [];
            if (!amenities.length && !societyAmenities.length) return null;
            return (
              <section className="space-y-6">
                {/* Property Amenities */}
                {amenities.length > 0 && (
                  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <h3 className="text-xl font-bold text-slate-900 mb-4">
                      Property Amenities
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {amenities.map((amenity: string, i: number) => (
                        <div
                          key={`${amenity}-${i}`}
                          className="flex items-center gap-2 text-slate-700"
                        >
                          <FiCheck
                            className="text-green-500 flex-shrink-0"
                            size={16}
                          />
                          <span className="text-sm">{amenity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Society Amenities */}
                {societyAmenities.length > 0 && (
                  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <h3 className="text-xl font-bold text-slate-900 mb-4">
                      Society / Building Amenities
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {societyAmenities.map((amenity: string, i: number) => (
                        <div
                          key={`${amenity}-${i}`}
                          className="flex items-center gap-2 text-slate-700"
                        >
                          <FiCheck
                            className="text-green-500 flex-shrink-0"
                            size={16}
                          />
                          <span className="text-sm">{amenity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </section>
            );
          })()}

          {/* Neighborhood */}
          {(() => {
            const n = data?.nearbyPlaces;
            const has =
              n &&
              (n.schools?.length ||
                n.metroStations?.length ||
                n.hospitals?.length ||
                n.malls?.length);
            if (!has) return null;
            return (
              <section className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                <h3 className="text-xl font-bold text-slate-900">
                  Neighborhood
                </h3>
                <div className="grid sm:grid-cols-2 gap-4 text-sm">
                  {n.metroStations?.length > 0 && (
                    <div>
                      <span className="text-slate-500 font-medium block mb-1">
                        Metro / transit
                      </span>
                      <ul className="text-slate-800 space-y-1 list-disc list-inside">
                        {n.metroStations.map((x: string, i: number) => (
                          <li key={i}>{x}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {n.schools?.length > 0 && (
                    <div>
                      <span className="text-slate-500 font-medium block mb-1">
                        Schools
                      </span>
                      <ul className="text-slate-800 space-y-1 list-disc list-inside">
                        {n.schools.map((x: string, i: number) => (
                          <li key={i}>{x}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {n.hospitals?.length > 0 && (
                    <div>
                      <span className="text-slate-500 font-medium block mb-1">
                        Hospitals
                      </span>
                      <ul className="text-slate-800 space-y-1 list-disc list-inside">
                        {n.hospitals.map((x: string, i: number) => (
                          <li key={i}>{x}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {n.malls?.length > 0 && (
                    <div>
                      <span className="text-slate-500 font-medium block mb-1">
                        Malls & shopping
                      </span>
                      <ul className="text-slate-800 space-y-1 list-disc list-inside">
                        {n.malls.map((x: string, i: number) => (
                          <li key={i}>{x}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </section>
            );
          })()}
          {/* Map Section */}
          <section className="space-y-4">
            <h3 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <FiMapPin className="text-[#4161df]" /> Location
            </h3>
            <div className="rounded-3xl overflow-hidden border-4 border-white shadow-lg h-[400px]">
              {map}
            </div>
          </section>
          {/* Similar Properties - CRITICAL FOR SEO */}
          {similarProperties.length > 0 && (
            <section className="space-y-4">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-xl font-bold text-slate-900">
                  Similar properties
                </h3>
                <Link
                  href={`/properties/chandigarh?city=${encodeURIComponent(data?.location?.city || "")}&deal=${data?.deal || ""}`}
                  className="text-sm font-semibold text-[#4161df]"
                >
                  More in {data?.location?.city}
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
                {similarProperties.slice(0, 4).map((p: any) => (
                  <PropertyCard key={p._id || p.id} card={p} />
                ))}
              </div>
            </section>
          )}
        </div>
        {sidebar}
      </div>
    </>
  );
}

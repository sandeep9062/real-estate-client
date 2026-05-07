"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { useSelector } from "react-redux";
import { FiShare2, FiMapPin, FiCalendar } from "react-icons/fi";
import { FaShower, FaBed, FaCar, FaUserTie } from "react-icons/fa";
import { MdLocationPin, MdMeetingRoom } from "react-icons/md";
import { RiServiceLine } from "react-icons/ri";
import { FaWhatsapp } from "react-icons/fa";

import {
  useGetSimilarPropertiesQuery,
  useRecordPropertyViewMutation,
  useGetComparePropertiesQuery,
} from "@/services/propertiesApi";
import { useGetRecentlyViewedQuery } from "@/services/userApi";
import {
  pushLocalRecentPropertyId,
  getLocalRecentPropertyIds,
} from "@/lib/recentlyViewedLocal";
import Link from "next/link";
import PropertyCard from "@/components/PropertyCard";
import VisitReviewsSection from "@/components/VisitReviewsSection";
import {
  PropertyTrustBadges,
  ListingAvailabilityPill,
} from "@/components/PropertyTrustBadges";
import { isVisitDateOnOrBeforeToday } from "@/lib/bookingDate";

const Map = dynamic(() => import("@/components/Map"), {
  ssr: false,
  loading: () => (
    <div className="h-[400px] w-full bg-gray-100 animate-pulse rounded-xl" />
  ),
});

import Heart from "../../../components/Heart";
import BookingModal from "../../../components/BookingModal";
import MediaGallery from "@/components/MediaGallery";
import BrochureDownloadButton from "@/components/BrochureDownloadButton";

import EMICalculator from "@/components/EMICalculator";
import { toast } from "@/hooks/use-toast";
import {
  useCancelBookingMutation,
  useGetUserByIdQuery,
} from "@/services/userApi";
import { selectIsAuthenticated, selectUser } from "@/store/authSlice";

const PropertyDetails = ({ data }: { data: any }) => {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const [modalOpened, setModalOpened] = useState(false);

  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);
  const { data: userData } = useGetUserByIdQuery(user?._id as string, {
    skip: !user?._id,
  });

  const [cancelBooking, { isLoading: cancelling }] = useCancelBookingMutation();

  const { data: similar = [] } = useGetSimilarPropertiesQuery({
    propertyId: id,
    limit: 8,
  });
  const { data: recentAuth = [] } = useGetRecentlyViewedQuery(undefined, {
    skip: !isAuthenticated,
  });
  const recentGuestIds = getLocalRecentPropertyIds()
    .filter((x) => x !== id)
    .slice(0, 6)
    .join(",");
  const { data: recentGuest = [] } = useGetComparePropertiesQuery(
    recentGuestIds,
    { skip: isAuthenticated || !recentGuestIds },
  );

  const [recordView] = useRecordPropertyViewMutation();

  useEffect(() => {
    if (!id) return;
    pushLocalRecentPropertyId(id);
    if (isAuthenticated) {
      recordView(id).catch(() => {});
    }
  }, [id, isAuthenticated, recordView]);

  const recentList = (
    isAuthenticated
      ? recentAuth.filter((p: any) => String(p._id || p.id) !== id)
      : recentGuest.filter((p: any) => String(p._id || p.id) !== id)
  ).slice(0, 6);

  const bookings = (userData?.bookedVisits ||
    user?.bookedVisits ||
    []) as any[];
  const currentBooking = bookings.find(
    (b: any) =>
      String(b?.property?._id || b?.property || b?.property?.id) === id,
  );
  const bookingId = currentBooking?._id ? String(currentBooking._id) : null;
  const bookingStatus = currentBooking?.status ?? "Pending";
  const isBooked = !!currentBooking;
  const bookedDate = currentBooking?.date;

  // GA4 WhatsApp Lead Tracking
  const handleWhatsAppClick = (e: React.MouseEvent) => {
    // Track GA4 generate_lead event
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", "generate_lead", {
        event_category: "Engagement",
        event_label: data?.title || "Unknown Property",
        value: 1,
      });
    }
    // Allow default link behavior to open WhatsApp
  };

  const handleShare = async () => {
    const shareUrl = window.location.href;
    const imageUrl = Array.isArray(data?.image) ? data.image[0] : data?.image;

    try {
      if (navigator.share) {
        await navigator.share({
          title: data?.title,
          text: `Check out this property for Rs ${data?.price}`,
          url: shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        toast.success("Link copied to clipboard");
      }
    } catch (error) {
      toast.error("Unable to share");
    }
  };

  return (
    <div className="min-h-screen pt-20 bg-gray-50/50 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

          <div className="flex items-center gap-3">
            <button
              onClick={handleShare}
              className="p-3 rounded-full border bg-white shadow-sm hover:bg-gray-50 transition-all active:scale-95"
            >
              <FiShare2 size={18} className="text-slate-600" />
            </button>
            <div className="rounded-full border bg-white shadow-sm">
              <Heart card={data as any} />
            </div>
          </div>
        </div>

        {/* Gallery */}
        <div className="rounded-3xl overflow-hidden shadow-2xl mb-10">
          <MediaGallery
            sources={data?.image as any}
            alt={data?.title}
            virtualTourUrl={data?.virtualTourUrl}
            floorPlans={data?.floorPlanImages}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Content Area */}
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
                    value: ((
                      {
                        Available: "Available to enquire",
                        Fresh: "Fresh listing",
                        "Under offer": "Under offer — enquire quickly",
                        Booked: "Booked / on hold",
                      } as Record<string, string>
                    )[String(data?.listingAvailability || "Available")] ??
                      data?.listingAvailability) as string,
                  },
                  { label: "Category", value: data?.propertyCategory },
                  {
                    label: "Area",
                    value: `${data?.area?.value} ${data?.area?.unit}`,
                  },
                  { label: "Availability", value: data?.availability },
                  { label: "Furnishing", value: data?.furnishing },
                  { label: "Facing", value: data?.facing },
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
                  ...(Array.isArray(data?.amenities) &&
                  data.amenities.length > 0
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

            <VisitReviewsSection
              propertyId={id}
              bookingId={bookingId}
              bookingDate={bookedDate}
              bookingStatus={bookingStatus}
              isAuthenticated={isAuthenticated}
            />

            {/* Map Section */}
            <section className="space-y-4">
              <h3 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <FiMapPin className="text-[#4161df]" /> Location
              </h3>
              <div className="rounded-3xl overflow-hidden border-4 border-white shadow-lg h-[400px]">
                <Map key={data?._id} location={data?.location?.coordinates} />
              </div>
            </section>

            {similar.length > 0 && (
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
                <div className="grid grid-cols-2 gap-4 sm:gap-5 md:gap-6">
                  {similar.slice(0, 4).map((p: any) => (
                    <PropertyCard key={p._id || p.id} card={p} />
                  ))}
                </div>
              </section>
            )}

            {recentList.length > 0 && (
              <section className="space-y-4">
                <h3 className="text-xl font-bold text-slate-900">
                  Recently viewed
                </h3>
                <div className="grid grid-cols-2 gap-4 sm:gap-5 md:gap-6">
                  {recentList.map((p: any) => (
                    <PropertyCard key={p._id || p.id} card={p} />
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sticky Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl">
                <div className="flex flex-col mb-6">
                  <span className="text-slate-500 text-sm font-medium">
                    Total Price
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold text-slate-900">
                      Rs {data?.price}
                    </span>
                    {data?.deal === "Rent" && (
                      <span className="text-slate-500">/mo</span>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <BrochureDownloadButton
                    propertyId={id}
                    propertyTitle={data?.title}
                    className="w-full justify-center py-4 rounded-xl border-2 border-[#4161df] text-[#4161df] font-bold hover:bg-blue-50 transition-colors"
                  />

                  {isBooked ? (
                    <div className="space-y-3">
                      <div
                        className={`rounded-xl border p-3 text-left ${
                          bookingStatus === "Completed"
                            ? "bg-slate-50 border-slate-200 text-slate-800"
                            : bookingStatus === "Confirmed"
                              ? "bg-emerald-50 border-emerald-100 text-emerald-900"
                              : "bg-amber-50 border-amber-100 text-amber-950"
                        }`}
                      >
                        <div className="flex gap-2">
                          <FiCalendar
                            className="mt-0.5 shrink-0 text-lg opacity-90"
                            aria-hidden
                          />
                          <div className="min-w-0 space-y-1">
                            <p className="text-xs font-bold uppercase tracking-wide text-slate-600">
                              Site visit
                            </p>
                            <p className="text-sm font-semibold">
                              {bookedDate
                                ? `Scheduled for ${bookedDate}`
                                : "Date to be confirmed"}
                            </p>
                            <p className="text-xs font-medium leading-snug opacity-90">
                              {bookingStatus === "Pending" &&
                                "We’ll confirm this slot with the agent."}
                              {bookingStatus === "Confirmed" &&
                                "Confirmed — ideal time for a walkthrough."}
                              {bookingStatus === "Completed" &&
                                (bookedDate &&
                                isVisitDateOnOrBeforeToday(bookedDate)
                                  ? "Visit completed — you can share quick feedback in the reviews section above."
                                  : "Visit marked complete.")}
                            </p>
                          </div>
                        </div>
                      </div>
                      <button
                        className="w-full text-red-500 font-medium py-2 hover:underline transition-all"
                        onClick={() =>
                          cancelBooking(id)
                            .unwrap()
                            .then(() => toast.success("Booking cancelled"))
                        }
                        disabled={cancelling}
                      >
                        {cancelling ? "Cancelling..." : "Cancel Booking"}
                      </button>
                    </div>
                  ) : (
                    <button
                      className="w-full bg-[#4161df] text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-blue-200 hover:bg-[#3759dd] hover:shadow-blue-300 transition-all active:scale-[0.98]"
                      onClick={() => {
                        if (!isAuthenticated) return router.push("/login");
                        setModalOpened(true);
                      }}
                    >
                      Book a Visit
                    </button>
                  )}

                  {data?.user?.phone && (
                    <a
                      href={`https://wa.me/${data.user.phone}?text=${encodeURIComponent(
                        `Hi, I saw your property "${data.title}" on PropertyBulbul. Is it still available?\n\nProperty link: https://www.propertybulbul.com/property/${id}`,
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={handleWhatsAppClick}
                      className="flex items-center justify-center gap-2 w-full bg-green-500 text-white py-4 rounded-xl text-lg shadow-lg shadow-green-200 hover:bg-green-600 hover:shadow-green-300 transition-all active:scale-[0.98]"
                    >
                      <FaWhatsapp size={20} />
                      Chat on WhatsApp
                    </a>
                  )}
                </div>

                <p className="text-center text-slate-400 text-xs mt-6">
                  No charges for booking a visit. Standard terms apply.
                </p>
              </div>

              {/* EMI Calculator — only for Sale properties */}
              {data?.deal === "Sale" && (
                <EMICalculator
                  propertyPrice={Number(data?.price) || 0}
                  className="w-full"
                />
              )}
            </div>
          </div>
        </div>
      </div>

      <BookingModal
        opened={modalOpened}
        setOpened={setModalOpened}
        propertyId={id as string}
        email={(user?.email as string) || ""}
      />
    </div>
  );
};

export default PropertyDetails;

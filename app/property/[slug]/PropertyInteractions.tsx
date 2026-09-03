"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { FiShare2, FiCalendar } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import dynamic from "next/dynamic";
import {
  useRecordPropertyViewMutation,
  useGetComparePropertiesQuery,
} from "@/services/propertiesApi";
import {
  useGetRecentlyViewedQuery,
  useCancelBookingMutation,
  useGetUserByIdQuery,
} from "@/services/userApi";
import {
  pushLocalRecentPropertyId,
  getLocalRecentPropertyIds,
} from "@/lib/recentlyViewedLocal";
import PropertyCard from "@/components/PropertyCard";
import VisitReviewsSection from "@/components/VisitReviewsSection";
import Heart from "@/components/Heart";
import BookingModal from "@/components/BookingModal";
import BrochureDownloadButton from "@/components/BrochureDownloadButton";
import EMICalculator from "@/components/EMICalculator";
import { toast } from "@/hooks/use-toast";
import { selectIsAuthenticated, selectUser } from "@/store/authSlice";
import { isVisitDateOnOrBeforeToday } from "@/lib/bookingDate";
import { useCreateLeadMutation } from "@/services/leadsApi";

const Map = dynamic(() => import("@/components/Map"), {
  ssr: false,
  loading: () => (
    <div className="h-[400px] w-full bg-gray-100 animate-pulse rounded-xl" />
  ),
});

interface PropertyInteractionsProps {
  data: any;
}

export function PropertyHeaderButtons({ data }: PropertyInteractionsProps) {
  const handleShare = async () => {
    const shareUrl = typeof window !== "undefined" ? window.location.href : "";
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
  );
}

export function PropertyMainInteractions({ data }: PropertyInteractionsProps) {
  const id = data?._id as string;
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);
  const { data: userData } = useGetUserByIdQuery(user?._id as string, {
    skip: !user?._id,
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
  const bookedDate = currentBooking?.date;

  return (
    <div className="space-y-10">
      <VisitReviewsSection
        propertyId={id}
        bookingId={bookingId}
        bookingDate={bookedDate}
        bookingStatus={bookingStatus}
        isAuthenticated={isAuthenticated}
      />

      {recentList.length > 0 && (
        <section className="space-y-4">
          <h3 className="text-xl font-bold text-slate-900">Recently viewed</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
            {recentList.map((p: any) => (
              <PropertyCard key={p._id || p.id} card={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export function PropertyMap({ data }: PropertyInteractionsProps) {
  return <Map key={data?._id} location={data?.location?.coordinates} />;
}

export function PropertySidebar({ data }: PropertyInteractionsProps) {
  const router = useRouter();
  const id = data?._id as string;
  const [modalOpened, setModalOpened] = useState(false);

  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);
  const { data: userData } = useGetUserByIdQuery(user?._id as string, {
    skip: !user?._id,
  });

  const [cancelBooking, { isLoading: cancelling }] = useCancelBookingMutation();

  const bookings = (userData?.bookedVisits ||
    user?.bookedVisits ||
    []) as any[];
  const currentBooking = bookings.find(
    (b: any) =>
      String(b?.property?._id || b?.property || b?.property?.id) === id,
  );
  const bookingStatus = currentBooking?.status ?? "Pending";
  const isBooked = !!currentBooking;
  const bookedDate = currentBooking?.date;

  const [createLead] = useCreateLeadMutation();

  const handleWhatsAppClick = () => {
    // Keep existing analytics behavior unchanged.
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", "generate_lead", {
        event_category: "Engagement",
        event_label: data?.title || "Unknown Property",
        value: 1,
      });
    }

    // Fire-and-forget CRM lead capture — must never block the WhatsApp redirect.
    // agentId is derived server-side from the property owner; buyer name/phone
    // (if the buyer is logged in) are filled in by the backend via optionalAuth.
    if (id) {
      createLead({ propertyId: id, source: "whatsapp_click" }).catch(() => {});
    }
  };

  return (
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
                          (bookedDate && isVisitDateOnOrBeforeToday(bookedDate)
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

        {data?.deal === "Sale" && (
          <EMICalculator
            propertyPrice={Number(data?.price) || 0}
            className="w-full"
          />
        )}
      </div>

      <BookingModal
        opened={modalOpened}
        setOpened={setModalOpened}
        propertyId={id as string}
        email={(user?.email as string) || ""}
      />
    </div>
  );
}

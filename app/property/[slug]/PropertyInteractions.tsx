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
import { formatINR } from "@/lib/formatPrice";
import { useCreateLeadMutation } from "@/services/leadsApi";

const Map = dynamic(() => import("@/components/Map"), {
  ssr: false,
  loading: () => (
    <div className="h-full min-h-[320px] w-full animate-pulse rounded-2xl bg-slate-100" />
  ),
});

interface PropertyInteractionsProps {
  data: any;
}

/* ───────────────────────── Header buttons ───────────────────────── */

export function PropertyHeaderButtons({ data }: PropertyInteractionsProps) {
  const handleShare = async () => {
    const shareUrl = typeof window !== "undefined" ? window.location.href : "";
    try {
      if (navigator.share) {
        await navigator.share({
          title: data?.title,
          text: `Check out this property for ${formatINR(data?.price) || "a great price"} on PropertyBulbul`,
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
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={handleShare}
        aria-label="Share this property"
        className="grid h-11 w-11 place-items-center rounded-full bg-white text-slate-700 ring-1 ring-slate-900/10 transition hover:bg-slate-50 active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4161df]"
      >
        <FiShare2 size={18} aria-hidden />
      </button>
      <div className="grid h-11 w-11 place-items-center rounded-full bg-white ring-1 ring-slate-900/10">
        <Heart card={data as any} />
      </div>
    </div>
  );
}

/* ───────────────────── View recording + reviews ───────────────────── */

/**
 * Records the view client-side. Split out so it can mount once at the foot of
 * the page while reviews and recently-viewed render independently — the
 * recording must not run twice.
 */
export function PropertyViewRecorder({ data }: PropertyInteractionsProps) {
  const id = data?._id as string;
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [recordView] = useRecordPropertyViewMutation();

  useEffect(() => {
    if (!id) return;
    pushLocalRecentPropertyId(id);
    if (isAuthenticated) {
      recordView(id).catch(() => {});
    }
  }, [id, isAuthenticated, recordView]);

  return null;
}

export function PropertyReviews({ data }: PropertyInteractionsProps) {
  const id = data?._id as string;
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);
  const { data: userData } = useGetUserByIdQuery(user?._id as string, {
    skip: !user?._id,
  });

  const bookings = (userData?.bookedVisits ||
    user?.bookedVisits ||
    []) as any[];
  const currentBooking = bookings.find(
    (b: any) =>
      String(b?.property?._id || b?.property || b?.property?.id) === id,
  );

  return (
    <VisitReviewsSection
      propertyId={id}
      bookingId={currentBooking?._id ? String(currentBooking._id) : null}
      bookingDate={currentBooking?.date}
      bookingStatus={currentBooking?.status ?? "Pending"}
      isAuthenticated={isAuthenticated}
    />
  );
}

export function PropertyRecentlyViewed({ data }: PropertyInteractionsProps) {
  const id = data?._id as string;
  const isAuthenticated = useSelector(selectIsAuthenticated);

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

  const recentList = (
    isAuthenticated
      ? recentAuth.filter((p: any) => String(p._id || p.id) !== id)
      : recentGuest.filter((p: any) => String(p._id || p.id) !== id)
  ).slice(0, 6);

  if (!recentList.length) return null;

  return (
    <section id="recently-viewed">
      <h2 className="mb-5 font-heading text-xl font-bold tracking-tight text-slate-900 md:text-2xl">
        Recently viewed
      </h2>
      <div className="grid grid-cols-1 items-stretch gap-5 sm:grid-cols-2">
        {recentList.map((p: any) => (
          <PropertyCard key={p._id || p.id} card={p} />
        ))}
      </div>
    </section>
  );
}

/* ─────────────────────────────── Map ─────────────────────────────── */

export function PropertyMap({ data }: PropertyInteractionsProps) {
  return (
    <div className="h-full w-full">
      <Map key={data?._id} location={data?.location?.coordinates} />
    </div>
  );
}

/* ───────────────────────────── Sidebar ───────────────────────────── */

/** Calm, low-chroma tints so booking states read as information, not alerts. */
const BOOKING_STATUS_STYLES: Record<string, string> = {
  Completed: "border-slate-200 bg-slate-50 text-slate-700",
  Confirmed: "border-emerald-200 bg-emerald-50 text-emerald-900",
  Pending: "border-amber-200 bg-amber-50 text-amber-900",
};

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

  const handleWhatsAppClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Direct WhatsApp contact is gated — only logged-in users can chat with
    // the owner/agent. Everyone else is sent to /login first.
    if (!isAuthenticated) {
      e.preventDefault();
      toast.error("Please log in to chat on WhatsApp");
      router.push("/login");
      return;
    }

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

  const whatsappHref = data?.user?.phone
    ? `https://wa.me/${data.user.phone}?text=${encodeURIComponent(
        `Hi, I saw your property "${data.title}" on PropertyBulbul. Is it still available?\n\nProperty link: https://www.propertybulbul.com/property/${data.slug}`,
      )}`
    : null;

  const onBookClick = () => {
    if (!isAuthenticated) return router.push("/login");
    setModalOpened(true);
  };

  // Identity of whoever listed the property, shown only when the data has it.
  const postedBy = (
    data?.user?.name ||
    data?.user?.fullName ||
    data?.agentName ||
    ""
  )
    .toString()
    .trim();
  const roleSource = (data?.user?.role || data?.postedBy || "")
    .toString()
    .trim()
    .toLowerCase();
  const postedByRole =
    roleSource === "agent"
      ? "Agent"
      : roleSource === "builder"
        ? "Builder"
        : "Owner";

  return (
    <aside className="lg:col-span-1">
      {/* Sticky so the call to action stays reachable while reading. */}
      <div className="space-y-5 lg:sticky lg:top-24">
        <div className="rounded-2xl bg-white p-5 ring-1 ring-slate-900/10 sm:p-6">
          <h2 className="font-heading text-lg font-bold text-slate-900">
            Interested in this property?
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Visit it in person or message the{" "}
            {data?.postedBy === "Agent" ? "agent" : "owner"} directly.
          </p>

          {/* {postedBy && (
            <div className="mt-4 flex items-center gap-3 border-t border-slate-200 pt-4">
              <span
                aria-hidden
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#4161df]/10 font-heading text-sm font-bold text-[#3049b8]"
              >
                {postedBy.slice(0, 1).toUpperCase()}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-900">
                  {postedBy}
                </p>
                <p className="flex items-center gap-1.5 text-sm text-slate-500">
                  {postedByRole}
                  {(data?.ownerVerified || data?.isVerified) && (
                    <>
                      <span aria-hidden className="text-slate-300">
                        ·
                      </span>
                      <span className="font-medium text-[#3049b8]">
                        Verified
                      </span>
                    </>
                  )}
                </p>
              </div>
            </div>
          )} */}

          <div className="mt-5 space-y-2.5">
            {isBooked ? (
              <>
                <div
                  className={`rounded-xl border p-4 ${
                    BOOKING_STATUS_STYLES[bookingStatus] ??
                    BOOKING_STATUS_STYLES.Pending
                  }`}
                >
                  <div className="flex gap-3">
                    <FiCalendar
                      className="mt-0.5 shrink-0"
                      size={18}
                      aria-hidden
                    />
                    <div className="space-y-1">
                      <p className="text-sm font-semibold">
                        {bookedDate
                          ? `Visit on ${bookedDate}`
                          : "Visit date to be confirmed"}
                      </p>
                      <p className="text-xs leading-snug opacity-90">
                        {bookingStatus === "Pending" &&
                          "We'll confirm this slot with the agent."}
                        {bookingStatus === "Confirmed" &&
                          "Confirmed. Plan for a full walkthrough."}
                        {bookingStatus === "Completed" &&
                          (bookedDate && isVisitDateOnOrBeforeToday(bookedDate)
                            ? "Visit completed. Share feedback in the reviews section."
                            : "Visit marked complete.")}
                      </p>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  className="w-full rounded-xl py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4161df] disabled:opacity-60"
                  onClick={() =>
                    cancelBooking(id)
                      .unwrap()
                      .then(() => toast.success("Booking cancelled"))
                  }
                  disabled={cancelling}
                >
                  {cancelling ? "Cancelling…" : "Cancel visit"}
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={onBookClick}
                className="w-full rounded-xl bg-[#4161df] py-3.5 text-base font-semibold text-white transition hover:bg-[#3452c0] active:scale-[0.99] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4161df]"
              >
                Book a visit
              </button>
            )}

            {whatsappHref && (
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleWhatsAppClick}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#128C4A] py-3.5 text-base font-semibold text-white transition hover:bg-[#0f773e] active:scale-[0.99] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#128C4A]"
              >
                <FaWhatsapp size={20} aria-hidden />
                Chat on WhatsApp
              </a>
            )}

            <BrochureDownloadButton
              propertyId={id}
              propertyTitle={data?.title}
              className="w-full justify-center rounded-xl border border-slate-300 bg-white py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
            />
          </div>

          <p className="mt-4 text-center text-xs text-slate-500">
            Free to book. Standard terms apply.
          </p>
        </div>

        {data?.deal === "Sale" && (
          <EMICalculator
            propertyPrice={Number(data?.price) || 0}
            className="w-full"
          />
        )}
      </div>

      {/*
        Fixed mobile action bar. The page wrapper reserves `pb-28` so this
        never covers the last section. Hidden on desktop, where the sticky
        contact panel above is the call to action.
      */}
      {!isBooked && (
        <div
          className="fixed inset-x-0 bottom-0 z-40 flex gap-2.5 border-t border-slate-200 bg-white/95 px-3 pt-3 backdrop-blur lg:hidden"
          style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
        >
          <button
            type="button"
            onClick={onBookClick}
            className="min-h-12 flex-1 rounded-xl bg-[#4161df] text-base font-semibold text-white transition hover:bg-[#3452c0] active:scale-[0.99] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4161df]"
          >
            Book a visit
          </button>
          {whatsappHref && (
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleWhatsAppClick}
              aria-label="Chat on WhatsApp"
              className="grid min-h-12 w-14 place-items-center rounded-xl bg-[#128C4A] text-white transition hover:bg-[#0f773e] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#128C4A]"
            >
              <FaWhatsapp size={22} aria-hidden />
            </a>
          )}
        </div>
      )}

      <BookingModal
        opened={modalOpened}
        setOpened={setModalOpened}
        propertyId={id as string}
        email={(user?.email as string) || ""}
      />
    </aside>
  );
}

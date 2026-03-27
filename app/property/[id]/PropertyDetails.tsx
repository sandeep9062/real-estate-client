"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { useSelector } from "react-redux";
import { FiShare2, FiCheckCircle, FiMapPin } from "react-icons/fi";
import { FaShower, FaBed, FaCar, FaUserTie } from "react-icons/fa";
import { MdLocationPin, MdMeetingRoom } from "react-icons/md";
import { RiServiceLine } from "react-icons/ri";

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
import WhatsAppActions from "@/components/WhatsAppActions";
import { toast } from "@/hooks/use-toast";
import {
  useCancelBookingMutation,
  useGetUserByIdQuery,
} from "@/services/userApi";
import { selectIsAuthenticated, selectUser } from "@/store/authSlice";

const PropertyDetails = ({ data }: { data: any }) => {
  // console.log(data, "prororor-data");

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

  const bookings = (userData?.bookedVisits ||
    user?.bookedVisits ||
    []) as any[];
  const isBooked = bookings.some(
    (b: any) => (b?.property?._id || b?.property || b?.id) === id,
  );
  const bookedDate = bookings.find(
    (b: any) => (b?.property?._id || b?.property || b?.id) === id,
  )?.date;

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
    <div className="min-h-screen bg-gray-50/50 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              {data?.isVerified && (
                <span className="flex items-center gap-1 bg-blue-50 text-blue-700 text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                  <FiCheckCircle /> Verified
                </span>
              )}
              <span className="bg-orange-50 text-orange-700 text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                {data?.type}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
              {data?.title}
            </h1>
            <div className="flex items-center gap-1 text-slate-500">
              <MdLocationPin className="text-blue-600" size={20} />
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
          <MediaGallery sources={data?.image as any} alt={data?.title} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-10">
            {/* Quick Stats */}
            <section className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center">
                <MdMeetingRoom className="text-blue-500 mb-2" size={24} />
                <span className="text-slate-900 font-bold">
                  {data?.facilities?.bedrooms}
                </span>
                <span className="text-slate-500 text-xs uppercase font-medium">
                  Bedrooms
                </span>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center">
                <FaShower className="text-blue-500 mb-2" size={24} />
                <span className="text-slate-900 font-bold">
                  {data?.facilities?.bathrooms}
                </span>
                <span className="text-slate-500 text-xs uppercase font-medium">
                  Bathrooms
                </span>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center">
                <FaCar className="text-blue-500 mb-2" size={24} />
                <span className="text-slate-900 font-bold">
                  {data?.facilities?.parkings || 0}
                </span>
                <span className="text-slate-500 text-xs uppercase font-medium">
                  Parking
                </span>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center">
                <RiServiceLine className="text-blue-500 mb-2" size={24} />
                <span className="text-slate-900 font-bold">
                  {data?.facilities?.servantRooms || 0}
                </span>
                <span className="text-slate-500 text-xs uppercase font-medium">
                  Servant R.
                </span>
              </div>
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
                  { label: "Category", value: data?.propertyCategory },
                  {
                    label: "Area",
                    value: `${data?.area?.value} ${data?.area?.unit}`,
                  },
                  { label: "Availability", value: data?.availability },
                  { label: "Furnishing", value: data?.furnishing },
                  { label: "Facing", value: data?.facing },
                ].map((item, idx) => (
                  <div key={idx} className="flex flex-col">
                    <span className="text-slate-400 text-sm">{item.label}</span>
                    <span className="text-slate-900 font-semibold">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* Map Section */}
            <section className="space-y-4">
              <h3 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <FiMapPin className="text-blue-600" /> Location
              </h3>
              <div className="rounded-3xl overflow-hidden border-4 border-white shadow-lg h-[400px]">
                <Map key={data?._id} location={data?.location?.coordinates} />
              </div>
            </section>
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
                    className="w-full justify-center py-4 rounded-xl border-2 border-blue-600 text-blue-600 font-bold hover:bg-blue-50 transition-colors"
                  />

                  {isBooked ? (
                    <div className="space-y-3">
                      <div className="bg-green-50 text-green-700 p-3 rounded-xl text-center text-sm font-semibold border border-green-100">
                        Visit scheduled for {bookedDate}
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
                      className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-blue-200 hover:bg-blue-700 hover:shadow-blue-300 transition-all active:scale-[0.98]"
                      onClick={() => {
                        if (!isAuthenticated) return router.push("/auth");
                        setModalOpened(true);
                      }}
                    >
                      Book a Visit
                    </button>
                  )}
                </div>

                <p className="text-center text-slate-400 text-xs mt-6">
                  No charges for booking a visit. Standard terms apply.
                </p>
              </div>

              {/* WhatsApp Actions */}
              {/* 
              <WhatsAppActions
                propertyId={id}
                propertyTitle={data?.title}
                propertyCity={data?.location?.city}
                className="w-full"
              /> */}
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

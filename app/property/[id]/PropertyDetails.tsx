"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
const Map = dynamic(() => import("@/components/Map"), { ssr: false });
import Heart from "../../../components/Heart";
import BookingModal from "../../../components/BookingModal";
import MediaGallery from "@/components/MediaGallery";
import { toast } from "@/hooks/use-toast";

import { FiShare2 } from "react-icons/fi";

import {
  useCancelBookingMutation,
  useGetUserByIdQuery,
} from "@/services/userApi";
import { useSelector } from "react-redux";
import { selectIsAuthenticated, selectUser } from "@/store/authSlice";
import { FaShower } from "react-icons/fa";
import { AiTwotoneCar } from "react-icons/ai";
import { MdLocationPin, MdMeetingRoom } from "react-icons/md";
import { RiServiceLine } from "react-icons/ri";
import BrochureDownloadButton from "@/components/BrochureDownloadButton";

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

  const bookings = (userData?.bookedVisits ||
    user?.bookedVisits ||
    []) as any[];

  const handleShare = async () => {
    const shareUrl = window.location.href;
    const imageUrl = Array.isArray(data?.image) ? data.image[0] : data?.image;

    try {
      // Try sharing image (Mobile browsers)
      if (navigator.canShare && navigator.canShare({ files: [] }) && imageUrl) {
        const response = await fetch(imageUrl);
        const blob = await response.blob();

        const file = new File([blob], "property.jpg", { type: blob.type });

        await navigator.share({
          title: data?.title,
          text: `Check out this property for Rs ${data?.price}`,
          url: shareUrl,
          files: [file],
        });
      }
      // Normal share (Desktop + fallback)
      else if (navigator.share) {
        await navigator.share({
          title: data?.title,
          text: `Check out this property for Rs ${data?.price}`,
          url: shareUrl,
        });
      }
      // Ultimate fallback
      else {
        await navigator.clipboard.writeText(shareUrl);
        toast.success("Property link copied to clipboard");
      }
    } catch (error) {
      toast.error("Unable to share property");
    }
  };

  const isBooked = bookings.some(
    (b: any) => (b?.property?._id || b?.property || b?.id) === id,
  );
  const bookedDate = bookings.find(
    (b: any) => (b?.property?._id || b?.property || b?.id) === id,
  )?.date;

  return (
    <div className="w-full flex flex-col gap-8 px-4 py-8 max-w-6xl mx-auto relative">
      <MediaGallery sources={data?.image as any} alt={data?.title} />
      <div className="flex flex-col md:flex-row gap-8 w-full">
        <div className="flex flex-col gap-6 flex-1">
          <div className="flex justify-between items-start">
            <div className="flex flex-col">
              <div className="flex items-center gap-3">
                <span className="text-2xl font-bold">{data?.title}</span>

                <Heart card={data as any} />

                <button
                  onClick={handleShare}
                  className="p-2 rounded-full border hover:bg-gray-100 transition"
                  title="Share property"
                >
                  <FiShare2 size={18} />
                </button>
              </div>

              <div className="flex items-center gap-2 text-gray-700 mt-1">
                <MdLocationPin size={20} />
                <span className="text-sm">
                  {data?.location?.address}, {data?.location?.city},{" "}
                  {data?.location?.country}
                </span>
              </div>
            </div>
            <span className="text-orange-600 text-2xl font-semibold">
              Rs {data?.price}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-3 text-sm bg-gray-50 p-4 rounded-lg border">
            <div className="flex items-center gap-2">
              <FaShower /> <span>{data?.facilities?.bathrooms} Bathrooms</span>
            </div>
            {data?.facilities?.parkings > 0 && (
              <div className="flex items-center gap-2">
                <AiTwotoneCar />{" "}
                <span>{data?.facilities?.parkings} Parking</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <MdMeetingRoom /> <span>{data?.facilities?.bedrooms} Rooms</span>
            </div>
            {data?.facilities?.servantRooms > 0 && (
              <div className="flex items-center gap-2">
                <RiServiceLine />{" "}
                <span>{data?.facilities?.servantRooms} Servant Rooms</span>
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm mt-4 border-t pt-4">
            <div className="flex flex-col">
              <span className="font-semibold">Deal</span>
              <span>{data?.deal}</span>
            </div>
            <div className="flex flex-col">
              <span className="font-semibold">Type</span>
              <span>{data?.type}</span>
            </div>
            <div className="flex flex-col">
              <span className="font-semibold">Category</span>
              <span>{data?.propertyCategory}</span>
            </div>
            <div className="flex flex-col">
              <span className="font-semibold">Area</span>
              <span>
                {data?.area?.value} {data?.area?.unit}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-semibold">Availability</span>
              <span>{data?.availability}</span>
            </div>
            <div className="flex flex-col">
              <span className="font-semibold">Furnishing</span>
              <span>{data?.furnishing}</span>
            </div>
            <div className="flex flex-col">
              <span className="font-semibold">Facing</span>
              <span>{data?.facing}</span>
            </div>
            <div className="flex flex-col">
              <span className="font-semibold">Verified</span>
              <span>{data?.isVerified ? "Yes" : "No"}</span>
            </div>
            {data?.type === "Commercial" && (
              <>
                <div className="flex flex-col">
                  <span className="font-semibold">Commercial Types</span>
                  <span>
                    {data?.commercialPropertyTypes
                      ?.map((a: string) => a.replace(/"/g, ""))
                      .join(", ")}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold">Investment Options</span>
                  <span>
                    {data?.investmentOptions
                      ?.map((a: string) => a.replace(/"/g, ""))
                      .join(", ")}
                  </span>
                </div>
              </>
            )}
          </div>
          <p className="text-gray-700 leading-7 text-justify">
            {data?.description}
          </p>

          {/* Brochure Download Section */}
          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <BrochureDownloadButton
              propertyId={id}
              propertyTitle={data?.title}
              className="flex-1"
            />
          </div>

          {isBooked ? (
            <>
              <button
                className="w-full border border-red-500 text-red-600 py-3 rounded-lg hover:bg-red-50"
                onClick={() =>
                  cancelBooking(id)
                    .unwrap()
                    .then(() => toast.success("Booking cancelled"))
                    .catch(() => toast.error("Failed to cancel booking"))
                }
                disabled={cancelling}
              >
                Cancel Booking
              </button>
              {bookedDate && (
                <span className="text-sm text-gray-600">
                  Visit already booked for {bookedDate}
                </span>
              )}
            </>
          ) : (
            <button
              className="bg-blue-600 text-white py-3 rounded-lg w-full hover:bg-blue-700 transition"
              onClick={() => {
                if (!isAuthenticated) {
                  router.push("/auth");
                  return;
                }
                setModalOpened(true);
              }}
            >
              Book your visit
            </button>
          )}
          <BookingModal
            opened={modalOpened}
            setOpened={setModalOpened}
            propertyId={id as string}
            email={(user?.email as string) || ""}
          />
        </div>
        <div className="flex-1">
          <Map key={data?._id} location={data?.location?.coordinates} />
        </div>
      </div>
    </div>
  );
};
export default PropertyDetails;

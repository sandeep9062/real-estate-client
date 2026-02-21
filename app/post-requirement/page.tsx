
"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useForm, FieldValues, SubmitHandler } from "react-hook-form";
import axios from "axios";
import { toast } from "@/hooks/use-toast";

import {
  Envelope,
  Phone,
  MapPin,
  CurrencyDollar,
  ChatCircleDots,
  Calendar,
  User,
  House,
  CheckCircle,
  Buildings,
  Sun,
  Car,
  ArchiveBox,
  Cube,
  Lifebuoy,
  Briefcase,
  Clock,
  Megaphone,
  ShieldCheck,
  RocketLaunch,
  Lightning,
  HouseLine,
  VideoCamera,
  BatteryMedium,
  ArrowUp,
  Fire,
  ArrowRight,
  PuzzlePiece,
  Trophy,
  ShoppingBag,
  Cake,
  WifiHigh,
  Cloud,
  Users,
  PaintBrush,
  BookOpen,
  Heart,
  Gift,
  BatteryFull,
  Cpu,
  Bed,
} from "phosphor-react";
import { IoCheckmarkCircleOutline } from "react-icons/io5"; // A good checkmark
import { MdOutlineAttachMoney } from "react-icons/md"; // For loan/money

interface IEnquiryForm {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  propertyType: string;
  bedrooms?: string;
  budget: string;
  income?: string;
  purchasePurpose?: string;
  preApprovedLoan?: string;
  callbackTime?: string;
  amenities?: string[];
  carpetAreaMin?: number;
  carpetAreaMax?: number;
  timeline: string;
  message?: string;
  source?: string;
  needLoanAssistance?: boolean;
  reraOnly?: boolean;
  consentGiven: boolean;
}

const EnquiryForm2: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [issubmitting, isSetSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<IEnquiryForm>(); // Use the defined interface here

  const onSubmit: SubmitHandler<IEnquiryForm> = async (data) => {
    isSetSubmitting(true);
    try {
      toast.success("Submitting enquiry...");
      // Ensure VITE_BACKEND is correctly configured in your Next.js environment variables
      // You may need to replace import.meta.env with process.env depending on your Next.js setup
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/enquiry`, // Use Next.js Public env variable
        data
      );

      if (response.status === 201 || response.status === 200) {
        setSubmitted(true);
        reset();

        setTimeout(() => {
          setSubmitted(false);
        }, 4000);
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 409) {
        toast.error("Email or Phone already exists!");
      } else {
        console.error("Submission error:", error);
        toast.error("Something went wrong. Please try again.");
      }
    } finally {
      isSetSubmitting(false);
    }
  };

  return (
    <>
      <div className="w-full min-h-screen m-0 pb-4 bg-gray-50 flex flex-col items-center font-sans">
        {/* Banner Image */}
        <div className="w-full md:h-[600px] overflow-hidden">
          {/* Replace <img> with Next.js <Image> component for optimization in a real project */}
          <Image
            width={1000}
            height={600}
            src="/dreamhome.jpg"
            alt="Dream Home"
            className="w-full h-full object-cover object-center rounded-b-xl"
          />
        </div>

        {/* Form Container */}
        <div className="w-full px-4 md:px-8 -mt-20 relative z-10">
          <div className="w-full bg-white p-6 md:p-10 rounded-2xl shadow-2xl max-w-6xl mx-auto">
            <div className="text-center justify-center items-center mb-15">
              <h2 className="gradient-text text-xl md:text-4xl font-bold mb-2">
                Let’s Find Your Dream Home!
              </h2>
              <p className="text-gray-400 text-sm md:text-base max-w-2xl mx-auto">
                We’ll help you find the perfect property with expert support and
                handpicked listings tailored to your needs.
              </p>
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-8"
            >
              {/* Top Grid Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full Name */}
                <div>
                  <label className="block mb-1 text-blue-700 font-semibold">
                    <User className="inline mr-1 text-xl" />
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register("fullName", {
                      required: "Full name is required",
                    })}
                    placeholder="Your name"
                    className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.fullName && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.fullName.message}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block mb-1 text-blue-700 font-semibold">
                    <Envelope className="inline mr-1 text-xl" />
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^\S+@\S+$/,
                        message: "Invalid email format",
                      },
                    })}
                    placeholder="Email"
                    className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="block mb-1 text-blue-700 font-semibold">
                    <Phone className="inline mr-1 text-xl" />
                    Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register("phone", {
                      required: "Phone is required",
                      minLength: { value: 10, message: "Minimum 10 digits" },
                      maxLength: { value: 10, message: "Maximum 10 digits" },
                      pattern: {
                        value: /^[0-9]{10}$/,
                        message: "Only digits allowed",
                      },
                    })}
                    type="tel"
                    placeholder="Phone number"
                    inputMode="numeric"
                    maxLength={10}
                    onInput={(e: React.FormEvent<HTMLInputElement>) => {
                      e.currentTarget.value = e.currentTarget.value
                        .replace(/\D/g, "")
                        .slice(0, 10);
                    }}
                    className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.phone.message}
                    </p>
                  )}
                </div>

                {/* Preferred City */}
                <div>
                  <label className="block mb-1 text-blue-700 font-semibold">
                    <MapPin className="inline mr-1 text-xl" />
                    Preferred City <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register("location", {
                      required: "Location is required",
                    })}
                    className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select City</option>
                    <option>Chandigarh</option>
                    <option>New Chandigarh (Mullapur)</option>
                    <option>Panchkula</option>
                    <option>Mohali</option>
                    <option>Kharar</option>
                    <option>Zirakpur</option>
                    <option>Mumbai</option>
                    <option>Delhi</option>
                    <option>Pune</option>
                    <option>Bangalore</option>
                    <option>Hyderabad</option>
                    <option>Ahmedabad</option>
                    <option>Chennai</option>
                    <option>Kolkata</option>
                    <option>Jaipur</option>
                    <option>Lucknow</option>
                    <option>Indore</option>
                    <option>Surat</option>
                    <option>Bhopal</option>
                    <option>Noida</option>
                    <option>Gurgaon</option>
                    <option>Faridabad</option>
                    <option>Thane</option>
                  </select>
                  {errors.location && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.location.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Property Preferences */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Property Type */}
                <div>
                  <label className="block mb-1 text-blue-700 font-semibold">
                    <House className="inline mr-1 text-xl" />
                    Property Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register("propertyType", {
                      required: " Property Type is required",
                    })}
                    className="w-full p-3 border rounded-md"
                  >
                    <option value="">Select</option>

                    <option>Flat/Apartment</option>
                    <option>Independent House</option>
                    <option>Villa</option>
                    <option>Penthouse</option>
                    <option>Farmhouse</option>
                    <option>Studio</option>
                    <option>Plot/Land</option>
                  </select>
                  {errors.propertyType && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.propertyType.message}
                    </p>
                  )}
                </div>

                {/* Bedrooms */}
                <div>
                  <label className="block mb-1 text-blue-700 font-semibold">
                    <Bed className="inline mr-1 text-xl" />
                    Bedrooms
                  </label>
                  <select
                    {...register("bedrooms")}
                    className="w-full p-3 border rounded-md"
                  >
                    <option value="">Select</option>
                    <option>1 BHK</option>
                    <option>2 BHK</option>
                    <option>3 BHK</option>
                    <option>4+ BHK</option>
                  </select>
                </div>

                {/* Budget */}
                <div>
                  <label className="block mb-1 text-blue-700 font-semibold">
                    <CurrencyDollar className="inline mr-1 text-xl" />
                    Budget <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register("budget", { required: "Budget is required" })}
                    className="w-full p-3 border rounded-md"
                  >
                    <option value="">Select</option>
                    <option>Less than ₹1 Crore</option>
                    <option>₹1 Crore - ₹2 Crores</option>

                    <option>₹2 Crores - ₹5 Crores</option>
                    <option>₹5 Crores & Above</option>
                  </select>

                  {errors.budget && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.budget.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Buyer Profile */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Income */}
                <div>
                  <label className="block mb-1 text-blue-700 font-semibold">
                    <MdOutlineAttachMoney className="inline mr-1 text-xl" />
                    Annual Income
                  </label>
                  <select
                    {...register("income")}
                    className="w-full p-3 border rounded-md"
                  >
                    <option value="">Select</option>
                    <option>Below ₹5 LPA</option>
                    <option>₹5-10 LPA</option>
                    <option>₹10-20 LPA</option>
                    <option>₹20+ LPA</option>
                  </select>
                </div>

                {/* Purchase Purpose */}
                <div>
                  <label className="block mb-1 text-blue-700 font-semibold">
                    <Briefcase className="inline mr-1 text-xl" />
                    Purpose of Purchase
                  </label>
                  <select
                    {...register("purchasePurpose")}
                    className="w-full p-3 border rounded-md"
                  >
                    <option value="">Select</option>
                    <option>Self-Use</option>
                    <option>Investment</option>
                    <option>For Parents</option>
                    <option>Gift</option>
                  </select>
                </div>

                {/* Loan */}
                <div>
                  <label className="block mb-1 text-blue-700 font-semibold">
                    <ShieldCheck className="inline mr-1 text-xl" />
                    Pre-approved Loan?
                  </label>
                  <select
                    {...register("preApprovedLoan")}
                    className="w-full p-3 border rounded-md"
                  >
                    <option value="">Select</option>

                    <option>Yes - with Bank</option>
                    <option>Yes - with NBFC</option>
                    <option>No</option>
                    <option>Need Help</option>
                  </select>
                </div>

                {/* Callback */}
                <div>
                  <label className="block mb-1 text-blue-700 font-semibold">
                    <Clock className="inline mr-1 text-xl" />
                    Preferred Callback Time
                  </label>
                  <select
                    {...register("callbackTime")}
                    className="w-full p-3 border rounded-md"
                  >
                    <option value="">Anytime</option>
                    <option>Morning</option>
                    <option>Afternoon</option>
                    <option>Evening</option>
                  </select>
                </div>
              </div>

              {/* Amenities */}
              <div>
                <p className="text-blue-700 font-semibold mb-2">
                  {" "}
                  What amenities do you dream of?
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                  {[
                    {
                      label: "Garden",
                      icon: <Sun className="text-green-600 text-3xl" />,
                    },
                    {
                      label: "Balcony",
                      icon: <ArchiveBox className="text-orange-600 text-3xl" />,
                    },
                    {
                      label: "Parking",
                      icon: <Car className="text-slate-600 text-3xl" />,
                    },
                    {
                      label: "Swimming Pool",
                      icon: <Lifebuoy className="text-blue-400 text-3xl" />,
                    },
                    {
                      label: "Kids Play Area",
                      icon: <RocketLaunch className="text-lime-400 text-3xl" />,
                    },

                    {
                      label: "Gym / Fitness Center",
                      icon: <Lightning className="text-red-500 text-3xl" />,
                    },
                    {
                      label: "Clubhouse",
                      icon: <HouseLine className="text-indigo-600 text-3xl" />,
                    },
                    {
                      label: "24/7 Security",
                      icon: <ShieldCheck className="text-teal-600 text-3xl" />,
                    },
                    {
                      label: "CCTV Surveillance",
                      icon: <VideoCamera className="text-gray-700 text-3xl" />,
                    },
                    {
                      label: "Power Backup",
                      icon: (
                        <BatteryMedium className="text-yellow-500 text-3xl" />
                      ),
                    },

                    {
                      label: "Lift / Elevator",
                      icon: <ArrowUp className="text-purple-600 text-3xl" />,
                    },
                    {
                      label: "Fire Safety",
                      icon: <Fire className="text-red-600 text-3xl" />,
                    },
                    {
                      label: "Community Hall",
                      icon: <Buildings className="text-blue-700 text-3xl" />,
                    },
                    {
                      label: "Jogging Track",
                      icon: <ArrowRight className="text-orange-500 text-3xl" />,
                    },
                    {
                      label: "Indoor Games",
                      icon: <PuzzlePiece className="text-rose-600 text-3xl" />,
                    },

                    {
                      label: "Outdoor Sports Area",
                      icon: <Trophy className="text-yellow-600 text-3xl" />,
                    },
                    {
                      label: "Shopping Center",
                      icon: (
                        <ShoppingBag className="text-violet-600 text-3xl" />
                      ),
                    },
                    {
                      label: "Restaurant / Cafe",
                      icon: <Cake className="text-pink-600 text-3xl" />,
                    },
                    {
                      label: "Pet Friendly",
                      icon: <Heart className="text-brown-600 text-3xl" />,
                    },
                    {
                      label: "Wi-Fi / Internet",
                      icon: <WifiHigh className="text-blue-500 text-3xl" />,
                    },

                    {
                      label: "Water Supply 24x7",
                      icon: <Cloud className="text-cyan-600 text-3xl" />,
                    },
                    {
                      label: "Rainwater Harvesting",
                      icon: <Cloud className="text-sky-500 text-3xl" />,
                    },
                    {
                      label: "Solar Panels",
                      icon: <Sun className="text-yellow-400 text-3xl" />,
                    },
                    {
                      label: "Visitor Parking",
                      icon: <Users className="text-gray-800 text-3xl" />,
                    },
                    {
                      label: "Laundry Room",
                      icon: <PaintBrush className="text-blue-800 text-3xl" />,
                    },

                    {
                      label: "Library",
                      icon: <BookOpen className="text-indigo-700 text-3xl" />,
                    },
                    {
                      label: "Medical Facility",
                      icon: <Heart className="text-red-700 text-3xl" />,
                    },
                    {
                      label: "Party Lawn",
                      icon: <Gift className="text-green-700 text-3xl" />,
                    },
                    {
                      label: "EV Charging Station",
                      icon: <BatteryFull className="text-green-500 text-3xl" />,
                    },
                    {
                      label: "Smart Home Features",
                      icon: <Cpu className="text-blue-700 text-3xl" />,
                    },
                  ].map((item) => (
                    <label
                      key={item.label}
                      className="flex items-center gap-2 text-sm"
                    >
                      <input
                        type="checkbox"
                        {...register("amenities")}
                        value={item.label}
                        className="accent-green-600"
                      />
                      {item.icon}
                      {item.label}
                    </label>
                  ))}
                </div>
              </div>

              <div className="md:col-span-2">
                <p className="text-blue-700 font-semibold mb-2">
                  Carpet Area Preference (in sq.ft)
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="number"
                    {...register("carpetAreaMin", { valueAsNumber: true })}
                    placeholder="Min Carpet Area"
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="number"
                    {...register("carpetAreaMax", { valueAsNumber: true })}
                    placeholder="Max Carpet Area"
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Timeline */}
              <div>
                <label className="text-blue-700 font-semibold block mb-2">
                  <Calendar className="inline mr-1 text-xl" />
                  Planning to Buy <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-wrap gap-4">
                  {["Within 1 Month", "Within 3 Months", "After 3 Months"].map(
                    (t) => (
                      <label
                        key={t}
                        className="flex items-center gap-2 text-sm"
                      >
                        <input
                          type="radio"
                          className="accent-green-600"
                          value={t}
                          required
                          {...register("timeline", {
                            required: "Timeline is required",
                          })}
                        />
                        {t}
                      </label>
                    )
                  )}
                </div>
                {errors.timeline && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.timeline.message}
                  </p>
                )}
              </div>

              {/* Message & Source */}
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <label className="text-blue-700 font-semibold block mb-1">
                    <ChatCircleDots className="inline mr-1 text-xl" />
                    Additional Info
                  </label>
                  <textarea
                    {...register("message")}
                    rows={4}
                    className="w-full p-3 border rounded-md"
                    placeholder="Tell us more about your dream home..."
                  />
                </div>
                <div>
                  <label className="text-blue-700 font-semibold block mb-1">
                    <Megaphone className="inline mr-1 text-xl" />
                    How did you hear about us?
                  </label>
                  <select
                    {...register("source")}
                    className="w-full p-3 border rounded-md"
                  >
                    <option value="">Select</option>
                    <option>Google</option>
                    <option>Instagram</option>
                    <option>LinkedIn</option>
                    <option>Friend</option>
                    <option>Ad</option>
                  </select>
                </div>
              </div>

              {/* Consent */}
              <div className="flex flex-col items-start gap-2 text-sm text-gray-600">
                <label className="flex items-center gap-2 text-sm text-gray-600">
                  <input
                    type="checkbox"
                    {...register("needLoanAssistance")}
                    className="accent-green-600"
                  />
                  I’d like help with home loan options and eligibility.
                </label>

                <label className="flex items-center gap-2 text-sm text-gray-600">
                  <input
                    type="checkbox"
                    {...register("reraOnly")}
                    className="accent-green-600"
                  />
                  I only want to see RERA-registered properties.
                </label>

                <label className="flex items-center gap-2 text-sm text-gray-600">
                  <input
                    type="checkbox"
                    defaultChecked
                    {...register("consentGiven", {
                      required: "You must agree to the terms to submit.",
                    })}
                    className="accent-green-600"
                  />
                  By submitting your details, you agree to be contacted via
                  call, SMS, WhatsApp, or email by PoPT and its partners
                  regarding your enquiry.
                </label>
                {errors.consentGiven && (
                  <p className="text-red-500 text-sm">
                    {errors.consentGiven.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={issubmitting}
                className={`w-full ${
                  issubmitting
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                } text-white py-3 rounded-md text-lg font-medium transition`}
              >
                {issubmitting ? "Submitting..." : "Submit Enquiry"}
              </button>
            </form>

            {/* Success Modal */}
            {submitted && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-75">
                <div className="bg-white rounded-2xl p-8 shadow-2xl text-center max-w-md mx-4 animate-fade-in">
                  <IoCheckmarkCircleOutline className="text-green-500 text-6xl mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-gray-800">
                    Enquiry Submitted!
                  </h3>
                  <p className="text-gray-600 mt-3">
                    Thank you for your interest in your dream home.
                    <br />
                    Our team will reach out to you shortly.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default EnquiryForm2;

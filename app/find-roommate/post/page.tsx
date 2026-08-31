"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Home,
  UserPlus,
  CheckCircle,
  Upload,
  Plus,
} from "lucide-react";

function PostFormContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Initialize baseline intent selection checking url context parameters
  const initialType =
    searchParams.get("type") === "need-room" ? "NEED_ROOM" : "HAVE_ROOM";

  const [step, setStep] = useState(1);
  const [listingType, setListingType] = useState<"HAVE_ROOM" | "NEED_ROOM">(
    initialType,
  );

  // Shared Form Object Lifecycle State
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    profession: "",
    location: "",
    budget: "",
    moveInDate: "",
    vegPreferred: "Any",
    smokeAllowed: "No",
    roomRentDetails: "",
    bedroomsCount: "1",
    flatImages: [] as string[],
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Bhai, yahan aapki dynamic Axios / Fetch MERN backend endpoint payload trigger pass hogi:
    // console.log("Submitting Polymorphic Schema Payload to API Nodes: ", { type: listingType, ...formData });
    setStep(3); // Route to Success state confirmation overlay
  };

  return (
    <main className="w-full min-h-screen bg-[#F8FAFC] py-8">
      <div className="max-w-xl mx-auto px-4">
        {/* Progress Tracker Strip */}
        <div className="flex items-center justify-between mb-6 text-xs font-bold text-slate-400">
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-1 hover:text-slate-700"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back
          </button>
          <span>Step {step} of 3</span>
        </div>

        {step === 1 && (
          <div className="bg-white rounded-2xl border p-6 space-y-5 shadow-xs">
            <div>
              <h1 className="text-lg font-black text-[#0F172A]">
                Choose Your Flatmate Goal
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Select the choice matching your housing setup
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <button
                type="button"
                onClick={() => {
                  setListingType("HAVE_ROOM");
                  setStep(2);
                }}
                className={`p-4 rounded-xl border-2 text-left flex items-start gap-4 transition-all ${listingType === "HAVE_ROOM" ? "border-[#4161DF] bg-blue-50/20" : "border-slate-100"}`}
              >
                <div className="p-2.5 bg-blue-50 text-[#4161DF] rounded-xl">
                  <Home className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs+ font-bold text-[#0F172A]">
                    I Have a Room / Flat
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Looking for a matching roommate to share rent costs
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setListingType("NEED_ROOM");
                  setStep(2);
                }}
                className={`p-4 rounded-xl border-2 text-left flex items-start gap-4 transition-all ${listingType === "NEED_ROOM" ? "border-[#4161DF] bg-blue-50/20" : "border-slate-100"}`}
              >
                <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs+ font-bold text-[#0F172A]">
                    I Need a Room / Flat Share
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Have no property currently, looking to find active vacancies
                  </p>
                </div>
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl border p-6 space-y-4 shadow-xs"
          >
            <div>
              <h2 className="text-base font-black text-[#0F172A]">
                {listingType === "HAVE_ROOM"
                  ? "📄 Property & Profile Details"
                  : "📄 Core Profile Preferences"}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Fill out parameters to maintain verified system tracking
              </p>
            </div>

            {/* Shared Input Clusters */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">
                  Your Name
                </label>
                <input
                  required
                  type="text"
                  placeholder="Sandeep Saini"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border rounded-xl text-xs focus:outline-none focus:border-[#4161DF] text-slate-900"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">
                  Age
                </label>
                <input
                  required
                  type="number"
                  placeholder="25"
                  value={formData.age}
                  onChange={(e) => handleInputChange("age", e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border rounded-xl text-xs focus:outline-none focus:border-[#4161DF] text-slate-900"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">
                Profession
              </label>
              <input
                required
                type="text"
                placeholder="Software Engineer"
                value={formData.profession}
                onChange={(e) =>
                  handleInputChange("profession", e.target.value)
                }
                className="w-full p-2.5 bg-slate-50 border rounded-xl text-xs focus:outline-none focus:border-[#4161DF] text-slate-900"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">
                  Target Sector / Location
                </label>
                <input
                  required
                  type="text"
                  placeholder="Sector 66, Mohali"
                  value={formData.location}
                  onChange={(e) =>
                    handleInputChange("location", e.target.value)
                  }
                  className="w-full p-2.5 bg-slate-50 border rounded-xl text-xs focus:outline-none focus:border-[#4161DF] text-slate-900"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">
                  {listingType === "HAVE_ROOM"
                    ? "Expected Monthly Rent"
                    : "Max Budget Limit"}
                </label>
                <input
                  required
                  type="text"
                  placeholder="₹8,000"
                  value={formData.budget}
                  onChange={(e) => handleInputChange("budget", e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border rounded-xl text-xs focus:outline-none focus:border-[#4161DF] text-slate-900"
                />
              </div>
            </div>

            {/* Conditional Fields Block: Populated if User has a Room */}
            {listingType === "HAVE_ROOM" && (
              <div className="space-y-3 pt-2 border-t border-dashed">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">
                    Specific Room/Flat Details
                  </label>
                  <textarea
                    required
                    placeholder="Explain flat setup details (e.g., AC available, independent bathroom, semi-furnished kitchen)..."
                    value={formData.roomRentDetails}
                    onChange={(e) =>
                      handleInputChange("roomRentDetails", e.target.value)
                    }
                    className="w-full p-2.5 bg-slate-50 border rounded-xl text-xs focus:outline-none focus:border-[#4161DF] h-16 text-slate-900"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">
                    Upload Flat Visuals
                  </label>
                  <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center cursor-pointer hover:bg-slate-50 transition-all flex flex-col items-center justify-center text-slate-400">
                    <Upload className="w-5 h-5 mb-1 text-[#4161DF]" />
                    <span className="text-[10px] font-bold">
                      Drop rooms images here or click to open local drive
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-2 pt-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-1/3 py-2.5 border rounded-xl text-xs font-bold text-slate-500 bg-white"
              >
                Back
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 bg-[#4161DF] hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm shadow-blue-100"
              >
                Publish Form Allocation
              </button>
            </div>
          </form>
        )}

        {step === 3 && (
          <div className="bg-white rounded-2xl border p-8 text-center space-y-4 shadow-xs">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-black text-[#0F172A]">
                Listing Published Successfully!
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                PropertyBulbul real-time algorithms are scanning matching
                roommates in the Tricity pipeline grid area.
              </p>
            </div>
            <button
              onClick={() =>
                router.push(
                  `/find-roommate?view=${listingType === "HAVE_ROOM" ? "have-room" : "need-room"}`,
                )
              }
              className="w-full py-2 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl transition-all"
            >
              Return to Marketplace Hub
            </button>
          </div>
        )}
      </div>
    </main>
  );
}

export default function PostRoommateListingPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-xs font-bold text-slate-400">
          Loading Wizard Core...
        </div>
      }
    >
      <PostFormContent />
    </Suspense>
  );
}

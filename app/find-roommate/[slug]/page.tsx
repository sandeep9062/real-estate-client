"use client";

import React from "react";
import {
  ArrowLeft,
  CheckCircle2,
  MessageSquare,
  Briefcase,
  MapPin,
  Calendar,
  User,
  Compass,
} from "lucide-react";

export default function RoommateDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  // Production integration loop: Fetch backend details dynamically via hooks based on params.slug.
  // Fallback structural mock injection:
  const profile = {
    name: "Ananya Sharma",
    age: 24,
    type: "NEED_ROOM",
    profession: "UI/UX Designer at TechHub",
    location: "Aerocity, Sector 66, Mohali",
    budget: "₹8,500/month",
    moveInDate: "Immediate",
    isOnline: true,
    isVerified: true,
    about:
      "Hey! I'm Ananya, a working professional moving near Mohali's IT corridor. I love keeping my workspace tidy and prefer mutual respect for personal space. Looking to split a verified 2BHK builder floor directly with direct owners without brokerage loops.",
    preferences: [
      { label: "Diet", value: "Vegetarian / Vegan Preferred" },
      { label: "Smoking", value: "Strictly No-Smoking" },
      { label: "Pets", value: "No Pets" },
      { label: "Lifestyle", value: "Early Riser Routine" },
    ],
    tags: ["Clean", "Easygoing", "Working Prof"],
  };

  return (
    <main className="w-full min-h-screen bg-[#F8FAFC] pb-28">
      <nav className="w-full bg-white border-b border-slate-100 sticky top-0 z-30 px-4 py-3">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <button
            onClick={() => window.history.back()}
            className="p-2 bg-slate-50 rounded-full border text-slate-700"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Roommate Portfolio
          </span>
          <div className="w-8 h-8 opacity-0" />
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 mt-6 space-y-4">
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs flex flex-col sm:flex-row items-center gap-5">
          <div className="w-20 h-20 rounded-full ring-4 ring-blue-50 relative shrink-0">
            <img
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&q=80"
              alt={profile.name}
              className="w-full h-full object-cover rounded-full"
            />
            <span
              className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${profile.isOnline ? "bg-emerald-500" : "bg-slate-400"}`}
            />
          </div>

          <div className="space-y-2 flex-1 w-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 justify-center sm:justify-start">
                <h1 className="text-lg font-black text-[#0F172A]">
                  {profile.name}, {profile.age}
                </h1>
                {profile.isVerified && (
                  <CheckCircle2 className="w-4 h-4 text-[#4161DF] fill-[#4161DF] stroke-white" />
                )}
              </div>
              <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-lg self-center">
                {profile.budget}
              </span>
            </div>
            <div className="text-slate-500 text-xs space-y-1 text-left">
              <p className="flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5" />
                {profile.profession}
              </p>
              <p className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#4161DF]" />
                {profile.location}
              </p>
            </div>
          </div>
        </div>

        {/* About Module */}
        <div className="bg-white rounded-2xl border p-5 space-y-2">
          <h2 className="text-xs uppercase font-black text-slate-400 tracking-wider flex items-center gap-1.5">
            <User className="w-3.5 h-3.5" /> About Myself
          </h2>
          <p className="text-xs+ text-slate-600 leading-relaxed font-medium">
            {profile.about}
          </p>
        </div>

        {/* Preferences Grid */}
        <div className="bg-white rounded-2xl border p-5 space-y-3">
          <h2 className="text-xs uppercase font-black text-slate-400 tracking-wider flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5" /> Preferences
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {profile.preferences.map((pref, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-2.5 bg-[#F8FAFC] border rounded-xl text-xs"
              >
                <span className="font-bold text-slate-400">{pref.label}</span>
                <span className="font-extrabold text-[#0F172A]">
                  {pref.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Persistent CTA Button Footer Layer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 shadow-lg z-40">
        <div className="max-w-3xl mx-auto">
          <button className="w-full py-3 bg-[#4161DF] hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2">
            <MessageSquare className="w-4 h-4" /> Connect & Chat Instantly
          </button>
        </div>
      </div>
    </main>
  );
}

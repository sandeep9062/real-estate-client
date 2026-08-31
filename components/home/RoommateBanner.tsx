"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Home, UserPlus, ArrowRight, Sparkles } from "lucide-react";

export default function RoommateBanner() {
  const router = useRouter();

  const handleRedirect = (intent: "have-room" | "need-room") => {
    // Carries exact intent to trigger automatic focused tab alignment on destination page
    router.push(`/find-roommate?view=${intent}`);
  };

  return (
    <section className="w-full py-8 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Immersive Container Box */}
        <div className="bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-[0_12px_30px_-10px_rgba(15,23,42,0.3)]">
          
          {/* Subtle Background Abstract Ambient Light */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#4161DF]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/4 w-48 h-48 bg-blue-500/5 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            
            {/* Left Column: Context Branding Headers */}
            <div className="lg:col-span-5 space-y-2 text-center lg:text-left">
              <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-blue-500/10 border border-blue-400/20 text-blue-400 text-[10px] font-black uppercase tracking-wider">
                <Sparkles className="w-3 h-3 text-amber-400 animate-pulse" /> Flatmate Hub
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-tight">
                Looking for a Roommate <br className="hidden sm:inline" />or a Flat Share?
              </h2>
              <p className="text-xs text-slate-400 max-w-sm mx-auto lg:mx-0 leading-relaxed font-medium">
                Connect instantly with verified professionals and students across Chandigarh Tricity. Zero brokers, direct connections.
              </p>
            </div>

            {/* Right Column: Dynamic Intent Splitting Cards Grid */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3.5 w-full">
              
              {/* Option A: Has Room Setup */}
              <div
                onClick={() => handleRedirect("have-room")}
                className="group bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 hover:border-blue-500/30 rounded-xl p-4 transition-all duration-300 cursor-pointer flex flex-col justify-between relative backdrop-blur-xs active:scale-[0.99]"
              >
                <div className="space-y-3">
                  <div className="p-2.5 bg-blue-500/10 text-[#4161DF] rounded-xl w-fit group-hover:scale-105 transition-transform duration-300">
                    <Home className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">
                      I Have a Room / Flat
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-1 leading-normal font-medium">
                      List your available room vacancy to find compatible peers and split monthly rent costs easily.
                    </p>
                  </div>
                </div>
                
                <div className="mt-4 pt-2 flex items-center gap-1 text-[11px] font-black text-blue-400">
                  <span>Find a Flatmate</span>
                  <ArrowRight className="w-3.5 h-3.5 transform transition-transform duration-300 group-hover:translate-x-1" />
                </div>
              </div>

              {/* Option B: Needs Room Setup */}
              <div
                onClick={() => handleRedirect("need-room")}
                className="group bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 hover:border-purple-500/30 rounded-xl p-4 transition-all duration-300 cursor-pointer flex flex-col justify-between relative backdrop-blur-xs active:scale-[0.99]"
              >
                <div className="space-y-3">
                  <div className="p-2.5 bg-purple-500/10 text-purple-400 rounded-xl w-fit group-hover:scale-105 transition-transform duration-300">
                    <UserPlus className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white group-hover:text-purple-400 transition-colors">
                      I Need a Room / Share
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-1 leading-normal font-medium">
                      Post your lifestyle persona and budget preferences directly to get discovered by landlords or room owners.
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-2 flex items-center gap-1 text-[11px] font-black text-purple-400">
                  <span>Explore Rooms</span>
                  <ArrowRight className="w-3.5 h-3.5 transform transition-transform duration-300 group-hover:translate-x-1" />
                </div>
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
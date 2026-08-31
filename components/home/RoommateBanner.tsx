"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Home, UserPlus, ArrowUpRight } from "lucide-react";

// Fonts: Space Grotesk (display) + IBM Plex Sans (body).
// In the app shell, load both with next/font/google and swap the
// font-display / font-body classes below for your font variables.

export default function RoommateBanner() {
  const router = useRouter();

  const handleRedirect = (intent: "have-room" | "need-room") => {
    router.push(`/find-roommate?view=${intent}`);
  };

  return (
    <section className="w-full py-14 sm:py-16 bg-[#F6F3EC]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=IBM+Plex+Sans:wght@400;500;600&display=swap');
        .font-display { font-family: 'Space Grotesk', ui-sans-serif, system-ui, sans-serif; }
        .font-body { font-family: 'IBM Plex Sans', ui-sans-serif, system-ui, sans-serif; }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-md bg-gradient-to-br from-[#182739] via-[#152233] to-[#101B29] p-6 sm:p-10 lg:p-12 shadow-[0_18px_40px_-14px_rgba(14,26,41,0.45)]">
          {/* Drafting grid backdrop */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.14]"
            style={{
              backgroundImage:
                "linear-gradient(to right, #E7E2D3 1px, transparent 1px), linear-gradient(to bottom, #E7E2D3 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />

          {/* Corner registration marks, matches app-download panel */}
          {[
            "top-4 left-4 border-t border-l",
            "top-4 right-4 border-t border-r",
            "bottom-4 left-4 border-b border-l",
            "bottom-4 right-4 border-b border-r",
          ].map((pos, i) => (
            <div
              key={i}
              className={`hidden sm:block absolute w-4 h-4 border-[#F4F1E8]/25 ${pos}`}
            />
          ))}

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-center">
            {/* LEFT: heading */}
            <div className="lg:col-span-5">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-6 h-px bg-[#C1602E]/80" />
                <span className="font-body text-[11px] tracking-wide text-[#C1602E] font-medium">
                  Tricity flatshares
                </span>
              </div>

              <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#F4F1E8] leading-[1.15] tracking-tight">
                Room to share, or a room to find?
              </h2>

              <p className="font-body text-sm text-[#9FB2C7] leading-relaxed mt-4 max-w-sm">
                Match directly with verified professionals and students across
                Chandigarh, Mohali and Panchkula. No brokers, no fees — just
                people looking for the same thing you are.
              </p>
            </div>

            {/* RIGHT: two plan cards */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
              {/* Option A: has a room */}
              <button
                onClick={() => handleRedirect("have-room")}
                className="group relative text-left bg-[#F4F1E8]/[0.04] hover:bg-[#F4F1E8]/[0.07] border border-[#F4F1E8]/10 hover:border-[#C1602E]/50 rounded-sm p-5 pl-6 transition-colors duration-200 flex flex-col justify-between"
              >
                <span className="absolute left-0 top-5 bottom-5 w-[3px] bg-[#C1602E]" />

                <div className="space-y-3.5">
                  <Home className="w-5 h-5 text-[#C1602E]" strokeWidth={1.75} />
                  <div>
                    <h3 className="font-display text-[15px] font-semibold text-[#F4F1E8]">
                      I have a room
                    </h3>
                    <p className="font-body text-[12.5px] text-[#93A6BB] mt-1.5 leading-relaxed">
                      List your vacancy and split rent with someone who fits
                      your household.
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex items-center gap-1.5 font-body text-[12px] font-medium text-[#C1602E]">
                  <span>List the room</span>
                  <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </button>

              {/* Option B: needs a room */}
              <button
                onClick={() => handleRedirect("need-room")}
                className="group relative text-left bg-[#F4F1E8]/[0.04] hover:bg-[#F4F1E8]/[0.07] border border-[#F4F1E8]/10 hover:border-[#7B9E8C]/50 rounded-sm p-5 pl-6 transition-colors duration-200 flex flex-col justify-between"
              >
                <span className="absolute left-0 top-5 bottom-5 w-[3px] bg-[#7B9E8C]" />

                <div className="space-y-3.5">
                  <UserPlus
                    className="w-5 h-5 text-[#7B9E8C]"
                    strokeWidth={1.75}
                  />
                  <div>
                    <h3 className="font-display text-[15px] font-semibold text-[#F4F1E8]">
                      I need a room
                    </h3>
                    <p className="font-body text-[12.5px] text-[#93A6BB] mt-1.5 leading-relaxed">
                      Share your budget and lifestyle so owners and flatmates
                      can find you.
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex items-center gap-1.5 font-body text-[12px] font-medium text-[#7B9E8C]">
                  <span>Browse rooms</span>
                  <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

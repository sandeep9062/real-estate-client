"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Star } from "lucide-react";

// Fonts: Space Grotesk (display) + IBM Plex Sans (body), loaded the same
// way as RoommateBanner — swap in next/font variables in the app shell.

export default function AppDownloadBanner() {
  const handleStoreRedirect = (platform: "android" | "ios") => {
    window.open(
      platform === "android"
        ? "https://play.google.com/store"
        : "https://www.apple.com/app-store",
      "_blank",
    );
  };

  const stats = [
    { val: "50K+", label: "Downloads" },
    { val: "4.8", label: "Rating", star: true },
    { val: "2K+", label: "Listings" },
  ];

  const cities = [
    { name: "Chandigarh", swatch: "#C1602E" },
    { name: "Mohali", swatch: "#D9A02D" },
    { name: "Panchkula", swatch: "#7B9E8C" },
  ];

  return (
    <section className="w-full py-14 sm:py-16 md:py-20 bg-[#F6F3EC]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=IBM+Plex+Sans:wght@400;500;600&display=swap');
        .font-display { font-family: 'Space Grotesk', ui-sans-serif, system-ui, sans-serif; }
        .font-body { font-family: 'IBM Plex Sans', ui-sans-serif, system-ui, sans-serif; }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="relative overflow-hidden rounded-md bg-gradient-to-br from-[#182739] via-[#152233] to-[#101B29] p-6 sm:p-10 lg:p-14 shadow-[0_18px_40px_-14px_rgba(14,26,41,0.45)]"
        >
          {/* Drafting grid backdrop, shared with the roommate panel */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.14]"
            style={{
              backgroundImage:
                "linear-gradient(to right, #E7E2D3 1px, transparent 1px), linear-gradient(to bottom, #E7E2D3 1px, transparent 1px)",
              backgroundSize: "44px 44px",
            }}
          />

          {/* Corner registration marks */}
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

          {/* Reference stamp */}
          <div className="absolute top-3 right-8 sm:top-6 sm:right-10 -rotate-6 border-2 border-[#C1602E]/70 rounded-sm px-2.5 py-1">
            <span className="font-display text-[10px] tracking-[0.06em] text-[#C1602E] font-semibold">
              Live · rev 2.0
            </span>
          </div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
            {/* LEFT: content */}
            <div className="lg:col-span-5">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-6 h-px bg-[#C1602E]/80" />
                <span className="font-body text-[11px] tracking-wide text-[#C1602E] font-medium">
                  PropertyBulbul mobile
                </span>
              </div>

              <h2 className="font-display text-3xl sm:text-4xl lg:text-[2.6rem] font-semibold text-[#F4F1E8] leading-[1.1] tracking-tight">
                Every sector.
                <br />
                Every street.
                <br />
                Now on your phone.
              </h2>

              <p className="font-body text-sm sm:text-[15px] text-[#9FB2C7] leading-relaxed mt-4 max-w-sm">
                Search verified flats and PGs across Chandigarh, Mohali and
                Panchkula, message owners directly, and get notified the moment
                a new listing lands near you.
              </p>

              <div className="flex items-stretch gap-6 sm:gap-8 mt-8">
                {stats.map((s, i) => (
                  <div
                    key={i}
                    className={`pl-6 first:pl-0 ${
                      i > 0 ? "border-l border-[#F4F1E8]/15" : ""
                    }`}
                  >
                    <div className="font-display flex items-center gap-1 text-xl sm:text-2xl font-semibold text-[#F4F1E8]">
                      {s.val}
                      {s.star && (
                        <Star className="w-3.5 h-3.5 text-[#D9A02D] fill-[#D9A02D] mb-0.5" />
                      )}
                    </div>
                    <div className="font-body text-[11px] text-[#7C93A8] mt-0.5">
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2 mt-7 font-body text-[11px] text-[#7C93A8]">
                <ShieldCheck
                  className="w-3.5 h-3.5 text-[#7B9E8C]"
                  strokeWidth={1.75}
                />
                Verified secure download, zero spam
              </div>
            </div>

            {/* CENTER: blueprint phone diagram */}
            <div className="hidden lg:flex lg:col-span-3 items-center justify-center relative">
              <svg
                width="192"
                height="330"
                viewBox="0 0 192 330"
                fill="none"
                className="overflow-visible"
              >
                <rect
                  x="26"
                  y="10"
                  width="120"
                  height="270"
                  rx="16"
                  stroke="#F4F1E8"
                  strokeOpacity="0.5"
                  strokeWidth="1.5"
                />
                <rect
                  x="38"
                  y="30"
                  width="96"
                  height="200"
                  stroke="#F4F1E8"
                  strokeOpacity="0.22"
                  strokeWidth="1"
                  strokeDasharray="2 3"
                />
                {[52, 84, 116, 148].map((y, i) => (
                  <rect
                    key={i}
                    x="46"
                    y={y}
                    width="80"
                    height="20"
                    stroke={i === 1 ? "#C1602E" : "#F4F1E8"}
                    strokeOpacity={i === 1 ? "0.9" : "0.28"}
                    strokeWidth="1"
                  />
                ))}
                <line
                  x1="70"
                  y1="256"
                  x2="102"
                  y2="256"
                  stroke="#F4F1E8"
                  strokeOpacity="0.35"
                  strokeWidth="2"
                  strokeLinecap="round"
                />

                <line
                  x1="26"
                  y1="300"
                  x2="146"
                  y2="300"
                  stroke="#F4F1E8"
                  strokeOpacity="0.3"
                  strokeWidth="1"
                />
                <line
                  x1="26"
                  y1="295"
                  x2="26"
                  y2="305"
                  stroke="#F4F1E8"
                  strokeOpacity="0.3"
                  strokeWidth="1"
                />
                <line
                  x1="146"
                  y1="295"
                  x2="146"
                  y2="305"
                  stroke="#F4F1E8"
                  strokeOpacity="0.3"
                  strokeWidth="1"
                />
                <text
                  x="86"
                  y="317"
                  textAnchor="middle"
                  className="font-body"
                  fontSize="8.5"
                  fill="#7C93A8"
                >
                  iOS &amp; Android
                </text>

                <line
                  x1="126"
                  y1="94"
                  x2="172"
                  y2="60"
                  stroke="#C1602E"
                  strokeOpacity="0.8"
                  strokeWidth="1"
                />
                <circle cx="172" cy="60" r="2" fill="#C1602E" />
              </svg>

              <div className="absolute top-[42px] left-[178px] w-[130px]">
                <div className="font-display text-[11px] font-semibold text-[#F4F1E8]">
                  Sector 21 · 3BHK
                </div>
                <div className="font-body text-[10px] text-[#9FB2C7]">
                  ₹22,000/mo · Verified
                </div>
              </div>
            </div>

            {/* RIGHT: store CTAs + city legend */}
            <div className="lg:col-span-4 flex flex-col gap-3 items-stretch lg:items-end">
              <button
                onClick={() => handleStoreRedirect("android")}
                className="group flex items-center gap-4 rounded-sm bg-[#F4F1E8] px-5 py-3.5 transition-colors duration-200 hover:bg-white w-full lg:w-auto lg:min-w-[230px]"
              >
                <svg
                  className="w-7 h-7 shrink-0"
                  viewBox="0 0 32 32"
                  fill="none"
                >
                  <path d="M5 7.2l12.2 8.8L5 24.8V7.2z" fill="#4ADE80" />
                  <path d="M5 7.2l6.8 6.8-6.8 6.8V7.2z" fill="#16A34A" />
                  <path
                    d="M5 24.8l12.2-8.8 4 2.9L8.2 26.8A2.5 2.5 0 015 24.8z"
                    fill="#D9A02D"
                  />
                  <path d="M5 7.2l12 6.8-3.8 2.8L5 8.8V7.2z" fill="#C1602E" />
                  <path
                    d="M17.2 16l4-2.8 1.5.9a2.4 2.4 0 010 3.8l-1.5.9-4-2.8z"
                    fill="#14304A"
                  />
                </svg>
                <div className="text-left flex-1">
                  <div className="font-body text-[9px] font-medium text-[#0E2438]/60">
                    Get it on
                  </div>
                  <div className="font-display text-[15px] font-semibold text-[#0E2438]">
                    Google Play
                  </div>
                </div>
              </button>

              <button
                onClick={() => handleStoreRedirect("ios")}
                className="group flex items-center gap-4 rounded-sm border border-[#F4F1E8]/30 hover:border-[#F4F1E8]/55 px-5 py-3.5 transition-colors duration-200 w-full lg:w-auto lg:min-w-[230px]"
              >
                <svg
                  className="w-7 h-7 shrink-0"
                  viewBox="0 0 32 32"
                  fill="none"
                >
                  <path
                    d="M21 9.5c1.1-1.4 1-3.3 1-3.3s-1.9.2-3 1.4c-1.1 1.2-1.2 3-1.2 3s1.9.1 3.2-1.1z"
                    fill="#F4F1E8"
                  />
                  <path
                    d="M24.3 20.5c-.5 1.1-.7 1.6-1.3 2.6-.9 1.4-2.1 3-3.7 3-1.3 0-1.7-.8-3.5-.8s-2.3.8-3.6.8c-1.5 0-2.7-1.6-3.6-3C6 20 5.4 15.7 7.3 13c1.2-1.7 3.1-2.7 4.9-2.7 1.8 0 3 .8 4.5.8 1.4 0 2.3-.9 4.5-.9 1.6 0 3.3.9 4.5 2.3-.1 0-2.5 1.4-3 4z"
                    fill="#F4F1E8"
                  />
                </svg>
                <div className="text-left flex-1">
                  <div className="font-body text-[9px] font-medium text-[#F4F1E8]/50">
                    Download on the
                  </div>
                  <div className="font-display text-[15px] font-semibold text-[#F4F1E8]">
                    App Store
                  </div>
                </div>
              </button>

              <div className="flex flex-wrap gap-x-5 gap-y-2 justify-start lg:justify-end pt-3">
                {cities.map((city) => (
                  <span
                    key={city.name}
                    className="flex items-center gap-1.5 font-body text-[11px] text-[#9FB2C7]"
                  >
                    <span
                      className="w-2 h-2"
                      style={{ backgroundColor: city.swatch }}
                    />
                    {city.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

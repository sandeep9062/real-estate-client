"use client";

import React from "react";
import {
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  Star,
  Users,
  Home,
  MapPin,
} from "lucide-react";

export default function AppDownloadBanner() {
  const handleStoreRedirect = (platform: "android" | "ios") => {
    if (platform === "android") {
      window.open("https://play.google.com/store", "_blank");
    } else {
      window.open("https://www.apple.com/app-store", "_blank");
    }
  };

  return (
    <section
      className="w-full py-10 px-4 sm:px-6 lg:px-8"
      style={{
        background:
          "linear-gradient(135deg, #EEF0FB 0%, #F3F0FA 40%, #EAF0FD 100%)",
      }}
    >
      <div className="max-w-6xl mx-auto">
        <div
          className="relative rounded-3xl overflow-hidden"
          style={{
            background: "#ffffff",
            boxShadow:
              "0 4px 32px 0 rgba(58, 82, 185, 0.10), 0 1.5px 6px 0 rgba(58,82,185,0.06)",
            border: "1.5px solid #E8EAFA",
          }}
        >
          {/* Top indigo accent bar */}
          <div
            className="absolute top-0 left-0 right-0 h-1 rounded-t-3xl"
            style={{
              background:
                "linear-gradient(90deg, #4161DF 0%, #2563EB 50%, #1B4FD8 100%)",
            }}
          />

          {/* Subtle background blobs */}
          <div
            className="absolute top-0 right-0 w-96 h-72 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at top right, #EEF2FF 0%, transparent 70%)",
            }}
          />
          <div
            className="absolute bottom-0 left-0 w-72 h-48 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at bottom left, #F0F4FF 0%, transparent 70%)",
            }}
          />

          {/* Main content grid */}
          <div className="relative z-10 p-8 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* LEFT: Phone mockup visual */}
            <div className="hidden lg:flex lg:col-span-3 items-center justify-center">
              <div className="relative">
                {/* Phone shell */}
                <div
                  className="w-36 h-60 rounded-[2rem] relative overflow-hidden flex flex-col"
                  style={{
                    background:
                      "linear-gradient(160deg, #1E2A6E 0%, #2563EB 60%, #4161DF 100%)",
                    boxShadow:
                      "0 24px 48px -8px rgba(37,99,235,0.35), 0 0 0 1.5px rgba(255,255,255,0.15) inset",
                  }}
                >
                  {/* Notch */}
                  <div className="flex justify-center pt-3">
                    <div className="w-12 h-1.5 rounded-full bg-white/20" />
                  </div>

                  {/* Screen content */}
                  <div
                    className="flex-1 mx-2 my-2 rounded-2xl overflow-hidden"
                    style={{ background: "#F8FAFF" }}
                  >
                    {/* Mini header */}
                    <div
                      className="px-2 py-1.5 flex items-center gap-1.5"
                      style={{
                        background: "#fff",
                        borderBottom: "1px solid #EEF2FF",
                      }}
                    >
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ background: "#4161DF" }}
                      />
                      <div
                        className="text-[6px] font-black"
                        style={{ color: "#1E2A6E" }}
                      >
                        PropertyBulbul
                      </div>
                    </div>
                    {/* Mini listing cards */}
                    {[
                      {
                        label: "3BHK · Mohali",
                        price: "₹22K/mo",
                        tag: "Verified",
                      },
                      {
                        label: "2BHK · Sector 17",
                        price: "₹18K/mo",
                        tag: "New",
                      },
                      {
                        label: "Studio · Panchkula",
                        price: "₹10K/mo",
                        tag: "Hot",
                      },
                    ].map((item, i) => (
                      <div
                        key={i}
                        className="mx-1.5 mt-1.5 rounded-lg p-1.5 flex items-center gap-1.5"
                        style={{
                          background: "#fff",
                          border: "1px solid #EEF2FF",
                        }}
                      >
                        <div
                          className="w-5 h-5 rounded-md flex-shrink-0"
                          style={{
                            background:
                              i === 0
                                ? "#EEF2FF"
                                : i === 1
                                  ? "#F0FDF4"
                                  : "#FFF7ED",
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <div
                            className="text-[5.5px] font-bold truncate"
                            style={{ color: "#1E2A6E" }}
                          >
                            {item.label}
                          </div>
                          <div
                            className="text-[5px] font-semibold"
                            style={{ color: "#4161DF" }}
                          >
                            {item.price}
                          </div>
                        </div>
                        <div
                          className="text-[4.5px] font-black px-1 py-0.5 rounded"
                          style={{
                            background: i === 2 ? "#FFF7ED" : "#EEF2FF",
                            color: i === 2 ? "#EA580C" : "#4161DF",
                          }}
                        >
                          {item.tag}
                        </div>
                      </div>
                    ))}
                    {/* Mini search bar */}
                    <div
                      className="mx-1.5 mt-2 rounded-lg px-2 py-1 flex items-center gap-1"
                      style={{ background: "#EEF2FF" }}
                    >
                      <MapPin
                        className="w-2 h-2"
                        style={{ color: "#4161DF" }}
                      />
                      <div
                        className="text-[5px] font-medium"
                        style={{ color: "#94A3B8" }}
                      >
                        Search in Tricity…
                      </div>
                    </div>
                  </div>

                  {/* Bottom nav dots */}
                  <div className="flex justify-center gap-1.5 py-2">
                    {[1, 0, 0].map((a, i) => (
                      <div
                        key={i}
                        className="rounded-full"
                        style={{
                          width: a ? 14 : 6,
                          height: 4,
                          background: a
                            ? "rgba(255,255,255,0.9)"
                            : "rgba(255,255,255,0.3)",
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Floating badge */}
                <div
                  className="absolute -top-3 -right-5 px-2.5 py-1.5 rounded-xl text-[9px] font-black flex items-center gap-1"
                  style={{
                    background: "#fff",
                    boxShadow: "0 4px 16px rgba(37,99,235,0.15)",
                    color: "#4161DF",
                    border: "1px solid #EEF2FF",
                  }}
                >
                  <Star className="w-2.5 h-2.5 text-yellow-400 fill-yellow-400" />
                  4.8 · 2K+ Reviews
                </div>

                {/* Notification pop */}
                <div
                  className="absolute -bottom-2 -left-6 px-2.5 py-1.5 rounded-xl text-[8px] font-bold flex items-center gap-1.5 whitespace-nowrap"
                  style={{
                    background: "#fff",
                    boxShadow: "0 4px 16px rgba(37,99,235,0.12)",
                    color: "#1E2A6E",
                    border: "1px solid #EEF2FF",
                  }}
                >
                  <div
                    className="w-4 h-4 rounded-full flex items-center justify-center"
                    style={{ background: "#EEF2FF" }}
                  >
                    <Home className="w-2 h-2" style={{ color: "#4161DF" }} />
                  </div>
                  New listing near you!
                </div>
              </div>
            </div>

            {/* CENTER: Text content */}
            <div className="lg:col-span-5 space-y-4">
              {/* Badge pill — matches hero badge style */}
              <div
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold"
                style={{
                  background: "#EEF2FF",
                  color: "#4161DF",
                  border: "1px solid #C7D2FE",
                }}
              >
                <Sparkles className="w-3 h-3 text-yellow-500 fill-yellow-400" />
                PropertyBulbul Mobile — Now Live
              </div>

              {/* Headline — same bold navy style as hero */}
              <div>
                <h2
                  className="text-2xl sm:text-3xl font-black leading-tight tracking-tight"
                  style={{ color: "#0F172A" }}
                >
                  Tricity's Top Real Estate
                </h2>
                <h2
                  className="text-2xl sm:text-3xl font-black leading-tight tracking-tight"
                  style={{ color: "#4161DF" }}
                >
                  Marketplace in Your Pocket!
                </h2>
              </div>

              {/* Subtext */}
              <p
                className="text-sm leading-relaxed"
                style={{ color: "#64748B", maxWidth: 380 }}
              >
                Real-time flatmate matching, instant chat with verified owners,
                and live listing alerts — all in one app.
              </p>

              {/* Stats row — same micro-badge style as hero feature pills */}
              <div className="flex flex-wrap gap-3 pt-1">
                {[
                  {
                    icon: <Users className="w-3 h-3" />,
                    val: "50K+",
                    label: "Downloads",
                  },
                  {
                    icon: <Star className="w-3 h-3 text-yellow-500" />,
                    val: "4.8★",
                    label: "Rating",
                  },
                  {
                    icon: <Home className="w-3 h-3" />,
                    val: "2K+",
                    label: "Listings",
                  },
                ].map((s, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold"
                    style={{
                      background: "#F8FAFF",
                      border: "1px solid #E2E8F0",
                      color: "#475569",
                    }}
                  >
                    <span style={{ color: "#4161DF" }}>{s.icon}</span>
                    <span className="font-black" style={{ color: "#1E2A6E" }}>
                      {s.val}
                    </span>
                    {s.label}
                  </div>
                ))}
              </div>

              {/* Trust line */}
              <div
                className="flex items-center gap-1.5 text-[11px] font-semibold"
                style={{ color: "#94A3B8" }}
              >
                <ShieldCheck
                  className="w-3.5 h-3.5"
                  style={{ color: "#22C55E" }}
                />
                Verified Secure Download · Zero Spam Guaranteed
              </div>
            </div>

            {/* RIGHT: CTA Buttons */}
            <div className="lg:col-span-4 flex flex-col gap-3 items-stretch sm:items-end">
              {/* Google Play — primary button style matching "Browse Verified Properties" */}
              <button
                onClick={() => handleStoreRedirect("android")}
                className="group flex items-center gap-4 rounded-2xl px-5 py-4 transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98]"
                style={{
                  background:
                    "linear-gradient(135deg, #3A52B9 0%, #2563EB 100%)",
                  boxShadow: "0 4px 18px -4px rgba(37,99,235,0.45)",
                  minWidth: 220,
                }}
              >
                <svg
                  className="w-8 h-8 shrink-0"
                  viewBox="0 0 32 32"
                  fill="none"
                >
                  <path d="M5 7.2l12.2 8.8L5 24.8V7.2z" fill="#4ADE80" />
                  <path d="M5 7.2l6.8 6.8-6.8 6.8V7.2z" fill="#16A34A" />
                  <path
                    d="M5 24.8l12.2-8.8 4 2.9L8.2 26.8A2.5 2.5 0 015 24.8z"
                    fill="#FBBF24"
                  />
                  <path d="M5 7.2l12 6.8-3.8 2.8L5 8.8V7.2z" fill="#F87171" />
                  <path
                    d="M17.2 16l4-2.8 1.5.9a2.4 2.4 0 010 3.8l-1.5.9-4-2.8z"
                    fill="#60A5FA"
                  />
                </svg>
                <div className="text-left flex-1">
                  <div className="text-[9px] font-bold text-white/60 uppercase tracking-widest">
                    Get it on
                  </div>
                  <div className="text-[15px] font-black text-white tracking-tight">
                    Google Play
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-white/50 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </button>

              {/* App Store — outline button matching "List Your Property" */}
              <button
                onClick={() => handleStoreRedirect("ios")}
                className="group flex items-center gap-4 rounded-2xl px-5 py-4 transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98]"
                style={{
                  background: "#fff",
                  border: "1.5px solid #C7D2FE",
                  boxShadow: "0 2px 8px rgba(37,99,235,0.07)",
                  minWidth: 220,
                }}
              >
                <svg
                  className="w-8 h-8 shrink-0"
                  viewBox="0 0 32 32"
                  fill="none"
                >
                  <path
                    d="M21 9.5c1.1-1.4 1-3.3 1-3.3s-1.9.2-3 1.4c-1.1 1.2-1.2 3-1.2 3s1.9.1 3.2-1.1z"
                    fill="#1E2A6E"
                  />
                  <path
                    d="M24.3 20.5c-.5 1.1-.7 1.6-1.3 2.6-.9 1.4-2.1 3-3.7 3-1.3 0-1.7-.8-3.5-.8s-2.3.8-3.6.8c-1.5 0-2.7-1.6-3.6-3C6 20 5.4 15.7 7.3 13c1.2-1.7 3.1-2.7 4.9-2.7 1.8 0 3 .8 4.5.8 1.4 0 2.3-.9 4.5-.9 1.6 0 3.3.9 4.5 2.3-.1 0-2.5 1.4-3 4z"
                    fill="#1E2A6E"
                  />
                </svg>
                <div className="text-left flex-1">
                  <div
                    className="text-[9px] font-bold uppercase tracking-widest"
                    style={{ color: "#94A3B8" }}
                  >
                    Download on the
                  </div>
                  <div
                    className="text-[15px] font-black tracking-tight"
                    style={{ color: "#1E2A6E" }}
                  >
                    App Store
                  </div>
                </div>
                <ArrowUpRight
                  className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all"
                  style={{ color: "#C7D2FE" }}
                />
              </button>

              {/* Location chips — matching hero city pills */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {["Chandigarh", "Mohali", "Panchkula"].map((city) => (
                  <span
                    key={city}
                    className="flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded-full"
                    style={{ background: "#F1F5F9", color: "#475569" }}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ background: "#22C55E", display: "inline-block" }}
                    />
                    {city}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom footer strip */}
          <div
            style={{ borderTop: "1px solid #F1F5F9" }}
            className="px-8 sm:px-10 py-3 flex flex-wrap items-center justify-between gap-3"
          >
            <span
              className="text-[11px] font-semibold"
              style={{ color: "#CBD5E1" }}
            >
              © 2025 PropertyBulbul · Chandigarh, Mohali, Panchkula
            </span>
            <span
              className="flex items-center gap-1.5 text-[11px] font-semibold"
              style={{ color: "#CBD5E1" }}
            >
              <ShieldCheck
                className="w-3.5 h-3.5"
                style={{ color: "#22C55E" }}
              />
              SSL Encrypted · DPDP Compliant
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

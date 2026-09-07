"use client";

import {
  IconShieldCheck,
  IconBrandWhatsapp,
  IconRobot,
  IconCircleCheck,
  IconCircleX,
  IconArrowRight,
} from "@tabler/icons-react";
import Link from "next/link";

const BRAND = "#4161df";
const INK = "#161A2E";
const INK_SOFT = "#5C5F73";
const TINT_BG = "#EEF1FC";
const TINT_LINE = "#DCE1F7";

const tableData = [
  {
    feature: "Data freshness",
    desc: "Refreshed daily from active Tricity broker networks, not left to go stale.",
  },
  {
    feature: "Listing quality",
    desc: "AI-written descriptions that read like a person wrote them, not copy-pasted spam.",
  },
  {
    feature: "Response speed",
    desc: "Message a broker directly on WhatsApp. No call centers, no forms.",
  },
  {
    feature: "Brochure support",
    desc: "A proper PDF brochure in seconds, not after three follow-up calls.",
  },
  {
    feature: "Spam protection",
    desc: "We never sell your number to telemarketers. Ever.",
  },
];

const features = [
  {
    icon: IconShieldCheck,
    title: "No ghost listings",
    desc: "Stop calling about properties that sold months ago. Every listing is pulled from live WhatsApp broker networks — if it's on Bulbul, it's real.",
  },
  {
    icon: IconBrandWhatsapp,
    title: "WhatsApp-first",
    desc: "Skip the ten-field forms and spam calls. Message brokers directly on WhatsApp and get brochures instantly.",
  },
  {
    icon: IconRobot,
    title: "AI-powered detail",
    desc: "Our AI turns a broker's rough notes into a clear, professional brochure, so you know what you're walking into before you leave home.",
  },
];

export default function WhyPropertyBulbul() {
  return (
    <section className="py-14 sm:py-20 md:py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="max-w-2xl mx-auto text-center mb-12 sm:mb-16">
          <div className="flex items-center justify-center gap-2.5 mb-5">
            <span
              className="w-8 h-[3px] rounded-full"
              style={{ background: BRAND }}
            />
            <span className="text-sm font-medium" style={{ color: BRAND }}>
              Why choose us
            </span>
          </div>
          <h2
            className="text-2xl sm:text-3xl md:text-[38px] font-bold leading-[1.15]"
            style={{ color: INK }}
          >
            Quality over quantity, always
          </h2>
          <p
            className="mt-4 text-[15px] sm:text-base leading-relaxed"
            style={{ color: INK_SOFT }}
          >
            Portals like 99acres and MagicBricks chase listing counts. We chase{" "}
            <span className="font-semibold" style={{ color: INK }}>
              accuracy
            </span>{" "}
            — real listings, real responses, no games. Built the Bulbul way for
            the modern Chandigarh, Mohali, and Zirakpur market.
          </p>
        </div>

        {/* Comparison table */}
        <div className="mb-16 sm:mb-20">
          {/* Mobile layout */}
          <div
            className="md:hidden rounded-2xl border overflow-hidden"
            style={{ borderColor: TINT_LINE }}
          >
            <div
              className="flex items-center px-4 py-3 text-[11px] font-semibold"
              style={{ background: TINT_BG, color: INK_SOFT }}
            >
              <div className="flex-1">Feature</div>
              <div className="w-12 text-center" style={{ color: BRAND }}>
                Bulbul
              </div>
              <div className="w-12 text-center">Others</div>
            </div>
            {tableData.map((item, i) => (
              <div
                key={item.feature}
                className="flex items-start px-4 py-3"
                style={{ borderTop: i === 0 ? "none" : "1px solid #EFF0F7" }}
              >
                <div className="flex-1 min-w-0 pr-2">
                  <span
                    className="text-sm font-semibold block"
                    style={{ color: INK }}
                  >
                    {item.feature}
                  </span>
                  <span
                    className="text-[11px] leading-snug block mt-0.5"
                    style={{ color: INK_SOFT }}
                  >
                    {item.desc}
                  </span>
                </div>
                <div
                  className="w-12 flex justify-center items-center pt-0.5 shrink-0 self-stretch"
                  style={{ background: TINT_BG }}
                >
                  <IconCircleCheck className="text-green-600" size={18} />
                </div>
                <div className="w-12 flex justify-center pt-0.5 shrink-0">
                  <IconCircleX className="text-gray-300" size={18} />
                </div>
              </div>
            ))}
          </div>

          {/* Desktop layout */}
          <div
            className="hidden md:block rounded-2xl border overflow-hidden"
            style={{ borderColor: TINT_LINE }}
          >
            <table className="w-full">
              <thead>
                <tr style={{ background: TINT_BG }}>
                  <th
                    className="px-6 py-4 text-left text-sm font-semibold"
                    style={{ color: INK }}
                  >
                    Feature
                  </th>
                  <th
                    className="px-6 py-4 text-center text-sm font-semibold"
                    style={{ color: BRAND }}
                  >
                    PropertyBulbul
                  </th>
                  <th
                    className="px-6 py-4 text-center text-sm font-semibold"
                    style={{ color: INK_SOFT }}
                  >
                    99acres / MagicBricks
                  </th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((item, i) => (
                  <tr
                    key={item.feature}
                    style={{
                      borderTop: i === 0 ? "none" : "1px solid #EFF0F7",
                    }}
                  >
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span
                          className="font-semibold text-[15px]"
                          style={{ color: INK }}
                        >
                          {item.feature}
                        </span>
                        <span
                          className="text-xs mt-0.5"
                          style={{ color: INK_SOFT }}
                        >
                          {item.desc}
                        </span>
                      </div>
                    </td>
                    <td
                      className="px-6 py-4 text-center"
                      style={{ background: TINT_BG }}
                    >
                      <div className="flex items-center justify-center">
                        <IconCircleCheck className="text-green-600" size={22} />
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center">
                        <IconCircleX className="text-gray-300" size={22} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Feature cards */}
        <div
          className="grid grid-cols-1 sm:grid-cols-3 gap-px rounded-2xl overflow-hidden"
          style={{ background: "#E5E7F2" }}
        >
          {features.map((item) => (
            <div key={item.title} className="bg-white p-6 sm:p-7">
              <span
                className="flex items-center justify-center w-11 h-11 rounded-full mb-5"
                style={{ border: `1.5px solid ${BRAND}`, color: BRAND }}
              >
                <item.icon size={20} stroke={1.8} />
              </span>
              <h4
                className="text-base sm:text-lg font-semibold mb-2"
                style={{ color: INK }}
              >
                {item.title}
              </h4>
              <p
                className="text-[13.5px] sm:text-sm leading-relaxed"
                style={{ color: INK_SOFT }}
              >
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Closing link */}
        <div className="mt-10 sm:mt-12 text-center">
          <Link
            href="/properties"
            className="group inline-flex items-center gap-1.5 text-sm sm:text-base font-semibold"
            style={{ color: BRAND }}
          >
            See real listings for yourself
            <IconArrowRight
              size={17}
              className="transition-transform duration-200 group-hover:translate-x-0.5"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}

"use client";

import React from "react";
import { Database, MapPin, ShieldCheck, Cpu } from "lucide-react";
import { motion } from "framer-motion";

const BRAND = "#4161df";
const INK = "#161A2E";
const INK_SOFT = "#5C5F73";
const TINT_BG = "#EEF1FC";

const facts = [
  {
    icon: Database,
    tag: "Growing",
    title: "Property database",
    desc: "Continuously expanding verified listings across the region.",
  },
  {
    icon: MapPin,
    tag: "6 cities",
    title: "Tricity coverage",
    desc: "Deep hyperlocal knowledge across every corner of the region.",
  },
  {
    icon: ShieldCheck,
    tag: "Verified",
    title: "Every listing",
    desc: "Each property checked for accuracy before it goes live.",
  },
  {
    icon: Cpu,
    tag: "Tech-first",
    title: "Our approach",
    desc: "Built on a modern technology stack from day one.",
  },
];

export default function AboutPropertyBulbulToday() {
  return (
    <section
      className="py-16 sm:py-20 md:py-24 px-4"
      style={{ background: "#f8f9ff" }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.05fr] gap-12 lg:gap-16 items-start">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-2.5 mb-5">
              <span
                className="w-8 h-[3px] rounded-full"
                style={{ background: BRAND }}
              />
              <span className="text-sm font-medium" style={{ color: BRAND }}>
                PropertyBulbul today
              </span>
            </div>

            <h2
              className="text-2xl sm:text-3xl md:text-[38px] font-bold leading-[1.15] mb-6"
              style={{ color: INK }}
            >
              Growing the intelligence layer for Tricity real estate
            </h2>

            <div
              className="space-y-4 text-[15px] sm:text-base leading-relaxed max-w-[52ch]"
              style={{ color: INK_SOFT }}
            >
              <p>
                From a handful of listings to a growing database of verified
                properties across Chandigarh, Mohali, Panchkula, Zirakpur,
                Kharar, and New Chandigarh &mdash; PropertyBulbul is steadily
                becoming the go-to platform for data-driven property decisions
                in the region.
              </p>
              <p>
                Our technology-driven approach means every listing, every data
                point, and every insight is organized to help you make faster,
                smarter, and more confident decisions.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-px rounded-2xl overflow-hidden"
            style={{ background: "#E5E7F2" }}
          >
            {facts.map((item) => (
              <div key={item.title} className="bg-white p-6 sm:p-7">
                <div className="flex items-center justify-between mb-4">
                  <span
                    className="flex items-center justify-center w-11 h-11 rounded-full"
                    style={{ border: `1.5px solid ${BRAND}`, color: BRAND }}
                  >
                    <item.icon className="w-5 h-5" strokeWidth={1.8} />
                  </span>
                  <span
                    className="text-xs font-semibold px-2.5 py-1 rounded-full"
                    style={{ background: TINT_BG, color: BRAND }}
                  >
                    {item.tag}
                  </span>
                </div>
                <h3
                  className="text-base sm:text-lg font-semibold mb-1.5"
                  style={{ color: INK }}
                >
                  {item.title}
                </h3>
                <p
                  className="text-[13px] sm:text-sm leading-relaxed"
                  style={{ color: INK_SOFT }}
                >
                  {item.desc}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

"use client";

import React from "react";
import {
  LineChart,
  PieChart,
  ShieldCheck,
  Users,
  Lightbulb,
} from "lucide-react";
import { motion } from "framer-motion";

const BRAND = "#4161df";
const INK = "#161A2E";
const INK_SOFT = "#5C5F73";
const TINT_BG = "#EEF1FC";
const TINT_LINE = "#DCE1F7";

const pillars = [
  { icon: LineChart, label: "Technology first" },
  { icon: PieChart, label: "Data-driven" },
  { icon: ShieldCheck, label: "Trust and transparency" },
  { icon: Users, label: "User empowerment" },
];

export default function AboutVision() {
  return (
    <section className="py-16 sm:py-20 md:py-24 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_1fr] gap-12 lg:gap-16 items-start">
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
                Our vision
              </span>
            </div>

            <h2
              className="text-2xl sm:text-3xl md:text-[38px] font-bold leading-[1.15] mb-6"
              style={{ color: INK }}
            >
              The most trusted property intelligence platform in North India
            </h2>

            <p
              className="text-[15px] sm:text-base leading-relaxed mb-8 max-w-[52ch]"
              style={{ color: INK_SOFT }}
            >
              Starting with Chandigarh-Tricity, we&apos;re building a future
              where every property decision is backed by data, powered by
              technology, and driven by transparency &mdash; not guesswork or
              sales pressure.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
              {pillars.map((item, i) => (
                <div
                  key={item.label}
                  className="flex items-center gap-3 py-3"
                  style={{
                    borderTop: i < 2 ? "none" : `1px solid #ECEDF5`,
                  }}
                >
                  <span
                    className="flex items-center justify-center w-9 h-9 rounded-full shrink-0"
                    style={{ border: `1.5px solid ${BRAND}`, color: BRAND }}
                  >
                    <item.icon className="w-4 h-4" strokeWidth={1.8} />
                  </span>
                  <span
                    className="text-[14px] sm:text-[15px] font-medium"
                    style={{ color: INK }}
                  >
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: 0.12 }}
          >
            <div
              className="rounded-2xl p-7 sm:p-9"
              style={{ background: TINT_BG, border: `1px solid ${TINT_LINE}` }}
            >
              <div className="flex items-center gap-2.5 mb-4">
                <span
                  className="flex items-center justify-center w-8 h-8 rounded-full shrink-0"
                  style={{ background: "#fff", color: BRAND }}
                >
                  <Lightbulb className="w-4 h-4" strokeWidth={1.8} />
                </span>
                <h3
                  className="text-base sm:text-lg font-semibold"
                  style={{ color: INK }}
                >
                  Our north star
                </h3>
              </div>

              <p
                className="text-[14px] sm:text-[15px] leading-relaxed mb-5"
                style={{ color: INK_SOFT }}
              >
                We measure success not by the number of deals closed, but by the
                number of decisions made better. Every feature, every data
                point, every listing on PropertyBulbul exists to answer one
                question:
              </p>

              <blockquote
                className="pl-4 text-[15px] sm:text-base font-semibold leading-snug"
                style={{ borderLeft: `3px solid ${BRAND}`, color: INK }}
              >
                Does this help our user make a more informed property decision?
              </blockquote>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

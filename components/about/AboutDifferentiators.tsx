"use client";

import React from "react";
import { ShieldCheck, Sparkles, Eye, PieChart } from "lucide-react";
import { motion } from "framer-motion";

const BRAND = "#4161df";
const INK = "#161A2E";
const INK_SOFT = "#5C5F73";

const items = [
  {
    icon: PieChart,
    title: "Hyperlocal intelligence",
    desc: "Sector-by-sector market insights for every locality in Tricity. Know the true value, demand trends, and growth potential before you decide.",
  },
  {
    icon: ShieldCheck,
    title: "Verified property data",
    desc: "Every listing on our platform is verified. No duplicates, no fake listings — just accurate, reliable property data.",
  },
  {
    icon: Sparkles,
    title: "Smarter recommendations",
    desc: "Personalized property suggestions based on your budget, preferences, and lifestyle, powered by intelligent filters and market analysis.",
  },
  {
    icon: Eye,
    title: "Real estate transparency",
    desc: "Understand true property value, locality quality, market trends, and price history, so you never make a decision in the dark.",
  },
];

export default function AboutDifferentiators() {
  return (
    <section className="py-16 sm:py-20 md:py-28 px-4 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mb-12 sm:mb-16"
        >
          <div className="flex items-center gap-2.5 mb-5">
            <span
              className="w-8 h-[3px] rounded-full"
              style={{ background: BRAND }}
            />
            <span className="text-sm font-medium" style={{ color: BRAND }}>
              What makes PropertyBulbul different
            </span>
          </div>
          <h2
            className="text-2xl sm:text-3xl md:text-[38px] font-bold leading-[1.15]"
            style={{ color: INK }}
          >
            Built for intelligence, not brokerage
          </h2>
          <p
            className="mt-4 text-[15px] sm:text-base leading-relaxed"
            style={{ color: INK_SOFT }}
          >
            We don&apos;t just list properties. We organize the Tricity market
            around data, transparency, and smarter decision-making.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="rounded-2xl border overflow-hidden bg-white"
          style={{ borderColor: "#E5E7F2" }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2">
            {items.map((item, i) => {
              const isLeftCol = i % 2 === 0;
              const isTopRow = i < 2;
              return (
                <div
                  key={item.title}
                  className={`p-7 sm:p-9 ${isTopRow ? "border-b" : ""} ${
                    isLeftCol ? "sm:border-r border-b sm:border-b-0" : ""
                  }`}
                  style={{ borderColor: "#EBECF5" }}
                >
                  <span
                    className="flex items-center justify-center w-11 h-11 rounded-full mb-5"
                    style={{ border: `1.5px solid ${BRAND}`, color: BRAND }}
                  >
                    <item.icon className="w-5 h-5" strokeWidth={1.8} />
                  </span>
                  <h3
                    className="text-base sm:text-lg font-semibold mb-2"
                    style={{ color: INK }}
                  >
                    {item.title}
                  </h3>
                  <p
                    className="text-[13.5px] sm:text-[15px] leading-relaxed"
                    style={{ color: INK_SOFT }}
                  >
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

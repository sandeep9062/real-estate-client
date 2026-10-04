"use client";

import React from "react";
import { Eye, Target, HeartHandshake } from "lucide-react";
import { motion } from "framer-motion";

const BRAND = "#4161df";

const pillars = [
  {
    icon: Eye,
    title: "See clearly",
    body: "Verified data replaces guesswork at every step.",
  },
  {
    icon: Target,
    title: "Decide with purpose",
    body: "Hyperlocal intelligence, matched to what you need.",
  },
  {
    icon: HeartHandshake,
    title: "Built on trust",
    body: "No hidden fees, no inflated claims, ever.",
  },
];

export default function AboutMission() {
  return (
    <section
      className="relative py-16 sm:py-24 md:py-28 px-4 overflow-hidden"
      style={{ background: BRAND }}
    >
      {/* blueprint grid, echoing the sketched Tricity skyline in the brand art */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 -right-24 w-72 h-72 sm:w-96 sm:h-96 rounded-full"
        style={{ background: "rgba(255,255,255,0.05)" }}
      />

      <div className="relative max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55 }}
          className="text-center"
        >
          <span
            aria-hidden
            className="block font-heading leading-none select-none mb-2"
            style={{
              fontSize: "clamp(56px, 10vw, 96px)",
              color: "rgba(255,255,255,0.18)",
            }}
          >
            &ldquo;
          </span>

          <h2 className="-mt-8 sm:-mt-10 text-[26px] sm:text-3xl md:text-[40px] font-bold text-white leading-[1.2] max-w-3xl mx-auto">
            To make every property decision in Tricity transparent, data-driven,
            and confidence-inspiring.
          </h2>

          <p
            className="mt-6 text-[15px] sm:text-base md:text-lg max-w-xl mx-auto leading-relaxed"
            style={{ color: "rgba(255,255,255,0.75)" }}
          >
            We&apos;re not in the business of closing deals. We&apos;re in the
            business of empowering decisions &mdash; with verified data,
            hyperlocal intelligence, and technology that puts the power back in
            your hands.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55, delay: 0.15 }}
          className="mt-12 sm:mt-16 flex flex-col sm:flex-row items-stretch justify-center gap-6 sm:gap-0"
        >
          {pillars.map((p, i) => (
            <div
              key={p.title}
              className="flex-1 sm:max-w-[220px] flex flex-col items-center text-center px-4 sm:px-6"
              style={{
                borderLeft:
                  i === 0 ? "none" : "1px solid rgba(255,255,255,0.15)",
              }}
            >
              <span
                className="flex items-center justify-center w-10 h-10 rounded-full mb-3"
                style={{ background: "rgba(255,255,255,0.12)" }}
              >
                <p.icon className="w-4.5 h-4.5 text-white" strokeWidth={1.8} />
              </span>
              <h3 className="text-white text-sm sm:text-[15px] font-semibold mb-1">
                {p.title}
              </h3>
              <p
                className="text-xs sm:text-[13px] leading-relaxed"
                style={{ color: "rgba(255,255,255,0.68)" }}
              >
                {p.body}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

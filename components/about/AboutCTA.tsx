"use client";

import React from "react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const BRAND = "#4161df";

export default function AboutCTA() {
  return (
    <section
      className="relative w-full overflow-hidden py-20 sm:py-28 px-4"
      style={{ background: BRAND }}
    >
      {/* blueprint grid, matching AboutMission */}
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
        className="pointer-events-none absolute -top-20 -left-20 w-64 h-64 sm:w-80 sm:h-80 rounded-full"
        style={{ background: "rgba(255,255,255,0.05)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 -right-24 w-72 h-72 sm:w-96 sm:h-96 rounded-full"
        style={{ background: "rgba(255,255,255,0.05)" }}
      />

      <div className="relative max-w-3xl mx-auto flex flex-col items-center text-center">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="text-[28px] sm:text-4xl md:text-5xl font-bold text-white leading-[1.15]"
        >
          Make smarter property decisions
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, delay: 0.08 }}
          className="mt-4 max-w-xl text-[15px] sm:text-base leading-relaxed"
          style={{ color: "rgba(255,255,255,0.78)" }}
        >
          Join thousands of users who rely on PropertyBulbul for transparent,
          data-driven property decisions across Tricity. No sales pressure, just
          clarity.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mt-9 sm:mt-10 flex flex-col sm:flex-row gap-3 w-full sm:w-auto"
        >
          <Link
            href="/properties"
            className="group inline-flex items-center justify-center gap-2 bg-white font-semibold text-sm sm:text-base px-7 sm:px-8 py-3.5 rounded-full hover:bg-[#F2F3FC] transition-colors duration-200"
            style={{ color: BRAND }}
          >
            Explore properties
            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-2 bg-transparent border text-white font-semibold text-sm sm:text-base px-7 sm:px-8 py-3.5 rounded-full hover:bg-white/10 transition-colors duration-200"
            style={{ borderColor: "rgba(255,255,255,0.4)" }}
          >
            Talk to our team
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

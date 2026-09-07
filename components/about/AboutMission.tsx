"use client";

import React from "react";
import { Eye, Target, HeartHandshake } from "lucide-react";
import { motion } from "framer-motion";

const BRAND = "#4161df";

export default function AboutMission() {
  return (
    <section
      className="relative py-16 sm:py-20 md:py-24 px-4 overflow-hidden"
      style={{ background: BRAND }}
    >
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "radial-gradient(circle, white 1.5px, transparent 1.5px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white text-xs font-semibold tracking-[0.15em] uppercase px-5 py-2 rounded-full mb-6">
            <Target className="w-3.5 h-3.5" />
            Our Mission
          </span>

          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight max-w-3xl mx-auto">
            &ldquo;To make every property decision in Tricity transparent,
            data-driven, and confidence-inspiring.&rdquo;
          </h2>

          <p className="mt-6 text-blue-100 text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            We&apos;re not in the business of closing deals. We&apos;re in the
            business of empowering decisions &mdash; with verified data,
            hyperlocal intelligence, and technology that puts the power back in
            your hands.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

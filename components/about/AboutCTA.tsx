"use client";

import React from "react";
import { Search, ArrowRight, Target } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const BRAND = "#4161df";

export default function AboutCTA() {
  return (
    <section
      className="relative w-full overflow-hidden py-20 sm:py-28 px-4"
      style={{ background: BRAND }}
    >
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "radial-gradient(circle, white 1.5px, transparent 1.5px)",
          backgroundSize: "32px 32px",
        }}
      />
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-[0]">
        <svg
          viewBox="0 0 1440 60"
          preserveAspectRatio="none"
          className="w-full h-10 sm:h-14 fill-white"
        >
          <path d="M0,40 C480,0 960,60 1440,20 L1440,0 L0,0 Z" />
        </svg>
      </div>

      <div className="relative max-w-3xl mx-auto flex flex-col items-center text-center pt-4">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 bg-white/20 border border-white/30 text-white text-xs font-semibold tracking-[0.15em] uppercase px-5 py-2 rounded-full mb-8"
        >
          <Target className="w-3.5 h-3.5" />
          Start Your Journey
        </motion.span>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight"
        >
          Make Smarter <br className="hidden sm:block" />
          Property Decisions
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-blue-100 mt-3 sm:mt-4 max-w-xl text-xs sm:text-sm md:text-base leading-relaxed"
        >
          Join thousands of users who rely on PropertyBulbul for transparent,
          data-driven property decisions across Tricity. No sales pressure. Just
          clarity.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto"
        >
          <Link
            href="/properties"
            className="inline-flex items-center justify-center gap-2 bg-white font-bold text-sm sm:text-base px-6 sm:px-8 py-3.5 sm:py-4 rounded-full shadow-xl hover:bg-gray-100 hover:scale-105 transition-all duration-200"
            style={{ color: BRAND }}
          >
            <Search className="w-4 h-4" /> Explore Properties{" "}
            <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-2 bg-transparent border-2 border-white/50 text-white font-bold text-sm sm:text-base px-6 sm:px-8 py-3.5 sm:py-4 rounded-full hover:bg-white/10 transition-all duration-200"
          >
            Talk to Our Team
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Home, Upload, Sparkles, Clock } from "lucide-react";

import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { selectIsAuthenticated } from "@/store/authSlice";

const BRAND = "#4161df";
const BRAND_DARK = "#2b3f9e";

const PostPropertyCTA = () => {
  const router = useRouter();

  const isAuthenticated = useSelector(selectIsAuthenticated);

  const handleAddPropertyClick = () => {
    if (isAuthenticated) {
      router.push("/add-property");
    } else {
      router.push("/login");
    }
  };

  return (
    <div className="w-full px-3 sm:px-4 py-10 sm:py-14 md:py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.6 }}
        className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl px-5 sm:px-8 md:px-12 py-9 sm:py-11 md:py-14 shadow-xl flex flex-col gap-7 md:flex-row md:items-center md:justify-between"
        style={{
          background: `linear-gradient(135deg, ${BRAND} 0%, ${BRAND_DARK} 100%)`,
        }}
      >
        {/* Decorative accents — soft circles + dot texture, matching the site's other CTA banners */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-16 -right-14 w-56 h-56 rounded-full bg-white/10"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-20 -left-10 w-48 h-48 rounded-full bg-white/10"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "radial-gradient(circle, #fff 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        />

        {/* Left content */}
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="shrink-0 p-3 bg-white rounded-full shadow-sm"
          >
            <Home className="w-6 h-6 sm:w-7 sm:h-7" style={{ color: BRAND }} />
          </motion.div>

          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-white mb-2">
              For owners & agents
            </span>

            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white leading-tight">
              Turn your property into profit
            </h2>
            <p className="text-sm sm:text-base text-white/85 mt-1.5 max-w-md">
              Reach thousands of verified buyers across the Tricity and start
              getting genuine inquiries within days.
            </p>
          </div>
        </div>

        {/* CTA button */}
        <motion.div
          initial={{ scale: 0.92, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.35, duration: 0.4 }}
          className="relative z-10 w-full sm:w-auto flex flex-col items-center sm:items-end gap-2"
        >
          <button
            onClick={handleAddPropertyClick}
            className="group inline-flex w-full sm:w-auto items-center justify-center gap-2.5 rounded-xl bg-white px-6 sm:px-8 py-3.5 sm:py-4 text-base sm:text-lg font-semibold shadow-lg transition-transform duration-200 hover:scale-[1.03]"
            style={{ color: BRAND }}
          >
            <Upload className="w-5 h-5" />
            Post your property
          </button>

          <span className="inline-flex items-center gap-1.5 text-xs text-white/75">
            <Clock className="w-3.5 h-3.5" />
            Takes less than 2 minutes
          </span>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default PostPropertyCTA;

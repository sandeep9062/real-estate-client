"use client";

import React from "react";
import Image from "next/image";
import { ArrowRight, Search } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const BRAND = "#4161df";
const CITIES = [
  "Chandigarh",
  "Mohali",
  "Panchkula",
  "Zirakpur",
  "Kharar",
  "New Chandigarh",
];

// Content is authored once and rendered in both layouts so copy never drifts.
function Eyebrow({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-2 text-[13px] font-semibold text-slate-700 ${className}`}
    >
      <span className="relative flex h-2 w-2">
        <span
          className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-60"
          style={{ background: BRAND }}
        />
        <span
          className="relative inline-flex h-2 w-2 rounded-full"
          style={{ background: BRAND }}
        />
      </span>
      Tricity&apos;s property intelligence platform
    </span>
  );
}

function Headline({ className = "" }: { className?: string }) {
  return (
    <h1
      className={`font-bold leading-[1.08] tracking-tight text-slate-900 ${className}`}
    >
      Smarter property decisions,
      <br />
      <span className="relative inline-block" style={{ color: BRAND }}>
        powered by data
        <svg
          viewBox="0 0 220 12"
          className="absolute -bottom-2 left-0 w-full"
          preserveAspectRatio="none"
          aria-hidden
        >
          <path
            d="M2 8.5C40 3 100 2 218 7.5"
            stroke={BRAND}
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
            opacity="0.35"
          />
        </svg>
      </span>
    </h1>
  );
}

function CityLine({ className = "" }: { className?: string }) {
  return (
    <p className={`text-slate-500 ${className}`}>
      <span className="font-semibold text-slate-700">Now live in </span>
      {CITIES.slice(0, -1).join(", ")} and {CITIES[CITIES.length - 1]}.
    </p>
  );
}

function CTAs({ className = "" }: { className?: string }) {
  const focusRing =
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#4161df]";
  return (
    <div className={className}>
      <Link
        href="/properties"
        className={`inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-500/25 transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5 active:scale-[0.98] ${focusRing}`}
        style={{ background: BRAND }}
      >
        <Search className="h-4 w-4" /> Explore properties
      </Link>
      <Link
        href="/contact"
        className={`inline-flex items-center justify-center gap-2 rounded-full border-2 border-slate-200 bg-white px-7 py-3.5 text-sm font-bold text-slate-800 transition-all duration-200 hover:border-[#4161df]/40 hover:bg-blue-50/50 hover:-translate-y-0.5 active:scale-[0.98] ${focusRing}`}
      >
        Talk to our team <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}

export default function AboutHero() {
  return (
    <section className="relative w-full overflow-hidden bg-white">
      {/* MOBILE / TABLET — eyebrow + headline overlaid on the banner, rest stacked below */}
      <div className="md:hidden pt-24">
        <div className="relative aspect-[4/3] w-full bg-white xs:aspect-[3/2]">
          <Image
            src="/aboutus-banner.png"
            alt="PropertyBulbul mascot pointing toward a Chandigarh skyline sketch"
            fill
            priority
            sizes="100vw"
            className="object-cover object-[78%_center]"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-white via-white/0 to-white/0" />

          <div className="absolute inset-0 flex items-start px-5 pt-7 sm:px-6">
            <div className="max-w-[50%] xs:max-w-[65%]">
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Eyebrow className="text-[11px] leading-snug xs:text-xs" />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.08 }}
              >
                <Headline className="mt-3 text-[22px] leading-[1.12] xs:text-[26px]" />
              </motion.div>
            </div>
          </div>
        </div>

        <div className="px-5 pb-10 pt-6 sm:px-6">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.16 }}
            className="text-[15px] leading-relaxed text-slate-600"
          >
            PropertyBulbul combines hyperlocal expertise, verified property data
            and smart technology to help buyers, sellers, investors and NRIs
            make confident property decisions.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.24 }}
          >
            <CityLine className="mt-4 text-[13px] leading-relaxed" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.32 }}
          >
            <CTAs className="mt-6 flex flex-col gap-3" />
          </motion.div>
        </div>
      </div>

      {/* DESKTOP — full-bleed banner, copy anchored top-left under the mascot's raised hand */}
      <div className="hidden md:block relative w-full aspect-[2.2/1] pt-16 lg:aspect-[2.56/1]">
        <Image
          src="/aboutus-banner.png"
          alt="PropertyBulbul mascot pointing toward a Chandigarh skyline sketch"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />

        <div className="absolute inset-0 flex items-start">
          <div className="mx-auto w-full max-w-7xl px-6 pt-[9%] lg:px-10 lg:pt-[10%]">
            <div className="max-w-md lg:max-w-lg xl:max-w-xl">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Eyebrow />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.08 }}
              >
                <Headline className="mt-4 text-3xl lg:text-4xl xl:text-[44px]" />
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.18 }}
                className="mt-5 text-[15px] leading-relaxed text-slate-600 lg:text-base"
              >
                Hyperlocal expertise, verified property data and smart
                technology — built to help buyers, sellers, investors and NRIs
                decide with confidence.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.26 }}
              >
                <CityLine className="mt-4 text-sm" />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.34 }}
              >
                <CTAs className="mt-8 flex flex-wrap gap-4" />
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

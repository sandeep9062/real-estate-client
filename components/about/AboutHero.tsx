"use client";

import React from "react";
import Image from "next/image";
import { BarChart3, ArrowRight, Search, CheckCircle2 } from "lucide-react";
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

export default function AboutHero() {
  return (
    <section className="relative w-full bg-white">
      {/* MOBILE / TABLET: image shown in full (no crop), content stacked below */}
      <div className="md:hidden pt-26">
        <div className="relative w-full aspect-[2.56/1] bg-white">
          <Image
            src="/aboutus-banner.png"
            alt="PropertyBulbul — Property Intelligence Platform"
            fill
            priority
            sizes="100vw"
            className="object-contain object-right"
          />
        </div>

        <div className="px-4 sm:px-6 pt-6 pb-10">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-1.5 bg-blue-50 border border-blue-100 text-[#4161df] text-[10px] xs:text-xs font-semibold tracking-[0.12em] uppercase px-3 py-1.5 rounded-full mb-4"
          >
            <BarChart3 className="w-3 h-3" />
            Tricity&apos;s Property Intelligence Platform
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-2xl xs:text-3xl font-bold leading-[1.15] text-slate-900"
          >
            Smarter Property Decisions,{" "}
            <span className="relative inline-block text-[#4161df]">
              Powered by Data
              <span className="absolute left-0 -bottom-1 w-full h-[2px] rounded-full bg-[#4161df] opacity-40" />
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="mt-4 text-sm text-slate-600 leading-relaxed"
          >
            PropertyBulbul combines hyperlocal expertise, verified property
            data, and smart technology to help buyers, sellers, investors, and
            NRIs across Chandigarh, Mohali, Panchkula, Zirakpur, Kharar &amp;
            New Chandigarh make informed, confident property decisions.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="mt-5 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-slate-600 font-medium"
          >
            {CITIES.map((city) => (
              <span key={city} className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                {city}
              </span>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="mt-6 flex flex-col gap-3"
          >
            <Link
              href="/properties"
              className="inline-flex items-center justify-center gap-2 text-white text-sm font-bold px-6 py-3.5 rounded-full shadow-lg shadow-blue-500/20 transition-all duration-200 hover:shadow-xl active:scale-[0.98]"
              style={{ background: BRAND }}
            >
              <Search className="w-4 h-4" /> Explore Properties
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 bg-white border-2 border-slate-200 text-slate-800 text-sm font-bold px-6 py-3.5 rounded-full transition-all duration-200 hover:border-[#4161df]/40 hover:bg-blue-50/50 active:scale-[0.98]"
            >
              Talk to Our Team <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </div>

      {/* DESKTOP: full-bleed banner image, content overlaid on the left */}
      <div className="hidden md:block relative w-full aspect-[2.2/1] lg:aspect-[2.56/1] pt-16">
        <Image
          src="/aboutus-banner.png"
          alt="PropertyBulbul — Property Intelligence Platform"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />

        <div className="absolute inset-0 flex items-center">
          <div className="w-full max-w-7xl mx-auto px-6 lg:px-10">
            <div className="max-w-xl lg:max-w-2xl">
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-1.5 bg-blue-50 border border-blue-100 text-[#4161df] text-xs font-semibold tracking-[0.15em] uppercase px-4 py-1.5 rounded-full mb-5"
              >
                <BarChart3 className="w-3.5 h-3.5" />
                Tricity&apos;s Property Intelligence Platform
              </motion.span>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-3xl lg:text-4xl xl:text-5xl font-bold leading-[1.1] text-slate-900"
              >
                Smarter Property Decisions,{" "}
                <span className="relative inline-block text-[#4161df]">
                  Powered by Data
                  <span className="absolute left-0 -bottom-1 w-full h-[3px] rounded-full bg-[#4161df] opacity-40" />
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.25 }}
                className="mt-5 text-base lg:text-lg text-slate-600 leading-relaxed"
              >
                PropertyBulbul combines hyperlocal expertise, verified property
                data, and smart technology to help buyers, sellers, investors,
                and NRIs across Chandigarh, Mohali, Panchkula, Zirakpur, Kharar
                &amp; New Chandigarh make informed, confident property
                decisions.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.35 }}
                className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-600 font-medium"
              >
                {CITIES.map((city) => (
                  <span key={city} className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                    {city}
                  </span>
                ))}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.45 }}
                className="mt-8 flex flex-wrap gap-4"
              >
                <Link
                  href="/properties"
                  className="inline-flex items-center justify-center gap-2 text-white text-base font-bold px-8 py-4 rounded-full shadow-lg shadow-blue-500/20 transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5 active:scale-[0.98]"
                  style={{ background: BRAND }}
                >
                  <Search className="w-4 h-4" /> Explore Properties
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 bg-white border-2 border-slate-200 text-slate-800 text-base font-bold px-8 py-4 rounded-full transition-all duration-200 hover:border-[#4161df]/40 hover:bg-blue-50/50 hover:-translate-y-0.5 active:scale-[0.98]"
                >
                  Talk to Our Team <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

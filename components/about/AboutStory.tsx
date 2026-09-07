"use client";

import React from "react";
import { CheckCircle2, Layers } from "lucide-react";
import { motion } from "framer-motion";

const BRAND = "#4161df";

export default function AboutStory() {
  return (
    <section className="py-16 sm:py-20 md:py-28 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span
              className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.15em] uppercase mb-4"
              style={{ color: BRAND }}
            >
              <Layers className="w-4 h-4" />
              Our Story
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-6">
              Built to Bring Clarity to{" "}
              <span className="text-indigo-600">Property Decisions</span>
            </h2>

            <div className="space-y-4 text-gray-600 text-sm sm:text-base leading-relaxed">
              <p>
                If you&apos;ve ever tried buying a property in Chandigarh,
                Mohali, or Panchkula, you already know the problem.
              </p>
              <p>
                Information is scattered. Listings are duplicated. Prices are
                inflated. Builder claims are confusing. And every website claims
                to be &ldquo;the most trusted partner.&rdquo;
              </p>
              <p>
                PropertyBulbul was built to change this &mdash; not by being
                another real estate consultant, but by building a{" "}
                <strong className="text-gray-900">
                  technology platform that organizes Tricity&apos;s property
                  market
                </strong>{" "}
                around what actually matters: data, transparency, and informed
                decisions.
              </p>
              <p>
                We realized that the problem wasn&apos;t a lack of properties.
                It was a lack of reliable information. So we set out to build a
                platform that gives every buyer, seller, investor, and NRI the
                same quality of market intelligence that institutional investors
                have.
              </p>
              <p>
                Today, PropertyBulbul is the closest thing Tricity has to a
                centralized property intelligence layer &mdash; helping
                thousands of users navigate the market with clarity.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="space-y-4"
          >
            <div className="bg-red-50 border border-red-100 rounded-2xl p-5 sm:p-6">
              <h3 className="text-sm font-bold text-red-700 mb-3 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                The Problem
              </h3>
              <ul className="space-y-2.5">
                {[
                  "Information overload with no reliable filter",
                  "Fake and duplicate listings wasting your time",
                  "Misleading pricing with hidden brokerage fees",
                  "Confusing builder claims with no data to verify",
                  "Zero transparency in deal comparisons",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2.5 text-red-600 text-xs sm:text-sm"
                  >
                    <span className="mt-1 w-1 h-1 bg-red-400 rounded-full shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div
              className="rounded-2xl p-5 sm:p-6"
              style={{
                background: "#eef1ff",
                border: `1px solid ${BRAND}20`,
              }}
            >
              <h3 className="text-sm font-bold flex items-center gap-2 mb-3">
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: BRAND }}
                />
                <span style={{ color: BRAND }}>
                  The PropertyBulbul Solution
                </span>
              </h3>
              <ul className="space-y-2.5">
                {[
                  "Hyperlocal data organized sector-by-sector",
                  "Every property listing verified for accuracy",
                  "Transparent pricing with no hidden charges",
                  "Market intelligence for confident decision-making",
                  "Personalized recommendations based on your needs",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2.5 text-gray-700 text-xs sm:text-sm"
                  >
                    <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-green-600" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

"use client";

import React from "react";
import Image from "next/image";
import { Linkedin, Twitter, ArrowRight, BarChart3 } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const BRAND = "#4161df";

export default function AboutPropertyBulbulToday() {
  return (
    <section
        className="py-16 sm:py-20 md:py-24 px-4"
        style={{ background: "#f8f9ff" }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
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
                <BarChart3 className="w-4 h-4" />
                PropertyBulbul Today
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-6">
                Growing the Intelligence Layer{" "}
                <span className="text-indigo-600">for Tricity Real Estate</span>
              </h2>
              <div className="space-y-4 text-gray-600 text-sm sm:text-base leading-relaxed">
                <p>
                  From a handful of listings to a growing database of verified
                  properties across Chandigarh, Mohali, Panchkula, Zirakpur,
                  Kharar, and New Chandigarh &mdash; PropertyBulbul is steadily
                  becoming the go-to platform for data-driven property decisions
                  in the region.
                </p>
                <p>
                  Our technology-driven approach means every listing, every data
                  point, and every insight is organized to help you make faster,
                  smarter, and more confident decisions.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6"
            >
              {[
                {
                  value: "Growing",
                  label: "Property Database",
                  desc: "Continuously expanding verified listings",
                  color: "#4161df",
                },
                {
                  value: "6",
                  label: "Tricity Cities",
                  desc: "Deep hyperlocal coverage across the region",
                  color: "#6366f1",
                },
                {
                  value: "Verified",
                  label: "Listings",
                  desc: "Every property checked for accuracy",
                  color: "#4f46e5",
                },
                {
                  value: "Tech-First",
                  label: "Approach",
                  desc: "Built with modern technology stack",
                  color: "#3730a3",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-100 shadow-sm"
                >
                  <p
                    className="text-xl sm:text-2xl font-bold mb-1"
                    style={{ color: item.color }}
                  >
                    {item.value}
                  </p>
                  <p className="text-gray-900 font-semibold text-sm sm:text-base mb-1">
                    {item.label}
                  </p>
                  <p className="text-gray-500 text-xs sm:text-sm">
                    {item.desc}
                  </p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>
  );
}

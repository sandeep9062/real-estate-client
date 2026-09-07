"use client";

import React from "react";
import {
  ShieldCheck,
  Sparkles,
  Building2,
  Eye,
  PieChart,
  LineChart,
  Layers,
} from "lucide-react";
import { motion } from "framer-motion";

const BRAND = "#4161df";

export default function AboutDifferentiators() {
  return (
    <section className="py-16 sm:py-20 md:py-28 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 sm:mb-16"
        >
          <span
            className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.15em] uppercase mb-4"
            style={{ color: BRAND }}
          >
            <Sparkles className="w-4 h-4" />
            What Makes PropertyBulbul Different
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
            Built for Intelligence,{" "}
            <span className="text-indigo-600">Not Brokerage</span>
          </h2>
          <p className="text-gray-500 mt-3 max-w-2xl mx-auto text-sm sm:text-base">
            We don&apos;t just list properties. We organize the Tricity market
            around data, transparency, and smarter decision-making.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {[
            {
              icon: <PieChart className="w-6 h-6 text-white" />,
              title: "Hyperlocal Intelligence",
              desc: "Sector-by-sector market insights for every locality in Tricity. Know the true value, demand trends, and growth potential before you decide.",
            },
            {
              icon: <ShieldCheck className="w-6 h-6 text-white" />,
              title: "Verified Property Data",
              desc: "Every listing on our platform undergoes verification. No duplicates, no fake listings &mdash; just accurate, reliable property data.",
            },
            {
              icon: <Sparkles className="w-6 h-6 text-white" />,
              title: "Smarter Recommendations",
              desc: "Personalized property suggestions based on your budget, preferences, and lifestyle &mdash; powered by intelligent filters and market analysis.",
            },
            {
              icon: <Eye className="w-6 h-6 text-white" />,
              title: "Real Estate Transparency",
              desc: "Understand true property value, locality quality, market trends, and price history &mdash; so you never make a decision in the dark.",
            },
          ].map((item) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="group bg-white p-6 sm:p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                style={{ background: BRAND }}
              >
                {item.icon}
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                {item.title}
              </h3>
              <p className="text-sm sm:text-base text-gray-500 leading-relaxed flex-1">
                {item.desc}
              </p>
              <div
                className="mt-5 h-0.5 w-0 group-hover:w-10 rounded-full transition-all duration-500"
                style={{ background: BRAND }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

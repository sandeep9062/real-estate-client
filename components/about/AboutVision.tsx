"use client";

import React from "react";
import {
  LineChart,
  Target,
  PieChart,
  ShieldCheck,
  Users,
  Lightbulb,
} from "lucide-react";
import { motion } from "framer-motion";

const BRAND = "#4161df";

export default function AboutVision() {
  return (
    <section className="py-16 sm:py-20 md:py-24 px-4 bg-white">
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
              <Target className="w-4 h-4" />
              Our Vision
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-6">
              The Most Trusted Property Intelligence Platform in{" "}
              <span className="text-indigo-600">North India</span>
            </h2>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-6">
              Starting with Chandigarh-Tricity, we are building a future where
              every property decision is backed by data, powered by technology,
              and driven by transparency &mdash; not guesswork or sales
              pressure.
            </p>
            <div className="grid grid-cols-2 gap-4">
              {[
                {
                  icon: <LineChart className="w-5 h-5" />,
                  label: "Technology First",
                },
                {
                  icon: <PieChart className="w-5 h-5" />,
                  label: "Data-Driven",
                },
                {
                  icon: <ShieldCheck className="w-5 h-5" />,
                  label: "Trust & Transparency",
                },
                {
                  icon: <Users className="w-5 h-5" />,
                  label: "User Empowerment",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-3 bg-gray-50 rounded-xl p-4"
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: `${BRAND}15` }}
                  >
                    <span style={{ color: BRAND }}>{item.icon}</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-800">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <div
              className="rounded-2xl p-8 sm:p-10"
              style={{
                background: "linear-gradient(135deg, #eef1ff 0%, #ffffff 100%)",
              }}
            >
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Lightbulb className="w-5 h-5" style={{ color: BRAND }} />
                Our North Star
              </h3>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-4">
                We measure success not by the number of deals closed, but by the
                number of decisions made better. Every feature, every data
                point, every listing on PropertyBulbul exists to answer one
                question:
              </p>
              <blockquote
                className="border-l-4 pl-4 italic text-gray-800 font-medium"
                style={{ borderColor: BRAND }}
              >
                &ldquo;Does this help our user make a more informed property
                decision?&rdquo;
              </blockquote>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

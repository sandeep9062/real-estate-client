"use client";

import React from "react";
import {
  LineChart,
  Target,
  PieChart,
  ShieldCheck,
  Users,
  Lightbulb,
  HeartHandshake,
  Eye,
  MapPin,
} from "lucide-react";
import { motion } from "framer-motion";

const BRAND = "#4161df";

export default function AboutOurValues() {
  return (
    <section className="py-16 sm:py-20 md:py-24 px-4 bg-white">
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
            <HeartHandshake className="w-4 h-4" />
            Our Values
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
            Principles That{" "}
            <span className="text-indigo-600">Guide Every Decision</span>
          </h2>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
          {[
            {
              icon: <Eye className="w-6 h-6" />,
              title: "Transparency",
              desc: "No hidden fees, no inflated prices, no misleading claims. Just honest, clear information.",
            },
            {
              icon: <ShieldCheck className="w-6 h-6" />,
              title: "Trust",
              desc: "Every data point and listing on our platform is verified and reliable.",
            },
            {
              icon: <MapPin className="w-6 h-6" />,
              title: "Local Expertise",
              desc: "Deep, hyperlocal knowledge of every sector and locality in Tricity.",
            },
            {
              icon: <Lightbulb className="w-6 h-6" />,
              title: "Innovation",
              desc: "Constantly building better tools to simplify property decisions.",
            },
            {
              icon: <Users className="w-6 h-6" />,
              title: "Customer First",
              desc: "Every feature we build starts with one question: does this help our users?",
            },
          ].map((item) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="text-center p-6 sm:p-8 rounded-2xl border border-gray-100 bg-white hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4"
                style={{ background: `${BRAND}10` }}
              >
                <span style={{ color: BRAND }}>{item.icon}</span>
              </div>
              <h3 className="font-semibold text-gray-900 text-sm sm:text-base mb-2">
                {item.title}
              </h3>
              <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

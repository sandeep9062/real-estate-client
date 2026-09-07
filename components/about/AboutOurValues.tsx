"use client";

import React from "react";
import { ShieldCheck, Lightbulb, Users, Eye, MapPin } from "lucide-react";
import { motion } from "framer-motion";

const BRAND = "#4161df";
const INK = "#161A2E";
const INK_SOFT = "#5C5F73";

const values = [
  {
    icon: Eye,
    title: "Transparency",
    desc: "No hidden fees, no inflated prices, no misleading claims. Just honest, clear information.",
  },
  {
    icon: ShieldCheck,
    title: "Trust",
    desc: "Every data point and listing on our platform is verified and reliable.",
  },
  {
    icon: MapPin,
    title: "Local expertise",
    desc: "Deep, hyperlocal knowledge of every sector and locality in Tricity.",
  },
  {
    icon: Lightbulb,
    title: "Innovation",
    desc: "Constantly building better tools to simplify property decisions.",
  },
  {
    icon: Users,
    title: "Customer first",
    desc: "Every feature we build starts with one question: does this help our users?",
  },
];

export default function AboutOurValues() {
  return (
    <section className="py-16 sm:py-20 md:py-24 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mb-12 sm:mb-16"
        >
          <div className="flex items-center gap-2.5 mb-5">
            <span
              className="w-8 h-[3px] rounded-full"
              style={{ background: BRAND }}
            />
            <span className="text-sm font-medium" style={{ color: BRAND }}>
              Our values
            </span>
          </div>
          <h2
            className="text-2xl sm:text-3xl md:text-[38px] font-bold leading-[1.15]"
            style={{ color: INK }}
          >
            Principles that guide every decision
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-px rounded-2xl overflow-hidden"
          style={{ background: "#E5E7F2" }}
        >
          {values.map((item) => (
            <div key={item.title} className="bg-white p-6 sm:p-7">
              <span
                className="flex items-center justify-center w-11 h-11 rounded-full mb-5"
                style={{ border: `1.5px solid ${BRAND}`, color: BRAND }}
              >
                <item.icon className="w-5 h-5" strokeWidth={1.8} />
              </span>
              <h3
                className="font-semibold text-sm sm:text-base mb-2"
                style={{ color: INK }}
              >
                {item.title}
              </h3>
              <p
                className="text-[13px] sm:text-sm leading-relaxed"
                style={{ color: INK_SOFT }}
              >
                {item.desc}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

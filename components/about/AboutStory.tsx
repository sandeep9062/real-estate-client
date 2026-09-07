"use client";

import React from "react";
import { AlertTriangle, Sparkles, ArrowRight, ArrowDown } from "lucide-react";
import { motion } from "framer-motion";

const INK = "#161A2E";
const INK_SOFT = "#5C5F73";
const BRAND = "#3654C9";
const BRAND_DARK = "#233B85";
const PROBLEM = "#B8503F";
const PROBLEM_BG = "#FBF3F1";
const PROBLEM_LINE = "#EDDAD5";
const SOLUTION = "#1F8A56";
const SOLUTION_BG = "#EEF8F2";
const SOLUTION_LINE = "#D6EBDF";

const problems = [
  "Information overload with no reliable filter",
  "Fake and duplicate listings wasting your time",
  "Misleading pricing with hidden brokerage fees",
  "Confusing builder claims with no data to verify",
  "Zero transparency in deal comparisons",
];

const solutions = [
  "Hyperlocal data organized sector by sector",
  "Every listing verified for accuracy",
  "Transparent pricing, no hidden charges",
  "Market intelligence for confident decisions",
  "Recommendations personalized to your needs",
];

function ListPanel({ tone, label, icon, items }: { tone: string; label: string; icon: React.ReactNode; items: string[] }) {
  const isProblem = tone === "problem";
  const accent = isProblem ? PROBLEM : SOLUTION;
  const bg = isProblem ? PROBLEM_BG : SOLUTION_BG;
  const line = isProblem ? PROBLEM_LINE : SOLUTION_LINE;

  return (
    <div
      className="rounded-xl px-5 py-5 sm:px-6 sm:py-6"
      style={{ background: bg, border: `1px solid ${line}` }}
    >
      <div className="flex items-center gap-2.5 mb-4">
        <span
          className="flex items-center justify-center w-7 h-7 rounded-full shrink-0"
          style={{ background: "#fff", color: accent }}
        >
          {icon}
        </span>
        <h3
          className="text-[15px] sm:text-base font-semibold"
          style={{ color: accent }}
        >
          {label}
        </h3>
      </div>
      <ul className="space-y-2.5">
        {items.map((item: string) => (
          <li
            key={item}
            className="flex items-start gap-2.5 text-[13px] sm:text-sm leading-relaxed"
            style={{ color: isProblem ? "#7A4237" : "#2E5B44" }}
          >
            <span
              className="mt-[7px] w-1.5 h-1.5 rounded-full shrink-0"
              style={{ background: accent }}
            />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function AboutStory() {
  return (
    <section className="relative py-14 sm:py-20 md:py-28 px-4 sm:px-6 bg-white overflow-hidden">
      {/* decorative backdrop, echoes the skyline / dot motif from the brand mascot art */}
      <div
        className="pointer-events-none absolute -top-16 -right-16 w-56 h-56 sm:w-72 sm:h-72 rounded-full opacity-[0.06]"
        style={{ background: BRAND }}
      />
      <div
        className="pointer-events-none absolute bottom-10 -left-10 w-32 h-32 rounded-full opacity-[0.05]"
        style={{ background: BRAND }}
      />

      <div className="relative max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_1fr] gap-12 lg:gap-16 items-start">
          {/* Left: narrative */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-2.5 mb-5">
              <span
                className="w-8 h-[3px] rounded-full"
                style={{ background: BRAND }}
              />
              <span className="text-sm font-medium" style={{ color: BRAND }}>
                Our story
              </span>
            </div>

            <h2
              className="text-[28px] leading-[1.15] sm:text-4xl md:text-[42px] md:leading-[1.12] font-bold mb-6"
              style={{ color: INK }}
            >
              Built to bring clarity to property decisions
            </h2>

            <div
              className="space-y-4 text-[15px] sm:text-base leading-[1.7] max-w-[52ch]"
              style={{ color: INK_SOFT }}
            >
              <p>
                If you&apos;ve ever tried buying a property in Chandigarh,
                Mohali, or Panchkula, you already know the problem.
              </p>
              <p>
                Information is scattered, listings are duplicated, prices are
                inflated, and every website claims to be the most trusted
                partner.
              </p>
              <p>
                PropertyBulbul was built to change that &mdash; not as another
                real estate consultant, but as a{" "}
                <span className="font-semibold" style={{ color: INK }}>
                  technology platform that organizes Tricity&apos;s property
                  market
                </span>{" "}
                around what actually matters: data, transparency, and informed
                decisions.
              </p>
              <p>
                The problem was never a lack of properties. It was a lack of
                reliable information, so we set out to give every buyer, seller,
                investor, and NRI the same quality of market intelligence that
                institutional investors have.
              </p>
              <p>
                Today, PropertyBulbul is the closest thing Tricity has to a
                centralized property intelligence layer &mdash; helping
                thousands of people navigate the market with clarity.
              </p>
            </div>
          </motion.div>

          {/* Right: problem -> solution */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="w-full"
          >
            <ListPanel
              tone="problem"
              label="Where buyers get stuck"
              icon={<AlertTriangle className="w-4 h-4" />}
              items={problems}
            />

            <div className="flex justify-center py-2">
              <span
                className="flex items-center justify-center w-8 h-8 rounded-full"
                style={{ background: "#EEF1FC", color: BRAND_DARK }}
              >
                <ArrowDown className="w-4 h-4 sm:hidden" />
                <ArrowRight className="w-4 h-4 hidden sm:block lg:hidden xl:block" />
                <ArrowDown className="w-4 h-4 hidden lg:block xl:hidden" />
              </span>
            </div>

            <ListPanel
              tone="solution"
              label="How PropertyBulbul fixes it"
              icon={<Sparkles className="w-4 h-4" />}
              items={solutions}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

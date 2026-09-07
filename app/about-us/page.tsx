"use client";

import React from "react";
import Image from "next/image";
import {
  BarChart3,
  ShieldCheck,
  Sparkles,
  Eye,
  Target,
  Building2,
  Search,
  TrendingUp,
  Home,
  PieChart,
  Globe,
  Users,
  ArrowRight,
  MapPin,
  CheckCircle2,
  Lightbulb,
  HeartHandshake,
  LineChart,
  Layers,
} from "lucide-react";
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

const AboutPage = () => {
  return (
    <div className="w-full bg-white overflow-x-hidden">
      {/* HERO — white-background illustration banner, matches ContactBanner layout */}
      <section className="relative w-full bg-white">
        {/* MOBILE / TABLET: image shown in full (no crop), content stacked below */}
        <div className="md:hidden pt-16">
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
                  PropertyBulbul combines hyperlocal expertise, verified
                  property data, and smart technology to help buyers, sellers,
                  investors, and NRIs across Chandigarh, Mohali, Panchkula,
                  Zirakpur, Kharar &amp; New Chandigarh make informed, confident
                  property decisions.
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

      {/* OUR STORY */}
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
                  inflated. Builder claims are confusing. And every website
                  claims to be &ldquo;the most trusted partner.&rdquo;
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
                  It was a lack of reliable information. So we set out to build
                  a platform that gives every buyer, seller, investor, and NRI
                  the same quality of market intelligence that institutional
                  investors have.
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

      {/* MISSION */}
      <section
        className="relative py-16 sm:py-20 md:py-24 px-4 overflow-hidden"
        style={{ background: BRAND }}
      >
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "radial-gradient(circle, white 1.5px, transparent 1.5px)",
            backgroundSize: "32px 32px",
          }}
        />

        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white text-xs font-semibold tracking-[0.15em] uppercase px-5 py-2 rounded-full mb-6">
              <Target className="w-3.5 h-3.5" />
              Our Mission
            </span>

            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight max-w-3xl mx-auto">
              &ldquo;To make every property decision in Tricity transparent,
              data-driven, and confidence-inspiring.&rdquo;
            </h2>

            <p className="mt-6 text-blue-100 text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
              We&apos;re not in the business of closing deals. We&apos;re in the
              business of empowering decisions &mdash; with verified data,
              hyperlocal intelligence, and technology that puts the power back
              in your hands.
            </p>
          </motion.div>
        </div>
      </section>

      {/* WHAT MAKES PROPERTYBULBUL DIFFERENT */}
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

      {/* OUR VISION */}
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
                every property decision is backed by data, powered by
                technology, and driven by transparency &mdash; not guesswork or
                sales pressure.
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
                  background:
                    "linear-gradient(135deg, #eef1ff 0%, #ffffff 100%)",
                }}
              >
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5" style={{ color: BRAND }} />
                  Our North Star
                </h3>
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-4">
                  We measure success not by the number of deals closed, but by
                  the number of decisions made better. Every feature, every data
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

      {/* WHO WE HELP */}
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
              <Users className="w-4 h-4" />
              Who We Help
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
              Built for Everyone Who{" "}
              <span className="text-indigo-600">Makes Property Decisions</span>
            </h2>
            <p className="text-gray-500 mt-3 max-w-2xl mx-auto text-sm sm:text-base">
              Whether you are buying your first home or investing in your tenth
              property, PropertyBulbul gives you the intelligence you need.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <Home className="w-6 h-6 text-white" />,
                title: "Home Buyers",
                benefits: [
                  "Verified listings with accurate pricing",
                  "Locality insights and sector comparisons",
                  "Smart filters to find your perfect match",
                ],
              },
              {
                icon: <TrendingUp className="w-6 h-6 text-white" />,
                title: "Property Investors",
                benefits: [
                  "Market intelligence and price trends",
                  "Growth potential analysis by sector",
                  "Data-driven investment recommendations",
                ],
              },
              {
                icon: <Globe className="w-6 h-6 text-white" />,
                title: "NRIs",
                benefits: [
                  "Remote property exploration tools",
                  "Verified listings with complete transparency",
                  "Dedicated support for NRI buyers",
                ],
              },
              {
                icon: <Building2 className="w-6 h-6 text-white" />,
                title: "Sellers",
                benefits: [
                  "Reach genuine, pre-qualified buyers",
                  "Market pricing insights for the best value",
                  "Maximum visibility across Tricity",
                ],
              },
              {
                icon: <BarChart3 className="w-6 h-6 text-white" />,
                title: "Builders and Developers",
                benefits: [
                  "Showcase projects to targeted audiences",
                  "Data-backed market positioning",
                  "Lead generation from serious buyers",
                ],
              },
              {
                icon: <Users className="w-6 h-6 text-white" />,
                title: "Real Estate Professionals",
                benefits: [
                  "Platform to reach more clients",
                  "Market data to advise better",
                  "Tools to grow your business",
                ],
              },
            ].map((item) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
              >
                <div className="p-6 sm:p-8">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                    style={{ background: BRAND }}
                  >
                    {item.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    {item.title}
                  </h3>
                  <ul className="space-y-2.5">
                    {item.benefits.map((b) => (
                      <li
                        key={b}
                        className="flex items-start gap-2.5 text-gray-600 text-sm"
                      >
                        <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-green-500" />
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* OUR VALUES */}
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

      {/* PROPERTYBULBUL TODAY */}
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

      {/* FINAL CTA */}
      <section
        className="relative w-full overflow-hidden py-20 sm:py-28 px-4"
        style={{ background: BRAND }}
      >
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              "radial-gradient(circle, white 1.5px, transparent 1.5px)",
            backgroundSize: "32px 32px",
          }}
        />
        <div className="absolute top-0 left-0 w-full overflow-hidden leading-[0]">
          <svg
            viewBox="0 0 1440 60"
            preserveAspectRatio="none"
            className="w-full h-10 sm:h-14 fill-white"
          >
            <path d="M0,40 C480,0 960,60 1440,20 L1440,0 L0,0 Z" />
          </svg>
        </div>

        <div className="relative max-w-3xl mx-auto flex flex-col items-center text-center pt-4">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-white/20 border border-white/30 text-white text-xs font-semibold tracking-[0.15em] uppercase px-5 py-2 rounded-full mb-8"
          >
            <Target className="w-3.5 h-3.5" />
            Start Your Journey
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight"
          >
            Make Smarter <br className="hidden sm:block" />
            Property Decisions
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-blue-100 mt-3 sm:mt-4 max-w-xl text-xs sm:text-sm md:text-base leading-relaxed"
          >
            Join thousands of users who rely on PropertyBulbul for transparent,
            data-driven property decisions across Tricity. No sales pressure.
            Just clarity.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto"
          >
            <Link
              href="/properties"
              className="inline-flex items-center justify-center gap-2 bg-white font-bold text-sm sm:text-base px-6 sm:px-8 py-3.5 sm:py-4 rounded-full shadow-xl hover:bg-gray-100 hover:scale-105 transition-all duration-200"
              style={{ color: BRAND }}
            >
              <Search className="w-4 h-4" /> Explore Properties{" "}
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 bg-transparent border-2 border-white/50 text-white font-bold text-sm sm:text-base px-6 sm:px-8 py-3.5 sm:py-4 rounded-full hover:bg-white/10 transition-all duration-200"
            >
              Talk to Our Team
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;

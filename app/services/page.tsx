"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";
import {
  FaHome,
  FaBuilding,
  FaWarehouse,
  FaBed,
  FaMapMarkedAlt,
  FaHandshake,
  FaChartLine,
  FaShieldAlt,
  FaHeadset,
  FaUserTie,
  FaClipboardCheck,
  FaSearch,
  FaCheckCircle,
  FaFileAlt,
  FaBullhorn,
  FaRobot,
  FaWhatsapp,
} from "react-icons/fa";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
interface ServiceCardProps {
  icon: React.ReactNode;
  title: string;
  desc: string;
  badge?: string;
  badgeColor?: string;
  comingSoon?: boolean;
}

interface WhyCardProps {
  icon: React.ReactNode;
  title: string;
  desc: string;
}

interface StepProps {
  step: string;
  title: string;
  desc: string;
  delay: number;
  icon: React.ReactNode;
}

// ─────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────
const ServicesPage = () => {
  const { ref: statsRef, inView: statsInView } = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });

  return (
    <div className="w-full bg-white dark:bg-[#0F111A]">
      {/* ══════════════════════════════════════
          HERO
      ══════════════════════════════════════ */}
      <section className="relative bg-background text-foreground pt-20 sm:pt-24 md:pt-28 pb-8 sm:pb-10 overflow-hidden">
        {/* Background blobs */}
        <div
          aria-hidden="true"
          className="absolute inset-0 grid grid-cols-2 -space-x-52 opacity-40 dark:opacity-20"
        >
          <div className="blur-[106px] h-48 bg-gradient-to-br from-[#4161df] to-purple-400 dark:from-blue-700" />
          <div className="blur-[106px] h-32 bg-gradient-to-r from-cyan-400 to-sky-300 dark:to-indigo-600" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ y: "1rem", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="inline-flex items-center gap-2 bg-[#4161df]/10 border border-[#4161df]/20 rounded-full px-4 py-1.5 text-[#4161df] text-xs font-semibold mb-4 tracking-wider uppercase"
            >
              Tricity's Most Trusted Platform
            </motion.div>

            <motion.h1
              initial={{ y: "2rem", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1.2, type: "spring" }}
              className="font-extrabold text-2xl sm:text-3xl md:text-4xl lg:text-5xl tracking-tight leading-[1.1] text-slate-900 dark:text-white"
            >
              Every Property Service
              <br className="hidden sm:block" />
              <span className="text-[#4161df]">
                Tricity Needs — In One Place
              </span>
            </motion.h1>

            <motion.p
              initial={{ y: "1.5rem", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1.2, delay: 0.2, type: "spring" }}
              className="mt-3 text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-300 max-w-2xl"
            >
              Buy, rent, sell, invest — no hidden fees, no spam calls, no fake
              listings. Built exclusively for Chandigarh, Mohali, Panchkula,
              Zirakpur and Kharar.
            </motion.p>

            <motion.div
              initial={{ y: "1.5rem", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1.2, delay: 0.4, type: "spring" }}
              className="mt-5 flex flex-wrap gap-3 justify-center"
            >
              <Link
                href="/contact"
                className="bg-[#4161df] text-white px-6 py-2.5 rounded-full font-semibold text-xs sm:text-sm hover:bg-[#3451c7] transition-all transform hover:scale-105 shadow-lg hover:shadow-[#4161df]/30"
              >
                Get Free Consultation
              </Link>
              <Link
                href="/properties"
                className="border-2 border-[#4161df] text-[#4161df] dark:text-white dark:border-white px-6 py-2.5 rounded-full font-semibold text-xs sm:text-sm hover:bg-[#4161df] hover:text-white transition-all"
              >
                Browse Properties
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          STATS STRIP
      ══════════════════════════════════════ */}
      <section
        ref={statsRef}
        className="bg-white dark:bg-[#141824] border-y border-gray-100 dark:border-gray-800 py-6 px-4"
      >
        <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {[
            { end: 200, suffix: "+", prefix: "", label: "Verified Listings" },
            { end: 0, suffix: "", prefix: "", label: "Spam Calls Ever" },
            { end: 5, suffix: "", prefix: "", label: "Tricity Cities" },
            {
              end: 0,
              suffix: "",
              prefix: "₹",
              label: "Brokerage for Students",
            },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="text-2xl sm:text-3xl font-bold text-[#4161df]">
                {stat.prefix}
                {statsInView ? (
                  <CountUp start={0} end={stat.end} duration={3} />
                ) : (
                  "0"
                )}
                {stat.suffix}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════
          SERVICES GRID
      ══════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10 md:py-14">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <span className="text-[#4161df] font-semibold uppercase tracking-wider text-xs">
            What We Offer
          </span>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white mt-1">
            Complete Real Estate Solutions
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm max-w-2xl mx-auto mt-1">
            From property search to legal assistance — everything you need in
            Tricity.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {/* Live services */}
          <ServiceCard
            icon={<FaBuilding />}
            title="Rent a Home"
            desc="Find verified rental flats, apartments, and builder floors across Tricity. Zero brokerage for Pro Seeker members. Direct WhatsApp contact with landlords — no spam calls ever."
            badge="MOST POPULAR"
          />
          <ServiceCard
            icon={<FaRobot />}
            title="AI Property Search"
            desc="Type exactly what you need in plain English — '2BHK near IT Park Mohali under ₹20,000' — and our AI instantly finds the best matches. No other Tricity portal has this."
            badge="AI POWERED"
            badgeColor="#7c3aed"
          />
          <ServiceCard
            icon={<FaFileAlt />}
            title="Instant PDF Brochures"
            desc="Agents generate professional, branded property brochures in one click. Auto-filled with photos, price, specs, and contact info. Ready to share on WhatsApp instantly."
            badge="UNIQUE"
            badgeColor="#059669"
          />
          <ServiceCard
            icon={<FaHome />}
            title="Buy a Property"
            desc="Verified residential properties for sale across Chandigarh, Mohali, Panchkula, Zirakpur, and Kharar. Direct agent contact, transparent pricing, no hidden fees."
          />
          <ServiceCard
            icon={<FaBullhorn />}
            title="Sell a Property"
            desc="List your property for free and reach thousands of active buyers in Tricity. Professional listing page with photos, PDF brochure, and direct WhatsApp leads to you."
          />
          <ServiceCard
            icon={<FaMapMarkedAlt />}
            title="Plots & Land"
            desc="Residential plots in Kharar, New Chandigarh, and Mullanpur — Tricity's fastest growing areas. Verified listings with clear ownership details and pricing."
          />
          <ServiceCard
            icon={<FaBed />}
            title="PG & Co-Living"
            desc="Verified PGs and shared living near Chandigarh University, Panjab University, PGIMER, and Mohali IT Park. Safe, affordable, all amenities included."
          />
          <ServiceCard
            icon={<FaWarehouse />}
            title="Commercial Properties"
            desc="Shops, offices, and showrooms in prime Tricity locations. Verified listings with direct owner contact and transparent pricing."
          />
          <ServiceCard
            icon={<FaHandshake />}
            title="Agent Partnership"
            desc="Join PropertyBulbul as a verified agent. Get featured placement, lead analytics, PDF brochures, and a professional agent profile — starting free."
          />

          {/* Coming soon services */}
          <ServiceCard
            icon={<FaWhatsapp />}
            title="Social Auto-Posting"
            desc="Post your listings to Facebook, Instagram, and WhatsApp in one click with AI-generated captions and auto-watermarked photos. Maximum reach with zero effort."
            badge="COMING SOON"
            badgeColor="#6b7280"
            comingSoon
          />
          <ServiceCard
            icon={<FaChartLine />}
            title="Property Investment Insights"
            desc="Data-backed insights on Tricity property appreciation trends, rental yields, and emerging hotspots. Make smarter investment decisions with real local data."
            badge="COMING SOON"
            badgeColor="#6b7280"
            comingSoon
          />
          <ServiceCard
            icon={<FaFileAlt />}
            title="Rent Agreement Builder"
            desc="Generate a legally valid rent agreement in minutes. Fill in tenant and landlord details, download as PDF, and get it registered — all from PropertyBulbul."
            badge="COMING SOON"
            badgeColor="#6b7280"
            comingSoon
          />
        </div>
      </section>

      {/* ══════════════════════════════════════
          WHY PROPERTYBULBUL
      ══════════════════════════════════════ */}
      <section className="w-full bg-gray-50 dark:bg-[#141824] py-10 md:py-14 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <span className="text-[#4161df] font-semibold uppercase tracking-wider text-xs">
              Why PropertyBulbul
            </span>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white mt-1">
              What makes us different from 99acres & NoBroker
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm max-w-2xl mx-auto mt-1">
              We are the only platform built exclusively for Tricity — not a
              national platform trying to cover 50 cities at once.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            <WhyCard
              icon={<FaShieldAlt />}
              title="Verified Listings Only"
              desc="Every listing confirmed active before going live. No fake posts. No expired listings still showing."
            />
            <WhyCard
              icon={<FaSearch />}
              title="AI-Powered Search"
              desc="Natural language search that understands exactly what you want. No other Tricity portal has this."
            />
            <WhyCard
              icon={<FaHeadset />}
              title="Zero Spam Calls"
              desc="You initiate contact. No agent calls you randomly. No midnight WhatsApp spam. You stay in control."
            />
            <WhyCard
              icon={<FaChartLine />}
              title="Tricity Data Only"
              desc="100% focused on Chandigarh, Mohali, Panchkula, Zirakpur, Kharar. No irrelevant pan-India noise."
            />
            <WhyCard
              icon={<FaClipboardCheck />}
              title="No Hidden Charges"
              desc="Transparent pricing always. Free to search. Free to list. Paid plans clearly shown at /pricing."
            />
            <WhyCard
              icon={<FaFileAlt />}
              title="PDF Brochure Generator"
              desc="One-click professional brochures for agents. Unique to PropertyBulbul — no other portal offers this."
            />
            <WhyCard
              icon={<FaUserTie />}
              title="Local Founder"
              desc="Built by a Panchkula software engineer who lives in Tricity. Not a Bangalore startup guessing your needs."
            />
            <WhyCard
              icon={<FaCheckCircle />}
              title="Direct WhatsApp Connect"
              desc="Buyers WhatsApp agents or landlords directly from every listing. No forms, no delays, no middleman."
            />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          HOW IT WORKS
      ══════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10 md:py-14">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <span className="text-[#4161df] font-semibold uppercase tracking-wider text-xs">
            Our Process
          </span>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white mt-1">
            Find your property in 3 steps
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm max-w-xl mx-auto mt-1">
            No complicated process. No lengthy forms. Just search, find,
            connect.
          </p>
        </motion.div>

        <div className="relative">
          {/* Connecting line desktop */}
          <div className="hidden lg:block absolute top-1/2 left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-[#4161df]/40 via-[#4161df] to-[#4161df]/40" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 lg:gap-12 relative">
            <ProcessStep
              step="01"
              title="Search with AI"
              desc="Type exactly what you want in plain English. Our AI understands your requirements and filters perfectly matched properties instantly."
              delay={0}
              icon={<FaSearch />}
            />
            <ProcessStep
              step="02"
              title="Browse Verified Listings"
              desc="Every listing is verified as active with real photos and accurate pricing. Download PDF brochures for properties you like."
              delay={0.15}
              icon={<FaClipboardCheck />}
            />
            <ProcessStep
              step="03"
              title="Connect Directly"
              desc="WhatsApp the agent or landlord directly from the listing. No forms, no waiting, no middleman, no spam calls to you."
              delay={0.3}
              icon={<FaWhatsapp />}
            />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          FAQ
      ══════════════════════════════════════ */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-10 md:py-14">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <span className="text-[#4161df] font-semibold uppercase tracking-wider text-xs">
            FAQ
          </span>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white mt-1">
            Common questions
          </h2>
        </motion.div>
        <FAQSection />
      </section>

      {/* ══════════════════════════════════════
          CTA
      ══════════════════════════════════════ */}
      <section className="relative py-12 md:py-16 px-4 sm:px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#0f1d40] to-[#4161df]" />
        <div aria-hidden="true" className="absolute inset-0 opacity-20">
          <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-white blur-3xl" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-cyan-300 blur-3xl" />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white">
              Ready to find your perfect property?
            </h2>
            <p className="text-blue-100 mt-2 text-xs sm:text-sm md:text-base max-w-2xl mx-auto">
              200+ verified listings across Tricity. AI search that understands
              exactly what you need. Zero spam. Zero brokerage for Pro Seeker
              members.
            </p>
            <div className="mt-5 flex flex-wrap gap-3 justify-center">
              <Link
                href="/properties?deal=Rent"
                className="bg-white text-[#1a3270] px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-bold text-xs sm:text-sm hover:bg-gray-100 transition-all transform hover:scale-105 shadow-xl"
              >
                Browse Rentals — Free →
              </Link>
              <Link
                href="/pricing"
                className="border-2 border-white text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-bold text-xs sm:text-sm hover:bg-white/10 transition-all"
              >
                See Pricing Plans
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ServicesPage;

// ─────────────────────────────────────────────
// ServiceCard
// ─────────────────────────────────────────────
const ServiceCard = ({
  icon,
  title,
  desc,
  badge,
  badgeColor = "#4161df",
  comingSoon = false,
}: ServiceCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    viewport={{ once: true }}
    whileHover={{ y: comingSoon ? 0 : -4 }}
    className={`group relative bg-white dark:bg-[#1a1f2e] rounded-xl p-4 sm:p-5 border border-gray-200/80 dark:border-gray-700 transition-all duration-300 overflow-hidden ${
      comingSoon ? "opacity-70" : "hover:shadow-xl"
    }`}
  >
    {/* Hover gradient */}
    {!comingSoon && (
      <div className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity bg-gradient-to-br from-[#4161df] to-purple-600" />
    )}

    {/* Badge */}
    {badge && (
      <span
        className="absolute top-3 right-3 text-white text-[10px] font-bold px-2 py-0.5 rounded-full"
        style={{ background: badgeColor }}
      >
        {badge}
      </span>
    )}

    {/* Icon */}
    <div
      className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center text-white text-sm sm:text-base mb-3 shadow-md transition-transform duration-300 ${
        comingSoon ? "" : "group-hover:scale-110"
      }`}
      style={{ background: comingSoon ? "#9ca3af" : "#4161df" }}
    >
      {icon}
    </div>

    <h3 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white mb-1">
      {title}
    </h3>
    <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm leading-relaxed">
      {desc}
    </p>
  </motion.div>
);

// ─────────────────────────────────────────────
// WhyCard
// ─────────────────────────────────────────────
const WhyCard = ({ icon, title, desc }: WhyCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
    viewport={{ once: true }}
    whileHover={{ y: -3 }}
    className="bg-white dark:bg-[#1a1f2e] p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 dark:border-gray-700 group"
  >
    <div className="w-8 h-8 rounded-md bg-[#4161df]/10 dark:bg-[#4161df]/20 flex items-center justify-center text-[#4161df] text-xs mb-2 group-hover:bg-[#4161df] group-hover:text-white transition-all duration-300">
      {icon}
    </div>
    <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-0.5">
      {title}
    </h3>
    <p className="text-gray-600 dark:text-gray-300 text-xs leading-relaxed">
      {desc}
    </p>
  </motion.div>
);

// ─────────────────────────────────────────────
// ProcessStep
// ─────────────────────────────────────────────
const ProcessStep = ({ step, title, desc, delay, icon }: StepProps) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    viewport={{ once: true }}
    className="bg-white dark:bg-[#1a1f2e] p-6 sm:p-8 rounded-xl text-center relative border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all group"
  >
    {/* Step number bubble */}
    <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-9 h-9 bg-gradient-to-br from-[#4161df] to-purple-600 text-white rounded-full flex items-center justify-center font-bold text-xs shadow-md">
      {step}
    </div>

    <div className="mt-4 mb-3">
      <div className="w-10 h-10 mx-auto rounded-full bg-[#4161df]/10 dark:bg-[#4161df]/20 flex items-center justify-center text-[#4161df] text-sm group-hover:bg-[#4161df] group-hover:text-white transition-all">
        {icon}
      </div>
    </div>

    <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-1">
      {title}
    </h3>
    <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm leading-relaxed">
      {desc}
    </p>
  </motion.div>
);

// ─────────────────────────────────────────────
// FAQ
// ─────────────────────────────────────────────
const FAQSection = () => {
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null);

  const faqs = [
    {
      question: "Is PropertyBulbul free to use?",
      answer:
        "Searching and contacting agents is completely free forever. Agents can list up to 5 properties free. Pro plans start at ₹499/month for agents and ₹299/month for seekers wanting direct landlord access with zero brokerage. Full details at propertybulbul.com/pricing.",
    },
    {
      question: "What types of properties are listed?",
      answer:
        "Rental flats and houses, properties for sale, plots and land, PG and co-living spaces, and commercial properties — all exclusively in Chandigarh, Mohali, Panchkula, Zirakpur, and Kharar.",
    },
    {
      question: "Are listings verified?",
      answer:
        "Yes. Every listing is confirmed as active and genuine before going live. We verify the property is available and photos are real. No fake listings. No already-rented properties still showing.",
    },
    {
      question: "How is this different from 99acres or NoBroker?",
      answer:
        "We are 100% Tricity-focused — every single listing is in Chandigarh, Mohali, Panchkula, Zirakpur, or Kharar. We have AI-powered natural language search, one-click PDF brochures, and zero spam calls. No other Tricity portal offers any of these features.",
    },
    {
      question: "Can students avoid paying brokerage?",
      answer:
        "Yes. Pro Seeker members get exclusive access to owner-direct listings with zero brokerage. Students relocating to Tricity typically save ₹15,000–25,000 per move. At ₹299/month, Pro Seeker pays for itself the first time you find a flat directly from a landlord.",
    },
    {
      question: "I'm an agent — how do I list my properties?",
      answer:
        "Click 'Add Property' in the navbar. Free plan allows up to 5 listings with PDF brochure generation and direct WhatsApp leads. Pro Agent at ₹499/month gives unlimited listings, featured placement, and lead analytics. No upfront payment required to start.",
    },
    {
      question: "How fast can I find a property?",
      answer:
        "Our AI search returns results instantly. Most users find matching properties in under 2 minutes. For urgent relocations, use the 'Post Requirement' feature — we match you with the most relevant listings and notify matching agents immediately.",
    },
    {
      question: "What areas do you cover?",
      answer:
        "Chandigarh (all sectors), Mohali (including Aerocity, IT Park area, all sectors), Panchkula (all sectors), Zirakpur (bypass area, Lohgarh, Patiala road), and Kharar (near Chandigarh University). All of Tricity, nothing outside it.",
    },
  ];

  return (
    <div className="space-y-2 sm:space-y-3">
      {faqs.map((faq, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.04 }}
          viewport={{ once: true }}
          className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-[#1a1f2e]"
        >
          <button
            onClick={() => setActiveIndex(activeIndex === index ? null : index)}
            className={`w-full flex justify-between items-center p-3 sm:p-4 text-left transition-colors ${
              activeIndex === index ? "bg-[#4161df]/5 dark:bg-[#4161df]/10" : ""
            }`}
          >
            <span className="font-semibold text-xs sm:text-sm text-gray-900 dark:text-white pr-3">
              {faq.question}
            </span>
            <div
              className={`flex-shrink-0 w-6 h-6 rounded-full bg-[#4161df]/10 dark:bg-[#4161df]/20 flex items-center justify-center transition-transform duration-300 ${
                activeIndex === index ? "rotate-45" : ""
              }`}
            >
              <svg
                className="h-3 w-3 text-[#4161df]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </div>
          </button>

          <motion.div
            initial={false}
            animate={{
              height: activeIndex === index ? "auto" : 0,
              opacity: activeIndex === index ? 1 : 0,
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-3 sm:px-4 pb-3 sm:pb-4">
              <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm leading-relaxed">
                {faq.answer}
              </p>
            </div>
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
};

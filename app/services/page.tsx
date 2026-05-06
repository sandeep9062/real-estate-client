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
  FaBullhorn,
  FaHandshake,
  FaBalanceScale,
  FaChartLine,
  FaShieldAlt,
  FaHeadset,
  FaFileContract,
  FaUserTie,
  FaClipboardCheck,
  FaSearch,
  FaCheckCircle,
  FaArrowRight,
} from "react-icons/fa";

const ServicesPage = () => {
  const { ref: statsRef, inView: statsInView } = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });

  return (
    <div className="w-full bg-white dark:bg-[#0F111A]">
      {/* ===== HERO SECTION ===== */}
      <section className="relative bg-background text-foreground pt-20 sm:pt-24 md:pt-28 pb-8 sm:pb-10 overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute inset-0 grid grid-cols-2 -space-x-52 opacity-40 dark:opacity-20"
        >
          <div className="blur-[106px] h-48 bg-gradient-to-br from-[#4161df] to-purple-400 dark:from-blue-700" />
          <div className="blur-[106px] h-32 bg-gradient-to-r from-cyan-400 to-sky-300 dark:to-indigo-600" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
            <motion.h1
              initial={{ y: "2rem", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1.2, type: "spring" }}
              className="font-extrabold text-2xl sm:text-3xl md:text-4xl lg:text-5xl tracking-tight leading-[1.1] text-slate-900 dark:text-white"
            >
              Comprehensive <br className="hidden sm:block" />
              <span className="text-[#4161df]">Real Estate</span> Services
            </motion.h1>
            <motion.p
              initial={{ y: "1.5rem", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1.2, delay: 0.2, type: "spring" }}
              className="mt-2 sm:mt-3 text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-300 max-w-2xl"
            >
              From buying your dream home to smart investments, we offer a
              complete suite of real estate services across Tricity.
            </motion.p>
            <motion.div
              initial={{ y: "1.5rem", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1.2, delay: 0.4, type: "spring" }}
              className="mt-4 sm:mt-5 flex flex-wrap gap-3 justify-center"
            >
              <Link
                href="/contact"
                className="bg-[#4161df] text-white px-5 sm:px-6 py-2 sm:py-3 rounded-full font-semibold text-xs sm:text-sm hover:bg-[#3451c7] transition-all transform hover:scale-105 shadow-lg hover:shadow-[#4161df]/30"
              >
                Get Free Consultation
              </Link>
              <Link
                href="/properties"
                className="border-2 border-[#4161df] text-[#4161df] dark:text-white dark:border-white px-5 sm:px-6 py-2 sm:py-3 rounded-full font-semibold text-xs sm:text-sm hover:bg-[#4161df] hover:text-white transition-all"
              >
                Browse Properties
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== SERVICES SECTION ===== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10 md:py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-6 sm:mb-8"
        >
          <span className="text-[#4161df] font-semibold uppercase tracking-wider text-xs">
            What We Offer
          </span>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white mt-1">
            Complete Real Estate Solutions
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm max-w-2xl mx-auto mt-1">
            From property search to legal assistance — we've got you covered.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          <ServiceCard
            icon={<FaHome />}
            title="Buy a Property"
            desc="Find your perfect home from thousands of verified listings across Chandigarh, Mohali, Panchkula, Zirakpur, and Kharar. Our experts guide you through site visits, negotiations, and complete documentation."
          />
          <ServiceCard
            icon={<FaBuilding />}
            title="Rent a Home"
            desc="Explore premium rental options including apartments, builder floors, and independent houses with zero brokerage. Transparent pricing and verified landlords across Tricity."
          />
          <ServiceCard
            icon={<FaBullhorn />}
            title="Sell a Property"
            desc="Get the best value for your property with premium marketing, professional photography, virtual tours, and direct connections with thousands of verified buyers."
          />
          <ServiceCard
            icon={<FaChartLine />}
            title="Property Investment"
            desc="Discover high-return opportunities in residential and commercial properties. Get data-backed insights on appreciation trends, rental yields, and emerging hotspots."
          />
          <ServiceCard
            icon={<FaWarehouse />}
            title="Commercial Properties"
            desc="Shops, offices, and warehouses across prime locations in Chandigarh, Mohali, and Panchkula. Expert assistance for leasing, buying, and selling commercial real estate."
          />
          <ServiceCard
            icon={<FaBed />}
            title="PG & Co-Living"
            desc="Affordable and verified PGs, rooms, and shared living spaces near colleges, IT hubs, and business districts. Safe living with all amenities included."
            badge="POPULAR"
          />
          <ServiceCard
            icon={<FaMapMarkedAlt />}
            title="Plots & Land"
            desc="Residential and agricultural plots in the fastest-growing sectors of Tricity. Perfect for building your dream home or making a long-term land investment."
          />
          <ServiceCard
            icon={<FaHandshake />}
            title="Project Marketing"
            desc="End-to-end marketing solutions for builders and developers including branding, digital campaigns, lead generation, and sales closure support."
          />
          <ServiceCard
            icon={<FaBalanceScale />}
            title="Legal Assistance"
            desc="Navigate property legalities with ease. We provide support for title verification, sale agreements, home loan processing, RERA compliance, and registration."
          />
        </div>
      </section>

      {/* ===== WHY CHOOSE US ===== */}
      <section className="w-full bg-gray-50 dark:bg-[#141824] py-8 sm:py-10 md:py-12 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-6 sm:mb-8"
          >
            <span className="text-[#4161df] font-semibold uppercase tracking-wider text-xs">
              Why PropertyBulbul
            </span>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white mt-1">
              Why Choose Our Services?
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm max-w-2xl mx-auto mt-1">
              Transparency, trust, and exceptional service — making your journey
              smooth.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            <WhyChooseCard
              icon={<FaShieldAlt />}
              title="Verified Properties"
              desc="100% safe, legal, dispute-free deals."
            />
            <WhyChooseCard
              icon={<FaUserTie />}
              title="Expert Guidance"
              desc="Personalized advice from experienced pros."
            />
            <WhyChooseCard
              icon={<FaHeadset />}
              title="End-to-End Support"
              desc="From selection to paperwork, we handle it all."
            />
            <WhyChooseCard
              icon={<FaChartLine />}
              title="Market Insights"
              desc="Data-backed Tricity real estate analytics."
            />
            <WhyChooseCard
              icon={<FaClipboardCheck />}
              title="Zero Price Manipulation"
              desc="Transparent prices. No hidden charges."
            />
            <WhyChooseCard
              icon={<FaFileContract />}
              title="Legal & Financial Help"
              desc="Documentation, loans, verification & more."
            />
            <WhyChooseCard
              icon={<FaSearch />}
              title="Personalized Matching"
              desc="AI-powered recommendations for you."
            />
            <WhyChooseCard
              icon={<FaCheckCircle />}
              title="Post-Sale Support"
              desc="Move-in, registrations & continued help."
            />
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10 md:py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-6 sm:mb-8"
        >
          <span className="text-[#4161df] font-semibold uppercase tracking-wider text-xs">
            Our Process
          </span>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white mt-1">
            How It Works
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm max-w-2xl mx-auto mt-1">
            Simple, transparent process to find your perfect property.
          </p>
        </motion.div>

        <div className="relative">
          <div className="hidden lg:block absolute top-1/2 left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-[#4161df]/40 via-[#4161df] to-[#4161df]/40"></div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 lg:gap-12 relative">
            <ProcessStep
              step="01"
              title="Consultation"
              desc="We understand your needs, preferences, and budget."
              delay={0}
            />
            <ProcessStep
              step="02"
              title="Property Matching"
              desc="AI + experts shortlist the best properties for you."
              delay={0.15}
            />
            <ProcessStep
              step="03"
              title="Site Visits & Finalization"
              desc="We arrange visits and ensure a smooth closing."
              delay={0.3}
            />
          </div>
        </div>
      </section>

      {/* ===== FAQ SECTION ===== */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-10 md:py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-6 sm:mb-8"
        >
          <span className="text-[#4161df] font-semibold uppercase tracking-wider text-xs">
            FAQ
          </span>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white mt-1">
            Frequently Asked Questions
          </h2>
        </motion.div>
        <FAQ />
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="relative py-10 sm:py-12 md:py-14 px-4 sm:px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#4161df] to-[#2d4bc7]" />
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
              Ready to Get Started?
            </h2>
            <p className="text-blue-100 mt-2 text-xs sm:text-sm md:text-base max-w-2xl mx-auto">
              Whether you're buying, selling, renting, or investing — get a free
              consultation today.
            </p>
            <div className="mt-4 sm:mt-5 flex flex-wrap gap-3 justify-center">
              <Link
                href="/contact"
                className="bg-white text-[#4161df] px-6 sm:px-8 py-2 sm:py-3 rounded-full font-bold text-xs sm:text-sm hover:bg-gray-100 transition-all transform hover:scale-105 shadow-xl"
              >
                Contact Us Now
              </Link>
              <Link
                href="/post-requirement"
                className="border-2 border-white text-white px-6 sm:px-8 py-2 sm:py-3 rounded-full font-bold text-xs sm:text-sm hover:bg-white/10 transition-all"
              >
                Post Your Requirement
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ServicesPage;

/* ===== SERVICE CARD ===== */
const ServiceCard = ({
  icon,
  title,
  desc,
  badge,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  badge?: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    viewport={{ once: true }}
    whileHover={{ y: -4 }}
    className="group relative bg-white dark:bg-[#1a1f2e] rounded-xl p-4 sm:p-5 border border-gray-200/80 dark:border-gray-700 hover:shadow-xl transition-all duration-300 overflow-hidden"
  >
    <div className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity bg-gradient-to-br from-[#4161df] to-purple-600" />

    {badge && (
      <span className="absolute top-3 right-3 bg-[#4161df] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
        {badge}
      </span>
    )}

    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-[#4161df] flex items-center justify-center text-white text-sm sm:text-base mb-3 shadow-md group-hover:scale-110 transition-transform duration-300">
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

/* ===== WHY CHOOSE CARD ===== */
const WhyChooseCard = ({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) => (
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

/* ===== PROCESS STEP ===== */
const ProcessStep = ({
  step,
  title,
  desc,
  delay,
}: {
  step: string;
  title: string;
  desc: string;
  delay: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    viewport={{ once: true }}
    className="bg-white dark:bg-[#1a1f2e] p-6 sm:p-8 rounded-xl text-center relative border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all group"
  >
    <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-9 h-9 bg-gradient-to-br from-[#4161df] to-purple-600 text-white rounded-full flex items-center justify-center font-bold text-xs shadow-md">
      {step}
    </div>
    <div className="mt-4 mb-3">
      <div className="w-10 h-10 mx-auto rounded-full bg-[#4161df]/10 dark:bg-[#4161df]/20 flex items-center justify-center text-[#4161df] text-sm group-hover:bg-[#4161df] group-hover:text-white transition-all">
        {step === "01" ? (
          <FaUserTie />
        ) : step === "02" ? (
          <FaSearch />
        ) : (
          <FaClipboardCheck />
        )}
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

/* ===== FAQ COMPONENT ===== */
const FAQ = () => {
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null);

  const faqs = [
    {
      question: "What types of properties do you deal with?",
      answer:
        "Residential apartments, villas, commercial spaces, plots, and PG accommodations across Chandigarh, Mohali, Panchkula, Zirakpur, and Kharar.",
    },
    {
      question: "Are listings on your platform verified?",
      answer:
        "Yes, every property goes through rigorous verification for authenticity, legal clearance, and accurate documentation.",
    },
    {
      question: "Do you provide legal and financial assistance?",
      answer:
        "Yes, our legal and financial experts assist with title verification, paperwork, home loans, and compliance.",
    },
    {
      question: "What are your service charges?",
      answer:
        "Our charges are transparent and competitive with no hidden costs. Contact us for a detailed quote.",
    },
    {
      question: "How fast can I find a property?",
      answer:
        "Our AI-powered system shortlists properties within 24-48 hours. Site visits and finalization within a week.",
    },
    {
      question: "Do you offer post-purchase support?",
      answer:
        "Yes, including property management, tenant sourcing, rent collection, and maintenance coordination.",
    },
  ];

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="space-y-2 sm:space-y-3">
      {faqs.map((faq, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
          viewport={{ once: true }}
          className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-[#1a1f2e]"
        >
          <button
            onClick={() => toggleFAQ(index)}
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
                xmlns="http://www.w3.org/2000/svg"
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

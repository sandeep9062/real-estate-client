"use client";

import React from "react";
import Link from "next/link";

const ServicesPage = () => {
  return (
    <div className="w-full bg-white dark:bg-[#0F111A]">
      {/* Hero Section */}
      <div className="w-full bg-gradient-to-r from-gray-800 to-black text-white py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 flex flex-col items-center text-center">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold">
          Comprehensive Real Estate Services
        </h1>
        <p className="mt-3 sm:mt-4 text-sm sm:text-base md:text-lg text-gray-300 max-w-3xl px-2">
          From buying your dream home to making smart investments, we offer a
          complete suite of services to cater to all your real estate needs.
        </p>
      </div>

      {/* Services Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-12 md:py-16 lg:py-20">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-center text-black dark:text-white mb-8 sm:mb-10 md:mb-12">
          How We Can Help You
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
          <ServiceCard
            icon={<HomeIcon />}
            title="Buy a Property"
            desc="Find your perfect home from thousands of verified listings. Our experts guide you through every step of the buying process."
          />
          <ServiceCard
            icon={<TagIcon />}
            title="Sell a Property"
            desc="Get the best value for your property. We use premium marketing and connect you with a network of verified buyers."
          />
          <ServiceCard
            icon={<TrendingUpIcon />}
            title="Property Investment"
            desc="Discover high-return investment opportunities in residential and commercial properties, curated by our market experts."
          />
          <ServiceCard
            icon={<BriefcaseIcon />}
            title="Project Marketing"
            desc="Comprehensive marketing solutions for builders and developers, from branding and lead generation to sales."
          />
          <ServiceCard
            icon={<UsersIcon />}
            title="Consultation & Advisory"
            desc="Get personalized advice on property valuation, documentation, and market trends from our experienced consultants."
          />
          <ServiceCard
            icon={<ShieldCheckIcon />}
            title="Legal Assistance"
            desc="Navigate the legal complexities with ease. We provide support for paperwork, agreements, and compliance."
          />
          <ServiceCard
            icon={<AcademicCapIcon />}
            title="Student Accommodation"
            desc="Affordable and verified PGs, rooms, and flats for students. We make finding your next home simple and safe."
          />
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="w-full bg-gray-50 dark:bg-[#141824] py-10 sm:py-12 md:py-16 lg:py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-center text-black dark:text-white mb-8 sm:mb-10 md:mb-12">
            Why Choose Our Services?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 text-center">
            <Feature
              icon={<UsersIcon />}
              title="Expert Guidance"
              desc="Our team of experienced professionals provides personalized advice to help you make informed decisions."
            />
            <Feature
              icon={<ShieldCheckIcon />}
              title="Verified Listings"
              desc="We offer a curated selection of legally verified properties to ensure a safe and transparent transaction."
            />
            <Feature
              icon={<BriefcaseIcon />}
              title="End-to-End Support"
              desc="From property selection to legal paperwork, we provide comprehensive support at every step of your journey."
            />
            <Feature
              icon={<TrendingUpIcon />}
              title="Investment Insights"
              desc="Leverage our market expertise to discover high-return investment opportunities and grow your portfolio."
            />
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-12 md:py-16 lg:py-20">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-center text-black dark:text-white mb-8 sm:mb-10 md:mb-12">
          Our Process
        </h2>
        <div className="relative">
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 dark:bg-gray-700"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10 md:gap-12 relative">
            <ProcessStep
              step="01"
              title="Consultation"
              desc="We start with a detailed consultation to understand your needs, preferences, and financial goals."
            />
            <ProcessStep
              step="02"
              title="Property Matching"
              desc="Our system and experts shortlist the best properties that match your criteria from our verified database."
            />
            <ProcessStep
              step="03"
              title="Site Visits & Finalization"
              desc="We arrange site visits and help you finalize the deal, ensuring a smooth and transparent process."
            />
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="w-full bg-white dark:bg-[#0F111A] py-10 sm:py-12 md:py-16 lg:py-20 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-center text-black dark:text-white mb-8 sm:mb-10 md:mb-12">
            Frequently Asked Questions
          </h2>
          <FAQ />
        </div>
      </div>

      {/* CTA Section */}
      <div className="w-full bg-indigo-600 py-12 sm:py-14 md:py-16 lg:py-20 px-4 sm:px-6 flex flex-col items-center text-center">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-white">
          Ready to Get Started?
        </h2>
        <p className="text-indigo-100 mt-2 sm:mt-3 text-sm sm:text-base max-w-2xl px-2">
          Whether you're buying, selling, or investing, our team is ready to
          assist you. Contact us today for a free consultation.
        </p>
        <Link
          href="/contact"
          className="mt-6 sm:mt-8 bg-white text-indigo-600 px-8 sm:px-10 py-3 sm:py-4 rounded-full font-bold text-base sm:text-lg hover:bg-gray-100 transition-transform transform hover:scale-105"
        >
          Contact Us Now
        </Link>
      </div>
    </div>
  );
};

export default ServicesPage;

const ServiceCard = ({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) => (
  <div className="bg-gray-50 dark:bg-[#1a1f2e] rounded-xl p-5 sm:p-6 md:p-8 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 ease-in-out border border-gray-200/80 dark:border-gray-700">
    <div className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full w-12 h-12 sm:w-14 md:w-16 flex items-center justify-center mb-4 sm:mb-6">
      {icon}
    </div>
    <h3 className="text-xl sm:text-2xl font-semibold text-black dark:text-white mb-2 sm:mb-3">
      {title}
    </h3>
    <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base leading-relaxed">
      {desc}
    </p>
  </div>
);

const Feature = ({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) => (
  <div className="bg-white dark:bg-[#1a1f2e] p-5 sm:p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
    <div className="text-indigo-600 dark:text-indigo-400 mb-3 sm:mb-4 inline-block">
      {icon}
    </div>
    <h3 className="text-lg sm:text-xl font-semibold text-black dark:text-white mb-1 sm:mb-2">
      {title}
    </h3>
    <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">
      {desc}
    </p>
  </div>
);

const ProcessStep = ({
  step,
  title,
  desc,
}: {
  step: string;
  title: string;
  desc: string;
}) => (
  <div className="bg-white dark:bg-[#1a1f2e] p-6 sm:p-8 rounded-lg text-center relative border border-gray-100 dark:border-gray-700 shadow-sm">
    <div className="absolute -top-5 sm:-top-6 left-1/2 -translate-x-1/2 bg-indigo-600 text-white rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center font-bold text-base sm:text-lg">
      {step}
    </div>
    <h3 className="text-lg sm:text-xl font-semibold text-black dark:text-white mt-6 sm:mt-8 mb-2 sm:mb-3">
      {title}
    </h3>
    <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">
      {desc}
    </p>
  </div>
);

const FAQ = () => {
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null);

  const faqs = [
    {
      question: "What types of properties do you deal with?",
      answer:
        "We deal with a wide range of properties, including residential apartments, independent houses, commercial spaces, and plots of land.",
    },
    {
      question: "Are the listings on your platform verified?",
      answer:
        "Yes, every property listed on our platform goes through a rigorous verification process to ensure its authenticity and legal clearance.",
    },
    {
      question: "Do you provide legal and financial assistance?",
      answer:
        "Absolutely. We have a dedicated team of legal and financial experts to assist you with paperwork, home loans, and other related services.",
    },
    {
      question: "What are your brokerage or commission charges?",
      answer:
        "Our commission rates are transparent and competitive. They vary depending on the type of service and property. Please contact us for detailed information.",
    },
  ];

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="space-y-3 sm:space-y-4">
      {faqs.map((faq, index) => (
        <div
          key={index}
          className="border border-gray-200 dark:border-gray-700 rounded-lg"
        >
          <button
            onClick={() => toggleFAQ(index)}
            className="w-full flex justify-between items-center p-4 sm:p-5 text-left"
          >
            <span className="font-semibold text-base sm:text-lg text-black dark:text-white pr-4">
              {faq.question}
            </span>
            <span className="text-indigo-600 dark:text-indigo-400 flex-shrink-0">
              {activeIndex === index ? <MinusIcon /> : <PlusIcon />}
            </span>
          </button>
          {activeIndex === index && (
            <div className="p-4 sm:p-5 pt-0 text-gray-600 dark:text-gray-300 text-sm sm:text-base">
              <p>{faq.answer}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

// SVG Icon Components

const PlusIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 sm:h-6 sm:w-6"
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
);

const MinusIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 sm:h-6 sm:w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M18 12H6"
    />
  </svg>
);

const HomeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
    />
  </svg>
);

const TagIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M7 7h.01M7 3h5a2 2 0 012 2v5a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2zm0 0v18"
    />
  </svg>
);

const TrendingUpIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
    />
  </svg>
);

const BriefcaseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
    />
  </svg>
);

const UsersIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.124-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.124-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
    />
  </svg>
);

const ShieldCheckIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 20.944a11.955 11.955 0 0118-8.944c0-1.22-.195-2.403-.568-3.544z"
    />
  </svg>
);

const AcademicCapIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path d="M12 14l9-5-9-5-9 5 9 5z" />
    <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-5.998 12.083 12.083 0 01.665-6.479L12 14z" />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 14l9-5-9-5-9 5 9 5zm0 0v6"
    />
  </svg>
);

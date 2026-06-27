"use client";

import Image from "next/image";
import {
  BadgeCheck,
  BarChart,
  BrainCircuit,
  Filter,
  Home,
  Video,
} from "lucide-react";
import React from "react";

const points = [
  {
    icon: Home,
    title: "Local Market Expertise",
    desc: "Deep understanding of Chandigarh, Mohali, Panchkula, Zirakpur, Kharar, and New Chandigarh — so you get advice that is relevant to your neighborhood.",
  },
  {
    icon: Filter,
    title: "Verified Opportunities",
    desc: "Every listing on our platform is checked for authenticity. No duplicates, no outdated posts — just real properties you can trust.",
  },
  {
    icon: BrainCircuit,
    title: "Personalized Recommendations",
    desc: "Tell us your preferences and budget. We will handpick options that match your needs — saving you time and effort.",
  },
  {
    icon: BadgeCheck,
    title: "Buyer & Investor Support",
    desc: "From property evaluation to paperwork guidance, we support you at every stage of your journey with clarity and confidence.",
  },
  {
    icon: Video,
    title: "Market Insights You Can Use",
    desc: "Stay ahead with up-to-date pricing trends, neighborhood analysis, and data-driven insights from the Tricity real estate market.",
  },
  {
    icon: BarChart,
    title: "Quick & Responsive Support",
    desc: "Have a question? Expect a prompt, helpful response from our team — because we know the market moves fast.",
  },
];

const UniqueSection = () => {
  return (
    <section className="w-full py-16 sm:py-20 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* HEADER */}
        <div className="text-center mb-12 sm:mb-14 lg:mb-18">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight">
            Why Reach Out to{" "}
            <span className="text-[#4161df]">PropertyBulbul?</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-3xl mx-auto">
            We are more than a property listing platform. Think of us as your
            local Tricity partner — here to help you make smarter, more informed
            real estate decisions with confidence.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 xl:gap-20 items-center">
          {/* LEFT - IMAGE MOCKUPS */}
          <div
            className="hidden lg:flex relative justify-center items-center h-full"
            style={{ perspective: "1000px" }}
          >
            <div className="relative w-full max-w-3xl h-[500px] xl:h-[600px] 2xl:h-[770px]">
              {/* Desktop Mockup */}
              <div
                className="absolute top-0 left-0 w-[90%] h-[90%] z-10"
                style={{ transformStyle: "preserve-3d" }}
              >
                <Image
                  src="/desktop.png"
                  alt="Desktop Platform Preview"
                  layout="fill"
                  objectFit="cover"
                  className="rounded-xl shadow-2xl"
                />
              </div>

              {/* Mobile Mockup */}
              <div
                className="absolute bottom-0 right-0 w-[40%] h-[45%] z-20"
                style={{ transformStyle: "preserve-3d" }}
              >
                <Image
                  src="/mobile.jpg"
                  alt="Mobile App Preview"
                  layout="fill"
                  objectFit="cover"
                  className="rounded-xl shadow-2xl"
                />
              </div>
            </div>
          </div>

          {/* RIGHT - FEATURE POINTS */}
          <div className="w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-5 sm:gap-6">
              {points.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div
                    key={idx}
                    className="group bg-white p-5 sm:p-6 rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl border border-slate-100 hover:border-[#4161df]/20"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center rounded-full bg-slate-100 group-hover:bg-[#4161df] transition-colors duration-300 p-3">
                          <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-slate-500 group-hover:text-white transition-colors duration-300" />
                        </div>
                      </div>
                      <div>
                        <h3 className="text-base sm:text-lg font-semibold text-slate-900 group-hover:text-[#4161df] transition-colors">
                          {item.title}
                        </h3>
                        <p className="mt-1 text-sm text-slate-500">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UniqueSection;

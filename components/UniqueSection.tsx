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
    title: "Vast Property Selection",
    desc: "Explore thousands of verified listings, from cozy apartments to luxury estates.",
  },
  {
    icon: Filter,
    title: "Advanced Search Filters",
    desc: "Find your dream home with powerful filters for location, price, amenities, and more.",
  },
  {
    icon: BrainCircuit,
    title: "AI-Powered Recommendations",
    desc: "Our smart algorithm suggests properties tailored to your unique preferences.",
  },
  {
    icon: BadgeCheck,
    title: "Verified Agents & Listings",
    desc: "We ensure every agent and property is legitimate for your peace of mind.",
  },
  {
    icon: Video,
    title: "Seamless Virtual Tours",
    desc: "Experience properties from home with our high-quality 360° virtual tours.",
  },
  {
    icon: BarChart,
    title: "Expert Market Insights",
    desc: "Stay informed with the latest market trends and data-driven insights.",
  },
];

const UniqueSection = () => {
  return (
    <section className="w-full py-12 sm:py-16 lg:py-20 dark:bg-[#0F111A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* HEADER */}
        <div className="text-center mb-10 sm:mb-12 lg:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 dark:text-white leading-tight">
            Why Choose Us for{" "}
            <span className="text-[#4161df]">Your Next Home?</span>
          </h2>
          <p className="mt-3 sm:mt-4 text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto px-2">
            Discover a smarter, simpler, and more transparent way to find your
            perfect property. We are committed to making your real estate
            journey a success.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 items-center">
          {/* LEFT - IMAGE MOCKUPS - Hidden on mobile */}
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

              {/* Mobile Mockup - Overlapping */}
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
              {points.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div
                    key={idx}
                    className="transform bg-white dark:bg-[#1a1f2e] p-4 sm:p-5 lg:p-6 rounded-xl sm:rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl border border-gray-100 dark:border-gray-700"
                  >
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center rounded-full bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 p-2.5 sm:p-3 text-blue-600 dark:text-blue-400">
                          <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                        </div>
                      </div>
                      <div>
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                          {item.title}
                        </h3>
                        <p className="mt-1 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
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

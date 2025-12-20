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
import { motion } from "framer-motion";

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
    <section className="w-full py-20">
      <div className="max-w-7xl mx-auto px-4">
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
            Why Choose Us for{" "}
            <span className="text-[#4161df]">Your Next Home?</span>
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
            Discover a smarter, simpler, and more transparent way to find your
            perfect property. We are committed to making your real estate
            journey a success.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* LEFT - IMAGE MOCKUPS */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            viewport={{ once: true }}
            className="relative flex justify-center items-center h-full"
            style={{ perspective: "1000px" }}
          >
            <div className="relative w-full max-w-3xl h-[770px]">
              {/* Desktop Mockup */}
              <motion.div
                initial={{ x: -20, opacity: 0, rotateY: 15 }}
                whileInView={{ x: 0, opacity: 1, rotateY: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                viewport={{ once: true }}
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
              </motion.div>

              {/* Mobile Mockup - Overlapping */}
              <motion.div
                initial={{ x: 20, y: 20, opacity: 0, rotateY: -15 }}
                whileInView={{ x: 0, y: 0, opacity: 1, rotateY: 0 }}
                transition={{ duration: 0.7, delay: 0.4 }}
                viewport={{ once: true }}
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
              </motion.div>
            </div>
          </motion.div>

          {/* RIGHT - FEATURE POINTS */}
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {points.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    viewport={{ once: true }}
                    className="transform bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center rounded-full bg-gradient-to-br from-blue-50 to-blue-100 p-3 text-blue-600">
                          <Icon className="h-6 w-6" />
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {item.title}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  </motion.div>
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

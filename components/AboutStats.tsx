"use client";

import React from "react";
import { motion } from "framer-motion";
import CountUp from "react-countup";
import { House, Users, MapPin, Award } from "lucide-react";

const AboutStats = () => {
  const stats = [
    {
      icon: <House className="w-10 h-10 text-indigo-600" />,
      label: "Verified Listings",
      value: 181,
    },
    {
      icon: <Users className="w-10 h-10 text-indigo-600" />,
      label: "Major Projects",
      value: 3,
    },
    {
      icon: <MapPin className="w-10 h-10 text-indigo-600" />,
      label: "Cities Covered",
      value: 7,
    },
    {
      icon: <Award className="w-10 h-10 text-indigo-600" />,
      label: "Property Types",
      value: 22,
    },
  ];

  return (
    <section className="w-full pb-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-gray-50 p-8 rounded-lg text-center shadow-sm hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex justify-center items-center mb-4">
                {stat.icon}
              </div>

              <h3 className="text-4xl font-bold text-black mb-2">
                <CountUp end={stat.value} duration={3} />+
              </h3>

              <p className="text-lg text-gray-600">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default AboutStats;

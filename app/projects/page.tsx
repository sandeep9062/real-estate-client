"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  MapPin,
  Home,
  CheckCircle,
  Building2,
  Clock,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";

const ProjectsPage = () => {
  const projects = [
    {
      title: "Lakeview Residency",
      location: "Sector 55, Gurugram",
      image: "/r1.png",
      status: "Under Construction",
      statusColor: "bg-amber-500",
      price: "₹ 1.2 Cr - 2.5 Cr",
      area: "1200 - 2500 sq.ft.",
      features: ["Swimming Pool", "Gymnasium", "Clubhouse", "24/7 Security"],
      type: "Residential",
      units: 150,
    },
    {
      title: "Skyline Homes",
      location: "Golf Course Extension Road, Gurgaon",
      image: "/r2.png",
      status: "Ready to Move",
      statusColor: "bg-green-500",
      price: "₹ 2.8 Cr - 4.5 Cr",
      area: "2800 - 4500 sq.ft.",
      features: ["Rooftop Garden", "Smart Home", "Private Cinema", "Spa"],
      type: "Luxury Apartments",
      units: 80,
    },
    {
      title: "Metro City Heights",
      location: "Noida Sector 78",
      image: "/r3.png",
      status: "Launching Soon",
      statusColor: "bg-blue-500",
      price: "₹ 80 Lac - 1.5 Cr",
      area: "1000 - 1800 sq.ft.",
      features: ["Metro Connectivity", "Shopping Arcade", "Kids Play Area"],
      type: "Residential",
      units: 200,
    },
  ];

  const stats = [
    { value: "20+", label: "Projects Completed" },
    { value: "5000+", label: "Happy Families" },
    { value: "₹500Cr+", label: "Property Value" },
    { value: "15+", label: "Years Experience" },
  ];

  return (
    <div className="w-full bg-white">
      {/* Hero Section */}
      <div className="relative w-full h-[50vh] sm:h-[60vh] text-white">
        <Image
          src="/about-images.jpg"
          alt="Our Premier Projects"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/60 to-black/40 flex flex-col items-center justify-center text-center px-4 sm:px-6">
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold px-2"
          >
            Discover Our{" "}
            <span className="text-[#4161df]">Premier Projects</span>
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-3 sm:mt-4 text-sm sm:text-base md:text-lg text-gray-200 max-w-3xl px-2"
          >
            Explore a curated selection of premium residential and commercial
            projects designed for modern living.
          </motion.p>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex gap-3 sm:gap-4 mt-6 sm:mt-8"
          >
            <Link
              href="#projects"
              className="inline-flex items-center justify-center rounded-full text-white bg-[#4161df] text-xs px-4 py-2 sm:text-sm sm:px-6 sm:py-3 shadow-sm transition-colors hover:bg-[#3456df]"
            >
              View Projects
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-full border border-white/50 text-white text-xs px-4 py-2 sm:text-sm sm:px-6 sm:py-3 transition-colors hover:bg-white/10"
            >
              Contact Us
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gray-50 py-8 sm:py-12 md:py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#4161df]">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm md:text-base text-gray-600 mt-1">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div
        id="projects"
        className="max-w-7xl mx-auto px-4 py-12 sm:py-16 md:py-20"
      >
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-8 sm:mb-12"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-black">
            Our Featured Projects
          </h2>
          <p className="text-sm sm:text-base text-gray-600 mt-2 max-w-2xl mx-auto">
            Handpicked properties that offer the perfect blend of comfort,
            luxury, and investment value.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {projects.map((project, index) => (
            <ProjectCard key={index} project={project} index={index} />
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="w-full bg-gray-50 py-12 sm:py-16 md:py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-2xl sm:text-3xl md:text-4xl font-semibold text-center text-black mb-8 sm:mb-12"
          >
            Why Choose Our Projects?
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 text-center">
            <Feature
              icon={
                <Building2 className="w-8 h-8 sm:w-10 sm:h-10 text-[#4161df]" />
              }
              title="Premium Locations"
              desc="Strategically located projects with excellent connectivity and infrastructure."
            />
            <Feature
              icon={
                <Clock className="w-8 h-8 sm:w-10 sm:h-10 text-[#4161df]" />
              }
              title="Timely Delivery"
              desc="We ensure all our projects are delivered on time with quality construction."
            />
            <Feature
              icon={
                <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-[#4161df]" />
              }
              title="Modern Amenities"
              desc="World-class amenities designed for contemporary lifestyle needs."
            />
            <Feature
              icon={
                <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-[#4161df]" />
              }
              title="RERA Compliant"
              desc="All projects are RERA registered ensuring transparency and trust."
            />
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="w-full bg-[#4161df] py-12 sm:py-16 md:py-20 px-4 flex flex-col items-center text-center">
        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold text-white px-2"
        >
          Interested in Listing Your Project?
        </motion.h2>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          viewport={{ once: true }}
          className="text-sm sm:text-base text-blue-100 mt-3 max-w-2xl px-2"
        >
          Partner with us to reach a wider audience and leverage our expert
          marketing strategies for your project.
        </motion.p>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <Link
            href="/contact"
            className="mt-6 sm:mt-8 bg-white text-[#4161df] px-6 sm:px-8 md:px-10 py-3 sm:py-4 rounded-full font-bold text-base sm:text-lg hover:bg-gray-100 transition-transform transform hover:scale-105 shadow-lg"
          >
            Contact Us for Details
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default ProjectsPage;

const ProjectCard = ({ project, index }: { project: any; index: number }) => (
  <motion.div
    initial={{ y: 30, opacity: 0 }}
    whileInView={{ y: 0, opacity: 1 }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    viewport={{ once: true }}
    className="flex flex-col bg-white rounded-xl sm:rounded-2xl shadow-md border border-gray-200 hover:shadow-xl hover:border-blue-200 transition-all duration-300 overflow-hidden group"
  >
    {/* Image */}
    <div className="relative h-48 sm:h-56 md:h-64 w-full overflow-hidden">
      <Image
        src={project.image}
        alt={project.title}
        fill
        className="object-cover group-hover:scale-105 transition-transform duration-500"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

      {/* Status Badge */}
      <div
        className={`absolute top-3 right-3 ${project.statusColor} text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold shadow-md`}
      >
        {project.status}
      </div>

      {/* Type Badge */}
      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-gray-800 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
        {project.type}
      </div>
    </div>

    {/* Content */}
    <div className="p-4 sm:p-5 md:p-6 flex flex-col grow">
      <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-2">
        {project.title}
      </h3>

      <div className="flex items-center text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">
        <MapPin className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-[#4161df] flex-shrink-0" />
        <span className="line-clamp-1">{project.location}</span>
      </div>

      <div className="flex flex-col sm:flex-row sm:justify-between text-gray-800 mb-4 sm:mb-5 gap-2 sm:gap-0 bg-gray-50 rounded-lg p-3">
        <div className="flex items-center text-sm sm:text-base">
          <span className="text-[#4161df] font-bold">{project.price}</span>
        </div>
        <div className="flex items-center text-sm sm:text-base text-gray-600">
          <Home className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-gray-500 flex-shrink-0" />
          <span className="font-medium">{project.area}</span>
        </div>
      </div>

      <div className="mb-4 sm:mb-5">
        <h4 className="font-semibold text-gray-900 mb-2 sm:mb-3 text-sm sm:text-base">
          Key Features:
        </h4>
        <ul className="grid grid-cols-2 gap-1.5 sm:gap-2">
          {project.features.map((feature: string, idx: number) => (
            <li
              key={idx}
              className="flex items-center text-gray-600 text-xs sm:text-sm"
            >
              <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 text-green-500 flex-shrink-0" />
              <span className="line-clamp-1">{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-auto">
        <Link
          href="/contact"
          className="block w-full bg-[#4161df] text-white py-2.5 sm:py-3 rounded-lg text-center font-semibold text-sm sm:text-base hover:bg-[#3456df] transition-colors shadow-sm"
        >
          Enquire Now
        </Link>
      </div>
    </div>
  </motion.div>
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
  <motion.div
    initial={{ y: 20, opacity: 0 }}
    whileInView={{ y: 0, opacity: 1 }}
    transition={{ duration: 0.5 }}
    viewport={{ once: true }}
    className="bg-white p-6 sm:p-8 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
  >
    <div className="mb-3 sm:mb-4 inline-block">{icon}</div>
    <h3 className="text-lg sm:text-xl font-semibold text-black mb-2">
      {title}
    </h3>
    <p className="text-sm sm:text-base text-gray-600">{desc}</p>
  </motion.div>
);

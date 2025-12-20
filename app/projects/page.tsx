"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Home, CheckCircle } from "lucide-react";

const ProjectsPage = () => {
  const projects = [
    {
      title: "Lakeview Residency",
      location: "Sector 55, Gurugram",
      image: "/r1.png",
      status: "Under Construction",
      price: "₹ 1.2 Cr - 2.5 Cr",
      area: "1200 - 2500 sq.ft.",
      features: ["Swimming Pool", "Gymnasium", "Clubhouse", "24/7 Security"],
    },
    {
      title: "Skyline Homes",
      location: "Golf Course Extension Road, Gurgaon",
      image: "/r2.png",
      status: "Ready to Move",
      price: "₹ 2.8 Cr - 4.5 Cr",
      area: "2800 - 4500 sq.ft.",
      features: ["Rooftop Garden", "Smart Home", "Private Cinema", "Spa"],
    },
    {
      title: "Metro City Heights",
      location: "Noida Sector 78",
      image: "/r3.png",
      status: "Launching Soon",
      price: "₹ 80 Lac - 1.5 Cr",
      area: "1000 - 1800 sq.ft.",
      features: ["Metro Connectivity", "Shopping Arcade", "Kids Play Area"],
    },
  ];

  return (
    <div className="w-full bg-gray-50">
      {/* Hero Section */}
      <div className="w-full bg-gradient-to-r from-gray-800 to-black text-white py-24 px-4 flex flex-col items-center text-center">
        <h1 className="text-4xl md:text-6xl font-bold">
          Discover Our Premier Projects
        </h1>
        <p className="mt-4 text-lg text-gray-300 max-w-3xl">
          Explore a curated selection of premium residential and commercial
          projects designed for modern living.
        </p>
      </div>

      {/* Projects Grid */}
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {projects.map((project, index) => (
            <ProjectCard key={index} project={project} />
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="w-full bg-indigo-600 py-20 px-4 flex flex-col items-center text-center">
        <h2 className="text-3xl md:text-4xl font-semibold text-white">
          Interested in Listing Your Project?
        </h2>
        <p className="text-indigo-100 mt-3 max-w-2xl">
          Partner with us to reach a wider audience and leverage our expert
          marketing strategies for your project.
        </p>
        <Link
          href="/contact"
          className="mt-8 bg-white text-indigo-600 px-10 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-transform transform hover:scale-105"
        >
          Contact Us for Details
        </Link>
      </div>
    </div>
  );
};

export default ProjectsPage;

const ProjectCard = ({ project }: { project: any }) => (
  <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 ease-in-out border border-gray-200/80">
    <div className="relative w-full h-64">
      <Image
        src={project.image}
        alt={project.title}
        fill
        className="object-cover"
      />
      <div className="absolute top-4 right-4 bg-indigo-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
        {project.status}
      </div>
    </div>

    <div className="p-6">
      <h3 className="text-2xl font-bold text-black mb-2">{project.title}</h3>
      <div className="flex items-center text-gray-600 mb-4">
        <MapPin className="w-5 h-5 mr-2 text-indigo-500" />
        <span>{project.location}</span>
      </div>

      <div className="flex justify-between text-gray-800 mb-6">
        <div className="flex items-center">
          {/* <RupeeIcon className="w-5 h-5 mr-2 text-green-500" /> */}
          <span className="font-semibold">{project.price}</span>
        </div>
        <div className="flex items-center">
          <Home className="w-5 h-5 mr-2 text-blue-500" />
          <span className="font-semibold">{project.area}</span>
        </div>
      </div>

      <div>
        <h4 className="font-semibold text-black mb-3">Key Features:</h4>
        <ul className="space-y-2">
          {project.features.map((feature: string, index: number) => (
            <li key={index} className="flex items-center text-gray-600">
              <CheckCircle className="w-5 h-5 mr-3 text-green-500" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      <Link
        href="/contact"
        className="mt-8 block w-full bg-black text-white py-3 rounded-lg text-center font-semibold hover:bg-gray-800 transition-colors"
      >
        Enquire Now
      </Link>
    </div>
  </div>
);

const RupeeIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M6 3h12" />
    <path d="M6 8h12" />
    <path d="M6 13h12" />
    <path d="M9 18h6" />
    <path d="M9 13c0-2.5 2-4.5 4.5-4.5S18 10.5 18 13v5" />
  </svg>
);

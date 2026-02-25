"use client";

import React from "react";
import Image from "next/image";
import { Building2, Users, Shield, Award, Linkedin } from "lucide-react";
import Testimonial from "@/components/Testimonial";
import Link from "next/link";

const AboutPage = () => {
  const teamMembers = [
    {
      name: "Priyanka Sharma",
      role: "Founder & CEO",
      description:
        "Chandigarh native with 12+ years in real estate. Built PropertyBulbul from ground up with a vision to simplify property dealings for Tricity residents.",
      experience: "12 Years",
      image: "/priyanka-sharma.jpg",
      social: {
        linkedin: "#",
      },
    },
    {
      name: "Neha Verma",
      role: "Lead Property Consultant",
      description:
        "Expert in luxury residential and commercial properties. Helped 500+ families find their dream homes across Chandigarh and Mohali.",
      experience: "8 Years",
      image: "/neha-verma.jpg",
      social: {
        linkedin: "#",
      },
    },
    {
      name: "Ritika",
      role: "Marketing Director",
      description:
        "Digital marketing specialist focused on helping Tricity property seekers connect with verified sellers through modern technology.",
      experience: "6 Years",
      image: "/ritika.jpg",
      social: {
        linkedin: "#",
      },
    },
  ];

  return (
    <div className="w-full bg-white">
      {/* Hero Section */}
      <div className="relative w-full h-[50vh] sm:h-[60vh] text-white">
        <Image
          src="/about-images.jpg"
          alt="PropertyBulbul Team - Real Estate Experts in Tricity"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-center px-4 sm:px-6">
          <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold">
            About PropertyBulbul
          </h1>
          <p className="mt-3 sm:mt-4 text-sm sm:text-base md:text-lg lg:text-xl max-w-3xl px-2">
            Tricity's Most Helpful Real Estate Partner. Established in
            Chandigarh to revolutionize the way people find, buy, and invest in
            properties in Chandigarh, Panchkula, and Mohali.
          </p>
        </div>
      </div>

      {/* Our Story Section */}
      <div className="w-full bg-gray-100 py-12 sm:py-16 md:py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-black mb-4 sm:mb-6">
                Our Story - Born in Tricity, Built for Excellence
              </h2>
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-4 sm:mb-6">
                Founded in the heart of Chandigarh, PropertyBulbul emerged from
                a simple yet powerful vision: to make property dealings in
                Tricity as straightforward and trustworthy as getting your
                groceries delivered.
              </p>
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-4 sm:mb-6">
                What started as a local initiative has grown into Tricity's most
                reliable real estate partner. We're not just another real estate
                agency - we're your neighbors, your friends, and your most
                trusted advisors in property matters. Our team of experts
                combines deep local market knowledge with cutting-edge
                technology to deliver unparalleled service.
              </p>
              <div className="grid grid-cols-3 gap-2 sm:gap-4 md:gap-6 mt-6 sm:mt-8">
                <div className="text-center">
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold text-indigo-600">
                    5000+
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600">
                    Happy Families
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold text-indigo-600">
                    ₹2.5Cr+
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600">
                    Properties Sold
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold text-indigo-600">
                    300+
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600">
                    Properties Verified
                  </div>
                </div>
              </div>
            </div>
            <div className="relative h-64 sm:h-80 md:h-96 lg:h-[400px]">
              <Image
                src="/location.jpg"
                alt="Chandigarh Location - PropertyBulbul Office"
                fill
                className="object-cover rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Our Mission Section */}
      <div className="max-w-7xl mx-auto px-4 py-12 sm:py-16 md:py-20 text-center">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-black mb-4 sm:mb-6">
          Our Mission - India's Most Helpful Real Estate Service
        </h2>
        <p className="text-base sm:text-lg text-gray-700 max-w-4xl mx-auto leading-relaxed mb-4 sm:mb-6">
          To be the most helpful real estate partner in India, specifically
          built for the Tricity region. We're not satisfied with being just
          "good" - we want to be indispensably helpful at every step of your
          property journey.
        </p>
        <p className="text-base sm:text-lg text-gray-700 max-w-4xl mx-auto leading-relaxed">
          We leverage technology, expertise, and genuine care to provide a
          seamless, transparent, and personalized experience for buyers,
          sellers, and investors. Our commitment extends beyond transactions to
          building lasting relationships built on trust, integrity, and
          exceptional customer satisfaction.
        </p>
      </div>

      {/* Why Choose Us Section */}
      <div className="w-full bg-gray-50 py-12 sm:py-16 md:py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-center text-black mb-8 sm:mb-12">
            Why Choose Us?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 text-center">
            <Feature
              icon={
                <Building2 className="w-8 h-8 sm:w-10 sm:h-10 text-indigo-600" />
              }
              title="Verified Properties"
              desc="Every property is thoroughly vetted to ensure it meets our high standards of quality and legal compliance."
            />
            <Feature
              icon={
                <Users className="w-8 h-8 sm:w-10 sm:h-10 text-indigo-600" />
              }
              title="Expert Guidance"
              desc="Our team of experienced agents provides personalized support to help you make informed decisions."
            />
            <Feature
              icon={
                <Shield className="w-8 h-8 sm:w-10 sm:h-10 text-indigo-600" />
              }
              title="Transparent Process"
              desc="We believe in complete transparency, with no hidden fees or surprises. Your trust is our top priority."
            />
            <Feature
              icon={
                <Award className="w-8 h-8 sm:w-10 sm:h-10 text-indigo-600" />
              }
              title="Award-Winning Service"
              desc="Our commitment to excellence has been recognized with numerous awards for customer satisfaction."
            />
          </div>
        </div>
      </div>

      {/* Meet the Team Section */}
      <div className="max-w-7xl mx-auto px-4 py-12 sm:py-16 md:py-20">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-center text-black mb-8 sm:mb-12">
          Meet Our Team
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-10">
          {teamMembers.map((member, index) => (
            <TeamMemberCard key={index} member={member} />
          ))}
        </div>
      </div>

      {/* Testimonials Section */}
      <Testimonial />

      {/* CTA Section */}
      <div className="w-full bg-indigo-600 py-12 sm:py-16 md:py-20 px-4 sm:mt-16 md:mt-20 flex flex-col items-center text-center">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-white">
          Join Our Growing Community
        </h2>
        <p className="text-indigo-100 mt-2 sm:mt-3 max-w-2xl text-sm sm:text-base">
          Whether you're looking to buy, sell, or invest, we're here to help.
          Get in touch with us today to start your real estate journey.
        </p>
        <Link
          href="/contact"
          className="mt-6 sm:mt-8 bg-white text-indigo-600 px-6 sm:px-8 md:px-10 py-3 sm:py-4 rounded-full font-bold text-base sm:text-lg hover:bg-gray-100 transition-transform transform hover:scale-105"
        >
          Contact Us
        </Link>
      </div>
    </div>
  );
};

export default AboutPage;

const Feature = ({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) => (
  <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
    <div className="mb-3 sm:mb-4 inline-block">{icon}</div>
    <h3 className="text-lg sm:text-xl font-semibold text-black mb-2">
      {title}
    </h3>
    <p className="text-sm sm:text-base text-gray-600">{desc}</p>
  </div>
);

const TeamMemberCard = ({ member }: { member: any }) => (
  <div className="bg-gray-50 rounded-lg overflow-hidden text-center shadow-lg hover:shadow-2xl transition-shadow duration-300">
    <div className="relative w-full h-72 sm:h-76 md:h-80">
      <Image
        src={member.image}
        alt={`${member.name} - ${member.role} at PropertyBulbul`}
        fill
        className="object-cover"
      />
    </div>
    <div className="p-4 sm:p-6">
      <h3 className="text-xl sm:text-2xl font-semibold text-black mb-1 sm:mb-2">
        {member.name}
      </h3>
      <p className="text-sm sm:text-base text-indigo-600 font-medium mb-2 sm:mb-3">
        {member.role}
      </p>
      <p className="text-xs sm:text-sm font-semibold text-gray-500 mb-2 sm:mb-3">
        {member.experience} Experience
      </p>
      <p className="text-xs sm:text-sm text-gray-700 leading-relaxed mb-3 sm:mb-4">
        {member.description}
      </p>
      <div className="flex justify-center space-x-4">
        <a
          href={member.social.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-500 hover:text-indigo-600 transition-colors"
        >
          <Linkedin className="w-5 h-5 sm:w-6 sm:h-6" />
        </a>
      </div>
    </div>
  </div>
);

"use client";

import React from "react";

interface ContactBannerProps {
  title?: string;
  subtitle?: string;
  image?: string; // banner background image
}

const ContactBanner: React.FC<ContactBannerProps> = ({
  title = "Get in Touch",
  subtitle = "We are here to help you with your property needs.",
  image = "/contact-banner.jpg",
}) => {
  return (
    <section className="relative  w-full h-[280px] md:h-[480px] overflow-hidden flex items-center justify-center">
      {/* BACKGROUND IMAGE */}
      <div
        className="
          absolute inset-0 
          bg-cover bg-center bg-no-repeat 
         scale-105
        "
        style={{ backgroundImage: `url(${image})` }}
      />

      {/* DARK OVERLAY */}
      <div className="absolute inset-0 bg-black/25"></div>

      {/* CONTENT */}
      <div className="relative z-10 text-center px-4">
        <h1 className="text-white text-3xl md:text-5xl font-bold drop-shadow-md">
          {title}
        </h1>

        <p className="text-white/90 text-sm md:text-lg mt-2 max-w-2xl mx-auto">
          {subtitle}
        </p>
      </div>
    </section>
  );
};

export default ContactBanner;

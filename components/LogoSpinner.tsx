"use client";
import React from "react";
import Image from "next/image";

const LogoSpinner = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#f5f7ff] to-[#e6eafe] px-4">
      <div className="flex flex-col items-center text-center space-y-3 sm:space-y-4">
        {/* Logo */}
        <div className="relative w-28 h-28 sm:w-36 md:w-44 lg:w-52 sm:h-36 md:h-44 lg:h-52">
          <Image
            src="/propertybulbul.png"
            alt="Property Bulbul"
            fill
            className="object-contain"
            priority
          />
        </div>

        {/* Tagline */}
        <p className="text-black text-[10px] sm:text-xs md:text-sm lg:text-base font-light tracking-[0.2em] sm:tracking-[0.25em] md:tracking-[0.35em] px-2">
          TRICITY'S MOST HELPFUL REAL ESTATE PARTNER
        </p>
      </div>
    </div>
  );
};

export default LogoSpinner;

"use client";
import React from "react";
import Image from "next/image";

const LogoSpinner = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#f5f7ff] to-[#e6eafe] px-4">
      <div className="flex flex-col items-center text-center space-y-2">
        {/* Logo */}
        <div className="relative w-36 h-36 sm:w-80 sm:h-80">
          <Image
            src="/propertybulbul.png"
            alt="Property Bulbul"
            fill
            className="object-contain"
            priority
          />
        </div>

        {/* Tagline */}
        <p className="text-black text-xs sm:text-base font-light tracking-[0.35em]">
          TRICITY'S MOST HELPFUL REAL ESTATE PARTNER
        </p>
      </div>
    </div>
  );
};

export default LogoSpinner;

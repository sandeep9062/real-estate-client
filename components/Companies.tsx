"use client";
import React from "react";
import Image from "next/image";

const Companies = () => {
  const logos = [
    { src: "/prologis.png", alt: "Prologis" },
    { src: "/tower.png", alt: "Tower" },
    { src: "/equinix.png", alt: "Equinix" },
    { src: "/realty.png", alt: "Realty" },
    { src: "/prologis.png", alt: "Prologis" },
    { src: "/tower.png", alt: "Tower" },
    { src: "/equinix.png", alt: "Equinix" },
    { src: "/realty.png", alt: "Realty" },
  ];

  return (
    <section className="w-full py-4 sm:py-6 md:py-8 lg:py-10 bg-gray-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="relative w-full overflow-hidden">
          {/* LEFT GRADIENT */}
          <div className="absolute left-0 top-0 h-full w-12 sm:w-16 md:w-20 lg:w-24 bg-gradient-to-r from-gray-50 to-transparent z-20"></div>

          {/* RIGHT GRADIENT */}
          <div className="absolute right-0 top-0 h-full w-12 sm:w-16 md:w-20 lg:w-24 bg-gradient-to-l from-gray-50 to-transparent z-20"></div>

          {/* Slider Track */}
          <div className="flex items-center gap-6 sm:gap-8 md:gap-10 animate-scroll whitespace-nowrap">
            {[...logos, ...logos].map((logo, index) => (
              <div
                key={index}
                className="flex items-center justify-center h-14 sm:h-16 md:h-20 lg:h-24 w-24 sm:w-28 md:w-32 lg:w-40 flex-shrink-0 opacity-90 hover:opacity-100 transition"
              >
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  width={160}
                  height={80}
                  className="w-16 sm:w-20 md:w-24 lg:w-32 object-contain transition-transform duration-300 hover:scale-110"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Animation Style */}
      <style>
        {`
          .animate-scroll {
            animation: scroll 20s linear infinite;
          }

          @keyframes scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
        `}
      </style>
    </section>
  );
};

export default Companies;

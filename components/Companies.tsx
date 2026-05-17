"use client";
import React from "react";
import Image from "next/image";

const Companies = () => {
  // Tricity ke relevant builders aur standard trusted banking partners
  const logos = [
    { src: "/logos/dlf.png", alt: "DLF Homes" },
    { src: "/logos/omaxe.png", alt: "Omaxe India" },
    { src: "/logos/godrej.png", alt: "Godrej Properties" },
    { src: "/logos/hdfc.png", alt: "HDFC Bank Loans" },
    { src: "/logos/sbi.png", alt: "SBI Home Loans" },
    { src: "/logos/hero-realty.png", alt: "Hero Realty" },
    { src: "/logos/sushma.png", alt: "Sushma Buildtech" }, // Major player in Zirakpur/Mohali
    { src: "/logos/icici.png", alt: "ICICI Bank" },
  ];

  return (
    <section className="w-full py-4 sm:py-6 md:py-8 bg-gray-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="relative w-full overflow-hidden">
          {/* LEFT GRADIENT FADE */}
          <div className="absolute left-0 top-0 h-full w-16 sm:w-24 bg-gradient-to-r from-gray-50 to-transparent z-20 pointer-events-none"></div>
          {/* RIGHT GRADIENT FADE */}
          <div className="absolute right-0 top-0 h-full w-16 sm:w-24 bg-gradient-to-l from-gray-50 to-transparent z-20 pointer-events-none"></div>

          {/* Slider Track — only 2 copies needed for seamless CSS marquee */}
          <div className="flex items-center gap-8 md:gap-12 animate-scroll whitespace-nowrap">
            {logos.map((logo, index) => (
              <div
                key={`a-${index}`}
                className="flex items-center justify-center h-16 w-28 sm:w-36 md:w-40 flex-shrink-0 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
              >
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  width={140}
                  height={60}
                  className="max-h-10 sm:max-h-12 w-auto object-contain transition-transform duration-300 hover:scale-105"
                  priority
                />
              </div>
            ))}
            {logos.map((logo, index) => (
              <div
                key={`b-${index}`}
                className="flex items-center justify-center h-16 w-28 sm:w-36 md:w-40 flex-shrink-0 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
              >
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  width={140}
                  height={60}
                  className="max-h-10 sm:max-h-12 w-auto object-contain transition-transform duration-300 hover:scale-105"
                  priority
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll {
          animation: marquee 25s linear infinite;
        }
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `,
        }}
      />
    </section>
  );
};

export default Companies;

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
    <section
      className="w-full py-6 sm:py-8 md:py-10 bg-gray-50 border-b border-gray-100"
      aria-label="Trusted builder and banking partners"
    >
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        {/* HEADING */}
        <div className="flex items-center justify-center md:justify-start gap-2 mb-4 sm:mb-5">
          <span className="w-5 sm:w-6 h-px bg-[#4161df]/70" />
          <p className="text-[11px] sm:text-xs font-medium tracking-wide text-slate-500 text-center md:text-left">
            Trusted by leading builders &amp; banking partners across Tricity
          </p>
        </div>

        <div className="relative w-full overflow-hidden">
          {/* LEFT GRADIENT FADE */}
          <div className="absolute left-0 top-0 h-full w-10 xs:w-16 sm:w-24 bg-gradient-to-r from-gray-50 to-transparent z-20 pointer-events-none" />
          {/* RIGHT GRADIENT FADE */}
          <div className="absolute right-0 top-0 h-full w-10 xs:w-16 sm:w-24 bg-gradient-to-l from-gray-50 to-transparent z-20 pointer-events-none" />

          {/* Slider Track — only 2 copies needed for seamless CSS marquee */}
          <div
            className="flex items-center gap-4 sm:gap-6 md:gap-8 animate-scroll whitespace-nowrap"
            aria-hidden="true"
          >
            {logos.map((logo, index) => (
              <div
                key={`a-${index}`}
                className="flex items-center justify-center h-10 sm:h-11 md:h-12 flex-shrink-0 grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
              >
                <Image
                  src={logo.src}
                  alt=""
                  width={140}
                  height={60}
                  className="max-h-full w-auto object-contain"
                />
              </div>
            ))}
            {logos.map((logo, index) => (
              <div
                key={`b-${index}`}
                className="flex items-center justify-center h-10 sm:h-11 md:h-12 flex-shrink-0 grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
              >
                <Image
                  src={logo.src}
                  alt=""
                  width={140}
                  height={60}
                  className="max-h-full w-auto object-contain"
                />
              </div>
            ))}
          </div>

          {/* Screen-reader-only list, since the marquee track above is aria-hidden */}
          <span className="sr-only">
            Partners include: {logos.map((l) => l.alt).join(", ")}.
          </span>
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
          will-change: transform;
        }
        .animate-scroll:hover {
          animation-play-state: paused;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-scroll {
            animation: none;
          }
        }
      `,
        }}
      />
    </section>
  );
};

export default Companies;

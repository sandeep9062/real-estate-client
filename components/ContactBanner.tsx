"use client";

import React from "react";
import Image from "next/image";

interface ContactBannerProps {
  title?: string;
  subtitle?: string;
  image?: string; // banner image (white-bg character illustration by default)
  overlay?: boolean; // set true if using a dark photo banner instead
  textColor?: "dark" | "light";
}

const ContactBanner: React.FC<ContactBannerProps> = ({
  title = "Let's Talk Property",
  subtitle = "Have a question about buying, selling, or renting in the Tricity? Our team is one message away.",
  image = "/contact-banner.jpg",
  overlay = false,
  textColor = "dark",
}) => {
  const headingColor = textColor === "dark" ? "text-[#14213D]" : "text-white";
  const subColor = textColor === "dark" ? "text-[#14213D]/70" : "text-white/90";

  return (
    <section className="relative w-full bg-white overflow-hidden">
      {/* MOBILE / TABLET: image shown in full (no crop), text stacked below */}
      <div className="md:hidden">
        <div className="relative w-full aspect-[2.56/1] bg-white">
          <Image
            src={image}
            alt="Contact PropertyBulbul"
            fill
            priority
            sizes="100vw"
            className="object-contain object-right"
          />
        </div>
        <div className="px-5 sm:px-8 py-6 sm:py-8 text-center">
          <h1
            className={`${headingColor} text-2xl sm:text-3xl font-bold leading-tight drop-shadow-sm`}
          >
            {title}
          </h1>
          <p className={`${subColor} text-sm sm:text-base mt-2`}>{subtitle}</p>
        </div>
      </div>

      {/* DESKTOP: full-bleed image, text overlaid on the left */}
      <div className="hidden md:block relative w-full aspect-[2.2/1] lg:aspect-[2.56/1]">
        <Image
          src={image}
          alt="Contact PropertyBulbul"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />

        {overlay && <div className="absolute inset-0 bg-black/25" />}

        <div className="absolute inset-0 flex items-center">
          <div className="w-full max-w-7xl mx-auto px-8 lg:px-12">
            <div className="max-w-md lg:max-w-lg">
              <h1
                className={`${headingColor} text-3xl lg:text-5xl font-bold leading-tight drop-shadow-sm`}
              >
                {title}
              </h1>
              <p className={`${subColor} text-base lg:text-lg mt-3`}>
                {subtitle}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactBanner;

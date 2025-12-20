"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className="w-full bg-white border-t border-black/10">
      <div className="max-w-7xl mx-auto px-4 py-14">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start">
          
          {/* Logo + Tagline */}
          <div className="flex flex-col gap-4 items-center md:items-start">
            <Link href="/">
              <Image
                src="/propertybulbul.png"
                alt="Property Bulbul logo"
                width={160}
                height={60}
                priority
                className="object-contain"
              />
            </Link>

            <p className="text-gray-500 text-[14px] text-center md:text-left leading-relaxed">
              TRICITY'S MOST HELPFUL <br />
              REAL ESTATE PARTNER
            </p>
          </div>

          {/* Cities */}
          <div className="text-center md:text-left">
            <h3 className="text-base font-semibold text-neutral-900 mb-5">
              Properties by City
            </h3>

            <ul className="space-y-2 text-sm text-neutral-600">
              {[
                "Chandigarh",
                "Mohali",
                "Panchkula",
                "Zirakpur",
                "Kharar",
              ].map((city) => (
                <li key={city}>
                  <Link
                    href={`/properties/${city.toLowerCase()}`}
                    className="hover:text-blue-600 transition"
                  >
                    {city}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div className="flex flex-col gap-4 text-center md:text-left">
            <h3 className="text-base font-semibold text-neutral-900">
              Information
            </h3>

            <p className="text-gray-500 text-sm">
              145, Sector 15, Chandigarh, India
            </p>

            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-gray-700 justify-center md:justify-start">
              {[
                ["Properties", "/properties"],
                ["Contact", "/contact"],
                ["Services", "/services"],
                ["About Us", "/about-us"],
                ["Projects", "/projects"],
                ["Privacy Policy", "/privacy-policy"],
              ].map(([label, link]) => (
                <Link
                  key={label}
                  href={link}
                  className="hover:text-blue-600 transition"
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-black/10 py-4">
        <p className="text-center text-sm text-gray-500">
          © {new Date().getFullYear()} PropertyBulbul. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;

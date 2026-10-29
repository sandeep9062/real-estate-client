"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";

const lookingTo = [
  ["Buy a property", "/properties?deal=Sale"],
  ["Rent a property", "/properties?deal=Rent"],
];

const cities = ["Chandigarh", "Mohali", "Panchkula", "Zirakpur", "Kharar"];

const quickLinks = [
  ["Properties", "/properties"],
  ["Sector Directory", "/sectors"],
  // ["Projects", "/projects"],

  // will add projects later on when this platform will be more mature and we will have more projects to list down
  // ["Register as Agent", "/agents/register"],
  ["Services", "/services"],
  ["Journals", "/journal"],
  ["Pricing", "/pricing"],
  ["FAQ", "/faq"],
  // ["Register as Landlord", "/landlords/register"],
  // ["Agents", "/agents"],
  ["About Us", "/about-us"],
  ["Contact", "/contact"],
];

const legalLinks = [
  ["Disclaimer", "/disclaimer"],
  ["Privacy Policy", "/privacy-policy"],
  ["Terms & Conditions", "/terms"],
];

const linkClass =
  "inline-block text-xs sm:text-sm font-medium text-gray-700 hover:text-[#4161df] focus-visible:text-[#4161df] focus-visible:outline-none focus-visible:underline underline-offset-4 transition";

const headingClass =
  "text-sm sm:text-base font-semibold text-neutral-900 mb-3 sm:mb-4";

const Footer = () => {
  return (
    <footer className="w-full bg-white border-t border-black/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 lg:py-14">
        {/* Main Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-12 gap-x-6 gap-y-10 lg:gap-x-8 items-start">
          {/* Logo + Tagline + Contact */}
          <div className="col-span-2 lg:col-span-4 flex flex-col gap-4 items-center text-center lg:items-start lg:text-left">
            <Link href="/" aria-label="Property Bulbul home">
              <Image
                src="/propertybulbul.png"
                alt="Property Bulbul"
                width={160}
                height={60}
                priority
                className="object-contain w-32 sm:w-36 md:w-40 lg:w-44"
              />
            </Link>

            <p className="text-gray-500 font-medium text-xs sm:text-sm leading-relaxed">
              TRICITY'S MOST HELPFUL <br />
              REAL ESTATE PARTNER
            </p>

            {/* Contact Info */}
            <div className="flex flex-col items-center lg:items-start gap-2 pt-1">
              <a
                href="mailto:bulbulproperty@gmail.com"
                className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 hover:text-[#4161df] transition"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4 shrink-0 text-[#4161df]"
                  aria-hidden="true"
                >
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <path d="m3 7 9 6 9-6" />
                </svg>
                bulbulproperty@gmail.com
              </a>

              <a
                href="tel:+919729907448"
                className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 hover:text-[#4161df] transition"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4 shrink-0 text-[#4161df]"
                  aria-hidden="true"
                >
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.34 1.78.65 2.62a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.46-1.22a2 2 0 0 1 2.11-.45c.84.31 1.72.53 2.62.65A2 2 0 0 1 22 16.92z" />
                </svg>
                +91 97299 07448
              </a>
            </div>
          </div>

          {/* Looking to */}
          <nav aria-label="Buy or rent" className="col-span-1 lg:col-span-2">
            <h3 className={headingClass}>Looking to</h3>
            <ul className="space-y-2 sm:space-y-2.5">
              {lookingTo.map(([label, href]) => (
                <li key={label}>
                  <Link href={href} className={linkClass}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Cities */}
          <nav
            aria-label="Properties by city"
            className="col-span-1 lg:col-span-2"
          >
            <h3 className={headingClass}>Properties by City</h3>
            <ul className="space-y-2 sm:space-y-2.5">
              {cities.map((city) => (
                <li key={city}>
                  <Link
                    href={`/properties/${city.toLowerCase()}`}
                    className={linkClass}
                  >
                    {city}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Quick Links */}
          <nav aria-label="Quick links" className="col-span-2 lg:col-span-4">
            <h3 className={headingClass}>Quick Links</h3>
            <ul className="grid grid-cols-2 gap-x-6 gap-y-2 sm:gap-y-2.5">
              {quickLinks.map(([label, href]) => (
                <li key={label}>
                  <Link href={href} className={linkClass}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-black/10">
        {/* Left-aligned with right padding so links never sit under the floating chat button / reCAPTCHA badge */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 pb-20 sm:pb-4 md:pr-80 lg:pr-96 flex flex-col-reverse md:flex-row items-center md:items-center md:justify-start gap-3 md:gap-8">
          <p className="text-center text-xs sm:text-sm text-gray-500">
            © {new Date().getFullYear()} PropertyBulbul. All rights reserved.
          </p>

          <nav aria-label="Legal">
            <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1.5">
              {legalLinks.map(([label, href]) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-xs sm:text-sm text-gray-500 hover:text-[#4161df] focus-visible:text-[#4161df] focus-visible:outline-none focus-visible:underline underline-offset-4 transition"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

// Popular Searches
// 2 BHK for Rent in Chandigarh   → https://www.propertybulbul.com/properties/chandigarh/for-rent-2bhk
// 1 BHK for Rent in Chandigarh   → https://www.propertybulbul.com/properties/chandigarh/for-rent-1bhk
// 3 BHK for Rent in Chandigarh   → https://www.propertybulbul.com/properties/chandigarh/for-rent-3bhk
// PG in Chandigarh               → https://www.propertybulbul.com/properties/chandigarh/pg
// PG for Boys in Chandigarh      → https://www.propertybulbul.com/properties/chandigarh/pg-boys
// 2 BHK for Rent in Mohali       → https://www.propertybulbul.com/properties/mohali/for-rent-2bhk
// 1 BHK for Rent in Mohali       → https://www.propertybulbul.com/properties/mohali/for-rent-1bhk

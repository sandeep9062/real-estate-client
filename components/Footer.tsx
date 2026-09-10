"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className="w-full bg-white border-t border-black/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 md:py-12 lg:py-14">
        {/* Main Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10 md:gap-12 items-start">
          {/* Logo + Tagline */}
          <div className="flex flex-col gap-3 sm:gap-4 items-center md:items-start">
            <Link href="/">
              <Image
                src="/propertybulbul.png"
                alt="Property Bulbul"
                width={160}
                height={60}
                priority
                className="object-contain w-32 sm:w-36 md:w-40 lg:w-44"
              />
            </Link>

            <p className="text-gray-500 font-medium text-xs sm:text-sm text-center md:text-left leading-relaxed">
              TRICITY'S MOST HELPFUL <br />
              REAL ESTATE PARTNER
            </p>
          </div>

          {/* Buy or Rent — kept visually separate from Quick Links as standout pills */}
          <div className="text-center md:text-left">
            <h3 className="text-sm sm:text-base font-semibold text-neutral-900 mb-3 sm:mb-4 md:mb-5">
              Looking to
            </h3>

            <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-neutral-600">
              <li>
                <Link
                  href="/properties?deal=Sale"
                  className="hover:text-[#4161df] font-medium text-gray-700  transition"
                >
                  Buy a property
                </Link>
              </li>
              <li>
                <Link
                  href="/properties?deal=Rent"
                  className="hover:text-[#4161df] font-medium text-gray-700  transition"
                >
                  Rent a property
                </Link>
              </li>
            </ul>
          </div>

          {/* Cities */}
          <div className="text-center md:text-left">
            <h3 className="text-sm sm:text-base font-semibold text-neutral-900 mb-3 sm:mb-4 md:mb-5">
              Properties by City
            </h3>

            <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-neutral-600">
              {["Chandigarh", "Mohali", "Panchkula", "Zirakpur", "Kharar"].map(
                (city) => (
                  <li key={city}>
                    <Link
                      href={`/properties/${city.toLowerCase()}`}
                      className="hover:text-[#4161df] transition font-medium text-gray-700 "
                    >
                      {city}
                    </Link>
                  </li>
                ),
              )}
            </ul>
          </div>

          {/* Info */}
          <div className="flex flex-col gap-3 sm:gap-4 text-center md:text-left">
            <h3 className="text-sm sm:text-base font-semibold text-neutral-900">
              Quick Links
            </h3>

            {/* <p className="text-gray-500 text-xs sm:text-sm">
              145, Sector 15, Chandigarh, India
            </p> */}

            {/* <p className="text-gray-500 text-xs sm:text-sm">
              Email us :{" "}
              <a
                href="mailto:info@propertybulbul.com"
                className="hover:text-[#4161df] transition"
              >
                bulbulproperty@gmail.com
              </a>
            </p> */}

            <div className="flex flex-wrap gap-x-4 sm:gap-x-5 md:gap-x-6 gap-y-1.5 sm:gap-y-2 text-xs sm:text-sm font-medium text-gray-700 justify-center md:justify-start">
              {[
                ["Properties", "/properties"],

                // ["Projects", "/projects"],

                // will add projects later on when this platform will be more mature and we will have more projects to list down
                // ["Register as Agent", "/agents/register"],
                ["Services", "/services"],
                // ["Pricing", "/pricing"],
                ["Journals", "/journal"],
                ["Contact", "/contact"],
                ["About Us", "/about-us"],
                ["FAQ", "/faq"],
                // ["Register as Landlord", "/landlords/register"],

                // ["Agents", "/agents"],
                ["Disclaimer", "/disclaimer"],
                ["Privacy Policy", "/privacy-policy"],
              ].map(([label, link]) => (
                <Link
                  key={label}
                  href={link}
                  className="hover:text-[#4161df] transition"
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-black/10 py-3 sm:py-4">
        <p className="text-center text-xs sm:text-sm text-gray-500">
          © {new Date().getFullYear()} PropertyBulbul. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;

"use client";
import React from "react";

const GetStarted = () => {
  return (
    <div
      id="get-started"
      className="py-8 sm:py-12 md:py-16 px-3 sm:px-4 md:px-6"
    >
      <div className="max-w-4xl mx-auto">
        <div
          className="
            flex flex-col items-center justify-center text-center gap-4 sm:gap-5 md:gap-6
            bg-[#4161df] p-5 sm:p-6 md:p-8 rounded-xl border-4 sm:border-6 md:border-8 border-[#5d77d6]
          "
        >
          <span className="text-white font-semibold text-lg sm:text-xl md:text-2xl">
            Get started with PropertyBulbul
          </span>

          <span className="text-white text-sm sm:text-base leading-relaxed">
            Subscribe and find super attractive price quotes from us.
            <br className="hidden sm:block" />
            <span className="sm:hidden"> </span>
            Find your residence soon
          </span>

          <a
            href="/contact"
            className="
              bg-[#1e3a8a] border-2 border-white shadow-lg
              rounded-xl text-white font-semibold px-5 sm:px-6 py-2 sm:py-2.5 md:py-3 hover:opacity-80
              text-sm sm:text-base
            "
          >
            Get Started
          </a>
        </div>
      </div>
    </div>
  );
};

export default GetStarted;

"use client"
import React from "react";

const GetStarted = () => {
  return (
    <div id="get-started" className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div
          className="
            flex flex-col items-center justify-center text-center gap-6
            bg-[#4161df] p-8 rounded-xl border-8 border-[#5d77d6]
          "
        >
          <span className="text-white font-semibold text-2xl">
            Get started with PropertyBulbul
          </span>

          <span className="text-white text-base leading-relaxed">
            Subscribe and find super attractive price quotes from us.
            <br />
            Find your residence soon
          </span>

          <a
            href="/contact"
            className="
              bg-[#1e3a8a] border-2 border-white shadow-lg
              rounded-xl text-white font-semibold px-6 py-2 hover:opacity-80
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

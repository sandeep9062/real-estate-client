"use client";
import React, { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { useGetAllPropertiesQuery } from "@/services/propertiesApi";
import PropertyCard from "./PropertyCard";
import { PuffLoader } from "react-spinners";
import { sliderSettings } from "@/lib/utils";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

interface ResidenciesProps {
  filter?: { [key: string]: string };
}

const Residencies: React.FC<ResidenciesProps> = ({ filter = {} }) => {
  const { data, isError, isLoading } = useGetAllPropertiesQuery(filter);
  const swiperRef = useRef<any>(null);

  if (isError) {
    return (
      <div className="w-full flex items-center justify-center py-20 text-red-500 font-semibold">
        Something went wrong!
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="w-full flex items-center justify-center h-[60vh]">
        <PuffLoader color="#4066ff" size={60} />
      </div>
    );
  }

  return (
    <section className="py-4 md:py-20 relative bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
        {/* Title Section */}
        <div className="text-center mb-10 md:mb-16">
          <p className="text-blue-600 font-semibold tracking-wide uppercase">
            Homes You’ll Love
          </p>

          <h2
            className="text-3xl md:text-5xl font-extrabold bg-black
              bg-clip-text text-transparent leading-tight"
          >
            Popular Residencies
          </h2>

          <p className="text-gray-500 mt-4 max-w-xl mx-auto md:text-lg">
            Discover premium properties verified for quality, value, and luxury
            lifestyle.
          </p>
        </div>

        {/* Slider Container */}
        <div className="relative mt-6">
          {/* Left Fade */}
          <div
            className="absolute left-0 top-0 bottom-0 w-10 md:w-20 
              bg-gradient-to-r from-white via-white/40 to-transparent
              pointer-events-none z-20"
          />

          {/* Right Fade */}
          <div
            className="absolute right-0 top-0 bottom-0 w-10 md:w-20 
              bg-gradient-to-l from-white via-white/40 to-transparent
              pointer-events-none z-20"
          />

          {/* Previous Button */}
          <button
            aria-label="Previous"
            className="hidden md:block absolute -left-4 md:-left-10 top-1/2 -translate-y-1/2
              z-30 p-4 rounded-full 
              bg-white/50 backdrop-blur-xl shadow-xl
              border border-white/40 
              hover:scale-110 transition-all duration-300 
              hover:bg-white/90"
            onClick={() => swiperRef.current?.slidePrev()}
          >
            <FaArrowLeft className="text-blue-700 text-lg" />
          </button>

          {/* Next Button */}
          <button
            aria-label="Next"
            className="hidden md:block absolute -right-4 md:-right-10 top-1/2 -translate-y-1/2
              z-30 p-4 rounded-full 
              bg-white/50 backdrop-blur-xl shadow-xl
              border border-white/40
              hover:scale-110 transition-all duration-300 
              hover:bg-white/90"
            onClick={() => swiperRef.current?.slideNext()}
          >
            <FaArrowRight className="text-blue-700 text-lg" />
          </button>

          <Swiper
            {...sliderSettings}
            onSwiper={(swiper) => (swiperRef.current = swiper)}
            className="pb-10 pt-6 -mx-2"
          >
            {data?.map((card: any, index: number) => (
              <SwiperSlide key={index} className="px-2">
                <PropertyCard card={card} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default Residencies;

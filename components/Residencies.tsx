"use client";
import React, { useRef, useMemo, memo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import { useGetAllPropertiesQuery } from "@/services/propertiesApi";
import PropertyCard from "./PropertyCard";
import { sliderSettings } from "@/lib/utils";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { fa } from "zod/v4/locales";

// Memoized PropertyCard wrapper to prevent unnecessary re-renders
const MemoizedPropertyCard = memo(PropertyCard);

interface ResidenciesProps {
  filter?: { [key: string]: string };
}

const Residencies: React.FC<ResidenciesProps> = ({ filter = {} }) => {
  // Use RTK Query's caching - this will use cached data if available
  const { data, isError, isLoading } = useGetAllPropertiesQuery(
    {
      ...filter,
      isFeatured: true,
    },
    {
      // Skip refetching if we already have data
      refetchOnMountOrArgChange: false,
    },
  );

  const swiperRef = useRef<any>(null);

  // Memoize the sliced data to show only first 10 properties
  const displayProperties = useMemo(() => {
    if (!data) return [];
    return data.filter((property: any) => property.isFeatured === true);
    // .slice(0, 10);
  }, [data]);

  //console.log(displayProperties, "featured-proeprties");

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
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-gray-500">Loading properties...</span>
        </div>
      </div>
    );
  }

  return (
    <section className="py-6 sm:py-10 md:py-16 lg:py-20 relative bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Title Section */}
        <div className="text-center mb-6 sm:mb-8 md:mb-12 lg:mb-16">
          <p className="text-blue-600 font-semibold tracking-wide uppercase text-xs sm:text-sm">
            Homes You'll Love
          </p>

          <h2
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold bg-black
              bg-clip-text text-transparent leading-tight"
          >
            Popular Residencies
          </h2>

          <p className="text-gray-500 mt-2 sm:mt-3 md:mt-4 max-w-xl mx-auto text-sm sm:text-base md:text-lg px-4">
            Discover premium properties verified for quality, value, and luxury
            lifestyle.
          </p>
        </div>

        {/* Slider Container */}
        <div className="relative mt-4 sm:mt-6">
          {/* Left Fade */}
          <div
            className="absolute left-0 top-0 bottom-0 w-8 sm:w-10 md:w-16 lg:w-20 
              bg-gradient-to-r from-white via-white/40 to-transparent
              pointer-events-none z-20"
          />

          {/* Right Fade */}
          <div
            className="absolute right-0 top-0 bottom-0 w-8 sm:w-10 md:w-16 lg:w-20 
              bg-gradient-to-l from-white via-white/40 to-transparent
              pointer-events-none z-20"
          />

          {/* Previous Button */}
          <button
            aria-label="Previous"
            className="hidden md:flex absolute -left-2 sm:-left-4 md:-left-6 lg:-left-10 top-1/2 -translate-y-1/2
              z-30 p-3 sm:p-4 rounded-full 
              bg-white/50 backdrop-blur-xl shadow-xl
              border border-white/40 
              hover:scale-110 transition-all duration-300 
              hover:bg-white/90 items-center justify-center"
            onClick={() => swiperRef.current?.slidePrev()}
          >
            <FaArrowLeft className="text-blue-700 text-base sm:text-lg" />
          </button>

          {/* Next Button */}
          <button
            aria-label="Next"
            className="hidden md:flex absolute -right-2 sm:-right-4 md:-right-6 lg:-right-10 top-1/2 -translate-y-1/2
              z-30 p-3 sm:p-4 rounded-full 
              bg-white/50 backdrop-blur-xl shadow-xl
              border border-white/40
              hover:scale-110 transition-all duration-300 
              hover:bg-white/90 items-center justify-center"
            onClick={() => swiperRef.current?.slideNext()}
          >
            <FaArrowRight className="text-blue-700 text-base sm:text-lg" />
          </button>

          <Swiper
            {...sliderSettings}
            modules={[Autoplay]}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            loop={false} // Set loop to false to prevent infinite scrolling
            onSwiper={(swiper) => (swiperRef.current = swiper)}
            className="pb-10 pt-6 -mx-2"
          >
            {displayProperties.map((card: any, index: number) => (
              <SwiperSlide key={card._id || index} className="px-2">
                <MemoizedPropertyCard card={card} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default Residencies;

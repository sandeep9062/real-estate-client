// Testimonial.tsx
"use client"; // Important for components using state and event listeners in Next.js App Router

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { FaStar, FaChevronLeft, FaChevronRight } from "react-icons/fa";

// Define the type for a single testimonial item
interface TestimonialItem {
  id: number;
  name: string;
  role: string;
  image: string;
  text: string;
  rating: number; // Assuming a rating out of 5 for stars
}

// Cleaned and standardized dummy data for testimonials
const testimonials: TestimonialItem[] = [
  {
    id: 1,
    name: "Rajat Sharma",
    role: "Home Buyer",
    image: "/mohit.png",
    text: "Propertybulbul made my home-buying journey incredibly simple. The platform helped me explore the right localities, compare properties, and connect with a trusted agent. Finally bought the perfect home for my family!",
    rating: 5,
  },
  {
    id: 2,
    name: "Mandeep Singh",
    role: "Commercial Buyer",
    image: "/doctor5.png",
    text: "I found exactly the commercial space I was looking for through Propertybulbul. Smooth communication, verified listings, and excellent support made the entire process effortless.",
    rating: 5,
  },
  {
    id: 3,
    name: "Priya Patel",
    role: "Real Estate Investor",
    image: "/neha.png",
    text: "Propertybulbul helped me identify high-return investment properties faster than ever. Their data-driven insights and professional service truly stand out in the market.",
    rating: 5,
  },
  {
    id: 4,
    name: "Anil Kumar",
    role: "Seller",
    image: "/rahul.png",
    text: "Listing my property on Propertybulbul brought in genuine buyers within days. Their agent network, transparency, and marketing support helped me get a great offer quickly.",
    rating: 4,
  },
  {
    id: 5,
    name: "Jasmine Kaur",
    role: "First-Time Buyer",
    image: "/doctor5.png",
    text: "Being a first-time buyer, I had many doubts. Propertybulbul provided clear guidance, expert assistance, and verified listings that helped me purchase confidently and stress-free.",
    rating: 5,
  },
  {
    id: 6,
    name: "Vikram Reddy",
    role: "Luxury Property Buyer",
    image: "/mohit.png",
    text: "Propertybulbul offers an exceptional luxury property experience. Their curated listings, premium service, and attention to detail truly match the expectations of high-end buyers like me.",
    rating: 5,
  },
];

const Testimonial: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(1); // Default to 1 for mobile-first

  // Determine items per view based on screen size
  useEffect(() => {
    const handleResize = () => {
      // Tailwind's 'md' breakpoint is 768px
      setItemsPerView(window.innerWidth >= 768 ? 2 : 1);
    };

    handleResize(); // Set initial value
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize); // Cleanup
  }, []);

  const totalItems = testimonials.length;
  const totalPages = Math.ceil(totalItems / itemsPerView);

  // --- Carousel Navigation Logic ---
  const handleNext = useCallback(() => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  }, [totalPages]);

  const handlePrev = useCallback(() => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  }, [totalPages]);

  // Auto-play functionality
  useEffect(() => {
    const interval = setInterval(handleNext, 3000); // Change testimonial every 3 seconds
    return () => clearInterval(interval); // Cleanup on component unmount
  }, [handleNext]);

  // Reset to the first page if totalPages changes to avoid an out-of-bounds page
  useEffect(() => {
    if (currentPage >= totalPages) {
      setCurrentPage(0);
    }
  }, [totalPages, currentPage]);

  // Calculate the percentage to translate (shift) the inner carousel container
  // Each page shift is 100% of the visible container width

  const translateXValue = currentPage * 100;

  // --- UI Helpers ---
  // Helper to render star ratings
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <FaStar
        key={i}
        className={`w-4 h-4 transition-colors ${
          i < rating ? "text-yellow-500" : "text-gray-300"
        }`}
      />
    ));
  };

  // Function to scroll to the top of the page

  // const scrollToTop = () => {
  //   window.scrollTo({
  //     top: 0,
  //     behavior: "smooth",
  //   });
  // };

  return (
    <div className="w-full bg-white py-12 px-4 md:px-8 font-sans">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <p className="text-indigo-600 font-semibold mb-2 text-lg uppercase tracking-wider">
            Client Stories
          </p>
          <h2 className="text-2xl md:text-4xl font-extrabold text-gray-900 leading-tight">
            <span className="bg-clip-text text-transparent bg-gray-900">
              FOLKS WHO LOVE US!
            </span>
          </h2>
          <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
            See why our clients trust us to find their perfect property.
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Inner Track (Viewport) */}
          <div className="overflow-hidden md:p-8">
            <div
              className="flex transition-transform duration-700 ease-in-out"
              style={{ transform: `translateX(-${translateXValue}%)` }}
            >
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  // Card sizing: Always takes full width on mobile, and half the width on desktop (md)
                  className="w-full shrink-0 md:w-1/2 p-4"
                >
                  <div className="bg-white border border-gray-200 h-full p-6 rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300 flex flex-col">
                    {/* User Info and Quote */}
                    <p className="text-gray-700 text-base mb-6 italic leading-relaxed grow">
                      "{testimonial.text}"
                    </p>

                    <div className="pt-4 border-t border-gray-200 flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border-2 border-indigo-500 shadow-sm">
                          <Image
                            src={testimonial.image}
                            alt={testimonial.name}
                            width={48}
                            height={48}
                            className="object-cover w-full h-full"
                            sizes="48px"
                            priority={true}
                            unoptimized={true} // Use this for placeholder URLs
                          />
                        </div>
                        <div className="ml-4">
                          <h3 className="text-md font-bold text-gray-800">
                            {testimonial.name}
                          </h3>
                          <p className="text-xs text-indigo-500 font-medium">
                            {testimonial.role}
                          </p>
                        </div>
                      </div>
                      <div className="flex text-sm">
                        {renderStars(testimonial.rating)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons (Absolute Positioning) */}
          <button
            onClick={handlePrev}
            className="absolute top-1/2 left-0 md:-left-8 transform -translate-y-1/2 bg-white text-gray-700 p-3 rounded-full shadow-lg hover:bg-indigo-500 hover:text-white transition-all duration-300 z-10 hidden md:block"
            aria-label="Previous testimonial"
          >
            <FaChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handleNext}
            className="absolute top-1/2 right-0 md:-right-8 transform -translate-y-1/2 bg-white text-gray-700 p-3 rounded-full shadow-lg hover:bg-indigo-500 hover:text-white transition-all duration-300 z-10 hidden md:block"
            aria-label="Next testimonial"
          >
            <FaChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Pagination Dots (Mobile and Desktop) */}
        <div className="flex justify-center mt-4 space-x-4">
          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                index === currentPage
                  ? "bg-indigo-600 transform scale-125"
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
              onClick={() => setCurrentPage(index)}
              aria-label={`Go to testimonial page ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Testimonial;

"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  FaStar,
  FaQuoteLeft,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

interface TestimonialItem {
  id: number;
  name: string;
  role: string;
  image?: string;
  text: string;
  rating: number;
}

const testimonials: TestimonialItem[] = [
  {
    id: 1,
    name: "Rajat Sharma",
    role: "Home Buyer",
    text: "PropertyBulbul made my home-buying journey incredibly simple. The platform helped me explore the right localities, compare properties, and connect with a trusted agent. Finally bought the perfect home for my family!",
    rating: 5,
  },
  {
    id: 2,
    name: "Mandeep Singh",
    role: "Commercial Buyer",
    text: "I found exactly the commercial space I was looking for through PropertyBulbul. Smooth communication, verified listings, and excellent support made the entire process effortless.",
    rating: 5,
  },
  {
    id: 3,
    name: "Priya Patel",
    role: "Real Estate Investor",
    text: "PropertyBulbul helped me identify high-return investment properties faster than ever. Their data-driven insights and professional service truly stand out in the market.",
    rating: 5,
  },
  {
    id: 4,
    name: "Anil Kumar",
    role: "Property Seller",
    text: "Listing my property on PropertyBulbul brought in genuine buyers within days. Their agent network, transparency, and marketing support helped me get a great offer quickly.",
    rating: 4,
  },
  {
    id: 5,
    name: "Jasmine Kaur",
    role: "First-Time Buyer",
    text: "Being a first-time buyer, I had many doubts. PropertyBulbul provided clear guidance, expert assistance, and verified listings that helped me purchase confidently and stress-free.",
    rating: 5,
  },
  {
    id: 6,
    name: "Vikram Reddy",
    role: "Luxury Property Buyer",
    text: "PropertyBulbul offers an exceptional luxury property experience. Their curated listings, premium service, and attention to detail truly match the expectations of high-end buyers like me.",
    rating: 5,
  },
];

// Consistent color per person based on their name
const AVATAR_COLORS = [
  "bg-indigo-500",
  "bg-violet-500",
  "bg-blue-500",
  "bg-sky-500",
  "bg-purple-500",
  "bg-fuchsia-500",
];

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function getAvatarColor(id: number): string {
  return AVATAR_COLORS[(id - 1) % AVATAR_COLORS.length];
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <FaStar
          key={i}
          className={`w-3.5 h-3.5 ${i < rating ? "text-yellow-400" : "text-gray-200"}`}
        />
      ))}
    </div>
  );
}

function Avatar({ testimonial }: { testimonial: TestimonialItem }) {
  const [imgError, setImgError] = useState(false);
  const showInitials = !testimonial.image || imgError;

  return (
    <div
      className={`w-11 h-11 md:w-12 md:h-12 rounded-full shrink-0 border-2 border-indigo-200 shadow-sm overflow-hidden flex items-center justify-center ${
        showInitials ? getAvatarColor(testimonial.id) : ""
      }`}
    >
      {showInitials ? (
        <span className="text-white font-semibold text-sm">
          {getInitials(testimonial.name)}
        </span>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={testimonial.image}
          alt={testimonial.name}
          className="w-full h-full object-cover"
          onError={() => setImgError(true)}
        />
      )}
    </div>
  );
}

function TestimonialCard({ testimonial }: { testimonial: TestimonialItem }) {
  return (
    <div className="bg-white border border-gray-100 h-full p-5 md:p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col relative">
      {/* Quote icon */}
      <FaQuoteLeft
        className="text-indigo-100 w-8 h-8 absolute top-5 right-5"
        aria-hidden="true"
      />

      {/* Rating */}
      <div className="mb-3">
        <StarRating rating={testimonial.rating} />
      </div>

      {/* Text */}
      <p className="text-gray-600 text-sm sm:text-base leading-relaxed grow">
        {testimonial.text}
      </p>

      {/* Divider */}
      <div className="border-t border-gray-100 mt-4 pt-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <Avatar testimonial={testimonial} />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-800 truncate">
              {testimonial.name}
            </p>
            <p className="text-xs text-indigo-500 font-medium truncate">
              {testimonial.role}
            </p>
          </div>
        </div>
        {/* Verified badge */}
        <span className="shrink-0 text-xs bg-green-50 text-green-600 border border-green-100 px-2 py-0.5 rounded-full font-medium">
          Verified
        </span>
      </div>
    </div>
  );
}

const Testimonial: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      setItemsPerView(window.innerWidth >= 768 ? 2 : 1);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const totalPages = Math.ceil(testimonials.length / itemsPerView);

  const handleNext = useCallback(() => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  }, [totalPages]);

  const handlePrev = useCallback(() => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  }, [totalPages]);

  // Auto-play — pauses on hover/focus
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(handleNext, 4000);
    return () => clearInterval(interval);
  }, [handleNext, isPaused]);

  // Clamp page index when itemsPerView changes
  useEffect(() => {
    if (currentPage >= totalPages) setCurrentPage(0);
  }, [totalPages, currentPage]);

  // Keyboard navigation
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };
    el.addEventListener("keydown", onKey);
    return () => el.removeEventListener("keydown", onKey);
  }, [handleNext, handlePrev]);

  return (
    <section
      className="w-full py-10 sm:py-14 md:py-16 px-4 sm:px-6 lg:px-8 font-sans"
      aria-label="Client testimonials"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-10 md:mb-12">
          <p className="text-indigo-600 font-semibold text-xs sm:text-sm uppercase tracking-wider mb-2">
            Client Stories
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight">
            Folks Who Love Us
          </h2>
          <p className="text-gray-500 mt-3 max-w-xl mx-auto text-sm sm:text-base">
            Real experiences from buyers, sellers, and investors across Tricity.
          </p>
        </div>

        {/* Carousel */}
        <div
          ref={trackRef}
          className="relative focus:outline-none"
          tabIndex={0}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onFocus={() => setIsPaused(true)}
          onBlur={() => setIsPaused(false)}
        >
          {/* Viewport */}
          <div className="overflow-hidden rounded-2xl">
            <div
              className="flex transition-transform duration-700 ease-in-out"
              style={{ transform: `translateX(-${currentPage * 100}%)` }}
              aria-live="polite"
            >
              {testimonials.map((t) => (
                <div
                  key={t.id}
                  className="w-full shrink-0 md:w-1/2 p-2 sm:p-3"
                  aria-hidden={
                    Math.floor(t.id / itemsPerView) !== currentPage
                      ? "true"
                      : undefined
                  }
                >
                  <TestimonialCard testimonial={t} />
                </div>
              ))}
            </div>
          </div>

          {/* Prev button */}
          <button
            onClick={handlePrev}
            className="absolute top-1/2 -left-3 sm:-left-5 -translate-y-1/2 bg-white border border-gray-200 text-gray-500 p-2.5 rounded-full shadow hover:bg-indigo-500 hover:text-white hover:border-indigo-500 transition-all duration-200 z-10 hidden sm:flex items-center justify-center"
            aria-label="Previous testimonials"
          >
            <FaChevronLeft className="w-4 h-4" />
          </button>

          {/* Next button */}
          <button
            onClick={handleNext}
            className="absolute top-1/2 -right-3 sm:-right-5 -translate-y-1/2 bg-white border border-gray-200 text-gray-500 p-2.5 rounded-full shadow hover:bg-indigo-500 hover:text-white hover:border-indigo-500 transition-all duration-200 z-10 hidden sm:flex items-center justify-center"
            aria-label="Next testimonials"
          >
            <FaChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Pagination dots */}
        <div
          className="flex justify-center mt-6 gap-2"
          role="tablist"
          aria-label="Testimonial pages"
        >
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              role="tab"
              aria-selected={i === currentPage}
              aria-label={`Page ${i + 1}`}
              onClick={() => setCurrentPage(i)}
              className={`rounded-full transition-all duration-300 ${
                i === currentPage
                  ? "bg-indigo-600 w-6 h-3"
                  : "bg-gray-300 hover:bg-gray-400 w-3 h-3"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonial;

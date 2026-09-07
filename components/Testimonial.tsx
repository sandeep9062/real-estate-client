"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  FaStar,
  FaQuoteLeft,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { HiBadgeCheck } from "react-icons/hi";

const BRAND = "#4161df";
const INK = "#161A2E";
const INK_SOFT = "#5C5F73";
const TINT_BG = "#EEF1FC";
const TINT_LINE = "#DCE1F7";

interface TestimonialItem {
  id: number;
  name: string;
  role: string;
  location: string;
  image?: string;
  text: string;
  rating: number;
}

const testimonials: TestimonialItem[] = [
  {
    id: 1,
    name: "Rajat Sharma",
    role: "Home Buyer",
    location: "Chandigarh",
    text: "PropertyBulbul made my home-buying journey incredibly simple. They helped me compare the right localities and connect with a trusted agent — finally found the perfect home for my family.",
    rating: 5,
  },
  {
    id: 2,
    name: "Mandeep Singh",
    role: "Commercial Buyer",
    location: "Mohali",
    text: "I found exactly the commercial space I was looking for through PropertyBulbul. Verified listings and smooth communication made the entire process effortless, start to finish.",
    rating: 5,
  },
  {
    id: 3,
    name: "Priya Patel",
    role: "Real Estate Investor",
    location: "Zirakpur",
    text: "PropertyBulbul helped me identify high-return investment properties faster than ever. Their data-driven insights genuinely stand out in a market full of guesswork.",
    rating: 5,
  },
  {
    id: 4,
    name: "Anil Kumar",
    role: "Property Seller",
    location: "Panchkula",
    text: "Listing my property on PropertyBulbul brought in genuine buyers within days. Their agent network and transparent process helped me close a great offer quickly.",
    rating: 4,
  },
  {
    id: 5,
    name: "Jasmine Kaur",
    role: "First-Time Buyer",
    location: "Kharar",
    text: "Being a first-time buyer, I had a lot of doubts. Clear guidance and verified listings helped me purchase confidently, without the usual stress.",
    rating: 5,
  },
  {
    id: 6,
    name: "Vikram Reddy",
    role: "Luxury Property Buyer",
    location: "Chandigarh",
    text: "An exceptional experience end to end. Curated listings, premium service, and real attention to detail — exactly what I look for as a high-end buyer.",
    rating: 5,
  },
];

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <FaStar
          key={i}
          className="w-3.5 h-3.5"
          style={{ color: i < rating ? "#F5A623" : TINT_LINE }}
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
      className="w-11 h-11 md:w-12 md:h-12 rounded-full shrink-0 overflow-hidden flex items-center justify-center"
      style={{
        background: showInitials ? BRAND : "transparent",
        border: `1.5px solid ${TINT_LINE}`,
      }}
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
    <div
      className="bg-white h-full p-5 md:p-6 rounded-2xl border shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col relative"
      style={{ borderColor: TINT_LINE }}
    >
      {/* Quote icon */}
      <div
        className="absolute top-5 right-5 w-8 h-8 rounded-full flex items-center justify-center"
        style={{ background: TINT_BG }}
        aria-hidden="true"
      >
        <FaQuoteLeft className="w-3.5 h-3.5" style={{ color: BRAND }} />
      </div>

      {/* Rating */}
      <div className="mb-3">
        <StarRating rating={testimonial.rating} />
      </div>

      {/* Text */}
      <p
        className="text-sm sm:text-base leading-relaxed grow pr-6"
        style={{ color: INK_SOFT }}
      >
        {testimonial.text}
      </p>

      {/* Divider */}
      <div
        className="border-t mt-4 pt-4 flex items-center justify-between gap-3"
        style={{ borderColor: TINT_LINE }}
      >
        <div className="flex items-center gap-3 min-w-0">
          <Avatar testimonial={testimonial} />
          <div className="min-w-0">
            <p
              className="text-sm font-semibold truncate"
              style={{ color: INK }}
            >
              {testimonial.name}
            </p>
            <p
              className="text-xs font-medium truncate"
              style={{ color: BRAND }}
            >
              {testimonial.role} · {testimonial.location}
            </p>
          </div>
        </div>
        {/* Verified badge */}
        <span
          className="shrink-0 flex items-center gap-1 text-xs px-2 py-1 rounded-full font-medium"
          style={{
            background: TINT_BG,
            color: BRAND,
            border: `1px solid ${TINT_LINE}`,
          }}
        >
          <HiBadgeCheck className="w-3.5 h-3.5" />
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
      className="w-full py-14 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 font-sans"
      aria-label="Client testimonials"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header — matches Value section's label + heading pattern */}
        <div className="flex flex-col items-center text-center mb-10 sm:mb-12">
          <div className="flex items-center gap-2.5 mb-4">
            <span
              className="w-8 h-[3px] rounded-full"
              style={{ background: BRAND }}
            />
            <span className="text-sm font-medium" style={{ color: BRAND }}>
              Client stories
            </span>
          </div>

          <h2
            className="text-2xl sm:text-3xl md:text-4xl font-bold leading-[1.15] mb-3"
            style={{ color: INK }}
          >
            Folks who trust PropertyBulbul
          </h2>

          <p
            className="text-[15px] sm:text-base leading-relaxed max-w-[52ch]"
            style={{ color: INK_SOFT }}
          >
            Real experiences from buyers, sellers, and investors across the
            Tricity — Chandigarh, Mohali, Panchkula, Zirakpur, and Kharar.
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
            className="absolute top-1/2 -left-3 sm:-left-5 -translate-y-1/2 bg-white p-2.5 rounded-full shadow transition-all duration-200 z-10 hidden sm:flex items-center justify-center"
            style={{ border: `1px solid ${TINT_LINE}`, color: INK_SOFT }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = BRAND;
              e.currentTarget.style.color = "#fff";
              e.currentTarget.style.borderColor = BRAND;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#fff";
              e.currentTarget.style.color = INK_SOFT;
              e.currentTarget.style.borderColor = TINT_LINE;
            }}
            aria-label="Previous testimonials"
          >
            <FaChevronLeft className="w-4 h-4" />
          </button>

          {/* Next button */}
          <button
            onClick={handleNext}
            className="absolute top-1/2 -right-3 sm:-right-5 -translate-y-1/2 bg-white p-2.5 rounded-full shadow transition-all duration-200 z-10 hidden sm:flex items-center justify-center"
            style={{ border: `1px solid ${TINT_LINE}`, color: INK_SOFT }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = BRAND;
              e.currentTarget.style.color = "#fff";
              e.currentTarget.style.borderColor = BRAND;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#fff";
              e.currentTarget.style.color = INK_SOFT;
              e.currentTarget.style.borderColor = TINT_LINE;
            }}
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
              className="rounded-full transition-all duration-300"
              style={{
                background: i === currentPage ? BRAND : TINT_LINE,
                width: i === currentPage ? "24px" : "12px",
                height: "12px",
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonial;

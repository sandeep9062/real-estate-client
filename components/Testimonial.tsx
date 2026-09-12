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

const AUTOPLAY_DELAY = 4500;

/** Native horizontal scroller (same pattern as Residencies) —
 *  swiping left/right and the arrow buttons both scroll smoothly. */
const scrollContainerClass =
  "flex gap-3 overflow-x-auto snap-x snap-mandatory py-1 select-none cursor-grab active:cursor-grabbing [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden";

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
    name: "Sneha Jamwal",
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
    name: "Priya Sharma",
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
    name: "Vikram Mehra",
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
  const scrollRef = useRef<HTMLDivElement>(null);
  const stepRef = useRef(0);
  const isDragRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartScrollRef = useRef(0);
  const dragMovedRef = useRef(false);
  const [paused, setPaused] = useState(false);
  const [seq, setSeq] = useState(0); // bumped to restart the autoplay timer after manual nav
  const [visiblePerPage, setVisiblePerPage] = useState(1);
  const [activePage, setActivePage] = useState(0);

  const count = testimonials.length;
  const pages = Math.max(1, count - visiblePerPage + 1);

  const measure = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const first = el.querySelector<HTMLElement>("[data-slide]");
    if (!first) return;
    const gap = parseFloat(getComputedStyle(el).columnGap || "0") || 0;
    const step = first.offsetWidth + gap;
    const perPage = Math.max(1, Math.round(el.clientWidth / step));
    stepRef.current = step;
    setVisiblePerPage(perPage);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [measure, count]);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el || !stepRef.current) return;
    setActivePage(
      Math.min(
        Math.max(0, Math.round(el.scrollLeft / stepRef.current)),
        pages - 1,
      ),
    );
  }, [pages]);

  const scrollToPage = useCallback((page: number) => {
    const el = scrollRef.current;
    if (!el || !stepRef.current) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    el.scrollTo({
      left: Math.max(0, Math.min(page * stepRef.current, maxScroll)),
      behavior: "smooth",
    });
    setSeq((s) => s + 1);
  }, []);

  // Mouse drag-to-scroll (touch/devices use native overflow scrolling)
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return; // let touch do native scroll
    const el = scrollRef.current;
    if (!el) return;
    isDragRef.current = true;
    dragMovedRef.current = false;
    dragStartXRef.current = e.clientX;
    dragStartScrollRef.current = el.scrollLeft;
    el.style.scrollBehavior = "auto"; // keep drag pixel-accurate
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = scrollRef.current;
    if (!el || !isDragRef.current) return;
    const dx = e.clientX - dragStartXRef.current;
    if (!dragMovedRef.current && Math.abs(dx) > 6) {
      dragMovedRef.current = true;
    }
    if (dragMovedRef.current) {
      el.scrollLeft = dragStartScrollRef.current - dx;
    }
  };

  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragRef.current) return;
    const el = scrollRef.current;
    if (el) {
      el.style.scrollBehavior = "";
    }
    isDragRef.current = false;
    void e;
  };

  const handleClickCapture = (e: React.MouseEvent<HTMLDivElement>) => {
    if (dragMovedRef.current) {
      e.preventDefault();
      e.stopPropagation();
      dragMovedRef.current = false;
    }
  };

  // Soft autoplay — advances one card step, pauses while hovered
  useEffect(() => {
    if (paused || count <= 1) return;
    const id = window.setInterval(() => {
      const el = scrollRef.current;
      if (!el || !stepRef.current) return;
      const maxScroll = el.scrollWidth - el.clientWidth;
      if (maxScroll <= 0) return;
      const nearest = Math.round(el.scrollLeft / stepRef.current);
      const next = (nearest + 1) * stepRef.current;
      el.scrollTo({
        left: next >= maxScroll ? 0 : Math.min(next, maxScroll),
        behavior: "smooth",
      });
    }, AUTOPLAY_DELAY);
    return () => window.clearInterval(id);
  }, [paused, seq, count]);

  const handlePrev = useCallback(() => {
    scrollToPage(Math.max(0, activePage - 1));
  }, [activePage, scrollToPage]);

  const handleNext = useCallback(() => {
    scrollToPage(Math.min(activePage + 1, pages - 1));
  }, [activePage, pages, scrollToPage]);

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
          className="relative focus:outline-none"
          tabIndex={0}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
          onKeyDown={(e) => {
            if (e.key === "ArrowLeft") {
              e.preventDefault();
              handlePrev();
            }
            if (e.key === "ArrowRight") {
              e.preventDefault();
              handleNext();
            }
          }}
        >
          <div className="pointer-events-none absolute inset-y-2 left-0 z-20 w-5 rounded-l-2xl bg-gradient-to-r from-white via-white/90 to-transparent sm:w-8" />
          <div className="pointer-events-none absolute inset-y-2 right-0 z-20 w-5 rounded-r-2xl bg-gradient-to-l from-white via-white/90 to-transparent sm:w-8" />

          {/* Native horizontal scroller */}
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            onClickCapture={handleClickCapture}
            className={scrollContainerClass}
            aria-live="polite"
          >
            {testimonials.map((t) => (
              <div
                key={t.id}
                data-slide
                className="shrink-0 snap-start w-[min(calc(100%-2rem),26rem)] sm:w-[calc(50%-0.375rem)]"
              >
                <TestimonialCard testimonial={t} />
              </div>
            ))}
          </div>

          {/* Prev button */}
          <button
            onClick={handlePrev}
            className="absolute top-1/2 -left-3 sm:-left-5 -translate-y-1/2 z-30 bg-white p-2.5 rounded-full shadow-md transition-all duration-200 hidden sm:flex items-center justify-center"
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
            className="absolute top-1/2 -right-3 sm:-right-5 -translate-y-1/2 z-30 bg-white p-2.5 rounded-full shadow-md transition-all duration-200 hidden sm:flex items-center justify-center"
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
          {Array.from({ length: pages }).map((_, i) => (
            <button
              key={i}
              role="tab"
              aria-selected={i === activePage}
              aria-label={`Page ${i + 1}`}
              onClick={() => scrollToPage(i)}
              className="rounded-full transition-all duration-300"
              style={{
                background: i === activePage ? BRAND : TINT_LINE,
                width: i === activePage ? "24px" : "12px",
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

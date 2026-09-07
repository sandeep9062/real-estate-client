import React, { useRef, memo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import PropertyCard from "./PropertyCard";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { HiOutlineHome } from "react-icons/hi";

const BRAND = "#4161df";
const INK = "#161A2E";
const INK_SOFT = "#5C5F73";
const TINT_BG = "#EEF1FC";
const TINT_LINE = "#DCE1F7";

/** Wider cards + tighter gutters than the global slider helper */
const RESIDENCIES_SWIPER = {
  slidesPerView: 1,
  spaceBetween: 10,
  breakpoints: {
    480: { slidesPerView: 1, spaceBetween: 12 },
    768: { slidesPerView: 2, spaceBetween: 12 },
    1024: { slidesPerView: 2, spaceBetween: 14 },
    1440: { slidesPerView: 4, spaceBetween: 14 },
  },
} as const;

const MemoizedPropertyCard = memo(PropertyCard);

interface ResidenciesProps {
  featuredProperties: any[];
}

const navButtonClass =
  "absolute top-1/2 z-30 hidden -translate-y-1/2 md:flex size-11 items-center justify-center rounded-full bg-white text-slate-600 shadow-sm transition-all duration-200 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2";

const Residencies: React.FC<ResidenciesProps> = ({ featuredProperties }) => {
  const swiperRef = useRef<any>(null);

  const count = featuredProperties.length;

  if (featuredProperties.length === 0) {
    return (
      <section className="py-14 sm:py-16 md:py-20">
        <div className="mx-auto max-w-lg px-4 text-center">
          <div
            className="rounded-2xl border bg-white px-8 py-10 shadow-sm"
            style={{ borderColor: TINT_LINE }}
          >
            <div
              className="mx-auto mb-4 flex size-11 items-center justify-center rounded-full"
              style={{ background: TINT_BG }}
            >
              <HiOutlineHome className="size-5" style={{ color: BRAND }} />
            </div>
            <p className="text-sm font-semibold" style={{ color: INK }}>
              No featured listings at the moment.
            </p>
            <p className="mt-2 text-sm" style={{ color: INK_SOFT }}>
              Check back soon for new highlighted properties.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden py-14 sm:py-16 md:py-20">
      {/* Subtle background depth, consistent with other homepage sections */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 right-[-6rem] h-72 w-72 rounded-full blur-3xl"
        style={{ background: TINT_BG }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 left-[-6rem] h-72 w-72 rounded-full blur-3xl opacity-70"
        style={{ background: TINT_BG }}
      />

      <div className="relative mx-auto max-w-[100rem] px-3 sm:px-5 lg:px-8">
        <header className="mx-auto mb-8 flex max-w-3xl flex-col items-center text-center sm:mb-10 md:mb-12">
          <div className="mb-4 flex items-center gap-2.5">
            <span
              className="h-[3px] w-8 rounded-full"
              style={{ background: BRAND }}
            />
            <span className="text-sm font-medium" style={{ color: BRAND }}>
              Featured listings
            </span>
          </div>

          <h2
            className="text-2xl font-bold leading-[1.15] sm:text-3xl md:text-4xl"
            style={{ color: INK }}
          >
            Selected properties
          </h2>

          <p
            className="mx-auto mt-3 max-w-[52ch] text-[15px] leading-relaxed sm:text-base"
            style={{ color: INK_SOFT }}
          >
            A curated overview of highlighted residential and commercial
            listings across the Tricity, presented for review and comparison.
          </p>

          {count > 0 && (
            <span
              className="mt-5 inline-flex items-center gap-2   px-3 py-1 text-xs font-medium"
              style={{
                borderColor: TINT_LINE,
                color: INK_SOFT,
                background: "#fff",
              }}
            >
              <span
                className="inline-block size-1.5 rounded-full"
                style={{ background: BRAND }}
              />
              {count} listing{count !== 1 ? "s" : ""} in this collection
            </span>
          )}
        </header>

        <div className="relative p-2 sm:p-3 md:p-4">
          <div className="pointer-events-none absolute inset-y-2 left-0 z-20 w-5 rounded-l-2xl bg-gradient-to-r from-white via-white/90 to-transparent sm:inset-y-3 sm:w-8 md:w-12" />
          <div className="pointer-events-none absolute inset-y-2 right-0 z-20 w-5 rounded-r-2xl bg-gradient-to-l from-white via-white/90 to-transparent sm:inset-y-3 sm:w-8 md:w-12" />

          <button
            type="button"
            aria-label="Previous slide"
            className={`${navButtonClass} md:left-1 lg:left-2`}
            style={{ border: `1px solid ${TINT_LINE}`, outlineColor: BRAND }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = BRAND;
              e.currentTarget.style.borderColor = BRAND;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#fff";
              e.currentTarget.style.borderColor = TINT_LINE;
            }}
            onClick={() => swiperRef.current?.slidePrev()}
          >
            <FaArrowLeft className="text-sm sm:text-base" />
          </button>

          <button
            type="button"
            aria-label="Next slide"
            className={`${navButtonClass} md:right-1 lg:right-2`}
            style={{ border: `1px solid ${TINT_LINE}`, outlineColor: BRAND }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = BRAND;
              e.currentTarget.style.borderColor = BRAND;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#fff";
              e.currentTarget.style.borderColor = TINT_LINE;
            }}
            onClick={() => swiperRef.current?.slideNext()}
          >
            <FaArrowRight className="text-sm sm:text-base" />
          </button>

          <Swiper
            {...RESIDENCIES_SWIPER}
            modules={[Autoplay, Pagination]}
            autoplay={{
              delay: 4500,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            pagination={{
              clickable: true,
              dynamicBullets: true,
              dynamicMainBullets: 5,
            }}
            loop={false}
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
            }}
            className="featured-swiper pb-11! pt-1! sm:pb-12! [&_.swiper-slide]:box-border [&_.swiper-slide]:max-w-full [&_.swiper-slide]:overflow-hidden [&_.swiper-pagination]:bottom-1! [&_.swiper-pagination-bullet]:h-1.5 [&_.swiper-pagination-bullet]:w-1.5 [&_.swiper-pagination-bullet]:bg-slate-300 [&_.swiper-pagination-bullet]:opacity-100 [&_.swiper-pagination-bullet-active]:w-5 [&_.swiper-pagination-bullet-active]:rounded-full [&_.swiper-pagination-bullet-active]:bg-[#4161df] [&_.swiper-pagination-bullet-active]:transition-all [&_.swiper-wrapper]:items-stretch [&_.swiper-slide]:min-h-0 [&_.swiper-slide]:min-w-0"
          >
            {featuredProperties.map((card: any, index: number) => (
              <SwiperSlide
                key={card._id || index}
                className="box-border !h-auto min-h-0 min-w-0 max-w-full shrink-0 overflow-hidden px-1 sm:px-1.5"
              >
                <div className="mx-auto flex h-[396px] w-full max-w-full min-h-0 flex-col transition-transform duration-300 hover:-translate-y-1 sm:h-[420px]">
                  <MemoizedPropertyCard card={card} variant="carousel" />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default Residencies;

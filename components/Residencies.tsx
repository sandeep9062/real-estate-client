import React, { useRef, memo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import PropertyCard from "./PropertyCard";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { Layers } from "lucide-react";

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
  "absolute top-1/2 z-30 hidden -translate-y-1/2 md:flex size-11 items-center justify-center rounded-full border border-slate-200/90 bg-white/95 text-slate-700 shadow-sm transition-all duration-200 hover:border-[#4161df]/35 hover:bg-white hover:text-[#4161df] hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4161df]";

const Residencies: React.FC<ResidenciesProps> = ({ featuredProperties }) => {
  const swiperRef = useRef<any>(null);

  const count = featuredProperties.length;

  if (featuredProperties.length === 0) {
    return (
      <section className="border-t border-slate-200/80 bg-slate-50/80 py-16 sm:py-20">
        <div className="mx-auto max-w-lg px-4 text-center">
          <div className="rounded-2xl border border-slate-200 bg-white px-8 py-10 shadow-sm">
            <p className="text-sm font-medium text-slate-800">
              No featured listings at the moment.
            </p>
            <p className="mt-2 text-sm text-slate-500">
              Check back soon for new highlighted properties.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden border-t border-slate-200/80 bg-slate-50/90 py-12 sm:py-16 md:py-20">
      {/* Subtle background depth */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(65,97,223,0.06),transparent_55%)]"
        aria-hidden
      />

      <div className="relative mx-auto max-w-[100rem] px-3 sm:px-5 lg:px-8">
        <header className="mx-auto mb-8 max-w-3xl text-center sm:mb-10 md:mb-12">
          <div className="mb-4 flex items-center justify-center gap-3">
            <span className="h-px w-10 bg-gradient-to-r from-transparent to-[#4161df]/50 sm:w-14" />
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200/90 bg-white/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 shadow-sm backdrop-blur-sm">
              <Layers className="size-3.5 text-[#4161df]" strokeWidth={2} />
              Featured listings
            </span>
            <span className="h-px w-10 bg-gradient-to-l from-transparent to-[#4161df]/50 sm:w-14" />
          </div>

          <h2 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl md:text-4xl md:leading-[1.15]">
            Selected properties
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-slate-600 sm:text-base">
            A curated overview of highlighted residential and commercial
            listings, presented for review and comparison.
          </p>

          {count > 0 && (
            <p className="mt-5 text-xs font-medium uppercase tracking-wider text-slate-400">
              {count} listing{count !== 1 ? "s" : ""} in this collection
            </p>
          )}
        </header>

        <div className="relative  p-2  sm:p-3 md:p-4">
          <div className="pointer-events-none absolute inset-y-2 left-0 z-20 w-5 rounded-l-2xl bg-gradient-to-r from-white via-white/90 to-transparent sm:inset-y-3 sm:w-8 md:w-12" />
          <div className="pointer-events-none absolute inset-y-2 right-0 z-20 w-5 rounded-r-2xl bg-gradient-to-l from-white via-white/90 to-transparent sm:inset-y-3 sm:w-8 md:w-12" />

          <button
            type="button"
            aria-label="Previous slide"
            className={`${navButtonClass} md:left-1 lg:left-2`}
            onClick={() => swiperRef.current?.slidePrev()}
          >
            <FaArrowLeft className="text-sm sm:text-base" />
          </button>

          <button
            type="button"
            aria-label="Next slide"
            className={`${navButtonClass} md:right-1 lg:right-2`}
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
                <div className="mx-auto flex h-[396px] w-full max-w-full min-h-0 flex-col sm:h-[420px]">
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

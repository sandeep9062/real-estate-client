import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import PropertyCard from "./PropertyCard";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { HiOutlineHome } from "react-icons/hi";

const BRAND = "#4161df";
const INK = "#161A2E";
const INK_SOFT = "#5C5F73";
const TINT_BG = "#EEF1FC";
const TINT_LINE = "#DCE1F7";

const AUTOPLAY_DELAY = 4500;

const MemoizedPropertyCard = memo(PropertyCard);

interface ResidenciesProps {
  featuredProperties: any[];
}

const navButtonClass =
  "absolute top-1/2 z-30 hidden -translate-y-1/2 md:flex size-11 items-center justify-center rounded-full bg-white text-slate-600 shadow-sm transition-all duration-200 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2";

/** Native horizontal scroller (same pattern as the rest of the home page) —
 *  swiping left/right and the arrow buttons both scroll smoothly. */
const scrollContainerClass =
  "flex gap-3 overflow-x-auto snap-x snap-mandatory py-1 select-none cursor-grab active:cursor-grabbing [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden";

const Residencies: React.FC<ResidenciesProps> = ({ featuredProperties }) => {
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

  const count = featuredProperties.length;
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
      Math.min(Math.max(0, Math.round(el.scrollLeft / stepRef.current)), pages - 1),
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
            onClick={() => scrollToPage(Math.max(0, activePage - 1))}
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
            onClick={() => scrollToPage(Math.min(activePage + 1, pages - 1))}
          >
            <FaArrowRight className="text-sm sm:text-base" />
          </button>

          <div
            ref={scrollRef}
            onScroll={handleScroll}
            onPointerEnter={() => setPaused(true)}
            onPointerLeave={() => setPaused(false)}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            onClickCapture={handleClickCapture}
            className={scrollContainerClass}
          >
            {featuredProperties.map((card: any, index: number) => (
              <div
                key={card._id || index}
                data-slide
                className="shrink-0 snap-start w-[min(calc(100%-2rem),26rem)] sm:w-[calc(50%-0.375rem)] sm:max-w-[28rem] xl:max-w-none xl:w-[calc(25%-0.5625rem)]"
              >
                <div className="mx-auto flex h-[396px] w-full max-w-full min-h-0 flex-col transition-transform duration-300 hover:-translate-y-1 sm:h-[420px]">
                  <MemoizedPropertyCard card={card} variant="carousel" />
                </div>
              </div>
            ))}
          </div>

          {pages > 1 && (
            <div className="mt-2 flex items-center justify-center gap-1.5">
              {Array.from({ length: pages }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Go to page ${i + 1}`}
                  onClick={() => scrollToPage(i)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === activePage ? "w-5" : "w-1.5"
                  }`}
                  style={{
                    background: i === activePage ? BRAND : "#CBD5E1",
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Residencies;

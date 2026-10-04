"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { FiChevronLeft, FiChevronRight, FiExternalLink, FiMaximize2, FiX } from "react-icons/fi";

type MediaGalleryProps = {
  sources: string[] | undefined | null;
  alt?: string;
  virtualTourUrl?: string | null;
  floorPlans?: string[] | undefined | null;
  priority?: boolean;
};

function isVideo(src: string): boolean {
  const lower = src.toLowerCase();
  return (
    lower.endsWith(".mp4") || lower.endsWith(".webm") || lower.endsWith(".ogg")
  );
}

/** Focusable elements inside the lightbox, in DOM order, for the Tab trap. */
const FOCUSABLE =
  'button:not([disabled]), a[href], input, [tabindex]:not([tabindex="-1"])';

/** Shared classes for the round controls that sit over imagery. */
const overlayButton =
  "grid h-10 w-10 place-items-center rounded-full bg-white/95 text-slate-900 ring-1 ring-slate-900/10 transition hover:bg-white active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4161df]";

/** Play badge shown over any video item. */
function PlayBadge() {
  return (
    <span
      className="pointer-events-none absolute inset-0 grid place-items-center"
      aria-hidden
    >
      <span className="grid h-11 w-11 place-items-center rounded-full bg-slate-900/60 text-white ring-1 ring-white/30">
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
          <path d="M8 5.14v13.72a1 1 0 0 0 1.52.85l10.79-6.86a1 1 0 0 0 0-1.7L9.52 4.29A1 1 0 0 0 8 5.14Z" />
        </svg>
      </span>
    </span>
  );
}

export default function MediaGallery({
  sources,
  alt = "property media",
  virtualTourUrl,
  floorPlans,
  priority = false,
}: MediaGalleryProps) {
  const media = useMemo(
    () => (Array.isArray(sources) ? sources.filter(Boolean) : []),
    [sources],
  );
  const plans = useMemo(
    () => (Array.isArray(floorPlans) ? floorPlans.filter(Boolean) : []),
    [floorPlans],
  );
  const [current, setCurrent] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);

  const total = media.length;
  const active = media[current];

  const goPrev = () =>
    setCurrent((i) => (i === 0 ? Math.max(total - 1, 0) : i - 1));
  const goNext = () => setCurrent((i) => (i >= total - 1 ? 0 : i + 1));

  const goToSlide = (index: number) => {
    const clamped = Math.min(Math.max(index, 0), Math.max(total - 1, 0));
    setCurrent(clamped);
    const el = scrollerRef.current;
    if (el) el.scrollTo({ left: clamped * el.clientWidth, behavior: "smooth" });
  };

  const openLightboxAt = (index: number) => {
    setCurrent(index);
    setLightboxOpen(true);
  };

  /* ── Lightbox: Esc closes, arrows move, Tab stays trapped ─────────── */
  useEffect(() => {
    if (!lightboxOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setLightboxOpen(false);
        return;
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goPrev();
        return;
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        goNext();
        return;
      }
      if (e.key !== "Tab") return;

      // Small, explicit trap: the dialog only holds the nav and close
      // buttons, so bouncing between the first and last keeps focus inside.
      const root = closeRef.current?.closest("[data-lightbox]") as
        | HTMLElement
        | null;
      const nodes = root
        ? Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE))
        : [];
      if (!nodes.length) return;

      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      const activeEl = document.activeElement;

      if (e.shiftKey && (activeEl === first || !root?.contains(activeEl))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && activeEl === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    closeRef.current?.focus();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [lightboxOpen, total]);

  /* ── Mobile carousel: the counter follows the scroll position ─────── */
  const onCarouselScroll = () => {
    const el = scrollerRef.current;
    if (!el) return;
    const index = Math.round(el.scrollLeft / Math.max(el.clientWidth, 1));
    setCurrent(Math.min(Math.max(index, 0), Math.max(total - 1, 0)));
  };

  const hasTour = !!virtualTourUrl?.trim();
  if (!total && !hasTour && !plans.length) return null;

  return (
    <div className="flex flex-col gap-3">
      {/* ── Desktop: one large + four thumbnails ───────────────────── */}
      <div className="hidden lg:grid lg:grid-cols-4 lg:gap-2">
        <button
          type="button"
          onClick={() => openLightboxAt(0)}
          aria-label={
            total > 1
              ? `Open photo 1 of ${total} full screen`
              : "Open photo full screen"
          }
          className="group relative col-span-2 row-span-2 aspect-[4/3] overflow-hidden rounded-2xl bg-slate-100 ring-1 ring-slate-900/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4161df]"
        >
          {active && isVideo(active) ? (
            <>
              <video
                className="h-full w-full object-cover"
                preload="metadata"
                muted
                playsInline
              >
                <source src={active} />
              </video>
              <PlayBadge />
            </>
          ) : active ? (
            <Image
              src={active}
              alt={alt}
              fill
              priority={priority}
              sizes="(max-width: 1024px) 100vw, 640px"
              className="object-cover"
            />
          ) : null}
        </button>

        {media.slice(1, 5).map((src, i) => {
          const index = i + 1;
          return (
            <button
              key={src + index}
              type="button"
              onClick={() => openLightboxAt(index)}
              aria-label={`Open photo ${index + 1} of ${total} full screen`}
              className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-slate-100 ring-1 ring-slate-900/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4161df]"
            >
              {isVideo(src) ? (
                <>
                  <video
                    className="h-full w-full object-cover"
                    preload="none"
                  >
                    <source src={src} />
                  </video>
                  <PlayBadge />
                </>
              ) : (
                <Image
                  src={src}
                  alt={`${alt} — photo ${index + 1}`}
                  fill
                  sizes="320px"
                  className="object-cover"
                />
              )}
            </button>
          );
        })}

        {total > 5 && (
          <button
            type="button"
            onClick={() => openLightboxAt(0)}
            className="mt-3 inline-flex h-10 items-center gap-2 rounded-xl bg-white px-4 text-sm font-semibold text-slate-800 ring-1 ring-slate-900/10 transition hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4161df]"
          >
            <FiMaximize2 size={16} aria-hidden />
            View all {total} photos
          </button>
        )}
      </div>

      {/* ── Mobile: scroll-snap carousel with an n / total counter ──── */}
      <div className="lg:hidden">
        <div
          ref={scrollerRef}
          onScroll={onCarouselScroll}
          data-lenis-prevent
          className="-mx-4 flex snap-x snap-mandatory gap-2 overflow-x-auto px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {media.map((src, i) => (
            <button
              key={src + i}
              type="button"
              onClick={() => openLightboxAt(i)}
              aria-label={`Open photo ${i + 1} of ${total} full screen`}
              className="relative aspect-[4/3] w-[86%] shrink-0 snap-center overflow-hidden rounded-2xl bg-slate-100 ring-1 ring-slate-900/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4161df]"
            >
              {isVideo(src) ? (
                <>
                  <video
                    className="h-full w-full object-cover"
                    preload="none"
                  >
                    <source src={src} />
                  </video>
                  <PlayBadge />
                </>
              ) : (
                <Image
                  src={src}
                  alt={`${alt} — photo ${i + 1}`}
                  fill
                  priority={priority && i === 0}
                  sizes="86vw"
                  className="object-cover"
                />
              )}
            </button>
          ))}
        </div>

        {total > 1 && (
          <div className="mt-2 flex items-center justify-between gap-3">
            <p className="price text-sm text-slate-700">
              {current + 1}
              <span className="text-slate-500"> / {total}</span>
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => goToSlide(current - 1)}
                disabled={current === 0}
                aria-label="Previous photo"
                className={`${overlayButton} disabled:opacity-40`}
              >
                <FiChevronLeft size={18} aria-hidden />
              </button>
              <button
                type="button"
                onClick={() => goToSlide(current + 1)}
                disabled={current >= total - 1}
                aria-label="Next photo"
                className={`${overlayButton} disabled:opacity-40`}
              >
                <FiChevronRight size={18} aria-hidden />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Virtual tour / floor plans — only when the data exists ─── */}
      {(hasTour || plans.length > 0) && (
        <div className="flex flex-wrap items-center gap-2 pt-1">
          {hasTour && (
            <a
              href={virtualTourUrl!.trim()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-white px-4 text-sm font-semibold text-slate-800 ring-1 ring-slate-900/10 transition hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4161df]"
            >
              <FiExternalLink size={16} aria-hidden />
              Virtual tour
            </a>
          )}
          {plans.length > 0 && (
            <a
              href={plans[0]}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-white px-4 text-sm font-semibold text-slate-800 ring-1 ring-slate-900/10 transition hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4161df]"
            >
              <FiMaximize2 size={16} aria-hidden />
              {plans.length > 1 ? `Floor plans (${plans.length})` : "Floor plan"}
            </a>
          )}
        </div>
      )}

      {/* PLACEHOLDER_LIGHTBOX */}

      {plans.length > 1 && (
        <ul className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {plans.slice(1).map((src, idx) => (
            <li key={src + idx} className="shrink-0">
              <a
                href={src}
                target="_blank"
                rel="noopener noreferrer"
                className="block h-24 w-32 overflow-hidden rounded-xl ring-1 ring-slate-900/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4161df]"
              >
                <Image
                  src={src}
                  alt={`${alt} floor plan ${idx + 2}`}
                  width={128}
                  height={96}
                  className="h-full w-full object-cover"
                />
              </a>
            </li>
          ))}
        </ul>
      )}

      {lightboxOpen && total > 0 && (
        <div
          data-lightbox
          role="dialog"
          aria-modal="true"
          aria-label={`${alt} — photo ${current + 1} of ${total}`}
          className="fixed inset-0 z-[60] grid place-items-center bg-slate-900/95 p-4"
          onClick={() => setLightboxOpen(false)}
        >
          <div className="relative aspect-[16/10] w-full max-w-5xl">
            {isVideo(active) ? (
              <video
                key={active}
                controls
                autoPlay
                className="h-full w-full object-contain"
                onClick={(e) => e.stopPropagation()}
              >
                <source src={active} />
              </video>
            ) : (
              <Image
                key={active}
                src={active}
                alt={`${alt} — photo ${current + 1}`}
                fill
                sizes="100vw"
                className="object-contain"
                onClick={(e) => e.stopPropagation()}
              />
            )}

            <button
              ref={closeRef}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setLightboxOpen(false);
              }}
              aria-label="Close full screen view"
              className={`${overlayButton} absolute right-3 top-3`}
            >
              <FiX size={18} aria-hidden />
            </button>

            {total > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    goPrev();
                  }}
                  aria-label="Previous photo"
                  className={`${overlayButton} absolute left-3 top-1/2 -translate-y-1/2`}
                >
                  <FiChevronLeft size={20} aria-hidden />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    goNext();
                  }}
                  aria-label="Next photo"
                  className={`${overlayButton} absolute right-3 top-1/2 -translate-y-1/2`}
                >
                  <FiChevronRight size={20} aria-hidden />
                </button>
                <p className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-slate-900/70 px-3 py-1 text-xs font-medium text-white">
                  {current + 1} / {total}
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

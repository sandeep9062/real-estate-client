"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { ExternalLink, LayoutGrid } from "lucide-react";

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

  useEffect(() => {
    if (current >= media.length) setCurrent(0);
  }, [media.length, current]);

  if (!media.length && !virtualTourUrl?.trim() && !plans.length) {
    return null;
  }

  const goPrev = () =>
    setCurrent((i) => (i === 0 ? Math.max(media.length - 1, 0) : i - 1));
  const goNext = () => setCurrent((i) => (i >= media.length - 1 ? 0 : i + 1));

  const Main = () =>
    media.length > 0 ? (
      <div className="relative w-full aspect-[16/10] bg-gray-100 rounded-xl overflow-hidden">
        {media.length > 1 && (
          <>
            <button
              aria-label="Previous"
              className="absolute left-3 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full w-9 h-9 grid place-items-center shadow"
              onClick={goPrev}
            >
              ‹
            </button>
            <button
              aria-label="Next"
              className="absolute right-3 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full w-9 h-9 grid place-items-center shadow"
              onClick={goNext}
            >
              ›
            </button>
          </>
        )}

        {isVideo(media[current]) ? (
          <video
            key={media[current]}
            controls
            className="w-full h-full object-cover"
            preload="metadata"
            onClick={() => setLightboxOpen(true)}
          >
            <source src={media[current]} />
          </video>
        ) : (
          <Image
            key={media[current]}
            src={media[current]}
            alt={alt}
            fill
            sizes="(max-width: 768px) 100vw, 800px"
            className="object-cover cursor-zoom-in"
            onClick={() => setLightboxOpen(true)}
            priority={priority && current === 0}
          />
        )}
      </div>
    ) : null;

  return (
    <div className="flex flex-col gap-4">
      {virtualTourUrl?.trim() && (
        <a
          href={virtualTourUrl.trim()}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#4161df] text-white font-semibold text-sm py-3 px-4 shadow-md hover:bg-[#3451c9] transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
          Open virtual tour
        </a>
      )}

      <Main />

      {media.length > 1 && (
        <div className="grid grid-cols-5 gap-2">
          {media.map((src, idx) => (
            <button
              key={src + idx}
              onClick={() => setCurrent(idx)}
              className={`relative aspect-[16/10] rounded-lg overflow-hidden border ${
                idx === current
                  ? "border-blue-500 ring-2 ring-blue-200"
                  : "border-transparent"
              }`}
              aria-label={`Show media ${idx + 1}`}
            >
              {isVideo(src) ? (
                <div className="absolute inset-0 bg-black/5">
                  <video className="w-full h-full object-cover">
                    <source src={src} />
                  </video>
                  <div className="absolute inset-0 grid place-items-center">
                    <span className="px-2 py-1 text-xs bg-black/60 text-white rounded">
                      Video
                    </span>
                  </div>
                </div>
              ) : (
                <Image
                  src={src}
                  alt={`thumb-${idx}`}
                  fill
                  className="object-cover"
                />
              )}
            </button>
          ))}
        </div>
      )}

      {plans.length > 0 && (
        <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4 space-y-3">
          <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <LayoutGrid className="w-4 h-4 text-[#4161df]" />
            Floor plans
          </h4>
          <div className="flex gap-3 overflow-x-auto pb-1">
            {plans.map((src, idx) => (
              <a
                key={src + idx}
                href={src}
                target="_blank"
                rel="noopener noreferrer"
                className="relative w-40 shrink-0 aspect-[3/4] rounded-lg overflow-hidden border border-slate-200 bg-white shadow-sm hover:ring-2 hover:ring-[#4161df]/30 transition-all"
              >
                <Image
                  src={src}
                  alt={`${alt} floor plan ${idx + 1}`}
                  fill
                  className="object-cover"
                  sizes="160px"
                />
              </a>
            ))}
          </div>
        </div>
      )}

      {lightboxOpen && media.length > 0 && (
        <div
          className="fixed inset-0 bg-black/80 z-[60] grid place-items-center p-4"
          onClick={() => setLightboxOpen(false)}
        >
          <div className="relative w-full max-w-5xl aspect-[16/9]">
            {isVideo(media[current]) ? (
              <video
                key={media[current]}
                controls
                autoPlay
                className="w-full h-full object-contain"
              >
                <source src={media[current]} />
              </video>
            ) : (
              <Image
                key={media[current]}
                src={media[current]}
                alt={alt}
                fill
                sizes="100vw"
                className="object-contain"
              />
            )}
            <button
              className="absolute top-3 right-3 bg-white/90 hover:bg-white rounded-full w-9 h-9 grid place-items-center shadow"
              onClick={(e) => {
                e.stopPropagation();
                setLightboxOpen(false);
              }}
              aria-label="Close"
            >
              ✕
            </button>
            {media.length > 1 && (
              <>
                <button
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full w-10 h-10 grid place-items-center"
                  onClick={(e) => {
                    e.stopPropagation();
                    goPrev();
                  }}
                  aria-label="Previous"
                >
                  ‹
                </button>
                <button
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full w-10 h-10 grid place-items-center"
                  onClick={(e) => {
                    e.stopPropagation();
                    goNext();
                  }}
                  aria-label="Next"
                >
                  ›
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

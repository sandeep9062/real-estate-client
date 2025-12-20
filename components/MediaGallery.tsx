"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";

type MediaGalleryProps = {
  sources: string[] | undefined | null;
  alt?: string;
};

function isVideo(src: string): boolean {
  const lower = src.toLowerCase();
  return lower.endsWith(".mp4") || lower.endsWith(".webm") || lower.endsWith(".ogg");
}

export default function MediaGallery({ sources, alt = "property media" }: MediaGalleryProps) {
  const media = useMemo(() => (Array.isArray(sources) ? sources.filter(Boolean) : []), [sources]);
  const [current, setCurrent] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
    if (current >= media.length) setCurrent(0);
  }, [media.length, current]);

  if (!media.length) return null;

  const goPrev = () => setCurrent((i) => (i === 0 ? media.length - 1 : i - 1));
  const goNext = () => setCurrent((i) => (i === media.length - 1 ? 0 : i + 1));

  const Main = () => (
    <div className="relative w-full aspect-[16/10] bg-gray-100 rounded-xl overflow-hidden">
      {/* Prev/Next controls */}
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

      {/* Media */}
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
        />
      )}
    </div>
  );

  return (
    <div className="flex flex-col gap-3">
      <Main />

      {/* Thumbnails */}
      {media.length > 1 && (
        <div className="grid grid-cols-5 gap-2">
          {media.map((src, idx) => (
            <button
              key={src + idx}
              onClick={() => setCurrent(idx)}
              className={`relative aspect-[16/10] rounded-lg overflow-hidden border ${
                idx === current ? "border-blue-500 ring-2 ring-blue-200" : "border-transparent"
              }`}
              aria-label={`Show media ${idx + 1}`}
            >
              {isVideo(src) ? (
                <div className="absolute inset-0 bg-black/5">
                  <video className="w-full h-full object-cover">
                    <source src={src} />
                  </video>
                  <div className="absolute inset-0 grid place-items-center">
                    <span className="px-2 py-1 text-xs bg-black/60 text-white rounded">Video</span>
                  </div>
                </div>
              ) : (
                <Image src={src} alt={`thumb-${idx}`} fill className="object-cover" />
              )}
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 bg-black/80 z-[60] grid place-items-center p-4"
          onClick={() => setLightboxOpen(false)}
        >
          <div className="relative w-full max-w-5xl aspect-[16/9]">
            {isVideo(media[current]) ? (
              <video key={media[current]} controls autoPlay className="w-full h-full object-contain">
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
          </div>
        </div>
      )}
    </div>
  );
}

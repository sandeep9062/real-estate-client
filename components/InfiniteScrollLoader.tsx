"use client";

import { useEffect, useRef } from "react";
import { Loader2 } from "lucide-react";

interface InfiniteScrollLoaderProps {
  onIntersect: () => void;
  loading: boolean;
  hasMore: boolean;
}

/**
 * Renders a thin sentinel <div> at the bottom of a list.
 * When it becomes visible (via Intersection Observer) it fires `onIntersect`
 * to load the next page.
 *
 * Improvements for reliability:
 * - Huge rootMargin (1500px) so the next page starts loading very early
 *   and the user never sees an empty bottom area.
 * - A safety-net `scroll` listener on the window that triggers load
 *   when the user is within 200px of the document bottom — guarantees
 *   the observer fires even if the sentinel is hidden behind the
 *   map column, off-screen on mobile, or in a flex/grid layout.
 */
export default function InfiniteScrollLoader({
  onIntersect,
  loading,
  hasMore,
}: InfiniteScrollLoaderProps) {
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && hasMore && !loading) {
          onIntersect();
        }
      },
      {
        // Start loading 1500px before the sentinel enters the viewport.
        // Larger value = more eager loading, fewer "stuck" moments.
        rootMargin: "1500px 0px 1500px 0px",
        threshold: 0,
      },
    );

    observer.observe(sentinel);

    // Safety net: a window-scroll listener that triggers loadMore when
    // the user is within 200px of the document bottom. This guarantees
    // that the next page always loads, even when the sentinel is in a
    // layout that doesn't intersect reliably (e.g. inside a sticky map
    // container, or in a virtualized parent that resizes dynamically).
    const handleScroll = () => {
      if (!hasMore || loading) return;
      const scrolled = window.scrollY + window.innerHeight;
      const total = document.documentElement.scrollHeight;
      if (total - scrolled < 200) {
        onIntersect();
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });

    // Run once on mount in case the page is already short enough
    // that the sentinel is visible.
    handleScroll();

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [onIntersect, loading, hasMore]);

  if (!hasMore) return null;

  return (
    <div
      ref={sentinelRef}
      className="w-full flex justify-center py-6 animate-in"
    >
      {loading && (
        <div className="flex items-center gap-3 text-gray-500">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span className="text-sm font-medium">
            Loading more properties...
          </span>
        </div>
      )}
    </div>
  );
}

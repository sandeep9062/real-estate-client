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
 * Improvements for smoothness:
 * - Large rootMargin (800px) so the next page starts loading well before
 *   the user reaches the bottom — no visible delay.
 * - A subtle "pulse" skeleton instead of a sudden spinner, making the
 *   loading state feel smoother.
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
        // Start loading 800px before the sentinel enters the viewport
        // plus 800px offset in the other direction so it doesn't "un-trigger"
        rootMargin: "800px 0px 800px 0px",
        threshold: 0,
      },
    );

    observer.observe(sentinel);

    return () => {
      observer.disconnect();
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

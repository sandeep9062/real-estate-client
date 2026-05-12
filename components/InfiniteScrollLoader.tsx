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
 */
export default function InfiniteScrollLoader({
  onIntersect,
  loading,
  hasMore,
}: InfiniteScrollLoaderProps) {
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasMore || loading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && hasMore && !loading) {
          onIntersect();
        }
      },
      { rootMargin: "200px 0px" },
    );

    observer.observe(sentinel);

    return () => {
      observer.disconnect();
    };
  }, [onIntersect, loading, hasMore]);

  if (!hasMore) return null;

  return (
    <div ref={sentinelRef} className="w-full flex justify-center py-8">
      {loading && (
        <div className="flex items-center gap-2 text-gray-500">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span className="text-sm font-medium">
            Loading more properties...
          </span>
        </div>
      )}
    </div>
  );
}

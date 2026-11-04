"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useLazyGetAllPropertiesQuery } from "@/services/propertiesApi";

interface UseInfinitePropertiesResult {
  properties: any[];
  hasMore: boolean;
  total: number;
  initialLoading: boolean;
  loadingMore: boolean;
  error: string | null;
  loadMore: () => void;
}

/**
 * Custom hook for infinite-scroll paginated property fetching.
 *
 * - Resets to page 1 when `filters` change.
 * - Appends new pages to the accumulated list.
 * - Tracks `hasMore` from backend pagination metadata.
 * - Prefetches the next page immediately after the current page loads,
 *   so scrolling feels instant.
 */
export function useInfiniteProperties(
  filters: Record<string, string>,
  limit = 100,
): UseInfinitePropertiesResult {
  const [page, setPage] = useState(1);
  const [allProperties, setAllProperties] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const [total, setTotal] = useState(0);
  const [initialLoading, setInitialLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Serialise filters so we can detect changes
  const filterKey = JSON.stringify(filters);
  const filterKeyRef = useRef(filterKey);
  // Track which pages have been prefetched to avoid duplicate requests
  const prefetchedUpToRef = useRef<number>(0);

  // Reset everything when filters change
  useEffect(() => {
    if (filterKeyRef.current !== filterKey) {
      filterKeyRef.current = filterKey;
      setPage(1);
      setAllProperties([]);
      setHasMore(false);
      setTotal(0);
      setInitialLoading(true);
      setLoadingMore(false);
      setError(null);
      prefetchedUpToRef.current = 0;
    }
  }, [filterKey]);

  const [trigger] = useLazyGetAllPropertiesQuery();

  useEffect(() => {
    let cancelled = false;

    const fetchPage = async () => {
      try {
        if (page === 1) {
          setInitialLoading(true);
        } else {
          setLoadingMore(true);
        }
        setError(null);

        const params: Record<string, string> = {
          ...filters,
          page: String(page),
          limit: String(limit),
        };

        const result = await trigger(params).unwrap();

        if (cancelled) return;

        const dataArray = result?.data ?? result ?? [];
        const pagination = result?.pagination;

        if (page === 1) {
          setAllProperties(dataArray);
        } else {
          setAllProperties((prev) => {
            const existingIds = new Set(prev.map((p: any) => p.id || p._id));
            const newUnique = dataArray.filter(
              (item: any) => !existingIds.has(item.id || item._id),
            );
            return [...prev, ...newUnique];
          });
        }

        if (pagination) {
          const nextHasMore = Boolean(pagination.hasNextPage);
          setHasMore(nextHasMore);
          setTotal(pagination.total ?? result?.total ?? 0);

          // ─── Prefetch the next page immediately after current page loads ───
          if (nextHasMore && !cancelled) {
            const nextPage = page + 1;
            // Only prefetch if we haven't already done so
            if (prefetchedUpToRef.current < nextPage) {
              prefetchedUpToRef.current = nextPage;
              // Fire-and-forget prefetch — loads silently into RTK cache
              trigger(
                {
                  ...filters,
                  page: String(nextPage),
                  limit: String(limit),
                },
                true, // preferCacheValue — use cached if already fetched
              );
            }
          }
        } else {
          setHasMore(false);
          setTotal(dataArray.length);
        }
      } catch (err: any) {
        if (!cancelled) {
          setError(
            err?.data?.message || err?.message || "Failed to fetch properties",
          );
        }
      } finally {
        if (!cancelled) {
          setInitialLoading(false);
          setLoadingMore(false);
        }
      }
    };

    fetchPage();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, filterKey, trigger]);

  const loadMore = useCallback(() => {
    if (!loadingMore && !initialLoading && hasMore) {
      setPage((p) => p + 1);
    }
  }, [loadingMore, initialLoading, hasMore]);

  return {
    properties: allProperties,
    hasMore,
    total,
    initialLoading,
    loadingMore,
    error,
    loadMore,
  };
}

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

export interface UseInfinitePropertiesOptions {
  limit?: number;
  initialData?: any[];
  initialTotal?: number;
}

/**
 * Custom hook for infinite-scroll paginated property fetching.
 *
 * - Resets to page 1 when `filters` change.
 * - Appends new pages to the accumulated list.
 * - Tracks `hasMore` from backend pagination metadata.
 */
export function useInfiniteProperties(
  filters: Record<string, string>,
  options: UseInfinitePropertiesOptions | number = 10,
): UseInfinitePropertiesResult {
  const limit = typeof options === "number" ? options : (options.limit ?? 10);
  const initialData =
    typeof options === "object" ? options.initialData : undefined;
  const initialTotal =
    typeof options === "object" ? options.initialTotal : undefined;

  const [page, setPage] = useState(1);
  const [allProperties, setAllProperties] = useState<any[]>(initialData ?? []);
  const [hasMore, setHasMore] = useState(
    initialData && initialTotal ? initialData.length < initialTotal : false,
  );
  const [total, setTotal] = useState(initialTotal ?? 0);
  const [initialLoading, setInitialLoading] = useState(!initialData);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Serialise filters so we can detect changes
  const filterKey = JSON.stringify(filters);
  const filterKeyRef = useRef(filterKey);
  const isFirstRender = useRef(true);

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
    }
  }, [filterKey]);

  const [trigger] = useLazyGetAllPropertiesQuery();

  useEffect(() => {
    if (isFirstRender.current && initialData) {
      isFirstRender.current = false;
      return;
    }
    isFirstRender.current = false;

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

        // The backend now returns { success, count, total, pagination, data }
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
          setHasMore(Boolean(pagination.hasNextPage));
          setTotal(pagination.total ?? result?.total ?? 0);
        } else {
          // Fallback if backend hasn't been updated yet
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

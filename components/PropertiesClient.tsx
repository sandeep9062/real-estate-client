"use client";

import React, {
  Suspense,
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { useSearchParams, useRouter } from "next/navigation";
import TopSearchBar from "@/components/TopSearchBar";
import PropertiesMapExplorer from "@/components/PropertiesMapExplorer";
import PropertyGrid from "@/components/PropertyGrid";
import PropertyGridSkeleton from "@/components/PropertyGridSkeleton";
import InfiniteScrollLoader from "@/components/InfiniteScrollLoader";
import { useLazyGetAllPropertiesQuery } from "@/services/propertiesApi";
import { Map, List as ListIcon, Loader2 } from "lucide-react";

interface PropertiesClientProps {
  /** Pre-fetched properties from SSG / ISR build-time fetch */
  initialProperties: any[];
  initialTotal: number;
  initialHasMore: boolean;
}

/**
 * Client-side wrapper for the /properties page.
 *
 * PAGINATION STRATEGY (simple, robust):
 * ─────────────────────────────────────────────────────────────────────
 * 1. The SSG provides the FIRST page (limit=20) as `initialProperties`.
 * 2. We seed `properties` state with those items, deduped by `id/_id`.
 * 3. A simple, sequential useEffect watches `page` and fetches one
 *    page at a time, APPENDING new unique items to `properties`.
 * 4. No cancellation flags, no ref-based dedup races, no SSG→client
 *    transition shenanigans — just clean, linear pagination.
 * 5. `loadMore` is a no-op while loading, increments `page` otherwise.
 * 6. IntersectionObserver + a manual "Load more" button + a window
 *    scroll safety-net all funnel into the same `loadMore` callback,
 *    so the user is never stuck.
 * ─────────────────────────────────────────────────────────────────────
 */
// ─── Inactive guard ─────────────────────────────────────────────
// Properties with isActive === false must never render a card on
// /properties (list or map). The backend already filters them out
// for non-admin users, but this client-side guard also protects
// against stale ISR/SSG cache and edge cases. Missing `isActive`
// (older documents) is treated as visible.
const isPubliclyVisible = (p: any) => p?.isActive !== false;

function PropertiesClientInner({
  initialProperties,
  initialTotal,
  initialHasMore,
}: PropertiesClientProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"list" | "map">("list");
  const [laptopMapOpen, setLaptopMapOpen] = useState(false);

  // ─── Data state ────────────────────────────────────────────────
  // Seeded with the SSG data so the first paint shows real content.
  const [properties, setProperties] = useState<any[]>(
    initialProperties.filter(isPubliclyVisible),
  );
  const [total, setTotal] = useState<number>(initialTotal);
  // hasMore = false when SSG already gave us everything (default view).
  const [hasMore, setHasMore] = useState<boolean>(initialHasMore);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // The next page to fetch. With the new SSG strategy, ALL properties are
  const [page, setPage] = useState<number>(2);
  // Flag to ignore the very first useEffect run after a filter change,
  // because we want the user to see the new SSG data, not a flash of
  // empty client state.
  const filterKeyRef = useRef<string>("");
  // Used by the scroll safety-net inside InfiniteScrollLoader.

  // ─── URL ↔ query helpers ───────────────────────────────────────
  const query = useMemo(() => {
    const params: { [key: string]: string } = {};
    searchParams.forEach((value, key) => {
      params[key] = value;
    });
    return params;
  }, [searchParams]);

  const handleApplyFilters = (filters: any) => {
    const params = new URLSearchParams();
    for (const key in filters) {
      if (filters[key] != null && filters[key] !== "") {
        params.set(key, filters[key]);
      }
    }
    router.push(`/properties?${params.toString()}`);
  };

  const mergeToUrl = useCallback(
    (extra: Record<string, string | undefined | null>) => {
      const merged: Record<string, string> = {
        ...Object.fromEntries(searchParams.entries()),
      };
      Object.entries(extra).forEach(([k, v]) => {
        if (v === undefined || v === null || v === "") {
          delete merged[k];
        } else {
          merged[k] = String(v);
        }
      });
      const params = new URLSearchParams();
      Object.entries(merged).forEach(([k, v]) => {
        if (v === "") return;
        params.set(k, v);
      });
      router.push(`/properties?${params.toString()}`);
    },
    [router, searchParams],
  );

  // ─── Fetch a single page and replace/append unique items ──────
  const [trigger] = useLazyGetAllPropertiesQuery();
  const isMountedRef = useRef(true);
  // Monotonically increasing request id. Any response that comes back with an
  // id different from the latest one is stale (triggered under an old filter
  // or an old page) and is discarded — this kills the "filter changed but old
  // unfiltered results still get appended" race.
  const requestSeqRef = useRef(0);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const fetchPage = useCallback(
    async (pageToFetch: number, currentQuery: Record<string, string>) => {
      const seq = ++requestSeqRef.current;
      if (!isMountedRef.current) return;
      setLoading(true);
      setError(null);

      try {
        const result = await trigger({
          ...currentQuery,
          page: String(pageToFetch),
          limit: "100",
        }).unwrap();

        // Discard stale responses (old filter / old page resolved late).
        if (!isMountedRef.current || seq !== requestSeqRef.current) return;

        const dataArray: any[] = result?.data ?? result ?? [];
        const pagination = result?.pagination;

        // Page 1 replaces the list (after a filter change); later pages append,
        // deduplicating by id/_id. Inactive properties are dropped entirely so
        // they never render a card.
        setProperties((prev) => {
          if (pageToFetch === 1) return dataArray.filter(isPubliclyVisible);
          const seen = new Set(prev.map((p) => p._id || p.id));
          const fresh = dataArray.filter(
            (item) =>
              isPubliclyVisible(item) && !seen.has(item._id || item.id),
          );
          if (fresh.length === 0) return prev;
          return [...prev, ...fresh];
        });

        if (pagination) {
          setTotal(pagination.total ?? result?.total ?? dataArray.length);
          setHasMore(Boolean(pagination.hasNextPage));
        } else {
          // No pagination object → assume this page is the last.
          setHasMore(false);
          setTotal((t) =>
            pageToFetch === 1
              ? dataArray.length
              : Math.max(t, dataArray.length),
          );
        }
      } catch (err: any) {
        if (!isMountedRef.current || seq !== requestSeqRef.current) return;
        setError(
          err?.data?.message || err?.message || "Failed to fetch properties",
        );
      } finally {
        if (isMountedRef.current && seq === requestSeqRef.current) {
          setLoading(false);
        }
      }
    },
    [trigger],
  );

  // ─── Watch filters: reset state, refetch from page 1 ───────────
  const filterKey = useMemo(() => JSON.stringify(query), [query]);
  // True right after a filter change, so the pagination effect ignores the
  // stale `page` value captured in the same render commit (otherwise it would
  // re-request the old page number against the NEW filters — the bug that
  // produced out-of-order / duplicated filtered results).
  const pendingResetRef = useRef(false);

  useEffect(() => {
    if (filterKeyRef.current === "") {
      // First mount. The SSG seed was generated with NO URL filters, so if the
      // page was opened directly on a filtered URL (journal/sector link, map
      // "search this area", or a refreshed filtered view) we must replace the
      // unfiltered seed with the correctly filtered first page right away.
      filterKeyRef.current = filterKey;
      if (Object.keys(query).length > 0) {
        pendingResetRef.current = true;
        requestSeqRef.current += 1;
        setProperties([]);
        setTotal(0);
        setHasMore(true);
        setError(null);
        setPage(1);
        fetchPage(1, query);
      }
      return;
    }

    if (filterKeyRef.current === filterKey) return;

    // Filter changed — invalidate in-flight requests, reset, and fetch page 1.
    filterKeyRef.current = filterKey;
    pendingResetRef.current = true;
    requestSeqRef.current += 1;
    setProperties([]);
    setTotal(0);
    setHasMore(true);
    setError(null);
    setPage(1);
    fetchPage(1, query);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterKey]);

  // ─── Core pagination effect: when `page` changes, fetch it ─────
  useEffect(() => {
    if (pendingResetRef.current) {
      // `page` in this commit is stale (pre-reset). Page 1 was already fetched
      // by the filter-change effect above, so just clear the flag.
      pendingResetRef.current = false;
      return;
    }
    if (page <= 1) return;
    fetchPage(page, query);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, filterKey]);

  // ─── loadMore: trigger next page ───────────────────────────────
  const loadMore = useCallback(() => {
    if (loading) return;
    if (!hasMore) return;
    setPage((p) => p + 1);
  }, [loading, hasMore]);

  // ─── Scroll into view when a property is selected from the map ─
  useEffect(() => {
    if (!selectedId) return;
    const el = document.querySelector(`[data-property-id="${selectedId}"]`);
    el?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [selectedId, properties]);

  if (error) {
    return (
      <div className="w-full pt-20 bg-gray-50 min-h-screen flex justify-center items-center py-20">
        <span className="text-red-500 font-medium">
          Error while fetching data: {error}
        </span>
      </div>
    );
  }

  return (
    <div className="w-full pt-20 bg-gray-50 min-h-screen relative">
      {/* Mobile: list / map toggle */}
      <div className="lg:hidden fixed right-4 top-1/2 -translate-y-1/2 z-1000">
        <button
          type="button"
          onClick={() => setActiveTab(activeTab === "list" ? "map" : "list")}
          className="flex flex-col items-center gap-1 bg-[#4161df] text-white px-2 py-3 rounded-2xl shadow-2xl hover:bg-[#4161df]/10 transition-all transform active:scale-95"
          aria-label={activeTab === "list" ? "Open map view" : "Open list view"}
        >
          {activeTab === "list" ? (
            <>
              <Map className="w-4 h-4" />
              <span className="text-[10px] font-semibold leading-tight text-center max-w-16">
                Map
              </span>
            </>
          ) : (
            <>
              <ListIcon className="w-4 h-4" />
              <span className="text-[10px] font-semibold leading-tight text-center max-w-16">
                List
              </span>
            </>
          )}
        </button>
      </div>

      {/* Laptop: show / hide map column */}
      <div className="hidden lg:flex fixed right-4 top-1/2 -translate-y-1/2 z-1000">
        <button
          type="button"
          onClick={() => setLaptopMapOpen((o) => !o)}
          className="flex flex-col items-center gap-1 bg-[#4161df] text-white px-3 py-4 rounded-2xl shadow-2xl hover:bg-[#4161df]/10 transition-all transform active:scale-95"
          aria-label={
            laptopMapOpen
              ? "Hide map, expand listings"
              : "Show map beside listings"
          }
        >
          {laptopMapOpen ? (
            <>
              <ListIcon className="w-5 h-5" />
              <span className="text-[10px] font-semibold leading-tight text-center max-w-16">
                Hide
              </span>
            </>
          ) : (
            <>
              <Map className="w-5 h-5" />
              <span className="text-[10px] font-semibold leading-tight text-center max-w-16">
                Map
              </span>
            </>
          )}
        </button>
      </div>

      <div className="flex flex-col items-center gap-4 sm:gap-6 md:gap-8 max-w-full mx-auto px-4 sm:px-6 md:px-10 py-6 sm:py-8 md:py-12">
        <div className="w-full text-center">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2 sm:mb-3 md:mb-4">
            Find Your Perfect Property in Tricity
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 px-2">
            Discover homes, apartments, and commercial spaces for sale and rent
            in Chandigarh, Panchkula, Mohali & more.
          </p>
        </div>
        <div className="w-full">
          <TopSearchBar onApply={handleApplyFilters} initialFilters={query} />
        </div>

        <div
          className={`w-full grid grid-cols-1 gap-6 items-start ${laptopMapOpen ? "lg:grid-cols-2" : "lg:grid-cols-1"}`}
        >
          {/* List Section */}
          <div
            className={`${activeTab === "list" ? "block" : "hidden"} lg:block order-2 lg:order-1 space-y-3 min-w-0`}
          >
            {properties.length === 0 && loading ? (
              <div className="w-full">
                <div className="flex items-baseline justify-between mb-3 sm:mb-4 gap-1 sm:gap-0">
                  <h2 className="text-base sm:text-lg md:text-xl font-semibold">
                    Loading properties...
                  </h2>
                </div>
                <PropertyGridSkeleton
                  count={6}
                  columns={laptopMapOpen ? "two" : "four"}
                  variant="carousel"
                />
              </div>
            ) : (
              <>
                <div className="flex items-baseline justify-between gap-2">
                  <p className="text-sm font-medium text-gray-700">
                    {properties.length} listing
                    {properties.length !== 1 ? "s" : ""}
                  </p>
                  <span className="text-xs sm:text-sm text-gray-500">
                    {total > 0
                      ? `${total} ${total === 1 ? "result" : "results"} found`
                      : `${properties.length} loaded`}
                  </span>
                </div>
                <PropertyGrid
                  properties={properties}
                  selectedId={selectedId}
                  columns={laptopMapOpen ? "two" : "four"}
                />
                <InfiniteScrollLoader
                  onIntersect={loadMore}
                  loading={loading}
                  hasMore={hasMore}
                />
                {/* Manual "Load more" button — always visible when there is
                    more data. This is the bulletproof fallback for the rare
                    case where the IntersectionObserver or scroll safety-net
                    don't fire (mobile quirks, dynamic layouts, etc.). */}
                {hasMore && (
                  <div className="w-full flex flex-col items-center gap-2 py-6">
                    {loading ? (
                      <div className="flex items-center gap-2 text-gray-500 text-sm">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Loading more properties…
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={loadMore}
                        className="px-5 py-2.5 rounded-full bg-[#4161df] text-white text-sm font-semibold hover:bg-[#3550b8] active:scale-95 transition-all shadow-md"
                      >
                        Load more properties
                      </button>
                    )}
                    <span className="text-xs text-gray-400">
                      {Math.max(total - properties.length, 0)} more remaining
                    </span>
                  </div>
                )}
                {!hasMore && properties.length > 0 && (
                  <div className="w-full text-center py-6 text-sm text-gray-400">
                    {total > 0
                      ? `Showing all ${total} properties`
                      : "No more properties to load"}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Map Section */}
          <div
            className={`${activeTab === "map" ? "block" : "hidden"} ${laptopMapOpen ? "lg:block" : "lg:hidden"} order-1 lg:order-2 lg:sticky lg:top-24 z-10 w-full min-w-0 self-start`}
          >
            <PropertiesMapExplorer
              properties={properties}
              selectedId={selectedId}
              onSelectProperty={(id) => {
                setSelectedId(id);
                if (window.innerWidth < 1024) setActiveTab("list");
              }}
              onSearchThisArea={(bbox) =>
                mergeToUrl({ bbox, polygon: undefined })
              }
              onPolygonApply={(polygonJson) =>
                mergeToUrl({ polygon: polygonJson, bbox: undefined })
              }
              heightClass="h-[min(72dvh,calc(100dvh-13rem))] min-h-[280px] lg:min-h-0 lg:h-[min(920px,85vh,calc(100dvh-3rem))]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

const PropertiesClient = (props: PropertiesClientProps) => (
  <Suspense fallback={<div>Loading...</div>}>
    <PropertiesClientInner {...props} />
  </Suspense>
);

export default PropertiesClient;

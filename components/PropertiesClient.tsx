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
import { Map, List as ListIcon } from "lucide-react";

interface PropertiesClientProps {
  /** Pre-fetched properties from SSG / ISR build-time fetch */
  initialProperties: any[];
  initialTotal: number;
  initialHasMore: boolean;
}

/**
 * Client-side wrapper for the /properties page.
 * - Uses SSG data as the initial visible content (indexable by search engines).
 * - When URL search params change, switches to client-side fetching.
 */
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

  // Track whether we're still on the initial (SSG) query
  const initialFilterKey = useRef("");
  const transitionedRef = useRef(false);
  const [isStaticData, setIsStaticData] = useState(true);

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

  const query = useMemo(() => {
    const params: { [key: string]: string } = {};
    searchParams.forEach((value, key) => {
      params[key] = value;
    });
    return params;
  }, [searchParams]);

  // Detect when URL search params change — switch from static to client fetching
  useEffect(() => {
    const currentKey = JSON.stringify(query);
    if (initialFilterKey.current === "") {
      initialFilterKey.current = currentKey;
      setIsStaticData(true);
    } else if (initialFilterKey.current !== currentKey) {
      setIsStaticData(false);
    }
  }, [query]);

  // ─── Client-side data fetching (RTK lazy query) ───────────────────
  const [trigger] = useLazyGetAllPropertiesQuery();
  const [clientProperties, setClientProperties] = useState<any[]>([]);
  const [clientTotal, setClientTotal] = useState(0);
  const [clientHasMore, setClientHasMore] = useState(false);
  const [clientLoading, setClientLoading] = useState(false);
  const [clientError, setClientError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  // Track whether we're loading MORE (page > 1) vs loading fresh (page 1)
  const [isAppending, setIsAppending] = useState(false);

  // Ref for the "key" of the current query to detect filter changes client-side
  const filterKeyRef = useRef(JSON.stringify(query));
  // Ref to prevent double-fetching the same page
  const fetchingPageRef = useRef<number>(0);
  // Ref to track whether we've seeded from static data (page 1 already loaded)
  const seededRef = useRef(false);
  // Ref to track whether the next page is already being prefetched
  const prefetchingRef = useRef<number>(0);

  useEffect(() => {
    if (isStaticData) return;

    const currentKey = JSON.stringify(query);
    if (filterKeyRef.current !== currentKey) {
      // Filters changed — reset everything
      filterKeyRef.current = currentKey;
      setPage(1);
      setClientProperties([]);
      setClientTotal(0);
      setClientHasMore(false);
      setClientError(null);
      seededRef.current = false;
      fetchingPageRef.current = 0;
      prefetchingRef.current = 0;
    }

    // Prevent double-fetching the same page
    if (fetchingPageRef.current === page) return;
    fetchingPageRef.current = page;

    // If page is 1 and we already seeded from static data, skip fetching page 1
    if (page === 1 && seededRef.current) return;

    let cancelled = false;

    const fetchPage = async () => {
      try {
        // Only show loading spinner full-screen on initial page load (page 1)
        // For append (page > 1), keep existing cards visible
        if (page === 1) {
          setClientLoading(true);
          setIsAppending(false);
        } else {
          setIsAppending(true);
        }
        setClientError(null);

        const params: Record<string, string> = {
          ...query,
          page: String(page),
          limit: "10",
        };

        const result = await trigger(params).unwrap();
        if (cancelled) return;

        const dataArray = result?.data ?? result ?? [];
        const pagination = result?.pagination;

        if (page === 1) {
          setClientProperties(dataArray);
          seededRef.current = true;
        } else {
          setClientProperties((prev) => {
            const existingIds = new Set(prev.map((p: any) => p.id || p._id));
            const newUnique = dataArray.filter(
              (item: any) => !existingIds.has(item.id || item._id),
            );
            return [...prev, ...newUnique];
          });
        }

        if (pagination) {
          const nextHasMore = Boolean(pagination.hasNextPage);
          setClientHasMore(nextHasMore);
          setClientTotal(pagination.total ?? result?.total ?? 0);

          // ─── Prefetch the next page immediately after current page loads ───
          if (nextHasMore && !cancelled) {
            const nextPage = page + 1;
            // Only prefetch if we haven't already requested it
            if (prefetchingRef.current < nextPage) {
              prefetchingRef.current = nextPage;
              // Fire-and-forget prefetch — load silently into RTK cache
              trigger(
                {
                  ...query,
                  page: String(nextPage),
                  limit: "10",
                },
                true, // preferCacheValue — use cached if already fetched
              );
            }
          }
        } else {
          setClientHasMore(false);
          setClientTotal(dataArray.length);
        }
      } catch (err: any) {
        if (!cancelled) {
          setClientError(
            err?.data?.message || err?.message || "Failed to fetch properties",
          );
        }
      } finally {
        if (!cancelled) {
          setClientLoading(false);
          setIsAppending(false);
        }
      }
    };

    fetchPage();

    return () => {
      cancelled = true;
    };
    // NOTE: intentionally exclude clientProperties.length to avoid infinite loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, query, trigger, isStaticData]);

  // Determine current data source
  const properties = isStaticData ? initialProperties : clientProperties;
  const total = isStaticData ? initialTotal : clientTotal;
  const hasMore = isStaticData ? initialHasMore : clientHasMore;
  const loading = !isStaticData && clientLoading;
  const error = !isStaticData ? clientError : null;

  /**
   * Transition from static (SSG) data to client-side fetching on first scroll.
   * Seeds client state with the SSG data so the user sees no flicker,
   * then starts fetching page 2+.
   */
  const transitionToClientFetch = useCallback(() => {
    if (transitionedRef.current) return;
    transitionedRef.current = true;

    setClientProperties(initialProperties);
    setClientTotal(initialTotal);
    setClientHasMore(initialHasMore);
    seededRef.current = true;
    setPage(2); // page 1 already loaded via SSG
    setIsStaticData(false);
  }, [initialProperties, initialTotal, initialHasMore]);

  const loadMore = useCallback(() => {
    if (isStaticData) {
      if (initialHasMore) {
        transitionToClientFetch();
      }
      return;
    }
    if (!clientLoading && hasMore) {
      setPage((p) => p + 1);
    }
  }, [
    clientLoading,
    hasMore,
    isStaticData,
    initialHasMore,
    transitionToClientFetch,
  ]);

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
            {loading ? (
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
                    {isStaticData
                      ? `Showing ${properties.length} properties`
                      : `${total} ${total === 1 ? "result" : "results"} found`}
                  </span>
                </div>
                <PropertyGrid
                  properties={properties}
                  selectedId={selectedId}
                  columns={laptopMapOpen ? "two" : "four"}
                />
                <InfiniteScrollLoader
                  onIntersect={loadMore}
                  loading={!isStaticData && clientLoading}
                  hasMore={hasMore}
                />
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

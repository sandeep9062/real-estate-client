"use client";
import React, { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { SearchResultsView } from "@/components/SearchResults";
import TopSearchBar from "@/components/TopSearchBar";
import PropertiesMapExplorer from "@/components/PropertiesMapExplorer";
import { useInfiniteProperties } from "@/hooks/useInfiniteProperties";
import { Map, List as ListIcon } from "lucide-react";

const PropertiesContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [activeTab, setActiveTab] = React.useState<"list" | "map">("list");
  const [laptopMapOpen, setLaptopMapOpen] = React.useState(false);

  const handleApplyFilters = (filters: any) => {
    const params = new URLSearchParams();
    for (const key in filters) {
      if (filters[key] != null && filters[key] !== "") {
        params.set(key, filters[key]);
      }
    }
    router.push(`/properties?${params.toString()}`);
  };

  const mergeToUrl = React.useCallback(
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

  const query = React.useMemo(() => {
    const params: { [key: string]: string } = {};
    searchParams.forEach((value, key) => {
      params[key] = value;
    });
    return params;
  }, [searchParams]);

  const {
    properties,
    hasMore,
    total,
    initialLoading,
    loadingMore,
    error,
    loadMore,
  } = useInfiniteProperties(query);

  React.useEffect(() => {
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
      <div className="lg:hidden fixed right-4 top-1/2 -translate-y-1/2 z-1000">
        <button
          type="button"
          onClick={() => setActiveTab(activeTab === "list" ? "map" : "list")}
          className="flex flex-col items-center gap-1 bg-[#4161df] text-white px-3 py-4 rounded-2xl shadow-2xl hover:bg-[#4161df]/20 transition-all transform active:scale-95"
          aria-label={activeTab === "list" ? "Open map view" : "Open list view"}
        >
          {activeTab === "list" ? (
            <>
              <Map className="w-5 h-5" />
              <span className="text-[10px] font-semibold leading-tight text-center max-w-16">
                Map
              </span>
            </>
          ) : (
            <>
              <ListIcon className="w-5 h-5" />
              <span className="text-[10px] font-semibold leading-tight text-center max-w-16">
                List
              </span>
            </>
          )}
        </button>
      </div>

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
              <ListIcon className="w-5 h-5 " />
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
          <div
            className={`${activeTab === "list" ? "block" : "hidden"} lg:block order-2 lg:order-1 space-y-3 min-w-0`}
          >
            <SearchResultsView
              query={query}
              columns={laptopMapOpen ? "two" : "four"}
              selectedId={selectedId}
              properties={properties}
              hasMore={hasMore}
              total={total}
              initialLoading={initialLoading}
              loadingMore={loadingMore}
              error={error}
              loadMore={loadMore}
            />
          </div>

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
};

const Properties = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <PropertiesContent />
  </Suspense>
);

export default Properties;

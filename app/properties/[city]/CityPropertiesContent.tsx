"use client";
import React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useInfiniteProperties } from "../../../hooks/useInfiniteProperties";
import PropertyGrid from "@/components/PropertyGrid";
import InfiniteScrollLoader from "@/components/InfiniteScrollLoader";
import { PuffLoader } from "react-spinners";
import TopSearchBar from "@/components/TopSearchBar";
import PropertiesMapExplorer from "@/components/PropertiesMapExplorer";
import GuidedSearchDialog from "@/components/GuidedSearchDialog";
import SaveSearchButton from "@/components/SaveSearchButton";
import { Map, List as ListIcon } from "lucide-react";

const cityMap: Record<string, string> = {
  chandigarh: "Chandigarh",
  mohali: "Mohali",
  panchkula: "Panchkula",
  kharar: "Kharar",
  zirakpur: "Zirakpur",
};

const CityPropertiesContent = ({ city }: { city: string }) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [guidedOpen, setGuidedOpen] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<"list" | "map">("list");
  const [laptopMapOpen, setLaptopMapOpen] = React.useState(true);

  const mergeToUrl = React.useCallback(
    (extra: Record<string, string | undefined | null>) => {
      const merged: Record<string, string> = {
        ...Object.fromEntries(searchParams.entries()),
      };
      merged.city = city;
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
      router.push(`/properties/${city}?${params.toString()}`);
    },
    [city, router, searchParams],
  );

  const handleApplyFilters = (filters: Record<string, unknown>) => {
    const params = new URLSearchParams();
    params.set("city", city);
    for (const key in filters) {
      const val = filters[key];
      if (val == null || val === "") continue;
      if (key === "priceMin" || key === "priceMax") {
        if (Number(val) === 0 && key === "priceMin") continue;
        if (Number(val) >= 1000000000 && key === "priceMax") continue;
      }
      if (key === "areaMin" || key === "areaMax") {
        if (Number(val) === 0 && key === "areaMin") continue;
        if (Number(val) >= 100000 && key === "areaMax") continue;
      }
      params.set(key, String(val));
    }
    router.push(`/properties/${city}?${params.toString()}`);
  };

  const query = React.useMemo(() => {
    const params: { [key: string]: string } = {
      city,
    };
    searchParams.forEach((value, key) => {
      params[key] = value;
    });
    return params;
  }, [searchParams, city]);

  const { properties, hasMore, initialLoading, loadingMore, error, loadMore } =
    useInfiniteProperties(query);

  React.useEffect(() => {
    if (!selectedId) return;
    const el = document.querySelector(`[data-property-id="${selectedId}"]`);
    el?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [selectedId, properties]);

  if (error) {
    return (
      <div className="w-full flex justify-center items-center py-20">
        <span className="text-red-500 font-medium">
          Error while fetching data: {error}
        </span>
      </div>
    );
  }

  if (initialLoading) {
    return (
      <div className="w-full flex justify-center items-center h-[60vh]">
        <PuffLoader size={80} aria-label="puff-loading" />
      </div>
    );
  }

  const displayCity = cityMap[city] || "Tricity";

  return (
    <div className="w-full pt-16 lg:pt-20 bg-gray-50 min-h-screen relative">
      <GuidedSearchDialog
        open={guidedOpen}
        onClose={() => setGuidedOpen(false)}
      />

      {/* Mobile: list / map toggle */}
      <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-1000">
        <button
          type="button"
          onClick={() => setActiveTab(activeTab === "list" ? "map" : "list")}
          className="flex items-center gap-2 bg-[#4161df] text-white px-6 py-3 rounded-full shadow-2xl hover:bg-[#4161df]/20 transition-all transform active:scale-95"
          aria-label={activeTab === "list" ? "Open map view" : "Open list view"}
        >
          {activeTab === "list" ? (
            <>
              <Map className="w-4 h-4" />
              <span className="text-sm font-semibold">Map View</span>
            </>
          ) : (
            <>
              <ListIcon className="w-4 h-4" />
              <span className="text-sm font-semibold">List View</span>
            </>
          )}
        </button>
      </div>

      {/* Laptop: show / hide map column */}
      <div className="hidden lg:flex fixed right-4 top-1/2 -translate-y-1/2 z-1000">
        <button
          type="button"
          onClick={() => setLaptopMapOpen((o) => !o)}
          className="flex flex-col items-center gap-1 bg-[#4161df] text-white px-3 py-4 rounded-2xl shadow-2xl hover:bg-[#4161df]/90 transition-all transform active:scale-95"
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

      <div className="flex flex-col items-center gap-6 max-w-full mx-auto px-4 sm:px-6 lg:px-10 py-8 lg:py-12">
        <div className="w-full text-center">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2 lg:mb-4">
            Find Your Perfect Property in {displayCity}
          </h1>
          <p className="text-base lg:text-lg text-gray-600 max-w-2xl mx-auto">
            Discover homes, apartments, and commercial spaces for sale and rent
            in {displayCity}.
          </p>
        </div>

        <div className="w-full flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => setGuidedOpen(true)}
            className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-800 shadow-sm hover:border-[#4161df]/40 transition-colors"
          >
            Guided search
          </button>
          <SaveSearchButton filters={query} />
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
            <div className="flex items-baseline justify-between gap-2">
              <p className="text-sm font-medium text-gray-700">
                {properties.length} listing{properties.length !== 1 ? "s" : ""}
              </p>
            </div>
            <PropertyGrid
              properties={properties}
              selectedId={selectedId}
              columns={laptopMapOpen ? "two" : "four"}
            />
            <InfiniteScrollLoader
              onIntersect={loadMore}
              loading={loadingMore}
              hasMore={hasMore}
            />
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
};

export default CityPropertiesContent;

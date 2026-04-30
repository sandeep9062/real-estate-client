"use client";
import React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useGetAllPropertiesQuery } from "../../../services/propertiesApi";
import PropertyGrid from "@/components/PropertyGrid";
import { PuffLoader } from "react-spinners";
import TopSearchBar from "@/components/TopSearchBar";
import PropertiesMapExplorer from "@/components/PropertiesMapExplorer";
import GuidedSearchDialog from "@/components/GuidedSearchDialog";
import SaveSearchButton from "@/components/SaveSearchButton";

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

  const { data, isError, isLoading } = useGetAllPropertiesQuery(query);

  React.useEffect(() => {
    if (!selectedId) return;
    const el = document.querySelector(`[data-property-id="${selectedId}"]`);
    el?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [selectedId, data]);

  if (isError) {
    return (
      <div className="w-full flex justify-center items-center py-20">
        <span className="text-red-500 font-medium">
          Error while fetching data
        </span>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="w-full flex justify-center items-center h-[60vh]">
        <PuffLoader size={80} aria-label="puff-loading" />
      </div>
    );
  }

  const displayCity = cityMap[city] || "Tricity";
  const list = data || [];

  return (
    <div className="w-full pt-20 bg-gray-50">
      <GuidedSearchDialog open={guidedOpen} onClose={() => setGuidedOpen(false)} />
      <div className="flex flex-col items-center gap-6 max-w-full mx-auto px-4 sm:px-6 lg:px-10 py-12">
        <div className="w-full text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Find Your Perfect Property in {displayCity}
          </h1>
          <p className="text-lg text-gray-600">
            Discover homes, apartments, and commercial spaces for sale and rent
            in {displayCity}. Use the map for clusters, draw an area, or try
            guided search.
          </p>
        </div>
        <div className="w-full flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => setGuidedOpen(true)}
            className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-800 shadow-sm hover:border-[#4161df]/40"
          >
            Guided search
          </button>
          <SaveSearchButton filters={query} />
        </div>
        <div className="w-full">
          <TopSearchBar onApply={handleApplyFilters} initialFilters={query} />
        </div>
        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          <div className="order-2 lg:order-1 space-y-3 min-w-0">
            <div className="flex items-baseline justify-between gap-2">
              <p className="text-sm font-medium text-gray-700">
                {list.length} listing{list.length !== 1 ? "s" : ""}
              </p>
            </div>
            <PropertyGrid
              properties={list}
              selectedId={selectedId}
              columns="two"
            />
          </div>
          <div className="order-1 lg:order-2 sticky top-20 z-10 w-full min-w-0 self-start">
            <PropertiesMapExplorer
              properties={list}
              selectedId={selectedId}
              onSelectProperty={setSelectedId}
              onSearchThisArea={(bbox) =>
                mergeToUrl({ bbox, polygon: undefined })
              }
              onPolygonApply={(polygonJson) =>
                mergeToUrl({ polygon: polygonJson, bbox: undefined })
              }
              heightClass="h-[min(920px,85vh,calc(100dvh-3rem))]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CityPropertiesContent;

import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "./api"; // your existing baseQuery

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SectorEntry {
  sector:       string;
  city:         string;
  propertyType: string;
  listingType:  string;
  count:        number;
  medianPrice:  number;
  minPrice:     number;
  maxPrice:     number;
  avgArea:      number | null;
  pricePerSqft: number | null;
  trend:        number | null;   // % vs previous quarter, null = first report
  priceTag:     "Overpriced" | "Fair Market" | "Value Deal" | "New Data";
}

export interface YieldEntry {
  sector:       string;
  city:         string;
  propertyType: string;
  salePrice:    number;
  monthlyRent:  number;
  annualYield:  number;
  yieldTag:     "High Yield" | "Moderate Yield" | "Low Yield";
  pricePerSqft: number | null;
}

export interface MarketIndexReport {
  _id:           string;
  quarter:       string;   // "Q2-2025"
  year:          number;
  generatedAt:   string;
  rentData:      SectorEntry[];
  saleData:      SectorEntry[];
  yieldData:     YieldEntry[];
  totalListings: number;
}

export interface MarketIndexHistory {
  _id:           string;
  quarter:       string;
  year:          number;
  generatedAt:   string;
  totalListings: number;
}

export interface SectorDrilldown {
  quarter: string;
  rent:    SectorEntry[];
  sale:    SectorEntry[];
  yield:   YieldEntry[];
}

// ─── API Slice ────────────────────────────────────────────────────────────────

export const marketIndexApi = createApi({
  reducerPath: "marketIndexApi",
  baseQuery:   baseQueryWithAuth,   // reuse your existing auth-aware baseQuery
  tagTypes:    ["MarketIndex"],
  endpoints:   (builder) => ({

    // GET /api/market-index — latest report (public)
    getMarketIndex: builder.query<MarketIndexReport, void>({
      query:       () => "/market-index",
      providesTags: ["MarketIndex"],
    }),

    // GET /api/market-index/history — last 8 quarters
    getMarketIndexHistory: builder.query<MarketIndexHistory[], void>({
      query:       () => "/market-index/history",
      providesTags: ["MarketIndex"],
    }),

    // GET /api/market-index/sector/:sector — drill-down for one sector
    // Used on individual property listing pages to show sector benchmarks
    getSectorDrilldown: builder.query<SectorDrilldown, string>({
      query:       (sector) => `/market-index/sector/${encodeURIComponent(sector)}`,
      providesTags: ["MarketIndex"],
    }),

    // POST /api/market-index/generate — admin only
    generateMarketIndex: builder.mutation<
      { message: string; id: string; stats: Record<string, number> },
      void
    >({
      query: () => ({
        url:    "/market-index/generate",
        method: "POST",
        // x-admin-secret header is injected server-side via your admin route
        // Do NOT expose ADMIN_SECRET in frontend — call this from an admin panel
        // that is behind authentication, or call the endpoint directly via curl
      }),
      invalidatesTags: ["MarketIndex"],
    }),

  }),
});

export const {
  useGetMarketIndexQuery,
  useGetMarketIndexHistoryQuery,
  useGetSectorDrilldownQuery,
  useLazyGetSectorDrilldownQuery,
  useGenerateMarketIndexMutation,
} = marketIndexApi;


// ─── Server-side fetch (SSG / ISR) ───────────────────────────────────────────
// Mirrors the pattern of your existing fetchPropertiesServer / getPropertyServer

import { getApiUrl } from "./propertiesApi"; // reuse your existing URL resolver

export async function getMarketIndexServer(): Promise<MarketIndexReport | null> {
  const apiUrl = getApiUrl();
  try {
    const res = await fetch(`${apiUrl}/market-index`, {
      next:    { revalidate: 86400 }, // ISR — rebuild once per day
      headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.error("[getMarketIndexServer]", err);
    return null;
  }
}

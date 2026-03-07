import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "./api"; // Adjust this import based on your baseQuery file name

export const aiBasedApi = createApi({
  reducerPath: "aiBasedApi",
  baseQuery: baseQueryWithAuth,
  endpoints: (builder) => ({
    // The Magic Fill endpoint
    magicFill: builder.mutation({
      query: (text: string) => ({
        url: "/v1/ai/magic-fill",
        method: "POST",
        body: { text },
      }),
    }),

    // Endpoint for generating professional descriptions
    generateDescription: builder.mutation({
      query: (details: any) => ({
        url: "/v1/ai/description",
        method: "POST",
        body: details,
      }),
    }),

    // Endpoint for SEO metadata
    generateSeoMeta: builder.mutation({
      query: (details: any) => ({
        url: "/v1/ai/seo-meta",
        method: "POST",
        body: details,
      }),
    }),

    // Endpoint for Locality Guide (hyper-local info for Tricity)
    generateLocalityGuide: builder.mutation({
      query: (location: string) => ({
        url: "/v1/ai/locality-guide",
        method: "POST",
        body: { location },
      }),
    }),
  }),
});

export const {
  useMagicFillMutation,
  useGenerateDescriptionMutation,
  useGenerateSeoMetaMutation,
  useGenerateLocalityGuideMutation,
} = aiBasedApi;

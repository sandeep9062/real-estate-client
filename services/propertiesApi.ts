import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "./api";

/**
 * 1. DYNAMIC API URL UTILITY
 * We rely on environment variables.
 * On Render/Vercel, set NEXT_PUBLIC_API_URL to https://api.propertybulbul.com/api
 */
export const getApiUrl = () => {
  return process.env.NEXT_PUBLIC_API_URL || "http://localhost:9000/api";
};

/**
 * 2. SERVER-SIDE FETCH HELPER
 * Used for Next.js Server Components (SSR/ISR)
 */
export async function getPropertyServer(id: string) {
  const apiUrl = getApiUrl();

  try {
    const response = await fetch(`${apiUrl}/properties/${id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store", // Ensures we get fresh data
    });

    if (response.status === 404) return null;

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("getPropertyServer error:", error);
    throw error;
  }
}

/**
 * 3. HELPER: CONVERT OBJECT TO FORMDATA
 * Centralizes the logic for handling file arrays and JSON strings
 */
const preparePropertyFormData = (data: any) => {
  const formData = new FormData();

  Object.keys(data).forEach((key) => {
    const value = data[key];

    if (key === "image" && Array.isArray(value)) {
      // Handle Image uploads (Files and existing URL strings)
      const existingImages = value.filter((img) => typeof img === "string");
      const newFiles = value.filter((img) => img instanceof File);

      if (existingImages.length > 0) {
        formData.append("existingImages", JSON.stringify(existingImages));
      }
      newFiles.forEach((file) => formData.append("image", file));
    } else if (
      typeof value === "object" &&
      value !== null &&
      !(value instanceof File)
    ) {
      // Handle nested objects (like address or features)
      formData.append(key, JSON.stringify(value));
    } else {
      // Handle standard strings/numbers
      formData.append(key, value);
    }
  });

  return formData;
};

/**
 * 4. REDUX TOOLKIT QUERY API
 */
export const propertiesApi = createApi({
  reducerPath: "propertiesApi",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["Property"],
  endpoints: (builder) => ({
    getAllProperties: builder.query({
      query: (params) => ({
        url: "/properties",
        params,
      }),
      providesTags: ["Property"],
    }),

    getProperty: builder.query({
      query: (id) => `/properties/${id}`,
      providesTags: (result, error, id) => [{ type: "Property", id }],
    }),

    getOwnedProperties: builder.query({
      query: () => `/properties/owned`,
      providesTags: ["Property"],
    }),

    createProperty: builder.mutation({
      query: (property) => ({
        url: "/properties",
        method: "POST",
        body: preparePropertyFormData(property),
      }),
      invalidatesTags: ["Property"],
    }),

    updateProperty: builder.mutation({
      query: ({ id, ...property }) => ({
        url: `/properties/${id}`,
        method: "PUT",
        body: preparePropertyFormData(property),
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Property", id },
        "Property",
      ],
    }),

    deleteProperty: builder.mutation({
      query: (id) => ({
        url: `/properties/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Property"],
    }),

    getPropertyBrochure: builder.query({
      query: (id) => ({
        url: `/properties/${id}/download-brochure`,
        responseHandler: (response) => response.blob(),
      }),
    }),

    createWhatsAppLead: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/properties/${id}/whatsapp-lead`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Property"],
    }),
  }),
});

export const {
  useGetAllPropertiesQuery,
  useGetPropertyQuery,
  useGetOwnedPropertiesQuery,
  useCreatePropertyMutation,
  useUpdatePropertyMutation,
  useDeletePropertyMutation,
  useGetPropertyBrochureQuery,
  useCreateWhatsAppLeadMutation,
} = propertiesApi;

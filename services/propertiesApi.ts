import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Dynamic API URL detection for production vs development
const getApiUrl = () => {
  // First priority: Environment variable
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }

  // Second priority: Detect production environment (client-side only)
  if (typeof window !== "undefined") {
    const hostname = window.location.hostname;

    // If on production domain, use Render backend URL
    if (
      hostname === "www.propertybulbul.com" ||
      hostname === "propertybulbul.com"
    ) {
      return "https://api.propertybulbul.com/api";
    }
  }

  // Default: localhost for development
  return "http://localhost:9000/api";
};

export async function getPropertyServer(id: string) {
  const apiUrl = getApiUrl();

  try {
    const response = await fetch(`${apiUrl}/properties/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (response.status === 404) return null;

    if (!response.ok) {
      const errorText = await response.text().catch(() => "Unknown error");
      console.error(`API Error [${response.status}]: ${errorText}`);
      throw new Error(`API request failed with status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    // Log the actual error for debugging
    console.error("getPropertyServer error:", error);

    // Re-throw with more context if it's a network error
    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new Error(
        `Unable to connect to API at ${apiUrl}. Please ensure the backend server is running.`,
      );
    }

    throw error;
  }
}

import { baseQueryWithAuth } from "./api";

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
      query: (property) => {
        const formData = new FormData();
        Object.keys(property).forEach((key) => {
          if (key === "image") {
            property[key].forEach((file: File) => {
              formData.append(key, file);
            });
          } else if (
            typeof property[key] === "object" &&
            property[key] !== null
          ) {
            formData.append(key, JSON.stringify(property[key]));
          } else {
            formData.append(key, property[key]);
          }
        });
        return {
          url: "/properties",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["Property"],
    }),
    updateProperty: builder.mutation({
      query: ({ id, ...property }) => {
        const formData = new FormData();
        const existingImages = (property.image || []).filter(
          (img: File | string) => typeof img === "string",
        );
        const newImages = (property.image || []).filter(
          (img: File | string) => img instanceof File,
        );
        formData.append("existingImages", JSON.stringify(existingImages));
        newImages.forEach((file: File) => {
          formData.append("image", file);
        });
        Object.keys(property).forEach((key) => {
          if (key === "image") {
            // Already handled above
          } else if (
            typeof property[key] === "object" &&
            property[key] !== null
          ) {
            formData.append(key, JSON.stringify(property[key]));
          } else {
            formData.append(key, property[key]);
          }
        });
        return {
          url: `/properties/${id}`,
          method: "PUT",
          body: formData,
        };
      },
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
} = propertiesApi;

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export async function getPropertyServer(id: string) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/properties/${id}`, {
      method: 'GET'
    });
    if (response.status === 404) return null;
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }
    return await response.json();
  } catch (error) {
    throw new Error("Failed to fetch data");
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
        const { token, ...propertyData } = property;
        Object.keys(propertyData).forEach((key) => {
          if (key === "image") {
            propertyData[key].forEach((file: File) => {
              formData.append(key, file);
            });
          } else if (typeof propertyData[key] === "object" && propertyData[key] !== null) {
            formData.append(key, JSON.stringify(propertyData[key]));
          } else {
            formData.append(key, propertyData[key]);
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
        const existingImages = (property.image || []).filter((img: File | string) => typeof img === 'string');
        const newImages = (property.image || []).filter((img: File | string) => img instanceof File);
        formData.append("existingImages", JSON.stringify(existingImages));
        newImages.forEach((file: File) => {
          formData.append("image", file);
        });
        Object.keys(property).forEach((key) => {
          if (key === "image") {
            // Already handled above
          } else if (typeof property[key] === "object" && property[key] !== null) {
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
      invalidatesTags: (result, error, { id }) => [{ type: "Property", id }, "Property"],
    }),
    deleteProperty: builder.mutation({
      query: (id) => ({
        url: `/properties/${id}`,
        method: "DELETE",
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
} = propertiesApi;

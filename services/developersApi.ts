import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "./api";
import { getApiUrl } from "./propertiesApi";

export async function getDeveloperByIdServer(id: string) {
  const apiUrl = getApiUrl();
  try {
    const response = await fetch(`${apiUrl}/v1/developers/${id}`, {
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });
    if (response.status === 404) return null;
    if (!response.ok) {
      console.error(`Developer API Error [${response.status}]`);
      return null;
    }
    return await response.json();
  } catch (error) {
    console.error("getDeveloperByIdServer error:", error);
    return null;
  }
}

export const developersApi = createApi({
  reducerPath: "developersApi",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["Developer"],
  endpoints: (builder) => ({
    getDevelopers: builder.query({
      query: () => "/v1/developers",
      providesTags: ["Developer"],
    }),
    getDeveloperById: builder.query({
      query: (id) => `/v1/developers/${id}`,
      providesTags: (result, error, id) => [{ type: "Developer", id }],
    }),
    createDeveloper: builder.mutation({
      query: (devData) => {
        const formData = new FormData();
        // Append logo separately if it's a file
        if (devData.logo instanceof File) {
          formData.append("logo", devData.logo);
        }
        // Append other fields
        Object.keys(devData).forEach((key) => {
          if (key !== "logo") formData.append(key, devData[key]);
        });

        return {
          url: "/v1/developers",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["Developer"],
    }),
    updateDeveloper: builder.mutation({
      query: ({ id, ...update }) => ({
        url: `/v1/developers/${id}`,
        method: "PUT",
        body: update,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Developer", id }],
    }),
  }),
});

export const {
  useGetDevelopersQuery,
  useGetDeveloperByIdQuery,
  useCreateDeveloperMutation,
  useUpdateDeveloperMutation,
} = developersApi;

import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "./api";

export interface SavedSearch {
  _id: string;
  user: string;
  name: string;
  filters: Record<string, string | number | boolean | undefined>;
  notifyEmail: boolean;
  notifyInApp: boolean;
  isActive: boolean;
  cursorAt: string;
  createdAt: string;
  updatedAt: string;
}

export const savedSearchesApi = createApi({
  reducerPath: "savedSearchesApi",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["SavedSearch"],
  endpoints: (builder) => ({
    listSavedSearches: builder.query<SavedSearch[], void>({
      query: () => "/saved-searches",
      providesTags: ["SavedSearch"],
    }),
    createSavedSearch: builder.mutation<
      SavedSearch,
      {
        name?: string;
        filters: Record<string, unknown>;
        notifyEmail?: boolean;
        notifyInApp?: boolean;
      }
    >({
      query: (body) => ({
        url: "/saved-searches",
        method: "POST",
        body,
      }),
      invalidatesTags: ["SavedSearch"],
    }),
    updateSavedSearch: builder.mutation<
      SavedSearch,
      { id: string; patch: Partial<SavedSearch> }
    >({
      query: ({ id, patch }) => ({
        url: `/saved-searches/${id}`,
        method: "PATCH",
        body: patch,
      }),
      invalidatesTags: ["SavedSearch"],
    }),
    deleteSavedSearch: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/saved-searches/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["SavedSearch"],
    }),
  }),
});

export const {
  useListSavedSearchesQuery,
  useCreateSavedSearchMutation,
  useUpdateSavedSearchMutation,
  useDeleteSavedSearchMutation,
} = savedSearchesApi;

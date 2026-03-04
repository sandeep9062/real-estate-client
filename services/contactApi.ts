import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "./api";

export const contactApi = createApi({
  reducerPath: "contactApi",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["Contacts"],
  endpoints: (builder) => ({
    // ✅ GET all contacts
    getContacts: builder.query<any, void>({
      query: () => `/v1/contacts`,
      providesTags: ["Contacts"],
    }),

    // ✅ GET single contact by ID
    getContactById: builder.query<any, string>({
      query: (id) => `/v1/contacts/${id}`,
      providesTags: ["Contacts"],
    }),

    // ✅ POST new contact (JSON payload)
    addContact: builder.mutation<any, any>({
      query: (body) => ({
        url: `/v1/contacts`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Contacts"],
    }),

    // ✅ UPDATE contact (JSON payload)
    updateContact: builder.mutation<any, { id: string; body: any }>({
      query: ({ id, body }) => ({
        url: `/v1/contacts/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Contacts"],
    }),

    // ✅ DELETE contact
    deleteContact: builder.mutation<any, string>({
      query: (id) => ({
        url: `/v1/contacts/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Contacts"],
    }),
  }),
});

// ✅ Export hooks
export const {
  useGetContactsQuery,
  useGetContactByIdQuery,
  useAddContactMutation,
  useUpdateContactMutation,
  useDeleteContactMutation,
} = contactApi;
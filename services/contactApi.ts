import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "./api";

const baseUrl = `${process.env.NEXT_PUBLIC_API_URL}/v1/contacts`;

export const contactApi = createApi({
  reducerPath: "contactApi",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["Contacts"],
  endpoints: (builder) => ({
    // ✅ GET all contacts
    getContacts: builder.query<any, void>({
      query: () => `/contacts`,
      providesTags: ["Contacts"],
    }),

    // ✅ GET single contact by ID
    getContactById: builder.query<any, string>({
      query: (id) => `/contacts/${id}`,
      providesTags: ["Contacts"],
    }),

    // ✅ POST new contact (JSON payload)
    addContact: builder.mutation<any, any>({
      query: (body) => ({
        url: `/contacts`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Contacts"],
    }),

    // ✅ UPDATE contact (JSON payload)
    updateContact: builder.mutation<any, { id: string; body: any }>({
      query: ({ id, body }) => ({
        url: `/contacts/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Contacts"],
    }),

    // ✅ DELETE contact
    deleteContact: builder.mutation<any, string>({
      query: (id) => ({
        url: `/contacts/${id}`,
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
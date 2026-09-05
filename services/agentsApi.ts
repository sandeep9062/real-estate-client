import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "./api";

interface RegisterAgentResponse {
  success: boolean;
  message: string;
  data?: { id: string; name: string };
}

interface MyAgentProfileResponse {
  success: boolean;
  data: {
    _id: string;
    name: string;
    title?: string;
    phone?: string;
    whatsapp?: string;
    email?: string;
    bio?: string;
    rera?: string;
    agencyName?: string;
    locations?: string[];
    specialisations?: string[];
    languages?: string[];
    avatar?: string;
    profileCompleteness: number;
  };
}

export const agentsApi = createApi({
  reducerPath: "agentsApi",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["Agent", "MyAgentProfile"],
  endpoints: (builder) => ({
    /**
     * Register a new agent (public endpoint, supports file upload).
     * Caller must pass a FormData object.
     */
    registerAgent: builder.mutation<RegisterAgentResponse, FormData>({
      query: (formData) => ({
        url: "/agents/register",
        method: "POST",
        body: formData,
        // Do not set Content-Type — browser sets multipart/form-data with boundary
      }),
    }),

    // Logged-in agent's own profile + profileCompleteness
    getMyAgentProfile: builder.query<MyAgentProfileResponse, void>({
      query: () => "/agents/me",
      providesTags: ["MyAgentProfile"],
    }),

    // Partial update of the logged-in agent's own profile (JSON or FormData)
    updateMyAgentProfile: builder.mutation<
      MyAgentProfileResponse,
      Record<string, unknown> | FormData
    >({
      query: (body) => ({
        url: "/agents/me",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["MyAgentProfile"],
    }),
  }),
});

export const {
  useRegisterAgentMutation,
  useGetMyAgentProfileQuery,
  useUpdateMyAgentProfileMutation,
} = agentsApi;

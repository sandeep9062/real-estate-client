import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

/**
 * Public base query — no auth headers, used for the public agent registration endpoint.
 */
const publicBaseQuery = fetchBaseQuery({
  baseUrl:
    typeof window !== "undefined"
      ? process.env.NEXT_PUBLIC_API_URL || "http://localhost:9000/api"
      : process.env.NEXT_PUBLIC_API_URL || "http://localhost:9000/api",
});

interface RegisterAgentResponse {
  success: boolean;
  message: string;
  data?: { id: string; name: string };
}

export const agentsApi = createApi({
  reducerPath: "agentsApi",
  baseQuery: publicBaseQuery,
  tagTypes: ["Agent"],
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
  }),
});

export const { useRegisterAgentMutation } = agentsApi;

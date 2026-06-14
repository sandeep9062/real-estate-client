import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "./api";
import { getApiUrl } from "./propertiesApi";

// ──────────────────────────────────────────────
// Server-side helpers (for SSR / ISR)
// ──────────────────────────────────────────────

export async function getLandlordByIdServer(id: string) {
  const apiUrl = getApiUrl();
  try {
    const response = await fetch(`${apiUrl}/landlords/${id}`, {
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });
    if (response.status === 404) return null;
    if (!response.ok) {
      console.error(`Landlord API Error [${response.status}]`);
      return null;
    }
    return await response.json();
  } catch (error) {
    console.error("getLandlordByIdServer error:", error);
    return null;
  }
}

export async function getLandlordBySlugServer(slug: string) {
  const apiUrl = getApiUrl();
  try {
    const response = await fetch(`${apiUrl}/landlords/${slug}`, {
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });
    if (response.status === 404) return null;
    if (!response.ok) {
      console.error(`Landlord API Error [${response.status}]`);
      return null;
    }
    return await response.json();
  } catch (error) {
    console.error("getLandlordBySlugServer error:", error);
    return null;
  }
}

/**
 * Fetch all landlords at build time (SSG) or on ISR revalidation.
 */
export async function fetchLandlordsServer() {
  const apiUrl = getApiUrl();

  try {
    const response = await fetch(`${apiUrl}/landlords`, {
      next: { revalidate: 3600 }, // ISR — rebuild static page every hour
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      console.error(
        `[landlordApi] fetchLandlordsServer failed with ${response.status}`,
      );
      return [];
    }

    const json = await response.json();
    return json?.data ?? json ?? [];
  } catch (error) {
    console.error("fetchLandlordsServer error:", error);
    return [];
  }
}

// ──────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────

interface RegisterLandlordResponse {
  success: boolean;
  message: string;
  data?: { id: string; name: string; slug: string };
}

interface Landlord {
  _id: string;
  userID?: string;
  name: string;
  slug?: string;
  title?: string;
  bio?: string;
  longBio?: string;
  phone?: string;
  whatsapp?: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  avatar?: string;
  avatarColor?: string;
  coverImage?: string;
  totalProperties?: number;
  activeListings?: number;
  propertyTypes?: string[];
  rating?: number;
  totalReviews?: number;
  isVerified?: boolean;
  identityVerified?: boolean;
  isCompany?: boolean;
  companyName?: string;
  gstin?: string;
  pan?: string;
  status?: "active" | "inactive" | "suspended";
  featured?: boolean;
  locations?: string[];
  languages?: string[];
  documents?: Array<{
    _id: string;
    title: string;
    type: string;
    url: string;
    verified: boolean;
    uploadedAt: string;
  }>;
  bankDetails?: {
    accountHolderName?: string;
    accountNumber?: string;
    ifscCode?: string;
    bankName?: string;
    upiId?: string;
  };
  preferences?: {
    contactMethod?: "phone" | "email" | "whatsapp";
    availableTimings?: string;
    acceptsVisits?: boolean;
  };
  totalDeals?: number;
  responseTime?: string;
  responseRate?: string;
  memberSince?: string;
  metaTitle?: string;
  metaDescription?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface LandlordsListResponse {
  success: boolean;
  count: number;
  total: number;
  totalPages: number;
  currentPage: number;
  data: Landlord[];
}

interface LandlordResponse {
  success: boolean;
  data: Landlord;
}

// ──────────────────────────────────────────────
// RTK Query API slice
// ──────────────────────────────────────────────

/**
 * Public base query — no auth headers, used for the public landlord registration endpoint.
 */
const publicBaseQuery = fetchBaseQuery({
  baseUrl:
    typeof window !== "undefined"
      ? process.env.NEXT_PUBLIC_API_URL || "http://localhost:9000/api"
      : process.env.NEXT_PUBLIC_API_URL || "http://localhost:9000/api",
});

export const landlordApi = createApi({
  reducerPath: "landlordApi",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["Landlord"],
  endpoints: (builder) => ({
    /**
     * Register a new landlord (public endpoint, supports file upload).
     * Caller must pass a FormData object.
     */
    registerLandlord: builder.mutation<RegisterLandlordResponse, FormData>({
      query: (formData) => ({
        url: "/landlords/register",
        method: "POST",
        body: formData,
        // Do not set Content-Type — browser sets multipart/form-data with boundary
      }),
    }),

    /**
     * Get all landlords with optional filters
     */
    getLandlords: builder.query<
      LandlordsListResponse,
      {
        page?: number;
        limit?: number;
        status?: string;
        city?: string;
        isVerified?: string;
        featured?: string;
        search?: string;
      }
    >({
      query: (params = {}) => ({
        url: "/landlords",
        params,
      }),
      providesTags: ["Landlord"],
    }),

    /**
     * Get a single landlord by ID or slug
     */
    getLandlordById: builder.query<LandlordResponse, string>({
      query: (identifier) => `/landlords/${identifier}`,
      providesTags: (result, error, identifier) => [
        { type: "Landlord", id: identifier },
      ],
    }),

    /**
     * Update a landlord profile (supports file upload)
     */
    updateLandlord: builder.mutation<
      LandlordResponse,
      { id: string; data: FormData }
    >({
      query: ({ id, data }) => ({
        url: `/landlords/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Landlord", id },
        "Landlord",
      ],
    }),

    /**
     * Delete a landlord
     */
    deleteLandlord: builder.mutation<
      { success: boolean; message: string },
      string
    >({
      query: (id) => ({
        url: `/landlords/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Landlord"],
    }),

    /**
     * Upload a document for a landlord
     */
    uploadDocument: builder.mutation<
      { success: boolean; message: string; data: Landlord["documents"] },
      { id: string; formData: FormData }
    >({
      query: ({ id, formData }) => ({
        url: `/landlords/${id}/documents`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Landlord", id }],
    }),

    /**
     * Verify a landlord document (admin)
     */
    verifyDocument: builder.mutation<
      { success: boolean; message: string; data: Landlord },
      { id: string; docId: string }
    >({
      query: ({ id, docId }) => ({
        url: `/landlords/${id}/documents/${docId}/verify`,
        method: "PATCH",
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Landlord", id }],
    }),

    /**
     * Verify/unverify a landlord (admin)
     */
    verifyLandlord: builder.mutation<
      { success: boolean; message: string; data: Landlord },
      { id: string; isVerified?: boolean; identityVerified?: boolean }
    >({
      query: ({ id, ...body }) => ({
        url: `/landlords/${id}/verify`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Landlord", id },
        "Landlord",
      ],
    }),

    /**
     * Update bank details
     */
    updateBankDetails: builder.mutation<
      { success: boolean; message: string; data: Landlord },
      { id: string; bankDetails: Landlord["bankDetails"] }
    >({
      query: ({ id, bankDetails }) => ({
        url: `/landlords/${id}/bank-details`,
        method: "PUT",
        body: bankDetails,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Landlord", id }],
    }),

    /**
     * Toggle featured status (admin)
     */
    toggleFeatured: builder.mutation<
      { success: boolean; message: string; data: Landlord },
      string
    >({
      query: (id) => ({
        url: `/landlords/${id}/featured`,
        method: "PATCH",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Landlord", id },
        "Landlord",
      ],
    }),

    /**
     * Update landlord status (admin)
     */
    updateLandlordStatus: builder.mutation<
      { success: boolean; message: string; data: Landlord },
      { id: string; status: "active" | "inactive" | "suspended" }
    >({
      query: ({ id, status }) => ({
        url: `/landlords/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Landlord", id },
        "Landlord",
      ],
    }),
  }),
});

// ──────────────────────────────────────────────
// Exported hooks
// ──────────────────────────────────────────────

export const {
  useRegisterLandlordMutation,
  useGetLandlordsQuery,
  useGetLandlordByIdQuery,
  useUpdateLandlordMutation,
  useDeleteLandlordMutation,
  useUploadDocumentMutation,
  useVerifyDocumentMutation,
  useVerifyLandlordMutation,
  useUpdateBankDetailsMutation,
  useToggleFeaturedMutation,
  useUpdateLandlordStatusMutation,
} = landlordApi;

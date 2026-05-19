import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "./api";
import { getApiUrl } from "./propertiesApi";

export async function getJournalBySlugServer(
  slug: string,
): Promise<Journal | null> {
  const apiUrl = getApiUrl();
  try {
    const response = await fetch(`${apiUrl}/v1/journals/slug/${slug}`, {
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });
    if (response.status === 404) return null;
    if (!response.ok) {
      console.error(`Journal API Error [${response.status}]`);
      return null;
    }
    return await response.json();
  } catch (error) {
    console.error("getJournalBySlugServer error:", error);
    return null;
  }
}

/**
 * Interface matching the backend's PaginatedJournalsResponse.
 */
export interface FetchJournalsServerResult {
  journals: Journal[];
  currentPage: number;
  totalPages: number;
  total: number;
  hasNextPage: boolean;
}

/**
 * Fetch journal posts at build time (SSG) or on ISR revalidation.
 * Uses `next: { revalidate }` so subsequent ISR fetches are cached by Next.js.
 */
export async function fetchJournalsServer(
  page = 1,
  limit = 12,
  category?: string,
): Promise<FetchJournalsServerResult> {
  const apiUrl = getApiUrl();
  const url = new URL(`${apiUrl}/v1/journals`);

  url.searchParams.set("page", String(page));
  url.searchParams.set("limit", String(limit));
  if (category) url.searchParams.set("category", category);

  try {
    const res = await fetch(url.toString(), {
      next: { revalidate: 3600 },
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
      console.error(`[fetchJournalsServer] failed with ${res.status}`);
      return {
        journals: [],
        currentPage: 1,
        totalPages: 0,
        total: 0,
        hasNextPage: false,
      };
    }

    return await res.json();
  } catch (error) {
    console.error("[fetchJournalsServer] network error:", error);
    return {
      journals: [],
      currentPage: 1,
      totalPages: 0,
      total: 0,
      hasNextPage: false,
    };
  }
}

/**
 * Fetch all distinct journal categories at build time (SSG).
 * Cached with ISR revalidation (1 hour).
 */
export async function fetchJournalCategoriesServer(): Promise<CategoriesResponse> {
  const apiUrl = getApiUrl();
  const url = new URL(`${apiUrl}/v1/journals/categories`);

  try {
    const res = await fetch(url.toString(), {
      next: { revalidate: 3600 },
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
      console.error(`[fetchJournalCategoriesServer] failed with ${res.status}`);
      return { success: false, categories: [] };
    }

    return await res.json();
  } catch (error) {
    console.error("[fetchJournalCategoriesServer] network error:", error);
    return { success: false, categories: [] };
  }
}

export interface CategoriesResponse {
  success: boolean;
  categories: string[];
}

export interface PaginatedJournalsResponse {
  journals: Journal[];
  currentPage: number;
  totalPages: number;
  total: number;
  hasNextPage: boolean;
}

export const journalApi = createApi({
  reducerPath: "journalApi",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["Journal"],
  endpoints: (builder) => ({
    // Fetch all journals with optional filtering (category, sector, etc.) and pagination
    getJournals: builder.query<
      PaginatedJournalsResponse,
      Record<string, any> | undefined
    >({
      query: (params) => ({
        url: "/v1/journals",
        params: {
          ...params,
          page: params?.page || 1,
          limit: params?.limit || 12,
        },
      }),
      providesTags: (result) =>
        result?.journals
          ? [
              ...result.journals.map(({ _id }: { _id: string }) => ({
                type: "Journal" as const,
                id: _id,
              })),
              { type: "Journal", id: "LIST" },
            ]
          : [{ type: "Journal", id: "LIST" }],
    }),

    // Lazy query for fetching additional pages (infinite scroll)
    getJournalsPage: builder.query<
      PaginatedJournalsResponse,
      Record<string, any> | undefined
    >({
      query: (params) => ({
        url: "/v1/journals",
        params: {
          ...params,
          page: params?.page || 1,
          limit: params?.limit || 12,
        },
      }),
      providesTags: (result) =>
        result?.journals
          ? [
              ...result.journals.map(({ _id }: { _id: string }) => ({
                type: "Journal" as const,
                id: _id,
              })),
              { type: "Journal", id: "LIST" },
            ]
          : [{ type: "Journal", id: "LIST" }],
    }),

    // Fetch all distinct journal categories
    getJournalCategories: builder.query<CategoriesResponse, void>({
      query: () => "/v1/journals/categories",
    }),

    // Fetch single journal by ID
    getJournalById: builder.query<Journal, string>({
      query: (id) => `/v1/journals/${id}`,
      providesTags: (result, error, id) => [{ type: "Journal", id }],
    }),

    // Fetch single journal by Slug (Crucial for SEO-friendly URLs)
    getJournalBySlug: builder.query<Journal, string>({
      query: (slug) => `/v1/journals/slug/${slug}`,
      providesTags: (result, error, slug) => [{ type: "Journal", slug }],
    }),

    // Create a new journal post
    createJournal: builder.mutation<Journal, Partial<Journal>>({
      query: (journalData) => {
        // Using FormData in case you want to upload cover images directly
        const formData = new FormData();
        Object.keys(journalData).forEach((key) => {
          const value = journalData[key as keyof typeof journalData];
          if (key === "coverImage" && value && (value as any) instanceof File) {
            formData.append("coverImage", value as unknown as Blob);
          } else if (Array.isArray(value) && value !== null) {
            formData.append(key, JSON.stringify(value));
          } else if (typeof value === "object" && value !== null) {
            formData.append(key, JSON.stringify(value));
          } else if (value !== undefined && value !== null) {
            formData.append(key, value as string | Blob);
          }
        });

        return {
          url: "/v1/journals",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: [{ type: "Journal", id: "LIST" }],
    }),

    // Update an existing journal
    updateJournal: builder.mutation<
      Journal,
      { id: string; update: Partial<Journal> }
    >({
      query: ({ id, ...update }) => ({
        url: `/v1/journals/${id}`,
        method: "PUT",
        body: update,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Journal", id },
        { type: "Journal", id: "LIST" },
      ],
    }),

    // Delete a journal post
    deleteJournal: builder.mutation<void, string>({
      query: (id) => ({
        url: `/v1/journals/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Journal", id: "LIST" }],
    }),
  }),
});

export const {
  useGetJournalsQuery,
  useGetJournalsPageQuery,
  useLazyGetJournalsPageQuery,
  useGetJournalByIdQuery,
  useGetJournalBySlugQuery,
  useGetJournalCategoriesQuery,
  useCreateJournalMutation,
  useUpdateJournalMutation,
  useDeleteJournalMutation,
} = journalApi;

interface Journal {
  _id: string;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  date: string;
  category: string;
  targetSector: string;
  location?: string;
  coverImage: string;
  slug: string;
  metaTitle: string;
  keywords: string[];
  createdAt: string;
}

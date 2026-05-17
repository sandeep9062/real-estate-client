import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "./api";
import { getApiUrl } from "./propertiesApi";

export async function getProjectBySlugServer(slug: string) {
  const apiUrl = getApiUrl();
  try {
    const response = await fetch(`${apiUrl}/v1/projects/slug/${slug}`, {
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });
    if (response.status === 404) return null;
    if (!response.ok) {
      console.error(`Project API Error [${response.status}]`);
      return null;
    }
    return await response.json();
  } catch (error) {
    console.error("getProjectBySlugServer error:", error);
    return null;
  }
}

/**
 * Fetch all projects at build time (SSG) or on ISR revalidation.
 * Uses `next: { revalidate }` so the build and subsequent ISR fetches
 * are cached by Next.js.
 */
export async function fetchProjectsServer() {
  const apiUrl = getApiUrl();

  try {
    const response = await fetch(`${apiUrl}/v1/projects`, {
      next: { revalidate: 3600 }, // ISR — rebuild static page every hour
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      console.error(
        `[projectsApi] fetchProjectsServer failed with ${response.status}`,
      );
      return [];
    }

    const json = await response.json();
    return json?.data ?? json ?? [];
  } catch (error) {
    console.error("fetchProjectsServer error:", error);
    return [];
  }
}

export const projectsApi = createApi({
  reducerPath: "projectsApi",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["Project"],
  endpoints: (builder) => ({
    getProjects: builder.query({
      query: (params) => ({
        url: "/v1/projects",
        params, // Handles ?city=Mohali&status=Ready
      }),
      providesTags: ["Project"],
    }),
    getProjectById: builder.query({
      query: (id) => `/v1/projects/${id}`,
      providesTags: (result, error, id) => [{ type: "Project", id }],
    }),
    getProjectBySlug: builder.query({
      query: (slug) => {
        console.log("Fetching project with slug:", slug);
        return `/v1/projects/slug/${slug}`;
      },
      providesTags: (result, error, slug) => [{ type: "Project", slug }],
    }),
    createProject: builder.mutation({
      query: (projectData) => {
        const formData = new FormData();
        Object.keys(projectData).forEach((key) => {
          if (key === "images") {
            projectData[key].forEach((file: File) =>
              formData.append("images", file),
            );
          } else if (typeof projectData[key] === "object") {
            formData.append(key, JSON.stringify(projectData[key]));
          } else {
            formData.append(key, projectData[key]);
          }
        });
        return {
          url: "/v1/projects",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["Project"],
    }),
    updateProject: builder.mutation({
      query: ({ id, ...update }) => ({
        url: `/v1/projects/${id}`,
        method: "PUT",
        body: update,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Project", id },
        "Project",
      ],
    }),
    deleteProject: builder.mutation({
      query: (id) => ({
        url: `/v1/projects/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Project"],
    }),
  }),
});

export const {
  useGetProjectsQuery,
  useGetProjectByIdQuery,
  useGetProjectBySlugQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
} = projectsApi;

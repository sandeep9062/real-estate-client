import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "./api";

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

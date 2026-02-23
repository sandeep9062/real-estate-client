import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "./api";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["User"],
  endpoints: (builder) => ({
    // Login with email/password
    login: builder.mutation<{
      success: boolean;
      message: string;
      user: any;
    }, {
      email: string;
      password: string;
    }>({
      query: (credentials) => ({
        url: "auth/login",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["User"],
    }),
    
    // Register new user
    register: builder.mutation<{
      success: boolean;
      message: string;
      user: any;
    }, {
      name: string;
      email: string;
      password: string;
      phone?: string;
    }>({
      query: (userInfo) => ({
        url: "auth/register",
        method: "POST",
        body: userInfo,
      }),
      invalidatesTags: ["User"],
    }),
    
    // Google OAuth login
    googleAuth: builder.mutation<{
      success: boolean;
      message: string;
      user: any;
    }, {
      idToken: string;
    }>({
      query: ({ idToken }) => ({
        url: "auth/google",
        method: "POST",
        body: { idToken },
      }),
      invalidatesTags: ["User"],
    }),
    
    // Refresh access token
    refreshToken: builder.mutation<{
      success: boolean;
      message: string;
      user: any;
    }, void>({
      query: () => ({
        url: "auth/refresh",
        method: "POST",
      }),
      invalidatesTags: ["User"],
    }),
    
    // Logout (single device)
    logout: builder.mutation<{
      success: boolean;
      message: string;
    }, void>({
      query: () => ({
        url: "auth/logout",
        method: "POST",
      }),
      invalidatesTags: ["User"],
    }),
    
    // Logout from all devices
    logoutAll: builder.mutation<{
      success: boolean;
      message: string;
    }, void>({
      query: () => ({
        url: "auth/logout-all",
        method: "POST",
      }),
      invalidatesTags: ["User"],
    }),
    
    // Get current user
    getCurrentUser: builder.query<{
      success: boolean;
      user: any;
    }, void>({
      query: () => "auth/me",
      providesTags: ["User"],
    }),
    
    // Forgot password
    forgotPassword: builder.mutation<{
      success: boolean;
      message: string;
    }, {
      email: string;
    }>({
      query: ({ email }) => ({
        url: "auth/forgot-password",
        method: "POST",
        body: { email },
      }),
    }),
    
    // Reset password
    resetPassword: builder.mutation<{
      success: boolean;
      message: string;
    }, {
      token: string;
      password: string;
    }>({
      query: ({ token, password }) => ({
        url: "auth/reset-password",
        method: "POST",
        body: { token, password },
      }),
    }),
    
    // Change password (authenticated)
    changePassword: builder.mutation<{
      message: string;
    }, {
      currentPassword: string;
      newPassword: string;
    }>({
      query: ({ currentPassword, newPassword }) => ({
        url: "auth/change-password",
        method: "POST",
        body: { currentPassword, newPassword },
      }),
    }),
    
    // Update profile (authenticated)
    updateProfile: builder.mutation<{
      message: string;
      user: any;
    }, {
      name?: string;
      phone?: string;
      image?: string;
    }>({
      query: (data) => ({
        url: "auth/profile",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGoogleAuthMutation,
  useRefreshTokenMutation,
  useLogoutMutation,
  useLogoutAllMutation,
  useGetCurrentUserQuery,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useChangePasswordMutation,
  useUpdateProfileMutation,
} = authApi;
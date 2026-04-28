import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { BaseQueryFn } from "@reduxjs/toolkit/query";
import type { FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query";

/**
 * 1. CLEANED UP URL DETECTION
 * We remove the hardcoded domain check. You should set NEXT_PUBLIC_API_URL
 * in your production environment (Render/Vercel) to "https://api.propertybulbul.com/api".
 */
const getApiBaseUrl = () => {
  return process.env.NEXT_PUBLIC_API_URL || "http://localhost:9000/api";
};

const baseQuery = fetchBaseQuery({
  baseUrl: getApiBaseUrl(),
  credentials: "include", // Essential for sending HttpOnly Cookies
  prepareHeaders: (headers) => {
    headers.set("Accept", "application/json");
    return headers;
  },
});

export const baseQueryWithAuth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  // 2. TOKEN REFRESH LOGIC
  if (result.error && result.error.status === 401) {
    // Check if the current request is ALREADY the refresh call to prevent infinite loops
    const isRefreshCall =
      typeof args === "object" && args.url === "/auth/refresh";

    if (!isRefreshCall) {
      console.log("Access token expired. Trying refresh...");

      const refreshResult = await baseQuery(
        { url: "/auth/refresh", method: "POST" },
        api,
        extraOptions,
      );

      if (refreshResult.data) {
        console.log(
          "Token refreshed successfully. Retrying original request...",
        );
        // Retry the original request
        result = await baseQuery(args, api, extraOptions);
      } else {
        console.log("Refresh failed. Redirecting to login...");

        // Clear local auth state
        api.dispatch({ type: "auth/logout" });

        if (typeof window !== "undefined") {
          // Use replace so they can't 'Back' button into a broken state
          window.location.replace("/login");
        }
      }
    }
  }

  return result;
};

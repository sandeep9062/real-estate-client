import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { BaseQueryFn } from "@reduxjs/toolkit/query";
import type { FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query";

// Dynamic API URL detection
const getApiBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }

  if (typeof window !== "undefined") {
    const hostname = window.location.hostname;

    if (
      hostname === "www.propertybulbul.com" ||
      hostname === "propertybulbul.com"
    ) {
      return "https://api.propertybulbul.com/api";
    }
  }

  return "http://localhost:9000/api";
};

// Base query (original)
const baseQuery = fetchBaseQuery({
  baseUrl: getApiBaseUrl(),
  credentials: "include",
  prepareHeaders: (headers) => {
    headers.set("Accept", "application/json");
    return headers;
  },
});

// 🔥 ADD THIS WRAPPER
export const baseQueryWithAuth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  // If access token expired
  if (result.error && result.error.status === 401) {
    console.log("Access token expired. Trying refresh...");

    // Try to refresh token
    const refreshResult = await baseQuery(
      { url: "/auth/refresh", method: "POST" },
      api,
      extraOptions,
    );

    if (refreshResult.data) {
      console.log("Token refreshed successfully");

      // Retry original request
      result = await baseQuery(args, api, extraOptions);
    } else {
      console.log("Refresh failed. Logging out...");

      api.dispatch({ type: "auth/logoutSuccess" });

      // Do not navigate to /login here. Many routes are public (e.g. /property/[id]).
      // localStorage restore can mark the user authenticated while cookies are stale;
      // GET /users/:id then returns 401 and would trap visitors on listing pages.
    }
  }

  return result;
};

"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess, logoutSuccess } from "@/store/authSlice";
import { RootState } from "@/store/store";
import { authClient } from "@/lib/auth-client";
import axios from "axios";

/**
 * Better Auth Provider Component
 * 
 * This component:
 * 1. Checks for existing Better Auth session on mount
 * 2. Syncs user data with Redux store
 * 3. Fetches additional user data from backend API
 * 
 * Authentication flow:
 * - Better Auth handles session management (cookies)
 * - Backend API provides additional user data (favorites, bookings, etc.)
 * - Redux store maintains client-side auth state
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:9000/api";

// Timeout wrapper for async operations
const withTimeout = <T,>(promise: Promise<T>, ms: number): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error("Request timeout")), ms)
    ),
  ]);
};

// Extended user type that includes custom fields from Better Auth
interface BetterAuthUserData {
  id: string;
  name: string;
  email: string;
  image?: string;
  phone?: string;
  role?: string;
  favProperties?: string[];
  bookedVisits?: string[];
  ownedProperties?: string[];
}

export function BetterAuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  useEffect(() => {
    const checkSession = async () => {
      // Skip if already authenticated
      if (isAuthenticated) {
        setIsLoading(false);
        return;
      }

      try {
        // Get session from Better Auth (uses cookies automatically)
        // Add 5 second timeout to prevent hanging
        const session = await withTimeout(authClient.getSession(), 5000);
        
        if (session?.data?.user && session?.data?.session) {
          // Cast to extended type to include custom fields from Better Auth
          const userData = session.data.user as BetterAuthUserData;
          const sessionToken = session.data.session.token;
          
          // Store session token for API calls
          if (sessionToken) {
            localStorage.setItem("sessionToken", sessionToken);
          }
          
          // Fetch full user data from backend
          // The backend can provide additional data like favorites, bookings, etc.
          try {
            const profileResponse = await axios.get(`${API_URL}/auth/me`, {
              headers: {
                Authorization: `Bearer ${sessionToken}`,
              },
              withCredentials: true, // Include cookies for Better Auth session
            });
            
            const mongoUser = profileResponse.data.user;
            
            dispatch(
              loginSuccess({
                user: {
                  _id: mongoUser._id,
                  name: mongoUser.name || userData.name,
                  email: mongoUser.email || userData.email,
                  phone: mongoUser.phone || userData.phone || "",
                  image: mongoUser.image || userData.image || undefined,
                  role: mongoUser.role || userData.role || "user",
                  favProperties: mongoUser.favProperties || [],
                  bookedVisits: mongoUser.bookedVisits || [],
                  ownedProperties: mongoUser.ownedProperties || [],
                },
                token: sessionToken,
              })
            );
          } catch (profileError) {
            // If profile fetch fails (e.g., new user not yet in DB), 
            // use Better Auth user data directly
            console.warn("Could not fetch profile from backend, using Better Auth data:", profileError);
            
            dispatch(
              loginSuccess({
                user: {
                  _id: userData.id,
                  name: userData.name,
                  email: userData.email,
                  phone: userData.phone || "",
                  image: userData.image || undefined,
                  role: userData.role || "user",
                  favProperties: userData.favProperties || [],
                  bookedVisits: userData.bookedVisits || [],
                  ownedProperties: userData.ownedProperties || [],
                },
                token: sessionToken,
              })
            );
          }
        }
      } catch (error) {
        // Handle errors silently - user is not authenticated
        if (error instanceof Error) {
          if (error.message === "Request timeout") {
            console.warn("Auth session check timed out - server may be slow or unavailable");
          } else if (error.message === "Failed to fetch") {
            console.warn("Auth server unavailable - running in unauthenticated mode");
          } else {
            // Don't log 401 errors - they're expected for unauthenticated users
            const axiosError = error as any;
            if (axiosError?.response?.status !== 401) {
              console.error("Session check error:", error);
            }
          }
        }
        localStorage.removeItem("sessionToken");
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, [dispatch, isAuthenticated]);

  // Listen for sign out events
  useEffect(() => {
    const handleSignOut = async () => {
      try {
        await authClient.signOut();
      } catch (error) {
        console.error("Sign out error:", error);
      }
      localStorage.removeItem("sessionToken");
      dispatch(logoutSuccess());
    };

    // Expose sign out handler globally
    (window as any).signOut = handleSignOut;
    
    return () => {
      delete (window as any).signOut;
    };
  }, [dispatch]);

  if (isLoading) {
    return <>{children}</>; // Don't block rendering while checking auth
  }

  return <>{children}</>;
}
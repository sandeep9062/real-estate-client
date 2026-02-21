"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess, logoutSuccess } from "@/store/authSlice";
import { RootState } from "@/store/store";
import { authClient } from "@/lib/auth-client";
import axios from "axios";

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
        const session = await authClient.getSession();
        
        if (session?.data?.user && session?.data?.session) {
          const userData = session.data.user as any;
          const sessionToken = session.data.session.token;
          
          // Store the session token for API calls
          if (sessionToken) {
            localStorage.setItem("sessionToken", sessionToken);
          }
          
          // Fetch the MongoDB user from the backend using the session token
          try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:9000/api";
            const profileResponse = await axios.get(`${API_URL}/users/profile`, {
              headers: {
                Authorization: `Bearer ${sessionToken}`,
              },
            });
            
            // Use the MongoDB user data from the backend
            const mongoUser = profileResponse.data.user;
            
            dispatch(
              loginSuccess({
                user: {
                  _id: mongoUser._id, // MongoDB ObjectId
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
            // If profile fetch fails, use Better Auth user data
            // This might happen for new users before sync
            console.warn("Could not fetch MongoDB profile, using Better Auth data:", profileError);
            dispatch(
              loginSuccess({
                user: {
                  _id: userData.id, // Better Auth ID (fallback)
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
        // Silently handle network errors (backend not running, CORS issues, etc.)
        // This is expected when the backend is unavailable
        if (error instanceof TypeError && error.message === "Failed to fetch") {
          console.warn("Auth server unavailable - running in unauthenticated mode");
        } else {
          console.error("Session check error:", error);
        }
        // Clear any stale session data
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

    // Expose sign out handler globally if needed
    (window as any).signOut = handleSignOut;
    
    return () => {
      delete (window as any).signOut;
    };
  }, [dispatch]);

  if (isLoading) {
    return null; // Or a loading spinner
  }

  return <>{children}</>;
}
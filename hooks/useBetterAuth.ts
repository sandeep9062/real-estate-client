"use client";

import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { toast } from "./use-toast";
import { authClient } from "@/lib/auth-client";
import { loginSuccess, logoutSuccess, setUser } from "@/store/authSlice";
import { RootState } from "@/store/store";

export interface BetterAuthUser {
  id: string;
  email: string;
  name: string;
  image?: string;
  phone?: string;
  role?: string;
  isActive?: boolean;
  favProperties?: any[];
  bookedVisits?: any[];
  ownedProperties?: any[];
}

export const useBetterAuth = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user, isAuthenticated, token } = useSelector((state: RootState) => state.auth);

  // Check session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const session = await authClient.getSession();
        if (session?.data?.user && session?.data?.session) {
          const userData = session.data.user as any;
          const authUser: BetterAuthUser = {
            id: userData.id,
            email: userData.email,
            name: userData.name,
            image: userData.image || undefined,
            phone: userData.phone,
            role: userData.role || "user",
            isActive: userData.isActive,
            favProperties: userData.favProperties || [],
            bookedVisits: userData.bookedVisits || [],
            ownedProperties: userData.ownedProperties || [],
          };
          
          dispatch(
            loginSuccess({
              user: authUser as any,
              token: session.data.session.token,
            })
          );
        }
      } catch (error) {
        console.error("Session check error:", error);
      }
    };

    // Only check session if not already authenticated
    if (!isAuthenticated) {
      checkSession();
    }
  }, [dispatch, isAuthenticated]);

  // Sign up with email and password
  const signUpWithEmail = useCallback(
    async (data: {
      email: string;
      password: string;
      name: string;
      phone?: string;
      role?: string;
    }) => {
      try {
        const result = await authClient.signUp.email({
          email: data.email,
          password: data.password,
          name: data.name,
        });

        if (result.error) {
          toast.error(result.error.message || "Sign up failed");
          return { success: false, error: result.error };
        }

        if (result.data) {
          const userData = result.data.user as any;
          const authUser: BetterAuthUser = {
            id: userData.id,
            email: userData.email,
            name: userData.name,
            image: userData.image || undefined,
            phone: data.phone,
            role: data.role || "user",
            isActive: true,
            favProperties: [],
            bookedVisits: [],
            ownedProperties: [],
          };

          dispatch(
            loginSuccess({
              user: authUser as any,
              token: result.data.token || "",
            })
          );

          toast.success("Account created successfully!");
          return { success: true, user: authUser };
        }

        return { success: false, error: "Unknown error" };
      } catch (error: any) {
        toast.error(error.message || "Sign up failed");
        return { success: false, error };
      }
    },
    [dispatch]
  );

  // Sign in with email and password
  const signInWithEmail = useCallback(
    async (data: { email: string; password: string }) => {
      try {
        const result = await authClient.signIn.email({
          email: data.email,
          password: data.password,
        });

        if (result.error) {
          toast.error(result.error.message || "Login failed");
          return { success: false, error: result.error };
        }

        if (result.data) {
          const userData = result.data.user as any;
          const authUser: BetterAuthUser = {
            id: userData.id,
            email: userData.email,
            name: userData.name,
            image: userData.image || undefined,
            phone: userData.phone,
            role: userData.role || "user",
            isActive: userData.isActive,
            favProperties: userData.favProperties || [],
            bookedVisits: userData.bookedVisits || [],
            ownedProperties: userData.ownedProperties || [],
          };

          dispatch(
            loginSuccess({
              user: authUser as any,
              token: result.data.token || "",
            })
          );

          toast.success("Login successful!");
          return { success: true, user: authUser };
        }

        return { success: false, error: "Unknown error" };
      } catch (error: any) {
        toast.error(error.message || "Login failed");
        return { success: false, error };
      }
    },
    [dispatch]
  );

  // Sign in with Google
  const signInWithGoogle = useCallback(async () => {
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
      });
      
      return { success: true };
    } catch (error: any) {
      toast.error(error.message || "Google sign in failed");
      return { success: false, error };
    }
  }, []);

  // Sign out
  const signOutUser = useCallback(async () => {
    try {
      await authClient.signOut();
      dispatch(logoutSuccess());
      toast.success("Logged out successfully");
      router.push("/");
      return { success: true };
    } catch (error: any) {
      toast.error(error.message || "Logout failed");
      return { success: false, error };
    }
  }, [dispatch, router]);

  // Update user data in store
  const updateUserData = useCallback(
    (userData: Partial<BetterAuthUser>) => {
      if (user) {
        dispatch(
          setUser({
            user: { ...user, ...userData } as any,
            token: token || "",
          })
        );
      }
    },
    [dispatch, user, token]
  );

  return {
    user,
    isAuthenticated,
    token,
    signUpWithEmail,
    signInWithEmail,
    signInWithGoogle,
    signOutUser,
    updateUserData,
  };
};

export default useBetterAuth;
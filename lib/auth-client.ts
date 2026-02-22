import { createAuthClient } from "better-auth/react";

/**
 * Better Auth Client Configuration
 * 
 * This client connects to the Better Auth server running on the backend.
 * All authentication logic is handled by the backend at /api/better-auth
 * 
 * Available endpoints on backend:
 * - POST /api/better-auth/sign-up/email - Create new account
 * - POST /api/better-auth/sign-in/email - Sign in with email/password
 * - POST /api/better-auth/sign-out - Sign out
 * - GET /api/better-auth/session - Get current session
 * - GET /api/better-auth/sign-in/social - Social login (Google)
 * - POST /api/better-auth/forgot-password - Request password reset
 * - POST /api/better-auth/reset-password - Reset password
 */

// The API URL should point to the backend server
const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:9000/api";

export const authClient = createAuthClient({
  baseURL: `${apiBaseUrl}/better-auth`,
  // Enable cross-site cookies for production
  cookieOptions: {
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    secure: process.env.NODE_ENV === "production",
  },
});

// Export hooks for easier usage
export const {
  signIn,
  signUp,
  signOut,
  useSession,
} = authClient;

// Export types for TypeScript
export type Session = {
  id: string;
  userId: string;
  expiresAt: Date;
  token: string;
  createdAt: Date;
  updatedAt: Date;
  ipAddress?: string;
  userAgent?: string;
};

export type User = {
  id: string;
  email: string;
  emailVerified: boolean;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  image?: string;
  phone?: string;
  role?: string;
  isActive?: boolean;
  favProperties?: string[];
  bookedVisits?: string[];
  ownedProperties?: string[];
};
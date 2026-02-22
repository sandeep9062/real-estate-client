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

// Dynamic API URL detection for production vs development
const getApiBaseUrl = () => {
  // First priority: Environment variable
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  
  // Second priority: Detect production environment
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    
    // If on production domain, use Render backend URL
    if (hostname === 'www.propertybulbul.com' || hostname === 'propertybulbul.com') {
      return 'https://real-estate-server-6pzl.onrender.com/api';
    }
  }
  
  // Default: localhost for development
  return "http://localhost:9000/api";
};

const apiBaseUrl = getApiBaseUrl();

export const authClient = createAuthClient({
  baseURL: `${apiBaseUrl}/better-auth`,
  // Enable cross-origin cookie support for production
  fetchOptions: {
    credentials: 'include',
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
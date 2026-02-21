import { createAuthClient } from "better-auth/react";

// Better-auth client pointing to the backend API
// The backend has the database adapter configured for user persistence
const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:9000/api";
export const authClient = createAuthClient({
  baseURL: `${apiBaseUrl}/better-auth`,
});

// Export hooks for easier usage
export const {
  signIn,
  signUp,
  signOut,
  useSession,
} = authClient;

// Export types
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
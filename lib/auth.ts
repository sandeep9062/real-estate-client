import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";

export const auth = betterAuth({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:3000/api/auth",
  
  emailAndPassword: {
    enabled: true,
    requireEmailVerification:true,
  },
  
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day (update session every day)
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5, // 5 minutes
    },
  },
  
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["google", "email-password"],
    },
  },
  
  socialProviders: {
    google: {
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      enabled: !!(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
    },
  },
  
  user: {
    additionalFields: {
      phone: {
        type: "string",
        required: false,
      },
      role: {
        type: "string",
        required: false,
        defaultValue: "user",
      },
      isActive: {
        type: "boolean",
        required: false,
        defaultValue: true,
      },
      image: {
        type: "string",
        required: false,
      },
    },
  },
  
  secret: process.env.BETTER_AUTH_SECRET || process.env.NEXTAUTH_SECRET || "your-secret-key-here",
  
  trustedOrigins: [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:9000",
    "https://www.propertybulbul.com",
    "https://propertybulbul.com",
  ],
  
  plugins: [nextCookies()],
});

export default auth;
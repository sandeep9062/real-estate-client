import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Dynamic API URL detection for production vs development
const getApiBaseUrl = () => {
  // First priority: Environment variable
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  
  // Second priority: Detect production environment (client-side only)
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    
    // If on production domain, use production API URL
    if (hostname === 'www.propertybulbul.com' || hostname === 'propertybulbul.com') {
      return 'https://api.propertybulbul.com/api';
    }
  }
  
  // Default: localhost for development
  return 'http://localhost:9000/api';
};

// Create our baseQuery instance
// Authentication is handled via HTTP-only cookies (accessToken and refreshToken)
// No need to manually add Authorization header - cookies are sent automatically
export const baseQueryWithAuth = fetchBaseQuery({
  baseUrl: getApiBaseUrl(),
  credentials: 'include', // Include cookies for authentication
  prepareHeaders: (headers) => {
    // Set content type for JSON requests
    headers.set('Accept', 'application/json');
    return headers;
  },
});
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../store/store';

// Dynamic API URL detection for production vs development
const getApiBaseUrl = () => {
  // First priority: Environment variable
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  
  // Second priority: Detect production environment (client-side only)
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    
    // If on production domain, use Render backend URL
    if (hostname === 'www.propertybulbul.com' || hostname === 'propertybulbul.com') {
      return 'https://real-estate-server-6pzl.onrender.com/api';
    }
  }
  
  // Default: localhost for development
  return 'http://localhost:9000/api';
};

// Create our baseQuery instance
const baseQuery = fetchBaseQuery({
  baseUrl: getApiBaseUrl(),
  credentials: 'include', // Include cookies for better-auth session
  prepareHeaders: (headers, { getState }) => {
    // By default, if we have a token in the store, let's use that for authenticated requests
    const token = (getState() as RootState).auth.token;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

export const baseQueryWithAuth = baseQuery;

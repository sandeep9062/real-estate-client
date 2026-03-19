import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "./api";

// Types for chatbot messages
export interface ChatMessage {
  sender: "user" | "bot";
  text: string;
}

export interface ChatRequest {
  sessionId: string;
  message: string;
}

export interface ChatResponse {
  reply: string;
  sessionId?: string;
}

// Create the chatbot API using RTK Query
export const chatBotApi = createApi({
  reducerPath: "chatBotApi",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["Chat"],
  endpoints: (builder) => ({
    sendMessage: builder.mutation<ChatResponse, ChatRequest>({
      query: (chatRequest) => ({
        url: "chatbot",
        method: "POST",
        body: chatRequest,
      }),
    }),
    // Optional: Add endpoint for chat history if needed
    getChatHistory: builder.query<ChatMessage[], string>({
      query: (sessionId) => `chatbot/history/${sessionId}`,
      providesTags: ["Chat"],
    }),
    // Optional: Add endpoint to clear chat session
    clearChatSession: builder.mutation<void, string>({
      query: (sessionId) => ({
        url: `chatbot/clear/${sessionId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Chat"],
    }),
  }),
});

// Export hooks for easy usage in components
export const { 
  useSendMessageMutation, 
  useGetChatHistoryQuery, 
  useClearChatSessionMutation 
} = chatBotApi;

// Simple function for direct usage (compatible with current ChatBotWidget.tsx)
export const sendChatMessage = async (
  sessionId: string, 
  message: string
): Promise<ChatResponse> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chatbot`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sessionId, message }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

// Utility function to generate a new session ID
export const generateSessionId = (): string => {
  return `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Utility function to format bot responses (can be extended)
export const formatBotResponse = (response: string): string => {
  // Add any formatting logic here (e.g., markdown parsing, emoji handling, etc.)
  return response.trim();
};

// Default bot messages
export const BOT_MESSAGES = {
  GREETING: "👋 Hello! I'm your property assistant. How can I help you find your dream home today?",
  CLEAR_GREETING: "👋 Hello! I'm your friendly property assistant. How can I help you find your dream home today?",
  ERROR: "Sorry, I'm having trouble connecting right now. Please try again in a moment.",
  TYPING: "Typing...",
};

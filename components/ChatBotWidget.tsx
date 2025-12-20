"use client";

import { useState, useRef, useEffect } from "react";
import { sendChatMessage, generateSessionId, BOT_MESSAGES, ChatMessage } from "../services/chatBotApi";

export default function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: "bot",
      text: BOT_MESSAGES.GREETING,
    },
  ]);
  const [input, setInput] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && !sessionId) {
      setSessionId(generateSessionId());
    }
  }, [open, sessionId]);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  async function sendMessage() {
    if (!input.trim()) return;

    const userMessage: ChatMessage = { sender: "user", text: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setIsTyping(true);
    setError(null);

    try {
      const data = await sendChatMessage(sessionId, input);
      setTimeout(() => {
        const botMessage: ChatMessage = { sender: "bot", text: data.reply };
        setMessages((prev) => [...prev, botMessage]);
        setIsTyping(false);
      }, 1000);
    } catch (err) {
      setTimeout(() => {
        const errorMessage: ChatMessage = { sender: "bot", text: BOT_MESSAGES.ERROR };
        setMessages((prev) => [...prev, errorMessage]);
        setIsTyping(false);
        setError("Failed to send message. Please try again.");
      }, 1000);
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") sendMessage();
  };

  const clearChat = () => {
    setSessionId(generateSessionId());
    setMessages([
      {
        sender: "bot",
        text: BOT_MESSAGES.CLEAR_GREETING,
      },
    ]);
    setError(null);
  };

  return (
    <div className="fixed bottom-18 right-5  md:bottom-4 md:right-22 z-50">
      {/* Chat Window */}
      <div
        className={`transition-all duration-300 ease-in-out ${
          open ? "w-[88vw] sm:w-[380px] h-[50vh] sm:h-[420px]" : "w-0 h-0"
        }`}
      >
        {open && (
          <div className="w-full h-full bg-white shadow-2xl rounded-2xl flex flex-col border border-gray-200">
            {/* Header */}
            <div className="flex justify-between items-center px-4 py-3 bg-[#4161df] text-white rounded-t-2xl">
              <h3 className="font-semibold text-base sm:text-lg">
                Property Assistant
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={clearChat}
                  className="p-1 rounded-lg hover:bg-[#193fd4] text-xs sm:text-sm"
                >
                  Clear
                </button>
                <button
                  onClick={() => setOpen(false)}
                  className="p-1 hover:bg-[#193fd4] rounded-full text-lg"
                >
                  ✖
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 px-3 py-3 overflow-y-auto bg-gray-50 space-y-3">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex ${
                    m.sender === "bot" ? "justify-start" : "justify-end"
                  }`}
                >
                  <div
                    className={`px-4 py-2 rounded-xl max-w-[80%] text-sm shadow-sm ${
                      m.sender === "bot"
                        ? "bg-white text-gray-800 border border-gray-200"
                        : "bg-[#4161df] text-white"
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="px-4 py-2 rounded-xl max-w-[70%] text-sm shadow-sm bg-white text-gray-800 border border-gray-200">
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-150"></div>
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-300"></div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={chatEndRef}></div>
            </div>

            {/* Input Area */}
            <div className="p-3 bg-white border-t flex items-center gap-2">
              <input
                className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-[#4161df] outline-none"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
              />
              <button
                onClick={sendMessage}
                className="bg-[#4161df] text-white px-4 py-2 rounded-full hover:bg-[#3759dd] text-sm"
              >
                Send
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Floating Button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 bg-[#4161df] hover:bg-[#3759dd] text-white  py-2.5 px-2.5 md:px-5 rounded-full shadow-lg transition-all text-sm sm:text-base"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 sm:h-6 sm:w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 
              4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 
              20l1.395-3.72C3.512 15.042 3 
              13.574 3 12c0-4.418 4.03-8 
              9-8s9 3.582 9 8z"
            />
          </svg>
          <h2 className="hidden sm:block">Chat With Us</h2>
        </button>
      )}
    </div>
  );
}
